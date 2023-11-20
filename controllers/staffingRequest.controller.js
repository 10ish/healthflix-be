const db = require("../models/index");
const StaffingRequest = db.StaffingRequest;

exports.createStaffingRequest = async (req, res) => {
  try {
    const staffingRequest = await StaffingRequest.create(req.body);
    console.log('Staffing request created successfully'+staffingRequest)
    res.status(201).send({message: `Staffing request created successfully for  the name of ${staffingRequest.fullName}`})
  } catch (err) {
    res.status(500).send({message: `Unable to create the staffing request due to internal server error ${err}`})

  }
};
exports.getAllStaffingRequest = async (req,res)=>{

  try{
const staffingRequest = await StaffingRequest.find({})
res.status(201).send(staffingRequest)
  }
  catch(err){
res.status(500).send({message:'Internal Server Error'})
  }
}
exports.deleteStaffingRequest = async (req,res)=>{
  try{
     await StaffingRequest.deleteOne({_id: req.body.id})
    res.status(200).send({message: 'Staffing request Deleted Successfuly'})
  }
  catch(err){
res.status(500).send({message:'Internal Server Error'})
  }
}
exports.getOneStaffingRequest = async (req, res) => {
  const staffingReqId = req.params.id;

  try {
    const staffingRequest = await StaffingRequest.findOne({ _id: staffingReqId });
    if (!staffingRequest) {
      res.status(404).send({ message: "Applicant does not exist" });
    }
   
    res.status(200).send(staffingRequest);
  } catch (err) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};
