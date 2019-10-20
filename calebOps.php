<?php
$op = null;
if(isset($_POST['op'])) {
    $op = null;
} else {
    return "Invalid Parameters";
}

testOp($op);

  // Tests if a login combination is valid to login  
// function testLogin($user, $pass){
function testOp($op) {
    switch($op) { 
        case "testLogin":
            if (!isset($_POST["username"]) || !isset($_POST["password"])) {
                $conn->close();
                echo json_encode(array('success' => 0));
            };
            
            $user = $_POST["username"];
            $pass = $_POST["password"];
                
            $conn = connect();
            $sql =  "SELECT * FROM buckit_user WHERE username='$user' AND password='$pass'";

            $result = $conn->query($sql);
            if ($result->num_rows > 0) {
                while ($list = mysqli_fetch_array($result)) {
                    $userid = $list[0];
                }
                $conn->close();
                echo json_encode(array('success' => 1));
            }
            else {
                $conn->close();
                echo json_encode(array('success' => 0));
            }
            return;
            break;

    // Inputs the users information in the users db if it's not already taken
    // function registerLogin($user, $pass, $first, $last, $email){
        case "registerLogin":

            if (!isset($_POST["username"]) || !isset($_POST["password"]) || !isset($_POST["firstname"])
                || !isset($_POST["lastname"]) || !isset($_POST["email"])) return "Invalid Parameters";

            $user = $_POST["username"];
            $pass = $_POST["password"];
            $first = $_POST["firstname"];
            $last = $_POST["lastname"];
            $email = $_POST["email"];

            $conn = connect();

            // check to see if username already exists
            $sql = "SELECT * FROM buckit_user WHERE username='$user'";
            $result = $conn->query($sql);
            if ($result->num_rows > 0) {
                return "The username '$user' already exists";
            }

            $sql = "INSERT INTO buckit_user (firstName, lastName, points, username, password, email)
                VALUES ('$first', '$last', 0, '$user', '$pass', '$email')";
            if ($conn->query($sql) === TRUE) {
                $conn->close();
                return "New record created successfully";
            } else {
                $conn->close();
                return "Error: $sql<br>$conn->error";
            }
            break;

    // Get the info for a given user as an array
    // function getUinfo($user){
    case "getUInfo":
        if (!isset($_POST["username"])) return "Invalid Parameters";

        $user = $_POST["username"];

        $conn = connect();
        $sql = "SELECT * FROM buckit_user WHERE username='$user'";

        $result = $conn->query($sql);
        if ($result->num_rows > 0) {
            $conn->close();
            return mysqli_fetch_array($result);
        }
        $conn->close();
        return "Could not find user '$user'";
        break;

    // publish an event to the events database, returns true if succeeded
    // function publishEvent($location, $user, $image, $type, $createtime){
    case "publishEvent":
        if (!isset($_POST["location"]) || !isset($_POST["username"]) || !isset($_POST["image"])
        || !isset($_POST["type"]) || !isset($_POST["createTime"])) return "Invalid Parameters";

        $user = $_POST["username"];
        $location = $_POST["location"];
        $image = $_POST["image"];
        $type = $_POST["type"];
        $createtime = $_POST["createTime"];

        $conn = connect();

        $eventid = rand(0, 99999999999);
        $sql = "SELECT * FROM buckit_events WHERE eventid='$eventid'";
        $result = $conn->query($sql);
        while ($result->num_rows > 0) {
            $eventid = rand(0, 99999999999);
            $sql = "SELECT * FROM buckit_events WHERE eventid='$eventid'";
            $result = $conn->query($sql);
        }

        $sql = "INSERT INTO buckit_events (location, username, image, verified, type, eventid, createtime)
            VALUES ('$location', '$user', '$image', -1, '$type', $eventid, '$createtime')";

        if ($conn->query($sql) === TRUE) {
            $conn->close();
            return true;
        } else {
            $conn->close();
            return false;
        }
        break;

    // get the most recent event that was not uploaded by current user from the events database
    // function getEvent($user){
    case "getEvent":
        if (!isset($_POST["username"])) return "Invalid Parameters";

        $user = $_POST["username"];

        $conn = connect();

        $sql = "SELECT * FROM buckit_events WHERE verified='-1' AND username!='123' ORDER BY createtime DESC";
        
        $result = $conn->query($sql);
        if ($result->num_rows > 0) {
            $conn->close();
            return mysqli_fetch_array($result);
        }
        else {		
            $conn->close();
            return -1;
        }
        
        break;

    // Assigns a verified tag to the given event
    //   function verifyEvent($eventID, $verified){
    case "verifyEvent":
        if (!isset($_POST["eventID"]) || !isset($_POST["verified"])) return "Invalid Parameters";

        $eventID = $_POST["eventID"];
        $verified = $_POST["verified"];

        $conn = connect();
        $sql = "UPDATE buckit_events SET verified = $verified WHERE eventid='$eventID'";

        if ($conn->query($sql) === TRUE) {
            $conn->close();
            return true;
        } else {
            $conn->close();
            return false;
        }
        break;
    default:
        return "unrecognized op";
    }
}

  // Update points for a user
  function updatePoints($user, $points) {
	  echo $points;
	  $conn = connect();
	  $sql = "UPDATE buckit_user SET points = $points WHERE username='$user'";

	  if ($conn->query($sql) === TRUE) {
		  $conn->close();
		  return true;
	  } else {
		  $conn->close();
		  return false;
	  }
	  return true;
  }

  // pass in the amount of points to add to the user
  function addPoints($user, $addPoints) {
	  $conn = connect();
	  $sql = "SELECT * FROM buckit_user WHERE username='$user'";
	  $result = $conn->query($sql);
	  if ($result->num_rows > 0) {
		  $conn->close();
		  $totalPoints =  mysqli_fetch_row($result)[2];
		  $totalPoints = $totalPoints + $addPoints;
		  return updatePoints($user, $totalPoints);
	  }
	  else {
		  $conn->close();
		  return false;
	  }
  }

  // Establish the connection with the db
  function connect() {
	$servername = 'localhost';
	$user = 'root';
	$password = 'TWM79e5sDThB7e';
	$dbname = 'mysql';
	
	// Create connection
	$conn = new mysqli($servername, $user, $password, $dbname);
	
	// Check connection
	if ($conn->connect_error) {
		die("Connection failed: " . $conn->connect_error);
	}
	return $conn;
  }
?>