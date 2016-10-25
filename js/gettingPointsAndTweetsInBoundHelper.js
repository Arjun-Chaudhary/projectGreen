

function makeAjaxCall(ne, sw, type) {
	//-------------------------------------------------------------------------		move it to seprate ,js file
	var dataReturn;
	console.log("call made")
	return $.ajax({
		url : 'mapSectionChartData.php',
		type : 'POST',
		dataType : 'json', // add json datatype to get json
		data : ({
			northEastLat : ne.lat(),
			northEastLong : ne.lng(),
			southWestLat : sw.lat(),
			southWestLong : sw.lng(),
			type: type
		}),
		success : function (data) {		
		}
	});
}




function makeAjaxCallForTweet(ne, sw, type) {
	//-------------------------------------------------------------------------		move it to seprate ,js file
	var dataReturn;
	return $.ajax({
		url : 'mapSectionChartData.php',
		type : 'POST',
		dataType : 'json', // add json datatype to get json
		data : ({
			northEastLat : ne.lat(),
			northEastLong : ne.lng(),
			southWestLat : sw.lat(),
			southWestLong : sw.lng(),
			type: type
		}),
		success : function (data) {		
		}
	});
}



function makeAjaxCall2(ne, sw,value, type) {
	//-------------------------------------------------------------------------		move it to seprate ,js file
	console.log("inside day selector first ajax call")
	return $.ajax({
		url : 'mapSectionChartData.php',
		type : 'POST',
		dataType : 'json', // add json datatype to get json
		data : ({
			northEastLat : ne.lat(),
			northEastLong : ne.lng(),
			southWestLat : sw.lat(),
			southWestLong : sw.lng(),
			type: type,
			dayName:value
		}),
		success : function (data) {		
		}
	});
}




function makeAjaxCallForTweet2(ne, sw,value, type) {
	//-------------------------------------------------------------------------		move it to seprate ,js file
	console.log("inside day selector second ajax call")
	return $.ajax({
		url : 'mapSectionChartData.php',
		type : 'POST',
		dataType : 'json', // add json datatype to get json
		data : ({
			northEastLat : ne.lat(),
			northEastLong : ne.lng(),
			southWestLat : sw.lat(),
			southWestLong : sw.lng(),
			type: type,
			dayName:value
		}),
		success : function (data) {		
		}
	});
}


