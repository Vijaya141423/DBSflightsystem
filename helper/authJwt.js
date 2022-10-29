require("dotenv").config();
const jwt = require("jsonwebtoken");
const JWT_ACC_ACTIVATE = process.env.JWT_ACC_ACTIVATE;
const User = require("../model/user");
// var decoded = jwt.decode(id, { complete: true })
// const exp = decoded.payload.exp
module.exports.verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res
      .status(202)
      .json({ message: "Something went wrong,Please try again" });
  }
  jwt.verify(token, JWT_ACC_ACTIVATE, (err, decoded) => {
    if (err) {
      return res.status(202).json({ message: "Unauthorized user!" });
    }
    req.userId = decoded.id;

    next();
  });
};

//isAdmin
module.exports.isAdmin = async (req, res, next) => {
  const user = await User.findById(req.userId);
  if (user?.admin || user?.superadmin) {
    next();
  } else {
    return res
      .status(202)
      .json({ message: "Please login as admin for access of this page" });
  }
};
// only for getting id
module.exports.forIdPurpose = (req, token) => {
  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }
  jwt.verify(token, JWT_ACC_ACTIVATE, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.id = decoded.id;
  });
  return req.id;
};
