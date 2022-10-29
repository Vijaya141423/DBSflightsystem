if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const path = require("path");
const session = require("express-session");
const MongoDBStore = require("connect-mongo");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const cors = require("cors");
const { mongoConnection } = require("./config/mongoose");
const app = express();
const UserRoute = require("./routes/user");
const Payment = require("./routes/payment");
const FlightSystem = require("./routes/flightsystem");
const AppError = require("./controlError/AppError");

app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(cors({ origin: true, credentials: true }));

const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/project-jaipur";
mongoConnection();

const store = new MongoDBStore({
  mongoUrl: dbUrl,
  secret: "letmeknowyoursecret!",
  touchAfter: 60,
});

store.on("error", function (e) {
  console.log("SESSION STORE ERROR", e);
});

const sessionConfig = {
  store,
  secret: "thisshouldbeabettersecret!",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24,
    maxAge: 1000 * 60 * 60 * 24 * 30,
  },
};

app.use(session(sessionConfig));
app.use(flash());

app.use("/api/user", UserRoute);
app.use("/api/payment", Payment);
app.use("/api/flight", FlightSystem);

app.use(async (req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(__dirname + "/client_side/build"));
  app.get("*", (_, res) =>
    res.sendFile(path.resolve("client_side", "build", "index.html"))
  );
}

const handleValidationErr = (err) => {
  return new AppError("Please fill up all the required field carefully", 550);
};

app.use((err, req, res, next) => {
  if (err.name === "ValidationError") {
    err = handleValidationErr(err);
    return res.status(210).json({
      message:
        "Some of these fields are already taken,Please fill up all the field carefully ",
    });
  }
  if (err.name === "MongoServerError") {
    return res.status(210).json({ message: "Something went wrong" });
  }
  if (err.name === "MongoServerSelectionError") {
    return res
      .status(210)
      .json({ message: "server does not responding,try again" });
  }
  return next(err);
});
// this is for handling unexpected
app.use((err, req, res, next) => {
  if (err) {
    const message = err.message ? err.message : "Something went wrong";
    return res.status(210).json({ message: message });
  }
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("APP IS LISTENING ON PORT " + PORT));
