const prisma = require("../config/prismaClient");
const geoip = require('geoip-lite');
const iso3311a2 = require('iso-3166-1-alpha-2');
var countries = require("i18n-iso-countries");
const UAParser = require('ua-parser-js');

exports.trackVisitorData = async (req, res) => {
  const { url, uniqueVisitorId } = req.body;
  try {
    const urlRecord = await prisma.url.findFirst({
      where: { baseUrl: url },
    });

    if (!urlRecord) {
      return res.status(404).json({ success: false, error: 'URL not found' });
    }

    const userId = urlRecord.creatorId;
    const ipAddress = await getClientIp(req);
    const country = await getCountry(ipAddress);
    const userAgentString = req.headers['user-agent'];
    await handleDeviceType(userAgentString, userId)
    const existingVisit = await prisma.visit.findFirst({
      where: {
        urlId: urlRecord.id,
      },
      include: {
        country: true,
        visitor: true,
      },
    });

    if (existingVisit) {
      const existingVisitor = await prisma.visitor.findFirst({
        where: {
          uniqueVisitorId: uniqueVisitorId,
        },
      });
      let returningVisitor = existingVisit.returningVisitor;

      const existingCountry = await prisma.country.findFirst({
        where:{
          name: country,
        }
      })

      if(existingVisitor){
        const updatedVisit = await handleExistingVisitor(existingVisit, urlRecord, country, returningVisitor, uniqueVisitorId)
        return res.status(200).json({ 
          success: true, 
          message: "existing visitor", 
          data:updatedVisit
        });
      } else{
        const newVisit = await handleNewVisitor(existingCountry, existingVisit, urlRecord, country, returningVisitor, uniqueVisitorId)
        return res.status(200).json({ 
          success: true, 
          message: "new visitor", 
          data:newVisit
        });
      }
    } else {
      const firstVisit = await handleFirstVisit(urlRecord, country, uniqueVisitorId);
      return res.status(200).json({ 
        success: true, 
        message: "first visit", 
        data:firstVisit
      });
    }
  } catch (error) {
    console.error('Error recording visit:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to record visit' 
    });
  }
};


const handleFirstVisit = async (urlRecord, country, uniqueVisitorId) => {
  try {
    const newVisit = await prisma.visit.create({
      data: {
        totalClicks: 1,
        returningVisitor: 0,
        urlId: urlRecord.id,
      }
    });
    await prisma.country.create({
      data: {
        name: country,
        count: 1,
        visit: { connect: { id: newVisit.id } },
      },
    })

    await prisma.visitor.create({
      data: {
        uniqueVisitorId: uniqueVisitorId,
        visit: { connect: { id: newVisit.id } },
      },
    });

    return newVisit;
  } catch (error) {
    console.error('Error creating new visit and visitor:', error);
    throw error;
  }
};

const handleNewVisitor = async (existingCountry, existingVisit, urlRecord, country, returningVisitor, uniqueVisitorId) => {
  try {
    if (existingCountry) {
      await prisma.country.update({
        where: { id: existingCountry.id },
        data: { count: { increment: 1 } }
      });
    } else {
      const newCountry = await prisma.country.create({
        data: {
          name: country,
          count: 1,
          visit: { connect: { id: existingVisit.id } },
        }
      });
      existingVisit.country.push(newCountry);
    }

     const visitor = await prisma.visitor.create({
      data:{
        uniqueVisitorId: uniqueVisitorId,
        visit: { connect: { id: existingVisit.id } },
      }
     })
    
    const newVisit = await prisma.visit.update({
      where: { id: existingVisit.id },
      data: {
        totalClicks: { increment: 1 },
        returningVisitor: returningVisitor,
        urlId: urlRecord.id,
        country: {
          connect: existingVisit.country.map(c => ({ id: c.id })),
        },
        visitor: {
            connect: existingVisit.visitor.map(v => ({ id: v.id })),
          },
      },
    });

    return newVisit;
  } catch (error) {
    console.error('Error handling new visitor:', error);
    throw error;
  }
};

const handleExistingVisitor = async (existingVisit, urlRecord, country, returningVisitor, uniqueVisitorId) => {
  try {
    const visitor = await prisma.visitor.findFirst({
      where:{
        uniqueVisitorId: uniqueVisitorId
      }
    })
    if(visitor.isReturningVisitor === false){
      returningVisitor = returningVisitor + 1;
      await prisma.visitor.update({
        where:{
          id: visitor.id
        },
        data:{
          isReturningVisitor: true,
        }
      })
    }
    const updatedVisit = await prisma.visit.update({
      where: { id: existingVisit.id },
      data: {
        totalClicks: { increment: 1 },
        returningVisitor: returningVisitor,
        urlId: urlRecord.id,
      },
    });

    return updatedVisit;
  } catch (error) {
    console.error('Error handling existing visitor:', error);
    throw error;
  }
};

