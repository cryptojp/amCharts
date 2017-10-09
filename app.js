angular.module('myApp', [])

	.controller("myController", ['$http', '$scope', 'chartUtil', function($http, $scope, chartUtil) {

		$scope.currentType = { name: 'Line Chart', icon: 'fa-area-chart', extraClass: "pull-right", linkToPage: false, requiresLogin: false };
		$scope.currentDataSet = [];
		$scope.chartPeriod = [
			{ name: '1 Hour', shortName: '1 H', maxPoints: 60, type: 'minute', aggregation: 1, periodForTable: 10, periodForTableName: '10 min', period: 'mm', polyfill: 60, requiresLogin: false, valueGridCount: 7, catGridCount: 10, balloonDateFormat: "JJ:NN" },
			{ name: '1 Day', shortName: '1 D', maxPoints: 144, type: 'minute', aggregation: 10, periodForTable: 18, periodForTableName: '3 hours', period: '10mm', polyfill: 10 * 60, requiresLogin: false, valueGridCount: 7, catGridCount: 8, balloonDateFormat: "JJ:NN" },
			{ name: '1 Week', shortName: '1 W', maxPoints: 168, type: 'hour', aggregation: 1, periodForTable: 24, periodForTableName: 'day', period: 'hh', polyfill: 60 * 60, requiresLogin: false, valueGridCount: 5, catGridCount: 10, balloonDateFormat: "MMM DD, JJ:NN" },
			{ name: '1 Month', shortName: '1 M', maxPoints: 120, type: 'hour', aggregation: 6, periodForTable: 12, periodForTableName: '3 days', period: '6hh', polyfill: 6 * 60 * 60, requiresLogin: false, valueGridCount: 6, catGridCount: 10, balloonDateFormat: "MMM DD" },
			{ name: '3 Months', shortName: '3 M', maxPoints: 90, type: 'day', aggregation: 1, periodForTable: 10, periodForTableName: '10 days', period: 'DD', polyfill: 24 * 60 * 60, requiresLogin: true, valueGridCount: 5, catGridCount: 5, balloonDateFormat: "MMM DD" },
			{ name: '6 Months', shortName: '6 M', maxPoints: 180, type: 'day', aggregation: 1, periodForTable: 30, periodForTableName: '30 days', period: 'DD', polyfill: 24 * 60 * 60, requiresLogin: true, valueGridCount: 5, catGridCount: 10, balloonDateFormat: "MMM DD" },
			{ name: '1 Year', shortName: '1 Y', maxPoints: 365, type: 'day', aggregation: 1, periodForTable: 60, periodForTableName: '60 days', period: 'DD', polyfill: 24 * 60 * 60, requiresLogin: true, valueGridCount: 5, catGridCount: 10, balloonDateFormat: "MMM DD" }
		];
		$scope.currentPeriod = $scope.chartPeriod[1];

		$scope.getHistoData = function(periodId) {
			if ($scope.currentPeriod.name == $scope.chartPeriod[periodId].name) {
				return;
			}
			else {
				$scope.currentPeriod = $scope.chartPeriod[periodId];
				chartUtil.getHistoFromMinApi($scope.currentPeriod.type, $scope.currentPeriod.maxPoints, $scope.currentPeriod.aggregation,"GBP","XMR").then(function(response) {
					$scope.currentDataSet = response.data.Data;
					for (var index in $scope.currentDataSet) {
						$scope.currentDataSet[index]['time'] = new Date($scope.currentDataSet[index]['time'] * 1000);
					}
					$scope.generateNewChart($scope.currentDataSet, $scope.currentPeriod);
				});

			}
		};
		

		$scope.generateNewChart = function(dataObject, currentPeriod) {

			var max = dataObject[0]['close'];
			var min = dataObject[0]['close'];

			for (var price in dataObject) {

				if (dataObject[price]['close'] > max) {
					max = dataObject[price]['close'];
				}

				if (dataObject[price]['close'] < min) {
					min = dataObject[price]['close'];
				}
			}

			AmCharts.makeChart("priceChart1", {
				type: "serial",
				theme: "none",
				dataProvider: dataObject,
				panEventsEnabled: false,
				autoMargins: true,
				addClassNames: true,
				categoryField: "time",
				fontSize: 8,
				valueAxes: [{
					gridAlpha: 0,
					gridColor: "grey",
					axisAlpha: 0,
					startOnAxis: true,
					axisColor: "white",
					color: "white",
					inside: true,
					autoGridCount: false,
					gridCount: currentPeriod.valueGridCount,
					minimum:min,
					max:max
				}],
				categoryAxis: {
					gridAlpha: 0,
					gridColor: "grey",
					axisAlpha: 1,
					startOnAxis: true,
					axisColor: "white",
					color: "white",
					autoGridCount: false,
					minVerticalGap:20,
					gridCount: currentPeriod.catGridCount,
					parseDates: true,
					equalSpacing: true,
					minPeriod: currentPeriod.period,
					gridPosition: "middle",
					tickLength: 0,
					dateFormats: [
						{ period: 'mm', format: 'JJ:NN' },
						{ period: '10 mm', format: 'JJ:NN DD' },
						{ period: 'hh', format: 'JJ:NN' },
						{ period: 'DD', format: 'DD MMM' },
						{ period: 'WW', format: 'MMM DD' },
						{ period: 'MM', format: 'MMM YY' },
						{ period: 'YYYY', format: 'YYYY' }
					]

				},
				guides: [{
					value: max,
					lineAlpha: 0.2,
					lineColor: "green",
					color: "green",
					label: max,
					position: "right"
				}, {
					value: min,
					lineAlpha: 0.2,
					lineColor: "red",
					color: "red",
					label: min,
					position: "right"
				}],
				chartCursorSettings: {
					valueBalloonsEnabled: true,
					zoomable: false
				},
				graphs: [{
					id: "g1",
					lineColor: 'Aquamarine',
					fillAlphas: 0.1,
					valueField: "close",
					balloonText: "<div style='margin:0px; font-size:11px;'>Close:<strong>[[value]]</strong></div>"
				}],
				chartScrollbarSettings: {
					graph: "g1",
					enabled: false
				},

				chartCursor: {
					valueBalloonsEnabled: true,
					categoryBalloonEnabled: true,
					cursorPosition: "mouse",
					categoryBalloonDateFormat: currentPeriod.balloonDateFormat,
				},
				panelsSettings: {
					usePrefixes: false
				}
			});


		};
	}]);

