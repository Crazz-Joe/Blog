var controls = require('../controls/admin_controls.js');

module.exports = function(app){
    // 管理员登录界面
    app.get('/admin/login', controls.login);
    // 管理员登录处理
    app.post('/admin/login', controls.login_process);
    // 管理员界面
    app.get('/admin', controls.admin);
    // 添加管理员界面
    app.get('/admin/add', controls.admin_add);
    // 管理员添加处理
    app.post('/admin/add', controls.admin_add_process);
    // 管理员添加成功
    app.get('/admin/add/success', controls.admin_add_success);
    // 修改管理员信息列表页面
    app.get('/admin/list', controls.admin_list);
    // 管理员修改页面
    app.get('/admin/edit/:username', controls.admin_edit);
    //审核页面
    app.get('/informAudit',controls.informAudit);
    //pass url
    app.post('/pass',controls.pass);
};