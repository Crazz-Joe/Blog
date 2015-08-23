var models = require('../models/models.js');
// 管理员后台控制器

// 登录页面
exports.login = function(req, res){
    res.render('admin_login', {
        title: '管理员登录',
        err: false
    });
};
// 登录处理
exports.login_process = function(req, res){
    var user = req.body.user;
    var pwd = req.body.pwd;
    models.users.find({userName: user, password: pwd}, function(err, users){
        if(err) return console.error(err);
        if(users.length){
            var context = users[0];
            console.log('用户' + context.userName + '登录');
            res.redirect(303, '/admin');
        }
        else{
            console.log('用户名或密码错误');
            res.render('admin_login', {
                title: '管理员登录',
                err: true,
                signal: '用户名或密码错误'
            });
        }
    });
};
// 管理员界面
exports.admin = function(req, res){
    res.render('admin');
};