<?php
require("phpsqlajax_dbinfo.php");

function parseToXML($htmlStr)
{
$xmlStr=str_replace('<','&lt;',$htmlStr);
$xmlStr=str_replace('>','&gt;',$xmlStr);
$xmlStr=str_replace('"','&quot;',$xmlStr);
$xmlStr=str_replace("'",'&#39;',$xmlStr);
$xmlStr=str_replace("&",'&amp;',$xmlStr);
return $xmlStr;
}

// Opens a connection to a MySQL server
$connection=mysql_connect ($hostname, $username, $password);
if (!$connection) {
  die('Not connected : ' . mysql_error());
}

// Set the active MySQL database
$db_selected = mysql_select_db($database, $connection);
if (!$db_selected) {
  die ('Can\'t use db : ' . mysql_error());
}


$tweetQuery="SELECT geo_coordinates_latitude, geo_coordinates_longitude
               FROM melCBDTweetOnRoads";
$tweetResult = mysql_query($tweetQuery);

if (!$tweetResult) {
  die('Invalid query: ' . mysql_error());
}

$tweet="tweet";
header("Content-type: text/xml");

// Start XML file, echo parent node
echo '<tweetMarkers>';

// Iterate through the rows, printing XML nodes for each
while ($row = @mysql_fetch_assoc($tweetResult)){
  // ADD TO XML DOCUMENT NODE
  echo '<tweetMarker ';
  echo 'tweetLat="' . $row['geo_coordinates_latitude'] . '" ';
  echo 'tweetLng="' . $row['geo_coordinates_longitude'] . '" ';
  echo '/>';
}

// End XML file
echo '</tweetMarkers>';


?>