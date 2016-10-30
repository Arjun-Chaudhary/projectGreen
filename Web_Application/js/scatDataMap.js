//<![CDATA[

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
	var map = new google.maps.Map(document.getElementById("map"), {
			center : new google.maps.LatLng(-37.8136, 144.9631),
			zoom : 13,
			mapTypeId : 'roadmap'
		});
	var infoWindow = new google.maps.InfoWindow;

	// Change this depending on the name of your PHP file
	var offset=200000;
	for (var i=0;i<4;i++)
	{	
		downloadUrl("gettingScatsData.php?offset="+offset, function (data) {
			console.log("call succesfull");
			var xml = data.responseXML;
			var markers = xml.documentElement.getElementsByTagName("marker");
			for (var i = 0; i < markers.length; i++) {
				var type = markers[i].getAttribute("totalCars");
				//console.log(type);
				//console.log(markers[i].getAttribute("lat"));
				var point = new google.maps.LatLng(
						parseFloat(markers[i].getAttribute("lat")),
						parseFloat(markers[i].getAttribute("lng")));
				var html = "<b>" + type + "</b> <br/>";
				var icon = customIcons[type] || {};
				var marker = new google.maps.Marker({
						map : map,
						position : point,
						icon : 'http://labs.google.com/ridefinder/images/mm_20_green.png'
					});
				bindInfoWindow(marker, map, infoWindow, html);
			}
		});
		offset=offset+50000;
	}
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
