/** Calcite demo application boilerplate functionality - not related to demo content */

const toggleModeEl = document.getElementById("toggle-mode");
const toggleSelectionEl = document.getElementById("toggle-selection");
const toggleCode1El = document.getElementById("toggle-code-1");
const toggleCode2El = document.getElementById("toggle-code-2");
const toggleCode3El = document.getElementById("toggle-code-3");

const modalEl = document.getElementById("modal");
const darkModeCss = document.getElementById("jsapi-mode-dark");
const lightModeCss = document.getElementById("jsapi-mode-light");
const arcgisMap = document.querySelector("arcgis-map");

const timeSliderElement = document.querySelector("arcgis-time-slider");
const chartElement = document.querySelector("arcgis-chart");
const layerTitle = "Traffic accidents";

let mode = "light";

toggleModeEl.addEventListener("click", () => handleModeChange());
toggleSelectionEl.addEventListener("click", () => handleSelectionMap());
toggleCode1El.addEventListener("click", () => handleShowCode(1));
toggleCode2El.addEventListener("click", () => handleShowCode(2));
toggleCode3El.addEventListener("click", () => handleShowCode(3));

function handleShowCode(codeNumber) {
  const dialogEl = document.getElementById(`dialog-code-${codeNumber}`);
  dialogEl.open = !dialogEl.open;
}
/**
 * Maps SDK Core API variables and functions
 */
let bufferOperator;
let FeatureEffect;
let FeatureFilter;
let Graphic;
let promiseUtils;
let reactiveUtils;
let FeatureLayer;
let createModel;

/**
 * Demo variables
 */
let chartModel
let layer;
let layerView;
let highlight;
let projectOperator;


async function initialize() {
  

  bufferOperator = await $arcgis.import(
    "@arcgis/core/geometry/operators/bufferOperator.js"
  );
  promiseUtils = await $arcgis.import("@arcgis/core/core/promiseUtils.js");
  reactiveUtils = await $arcgis.import("@arcgis/core/core/reactiveUtils.js");
  FeatureEffect = await $arcgis.import(
    "@arcgis/core/layers/support/FeatureEffect.js"
  );
  FeatureFilter = await $arcgis.import(
    "@arcgis/core/layers/support/FeatureFilter.js"
  );
  Graphic = await $arcgis.import("@arcgis/core/Graphic.js");
  projectOperator = await $arcgis.import(
    "@arcgis/core/geometry/operators/projectOperator.js"
  );

  ({createModel} = await $arcgis.import("@arcgis/charts-components"));

  FeatureLayer = await $arcgis.import("@arcgis/core/layers/FeatureLayer.js");

  await projectOperator.load();

  await arcgisMap.viewOnReady();
  layer = arcgisMap.map.allLayers.find((l) => l.title === layerTitle);



  // Enable the time slider and update charts when the map and layerView are ready
  if (arcgisMap.ready) {
    enableTimeSlider();
    updateCharts();
    

    layerView = await arcgisMap.view.whenLayerView(layer);
    reactiveUtils
      .whenOnce(() => !layerView.updating)
      .then(() => {
        console.log("LayerView is ready");
        toggleSelectionEl.disabled = false;
      });
  }
}

initialize().then(() => {
  createHeatChart().then(() => {
    console.log("Heat chart created");
  })
});


function handleModeChange() {
  // Flip the mode from light to dark or vice versa
  mode = mode === "dark" ? "light" : "dark";
  const isDarkMode = mode === "dark";
  // Change the webmap to one with a dark basemap if in dark mode
  // and a light basemap if in light mode
  arcgisMap.itemId = isDarkMode
    ? "877a394191264b609fa78b8fc17261df"
    : "d5d229c30a43498bae01d637b99dfdaf";
  // Update the toggle button icon
  toggleModeEl.icon = isDarkMode ? "moon" : "brightness";
  // Update the application styles to match the mode
  document.body.classList.toggle("calcite-mode-dark", isDarkMode);
  // Update chart colors to match the mode
  updateCharts();
}


