// define some constants here
let graph = new Graph(10);
const nodeCountPress = document.getElementById("nodeCountPress");
const graphTable = document.getElementById("graphTable");
const addEdgePress = document.getElementById("addEdgePress")
const dijkstraShow = document.getElementById("dijkstraTable");

// When graph is initilized-
nodeCountPress.addEventListener('click', function(event){
    const nodeCount = document.getElementById('nodeCount').value;
    graph = new Graph(nodeCount);
    document.getElementById("graphNode").textContent = "Number of vertices = " + nodeCount;

    console.log("initilze object of graph class with " + graph.graphSize() + " vertices.");

})


// When edge is added -> update Grpah and run dijkstra
addEdgePress.addEventListener('click', function(event){
    let from = document.getElementById('fromInput').value;
    let to = document.getElementById('toInput').value;
    const weight = document.getElementById('weightVal').value;

    // ensure values are between (0, n);
    from = from % graph.graphSize();
    to = to % graph.graphSize();
    graph.addEdge(parseInt(from), parseInt(to), parseInt(weight));

    // update graph being displayed-
    const row = ("<tr><td>" + from + "</td><td>" + to + "</td><td>" + weight + "</td></tr>");
    updateGraphShow(row);

    // update dijkstra result-
    let newResult = Dijkstra();
    updateDijkstraShow(newResult);
})

// this function is used to constantly show the graph
function updateGraphShow(text)
{
    graphTable.innerHTML += text;
}

function updateDijkstraShow(text)
{
    dijkstraShow.innerHTML = text;
}


// dijkstra-
function Dijkstra()
{
    let start = 0;
    let path = "";
    // dist[node] = best known distance from start
    const dist = {};
    // prev[node] = which node we came from
    const prev = {};

    for (let i = 0; i < graph.graphSize(); i++) {
      dist[i] = Infinity;
      prev[i] = null;
    }
    dist[start] = 0;

    const pq = new MinHeap();
    pq.push([0, start]);   // [cost, node]

    while (pq.size > 0) {
      const [cost, node] = pq.pop();

      // Skip if we already found a better path
      if (cost > dist[node]) continue;
      
      // Check all neighbours
      for (const [neighbour, weight] of graph.graph[node]) {
        const newCost = dist[node] + weight;
        if (newCost < dist[neighbour]) {
          dist[neighbour] = newCost;
          prev[neighbour] = node;
          pq.push([newCost, neighbour]);
        }
      }
    }

    // add this after the while loop
    for (let i = 0; i < graph.graphSize(); i++)
        path += "<tr><td>" + i + "</td><td>" + dist[i] + "</td></tr>";
    

    return path;
}





