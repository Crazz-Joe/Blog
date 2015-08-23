var controls = require('../controls/admin_controls.js');

module.exports = function(app){
    // 管理员登录界面
    app.get('/admin/login', controls.login);
    // 管理员登录处理
    app.post('/admin/login', controls.login_process);
    // 管理员界面
    app.get('/admin', controls.admin)
};