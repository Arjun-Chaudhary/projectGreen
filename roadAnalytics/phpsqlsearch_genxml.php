<?php  
require("phpsqlajax_dbinfo.php");
// Get parameters from URL
#$center_lat = $_GET["lat"];
#$center_lng = $_GET["lng"];
#$radius = $_GET["radius"];

$center_lat = -37.964637158;
$center_lng = 144.408476215;
$radius = 20;

// Opens a connection to a mySQL server
$connection=mysql_connect (localhost, $username, $password);
if (!$connection) {
  die("Not connected : " . mysql_error());
}
// Set the active mySQL database
$db_selected = mysql_select_db($database, $connection);
if (!$db_selected) {
  die ("Can\'t use db : " . mysql_error());
}
// Search the rows in the markers table
$query = sprintf("SELECT geo_coordinates_latitude, geo_coordinates_longitude, ( 3959 * acos( cos( radians('%s') ) * cos( radians( geo_coordinates_latitude ) ) * cos( radians( geo_coordinates_longitude ) - radians('%s') ) + sin( radians('%s') ) * sin( radians( geo_coordinates_latitude ) ) ) ) AS distance FROM tweetmelbourne HAVING distance < '%s' ORDER BY distance LIMIT 0 , 20",
  mysql_real_escape_string($center_lat),
  mysql_real_escape_string($center_lng),
  mysql_real_escape_string($center_lat),
  mysql_real_escape_string($radius));
$result = mysql_query($query);
if (!$result) {
  die("Invalid query: " . mysql_error());
}
header("Content-type: text/xml");
// Iterate through the rows, adding XML nodes for each
// Start XML file, echo parent node
echo '<markers>';
// Iterate through the rows, printing XML nodes for each
while ($row = @mysql_fetch_assoc($result)){
  // ADD TO XML DOCUMENT NODE
  echo '<marker ';
  echo 'lat="' . $row['geo_coordinates_latitude'] . '" ';
  echo 'lng="' . $row['geo_coordinates_longitude'] . '" ';
  echo 'distance="' . $row['distance'] . '" ';
  echo '/>';
}

// End XML file
echo '</markers>';
?>