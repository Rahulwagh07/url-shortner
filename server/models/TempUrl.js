const mongoose = require('mongoose');

const tempUrlSchema = new mongoose.Schema(
  {
    baseUrl: {
      type: String,
      required: true
    },
    shortUrl: {
      type: String,
      required: true,
      unique: true
    },
    expirationDate: {
      type: Date,
      default: function() {
        // Calculate one month from the current date
        const oneMonthFromNow = new Date();
        oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);
        return oneMonthFromNow;
      }
    }
  },
  { timestamps: true }
);
 
const TempUrl = mongoose.model('TempUrl', tempUrlSchema);

module.exports = TempUrl;
