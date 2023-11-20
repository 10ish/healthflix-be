const db = require("../models");
const Applicant = db.Applicant;
exports.validateEmail = async (req, res, next) => {
  const email = req.body.email
  try {
    const applicant = await Applicant.findOne({ email:email });
    if (applicant) {
      res
        .status(400)
        .send({ message: "User with the following email already exists!" });
      return;
    }
    next();

  } catch (err) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};
