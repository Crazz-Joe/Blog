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
    req.session.user = req.body.user;
    var user = req.body.user;
    var pwd = req.body.pwd;
    models.users.find({userName: user, password: pwd}, function(err, users){
        if(err) return console.error(err);
        if(users.length){
            var context = users[0];
            console.log('用户' + context.userName + '登录');
            res.redirect(303, '/informAudit');
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

//审核页面显示
exports.informAudit = function(req,res){
    var dataArray = []; //定义数据
    console.log(req.session.user);
    if (req.session.user) {
        models.users.findOne({userName:req.session.user},function(err,current){
            if(err) return console.error(err);
            if (current) {
                if(current.control.userClass == "root"){
                    models.users.find({"through":false},function(err,alldata){
                        if (err) console.log(err);
                        alldata.forEach(function(item){
                            dataArray.push({
                                username:item.userName,
                                truename:item.trueName,
                                email:item.email
                            });
                        });
                        res.render('informAudit',{
                            curUser:req.session.user,
                            group:dataArray,
                        });
                    });
                }else {
                    console.log('该用户没有权限');
                }
            }else{
                console.log('没有找到数据');
            }
        });
    }else{
        console.log('未登录');
    }
}

//pass 模块
exports.pass = function(req,res){
    if (req.body.user) {
        models.users.update({'userName':req.body.user,'trueName':req.body.trueNa},{$set:{'through':true}},function(error){
            if (error) return console.error(error);
            var callback = {
                Code:1,
                message:"success",
            };
            res.send(JSON.stringify(callback));
        })
    };
}
