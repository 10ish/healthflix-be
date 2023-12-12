const db = require("../models/index.js");
const authConfig = require("../config/authConfig.js");
const salt = authConfig.salt;
const secret = authConfig.jwtSecretKey;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");

const Applicant = db.Applicant;
const Application = db.Application;

exports.register = async (req, res) => {
  // Initialize an empty object to store form data
  console.log('-----------------------------------------------')
  await console.log(req.body);
 
  bcrypt.hash(req.body.password.toString(), salt, async (err, hash) => {
    const userData = {
      fullName: req.body.fullName, 
      email: req.body.email, 
      password: hash, 
      position: req.body.position, 
      infoSource: req.body.infoSource,
      speciality: req.body.speciality, 
      notificationEnabled: req.body.notificationEnabled,
      contractType: req.body.contractType,

      
    }
    if(req.file){
      console.log('Yes')
      userData.resume= req.file.path;
    }
    if (err) {
      res.status(400).send({ message: "Error in hashing the password" });
      return;
    }

    try {
      const applicant = await Applicant.create(userData);
      res.status(200).send({ message: "User registered successfully" });
      console.log("Craeeated User with the name: " + applicant.fullName); // Assuming 'name' is a field in your form
    } catch (err) {
      res.status(500).send({ message: "Internal server error " + err });
      console.log(err);
    }
  });
};
// if (applicant.password === req.body.password) {
//   res.status(200).send({
//     message:
//       "The following details match . Welcome " + applicant.fullName,
//   });
//   return;
// } else {
//   res.status(400).send({ message: "The passwords do not match" });
//   return;
// }
exports.login = async (req, res) => {
  try {
    const applicant = await Applicant.findOne({ email: req.body.login });

    if (!applicant) {
      return res.status(404).send({
        message: "User with the following email does not exist",
      });
    }

    bcrypt.compare(
      req.body.password.toString(),
      applicant.password,
      (err, result) => {
        if (err) {
          res.status(400).send({ message: "Error in comparing" });
          return;
        }
        if (!result) {
          res.status(404).send({ message: "Password incorrect" });
          return;
        } else {
          const token = jwt.sign(
            { userId: applicant._id },
            authConfig.jwtSecretKey,
            {
              expiresIn: "1d",
            }
          );
          res.cookie("token", token, {
            httpOnly: true,
            path: '/',
            sameSite:'none',
            secure:true,
            maxAge: 2 * 24 * 60 * 60 * 1000 // 2 days in milliseconds
          });

          res.status(200).send({ message: "Logged in Successfully"});
        }
      }
    );
  } catch (err) {
    console.error(err); // Log the error for debugging, but don't expose it to clients
    res.status(500).send({ message: "Internal Server Error" });
  }
};
exports.getAllApplicants = async (req, res) => {
  try {
    const applicants = await Applicant.find({});
    res.status(200).send(applicants);
  } catch (err) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};

exports.deleteApplicant = async (req, res) => {
  try {
    await Applicant.deleteOne({ _id: req.body.id });
    res.status(201).send({ message: "Deleted Successfully" });
  } catch (err) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};
exports.getOneApplicant = async (req, res) => {
  let applicantId;

  if (!req.userId) {
    applicantId = req.params.id;
  } else {
    applicantId = req.userId;
  }

  try {
    const applicant = await Applicant.findOne({ _id: applicantId });
    if (!applicant) {
      res.status(404).send({ message: "Applicant does not exist" });
      return;
    }

    res.status(200).send(applicant);
  } catch (err) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};

exports.logout = async (req, res, next) => {
  console.log("--------------------------");
  try {
    await res.clearCookie("token");
    res.status(200).send({ message: "Logged Out Successfully" });
  } catch (err) {
    res.status(500).send({ message: "Unable to logout" });
  }
};
exports.getApplications = async (req, res) => {
  try {
    const applicantId = req.userId;
    const applications = await Application.find({ applicant: applicantId })
      .populate("job")
      .populate("applicant")
      .exec();
    if (!applications[0]) {
      res.status(400).send({ message: "No applications have been made yet" });
      return;
    }
    res.status(200).send(applications);
  } catch (err) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};

exports.changePassword = async (req, res) => {
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;

  const userId = req.userId;
  try {
    const applicant = await Applicant.findOne({ _id: userId });
    console.log(applicant);
    bcrypt.compare(
      oldPassword.toString(),
      applicant.password,
      (err, result) => {
        if (err) {
          res.status(400).send({ message: "error in hashing" });
          return;
        }
        if (!result) {
          res.status(404).send({ message: "Your old password is incorrect" });
          return;
        } else {
          bcrypt.hash(newPassword, salt, async (err, hash) => {
            if (err) {
              res.status(500).send({ message: "Error in hashing" });
              return;
            }
            try {
              await Applicant.updateOne({ _id: userId }, { password: hash });
              res
                .status(200)
                .send({ message: "Password Updated Successfully" });
            } catch (err) {
              res.status(500).send({ message: "Error updating password" });
            }
          });
        }
      }
    );
  } catch (err) {
    res.status(500).send({ message: "Internal Server Error " });
  }
};
exports.getJobAlertData = async (req, res) => {
  const userId = req.userId;
  try {
    const applicant = await Applicant.findOne({ _id: userId });
    res.status(200).send({
      notificationEnabled: applicant.notificationEnabled,
      jobAlertProfiles: applicant.jobAlertProfiles,
    });
  } catch (err) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};
exports.setNotificationEnabled = async (req, res) => {
  const userId = req.userId;
  console.log("-------------------------");
  console.log(req.body);
  const notificationEnabled = req.body.notificationEnabled;
  try {
    const result = await Applicant.findByIdAndUpdate(
      { _id: userId },
      { notificationEnabled }
    );
    console.log(result);
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};
exports.addJobAlertProfile = async (req, res) => {
  const userId = req.userId;
  const jobAlertProfile = {
    id: new mongoose.Types.ObjectId(),
    title: req.body.postData.profileTitle,
    jobType: req.body.postData.jobType,
    speciality: req.body.postData.speciality,
    location: req.body.postData.location,
  };

  try {
    const applicant = await Applicant.findOne({ _id: userId });
    if (applicant) {
      applicant.jobAlertProfiles.push(jobAlertProfile);
      const updatedApplicant = await applicant.save();
      console.log(updatedApplicant);
      res.status(200).send({ message: "Job Alert Profile added successfully" });
    }
  } catch (err) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};
exports.deleteJobAlertProfile = async (req,res)=>{
  
}
exports.addDocument = async (req,res)=>{

}
