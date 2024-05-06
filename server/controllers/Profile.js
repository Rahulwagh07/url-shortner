const prisma = require('../config/prismaClient');

exports.getUserDetails = async (req, res) => {
    try {
        const userId = req.user.id;
        const userDetails = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });

        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "User data fetched",
            data: userDetails,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch user data",
            error: error.message
        });
    }
};
