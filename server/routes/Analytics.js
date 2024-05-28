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
  getTotalStats,
} = require("../controllers/Analytics")

router.get("/getTotalDeviceAnalytics", auth, isAdmin, getTotalDeviceAnalytics);
router.get("/getDeviceAnalyticsForUser", auth, isUser, getDeviceAnalyticsForUser);
router.get("/getCountryAnalyticsForUser", auth, getCountryAnalyticsForUser);
router.get("/getCountryAnalyticsForAdmin", auth, getCountryAnalyticsForAdmin);
router.get("/getStats", getTotalStats);
module.exports = router;