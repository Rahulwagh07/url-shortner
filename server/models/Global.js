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
      required: true
    },
    silverUrlActiveDays: {
      type: Number,
      required: true
    },
    goldUrlActiveDays: {
      type: Number,
      required: true
    },
    platinumUrlActiveDays: {
      type: Number,
      required: true
    },
    reportExpirationDays: {
      type: Number,
      required: true
    },
    maxReportRecords: {
      type: Number,
      required: true
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
