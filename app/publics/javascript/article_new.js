$(function(){
	var jsonUrl="/javascript/articleClasses.json";
	$.getJSON(jsonUrl, function(data) {
	   //初始化firstClass
	   $(data).each(function(){
		$("#firstClass").append($("<option/>").text(this.firstClass).attr("value",this.firstClass));
	   });
	   //初始化secondClass
	   getSecondClass(data);	
	   //firstClass-secondClass联动
	   $("#firstClass").change(function(){
	     getSecondClass(data);
	   });
	});
	});

	function getSecondClass(data){
	    //清除secondClass下拉列表
	    $("#secondClass").empty();
	    var pName=$("#firstClass option:selected").text();//获取选中的firstClass
	    data.forEach(function(item){//此data是返回的JSON数据
	       if (item.firstClass==pName) {//如果遍历的firstClass的值等于当前选中值
	           //添加相应的secondClass
	           item.secondClass.forEach(function(i){
		      $("#secondClass").append($("<option/>").text(i).attr("value",i));
		   });						
	       };
	    });		
}
// //添加标签
// var hasAdded = document.getElementById('hasAdded');
// var addBtn = document.getElementById('addBtn');
// addBtn.onclick = function(){
// 	var addTags = document.getElementById('addTags').value;
// 	var tags = addTags;
// 	console.log(tags);
// 	hasAdded.innerHTML += tags;
// };