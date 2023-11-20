const mongoose = require('mongoose');

const ApplicantSchema = mongoose.Schema({
    resume: String,
    fullName: String,
    email: String,
    password: String,
    position: String,
    infoSource: String,
    contractType: String,
    speciality: String,
    notificationEnabled: {type:Boolean,default:false },
    jobAlertProfiles :[Object],
    resume:String,
    documents: [Object]
}
    

)
module.exports = mongoose.model('Applicant', ApplicantSchema)