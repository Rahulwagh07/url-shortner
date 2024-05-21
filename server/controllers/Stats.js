const prisma = require('../config/prismaClient');

exports.getTotalStats = async (req, res) => {
  try{
     const activeLinkCount = await prisma.url.count({
      where: {
        status: 'active'
      }
    });
     
    const res = await prisma.stats.findFirst();
    return res.status(200).json({
      success:true,
      message:"Stats fetched",
      data:res,
      activeLinkCount: activeLinkCount,
    })

  } catch(err){
    console.log('Error in getting TotalStats');
    return res.status(500).json({
      success:false,
      message:"Internal server error",
    })
  }
}