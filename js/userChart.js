$(function () {
	$.ajax({
		url : 'userChartdata.php',
		type : 'GET',
		success : function (data) {
			chartData = data;
			var chartProperties = {
				"caption" : "Total Pollution Exposure for a Given User each day of the week",
				"xAxisName" : "User: Rsinnott",
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
});
