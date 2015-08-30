$(document).ready(function() {
	$("#upBtn").click(function(){
		// $("form").submit(function(e){
		// 	e.preventDefault();
		// })
	    $.post('../blog/controls/upload_controls.js',function(data, textStatus, xhr) {
	    	/*optional stuff to do after success */
	    	alert("success");
	    });
		var filepath=$("#file").val();
		 if(filepath) {
			var arr=filepath.split("\\");
			var filename=arr[arr.length-1];
			$(".uplist").append("<li>"+filename+"</li>");
		};
	})
});