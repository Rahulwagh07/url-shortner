const dotenv = require("dotenv");
dotenv.config();
const prisma = require("../config/prismaClient");
const { isUrl } = require('check-valid-url');

const BaseUrl = process.env.FRONTEND_BASE_URL;

exports.getAllUrlOfUser = async (req, res) => {
  try {
    const userId = req.user.id;
    if(req.user.accountType === "Admin"){
      return await getAllUrls(req, res);
    }
    const userUrls = await prisma.url.findMany({ 
      where: { creatorId: userId },
      include: {
        creator: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      }
    });
    const urlIds = userUrls.map(url => url.id);
    const visits = await prisma.visit.findMany({ 
      where: { urlId: { in: urlIds } },
      include: {
        visitor: true,
        country: true
      } 
    });
    const combinedData = userUrls.map(url => {
      const urlVisits = visits.filter(visit => visit.urlId === url.id);
      return {
        ...url,
        visits: urlVisits
      };
    });
    return res.status(200).json({ 
      success: true, 
      data: combinedData 
    });
  } catch (error) {
    console.error('Error fetching URLs:', error);
    return res.status(500).json({
      success: false, 
      message: 'Internal server error' 
    });
  }
};

const getAllUrls = async (req, res) => {
  try {
    const allUrls = await prisma.url.findMany({ 
      include: {
        creator: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      }
    });
    const urlIds = allUrls.map(url => url.id);
    const allVisits = await prisma.visit.findMany({ 
      include: {
        visitor: true,
        country: true
      } 
    });
    const combinedData = allUrls.map(url => {
      const urlVisits = allVisits.filter(visit => visit.urlId === url.id);
      return {
        ...url,
        visits: urlVisits
      };
    });
    return res.status(200).json({ 
      success: true, 
      data: combinedData 
    });
  } catch (error) {
    console.error('Error fetching URLs:', error);
    return res.status(500).json({
      success: false, 
      message: 'Internal server error' 
    });
  }
};


exports.suspendUrl = async (req, res) => {
  try {
    const { urlIds } = req.body;
    const updatedUrls = await prisma.url.updateMany({
      where: {
        id: {
          in: urlIds
        }
      },
      data: {
        status: 'suspended'
      }
    });

    if (!updatedUrls) {
      return res.status(404).json({
        success: false,
        message: 'URL not found' 
      });
    }

    return res.status(200).json({
      success: true,
      message: 'URL suspended successfully' 
    });
  } catch (error) {
    console.error('Error suspending URL:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
};

exports.activateUrl = async (req, res) => {
  try {
    const { urlIds } = req.body;
    const updatedUrls = await prisma.url.updateMany({
      where: {
        id: {
          in: urlIds
        }
      },
      data: {
        status: 'active'
      }
    });

    if (!updatedUrls) {
      return res.status(404).json({
        success: false,
        message: 'URL not found' 
      });
    }
    return res.status(200).json({
      success: true,
      message: 'URL activated successfully' 
    });
  } catch (error) {
    console.error('Error activating URL:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
};

exports.deleteUrl = async (req, res) => {
  try {
    const { urlId } = req.params;
    const url = await prisma.url.findFirst({
      where:{
        id: parseInt(urlId),
      }
    });

    if (!url) {
      return res.status(404).json({ 
        success: false,
        message: 'URL not found' 
      });
    }
    await prisma.url.delete({ where: { id: Number(urlId) } });
    return res.status(200).json({ 
      success: true,
      message: 'URL deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting URL:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
};

exports.deleteBulkUrls = async (req, res) => {
  try {
    const { urlIds } = req.body;
    const deletedUrls = await prisma.url.deleteMany({
      where: {
        id: {
          in: urlIds
        }
      }
    });

    return res.status(200).json({ 
      success: true,
      message: `${deletedUrls.count} URLs deleted successfully` 
    });
  } catch (error) {
    console.error('Error deleting URLs:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
};

exports.updateShortenedUrl = async (req, res) => {
  try {
    const { urlId } = req.params;
    const { baseUrl, urlName, description, customCharacters, tier, category } = req.body;

    const url = await prisma.url.findFirst({ where: { id: parseInt(urlId) } });
    // Validation for custom chars
    if (customCharacters) {
      const blockedWords = await prisma.blockedWord.findMany();
      if (blockedWords.some(word => customCharacters.includes(word.word))) {
        return res.status(200).json({
          success: false,
          isBlockedWord: true,
          message: "Custom characters contain blocked words.",
        });
      }
    }

    const isValidUrl = isUrl(baseUrl);
    if (!isValidUrl) {
      return res.status(200).json({
        success: false,
        isValidUrl: true,
        message: "URL is invalid",
      });
    }

    // Validation for blocked domains
    const blockedDomains = await prisma.blockedDomain.findMany();
    const hostname = new URL(baseUrl).hostname;
    if (blockedDomains.some(domain => domain.domain === hostname)) {
      return res.status(200).json({
        success: false,
        isDomainBlocked: true,
        message: "Source URL is blocked.",
      });
    }

    let expirationDate;
    const globalVariables = await prisma.global.findFirst();

    switch (tier) {
      case 'silver':
        expirationDate = new Date(Date.now() + globalVariables.silverUrlActiveDays * 24 * 60 * 60 * 1000);
        break;
      case 'gold':
        expirationDate = new Date(Date.now() + globalVariables.goldUrlActiveDays * 24 * 60 * 60 * 1000);
        break;
      case 'platinum':
        expirationDate = new Date(Date.now() + globalVariables.platinumUrlActiveDays * 24 * 60 * 60 * 1000);
        break;
      case 'temp':
        expirationDate = new Date(Date.now() + globalVariables.tempUrlActiveDays * 24 * 60 * 60 * 1000);
        break;
    }

    const updatedUrl = await prisma.url.update({
      where: {
        id: parseInt(urlId),
      },
      data: {
        baseUrl: baseUrl,
        urlName: urlName || url.urlName,
        description: description || url.description,
        shortUrl: customCharacters || url.shortUrl,
        tier,
        category: {
          connect: { id: category || url.categoryId },
        },
        expirationDate: expirationDate || url.expirationDate,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Shortened URL updated successfully.",
      updatedUrl,
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};
