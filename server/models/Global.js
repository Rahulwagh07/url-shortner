const mongoose = require('mongoose');

const globalVariablesSchema = new mongoose.Schema(
  {
    blockedDomains: {
      type: [{ type: String }],
    },
    blockedWords: {
      type: [{ type: String }],
    },
    tempUrlActiveDays: {
      type: Number,
      default: 10,
    },
    silverUrlActiveDays: {
      type: Number,
      default: 10,
    },
    goldUrlActiveDays: {
      type: Number,
      default: 10,
    },
    platinumUrlActiveDays: {
      type: Number,
      default: 10,
    },
    reportExpirationDays: {
      type: Number,
      default: 10,
    },
    maxReportRecords: {
      type: Number,
      default: 10,
    },
    generateReportDisabled: {
      type: Boolean,
      default: false
    },
    generatedReportDisabled: {
      type: Boolean,
      default: false
    },
    pauseGeneratedReportDisabled: {
      type: Boolean,
      default: false
    },
  },
  { timestamps: true }
);

const Global = mongoose.model('Global', globalVariablesSchema);

module.exports = Global;
