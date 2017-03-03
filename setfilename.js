jQuery(document).ready(function(){
	$("#btn_filename").on('click',function(){
		$filename = $("#input_filename").val();
		if($filename == null || $filename == ""){
			console.log("Null!");
		}else{
			console.log("No Null!");
			//salva nella sessione il nome del file da aprire per utilizzarlo a php oppure invia a php in qualche modo
			sessionStorage.setItem("filename",$filename);
		}
	});
});