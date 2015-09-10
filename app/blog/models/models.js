var mongoose = require('mongoose');
// 模型的构建

// 创建模式
// 只存权限模式
// var controlSchema = mongoose.Schema({
//     admin: {
//         1: '所属用户组添加用户',
//         2: '所属用户组修改用户',
//         3: '所属用户组删除用户',
//         4: '所属用户组添加管理员及其权限',
//         5: '所属用户组修改管理员及其权限',
//         6: '所属用户组删除管理员及其权限',
//         7: '所属用户组操作用户文章',
//         8: '所属用户组操作用户评论',
//         9: '所属用户组操作标签'
//     }
// });
// 用户模式
var userSchema = mongoose.Schema({
    trueName: String,
    userName: String,
    password: String,
    email: String,
    group: [String], //用户所属的组
    phone: String,
    control: {
        sign: String, //一串能够指明用户有哪些权限的数据, 从左到右分别对应controls.admin中的1~9
        userClass: String //用户类型，如果是管理员则为admin
    },
    through: Boolean
});
// 文章模式
var articleSchema = mongoose.Schema({
    title: String,
    author: String,
    content: String,
    time: Date,
    classes: {
        // 待写
        // 格式为
        // 一级分组：{
            // 二级分组: class
            // }
    }, //文章所属分组
    tag: [String], //标签
    comments: {
        users: [{
            userName: String,
            content: String,
            time: Date
        }], //用户留言
        visitor: [{
            userEmail: String,
            content: String,
            time: Date
        }] //游客留言
    },
    files: [{
        // 待写
        // 格式为"fileName: url"
    }]
});

// 绑定模型
// 用户模型
var User = mongoose.model('User', userSchema);
var Article = mongoose.model('Article', articleSchema);

// 初始化，添加最高权限用户root
User.find(function(err, users){
    if(users.length)
        return;
    new User({
        trueName: '帖军',
        userName: 'root',
        password: 'root',
        email: '',
        group: [
            'FeWeb',
            'Android',
            'J2EE',
            'PHP',
            'Database',
            'C++',
            'iOS',
            '.Net'
        ],
        phone: '',
        control: {
            sign: '',
            userClass: 'root'
        },
        through: true
    }).save(function(err, docs){
        if(err) return console.log(err);
        console.dir(docs);
    });
});

// 导出模型
exports.User = User;
exports.Article = Article;