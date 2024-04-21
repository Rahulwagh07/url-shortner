const express = require("express")
const router = express.Router()

const  {
    shortUrl,
    getShortUrl,
} = require("../controllers/Url")
 
router.post("/tempShortUrl", shortUrl)
router.get("/:shortUrl", getShortUrl);

module.exports = router