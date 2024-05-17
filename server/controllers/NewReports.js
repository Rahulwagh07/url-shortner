const { Queue, Worker } = require('bullmq');
const json2csv = require('json2csv').Parser;
const fs = require('fs');
const path = require('path');
const Redis = require('ioredis');
const prisma = require("../config/prismaClient");
const { URL } = require('url');

const redisUrl = new URL(process.env.REDIS_URL);
const redisOptions = {
  host: redisUrl.hostname,
  port: redisUrl.port,
  username: redisUrl.username,
  password: redisUrl.password,
  tls: {
    rejectUnauthorized: false,
  },
  maxRetriesPerRequest: null, 
};

const redis = new Redis(redisOptions);
const reportQueue = new Queue('myqueue', { connection: redis });

const worker = new Worker("myqueue", async (job) => {
  const userId = job.data.userId;
  const urlIds = job.data.urlIds;
  console.log("job processing of userid", userId);
  console.log("urlIds", urlIds);
  try {
    const globalVariables = await prisma.global.findFirst();
    const reportExpirationDays = globalVariables.reportExpirationDays;

    const urls = await prisma.url.findMany({
      where: {
        creatorId: userId,
        id: {
          in: urlIds,
        },
      },
      select: {
        baseUrl: true,
        urlName: true,
        shortUrl: true,
        tier: true,
      },
    });

    const fields = ['baseUrl', 'urlName', 'shortUrl', 'tier'];
    const json2csvParser = new json2csv({ fields });
    const csv = json2csvParser.parse(urls);
    const timestamp = Date.now();
    const fileName = `report_${userId}_${timestamp}.csv`;

    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    const filePath = path.join(uploadDir, fileName);
    const reportUrl = `/uploads/${fileName}`
    console.log("reporturl", reportUrl)
    fs.writeFileSync(filePath, csv);
    console.log(`Report generated for user ${userId}. File saved at: ${filePath}`);
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + reportExpirationDays);

    await prisma.report.upsert({
      where: { userId: userId },
      update: {
        reportUrl: reportUrl,
        reportGenerated: true,
        expiryDate: expiryDate,
      },
      create: {
        userId: userId,
        reportUrl: reportUrl,
        reportGenerated: true,
        expiryDate: expiryDate,
      },
    });

    console.log(`Report entry created for user ${userId}.`);
  } catch (error) {
    console.error(`Error processing report generation job for user ${userId}:`, error);
  }
}, { connection: redis });



exports.initiateReportGeneration = async (req, res) => {
  try {
    const userId = req.user.id;
    const { urlIds } = req.body;
    if(!urlIds){
      return res.status(201).json({
        success: false,
        message: "missing urlIds"
      })
    }
    await reportQueue.add('report-job', { userId, urlIds});
    return res.status(200).json({ 
      success: true,
      message: 'Report generation process initiated' 
    });
  } catch (error) {
    console.error('Error initiating report generation:', error);
    return res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
}

exports.getReport = async (req, res) => {
  try {
    const userId = req.user.id;
    const report = await prisma.report.findUnique({
      where:{
        userId: parseInt(userId)
      }
    });
    const globalVariables = await prisma.global.findFirst();
    if(!report){
      return res.status(200).json({
        success:true,
        message:"Report is not found, globalvariables fetched",
        globalVariables:globalVariables,
      })
    }  else{
      return res.status(200).json({
        success:true,
        message:"Report fetched",
        report:report,
        globalVariables:globalVariables,
      })
    }
  } catch (error) {
    console.error('Error in getting report', error);
    return res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
}
