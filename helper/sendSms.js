require("dotenv").config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const servicesid = process.env.VERIFY_SERVICE_SID;
const client = require("twilio")(accountSid, authToken);
module.exports.sendSms = (res, phoneInput) => {
  // client.messages
  //   .create({
  //     body: "all doneee",
  //     from: process.env.TWILIO_PHONE_NUMBER,
  //     to: "+919315312511",
  //   })
  //   .then((message) => console.log(message))
  //   .catch((e) => console.log(e));
  // `+${req.body.phoneNumber}`
  // console.log("sendSms now okayyy");
  client.verify
    .services(servicesid)
    .verifications.create({ to: "+918002047294", channel: "" })
    .then((verification) => console.log(verification))
    .catch((e) => {
      console.log(e);
      res.status(500).send(e);
    });
};

module.exports.verifyOtp = async (res) => {
  const check = await client.verify
    .services(servicesid)
    .verificationChecks.create({ to: "+918002047294", code: "751845" });
  if (check.status === "approved") {
    console.log(check);
  }
  // .catch((e) => {
  //   console.log(e);
  //   res.status(500).send(e);
  // });

  // return res.status(200).send(check);
};
