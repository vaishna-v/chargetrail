class Graph
{
    constructor(vertex){
        this.graph = Array.from({length: vertex}, () => []);
    }

    addEdge(from, to, weight)
    {
        const pair = [to, weight];
        this.graph[from].push(pair);
    }

    edgeSize() 
    {
        let count = 0;
        for (let i = 0; i < this.graph.length; i++)
            count += this.graph[i].length;
        return count;
    }

    graphSize()
    {
        return this.graph.length;
    }

}