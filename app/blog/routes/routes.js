var upload=require("../controls/upload_controls.js");

var showArticle=require("../controls/showArticles_controls.js");

var newArticle=require("../controls/newArticle_controls.js");

module.exports = function(app){
    //文件上传表单
    // app.get("/article/upload",upload.showUpload);
    //处理上传文件
    // app.post("/article/upload",upload.upload);

    //新建文章界面
    app.get('/article/new', newArticle.article);
    // 编辑文章
    app.use('/article/ue', newArticle.article_edit);
    //发布存储文章
    app.post('/article/new',newArticle.article_process)
    
    //文章显示
    app.get("/article/show",showArticle.showArticles);

    
};