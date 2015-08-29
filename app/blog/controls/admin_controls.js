var models = require('../models/models.js');
// 管理员后台控制器

var toArray = function(data){
    if(typeof(data) === 'string'){
        data = [data];
        return data;
    }
    return data;
}

var isEnpty = function(data){
    for(item in data){
        return false;// 不为空
    }
    return true;// 为空
}

// 登录页面
exports.login = function(req, res){
    res.render('admin_login', {
        title: '管理员登录',
        err: false
    });
};
// 登录处理
exports.login_process = function(req, res){
    req.session.user = req.body.user;
    var user = req.body.user;
    var pwd = req.body.pwd;
    models.User.find({userName: user, password: pwd}, function(err, users){
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
    if(req.session.user){
        console.log(req.session);
        res.render('admin', {
            title: '管理员操作界面',
            username: req.session.user
        });
    }
    else{
        res.redirect(303, '/admin/login');
    }
};
// 添加管理员
exports.admin_add = function(req, res){
    console.log("Go");
    models.User.find({userName: req.session.user}, function(err, users){
        if(err) return console.error(err);
        if(users.length){
            var groups = users[0].group;
            res.render('admin_add', {
                title: '添加管理员',
                groups: groups
            });
        }
        else{
            res.redirect(303, '/admin/login');
        }
    });
};
// 添加管理员处理函数
exports.admin_add_process = function(req, res){
    var newUser = req.body.username;
    var newEmail = req.body.email;
    var newPhone = req.body.phone;
    models.User.find({
        $or: [
            {userName: newUser},
            {email: newEmail},
            {phone: newPhone}
        ]
    }, function(err, users){
        if(err) return console.error(err);
        console.log(users);
        // 将单个字符串放进数组中
        req.body.group = toArray(req.body.group);
        console.log(req.body);
        console.log(typeof(users));
        if(isEnpty(users)){
            models.User.create({
                trueName: req.body.truename,
                userName: req.body.username,
                password: req.body.password,
                email: req.body.email,
                phone: req.body.phone,
                through: false,
                control: {
                    userClass: 'admin'
                },
                group: req.body.group
            }, function(err, datas){
                if(err) return console.error(err);
                res.redirect(303, '/admin/add/success');
            });
        }
        else{
            console.log(users);
            res.render('admin_add', {
                error: true,
                signal: '对不起，用户名或手机号或邮箱重复！',
                title: '添加管理员',
                groups: users[0].group
            });
        }
    });
};
// 添加管理员成功页面
exports.admin_add_success = function(req, res){
    res.render('success.html');
};

