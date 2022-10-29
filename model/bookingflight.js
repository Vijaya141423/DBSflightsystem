const mongoose = require("mongoose");

const BookingFlightSchema = new mongoose.Schema(
  {
    flightname: {
      type: String,
      required: true,
    },

    userBookedFlight: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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
    status: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("BookingFlight", BookingFlightSchema);
