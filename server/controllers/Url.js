const express = require("express");
const shortid = require("shortid");
const TempUrl = require("../models/TempUrl");
const { isUrl } = require('check-valid-url');
const Url = require('../models/Url');
const Global = require('../models/Global');
const dotenv = require("dotenv");
dotenv.config();

const BaseUrl = process.env.FRONTEND_BASE_URL;

exports.shortUrl = async (req, res) => {
    const { baseUrl} = req.body;
    try {
        //check is already created
        const isExistingBaseurl = await TempUrl.findOne({ baseUrl: baseUrl }) || await TempUrl.findOne({ baseUrl: baseUrl });
        if(isExistingBaseurl){
            return res.status(200).json({
                success: true,
                message: "Short URL created successfully",
                shortUrl: `${BaseUrl}/${isExistingBaseurl.shortUrl}`,
            });
        }
        const isValidUrl = isUrl(baseUrl);
        if (isValidUrl) {
            let shortId;
            let isUnique = false;

            while (!isUnique) {
                shortId = shortid.generate();
                const existingUrl = await TempUrl.findOne({ shortUrl: shortId }) && await Url.findOne({ shortUrl: shortId });
                if (!existingUrl) {
                    isUnique = true;
                }
            }
            await TempUrl.create({
                shortUrl: shortId,
                baseUrl: baseUrl,
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


exports.getShortUrl = async (req, res) => {
    try {
        const shortUrl = req.params.shortUrl;
        const entry = await TempUrl.findOne({ shortUrl }) || await Url.findOne({ shortUrl: shortUrl });
        if (entry) {
            return res.status(200).json({
                success: true,
                baseUrl: entry.baseUrl,
            })
        } else {
            return res.status(404).json({
                success: false,
                message:`Short url not found`,
            })
        }
    } catch (error) {
        console.error("Error fetching short URL:", error);
        return res.status(500).json({
            success: false,
            message:`Internal server error`,
        })
    }
};

exports.createShortenedUrl = async (req, res) => {
    try {
      const { baseUrl, urlName, description, customCharacters, tier, category } = req.body;
      if (!baseUrl || !tier) {
        return res.status(403).send({
          success: false,
          message: "baseurl and tier are required",
        });
      }
  
      // Check if the base URL already exists
      const isExistingBaseUrl = await TempUrl.findOne({ baseUrl }) || await Url.findOne({ baseUrl });
      if (isExistingBaseUrl) {
        return res.status(200).json({
          success: true,
          message: "Short URL created successfully",
          shortUrl: `${BaseUrl}/${isExistingBaseUrl.shortUrl}`,
        });
      }
  
      const isValidUrl = isUrl(baseUrl);
      if (isValidUrl) {
        // Check if the domain is blocked
        const globalVariables = await Global.findOne({});
        if (globalVariables.blockedDomains.includes(new URL(baseUrl).hostname)) {
          const isDomainBlocked = true;
          return res.status(200).json({
            success: false,
            isDomainBlocked: isDomainBlocked,
            message: "Source URL is blocked.",
          });
        }
  
        let shortId;
        if (customCharacters) {
          const blockedWords = globalVariables.blockedWords;
          if (blockedWords.some(word => customCharacters.includes(word))) {
            const isBlockedWord = true;
            return res.status(200).json({
              success: false,
              isBlockedWord: isBlockedWord,
              message: "Custom characters contain blocked words.",
            });
          }
  
          // Check if custom characters are already taken
          const existingUrl = await Url.findOne({ shortUrl: customCharacters });
          if (existingUrl) {
            const customCharAlreadyExist = true;
            return res.status(200).json({
              success: false,
              customCharAlreadyExist: customCharAlreadyExist,
              message: "Custom characters are already taken.",
            });
          }
          shortId = customCharacters;
        } else {
          let isUnique = false;
          while (!isUnique) {
            shortId = shortid.generate();
            const existingUrl = await TempUrl.findOne({ shortUrl: shortId }) && await Url.findOne({ shortUrl: shortId });
            if (!existingUrl) {
              isUnique = true;
            }
          }
        }
  
        // Calculate expiration date based on tier
        let expirationDate;
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
  
        const shortUrl = new Url({
          baseUrl,
          urlName: urlName || 'tiny2',
          description: description || '',
          shortUrl: shortId,
          tier,
          category: category || "6627836d4a04ad576b46d720", // Default short URL category
          creator: req.user.id,
          expirationDate,
        });
        await shortUrl.save();
  
        return res.status(201).json({
            success: true,
            message: "Short URL created successfully",
            shortUrl: `${BaseUrl}/${shortId}`,
        });
      } else {
        const isValidUrl = true;
        return res.status(200).json({
            success: false, 
            isValidUrl: isValidUrl,
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
