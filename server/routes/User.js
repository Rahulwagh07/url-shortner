const express = require("express")
const router = express.Router();

const {
  login,
  signup,
  sendotp,
} = require("../controllers/Auth")

router.post("/login", login)
router.post("/signup", signup)
router.post("/sendotp", sendotp)

const {
  createShortenedUrl,
} = require("../controllers/Url");
const { auth, isUser } = require("../middlewares/auth");

//Routes for Authrized user
router.post("/create-shortened-url", auth, createShortenedUrl);

module.exports = router