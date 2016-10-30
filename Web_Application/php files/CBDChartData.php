<?php
require("phpsqlajax_dbinfo.php");
//establishing the connection to the db.
$conn = new mysqli($hostname, $username, $password, $database);
//checking if there were any error during the last connection attempt
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}


if($_POST['type']=="scat"){
	$query = "SELECT Day_OF_WEEK,sum(totalCars) as totalCar 
FROM scats_data 
WHERE latitude > -37.81795005906751 
AND latitude < -37.80454408144555 
AND longitude > 144.95796674470523 
AND longitude <144.97589839021305 
group by Day_OF_WEEK";

$result = $conn->query($query);
//initialize the array to store the processed data
$jsonArray = array();
//check if there is any data returned by the SQL Query
if ($result->num_rows > 0) {
  //Converting the results into an associative array
  while($row = $result->fetch_assoc()) {
    $jsonArrayItem = array();
    $jsonArrayItem['label'] = $row['Day_OF_WEEK'];
    $jsonArrayItem['value'] = $row['totalCar'];
    //append the above created object into the main array.
    array_push($jsonArray, $jsonArrayItem);
  }
}

}
elseif($_POST['type']=="tweet"){
	$query = "select dayname(created_at) as day,count(*) as totalTweet from melCBDTweetOnRoads
	where year(created_at)=2014
group by day";


$result = $conn->query($query);
//initialize the array to store the processed data
$jsonArray = array();
//check if there is any data returned by the SQL Query
if ($result->num_rows > 0) {
  //Converting the results into an associative array
  while($row = $result->fetch_assoc()) {
    $jsonArrayItem = array();
    $jsonArrayItem['label'] = $row['day'];
    $jsonArrayItem['value'] = $row['totalTweet'];
    //append the above created object into the main array.
    array_push($jsonArray, $jsonArrayItem);
  }
}
	
}
elseif($_POST['type']=="PM"){
	$query = "select dayname(time_forEach_measurement) as day,
FORMAT(STDDEV_SAMP(measured_val_forEach_measurement),2) as PMValue 
from aircast_measurements 
where year(time_forEach_measurement)=2015 AND
 latitude > -37.81795005906751 
AND latitude < -37.80454408144555 
AND longitude > 144.95796674470523 
AND longitude <144.97589839021305 
group by day";


$result = $conn->query($query);
//initialize the array to store the processed data
$jsonArray = array();
//check if there is any data returned by the SQL Query
if ($result->num_rows > 0) {
  //Converting the results into an associative array
  while($row = $result->fetch_assoc()) {
    $jsonArrayItem = array();
    $jsonArrayItem['label'] = $row['day'];
    $jsonArrayItem['value'] = $row['PMValue'];
    //append the above created object into the main array.
    array_push($jsonArray, $jsonArrayItem);
  }
}
	
}
elseif($_POST['type']=="tweet2"){
	$query = "select dayname(created_at) as day,count(*) as tweetCount from melCBDTweetOnRoads
where year(created_at)=2015
group by day";


$result = $conn->query($query);
//initialize the array to store the processed data
$jsonArray = array();
//check if there is any data returned by the SQL Query
if ($result->num_rows > 0) {
  //Converting the results into an associative array
  while($row = $result->fetch_assoc()) {
    $jsonArrayItem = array();
    $jsonArrayItem['label'] = $row['day'];
    $jsonArrayItem['value'] = $row['tweetCount'];
    //append the above created object into the main array.
    array_push($jsonArray, $jsonArrayItem);
  }
}
	
}



//the SQL query to be executed

//storing the result of the executed query

//Closing the connection to DB
$conn->close();
//set the response content type as JSON
header('Content-type: application/json');
//output the return value of json encode using the echo function. 
echo json_encode($jsonArray);
