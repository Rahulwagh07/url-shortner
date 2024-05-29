const express = require("express")
const router = express.Router()

const  {
    shortUrl,
    getBaseUrl,
} = require("../controllers/Url")
 
const {
  trackVisitorData,
} = require("../controllers/Analytics")

router.post("/tempShortUrl", shortUrl)
router.get("/:shortUrl", getBaseUrl)
router.post("/visit", trackVisitorData)

module.exports = router