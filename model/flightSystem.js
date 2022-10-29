const mongoose = require("mongoose");

const FlightSystemSchema = new mongoose.Schema(
  {
    flightname: {
      type: String,
      required: true,
    },
    arrivalTime: String,
    destinationTime: String,
    price: Number,
    arrivalplace: String,
    destinationPlace: String,
    numberofSeatAvailability: {
      type: Number,
      default: 80,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("FlightSystem", FlightSystemSchema);
