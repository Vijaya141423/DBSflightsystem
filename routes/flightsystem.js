const express = require("express");
const router = express.Router();
const FlightSystem = require("../model/flightSystem");
const wrapAsync = require("../controlError/wrapAsync");
const AppError = require("../controlError/AppError");
const { isAdmin, verifyToken } = require("../helper/authJwt");
const BookingFlight = require("../model/bookingflight");
router.post(
  "/new_add_flight",
  [verifyToken, isAdmin],
  wrapAsync(async (req, res) => {
    try {
      const {
        flightname,
        arrivalTime,
        destinationTime,
        price,
        arrivalplace,
        destinationPlace,
        numberofSeatAvailability,
      } = req.body;
      const newFlightDetail = new FlightSystem({
        flightname,
        arrivalTime,
        destinationTime,
        price,
        arrivalplace,
        destinationPlace,
        numberofSeatAvailability,
      });
      await newFlightDetail.save();
    } catch (e) {
      return res.status(210).send({ message: "something went wrong" });
    }
    return res.status(200).send({ message: "Flight addeed successfully" });
  })
);

// for editing partttt
router.get(
  "/edit_flight/:id",
  [verifyToken, isAdmin],
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const getFlightById = await FlightSystem.findById(id);
    return res.status(200).json(getFlightById);
  })
);

// for edit updating parttt
router.put(
  "/edit/:id",
  [verifyToken, isAdmin],
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    try {
      await FlightSystem.findByIdAndUpdate(id, req.body, {
        runValidators: true,
        new: true,
        context: "query",
        useFindAndModify: false,
      });
    } catch (e) {
      return res.status(210).json({ message: "something went wrongg" });
    }
    return res.status(200).json({ message: "This flight gets updated" });
  })
);

// booking by user.
router.get(
  "/bookingmyuser/:id",
  verifyToken,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const getFlightById = await FlightSystem.findById(id);
    const {
      flightname,
      arrivalTime,
      destinationTime,
      price,
      arrivalplace,
      destinationPlace,
      numberofSeatAvailability,
    } = getFlightById;
    const newFlightBooking = new BookingFlight({
      flightname,
      arrivalTime,
      destinationTime,
      price,
      arrivalplace,
      destinationPlace,
      numberofSeatAvailability,
      user: req.userId,
      status: true,
    });
    return res.statu(200).json({ message: "Flight is on hold" });
    // after this in react we will redirect to payment;
  })
);

router.get(
  "/previousbooking",
  verifyToken,
  wrapAsync(async (req, res) => {
    const previosData = await BookingFlight.find({
      userBookedFlight: req.userId,
    });
    return res.status.json(previosData);
  })
);

router.get(
  "/cancel/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const getFlightById = await FlightSystem.findById(id);
    getFlightById.status = false;
    await getFlightById.save();
    return res.status.json({ message: "cancelled successfully" });
    // after that client side se payment ko return kar denge
  })
);

router.get(
  "/listedflite",
  wrapAsync(async (req, res) => {
    const totalFlight = await FlightSystem.find({});
    return res.status.json(totalFlight);
  })
);
module.exports = router;
