const express = require("express")
const router = express.Router()

const  {
    shortUrl,
    getShortUrl,
} = require("../controllers/Url")
 
const {
  trackVisitorData,
} = require("../controllers/Analytics")

router.post("/tempShortUrl", shortUrl)
router.get("/:shortUrl", getShortUrl)
router.post("/visit", trackVisitorData)

module.exports = router