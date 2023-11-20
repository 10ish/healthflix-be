const { type } = require('express/lib/response');
const mongoose = require('mongoose');
const ApplicationSchema = mongoose.Schema({
    applicant : {type:mongoose.Types.ObjectId, ref:'Applicant'},
     job: {type:mongoose.Types.ObjectId, ref: 'Job'},
     questions: [Object]
})

module.exports = mongoose.model('Application', ApplicationSchema)