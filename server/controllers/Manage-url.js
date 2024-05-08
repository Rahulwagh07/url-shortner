const dotenv = require("dotenv");
dotenv.config();
const prisma = require("../config/prismaClient");
const { isUrl } = require('check-valid-url');

const BaseUrl = process.env.FRONTEND_BASE_URL;

exports.deleteBulkUrls = async (req, res) => {
  try {
    const userId = req.user.id;
    const { urlIds } = req.body;
    const deletedUrls = await Url.deleteMany({ _id: { $in: urlIds }, creator: userId });

    return res.status(200).json({ 
      success: true,
      message: `${deletedUrls.deletedCount} URLs deleted successfully` 
    });
  } catch (error) {
    console.error('Error deleting URLs:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
};

exports.getAllUrl = async (req, res) => {
  try {
    const userId = req.user.id;
    const userUrls = await prisma.url.findMany({ where: { creatorId: userId } });

    return res.status(200).json({ 
      success: true,
      data: userUrls 
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
    const userId = req.user.id;
    const { urlId } = req.params;
    const url = await prisma.url.findFirst({ where: { id: Number(urlId), creatorId: userId } });

    if (!url) {
      return res.status(404).json({
        success: false,
        message: 'URL not found' 
      });
    }
    await prisma.url.update({ 
      where: { id: Number(urlId) },
      data: { status: 'suspended' }
    });

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
    const userId = req.user.id;
    const { urlId } = req.params;
    const url = await prisma.url.findFirst({ where: { id: Number(urlId), creatorId: userId } });

    if (!url) {
      return res.status(404).json({
        success: false,
        message: 'URL not found' 
      });
    }

    await prisma.url.update({ 
      where: { id: Number(urlId) },
      data: { status: 'active' }
    });

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
    const userId = req.user.id;
    const { urlId } = req.params;
    const url = await prisma.url.findFirst({ where: { id: Number(urlId), creatorId: userId } });

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
    const userId = req.user.id;
    const { urlIds } = req.body;
    const deletedUrls = await prisma.url.deleteMany({ where: { id: { in: urlIds }, creatorId: userId } });

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

    const url = await prisma.url.findFirst({ where: { id: Number(urlId) } });
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
      if (url.shortUrl === customCharacters) {
        return res.status(200).json({
          success: false,
          customCharAlreadyExist: true,
          message: "Custom characters are already taken.",
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
