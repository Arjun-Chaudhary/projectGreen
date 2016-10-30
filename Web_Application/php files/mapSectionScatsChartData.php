<?php
require("phpsqlajax_dbinfo.php");
//establishing the connection to the db.
$conn = new mysqli($hostname, $username, $password, $database);
//checking if there were any error during the last connection attempt
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}
//$_POST['northEastLat']=-37.81124186575607;
//$_POST['northEastLong']=144.96498584747314;
//$_POST['southWestLat']=-37.813140499662886;
//$_POST['southWestLong']=144.95957851409912;
$northEastLat= $_POST['northEastLat'];
$northEastLong= $_POST['northEastLong'];
$southWestLat= $_POST['southWestLat'];
$southWestLong= $_POST['southWestLong'];

//$_POST['type']="userPointTime";
//$_POST['dayName']="Mon";


if($_POST['type']=="tweetTime"){
	$day=$_POST['dayName'];
	$query = "select hour(created_at) as hour,dayname(created_at) as day,count(*) as noOfPeople
from melCBDTweetOnRoads
where geo_coordinates_latitude > $southWestLat  AND geo_coordinates_latitude < $northEastLat 
AND geo_coordinates_longitude > $southWestLong AND geo_coordinates_longitude <$northEastLong
AND dayname(created_at)='$day'
group by day,hour";

$result = $conn->query($query);
//initialize the array to store the processed data
$jsonArray = array();
//check if there is any data returned by the SQL Query
if ($result->num_rows > 0) {
  //Converting the results into an associative array
  while($row = $result->fetch_assoc()) {
    $jsonArrayItem = array();
    $jsonArrayItem['label'] = $row['hour'];
    $jsonArrayItem['value'] = $row['noOfPeople'];
    //append the above created object into the main array.
    array_push($jsonArray, $jsonArrayItem);
  }
}

}
elseif($_POST['type']=="userPointTime"){
	$day=substr($_POST['dayName'],0,3);

$query = "select (`sum(V00)`+`sum(V01)`+`sum(V02)`+`sum(V03)`)as'0',
(`sum(V04)`+`sum(V05)`+`sum(V06)`+`sum(V07)`)as'1',
(`sum(V08)`+`sum(V09)`+`sum(V10)`+`sum(V11)`)as'2',
(`sum(V12)`+`sum(V13)`+`sum(V14)`+`sum(V15)`)as'3',
(`sum(V16)`+`sum(V17)`+`sum(V18)`+`sum(V19)`)as'4',
(`sum(V20)`+`sum(V21)`+`sum(V22)`+`sum(V23)`)as'5',
(`sum(V24)`+`sum(V25)`+`sum(V26)`+`sum(V27)`)as'6',
(`sum(V28)`+`sum(V29)`+`sum(V30)`+`sum(V31)`)as'7',
(`sum(V32)`+`sum(V33)`+`sum(V34)`+`sum(V35)`)as'8',
(`sum(V36)`+`sum(V37)`+`sum(V38)`+`sum(V39)`)as'9',
(`sum(V40)`+`sum(V41)`+`sum(V42)`+`sum(V43)`)as'10',
(`sum(V44)`+`sum(V45)`+`sum(V46)`+`sum(V47)`)as'11',
(`sum(V48)`+`sum(V49)`+`sum(V50)`+`sum(V51)`)as'12',
(`sum(V52)`+`sum(V53)`+`sum(V54)`+`sum(V55)`)as'13',
(`sum(V56)`+`sum(V57)`+`sum(V58)`+`sum(V59)`)as'14',
(`sum(V60)`+`sum(V61)`+`sum(V62)`+`sum(V63)`)as'15',
(`sum(V64)`+`sum(V65)`+`sum(V66)`+`sum(V67)`)as'16',
(`sum(V68)`+`sum(V69)`+`sum(V70)`+`sum(V71)`)as'17',
(`sum(V72)`+`sum(V73)`+`sum(V74)`+`sum(V75)`)as'18',
(`sum(V76)`+`sum(V77)`+`sum(V78)`+`sum(V79)`)as'19',
(`sum(V80)`+`sum(V81)`+`sum(V82)`+`sum(V83)`)as'20',
(`sum(V84)`+`sum(V85)`+`sum(V86)`+`sum(V87)`)as'21',
(`sum(V88)`+`sum(V89)`+`sum(V90)`+`sum(V91)`)as'22',
(`sum(V92)`+`sum(V93)`+`sum(V94)`+`sum(V95)`)as'23'
from(
select sum(V00),sum(V01),sum(V02),sum(V03),sum(V04),sum(V05),sum(V06),sum(V07),sum(V08),
sum(V09),sum(V10),sum(V11),sum(V12),sum(V13),sum(V14),sum(V15),sum(V16),sum(V17),sum(V18),
sum(V19),sum(V20),sum(V21),sum(V22),sum(V23),sum(V24),sum(V25),sum(V26),sum(V27),sum(V28),
sum(V29),sum(V30),sum(V31),sum(V32),sum(V33),sum(V34),sum(V35),sum(V36),sum(V37),sum(V38),
sum(V39),sum(V40),sum(V41),sum(V42),sum(V43),sum(V44),sum(V45),sum(V46),sum(V47),sum(V48),
sum(V49),sum(V50),sum(V51),sum(V52),sum(V53),sum(V54),sum(V55),sum(V56),sum(V57),sum(V58),
sum(V59),sum(V60),sum(V61),sum(V62),sum(V63),sum(V64),sum(V65),sum(V66),sum(V67),sum(V68),sum(V69),
sum(V70),sum(V71),sum(V72),sum(V73),sum(V74),sum(V75),sum(V76),sum(V77),sum(V78),sum(V79),sum(V80),
sum(V81),sum(V82),sum(V83),sum(V84),sum(V85),sum(V86),sum(V87),sum(V88),sum(V89),sum(V90),sum(V91),
sum(V92),sum(V93),sum(V94),sum(V95)
from scats_data
where 
latitude > $southWestLat  AND latitude < $northEastLat AND longitude > $southWestLong AND longitude <$northEastLong 
AND day_of_week='$day'
group by day_of_week) as t1";



$result = $conn->query($query);
//initialize the array to store the processed data
$jsonArray = array();
//check if there is any data returned by the SQL Query
if ($result->num_rows > 0) {
  //Converting the results into an associative array
  while($row = $result->fetch_assoc()) {
    $jsonArrayItem = array();
	 for($i=0;$i<24;$i++)
	 {
		// print $row;
		$jsonArrayItem['label'] = $i;
		$jsonArrayItem['value'] = $row[$i];
		array_push($jsonArray, $jsonArrayItem);
	 }
    //append the above created object into the main array.
    
  }
}
	
}
elseif($_POST['type']=="tweet"){
	
	$query="select dayname(created_at) as day,count(*) noOfPeople
	from melCBDTweetOnRoads
where year(created_at)=2014
AND geo_coordinates_latitude > $southWestLat  AND geo_coordinates_latitude < $northEastLat 
AND geo_coordinates_longitude > $southWestLong AND geo_coordinates_longitude <$northEastLong
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
    $jsonArrayItem['value'] = $row['noOfPeople'];
    //append the above created object into the main array.
    array_push($jsonArray, $jsonArrayItem);
  }
}
	
	
}
elseif ($_POST['type']=="scat"){
	$query = "SELECT Day_OF_WEEK,sum(totalCars) as totalCar
FROM scats_data 
WHERE latitude > $southWestLat  AND 
latitude < $northEastLat AND longitude > $southWestLong 
AND longitude <$northEastLong
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

//the SQL query to be executed

//storing the result of the executed query

//Closing the connection to DB
$conn->close();
//set the response content type as JSON
header('Content-type: application/json');
//output the return value of json encode using the echo function. 
echo json_encode($jsonArray);
