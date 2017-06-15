jQuery(document).ready(function(){
	$("#btn_filename").on('click',function(){
		sessionStorage.clear();

		$filename = "XML_Files/" + $("#input_filename").val().replace(/C:\\fakepath\\/,"");
		alert($filename);
		if($filename == null || $filename == ""){
			alert("File non trovato!");
		}else{
			console.log("No Null!");
			sessionStorage.setItem("filename",$filename);
		}
	});
});