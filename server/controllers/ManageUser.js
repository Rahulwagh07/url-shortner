const prisma = require("../config/prismaClient")

exports.getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        accountType: 'User'
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        createdAt: true,
        status: true,
      },
    });
    return res.status(200).json({
      success: true,
      message: "User data fetched",
      data: users,
    });
  } catch (err) {
    return res.status(500).json({ 
      error: 'Internal Server Error' 
    });
  }
};

exports.suspendUsers = async (req, res) => {
  try {
    const { userIds } = req.body;
    await prisma.user.updateMany({
      where: {
        id: { in: userIds },
      },
      data: {
        status: 'suspended',
      },
    });
    return res.status(200).json({
      success: false,
      message: "Users account suspended",
    });
  } catch (err) {
    return res.status(500).json({ 
      error: 'Internal Server Error' 
    });
  }
};

exports.activateUsers = async (req, res) => {
  try {
    const { userIds } = req.body;
    const updatedUsers = await prisma.user.updateMany({
      where: {
        id: { in: userIds },
      },
      data: {
        status: 'active',
      },
    });
    return res.status(200).json({
      success: false,
      message: "Users account activated",
    });
  } catch (err) {
    return res.status(500).json({ 
      error: 'Internal Server Error' 
    });
  }
};

exports.deleteUsers = async (req, res) => {
  try {
    const { userIds } = req.body;
    await prisma.user.deleteMany({
      where: {
        id: { in: userIds },
      },
    });
    return res.status(200).json({
      success: true,
      message: "Users deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({ 
      error: 'Internal Server Error' 
    });
  }
};
