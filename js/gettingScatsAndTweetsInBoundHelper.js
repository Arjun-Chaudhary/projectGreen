function downloadUrl(url, callback) {
	console.log("inside download")
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

function makeAjaxCall(ne, sw, type) {
	//-------------------------------------------------------------------------		move it to seprate ,js file
	var dataReturn;
	console.log("making ajax call")
	console.log(type)
	return $.ajax({
		url : 'mapSectionScatsChartData.php',
		type : 'POST',
		dataType : 'json', // add json datatype to get json
		data : ({
			northEastLat : ne.lat(),
			northEastLong : ne.lng(),
			southWestLat : sw.lat(),
			southWestLong : sw.lng(),
			type : type
		}),
		success : function (data) {
			console.log("success")
		}
	});
}

function makeAjaxCallForTweet(ne, sw, type) {
	//-------------------------------------------------------------------------		move it to seprate ,js file
	var dataReturn;
	console.log("making ajax call for tweet")
	return $.ajax({
		url : 'mapSectionScatsChartData.php',
		type : 'POST',
		dataType : 'json', // add json datatype to get json
		data : ({
			northEastLat : ne.lat(),
			northEastLong : ne.lng(),
			southWestLat : sw.lat(),
			southWestLong : sw.lng(),
			type : type
		}),
		success : function (data) {
			console.log("success 2")
		}
	});
}

function makeAjaxCall2(ne, sw, value, type) {
	//-------------------------------------------------------------------------		move it to seprate ,js file
	console.log("inside day selector first ajax call")
	return $.ajax({
		url : 'mapSectionScatsChartData.php',
		type : 'POST',
		dataType : 'json', // add json datatype to get json
		data : ({
			northEastLat : ne.lat(),
			northEastLong : ne.lng(),
			southWestLat : sw.lat(),
			southWestLong : sw.lng(),
			type : type,
			dayName : value
		}),
		success : function (data) {}
	});
}

function makeAjaxCallForTweet2(ne, sw, value, type) {
	//-------------------------------------------------------------------------		move it to seprate ,js file
	console.log("inside day selector second ajax call")
	return $.ajax({
		url : 'mapSectionScatsChartData.php',
		type : 'POST',
		dataType : 'json', // add json datatype to get json
		data : ({
			northEastLat : ne.lat(),
			northEastLong : ne.lng(),
			southWestLat : sw.lat(),
			southWestLong : sw.lng(),
			type : type,
			dayName : value
		}),
		success : function (data) {}
	});
}

function drawChart(data) {
	chartData = data;
	console.log("success");
	var chartProperties = {
		"caption" : "Total Pollution Exposure for the selected section ",
		"xAxisName" : "Day Of the Week",
		"yAxisName" : "Particulate Matter (µg/m³)",
		"rotatevalues" : "1",
		"theme" : "zune"
	};
	apiChart = new FusionCharts({
			type : 'column2d',
			renderAt : content,
			width : '550',
			height : '350',
			dataFormat : 'json',
			dataSource : {
				"chart" : chartProperties,
				"data" : chartData
			}
		});
	apiChart.render();
	$('#daySelector').show();
	showInnerChart();
}

function showInnerChart() {
	$('#daySelector').change(function () {
		$.ajax({
			url : 'mapSectionChartData.php',
			type : 'POST',
			dataType : 'json', // add json datatype to get json
			data : ({
				northEastLat : ne.lat(),
				northEastLong : ne.lng(),
				southWestLat : sw.lat(),
				southWestLong : sw.lng(),
				day : $('#daySelector').val()
			}),
			success : function (data) {
				chartData = data;
				console.log("success");
				var chartProperties = {
					"caption" : "Total Pollution Exposure for the selected section ",
					"xAxisName" : "Time : (24 Hour Clock)",
					"yAxisName" : "Particulate Matter (µg/m³)",
					"rotatevalues" : "1",
					"theme" : "zune"
				};
				apiChart = new FusionCharts({
						type : 'column2d',
						renderAt : 'content',
						width : '550',
						height : '350',
						dataFormat : 'json',
						dataSource : {
							"chart" : chartProperties,
							"data" : chartData
						}
					});
				apiChart.render();

			}
		});
	});
}

function processXML(data) {
	console.log("inside processXML");
	var xml = data.responseXML;
	var markers = xml.documentElement.getElementsByTagName("marker");

	//clear markers before you start drawing new ones
	for (var i = 0; i < markers.length; i++) {
		var totalCars = markers[i].getAttribute("totalCars")
			var point = new google.maps.LatLng(
				parseFloat(markers[i].getAttribute("lat")),
				parseFloat(markers[i].getAttribute("lng")));
		var html = "<b>" + totalCars + "</b> <br/>";
		//var icon = customIcons[type] || {};
		var marker = new google.maps.Marker({
				map : map,
				position : point,
				//animation: google.maps.Animation.BOUNCE,
				//icon : 'http://labs.google.com/ridefinder/images/mm_20_red.png'
			});
		markersArray.push(marker);
		bindInfoWindow(marker, map, infoWindow, html);
	}
	// set timeout after you finished processing & displaying the first lot of markers. Rember that requests on the server can take some time to complete. SO you want to make another one
	// only when the first one is completed.
}

function processTweetXML(data) {
	console.log("inside processTweetXML");
	var xml = data.responseXML;
	var markers = xml.documentElement.getElementsByTagName("tweetMarker");

	//clear markers before you start drawing new ones
	for (var i = 0; i < markers.length; i++) {
		var point = new google.maps.LatLng(
				parseFloat(markers[i].getAttribute("tweetLat")),
				parseFloat(markers[i].getAttribute("tweetLng")));
		var html = "<b>" + point + "</b> <br/>";
		//var icon = customIcons[type] || {};
		var marker = new google.maps.Marker({
				map : map,
				position : point,
				icon : 'http://labs.google.com/ridefinder/images/mm_20_green.png'
			});
		markersArray.push(marker);
		bindInfoWindow(marker, map, infoWindow, html);
	}
	// set timeout after you finished processing & displaying the first lot of markers. Rember that requests on the server can take some time to complete. SO you want to make another one
	// only when the first one is completed.
}

function processRoadDataXML(data) {
	console.log("inside processRoadDataXML");
	var xml = data.responseXML;
	var markers = xml.documentElement.getElementsByTagName("tweetMarker");

	//clear markers before you start drawing new ones
	for (var i = 0; i < markers.length; i++) {
		var point = new google.maps.LatLng(
				parseFloat(markers[i].getAttribute("roadLat")),
				parseFloat(markers[i].getAttribute("roadLng")));
		var html = "<b>" + point + "</b> <br/>";
		//var icon = customIcons[type] || {};
		var marker = new google.maps.Marker({
				map : map,
				position : point,
				icon : 'http://labs.google.com/ridefinder/images/mm_20_green.png'
			});
		markersArray.push(marker);
		bindInfoWindow(marker, map, infoWindow, html);
	}
	// set timeout after you finished processing & displaying the first lot of markers. Rember that requests on the server can take some time to complete. SO you want to make another one
	// only when the first one is completed.
}

//clear existing markers from the map
function resetMarkers(arr) {
	for (var i = 0; i < arr.length; i++) {
		arr[i].setMap(null);
	}
	//reset the main marker array for the next call
	arr = [];
}

function bindInfoWindow(marker, map, infoWindow, html) {
	google.maps.event.addListener(marker, 'click', function () {
		infoWindow.setContent(html);
		infoWindow.open(map, marker);
	});
}

function doNothing() {}

function outerAjaxCallContent(a1, a2) {
	console.log(a1);
	console.log(a2);
	var value = [0, 0, 0, 0, 0, 0, 0];
	var label;
	var value1 = [0, 0, 0, 0, 0, 0, 0];
	var max1 = 0;
	var max2 = 0;

	//console.log(a1[0][1]['value']);
	for (i = 0; i < a1[0].length; i++) {
		if (a1[0][i]['label'] == "Mon") {
			value[0] = a1[0][i]['value']
				if (max1 < value[0]) {
					max1 = value[0]
				}
		}
		if (a1[0][i]['label'] == "Tue") {
			value[1] = a1[0][i]['value']
				if (max1 < value[1]) {
					max1 = value[1]
				}
		}
		if (a1[0][i]['label'] == "Wed") {
			value[2] = a1[0][i]['value']
				if (max1 < value[2]) {
					max1 = value[2]
				}
		}
		if (a1[0][i]['label'] == "Thu") {
			value[3] = a1[0][i]['value']
				if (max1 < value[3]) {
					max1 = value[3]
				}
		}
		if (a1[0][i]['label'] == "Fri") {
			value[4] = a1[0][i]['value']
				if (max1 < value[4]) {
					max1 = value[4]
				}
		}
		if (a1[0][i]['label'] == "Sat") {
			value[5] = a1[0][i]['value']
				if (max1 < value[5]) {
					max1 = value[5]
				}
		}
		if (a1[0][i]['label'] == "Sun") {
			value[6] = a1[0][i]['value']
				if (max1 < value[6]) {
					max1 = value[6]
				}
		}
	}
	for (i = 0; i < a2[0].length; i++) {
		if (a2[0][i]['label'] == "Monday") {
			value1[0] = a2[0][i]['value']
				if (max2 < value1[0]) {
					max2 = value1[0]
				}
		}
		if (a2[0][i]['label'] == "Tuesday") {
			value1[1] = a2[0][i]['value']
				if (max2 < value1[1]) {
					max2 = value1[1]
				}
		}
		if (a2[0][i]['label'] == "Wednesday") {
			value1[2] = a2[0][i]['value']
				if (max2 < value1[2]) {
					max2 = value1[2]
				}
		}
		if (a2[0][i]['label'] == "Thursday") {
			value1[3] = a2[0][i]['value']
				if (max2 < value1[3]) {
					max2 = value1[3]
				}
		}
		if (a2[0][i]['label'] == "Friday") {
			value1[4] = a2[0][i]['value']
				if (max2 < value1[4]) {
					max2 = value1[4]
				}
		}
		if (a2[0][i]['label'] == "Saturday") {
			value1[5] = a2[0][i]['value']
				if (max2 < value1[5]) {
					max2 = value1[5]
				}
		}
		if (a2[0][i]['label'] == "Sunday") {
			value1[6] = a2[0][i]['value']
				if (max2 < value1[6]) {
					max2 = value1[6]
				}
		}

	}
	//--------------------------------------------------------
	var fusioncharts = new FusionCharts({
			type : 'zoomlinedy',
			renderAt : 'chart-container',
			width : '600',
			height : '400',
			dataFormat : 'json',
			dataSource : {
				"chart" : {
					"caption" : "Day wise relation between amount of traffic and number of tweets for 2014",
					"pYAxisName" : "Amount of traffic",
					"sYAxisName" : "Number of tweets",
					"compactDataMode" : "1",
					"pixelsPerPoint" : "0",
					"lineThickness" : "1",
					"dataSeparator" : ",",
					"pYAxisMinValue" : "0",
					"sYAxisMinValue" : "0",
					"theme" : "fint"
				},
				"categories" : [{
						"fontColor" : "#ff0000",
						"category" : "MON,TUE,WED,THU,FRI,SAT,SUN"
					}
				],
				"dataset" : [{
						"seriesname" : "Traffic",
						"color" : "0075c2",
						"data" : value.join()
					}, {
						"seriesname" : "Tweets",
						"color" : "1aaf5d",
						"parentYAxis" : "S",
						"data" : value1.join()
					}
				]
			}
		});
	fusioncharts.render();
	//--------------------------------------------------------------------------------------------------
}

function innerAjaxCallContent(a1, a2) {
	var value = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	var label;
	var max1 = 0;
	var max2 = 0;
	var value1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	var value3=[0,0,0,0,0,0,0,0];
	var value4=[0,0,0,0,0,0,0,0];
	
	//console.log(a1[0][1]['value']);
	var n=0;
	for (i = 0; i < a1[0].length; i++) {
		value[parseInt(a1[0][i]['label'])] = a1[0][i]['value']
			if (max1 < value[parseInt(a1[0][i]['label'])]) {
				max1 = value[value[parseInt(a1[0][i]['label'])]]
			}
	}
	for (i = 0; i < a2[0].length; i++) {
		value1[parseInt(a2[0][i]['label'])] = a2[0][i]['value']
			if (max2 < value1[parseInt(a2[0][i]['label'])]) {
				max2 = value1[parseInt(a2[0][i]['label'])]
			}
	}
	value = value.map(Number);
	value1 = value1.map(Number);
	value3[0]=value[0]+value[1]+value[2]-0;
	value3[1]=value[3]+value[4]+value[5]-0;
	value3[2]=value[6]+value[7]+value[8]-0;
	value3[3]=value[9]+value[10]+value[11]-0;
	value3[4]=value[12]+value[13]+value[14]-0;
	value3[5]=value[15]+value[16]+value[17]-0;
	value3[6]=value[18]+value[19]+value[20]-0;
	value3[7]=value[21]+value[22]+value[23]-0;
	
	value4[0]=value1[0]+value1[1]+value1[2]-0;
	value4[1]=value1[3]+value1[4]+value1[5]-0;
	value4[2]=value1[6]+value1[7]+value1[8]-0;
	value4[3]=value1[9]+value1[10]+value1[11]-0;
	value4[4]=value1[12]+value1[13]+value1[14]-0;
	value4[5]=value1[15]+value1[16]+value1[17]-0;
	value4[6]=value1[18]+value1[19]+value1[20]-0;
	value4[7]=value1[21]+value1[22]+value1[23]-0;
	
	var fusioncharts = new FusionCharts({
			type : 'zoomlinedy',
			renderAt : 'chart-container',
			width : '600',
			height : '400',
			dataFormat : 'json',
			dataSource : {
				"chart" : {
					"caption" : "Hourly relation between amount of traffic and number of tweets for 2014",
					"pYAxisName" : "Amount of traffic",
					"sYAxisName" : "Number of tweets on the roads ",
					"compactDataMode" : "1",
					"pixelsPerPoint" : "0",
					"lineThickness" : "1",
					"dataSeparator" : ",",
					"pYAxisMinValue" : "0",
					"sYAxisMinValue" : "0",
					"theme" : "fint"
				},
				"categories" : [{
						"fontColor" : "#ff0000",
						"category" : "	0-3, 3-6, 6-9, 9-12, 12-15, 15-18, 18-21, 21-24"
					}
				],
				"dataset" : [{
						"seriesname" : "Traffic ",
						"color" : "0075c2",
						"data" : value3.join()
					}, {
						"seriesname" : "Tweets",
						"color" : "1aaf5d",
						"parentYAxis" : "S",
						"data" : value4.join()
					}
				]
			}
		});
	fusioncharts.render();
}