function enableTimeSlider() {
  const layer = arcgisMap.map.allLayers.find((l) => l.title === layerTitle);
  arcgisMap.whenLayerView(layer).then(() => {
    // round up the full time extent to full hour
    timeSliderElement.fullTimeExtent = layer.timeInfo.fullTimeExtent;
    timeSliderElement.stops = {
      interval: layer.timeInfo.interval,
    };
    timeSliderElement.layout = "compact";
    // timeSliderElement.timeZone = "system";
  });
}

async function updateCharts() {
  await arcgisMap.viewOnReady();
  // Delete old chart element and create a new one to reset state
  const chartElementContainer1 = document.getElementById(
    "chart-panel-container-1"
  );
  const chartElementContainer2 = document.getElementById(
    "chart-panel-container-2"
  );
  const chartElementContainer3 = document.getElementById(
    "chart-panel-container-3"
  );
  chartElementContainer1.innerHTML = "";
  chartElementContainer2.innerHTML = "";
  chartElementContainer3.innerHTML = "";
  // Create new chart element and append to container
  const chartElement1 = document.createElement("arcgis-chart")
  chartElementContainer1.appendChild(chartElement1);
  const layer1 = arcgisMap.map.allLayers.find((l) => l.title === layerTitle);
  let chartModel1 = await layer1.charts[1];
  chartElement1.layer = layer1;
  chartElement1.model = chartModel1
  chartElement1.view = arcgisMap.view;
  chartElement1.filterByExtent = true;
  chartElement1.viewTimeExtentChangePolicy = "refresh";

  const chartElement2 = document.createElement("arcgis-chart")
  chartElementContainer2.appendChild(chartElement2);
  const layer2 = arcgisMap.map.allLayers.find((l) => l.title === layerTitle);
  let chartModel2 = await layer2.charts[2];
  chartElement2.layer = layer2;
  chartElement2.model = chartModel2
  chartElement2.view = arcgisMap.view;
  chartElement2.filterByExtent = true;
  chartElement2.viewTimeExtentChangePolicy = "refresh";

  // Create new chart element and append to container
  const chartElement = document.createElement("arcgis-chart");
  chartElementContainer3.appendChild(chartElement);
  chartModel = await layer.charts[0];
  chartElement.layer = layer;
  chartElement.model = chartModel;
  chartElement.view = arcgisMap.view;
  chartElement.filterByExtent = true;
  chartElement.viewTimeExtentChangePolicy = "refresh";

  // const chartsActionBarElement = document.querySelector(
  //   "arcgis-charts-action-bar"
  // );
  // chartsActionBarElement.addEventListener(
  //   "arcgisChartsDefaultActionSelect",
  //   (event) => {
  //     const { actionId, actionActive } = event.detail;
  //     if (actionId === "filterByExtent") {
  //       if (mapElement.view !== undefined) {
  //         piechartElement.view = actionActive ? mapElement.view : undefined;
  //       }
  //     }
  //   }
  // );
}

