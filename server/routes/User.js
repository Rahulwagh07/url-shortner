const express = require("express")
const router = express.Router();

const {
  login,
  signup,
  sendotp,
} = require("../controllers/Auth")

const {
  resetPasswordToken,
  resetPassword,
} = require("../controllers/ResetPassword")

router.post("/login", login)
router.post("/signup", signup)
router.post("/sendotp", sendotp)

const {
  createShortenedUrl,
} = require("../controllers/Url");
const { auth, isUser } = require("../middlewares/auth");

const {
  generateReport,
} = require("../controllers/Reports");

//Routes for Authrized user
router.post("/create-shortened-url", auth, createShortenedUrl);

router.post("/reset-password-token", resetPasswordToken)
router.post("/reset-password", resetPassword)

router.get("/generate-report", auth, generateReport)

module.exports = router