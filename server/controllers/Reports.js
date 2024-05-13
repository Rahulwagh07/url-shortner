const prisma = require("../config/prismaClient");
const json2csv = require('json2csv').Parser;

exports.generateReport = async (req, res) => {
  try {
    const userId = req.user.id;

    const globalVariables = await prisma.global.findFirst();
    const maxReportRecords = globalVariables.maxReportRecords;

    const urls = await prisma.url.findMany({
      where: { creatorId: userId },
      select: {
        baseUrl: true,
        urlName: true,
        shortUrl: true,
        tier: true,
      },
      take: maxReportRecords - 1, 
    });

    const fields = ['baseUrl', 'urlName', 'shortUrl', 'tier'];
    const json2csvParser = new json2csv({ fields });
    const csv = json2csvParser.parse(urls);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=report.csv');

    return res.status(200).send(csv);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