function drawChart(data){
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

function showInnerChart(){
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
	var xml = data.responseXML;
	var markers = xml.documentElement.getElementsByTagName("marker");

	//clear markers before you start drawing new ones
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
}

function processTweetXML(data) {
	var xml = data.responseXML;
	var markers = xml.documentElement.getElementsByTagName("tweetMarker");

	//clear markers before you start drawing new ones
	for (var i = 0; i < markers.length; i++) {
		var polarityScore = markers[i].getAttribute("polarityScore");
		var type = markers[i].getAttribute("type")
		var point = new google.maps.LatLng(
				parseFloat(markers[i].getAttribute("tweetLat")),
				parseFloat(markers[i].getAttribute("tweetLng")));
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


function outerAjaxCallContent(a1,a2){
	console.log(a1);
		    console.log(a2);
			var value=[0,0,0,0,0,0,0];
			var label;
			var value1=[0,0,0,0,0,0,0];
			var max1=0;
			var max2=0;
			
			//console.log(a1[0][1]['value']);
			for (i=0;i<a1[0].length;i++){
				if(a1[0][i]['label']=="Monday"){
				    value[0]=a1[0][i]['value']
					if(max1<value[0]){
					max1=value[0]
					}
				}
				if(a1[0][i]['label']=="Tuesday"){
				    value[1]=a1[0][i]['value']
					if(max1<value[1]){
					max1=value[1]
					}
				}
				if(a1[0][i]['label']=="Wednesday"){
				    value[2]=a1[0][i]['value']
					if(max1<value[2]){
					max1=value[2]
					}
				}
				if(a1[0][i]['label']=="Thursday"){
				    value[3]=a1[0][i]['value']
					if(max1<value[3]){
					max1=value[3]
					}
				}
				if(a1[0][i]['label']=="Friday"){
					value[4]=a1[0][i]['value']
					if(max1<value[4]){
					max1=value[4]
					}
				}
				if(a1[0][i]['label']=="Saturday"){
				    value[5]=a1[0][i]['value']
					if(max1<value[5]){
					max1=value[5]
					}
				}
				if(a1[0][i]['label']=="Sunday"){
				    value[6]=a1[0][i]['value']
					if(max1<value[6]){
					max1=value[6]
					}
				}
			}
			for (i=0;i<a2[0].length;i++){
				if(a2[0][i]['label']=="Monday"){
					value1[0]=a2[0][i]['value']
					if(max2<value1[0]){
					max2=value1[0]
					}
				}
				if(a2[0][i]['label']=="Tuesday"){
					value1[1]=a2[0][i]['value']
					if(max2<value1[1]){
					max2=value1[1]
					}
				}
				if(a2[0][i]['label']=="Wednesday"){
					value1[2]=a2[0][i]['value']
					if(max2<value1[2]){
					max2=value1[2]
					}
				}
				if(a2[0][i]['label']=="Thursday"){
					value1[3]=a2[0][i]['value']
					if(max2<value1[3]){
					max2=value1[3]
					}
				}
				if(a2[0][i]['label']=="Friday"){
					value1[4]=a2[0][i]['value']
					if(max2<value1[4]){
					max2=value1[4]
					}
				}
				if(a2[0][i]['label']=="Saturday"){
					value1[5]=a2[0][i]['value']
					if(max2<value1[5]){
					max2=value1[5]
					}
				}
				if(a2[0][i]['label']=="Sunday"){
					value1[6]=a2[0][i]['value']
					if(max2<value1[6]){
					max2=value1[6]
					}
				}
				
			}
		//--------------------------------------------------------
		var fusioncharts = new FusionCharts({
    type: 'zoomlinedy',
    renderAt: 'chart-container',
    width: '600',
    height: '400',
    dataFormat: 'json',
    dataSource: {
        "chart": {
            "caption": "Total Pollution Exposure for the selected section and number of people breathing there",
            "pYAxisName": "Particulate Matter (µg/m³)",
            "sYAxisName": "Number of people",
            "compactDataMode": "1",
            "pixelsPerPoint": "0",
            "lineThickness": "1",
            "dataSeparator": ",",
            "pYAxisMinValue": "0",
            "sYAxisMinValue": "0",
            "theme": "fint"            
        },
        "categories": [{
            "fontColor": "#ff0000",
			"category": "MON,TUE,WED,THU,FRI,SAT,SUN"
        }],
        "dataset": [{
            "seriesname": "PM",
            "color": "0075c2",
			"data": value.join()
        },  {
            "seriesname": "Number of People",
            "color": "1aaf5d",
            "parentYAxis": "S",
			"data": value1.join()
        }]
    }
});
    fusioncharts.render();
		//--------------------------------------------------------------------------------------------------
}

function innerAjaxCallContent(a1,a2){
	var value=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	var label;
	var max1=0;
	var max2=0;
	var value1=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	//console.log(a1[0][1]['value']);
	for (i=0;i<a1[0].length;i++){
			value[ parseInt(a1[0][i]['label'])]=a1[0][i]['value']
			if(max1<value[ parseInt(a1[0][i]['label'])]){
			max1=value[value[ parseInt(a1[0][i]['label'])]]
			}
	}
	for (i=0;i<a2[0].length;i++){
			value1[parseInt(a2[0][i]['label'])]=a2[0][i]['value']
			if(max2<value1[parseInt(a2[0][i]['label'])]){
			max2=value1[parseInt(a2[0][i]['label'])]
			}
	}
	var fusioncharts = new FusionCharts({
			type: 'zoomlinedy',
			renderAt: 'chart-container',
			width: '600',
			height: '400',
			dataFormat: 'json',
			dataSource: {
				"chart": {
					"caption": "Total Pollution Exposure for the selected section and number of people breathing there",
					"pYAxisName": "Particulate Matter (µg/m³)",
					"sYAxisName": "Number of people",
					"compactDataMode": "1",
					"pixelsPerPoint": "0",
					"lineThickness": "1",
					"dataSeparator": ",",
					"pYAxisMinValue": "0",
					"sYAxisMinValue": "0",
					"theme": "fint"            
				},
				"categories": [{
					"fontColor": "#ff0000",
					"category": "0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24"
				}],
				"dataset": [{
					"seriesname": "PM",
					"color": "0075c2",
					"data": value.join()	
				},  {
					"seriesname": "Number of People",
					"color": "1aaf5d",
					"parentYAxis": "S",
					"data": value1.join()
				}]
			}
	});
	fusioncharts.render();
}
