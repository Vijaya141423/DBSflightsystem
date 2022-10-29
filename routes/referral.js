const router = require("express").Router();
const User = require("../model/user");
const Referral = require("../model/referral");
const { verifyToken, forIdPurpose } = require("../helper/authJwt");
const wrapAsync = require("../controlError/wrapAsync");
const AppError = require("../controlError/AppError");
router.post(
  "/",
  [verifyToken],
  wrapAsync(async (req, res) => {
    const { code } = req.body;
    // now finding the user from here
    const user_having_code = await User.findOne({ referalCode: code });
    if (user_having_code?._id == req.userId) {
      return res
        .status(210)
        .json({ message: "You can't enter your own Referal code." });
    }
    if (user_having_code) {
      const alredyReffered = await Referral.findOne({
        referbyUser: user_having_code?._id,
      });
      if (alredyReffered) {
        alredyReffered.referdUser = [...alredyReffered.referdUser, req.userId];
        await alredyReffered.save();
      } else {
        const newRefferal = new Referral({
          referbyUser: user_having_code._id,
        });
        newRefferal.referdUser[0] = req.userId;
        await newRefferal.save();
      }
    } else {
      return res
        .status(210)
        .json({ message: "Given Referral code is not belong to any user" });
    }
    return res
      .status(200)
      .json({ message: "Given code is used as a Referral code" });
  })
);

module.exports = router;
