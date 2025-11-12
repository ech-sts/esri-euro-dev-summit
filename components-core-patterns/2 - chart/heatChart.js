const createHeatChart = async () => {
	const heatChartElement = document.getElementById("heatChartElement");

	//accidents NL
	const featureLayer = new FeatureLayer({
		portalItem: {
			id: "9fb1a863ec884fb0826c51a69539afdb",
		},
	});

	// https://developers.arcgis.com/javascript/latest/charts-model/heat-chart-model/
	const heatChartModel = await createModel({
		layer: featureLayer,
		chartType: "heatChart",
	});

	heatChartModel.xAxisField = "JAAR_VKL"; // Year of occurrence
	heatChartModel.yAxisField = "AOL_ID"; // Aard ongeval = Type of accident
	heatChartModel.numericFields = ["MAXSNELHD"]; // Maximum speed
	heatChartModel.aggregationType = "avg";

	// heatChartModel.xTemporalBinning = { unit: "monthOfYear" };
	// heatChartModel.yTemporalBinning = { unit: "dayOfMonth" };
	// heatChartModel.setAxisValueFormat(0,  {"type": "number"});

	// heatChartModel.setAxisValueFormat(1, { type: "date", intlOptions: { weekday: "long" } });

	// heatChartModel.gradientRules = {
	//   colorList: [
	//     [200, 225, 255, 255],
	//     [220, 0, 0, 255],
	//   ],
	//   minValue: 15,
	//   maxValue: 80,
	//   outsideRangeLowerColor: [240, 248, 255, 255],
	//   outsideRangeUpperColor: [160, 30, 30, 255],
	// };

	// heatChartModel.titleText = "Average Price of NYC Hotels";
	// heatChartModel.subtitleText = "Grouped by Month of Year and Day of Month";
	heatChartModel.setAxisTitleText("Year", 0);
	heatChartModel.setAxisTitleText("Accident type", 1);

	heatChartModel.dataLabelsVisibility = false;
	heatChartElement.autoInverseDataLabelTextColor = true;
	heatChartElement.model = heatChartModel;
};
