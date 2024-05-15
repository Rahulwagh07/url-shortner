const prisma = require("../config/prismaClient");
const geoip = require('geoip-lite');
const iso3311a2 = require('iso-3166-1-alpha-2');
const useragent = require('useragent');

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
    const country = await getCountry(req)
    await handleDeviceType(req, userId)
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

const handleDeviceType = async (req, userId) => {
  try {
    const userAgentString = req.headers['user-agent'];
    const agent = useragent.parse(userAgentString);
    let deviceType;
    if (userAgentString.includes('kindle') || userAgentString.includes('nook') || userAgentString.includes('kobo')) {
      deviceType = 'eReader';
    } else if (agent.isMobile) {
      deviceType = 'mobile';
    } else if (agent.isDesktop) {
      deviceType = 'desktop';
    } else if (agent.isTablet) {
      deviceType = 'tablet';
    } else {
      deviceType = 'unknown';
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

const getCountry = async (req) => {
  const ipAddress = req.socket.remoteAddress;
  const geo = geoip.lookup(ipAddress);
  let country = "Us";
  if (geo) {
    country = iso3311a2.getCountry(geo.country);
  }
  
  return country;
}
 