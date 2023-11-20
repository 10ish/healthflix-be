const applicantController = require('../controllers/applicant.controller');

const signupValidator = require('../middlewares/signupValidator')
const authValidator = require('../middlewares/authValidator')
const upload = require('../middlewares/upload')



module.exports = (app)=>{
    app.get('/applicants/user', [authValidator.verifyUserToken], applicantController.getOneApplicant);
    app.get('/applicants/getJobAlertData', [authValidator.verifyUserToken], applicantController.getJobAlertData);
    app.post('/applicants/addJobAlertProfile', [authValidator.verifyUserToken], applicantController.addJobAlertProfile)
    app.delete('/applicants/deleteJobAlertProfile', [authValidator.verifyUserToken], applicantController.deleteJobAlertProfile)
    app.post('/applicants/addDocument',[authValidator.verifyUserToken, upload.single('document')], applicantController.addDocument)
    app.post('/applicants/setNotificationsEnabled', [authValidator.verifyUserToken], applicantController.setNotificationEnabled)
    app.get('/applicants/getApplications',[authValidator.verifyUserToken], applicantController.getApplications)
    app.get('/applicants/logout', applicantController.logout)
    app.get('/applicants',[authValidator.verifyAdminToken],applicantController.getAllApplicants)
    app.post('/applicants/register',[upload.single('resume'),signupValidator.validateEmail, ],applicantController.register);
    app.post('/applicants/login', applicantController.login);
    app.delete('/applicants/delete', [authValidator.verifyAdminToken],applicantController.deleteApplicant)
    app.get('/applicants/:id', applicantController.getOneApplicant);
    app.post('/applicants/changePassword', [authValidator.verifyUserToken],applicantController.changePassword);

  
    

}