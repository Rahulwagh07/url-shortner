const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema(
  {
    baseUrl: {
      type: String,
      required: true
    },
    urlName: {
      type: String,
      default: 'tiny'
    },
    description: {
      type: String
    },
    shortUrl: {
      type: String,
    },
    tier: {
      type: String,
      enum: ['silver', 'gold', 'platinum', 'temp'],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    visits: [
      {
        country: String,
        count: Number
      }
    ],
    newVisitors: {
      type: Number,
      default: 0
    },
    returningVisitors: {
      type: Number,
      default: 0
    },
    daysSinceActive: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['active', 'suspended', 'deleted'],
      default: 'active'
    },
    expirationDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Url = mongoose.model('Url', urlSchema);

module.exports = Url;