/*
,
			addClassNames: true,
			panEventsEnabled: false,
			categoryAxesSettings: {
				minPeriod: $scope.currentPeriod.period,
				maxSeries: $scope.currentPeriod.maxPoints + 20,
				color: "white"
			},
			chartScrollbarSettings: {},
			dataSets: [{
				color: "grey",
				fieldMappings: [{
					fromField: "close",
					toField: "close",
				}, {
					fromField: "open",
					toField: "open"
				}, {
					fromField: "high",
					toField: "high"
				}, {
					fromField: "low",
					toField: "low"
				}],
				dataProvider: dataObject,
				addClassNames: true,
				categoryField: "time"
			}],
			panels: [{
				showCategoryAxis: true,
				percentHeight: 100,
				valueAxes: [{
					id: "a1",
					title: "Price",
					position: "left",
					gridAlpha: 0,
					autoGrid: false,
					equalSpacing: true,
					gridCount: 20,
					gridColor: "grey",
					axisAlpha: 1,
					axisColor: "white",
					color: "#F8F8FF",
					minimum: min,
					max: max,
					strictMinMax: true,
					guides: [{
						"value": max,
						"lineAlpha": 0.2,
						"lineColor": "white",
						"color": "white",
						"label": max,
						"position": "right"
					}, {
						"value": min,
						"lineAlpha": 0.2,
						"lineColor": "white",
						"color": "white",
						"label": min,
						"position": "right"
					}]
				}],
				stockGraphs: [{
					valueField: "close",
					fillAlphas: 0.1,
					color: "white",
					balloonText: "Close: <strong>[[value]]</strong>"
				}],
				stockLegend: {
					markerType: "none"
				},
			}],
			panelsSettings: {
				panEventsEnabled: false
			},
			chartScrollbarSettings: {
				graph: "g1",
				enabled: false
			},
			chartCursorSettings: {
				valueBalloonsEnabled: true,
				zoomable: false,
				categoryBalloonDateFormats: [
					{ period: 'fff', format: 'JJ:NN:SS' },
					{ period: 'ss', format: 'JJ:NN:SS' },
					{ period: 'mm', format: 'JJ:NN' },
					{ period: 'hh', format: 'MMM DD, JJ:NN' },
					{ period: 'DD', format: 'MMM DD' },
					{ period: 'WW', format: 'YYYY MMM DD' },
					{ period: 'MM', format: 'YYYY MMM' },
					{ period: 'YYYY', format: 'YYYY' }
				]
			},
			panelsSettings: {
				usePrefixes: false
			}
	
	
*/