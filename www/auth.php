<?php
	if (isset($_POST['username']) && $_POST['username'] && isset($_POST['password']) && $_POST['password']) {
	include("/var/www/dbOps.php");
	if (testLogin($_POST['username'],$_POST['password'])) { 
		// based on successful authentication
		echo json_encode(array('success' => 1));
	} else {
		echo json_encode(array('success' => 0));
	}
    }
    



	
	/*
	 * if $results['req'] == 'testLogin'{
			$uname = $results['username'];
		$pass = $results['password'];
	
		include "/var/www/dbOps.php";
		if (testLogin($uname, $pass)) {
			echo 'valid';
		} else {
			echo 'invalid'
		}
	}*/
?>
