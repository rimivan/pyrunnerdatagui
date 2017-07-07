jQuery(document).ready(function(){
	$("#btn_filename").on('click',function(){
		sessionStorage.clear();

		$filename = $("#input_filename").val();

		if($filename == null || $filename == ""){
			sweetAlert("Oops...", "Something went wrong!", "error");
		}else{
			$filename = "XML_Files/" + $("#input_filename").val().replace(/C:\\fakepath\\/,"");
			console.log("No Null!");
			swal({
				title: "Good job!",
  				text: ". . File Loaded . .",
  				type: "success",
			},function(){
				sessionStorage.setItem("filename",$filename);
				  setTimeout(function(){
				  	window.location.href = 'home.html';
				  }, 500);
				});
		}
	});
});