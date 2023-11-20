const userController = require('../controllers/user.controller');
const authValidator  = require('../middlewares/authValidator')

module.exports = (app)=>{
    app.post('/admin/login',userController.login)
    app.get('/admin/logout', userController.logout)
}