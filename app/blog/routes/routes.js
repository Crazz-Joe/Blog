var upload=require("../controls/upload_controls.js");
module.exports = function(app){
    //文件上传表单
    app.get("/upload",upload.showUpload);
    //处理上传文件
    app.post("/upload",upload.upload);
};