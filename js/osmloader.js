// osmloader.js
//
// This file loads OpenStreetMap (.osm) road data
// and converts it into our graph structure.
//
// We only care about:
// 1. nodes (coordinates)
// 2. roads (ways with highway tag)
//
// Everything else is ignored.
//
// NOTE:
// This is intentionally simplified for the project.
// We are ignoring:
// - one way roads
// - traffic rules
// - road types
// - signals etc.

class OSMLoader
{
    constructor(graph)
    {
        this.graph = graph;

        // stores all osm nodes
        // key = osm node id
        // value = {lat, lon}
        this.nodes = new Map();

        // OSM node ids are huge numbers
        // so we convert them into small graph indices
        this.osmToGraph = new Map();

        // graph index -> coordinates
        // useful later for leaflet map drawing
        this.graphCoords = new Map();

        this.currentIndex = 0;
    }

    // loads the .osm file
    async load(filePath)
    {
        console.log("loading osm file...");

        const response = await fetch(filePath);
        const text = await response.text();

        const parser = new DOMParser();
        const xml = parser.parseFromString(text, "text/xml");

        console.log("xml parsing done");

        this.parseNodes(xml);
        this.parseWays(xml);

        console.log("road graph created");
        console.log("total graph nodes =", this.currentIndex);
        console.log("total graph edges =", this.graph.edgeSize());
    }

    // extracts all coordinate nodes
    parseNodes(xml)
    {
        const nodeElements = xml.getElementsByTagName("node");

        for (const node of nodeElements)
        {
            const id = node.getAttribute("id");

            const lat = parseFloat(
                node.getAttribute("lat")
            );

            const lon = parseFloat(
                node.getAttribute("lon")
            );

            this.nodes.set(id, {
                lat : lat,
                lon : lon
            });
        }

        console.log("parsed nodes =", this.nodes.size);
    }

    // extracts roads
    // converts them into graph edges
    parseWays(xml)
    {
        const ways = xml.getElementsByTagName("way");

        for (const way of ways)
        {
            // skip if not a road
            if (!this.isRoad(way))
                continue;

            const nds = way.getElementsByTagName("nd");

            // connect consecutive nodes
            for (let i = 0; i < nds.length - 1; i++)
            {
                const fromOSM =
                    nds[i].getAttribute("ref");

                const toOSM =
                    nds[i + 1].getAttribute("ref");

                // ensure nodes exist
                if (!this.nodes.has(fromOSM) ||
                    !this.nodes.has(toOSM))
                    continue;

                const fromIndex =
                    this.getGraphIndex(fromOSM);

                const toIndex =
                    this.getGraphIndex(toOSM);

                const fromCoord =
                    this.nodes.get(fromOSM);

                const toCoord =
                    this.nodes.get(toOSM);

                // calculate actual geographic distance
                const distance = this.haversine(
                    fromCoord.lat,
                    fromCoord.lon,
                    toCoord.lat,
                    toCoord.lon
                );

                // add both directions
                // ignoring one-way roads for simplicity
                this.graph.addEdge(
                    fromIndex,
                    toIndex,
                    distance
                );

                this.graph.addEdge(
                    toIndex,
                    fromIndex,
                    distance
                );
            }
        }

        console.log("finished parsing roads");
    }

    // checks whether a way is a road
    isRoad(way)
    {
        const tags = way.getElementsByTagName("tag");

        for (const tag of tags)
        {
            const key = tag.getAttribute("k");

            if (key === "highway")
                return true;
        }

        return false;
    }

    // converts huge osm ids into compact graph indices
    getGraphIndex(osmId)
    {
        if (!this.osmToGraph.has(osmId))
        {
            this.osmToGraph.set(
                osmId,
                this.currentIndex
            );

            const coords =
                this.nodes.get(osmId);

            this.graphCoords.set(
                this.currentIndex,
                {
                    lat : coords.lat,
                    lon : coords.lon
                }
            );

            this.currentIndex++;
        }

        return this.osmToGraph.get(osmId);
    }

    // haversine formula
    // calculates real distance between coordinates
    haversine(lat1, lon1, lat2, lon2)
    {
        const R = 6371; // earth radius in km

        const dLat =
            this.toRadians(lat2 - lat1);

        const dLon =
            this.toRadians(lon2 - lon1);

        const a =
            Math.sin(dLat / 2) *
            Math.sin(dLat / 2) +

            Math.cos(this.toRadians(lat1)) *
            Math.cos(this.toRadians(lat2)) *

            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);

        const c =
            2 * Math.atan2(
                Math.sqrt(a),
                Math.sqrt(1 - a)
            );

        return R * c;
    }

    toRadians(deg)
    {
        return deg * (Math.PI / 180);
    }

    // finds nearest graph node
    // to a clicked location on map
    //
    // simple brute force search
    // good enough for project scale
    findNearestNode(lat, lon)
    {
        let bestNode = -1;
        let bestDistance = Infinity;

        for (const [index, coords]
            of this.graphCoords)
        {
            const d = this.haversine(
                lat,
                lon,
                coords.lat,
                coords.lon
            );

            if (d < bestDistance)
            {
                bestDistance = d;
                bestNode = index;
            }
        }

        return bestNode;
    }
}