async function handleSelectionMap() {
  // Show/toggle statistics block
  const statisticsBlock = document.getElementById("calcite-block-statistics");
  statisticsBlock.style.display = toggleSelectionEl.active ? "none" : "block";

  const queryLayerViewFeatures = await promiseUtils.debounce(function (geometry) {
    return layerView.queryFeatures({
      geometry: geometry,
      outSpatialReference: arcgisMap.view.spatialReference,
      fields: ["AP3_CODE", "MAXSNELHD", "WDK_ID"],
    });
  });

  toggleSelectionEl.active = !toggleSelectionEl.active;
  if (toggleSelectionEl.active) {
    console.log("Selection enabled");
    arcgisMap.addEventListener("arcgisViewPointerMove", async (event) => {
      try {
        // create a buffer around the pointer
        const polygon = bufferOperator.execute(
          arcgisMap.view.toMap(event.detail),
          500
        );
        const projectedPolygon = projectOperator.execute(
          polygon,
          layerView.layer.spatialReference
        );
        // query the layerView for features that intersect the polygon
        const featureSet = await queryLayerViewFeatures(projectedPolygon);
        // highlight the features in the layerView
        // if (highlight) {
        //   highlight.remove();
        // }
        // highlight = layerView.highlight(result.features);
        // Update statistics in the DOM
        document.getElementById("span-value-total-accidents").innerText = featureSet.features.length;

        const values = await createStatisticValues(featureSet);
        //createAndUpdateDomElementValues("weather-circumstances", values.Weather);
        createAndUpdateDomElementValues("max-speed",  values.MaxSpeed);
        // apply a feature effect to the layerView     
        layerView.featureEffect = new FeatureEffect({
          filter: new FeatureFilter({
            geometry: arcgisMap.toMap({ x: event.detail.x, y: event.detail.y }),
            spatialRelationship: "intersects",
            distance: 500,
            units: "meters",
            filter: layerView.filter
          }),
          excludedEffect: "grayscale(100%) opacity(70%)",
        });
        // filter the chart to only show features that intersect the polygon
      } catch (error) {}
    });
  } else {
    console.log("Selection disabled");
    arcgisMap.removeEventListener("arcgisViewPointerMove", undefined);
  }
}

const createStatisticValues = async (featureSet) => {
  let accidentsAttributes = featureSet.features.map(f => f.attributes);
  let speedValues = accidentsAttributes.map(a => a.MAXSNELHD);
  let weatherValues = accidentsAttributes.map(a => a.WDK_ID);

  // Get the count of each unique weather value
  // let weatherValueCounts = {};
  // weatherValues.forEach(function (x) {
  //   weatherValueCounts[x] = (weatherValueCounts[x] || 0) + 1;
  // });
  // Get the count of each unique speed value
  let speedValueCounts = {};
  speedValues.forEach(function (x) {
    speedValueCounts[x] = (speedValueCounts[x] || 0) + 1;
  });
  // Return the results as an object
  return {
    //'Weather': weatherValueCounts,
    'MaxSpeed': speedValueCounts
  };  
}

const createAndUpdateDomElementValues = (id, values) => {
  // <calcite-label layout="inline-space-between">120<span id="span-value-max-speed">value</span></calcite-label>
  let element = document.getElementById(`div-${id}`);

  if (element) {
    // Clear existing content    
    element.innerHTML = '';
    debugger
    for (const [key, value] of Object.entries(values)) {
      if(key && key !== "" && key !== null && key !== "null") {
        let label = document.createElement('calcite-label');
        label.setAttribute('layout', 'inline-space-between');
        label.innerHTML = `${key}<span id="${id}"><strong>${value}</strong></span>`;
        element.appendChild(label);
      }
    }
  }
  
};

const createHeatChart = async() => {
  const heatChartElement = document.getElementById("heatChartElement");
  
  //accidents NL
  const featureLayer = new FeatureLayer({
      portalItem: {
        id: "9fb1a863ec884fb0826c51a69539afdb"
      }
    });
  
  // https://developers.arcgis.com/javascript/latest/charts-model/heat-chart-model/
  const heatChartModel = await createModel({ layer: featureLayer, chartType: "heatChart" });
  
  heatChartModel.xAxisField = "JAAR_VKL"; // Year of occurrence
  heatChartModel.yAxisField = "AOL_ID"; // Aard ongeval = Type of accident
  heatChartModel.numericFields = ["MAXSNELHD"]; // Maximum speed
  heatChartModel.aggregationType = "avg";

    // heatChartModel.xTemporalBinning = { unit: "monthOfYear" };
    // heatChartModel.yTemporalBinning = { unit: "dayOfMonth" };
    // heatChartModel.setAxisValueFormat(0, { type: "date", intlOptions: { month: "long" } });
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
    // heatChartModel.setAxisTitleText("Month", 0);
    // heatChartModel.setAxisTitleText("Day", 1);

    heatChartModel.dataLabelsVisibility = true;
    heatChartElement.autoInverseDataLabelTextColor = true;
    heatChartElement.model = heatChartModel;
}
