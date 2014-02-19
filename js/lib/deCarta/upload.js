/*$(document).ready(function(){
	var options = { 
		beforeSend: function(){
			$("#progress").show();
			//clear everything
			$("#bar").width('0%');
			$("#message").html("");
			$("#percent").html("0%");
		},
		uploadProgress: function(event, position, total, percentComplete) 
		{
			$("#bar").width(percentComplete+'%');
			$("#percent").html(percentComplete+'%');
		},
		success: function(){
			$("#bar").width('100%');
			$("#percent").html('100%');
			},
		complete: function(response) {
			//$("#message").html("<font color='green'> [["+response.responseText+"]]</font>");
			var jsonObj = $.parseJSON(response.responseText);
			console.log(jsonObj.success);
			console.log(jsonObj.filepath);
			if(jsonObj.success == 1){
				$(".user_image").fadeOut(500);
				$(".user_image").attr("src",jsonObj.filepath);
				$(".user_image_dash").attr("src",jsonObj.filepath);
				$(".user_image").fadeIn(500);
			}
		},
		error: function(){
			$("#message").html("<font color='red'> ERROR: unable to upload files</font>");
		}
	};
	$("#myForm").ajaxForm(options);
});
*/
