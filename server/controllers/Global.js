const Global = require('../models/Global');
 
exports.getGlobalVariables = async (req, res) => {
    try {
      const globalVariables = await Global.findOne();
      return res.status(200).json({
        success: true,
        message: "Global variable fetched",
        data: globalVariables,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }

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

        // Assuming there is only one document for Global schema
        const globalDocument = await Global.findOne();
        if (!globalDocument) {
            throw new Error("Global document not found");
        }

        // Construct the updated fields
        const updatedFields = {
            tempUrlActiveDays,
            silverUrlActiveDays,
            goldUrlActiveDays,
            platinumUrlActiveDays,
            reportExpirationDays,
            maxReportRecords,
            generateReportDisabled,
            generatedReportDisabled,
            pauseGeneratedReportDisabled,
        };

        // Update the document with the new fields
        const updatedGlobalVariablesData = await Global.findByIdAndUpdate(globalDocument._id, updatedFields, { new: true });

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
        const selectedDomains  = req.body;
        const updatedGlobalVariablesData = await Global.findOneAndUpdate({}, {
            $pull: { blockedDomains: { $in: selectedDomains } }
        }, { new: true });
        return res.status(200).json({
            success: true,
            message: 'Selected blocked domains deleted successfully',
            data: updatedGlobalVariablesData,
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
        const  selectedWords  = req.body;
        const updatedGlobalVariablesData = await Global.findOneAndUpdate({}, {
            $pull: { blockedWords: { $in: selectedWords } }
        }, { new: true });
        return res.status(200).json({
            success: true,
            message: 'Selected blocked words deleted successfully',
            data: updatedGlobalVariablesData,
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
            await Global.findOneAndUpdate({}, { $push: { blockedDomains: value } });
        } else if (type === 'word') {
            await Global.findOneAndUpdate({}, { $push: { blockedWords: value } });
        }
        return res.status(200).json({
            success: true,
            message: 'domain/word added successfully',
        });
    } catch (error) {
        console.error('Error adding blocked domain/word:', error);
        return res.status(500).json({
            success: false,
            message: `Failed to add new blocked domains/words`,
            error: error.message,
        });
    }
};

