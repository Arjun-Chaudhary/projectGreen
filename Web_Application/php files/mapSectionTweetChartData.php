<?php
require("phpsqlajax_dbinfo.php");
//establishing the connection to the db.
$conn = new mysqli($hostname, $username, $password, $database);
//checking if there were any error during the last connection attempt
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

$northEastLat= $_POST['northEastLat'];
$northEastLong= $_POST['northEastLong'];
$southWestLat= $_POST['southWestLat'];
$southWestLong= $_POST['southWestLong'];


if(isset($_POST['day'])){
	$day=$_POST['day'];
	$query = "SELECT dayname(time_forEach_measurement) as dayName,hour(time_forEach_measurement) as hour,FORMAT(STDDEV_SAMP(measured_val_forEach_measurement),2) as STDMeasuredValue
FROM aircast_measurements 
WHERE latitude > $southWestLat  AND latitude < $northEastLat AND longitude > $southWestLong AND longitude <$northEastLong AND measurement_short_type='PM' AND dayname(time_forEach_measurement)='$day'
group by dayName,hour";

$result = $conn->query($query);
//initialize the array to store the processed data
$jsonArray = array();
//check if there is any data returned by the SQL Query
if ($result->num_rows > 0) {
  //Converting the results into an associative array
  while($row = $result->fetch_assoc()) {
    $jsonArrayItem = array();
    $jsonArrayItem['label'] = $row['hour'];
    $jsonArrayItem['value'] = $row['STDMeasuredValue'];
    //append the above created object into the main array.
    array_push($jsonArray, $jsonArrayItem);
  }
}

}
else{
	$query = "SELECT dayname(time_forEach_measurement) as dayName,FORMAT(STDDEV_SAMP(measured_val_forEach_measurement),2) as STDMeasuredValue
FROM aircast_measurements 
WHERE latitude > $southWestLat  AND latitude < $northEastLat AND longitude > $southWestLong AND longitude <$northEastLong AND measurement_short_type='PM'
group by dayName";

$result = $conn->query($query);
//initialize the array to store the processed data
$jsonArray = array();
//check if there is any data returned by the SQL Query
if ($result->num_rows > 0) {
  //Converting the results into an associative array
  while($row = $result->fetch_assoc()) {
    $jsonArrayItem = array();
    $jsonArrayItem['label'] = $row['dayName'];
    $jsonArrayItem['value'] = $row['STDMeasuredValue'];
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
