const prisma = require('../config/prismaClient');
const mailSender = require('../utils/mailsender');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const BASE_URL = process.env.FRONTEND_BASE_URL;

exports.resetPasswordToken = async (req, res) => {
  try {
    const email = req.body.email;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.json({
        success: false,
        message: `This Email: ${email} is not Registered With Us Enter a Valid Email`,
      });
    }

    const token = crypto.randomBytes(20).toString('hex');
    await prisma.user.update({
      where: { email },
      data: {
        token,
        resetPasswordExpires: new Date(Date.now() + 3600000),
      },
    });

    const url = `${BASE_URL}/update-password/${token}`;
    await mailSender(
      email,
      'Password Reset',
      `Your Link for email verification is ${url}. Please click this url to reset your password.`
    );

    res.json({
      success: true,
      message: 'Email Sent Successfully, Please Check Your Email to Continue Further',
    });
  } catch (error) {
    console.log(error)
    return res.json({
      success: false,
      message: `Error in Sending the Reset Message`,
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { password, confirmPassword, token } = req.body;

    if (confirmPassword !== password) {
      return res.json({
        success: false,
        message: 'Password and Confirm Password Does not Match',
      });
    }

    const userDetails = await prisma.user.findFirst({
      where: { token },
      select: { email: true, resetPasswordExpires: true },
    });

    if (!userDetails) {
      return res.json({ success: false, message: 'Token is Invalid' });
    }

    if (!(userDetails.resetPasswordExpires > new Date())) {
      return res.status(403).json({
        success: false,
        message: `Token is Expired, Please Regenerate Your Token`,
      });
    }

    const encryptedPassword = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { email: userDetails.email },
      data: {
        password: encryptedPassword,
        token: null,
        resetPasswordExpires: null,
      },
    });

    return res.status(200).json({ 
      success: true, 
      message: `Password Reset Successful` 
    });
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      success: false,
      message: `Some Error in Updating the Password`,
    });
  }
};