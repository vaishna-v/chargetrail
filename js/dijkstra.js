class Dijkstra
{
    constructor(graph)
    {
        this.graph = graph;
    }

    shortestPath(start, end)
    {
        const n = this.graph.graphSize();

        // distance from source
        const dist = Array(n).fill(Infinity);

        // stores previous node
        const prev = Array(n).fill(null);

        // visited nodes
        const visited = Array(n).fill(false);

        dist[start] = 0;

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

            // skip if already visited
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

                // relaxation step
                const newDist =
                    currentDist + weight;

                if (newDist < dist[neighbour])
                {
                    dist[neighbour] = newDist;

                    prev[neighbour] =
                        currentNode;

                    pq.push([
                        newDist,
                        neighbour
                    ]);
                }
            }
        }

        // reconstruct path
        const path =
            this.buildPath(prev, end);

        return {
            distance : dist[end],
            path : path,
            prev : prev
        };
    }

    // builds final route
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