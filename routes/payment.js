const router = require("express").Router();
const PaytmChecksum = require("../helper/paytm-checksum");
const formidable = require("formidable");
const { verifyToken } = require("../helper/authJwt");
const PurchaseOfUser = require("../model/purchaseofuser");
const { timingFormat, IST } = require("../helper/date");
const wrapAsync = require("../controlError/wrapAsync");
const User = require("../model/user");
const DOMAIN = process.env.DOMAIN;
const DOMAIN_CLIENT = process.env.DOMAIN_CLIENT;

// data will initiate from here for transaction with paytmmmm..
router.post(
  "/",
  [verifyToken],
  wrapAsync(async (req, res) => {
    try {
      // function checkInternet(cb) {
      //   require("dns").lookup("google.com", function (err) {
      //     if (err && err.code == "ENOTFOUND") {
      //       cb(false);
      //     } else {
      //       cb(true);
      //     }
      //   });
      // }

      // // example usage:
      // checkInternet(function (isConnected) {
      //   if (isConnected) {
      //     // connected to the internet
      //     console.log("connected");
      //   } else {
      //     return res.status(210).json({
      //       message: "Please check your network connection",
      //     });
      //     // not connected to the internet
      //   }
      // });

      // from here..... okayyyy

      let { amount } = req.body;
      const user = await User.findOne({ _id: req.userId });
      const phoneNo = user.phoneNo;
      var paytmParams = {};
      /* initialize an array */
      paytmParams["MID"] = process.env.PAYTM_MID;
      paytmParams["ORDER_ID"] = "Order_" + new Date().getTime();
      paytmParams["WEBSITE"] = process.env.PAYTM_WEBSITE;
      paytmParams["TXN_AMOUNT"] = amount.toString();
      paytmParams["CUST_ID"] = phoneNo.toString();
      paytmParams["CALLBACK_URL"] = `${DOMAIN}/api/payment/callback`;

      var paytmChecksum = PaytmChecksum.generateSignature(
        paytmParams,
        process.env.PAYTM_MERCHANT_KEY
      );
      paytmChecksum
        .then((checksum) => {
          paytmParams["CHECKSUMHASH"] = checksum;
          return res.status(200).json(paytmParams);
        })
        .catch(console.log);
    } catch (e) {
      console.log(e, "new error");
      return res.status(210).json({
        message:
          "Something went wrong,Once check your network connection and try again",
      });
    }
  })
);

// once the transaction will compelete paytm will send the
// response to callback urlll..
router.post(
  "/callback",
  wrapAsync(async (req, res) => {
    const form = new formidable.IncomingForm();
    form.parse(req, (err, fields, file) => {});
    const paytmChecksum = req.body.CHECKSUMHASH;
    delete req.body.CHECKSUMHASH;

    var isVerifySignature = PaytmChecksum.verifySignature(
      req.body,
      process.env.PAYTM_MERCHANT_KEY,
      paytmChecksum
    );
    if (isVerifySignature) {
      const { ORDERID, TXNID, TXNAMOUNT, STATUS } = req.body;
      const url = `${DOMAIN_CLIENT}/coin?ORDERID=${ORDERID}&TXNID=${TXNID}&TXNAMOUNT=${TXNAMOUNT}&STATUS=${STATUS}`;
      res.redirect(url);
    } else {
      // something went wrong wala message dikhana haiiii
      res.redirect(`${DOMAIN_CLIENT}/failed`);
    }
  })
);

// updating the purchaseofuser database with below route.
router.post(
  "/success",
  [verifyToken],
  wrapAsync(async (req, res) => {
    const { ORDERID, TXNID, TXNAMOUNT, STATUS } = req.body;
    var totalamount;
    const totalAmountData = await PurchaseOfUser.find({ user: req.userId });
    if (totalAmountData.length > 0) {
      totalamount =
        totalAmountData[totalAmountData.length - 1].totalamount +
        parseInt(TXNAMOUNT);
    } else {
      totalamount = parseInt(TXNAMOUNT);
    }
    // const totalamount = (await totalAmount(req.userId)) + parseInt(TXNAMOUNT);

    const existingTxn = await PurchaseOfUser.find({
      orderId: ORDERID,
      txnId: TXNID,
    }).lean();

    if (existingTxn.length) {
      return res.status(200).json({
        status: "success",
        msg: "Transaction already updated with database.",
      });
    }

    const newTransaction = new PurchaseOfUser({
      orderId: ORDERID,
      txnId: TXNID,
      amount: parseInt(TXNAMOUNT),
      status: STATUS,
      user: req.userId,
      date: timingFormat().dateTosave,
      timing: IST(),
      totalamount,
    });
    await newTransaction.save();
    const user = await User.findOne({ _id: req.userId });
    user.transactionDone = true;
    // if (user?.purchaseofuser?.length > 0) {
    //   user.purchaseofuser[user.purchaseofuser.length] = {
    //     purchase: newTransaction._id,
    //   };
    // } else if (user.purchaseofuser.length == 0) {
    //   user.purchaseofuser[0] = { purchase: newTransaction._id };
    // }
    user.purchaseofuser = [...user.purchaseofuser, newTransaction._id];
    await user.save();
    return res.status(200).send(newTransaction);
  })
);

// after completion of transaction we will show user a complete
// transaction done by him or her.
router.get(
  "/all",
  [verifyToken],
  wrapAsync(async (req, res) => {
    const allData = await PurchaseOfUser.find({
      user: req.userId,
    }).sort({
      createdAt: -1,
    });
    return res.status(200).json(allData[0]);
  })
);

module.exports = router;
