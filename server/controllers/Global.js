const prisma = require('../config/prismaClient')
exports.getGlobalVariables = async (req, res) => {
    try {
        const globalVariables = await prisma.global.findFirst();
        const blockedWords = await prisma.blockedWord.findMany();
        const blockedDomains = await prisma.blockedDomain.findMany();
      
        if(blockedWords || blockedDomains){
            globalVariables.blockedWords = blockedWords.map(word => word.word);
            globalVariables.blockedDomains = blockedDomains.map(domain => domain.domain);
        }

        return res.status(200).json({
            success: true,
            message: "Global variables fetched",
            data: globalVariables,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
 
exports.updateGlobalVariables = async (req, res) => {
    try {
        const {
            tempUrlActiveDays,
            silverUrlActiveDays,
            goldUrlActiveDays,
            platinumUrlActiveDays,
            reportExpirationDays,
            maxReportRecords,
            generateReportDisabled,
            generatedReportDisabled,
            pauseGeneratedReportDisabled,
        } = req.body;

        const parsedTempUrlActiveDays = parseInt(tempUrlActiveDays);
        const parsedSilverUrlActiveDays = parseInt(silverUrlActiveDays);
        const parsedGoldUrlActiveDays = parseInt(goldUrlActiveDays);
        const parsedPlatinumUrlActiveDays = parseInt(platinumUrlActiveDays);
        const parsedReportExpirationDays = parseInt(reportExpirationDays);
        const parsedMaxReportRecords = parseInt(maxReportRecords);

        const globalDocument = await prisma.global.findFirst();
        if (!globalDocument) {
            return res.status(404).json({
                success: false,
                message: "Global document not found",
            });
        }

        const updatedGlobalVariablesData = await prisma.global.update({
            where: { id: globalDocument.id },
            data: {
                tempUrlActiveDays: parsedTempUrlActiveDays,
                silverUrlActiveDays: parsedSilverUrlActiveDays,
                goldUrlActiveDays: parsedGoldUrlActiveDays,
                platinumUrlActiveDays: parsedPlatinumUrlActiveDays,
                reportExpirationDays: parsedReportExpirationDays,
                maxReportRecords: parsedMaxReportRecords,
                generateReportDisabled,
                generatedReportDisabled,
                pauseGeneratedReportDisabled,
            },
        });

        return res.status(200).json({
            success: true,
            message: 'Global variables updated successfully',
            data: updatedGlobalVariablesData,
        });
    } catch (error) {
        console.error('Error updating global variables:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to update global variables',
            error: error.message,
        });
    }
};

exports.deleteSelectedDomains = async (req, res) => {
    try {
        const selectedDomains = req.body;

        await prisma.blockedDomain.deleteMany({
            where: {
                domain: {
                    in: selectedDomains
                }
            }
        });

        return res.status(200).json({
            success: true,
            message: 'Selected blocked domains deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting selected blocked domains:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to delete selected blocked domains',
            error: error.message,
        });
    }
};

exports.deleteSelectedWords = async (req, res) => {
    try {
        const selectedWords = req.body;

        // Delete selected blocked words
        await prisma.blockedWord.deleteMany({
            where: {
                word: {
                    in: selectedWords
                }
            }
        });

        return res.status(200).json({
            success: true,
            message: 'Selected blocked words deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting selected blocked words:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to delete selected blocked words',
            error: error.message,
        });
    }
};


exports.addBlockedDomainsWords = async (req, res) => {
    try {
        const { type, value } = req.body;
        if (type === 'domain') {
            await prisma.blockedDomain.create({
                data: {
                    domain: value
                }
            });
        } else {
            await prisma.blockedWord.create({
                data: {
                    word: value
                }
            });
        }

        return res.status(200).json({
            success: true,
            message: `${type} added successfully`,
        });
    } catch (error) {
        console.error('Error adding blocked domain/word:', error);
        return res.status(500).json({
            success: false,
            message: `Failed to add new blocked ${type}s`,
            error: error.message
        });
    }
};


