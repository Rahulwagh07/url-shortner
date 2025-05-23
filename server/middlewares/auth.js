const jwt = require("jsonwebtoken");
require("dotenv").config();

//Middleware to Check the user is Autherized or not
exports.auth = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token is missing',
      });
    }
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decode;
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'token is invalid',
      });
    }
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Something went wrong while validating the token',
    });
  }
}

exports.isUser = async (req, res, next) => {
  try {
    if (req.user.accountType !== "User") {
      return res.status(401).json({
        success: false,
        message: 'This is a protected route for User only',
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'User role cannot be verified, please try again'
    });
  }
}

exports.isAdmin = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Admin") {
      return res.status(401).json({
        success: false,
        message: 'This is a protected route for Admin only',
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'User role cannot be verified, please try again'
    });
  }
}
