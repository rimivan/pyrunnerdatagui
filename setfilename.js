jQuery(document).ready(function(){
	$("#btn_filename").on('click',function(){
		sessionStorage.clear();

		$filename = "XML_Files/" + $("#input_filename").val().replace(/C:\\fakepath\\/,"");
		alert($filename);
		if($filename == null || $filename == ""){
			console.log("Null!");
		}else{
			console.log("No Null!");
			//salva nella sessione il nome del file da aprire per utilizzarlo a php oppure invia a php in qualche modo
			sessionStorage.setItem("filename",$filename);
		}
	});
});