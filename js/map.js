// map.js
//
// handles leaflet map
//
// responsibilities:
// - initialize map
// - handle clicks
// - place markers
// - draw route
//
// this file should ONLY deal with map stuff.
// no dijkstra logic here.

class MapManager
{
    constructor()
    {
        this.map = null;

        this.startMarker = null;
        this.endMarker = null;

        this.routeLine = null;

        // clicked coordinates
        this.startCoords = null;
        this.endCoords = null;

        // helps decide whether
        // next click is source or destination
        this.selectingStart = true;
    }

    // create leaflet map
    initialize()
    {
        this.map = L.map("map").setView(
            [30.3165, 78.0322], // dehradun
            13
        );

        // openstreetmap tiles
        L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
                attribution:
                    "© OpenStreetMap contributors",
                maxZoom: 19
            }
        ).addTo(this.map);

        console.log("map initialized");

        this.setupClickHandler();
    }

    // handles user clicks
    setupClickHandler()
    {
        this.map.on(
            "click",
            (event) =>
            {
                const lat =
                    event.latlng.lat;

                const lon =
                    event.latlng.lng;

                if (this.selectingStart)
                {
                    this.setStartMarker(
                        lat,
                        lon
                    );

                    this.startCoords = {
                        lat : lat,
                        lon : lon
                    };

                    console.log(
                        "start selected"
                    );
                }
                else
                {
                    this.setEndMarker(
                        lat,
                        lon
                    );

                    this.endCoords = {
                        lat : lat,
                        lon : lon
                    };

                    console.log(
                        "destination selected"
                    );
                }

                // alternate between
                // source and destination
                this.selectingStart =
                    !this.selectingStart;
            }
        );
    }

    // places source marker
    setStartMarker(lat, lon)
    {
        // remove old marker
        if (this.startMarker)
        {
            this.map.removeLayer(
                this.startMarker
            );
        }

        this.startMarker =
            L.marker([lat, lon])
            .addTo(this.map)
            .bindPopup("Start")
            .openPopup();
    }

    // places destination marker
    setEndMarker(lat, lon)
    {
        if (this.endMarker)
        {
            this.map.removeLayer(
                this.endMarker
            );
        }

        this.endMarker =
            L.marker([lat, lon])
            .addTo(this.map)
            .bindPopup("Destination")
            .openPopup();
    }

    // draws final shortest path
    //
    // path = array of graph node ids
    // coordsMap = graph index -> coordinates
    drawRoute(path, coordsMap)
    {
        // remove previous route
        if (this.routeLine)
        {
            this.map.removeLayer(
                this.routeLine
            );
        }

        const routeCoords = [];

        // convert graph nodes
        // into lat/lon coordinates
        for (const node of path)
        {
            const coords =
                coordsMap.get(node);

            if (coords)
            {
                routeCoords.push([
                    coords.lat,
                    coords.lon
                ]);
            }
        }

        // draw route polyline
        this.routeLine =
            L.polyline(routeCoords,
            {
                color : "blue",
                weight : 5,
                opacity : 0.8
            })
            .addTo(this.map);

        // auto zoom to route
        this.map.fitBounds(
            this.routeLine.getBounds()
        );

        console.log("route drawn");
    }

    // clears old route
    clearRoute()
    {
        if (this.routeLine)
        {
            this.map.removeLayer(
                this.routeLine
            );
        }
    }
}