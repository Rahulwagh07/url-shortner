const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const mailSender = require("../utils/mailsender")
require("dotenv").config();
const prisma = require('../config/prismaClient');

exports.signup = async (req, res) => {
    try {
      const {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        accountType,
        otp,
      } = req.body;

      if (!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
        return res.status(403).send({
          success: false,
          message: "All Fields are required",
        });
      }

      if (password !== confirmPassword) {
        return res.status(400).json({
          success: false,
          message: "Password and Confirm Password do not match. Please try again.",
        });
      }
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User already exists. Please sign in to continue.",
        });
      }

      const lastOtp = await prisma.oTP.findFirst({
        where: { email },
        orderBy: { createdAt: 'desc' },
      });
      if (!lastOtp || lastOtp.otp !== otp) {
        return res.status(400).json({
            success: false,
            message: "Invalid OTP",
        });
      }

      const hashedPassword = bcrypt.hashSync(password, 10);
      const user = await prisma.user.create({
        data: {
            firstName,
            lastName,
            email,
            password: hashedPassword,
            accountType,
        },
      });

      return res.status(200).json({
        success: true,
        user,
        message: "User registered successfully",
      });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
          success: false,
          message: "User cannot be registered. Please try again.",
        });
    }
};

exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: `Please Fill up All the Required Fields`,
        });
      }

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: `User is not Registered with Us Please SignUp to Continue`,
        });
      }

      if(user.status === "suspended"){
        return res.status(200).json({
          success: false,
          suspended: true,
          message: `Your account is suspended by admin`,
        });
      }

      if (await bcrypt.compare(password, user.password)) {
        const token = jwt.sign(
          { email: user.email, id: user.id, accountType: user.accountType },
          process.env.JWT_SECRET,
          { expiresIn: "24h" }
        );

          const options = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly: true,
          };
          res.cookie("token", token, options).status(200).json({
            success: true,
            token,
            user,
            message: `User Login Success`,
          });
      } else {
          return res.status(401).json({
            success: false,
            message: `Password is incorrect`,
          });
      }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
          success: false,
          message: `Login Failure Please Try Again`,
        });
    }
};

exports.sendotp = async (req, res) => {
    try {
        const { email } = req.body;
        const checkUserPresent = await prisma.user.findUnique({ where: { email } });
        if (checkUserPresent) {
            return res.status(401).json({
                success: false,
                message: `User is Already Registered`,
            });
        }

        // Generate OTP
        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });

        const otpPayload = { email, otp };
        await prisma.oTP.create({ data: otpPayload });

        await mailSender(
            email,
            "OTP || URL-Shortner",
            `Your OTP ${otp} for email verification.`
        );

        return res.status(200).json({
            success: true,
            message: `OTP Sent Successfully`,
            otp,
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};
