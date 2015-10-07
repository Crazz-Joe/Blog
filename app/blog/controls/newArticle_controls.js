/*
*Date:2015-10-07
*author:石佳楠&&郭昊
*version:1.0
*description:新建文章，用ueditor编辑器集成上传功能
*已实现的功能：新建文章存入数据库，多附件上传多条路径存入数据库
*/
var models = require('../models/models.js');

var ueditor=require("ueditor");

var path=require("path");

//编辑界面显示
exports.article=function(req,res){
    //定义session.file为数组    
    req.session.file=[];

    res.render("article_new",{
        title:"新建文章"
    });
}
//文章编辑-ueditor
exports.article_edit= ueditor(path.join(__dirname, '../../publics'), function(req,res,next){

    if (req.query.action==='uploadimage') {//上传单张图片
 
        var imgname=req.ueditor.filename;

        var img_url="/upload/images/";

        res.ue_up(img_url);//输入保存地址
    
    }else if(req.query.action==="listimage"){//上传多张图片及列出图片目录

        var dir_url="/upload/images/";

        res.ue_list(dir_url);//客户端会列出该目录下的所有图片
    
    }else if (req.query.action==='uploadfile') {//上传附件

        var filename=req.ueditor.filename;//原文件名

        var file_url="/upload/files/";

        res.ue_up(file_url);//输入保存地址

        //将文件名和路径存入session
        var obj={

                "fileName":filename,

                "filepath":req.ueditor.url
            }
        req.session.file.push(obj);
        //打印req.session.file属性
        console.log(Object.getOwnPropertyDescriptor(req.session, 'file'));

    }else if(req.query.action==="listfile"){//附件目录列表
        var dir_url="/upload/files/";

        res.ue_list(dir_url);//客户端会列出该目录下的所有文件
    
    }else{// 客户端发起其它请求
       
        res.setHeader("Content-type","application/json");

        res.redirect('/ueditor/nodejs/config.json');

    }

});

// 文章发布操作
exports.article_process = function(req, res){

    var articleTime = new Date(); //发布日期   
    
    var articleTitle = req.body.articleTitle;//标题
    
    var author = req.body.author;//作者
    
    var addTags = req.body.addTags.split(' ');//标签
    
    var editArticle = req.body.articleContent;//文章内容
    
    var publishBtn = req.body.publishBtn;//发布按钮
    
    var firstClass = req.body.firstClass;//一级分类

    var secondClass = req.body.secondClass;//二级分类
    
    var doc = {//实例化数据模型
        title: articleTitle,

        author: author,

        content: editArticle,

        time: articleTime,

        classes: {

            firstClass:firstClass,

            secondClass:secondClass

        },

        tag: addTags,

        files:req.session.file        
    };
    
    if(publishBtn === "发布"){
        
        models.Article.create(doc,function(error){
          
            if(error){
             
                console.error(error);
            
            }else{
              
                console.log("文章发布成功！");
                //将文章标题存入session
                req.session.articleTitle=articleTitle;
               
                res.render('article_new',{
                    msg:"文章发布成功！"
                })
                // res.redirect(303, '/article/show');
            }
        
        });
    
    }else{
      
        console.log("没有发布");
    
    }
};
