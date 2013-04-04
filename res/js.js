(function () {
	var baseURL = location.protocol + "//" + location.host;
	var socket = io.connect(baseURL);
	var isUploading = false;
	$(document).ready(function() {

		socket.on('UPDATE_FILES', function (data) {
			if (!isUploading)
				$("#content").html(data);
		});

		socket.on("UPLOAD_PROGRESS", function(percentage) {
			isUploading = true;
			$("#progress").show();
			$("#progressBar").width(percentage + "%");
			if(percentage == 100) {
				$("#progress").hide();
				isUploading = false;
			}
		});

		$("#add-folder").click(function (){
			$("#overlay").toggle();
			$("#name").val("");
			$("#name").focus();
		});

		$("#name").keyup(function(e){
			var input = $("#name").val();
			var valid = !input.match(/[\\*{}\/<>?|]/);
			if (!valid){
				$("#info-filename").show();
				$("#name").css("background-color","#f55");
				$("#name").css("border-color","#f00");
			} else {
				$("#info-filename").hide();
				$("#name").css("background-color","#eee");
				$("#name").css("border-color","#ff9147");
			}
			if(e.keyCode == 13 && input && valid) {
				socket.emit("CREATE_FOLDER",input);
				$("#overlay").hide();
				$("#info-filename").hide();
			}
		});
		//Initial update of files
		socket.emit("REQUEST_UPDATE");
	});
}());