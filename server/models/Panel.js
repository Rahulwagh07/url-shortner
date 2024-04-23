const mongoose = require('mongoose');

const panelSchema = new mongoose.Schema(
  {
    optionName: {
      type: String,
    },
    optionIcon: {
      type: String,
    },
    redirectionUrl: {
      type: String,
    },
  }, 
  { timestamps: true }
);

const Panel = mongoose.model('Panel', panelSchema);

module.exports = Panel;
