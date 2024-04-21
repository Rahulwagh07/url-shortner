const User = require("../models/User")

exports.getUserDetails = async (req, res) => {
    try {
      const id = req.user.id
      const userDetails = await User.findById(id)
      return res.status(200).json({
        success: true,
        message: "User data fetched",
        data: userDetails,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }