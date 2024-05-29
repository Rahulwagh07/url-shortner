const express = require("express");
const shortid = require("shortid");
const { isUrl } = require('check-valid-url');
const dotenv = require("dotenv");
dotenv.config();
const prisma = require('../config/prismaClient');

const BaseUrl = process.env.FRONTEND_BASE_URL;

//Short a url- and store in Temp Urls
//This is for guest user 
exports.shortUrl = async (req, res) => {
  const { baseUrl } = req.body;
  try {
    const existingShortUrl = await prisma.tempUrl.findFirst({
      where: {
        baseUrl: baseUrl
      }
    }) || await prisma.url.findFirst({
      where: {
        baseUrl: baseUrl
      }
    });

    if (existingShortUrl) {
      return res.status(200).json({
        success: true,
        message: "Short URL created successfully",
        shortUrl: `${BaseUrl}/${existingShortUrl.shortUrl}`,
      });
    }
    const isValidUrl = isUrl(baseUrl);
    if (isValidUrl) {
      let shortId;
      let isUnique = false;
      while (!isUnique) {
        shortId = shortid.generate();
        const isExisting = await prisma.tempUrl.findFirst({
          where: {
            shortUrl: shortId
          }
        }) || await prisma.url.findFirst({
          where: {
            shortUrl: shortId
          }
        });

        if (!isExisting) {
          isUnique = true;
        }
      }
      await prisma.tempUrl.create({
        data: {
          shortUrl: shortId,
          baseUrl: baseUrl,
        }
      });
      await prisma.stats.upsert({
        where: { id: 1 }, 
        update: {
          totalLinksCreated: { increment: 1 } 
        },
        create: {
          totalLinksCreated: 1,
        }
      });
      return res.status(200).json({
        success: true,
        message: "Short URL created successfully",
        shortUrl: `${BaseUrl}/${shortId}`,
      });
    } else {
      return res.status(200).json({
        success: false,
        invalidUrl: true,
        message: "URL is not valid",
      });
    }
  } catch (error) {
    console.error('Error shortening URL:', error);
    res.status(500).json({ error: 'Failed to shorten URL' });
  }
};

//Get the BaseUrl from a short code
exports.getBaseUrl = async (req, res) => {
  try {
    const shortUrl = req.params.shortUrl;
    const urlEntry = await prisma.tempUrl.findFirst({
      where: {
        shortUrl: shortUrl
      }
    }) || await prisma.url.findFirst({
      where: {
        shortUrl: shortUrl,
        status: "active",
      }
    });

    if (urlEntry) {
      return res.status(200).json({
        success: true,
        baseUrl: urlEntry.baseUrl,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Short URL not found",
      });
    }
  } catch (error) {
    console.error("Error fetching short URL:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//Function to short url, only for the authorized user
exports.createShortenedUrl = async (req, res) => {
  try {
    const { baseUrl, urlName, description, customCharacters, tier, category } = req.body;
    if (!baseUrl || !tier) {
      return res.status(403).send({
        success: false,
        message: "baseUrl and tier are required",
      });
    }

    const isExistingBaseUrl = await prisma.tempUrl.findFirst({
      where: {
        baseUrl: baseUrl
      }
    }) || await prisma.url.findFirst({
      where: {
        baseUrl: baseUrl
      }
    });

    if (isExistingBaseUrl) {
      return res.status(200).json({
        success: true,
        message: "Short URL created successfully",
        shortUrl: `${BaseUrl}/${isExistingBaseUrl.shortUrl}`,
      });
    }

    const isValidUrl = isUrl(baseUrl);
    if (isValidUrl) {
      const blockedDomains = await prisma.blockedDomain.findMany();
      const hostname = new URL(baseUrl).hostname;
      if (blockedDomains.some(domain => domain.domain === hostname)) {
        return res.status(200).json({
          success: false,
          isDomainBlocked: true,
          message: "Source URL is blocked.",
        });
      }

      let shortId;
      if (customCharacters) {
        const blockedWords = await prisma.blockedWord.findMany();
        if (blockedWords.some(word => customCharacters.includes(word.word))) {
          return res.status(200).json({
            success: false,
            isBlockedWord: true,
            message: "Custom characters contain blocked words.",
          });
        }

        const existingUrl = await prisma.url.findFirst({
          where: {
            shortUrl: customCharacters
          }
        });
        if (existingUrl) {
          return res.status(200).json({
            success: false,
            customCharAlreadyExist: true,
            message: "Custom characters are already taken.",
          });
        }
        shortId = customCharacters;
      } else {
        let isUnique = false;
        while (!isUnique) {
          shortId = shortid.generate();
          const existingTempUrl = await prisma.tempUrl.findFirst({
            where: {
              shortUrl: shortId
            }
          });

          const existingUrl = await prisma.url.findFirst({
            where: {
              shortUrl: shortId
            }
          });

          if (!existingTempUrl && !existingUrl) {
            isUnique = true;
          }
        }
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

      // Create a new short URL in the appropriate table
      const shortUrl = await prisma.url.create({
        data: {
          baseUrl,
          urlName: urlName || 'Linkshort',
          description: description || '',
          shortUrl: shortId,
          tier,
          category: {
            connect: { id: category || 1 } // By default store the url in  short url category
                                           //here 1 is the Id of short Url Category
          },
          creator: {
            connect: { id: req.user.id }
          },
          expirationDate,
        }
      });
      await prisma.stats.upsert({
        where: { id: 1 }, 
        update: {
          totalLinksCreated: { increment: 1 } 
        },
        create: {
          totalLinksCreated: 1,
        }
      });
      return res.status(201).json({
        success: true,
        message: "Short URL created successfully",
        shortUrl: `${BaseUrl}/${shortUrl.shortUrl}`,
      });
    } else {
      return res.status(200).json({
        success: false,
        isValidUrl: true,
        message: "url is invalid"
      });
    }
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      success: false,
      message: "server error"
    });
  }
};
