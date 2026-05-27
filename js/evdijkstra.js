// evdijkstra.js
//
// modified dijkstra algorithm
// for EV route planning
//
// unlike normal dijkstra,
// this version also checks:
//
// - battery percentage
// - total vehicle range
// - reserve threshold
//
// if battery goes below threshold,
// that path is ignored.
//
// goal:
// shortest FEASIBLE path

class EVDijkstra
{
    constructor(graph)
    {
        this.graph = graph;
    }

    shortestPath(
        start,
        end,
        batteryPercent,
        maxRange,
        reserveThreshold
    )
    {
        const n =
            this.graph.graphSize();

        const dist =
            Array(n).fill(Infinity);

        const prev =
            Array(n).fill(null);

        const visited =
            Array(n).fill(false);

        // convert battery % into usable km
        //
        // example:
        // 50% battery
        // 300 km range
        //
        // usable = 150 km
        const initialBattery =
            (batteryPercent / 100)
            * maxRange;

        // remaining battery at each node
        const batteryLeft =
            Array(n).fill(-1);

        dist[start] = 0;

        batteryLeft[start] =
            initialBattery;

        const pq = new MinHeap();

        // [distance, node]
        pq.push([0, start]);

        while (pq.size() > 0)
        {
            const current =
                pq.pop();

            const currentDist =
                current[0];

            const currentNode =
                current[1];

            if (visited[currentNode])
                continue;

            visited[currentNode] = true;

            // destination reached
            if (currentNode === end)
                break;

            const neighbours =
                this.graph.getNeighbours(
                    currentNode
                );

            for (const edge of neighbours)
            {
                const neighbour =
                    edge[0];

                const weight =
                    edge[1];

                // new remaining battery
                const remainingBattery =
                    batteryLeft[currentNode]
                    - weight;

                // reject path if battery
                // goes below reserve threshold
                if (
                    remainingBattery
                    < reserveThreshold
                )
                {
                    continue;
                }

                const newDist =
                    currentDist + weight;

                // normal dijkstra relaxation
                if (newDist < dist[neighbour])
                {
                    dist[neighbour] =
                        newDist;

                    prev[neighbour] =
                        currentNode;

                    batteryLeft[neighbour] =
                        remainingBattery;

                    pq.push([
                        newDist,
                        neighbour
                    ]);
                }
            }
        }

        const path =
            this.buildPath(prev, end);

        return {
            distance :
                dist[end],

            path :
                path,

            batteryLeft :
                batteryLeft[end],

            prev :
                prev
        };
    }

    // reconstructs final route
    buildPath(prev, end)
    {
        const path = [];

        let current = end;

        while (current !== null)
        {
            path.push(current);

            current = prev[current];
        }

        path.reverse();

        return path;
    }
}