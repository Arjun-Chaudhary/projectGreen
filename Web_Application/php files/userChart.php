<!DOCTYPE html>
<html>
<head>
  <title>FusionCharts Column 2D Sample</title>
</head>
<body>
	  <div>
		<?php
		require("userList.php");
		?>
		
		<select id="daySelector" style="display:none;">
		   <option value='Monday'>Mon</option>
		   <option value='Tuesday'>Tue</option>
		   <option value='Wednesday'>Wed</option>
		   <option value='Thursday'>Thu</option>
		   <option value='Friday'>Fri</option>
		   <option value='Saturday'>Sat</option>
		   <option value='Sunday'>Sun</option>
	    </select>
	  </div>
	  <div id="chart-container" style="float:left">LOADING....</div>
	  
	  <div id="daily-chart-container" style="float:left"></div>
	  
	  <script src="js/jquery-2.2.4.js"></script>
	  <script src="js/fusioncharts.js"></script>
	  <script src="js/fusioncharts.charts.js"></script>
	  <script src="js/themes/fusioncharts.theme.zune.js"></script>
	  <script type="text/javascript">
        $(document).ready(function(){
        $('#username').change(function(){
			var user = $('#username').val();
            $.ajax({
		url : 'userChartdata.php',
		type : 'POST',
		dataType:'json', // add json datatype to get json
        data: ({name: user}),
		success : function (data) {
			chartData = data;
			var chartProperties = {
				"caption" : "Total Pollution Exposure for a Given User each day of the week",
				"xAxisName" : "User: "+user,
				"yAxisName" : "Particulate Matter (µg/m³)",
				"rotatevalues" : "1",
				"theme" : "zune"
			};
			apiChart = new FusionCharts({
					type : 'column2d',
					renderAt : 'chart-container',
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
	$('#daySelector').show();
   });
   
   $('#daySelector').change(function(){
			var day = $('#daySelector').val();
			var user = $('#username').val();
            $.ajax({
		url : 'userDayChartdata.php',
		type : 'POST',
		dataType:'json', // add json datatype to get json
        data: ({dayName: day, username: user}),
		success : function (data) {
			chartData = data;
			var chartProperties = {
				"caption" : "Total Pollution Exposure for a Given User on " + day,
				"xAxisName" : "Time : (24 Hour Clock)",
				"yAxisName" : "Particulate Matter (µg/m³)",
				"rotatevalues" : "1",
				"theme" : "zune"
			};
			apiChart = new FusionCharts({
					type : 'column2d',
					renderAt : 'daily-chart-container',
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
});


</script>
</body>
</html>