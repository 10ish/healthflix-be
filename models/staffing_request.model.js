const mongoose = require("mongoose");

const StaffingRequestSchema = mongoose.Schema({
  title: String,
  fullName: String,
  contact: Number,
  email: String,
  position: String,
  company: String,
  organization: String,
  requirements: String,
  comments: String,
});

module.exports = mongoose.model("Staffing_request", StaffingRequestSchema);
