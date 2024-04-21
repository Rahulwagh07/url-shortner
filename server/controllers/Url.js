const express = require("express");
const shortid = require("shortid");
const TempUrl = require("../models/TempUrl");
const { isUrl } = require('check-valid-url');
const BaseUrl = "http://localhost:5173";


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

