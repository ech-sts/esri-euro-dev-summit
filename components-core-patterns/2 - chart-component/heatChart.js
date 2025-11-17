const createHeatChart = async () => {
	// Get a reference to the `arcgis-map` and `arcgis-chart` elements
	const heatChartElement = document.getElementById("heatChartElement");
	const mapElement = document.querySelector("arcgis-map");

	mapElement.popupDisabled = true;
	
	const featureLayer = new FeatureLayer({
		portalItem: {
			id: "9fb1a863ec884fb0826c51a69539afdb",
		},		
	});

	const heatChartModel = await createModel({
		layer: featureLayer,
		chartType: "heatChart",
	});

	heatChartModel.xAxisField = "JAAR_VKL"; // Year of occurrence
	heatChartModel.yAxisField = "AOL_ID"; // Aard ongeval = Type of accident
	heatChartModel.numericFields = ["MAXSNELHD"]; // Maximum speed
	heatChartModel.aggregationType = "avg";

	heatChartModel.titleText = "Average Speed of Traffic Accidents in NL";
	heatChartModel.subtitleText = "Grouped by Year and Type of Accident";
	heatChartModel.setAxisTitleText("Year", 0);
	heatChartModel.setAxisTitleText("Accident type", 1);

	heatChartModel.dataLabelsVisibility = false;
	heatChartElement.autoInverseDataLabelTextColor = true;
	heatChartElement.model = heatChartModel;

	connectToMap(heatChartElement, mapElement);
};

const connectToMap = (heatChartElement, mapElement) => {
	let highlightSelect;
	// Set the view of the chart element to the map view, to be used for the extent filter
	heatChartElement.view = mapElement.view;

	
	// Add an event listener to the `arcgisViewClick` event on the `arcgis-map` element.
	// When user clicks on a feature on the map, the corresponding feature is highlighted on the chart.
	mapElement.addEventListener("arcgisViewClick", (event) => {
		// Get the view from the event target
		const { view } = event.target;

		// Get the screen points from the event detail
		const { screenPoint } = event.detail;
		view.hitTest(screenPoint).then(getFeatures);

		// Get the features from the hitTest
		function getFeatures(response) {
			// Get the selected feature OID
			const selectedFeatureOID = response.results[0].graphic.getObjectId();

			// Set the selection data on the chart element
			chartElement.selectionData = {
				selectionOIDs: [selectedFeatureOID],
			};
		}
	});

	// Add an event listener to the chart element to listen to the selection complete event
	// This is used to sync up the selection on the chart with the map
	chartElement.addEventListener("arcgisSelectionComplete", (event) => {
		// Remove the previous highlighted features from the map
		if (highlightSelect) {
			highlightSelect.remove();
		}
		// Highlight the selected features on the map
		const layerView = mapElement.view.layerViews.find(
			(lv) => lv.layer.title === "Traffic accidents",
		);
		highlightSelect = layerView.highlight(
			event.detail.selectionData.selectionOIDs,
		);
	});
};
