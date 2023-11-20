const db = require("../models/index.js");
const Job = db.Job;
const mongoose = require("mongoose");

exports.getJobs = async (req, res) => {
  try {
    const jobsData = await Job.find({});
    res.status(200).send(jobsData);
  } catch (err) {
    res
      .status(500)
      .send(`Unable to fetch the data from jobs due to ${err.message}`);
  }
};
exports.createJob = async (req, res) => {
  const jobData = req.body;
  console.log(req.body)


  try {
    const job = await Job.create(jobData);
    res.status(200).send(job);
  } catch (err) {
    res.status(500).send({ message: `Internal Server Error ${err.message}` });
    console.log(err)
  }
};


exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.deleteOne({ _id: req.body.id });
    res.status(200).send(job);
  } catch (err) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};

exports.getOneJob = async (req, res) => {
  const jobId = req.params.id;

  try {
    const job = await Job.findOne({ _id: jobId });
    if (!job) {
      res.status(404).send({ message: "Applicant does not exist" });
      return;
    }

    res.status(200).send(job);
  } catch (err) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};
exports.updateOneJob = async (req, res) => {
  const jobId = req.params.id;
  console.log(req.body)
  try {
    await Job.findByIdAndUpdate({ _id: jobId }, req.body);
    res.status(201).send({ message: "Job updated successfully" });
  } catch (err) {
    res
      .status(500)
      .send({ message: "Unable to update job due to internal server error" });
  }
};


