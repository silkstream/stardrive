<?php
$output_dir = "../img/profile/";

if(isset($_FILES["file"])){
	if ($_FILES["file"]["error"] > 0){
		$result['success'] = 0;
		$result['error'] = $_FILES["file"]["error"];
	}
	else{
		$result = array();
		$res = move_uploaded_file($_FILES["file"]["tmp_name"],$output_dir.$_FILES["file"]["name"]);
		if($res){
			$result['success'] = 1;
			$result['filepath'] = "img/profile/".$_FILES["file"]["name"];
		}else{
			$result['success'] = 0;
		}
		echo json_encode($result);
	}
}
?>
