const jobController = require('../controllers/job.controller');
const authValidator = require('../middlewares/authValidator')

module.exports = (app)=>{

app.get('/jobs',jobController.getJobs);
app.post('/jobs/add',[authValidator.verifyAdminToken], jobController.createJob);
app.delete('/jobs/delete', [authValidator.verifyAdminToken],jobController.deleteJob);
app.get('/jobs/:id', jobController.getOneJob);
app.patch('/jobs/update/:id', [authValidator.verifyAdminToken],jobController.updateOneJob);


}
