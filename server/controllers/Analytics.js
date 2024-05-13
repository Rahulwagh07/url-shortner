const prisma = require("../config/prismaClient");

exports.trackVisitorData = async (req, res) => {
  const { url, country, uniqueVisitorId } = req.body;
  try {
    let returningVisitor = 0;
    console.log(typeof(returningVisitor))
    const urlRecord = await prisma.url.findFirst({
      where: { baseUrl: url },
    });

    if (!urlRecord) {
      return res.status(404).json({ success: false, error: 'URL not found' });
    }

    const exisitngVisit = await prisma.visit.findFirst({
      where: {
        urlId: urlRecord.id,
      },
    })
    if(exisitngVisit){
    const existingVisitor = await prisma.visitor.findFirst({
      where: {
        uniqueVisitorId: uniqueVisitorId,
      },
      include: {
        visit: true,
      },
    });
    
    if(!existingVisitor){
      returningVisitor = exisitngVisit.returningVisitor;
      let countryId;
      const existingCountry = await prisma.country.findFirst({
        where: {
          visitId : exisitngVisit.id,
          country: country,
        }
      })
      if(existingCountry){
        await prisma.country.update({
          where: {id : existingCountry.id},
          data: {
            count : { increment: 1}
          }
        })
        countryId = exisitngVisit.id;
      }
      if(!existingCountry){
        const newCountry = await prisma.country.create({
          data: {
            name: country,
            count: 1,
          }
        })
        countryId = newCountry.id
      }
      const updatedVisit = await prisma.visit.update({
        where: { id: exisitngVisit.id },
        data: {
          totalClicks: { increment: 1 },
          returningVisitor,
          urlId:urlRecord.id,
          country: countryId,
        },
      });

      await prisma.visitor.create({
        data: {
          uniqueVisitorId: uniqueVisitorId,
          visitId: updatedVisit.id,
        }
      });
      return res.status(200).json({
        success: true,
        message: "existing visitor, updated"
      })
    } else{
      console.log("Existing Visitot hai")
      returningVisitor = exisitngVisit.returningVisitor;
      if(!existingVisitor.isReturningVisitor){
        await prisma.visitor.update({
          where: {id: existingVisitor.id},
          data: {
            isReturningVisitor: true,
          }
        })
        returningVisitor = returningVisitor + 1
      }

      const updatedVisit = await prisma.visit.update({
        where: { id: exisitngVisit.id },
        data: {
          totalClicks: { increment: 1 },
          returningVisitor: returningVisitor,
          urlId:urlRecord.id,
          country: exisitngVisit.country,
          visitor: exisitngVisit.visitor,
        },
      });

      return res.status(200).json({ success: true, message:"Record saved to exisitng"});
    }
    } else {
      //first user for this base url
      const newVisit = await prisma.visit.create({
        data: {
          totalClicks: 1,
          returningVisitor: 0,
          urlId:urlRecord.id,
        }
      })
      await prisma.country.create({
        data:{
          name: country,
          count: 1,
          visitId: newVisit.id,
        }
      })
      await prisma.visitor.create({
        data: {
          uniqueVisitorId: uniqueVisitorId,
          visitId: newVisit.id,
        },
      });

      return res.status(200).json({ success: true, message: "new user data saved" });
    }
  } catch (error) {
    console.error('Error recording visit:', error);
    return res.status(500).json({ success: false, error: 'Failed to record visit' });
  }
};