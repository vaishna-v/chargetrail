// routeRenderer.js
// helper functions for route visualization
// right now map.js already draws routes,


class RouteRenderer
{
    constructor(map)
    {
        this.map = map;

        this.currentRoute = null;
    }

    // draws route polyline
    draw(pathCoords)
    {
        // remove old route first
        this.clear();

        this.currentRoute =
            L.polyline(
                pathCoords,
                {
                    color : "blue",
                    weight : 5,
                    opacity : 0.8
                }
            )
            .addTo(this.map);

        // zoom to route
        this.map.fitBounds(
            this.currentRoute.getBounds()
        );

        console.log("route rendered");
    }

    // removes old route
    clear()
    {
        if (this.currentRoute)
        {
            this.map.removeLayer(
                this.currentRoute
            );
        }
    }

    // converts graph node path
    // into leaflet coordinates
    //
    // path = [1, 5, 8, 10]
    // coordsMap = graph index -> lat/lon
    buildCoords(path, coordsMap)
    {
        const coords = [];

        for (const node of path)
        {
            const point =
                coordsMap.get(node);

            if (point)
            {
                coords.push([
                    point.lat,
                    point.lon
                ]);
            }
        }

        return coords;
    }
}