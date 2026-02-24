const mongoose = require("mongoose");

const violationSchema = new mongoose.Schema(
  {
    crimeType: {
      type: String,
      required: true
    },
    description: String,
    latitude: Number,
    longitude: Number,
    riskScore: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Violation", violationSchema);