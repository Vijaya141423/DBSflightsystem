const express = require("express");
const router = express.Router();
const User = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendSms, verifyOtp } = require("../helper/sendSms");
const JWT_ACC_ACTIVATE = process.env.JWT_ACC_ACTIVATE;
const { generateString } = require("../helper/stringGenerator");
const wrapAsync = require("../controlError/wrapAsync");
const AppError = require("../controlError/AppError");
const { timingFormat, IST } = require("../helper/date");
const { verifyToken } = require("../helper/authJwt");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const servicesid = process.env.VERIFY_SERVICE_SID;
const client = require("twilio")(accountSid, authToken);
const domain = process.env.DOMAIN_CLIENT;
const profile = [
  "https://www.shareicon.net/data/64x64/2016/05/24/769983_man_512x512.png",
  "https://www.shareicon.net/data/64x64/2016/05/24/769975_man_512x512.png",
  "https://www.shareicon.net/data/64x64/2016/05/24/769978_man_512x512.png",
  "https://www.shareicon.net/data/64x64/2016/05/24/769971_man_512x512.png",
  "https://www.shareicon.net/data/64x64/2016/05/24/769978_man_512x512.png",
];
//user registeration route.
router.post(
  "/register",
  wrapAsync(async (req, res, next) => {
    // const { id } = req.params;
    // if (id) await refferal(req, res, id);
    // res.send("resgistering the userr");
    // phoneInput: '9315312511', passwordValue: 'balajeemishra123'
    const url = profile[Math.floor(Math.random() * 5)];
    try {
      const { phoneInput, passwordValue } = req.body;
      //password hashing
      const saltPassword = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(passwordValue, saltPassword);
      // refferal code.
      const referalCode = generateString();
      // CREATING NEW USERR
      const newUser = new User({
        phoneNo: phoneInput,
        password: hashedPassword,
        referalCode,
        imageUrl: url,
        date: timingFormat().dateTosave,
        timing: IST(),
      });
      if (phoneInput === "9315312511") {
        newUser.admin = true;
      }
      await newUser.save();
      if (newUser) {
        return res.status(200).json({
          message: "Registered successfully",
        });
      }
      if (!newUser) {
        return res.status(210).json({
          message: "something went wrong",
        });
      }
      return res.json({ message: "Please try again something going wrong" });
    } catch (e) {
      if (e.name === "ValidationError") {
        throw new AppError(
          "User with given credential is already existed",
          210
        );
      }
      next(e);
    }
  })
);

// user login route.
router.post(
  "/login",
  wrapAsync(async (req, res) => {
    try {
      const { phoneInput, passwordValue } = req.body;
      const user = await User.findOne({ phoneNo: phoneInput });
      const loginResult = await bcrypt.compare(passwordValue, user.password);
      const hashedPassword = user.password;
      if (loginResult) {
        const token = jwt.sign(
          { phoneInput, hashedPassword, id: user._id },
          JWT_ACC_ACTIVATE,
          {
            expiresIn: "10 days",
          }
        );
        return res.status(200).json({
          message: "you are Logged In",
          token,
          admin: user.admin ? user.admin : "",
          superadmin: user?.superadmin ? user?.superadmin : "",
        });
      } else {
        return res
          .status(210)
          .json({ message: "Please enter the correct credential" });
      }
    } catch (e) {
      if (e.name === "TypeError") {
        throw new AppError("Please enter the correct credentials", 210);
      }
    }
  })
);

// route handling forget passwordd
// router.post(
//   "/forgetpassword",
//   wrapAsync(async (req, res) => {
//     const { phoneInput, passwordValue } = req.body;
//     //password hashing
//     const saltPassword = await bcrypt.genSalt(12);
//     const hashedPassword = await bcrypt.hash(passwordValue, saltPassword);
//     const updateUser = await User.findOneAndUpdate(
//       { phoneNo: phoneInput },
//       {
//         password: hashedPassword,
//       }
//     );
//     if (updateUser) {
//       return res.status(200).json({ message: "Password Changed Successfully" });
//     }
//     if (!updateUser) {
//       return res
//         .status(210)
//         .json({ message: "Something went wrong please try again" });
//     }
//   })
// );

// user logout routeee..
router.get(
  "/logout",
  wrapAsync(async (_, res) => {
    return res.status(200).json("signed out");
  })
);

// all things related to admin sectionn okayyy.
// sending otp after clicking on forget password..
router.post(
  "/sendotp",
  wrapAsync(async (req, res) => {
    try {
      const { phoneInput } = req.body;
      const findTheUser = await User.findOne({ phoneNo: phoneInput });
      if (!findTheUser) {
        return res
          .status(210)
          .json({ message: "User with given phone no doesn't exist" });
      }
      const phone = "+91" + phoneInput;
      const verification = await client.verify
        .services(servicesid)
        .verifications.create({ to: phone, channel: "sms" });

      if (verification.status == "pending") {
        return res.status(200).json({ message: true });
      }
      if (verification.status != "pending") {
        return res
          .status(210)
          .json({ message: "Something went wrong,Please try again" });
      }
    } catch (e) {
      if (e.name == "Error") {
        return res.status(210).json({
          message: "Something went wrong,Once check your network connection",
        });
      }
    }
  })
);

// verifying otp
router.post(
  "/verifyotp",
  wrapAsync(async (req, res) => {
    try {
      const { otp, phoneInput } = req.body;
      const phone = "+91" + phoneInput;
      const check = await client.verify
        .services(servicesid)
        .verificationChecks.create({ to: phone, code: otp });
      if (check.status === "approved") {
        return res.status(200).json({
          message: "you are verified now",
        });
      }
      if (check.status !== "approved") {
        return res.status(210).json({
          message: "Entered code is wrong,please enter correct one",
        });
      }
    } catch (e) {
      if (e.name == "Error") {
        return res.status(210).json({
          message: "Something went wrong,Once check your network connection",
        });
      }
    }
  })
);

module.exports = router;
