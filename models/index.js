const mongoose = require("mongoose");
//Importing models
const User = require("./user.model.js");
const Job = require("./job.model");
const Applicant = require("./applicants.model.js");
const StaffingRequest = require('./staffing_request.model.js');
const Application = require('./applications.model.js')
const connectDB = async () => {
  console.log("running cdb");
  try {
    await mongoose.connect("mongodb://0.0.0.0:27017", {
      useNewUrlParser: true,
    });
    console.log("Conection established to test database at localhost 27017");
  } catch (err) {
    console.log(` unable to connect to the database due to : ${err}`);
    process.exit(1);
  }
};
const db = {
  connectDB: connectDB,
  Applicant: Applicant,
  User: User,
  Job: Job,
  StaffingRequest: StaffingRequest,
  Application: Application
};

module.exports = db;
