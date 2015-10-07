/*
*Date:2015-9-15
*author:石佳楠
*version:1.0
*description:上传文件
*已实现的功能：多文件上传写入数据库
*/
var formidable=require("formidable");
var fs=require("fs");
var path=require("path");
var util=require("util");
var models=require("../models/models.js");
//删除上传失败的临时文件
function deleTemp (filePath) {
	fs.unlink(filePath, function(err) {
	    if (err) {
	        console.info("临时文件删除失败");
	        console.info(err);
	    } else {
	        console.info("删除成功");
	    }
	});
}
//操作数据库,保存文件路径
function saveFilePath(file,fileName){
		models.Article.update(
			{title:"",author:"nancy"},
			{$push:{
				files:
	    			{
	                  fileName:file.filepath.name,
	                  filepath:"/uploads/"+fileName
	                }
	            
			}},function(err,data){
				if (err) return console.log(err);
				console.log(data);
			}		
		)	
}
exports.showUpload=function(req,res){
	res.render("upload",{
		title:"文件上传"
	});
}
exports.upload=function(req,res){

	var form=new formidable.IncomingForm();
	form.maxFieldsSize=10*1024*1024;//文件最大为10M
	form.keepExtensions = true;//使用文件的原扩展名
	//文件移动的目录文件夹，不存在时创建目标文件夹
	var targetDir=path.join('./publics/uploads');
	if (!fs.existsSync(targetDir))  fs.mkdir(targetDir);
	//临时文件目录,不存在则创建
    form.uploadDir=path.join('./publics/uploads/temp');
    if (!fs.existsSync(form.uploadDir)) fs.mkdir(form.uploadDir);

	form.parse(req, function (err, fields, file) {
		if (err) {
          console.log("发生错误:"+err);
		  deleTemp(filePath);//删除临时文件
		}
		var filePath="";
		//从临时文件中遍历第一个上传的文件
		if (file.filepath) {
			filePath=file.filepath.path;
		}else{
			for(var key in file){
				if (file[key].path&&filePath==='') {
					filePath=file[key].path;
					break;
				};
			}
		}	
		//截取文件扩展名,例如.jpg
		var fileExt=filePath.substring(filePath.lastIndexOf('.'));
		//判断文件类型是否允许上传
		if (('.jpg.jpeg.png.gif.psd.docx.doc.xls.xlsx..pptx.ppt.pdf.zip.rar').indexOf(fileExt.toLowerCase())===-1) {
			var err = new Error('此文件类型不允许上传');
            res.json({code:-1, message:'此文件类型不允许上传'});
            deleTemp(filePath);//删除临时文件
		}else{
			var imgType=('.jpg.jpeg.png.gif').indexOf(fileExt.toLowerCase());
			var d=new Date();
			var fileName="";
			fileName=d.getFullYear()+""+(d.getMonth()+1)+d.getDate()+d.getHours()+d.getMinutes()+d.getSeconds()+fileExt;
			var targetFile=path.join(targetDir,fileName);
			//移动文件
			fs.rename(filePath,targetFile,function(err){
                if (err) {
                	console.log(err);
                	res.json({code:-1, message:'操作失败'});
                	deleTemp(filePath);//删除临时文件
                }else{
                	//上传成功,存入数据库
                	saveFilePath(file,fileName);

                    res.redirect(303, '/article/new');

                }
			});			
		}		
	})
}