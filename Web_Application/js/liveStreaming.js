//<![CDATA[
//global array to store our markers
    var markersArray = [];
	var map ;
	var infoWindow;
	
var customIcons = {
	Marcos : {
		icon : 'http://labs.google.com/ridefinder/images/mm_20_blue.png'
	},
	'YiKai Gong' : {
		icon : 'http://labs.google.com/ridefinder/images/mm_20_red.png'
	},
	'rsinnott' : {
		icon : 'http://labs.google.com/ridefinder/images/mm_20_green.png'
	}
};

function load() {
	 map = new google.maps.Map(document.getElementById("map"), {
			center : new google.maps.LatLng(-37.8136, 144.9631),
			zoom : 13,
			mapTypeId : 'roadmap'
		});
	 infoWindow = new google.maps.InfoWindow;

	// Change this depending on the name of your PHP file
	downloadUrl("phpsqlajax_genxml2.php",processXML);
}


	function processXML(data) {
		var xml = data.responseXML;
		var markers = xml.documentElement.getElementsByTagName("marker");
		
		//clear markers before you start drawing new ones
        resetMarkers(markersArray)
		
		for (var i = 0; i < markers.length; i++) {
			var name = markers[i].getAttribute("value");
			var address = markers[i].getAttribute("id");
			var type = markers[i].getAttribute("username");
			var point = new google.maps.LatLng(
					parseFloat(markers[i].getAttribute("lat")),
					parseFloat(markers[i].getAttribute("lng")));
			var html = "<b>" + type + "</b> <br/>" + name;
			var icon = customIcons[type] || {};
			var marker = new google.maps.Marker({
					map : map,
					position : point,
					icon : icon.icon
				});
			markersArray.push(marker);
			bindInfoWindow(marker, map, infoWindow, html);
		}
		// set timeout after you finished processing & displaying the first lot of markers. Rember that requests on the server can take some time to complete. SO you want to make another one
            // only when the first one is completed.
            setTimeout(function() {
				console.log("loading again after 20 secs")
                downloadUrl("phpsqlajax_genxml2.php", processXML);
            }, 20000);
	}

	//clear existing markers from the map
function resetMarkers(arr){
    for (var i=0;i<arr.length; i++){
        arr[i].setMap(null);
    }
    //reset the main marker array for the next call
    arr=[];
}

function bindInfoWindow(marker, map, infoWindow, html) {
	google.maps.event.addListener(marker, 'click', function () {
		infoWindow.setContent(html);
		infoWindow.open(map, marker);
	});
}

function downloadUrl(url, callback) {
	var request = window.ActiveXObject ?
		new ActiveXObject('Microsoft.XMLHTTP') :
		new XMLHttpRequest;

	request.onreadystatechange = function () {
		if (request.readyState == 4) {
			request.onreadystatechange = doNothing;
			callback(request, request.status);
		}
	};

	request.open('GET', url, true);
	request.send(null);
}

function doNothing() {}

//]]>
