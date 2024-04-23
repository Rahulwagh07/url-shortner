const express = require("express");
const shortid = require("shortid");
const TempUrl = require("../models/TempUrl");
const { isUrl } = require('check-valid-url');
const BaseUrl = "http://localhost:5173";
const Url = require('../models/Url');
const Global = require('../models/Global');


exports.shortUrl = async (req, res) => {
    const { baseUrl, urlCode } = req.body;
    try {
        const isValidUrl = isUrl(baseUrl);
        if (isValidUrl) {
            let shortId;
            let isUnique = false;

            while (!isUnique) {
                shortId = shortid.generate();
                const existingUrl = await TempUrl.findOne({ shortUrl: shortId });
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
        const entry = await TempUrl.findOne({ shortUrl });
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
        const { baseUrl, urlName, description, customCharacters, tier, domain } = req.body;

        // Check is blocked
        const globalVariables = await Global.findOne({});
        if (globalVariables.blockedDomains.includes(new URL(baseUrl).hostname)) {
            return res.status(400).json({ error: 'Source URL is blocked.' });
        }
        const blockedWords = globalVariables.blockedWords;
        if (blockedWords.some(word => customCharacters.includes(word))) {
            return res.status(400).json({ error: 'Custom characters contain blocked words.' });
        }
        // Check if custom characters length is valid- to do->> move it to frontend
        if (customCharacters.length < 5 || customCharacters.length > 16) {
            return res.status(400).json({ error: 'Custom characters length must be between 5 and 16 characters.' });
        }

        // Check if custom chars are already taken
        const existingUrl = await Url.findOne({ urlCode: customCharacters });
        if (existingUrl) {
            return res.status(400).json({ error: 'Custom characters are already taken.' });
        }

        // Calculate expiration date based on basis of tier
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
        }
        const shortUrl = new Url({
            baseUrl,
            urlName: urlName || 'tiny2',
            domain,
            description,
            urlCode: customCharacters,
            tier,
            category:"6627836d4a04ad576b46d720",
            creator: req.user.id,
            expirationDate
        });
        await shortUrl.save();

        return res.status(201).json({
            message: 'Short URL created successfully', shortUrl });
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server Error');
    }
};
 

