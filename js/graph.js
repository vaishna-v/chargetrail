// graph.js
//
// adjacency list graph
//
// graph[node] = [
//      [neighbour, weight],
//      [neighbour, weight]
// ]
//
// weight = road distance in km

class Graph
{
    constructor(maxVertices)
    {
        // create empty adjacency list
        this.graph = Array.from(
            { length : maxVertices },
            () => []
        );
    }

    // adds edge from -> to
    addEdge(from, to, weight)
    {
        this.graph[from].push([
            to,
            weight
        ]);
    }

    // returns neighbours of a node
    getNeighbours(node)
    {
        return this.graph[node];
    }

    // total number of vertices
    graphSize()
    {
        return this.graph.length;
    }

    // counts total edges
    edgeSize()
    {
        let count = 0;

        for (let i = 0;
             i < this.graph.length;
             i++)
        {
            count += this.graph[i].length;
        }

        return count;
    }

    // debugging helper
    printGraph()
    {
        console.log("graph adjacency list:");

        for (let i = 0;
             i < this.graph.length;
             i++)
        {
            console.log(
                i,
                "->",
                this.graph[i]
            );
        }
    }
}