const handleDeviceType = async (userAgentString, userId) => {
  try {
    let deviceType = 'unknown';
    const parser = new UAParser(userAgentString);
    const result = parser.getResult();
    if (result.device.type === 'ebook') {
      deviceType = 'eReader';
    } else if (result.device.type === 'mobile') {
      deviceType =  'mobile';
    } else if (result.device.type === 'tablet') {
      deviceType =  'tablet';
    } else if (result.device.type === 'smarttv' || result.device.type === 'wearable') {
      deviceType =  'unknown';
    } else {
      deviceType = 'desktop';
    }
    
    const existingDevice = await prisma.device.findUnique({
      where: {
        userId: userId,
      },
    });

    let dataToUpdateOrCreate = {};

    if (existingDevice) {
      dataToUpdateOrCreate = {
        [deviceType]: {
          increment: 1
        }
      };
    } else {
      dataToUpdateOrCreate = {
        userId: userId,
        [deviceType]: 1
      };
    }

    if (existingDevice) {
      await prisma.device.update({
        where: {
          userId: userId,
        },
        data: dataToUpdateOrCreate,
      });
    } else {
      await prisma.device.create({
        data: dataToUpdateOrCreate,
      });
    }
  } catch (error) {
    console.error('Error handling device type:', error);
    throw error;
  }
};

const getCountry = async (ipAddress) => {
  const geo = geoip.lookup(ipAddress);
  console.log("ip", ipAddress)
  let country = "Unknown";
  if (geo) {
    country = iso3311a2.getCountry(geo.country);
  }
  console.log("country", country)
  return country;
}

const getClientIp = (req) => {
  const forwardedForIp = req.headers['x-forwarded-for'];
  if (forwardedForIp) {
    return forwardedForIp.split(',')[0];
  }
  return req.connection.remoteAddress;
};



exports.getDeviceAnalyticsForUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const userDevices = await prisma.device.findUnique({
      where: {
        userId: parseInt(userId), 
      },
    });

    if (!userDevices) {
      return res.status(404).json({ 
        error: 'Device data not found for the user' 
      });
    }

    const totalClicks = (userDevices.mobile || 0) + 
                        (userDevices.tablet || 0) + 
                        (userDevices.desktop || 0) + 
                        (userDevices.eReader || 0) + 
                        (userDevices.unknown || 0);

    return res.status(200).json({ 
      success: true, 
      data: userDevices,
      totalClicks: totalClicks
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports.getTotalDeviceAnalytics = async (req, res) => {
  try {
    const devices = await prisma.device.findMany();

    if (!devices || devices.length === 0) {
      return res.status(404).json({ 
        error: 'Device data not found in the database' 
      });
    }
    let totalMobile = 0;
    let totalTablet = 0;
    let totalDesktop = 0;
    let totalEReader = 0;
    let totalUnknown = 0;

    devices.forEach(device => {
      totalMobile += device.mobile || 0;
      totalTablet += device.tablet || 0;
      totalDesktop += device.desktop || 0;
      totalEReader += device.eReader || 0;
      totalUnknown += device.unknown || 0;
    });

    const totals = {
      mobile: totalMobile,
      tablet: totalTablet,
      desktop: totalDesktop,
      eReader: totalEReader,
      unknown: totalUnknown
    };

    const totalClicks = totalMobile + totalTablet + totalDesktop + totalEReader + totalUnknown;
    return res.status(200).json({ 
      success: true, 
      totalClicks: totalClicks,
      data: totals 
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports.getCountryAnalyticsForUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const userUrls = await prisma.url.findMany({
      where: {
        creatorId: userId,
      },
      select: {
        id: true,
      },
    });

    const urlIds = userUrls.map(url => url.id);
    const visits = await prisma.visit.findMany({
      where: {
        urlId: {
          in: urlIds,
        },
      },
      select: {
        id: true,
      },
    });

    const visitIds = visits.map(visit => visit.id);

    const countryCounts = await prisma.country.groupBy({
      by: ['name'],
      where: {
        visitId: {
          in: visitIds,
        },
      },
      _sum: {
        count: true,
      },
    });

    const formattedCountryCounts = {};
    countryCounts.forEach(country => {
      const countryCode = countries.getAlpha2Code(country.name, 'en');
      if (countryCode) {
        formattedCountryCounts[countryCode] = country._sum.count;
      }
    });

    return res.status(200).json({
      success:true,
      data:formattedCountryCounts,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
 
exports.getCountryAnalyticsForAdmin = async (req, res) => {
  try {
    const countryCounts = await prisma.country.groupBy({
      by: ['name'],
      _sum: {
        count: true,
      },
    });

    const formattedCountryCounts = {};
    countryCounts.forEach(country => {
      const countryCode = countries.getAlpha2Code(country.name, 'en');
      if (countryCode) {
        formattedCountryCounts[countryCode] = country._sum.count;
      }
    });

    return res.status(200).json({
      success: true,
      data: formattedCountryCounts,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};


