const db = require("../models/index.js");
const Application = db.Application;
const Job = db.Job;
exports.createApplication = async (req, res) => {
  
  const applicationBody = {
    applicant: req.userId,
    job: req.body.jobId,
    questions: req.body.questionDetails,
  };

  try {
    const application = await Application.create(applicationBody);
  
    res.status(201).send(application);
  } catch (err) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};

exports.getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find({})
      .populate("job")
      .populate("applicant")  
      .exec();
    res.status(200).send(applications);
  } catch {
    res.status(500).send({ message: "Internal Server Error" });
  }
};
exports.getOneApplication = async (req, res) => {
  const applicationId = req.params.id;
 

  try {
    const application = await Application.findOne({ _id: applicationId })
      .populate("job")
      .populate("applicant")
      .exec();
    
    res.status(200).send(application);
  } catch {
    res.status(500).send({ message: "Internal Server Error" });
  }
};
exports.deleteOneApplication = async (req, res) => {
  try {
    const application = await Application.deleteOne({ _id: req.body.id });
    res.status(200).send({ message: "Deleted Succesfully" });
  } catch (err) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};
