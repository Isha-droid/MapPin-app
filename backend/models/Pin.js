const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PinSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  ratings: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  lat: {
    type: Number,
    required: true,
    min: -90,
    max: 90
  },
  long: {
    type: Number,
    required: true,
    min: -180,
    max: 180
  }
});

module.exports = mongoose.model("Pin", PinSchema);
