const Url = require('../models/Url');
const Global = require('../models/Global');
const dotenv = require("dotenv");
dotenv.config();

const BaseUrl = process.env.FRONTEND_BASE_URL;

exports.getAllUrl = async (req, res) => {
  try {
    const userId = req.user.id;
    const userUrls = await Url.find({ creator: userId });

    return res.status(200).json({ 
        success: true,
        data: userUrls 
    });
  } catch (error) {
    console.error('Error fetching URLs:', error);
    return res.status(500).json({
        success: false, 
        message: 'Internal server error' });
  }
};

exports.suspendUrl = async (req, res) => {
    try {
      const userId = req.user.id;
      const { urlId } = req.params;
      const url = await Url.findOne({ _id: urlId, creator: userId });
  
      if (!url) {
        return res.status(404).json({
            success:false,
            message: 'URL not found' 
        });
      }
      url.status = 'suspended';
      await url.save();
  
      return res.status(200).json({
        success:true,
        message: 'URL suspended successfully' 
       });
    } catch (error) {
      console.error('Error suspending URL:', error);
      return res.status(500).json({ 
        success:false,
        message: 'Internal server error' 
      });
    }
  };
 
exports.deleteUrl = async (req, res) => {
  try {
    const userId = req.user.id;
    const { urlId } = req.params;
    const url = await Url.findOne({ _id: urlId, creator: userId });

    if (!url) {
      return res.status(404).json({ 
        success:false,
        message: 'URL not found' 
      });
    }
    await Url.deleteOne({ _id: urlId });
    return res.status(200).json({ 
        success:true,
        message: 'URL deleted successfully' });
  } catch (error) {
    console.error('Error deleting URL:', error);
    return res.status(500).json({ 
        success:false,
        message: 'Internal server error' 
    });
  }
};

exports.deleteBulkUrls = async (req, res) => {
  try {
    const userId = req.user.id;
    const { urlIds } = req.body;
    const deletedUrls = await Url.deleteMany({ _id: { $in: urlIds }, creator: userId });
 
    return res.status(200).json({ 
        sucess:true,
        message: `${deletedUrls.deletedCount} URLs deleted successfully` });
  } catch (error) {
    console.error('Error deleting URLs:', error);
    return res.status(500).json({ 
        success:false,
        message: 'Internal server error' });
  }
};

