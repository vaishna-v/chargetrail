// app.js
//
// main controller file
//
// connects:
// - graph
// - osm loader
// - map
// - ev dijkstra
//
// this is basically the "glue"
// of the whole project

// large enough number
// graph only uses needed vertices
const graph = new Graph(500000);

// load osm roads into graph
const loader =
    new OSMLoader(graph);

// leaflet map manager
const mapManager =
    new MapManager();

// ev dijkstra object
const evRouter =
    new EVDijkstra(graph);

// initialize everything
async function initialize()
{
    // create leaflet map
    mapManager.initialize();

    // load osm file
    await loader.load(
        "data/roads.osm"
    );

    console.log("project ready");
}

initialize();


// --------------------------------------------------
// compute route button
// --------------------------------------------------

const routeButton =
    document.getElementById(
        "routeButton"
    );

routeButton.addEventListener(
    "click",
    function()
    {
        // ensure points selected
        if (
            !mapManager.startCoords ||
            !mapManager.endCoords
        )
        {
            alert(
                "please select source and destination"
            );

            return;
        }

        // user inputs
        const batteryPercent =
            parseFloat(
                document.getElementById(
                    "batteryInput"
                ).value
            );

        const maxRange =
            parseFloat(
                document.getElementById(
                    "rangeInput"
                ).value
            );

        const reserveThreshold =
            parseFloat(
                document.getElementById(
                    "thresholdInput"
                ).value
            );

        // nearest graph nodes
        const startNode =
            loader.findNearestNode(
                mapManager.startCoords.lat,
                mapManager.startCoords.lon
            );

        const endNode =
            loader.findNearestNode(
                mapManager.endCoords.lat,
                mapManager.endCoords.lon
            );

        console.log(
            "start node =",
            startNode
        );

        console.log(
            "end node =",
            endNode
        );

        // run EV routing
        const result =
            evRouter.shortestPath(
                startNode,
                endNode,
                batteryPercent,
                maxRange,
                reserveThreshold
            );

        // no path found
        if (
            result.path.length === 1
            &&
            result.path[0] !== startNode
        )
        {
            alert(
                "no feasible route found"
            );

            return;
        }

        // draw route
        mapManager.drawRoute(
            result.path,
            loader.graphCoords
        );

        // update info panel
        document.getElementById(
            "distanceOutput"
        ).textContent =
            result.distance.toFixed(2)
            + " km";

        document.getElementById(
            "batteryOutput"
        ).textContent =
            result.batteryLeft.toFixed(2)
            + " km";
    }
);