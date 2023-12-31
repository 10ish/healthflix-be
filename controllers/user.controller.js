const db = require("../models/index");
const User = db.User;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authConfig = require("../config/authConfig");
exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.login });
    if (!user) {
      res.status(404).send({ message: "There is no admin with such username" });
      return;
    }
    bcrypt.compare(
      req.body.password.toString(),
      user.password,
      (err, result) => {
        if (err) {
          res.status(404).send({ message: "Error in comparing" });
          return;
        }
        if (!result) {
          res.status(404).send({ message: "Password incorrect" });
          return;
        } else {
          const token = jwt.sign(
            { adminId: user._id },
            authConfig.jwtSecretKey,
            {
              expiresIn: "1d",
            }
          );
      res.cookie("adminToken", token, {
            httpOnly: true,
            path: '/',
            sameSite:'none',
         domain: '.vercel.app',
            secure:true,
            maxAge: 1 * 24 * 60 * 60 * 1000 // 2 days in milliseconds
          });

          res.status(200).send({ message: "Logged in Successfully", token});
        }
      }
    );
  } catch (err) {
    res.status(500).send({ message: "InternalServer Error" });
  }
};
exports.logout = async (req, res, next) => {
  try {
    const cookies = req.headers.cookie || '';
    const parsedCookies = cookies.split(';').reduce((cookiesObj, cookie) => {
      const [name, value] = cookie.trim().split('=');
      cookiesObj[name] = value;
      return cookiesObj;
    }, {});

    Object.keys(parsedCookies).forEach((cookieName) => {
      if (cookieName.trim() === 'adminToken') {
        res.clearCookie(cookieName.trim());
      }
    });

    res.status(200).send({ message: "Logged Out Successfully" });
  } catch (err) {
    res.status(500).send({ message: "Unable to logout" });
  }
};

