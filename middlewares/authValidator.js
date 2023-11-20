const jwt = require("jsonwebtoken");
const authConfig = require("../config/authConfig");
const secret = authConfig.jwtSecretKey;

 exports.verifyUserToken = (req, res, next) => {
  let token = req.cookies.token;




  //console.log(req.headers)
  if (!token) {
    //if no token exists
    res.status(403).send({ message: "No token provided" });
    return;
  }
  //if it exists then verifying
  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      res.status(401).send({ message: "Unauthorised, Please login" });
      return;
    }
    req.userId = decoded.userId;
    next();

  });
};
exports.verifyAdminToken = (req, res, next) => {
  let token = req.cookies.adminToken;




  //console.log(req.headers)
  if (!token) {
    //if no token exists
    res.status(403).send({ message: "No token provided" });
    return;
  }
  //if it exists then verifying
  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      res.status(401).send({ message: "Unauthorised,Admin Rights Required" });
      return;
    }
    req.adminId = decoded.adminId;
    next();

  });
};

