const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema(
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
    // urlName: {
    //   type: String,
    //   default: 'tiny'
    // },
    // description: {
    //   type: String
    // },
    // urlCode: {
    //   type: String,
    //   minlength: 5,
    //   maxlength: 16
    // },
    // tier: {
    //   type: String,
    //   enum: ['silver', 'gold', 'platinum'],
    //   required: true
    // },
    // category: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'Category',
    //   default: 'Short URL'
    // },
    // creator: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'User',
    //   required: true
    // },
    // visits: [
    //   {
    //     country: String,
    //     count: Number
    //   }
    // ],
    // newVisitors: {
    //   type: Number,
    //   default: 0
    // },
    // returningVisitors: {
    //   type: Number,
    //   default: 0
    // },
    // daysSinceActive: {
    //   type: Number,
    //   default: 0
    // },
    // status: {
    //   type: String,
    //   enum: ['active', 'suspended', 'deleted'],
    //   default: 'active'
    // },
    // expirationDate: {
    //   type: Date,
    //   required: true
    // },
  },
  { timestamps: true }
);

const Url = mongoose.model('Url', urlSchema);

module.exports = Url;
