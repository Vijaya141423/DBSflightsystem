const mongoose = require("mongoose");
const PurchaseShema = new mongoose.Schema(
  {
    amount: Number,
    totalamount: Number,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    date: String,
    timing: String,
    orderId: String,
    txnId: String,
    status: String,
    phoneNo: String,
  },
  { timestamps: true }
);
module.exports = mongoose.model("Purchase", PurchaseShema);
