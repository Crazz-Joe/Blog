//测试文章显示
var models = require('../models/models.js');

exports.showArticles=function(req,res){
	models.Article.findOne({author:"nancy"},function(error,result){
		if (error){
			console.log(error);
		} 
		else{
			res.render('showArticles',{
			   title:"显示文章",
               mytitle:result.title,
               mycontent:result.content
			})	       
		}
	})
}