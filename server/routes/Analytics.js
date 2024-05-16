const express = require("express")
const router = express.Router();

const {
  auth, isUser, isAdmin,
} = require("../middlewares/auth")

const {
  getTotalDeviceAnalytics,
  getDeviceAnalyticsForUser,
  getCountryAnalyticsForUser,
  getCountryAnalyticsForAdmin,
} = require("../controllers/Analytics")

router.get("/getTotalDeviceAnalytics", auth, isAdmin, getTotalDeviceAnalytics);
router.get("/getDeviceAnalyticsForUser", auth, isUser, getDeviceAnalyticsForUser);
router.get("/getCountryAnalyticsForUser", auth, getCountryAnalyticsForUser);
router.get("/getCountryAnalyticsForAdmin", auth, getCountryAnalyticsForAdmin);

module.exports = router;