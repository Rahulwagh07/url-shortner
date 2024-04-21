const mongoose = require('mongoose');

const panelSchema = new mongoose.Schema(
  {
    optionName: {
      type: String,
      required: true
    },
    optionIcon: {
      type: String,
      required: true
    },
    redirectionUrl: {
      type: String,
      required: true
    },
  }, 
  { timestamps: true }
);

const Panel = mongoose.model('Panel', panelSchema);

module.exports = Panel;
