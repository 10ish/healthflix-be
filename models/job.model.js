const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    position: String,
    location: String,
    salaryNegotiable: Boolean,
    salary: Number,
    speciality: String,
    jobType: String,
    degree: String,
    requirements:String,
    benifits: String,
    description: String,
    questions: [String]


})

module.exports = mongoose.model('Job', JobSchema)