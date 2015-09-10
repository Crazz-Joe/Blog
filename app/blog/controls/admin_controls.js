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

// 判断元素是否为数组的成员
var contain = function(arr, obj){
    var i = arr.length;
    while(i--){
        if(arr[i] === obj){
            return true;
        }
    }
    return false;
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

// 修改管理员——显示能被修改的管理员用户名邮箱，审核情况
exports.admin_list = function(req, res){
    // 根据登录用户名返回登录用户的所属组
    models.User.findOne({userName: req.session.user}, function(err, current){
        // 找到current（当前用户文档）后的回调函数
        // 错误处理
        if(err) return console.error(err);
        // 找到所有用户并开始筛选
        models.User.find({}, function(err, all){
            var child; //定义查找用户是否为当前用户的子集
            var edit_user = []; //定义当前用户能编辑的用户列表
            if(err) return console.error(err);
            // 对每个用户的文档进行遍历
            all.forEach(function(each){
                // each 是当前遍历到的用户文档
                // 对group进行遍历
                for(var k = 0; k < each.group.length; k++){
                    // 判断item是否在current.group中
                    child = contain(current.group, each.group[k]);
                }
                console.log(child);
                // 对满足为当前用户的子集条件的加入到可编辑用户列表里
                if(child === true){
                    edit_user.push({
                        truename: each.trueName,
                        username: each.userName,
                        email: each.email,
                        through: each.through
                    });
                }
            });
            // 调试输出可编辑用户列表
            console.log(edit_user);
            res.render('admin_list', {
                title: '修改可修改管理员信息',
                username: req.session.user,
                groups: edit_user
            });
        })
    });
};

exports.admin_edit = function(req, res){
    console.log(req.query.username);
    models.User.findOne({userName: req.query.username}, function(err, one){
        // one代表找到的用户的文档
        res.render('admin_edit');
    });
}
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