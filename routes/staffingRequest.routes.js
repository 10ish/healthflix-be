const staffingRequestController = require('../controllers/staffingRequest.controller');
const authValidator = require('../middlewares/authValidator')
module.exports = (app)=>{

app.post('/staffingRequests/submit', staffingRequestController.createStaffingRequest);
app.get('/staffingRequests',[authValidator.verifyAdminToken], staffingRequestController.getAllStaffingRequest);
app.delete('/staffingRequests/delete',[authValidator.verifyAdminToken], staffingRequestController.deleteStaffingRequest)
app.get('/staffingRequests/:id',[authValidator.verifyAdminToken], staffingRequestController.getOneStaffingRequest)

}