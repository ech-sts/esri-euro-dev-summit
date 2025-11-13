import Collection from "@arcgis/core/core/Collection";
import { useMemo } from "react";

function MiniMap({ selectedGraphic }: { selectedGraphic: __esri.Graphic }) {
  const graphics = useMemo(() => {
    const graphic = selectedGraphic.clone();
    graphic.symbol = {
      type: "simple-line",
      color: [255, 0, 0],
      width: 2,
    };
    const graphics = new Collection([graphic]);

    return graphics;
  }, [selectedGraphic]);

  return (
    <div
      id="minimap"
      style={{
        position: "absolute",
        top: "2rem",
        right: "2rem",
        width: "300px",
        height: "200px",
        zIndex: 1000,
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
      }}
    >
      <arcgis-scene
        ground="world-elevation"
        id="map"
        center={selectedGraphic.geometry?.extent?.center}
        basemap="topo-vector"
        graphics={graphics}
        spatialReference={selectedGraphic.geometry?.spatialReference}
        onarcgisViewReadyChange={async (event) => {
          await event.target.view?.goTo({
            target: selectedGraphic.geometry,
            zoom: 13,
            tilt: 10,
          });
        }}
      ></arcgis-scene>
    </div>
  );
}
export default MiniMap;