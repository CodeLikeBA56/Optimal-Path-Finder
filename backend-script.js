const graph = {
    LAHORE: [
        {destination: "SHEKHUPURA", cost: 3},
        {destination: "MURIDKE", cost: 3},
        {destination: "KAMOKE", cost: 4},
    ],
    KAMOKE: [
        {destination: "GUJRANWALA", cost: 3},
        {destination: "MURIDKE", cost: 3},
        {destination: "LAHORE", cost: 4},
    ],
    SHEKHUPURA: [
        {destination: "LAHORE", cost: 3},
        {destination: "MURIDKE", cost: 6},
    ],
    MURIDKE: [
        {destination: "KAMOKE", cost: 3},
        {destination: "LAHORE", cost: 3},
        {destination: "SHEKHUPURA", cost: 6},
        {destination: "SIALKOT", cost: 7},
    ],
    GUJRANWALA: [
        {destination: "SIALKOT", cost: 2},
        {destination: "KAMOKE", cost: 3},
        {destination: "JEHLUM", cost: 4},
        {destination: "ISLAMABAD", cost: 11},
    ],
    SIALKOT: [
        {destination: "GUJRANWALA", cost: 2},
        {destination: "JEHLUM", cost: 3},
        {destination: "MURIDKE", cost: 7},
    ],
    JEHLUM: [
        {destination: "GUJRANWALA", cost: 4},
        {destination: "ISLAMABAD", cost: 4},
        {destination: "SIALKOT", cost: 3},
    ],
    ISLAMABAD: [
        {destination: "JEHLUM", cost: 4},
        {destination: "GUJRANWALA", cost: 11},
    ]
}; // Dynamic graph created by user.
const positions = {
    "SHEKHUPURA": {x: 50, y: 250},
    "LAHORE": {x: 150, y: 100},
    "KAMOKE": {x: 350, y: 100},
    "MURIDKE": {x: 250, y: 250},
    "GUJRANWALA": {x: 550, y: 100},
    "SIALKOT": {x: 450, y: 250},
    "JEHLUM": {x: 650, y: 250},
    "ISLAMABAD": {x: 750, y: 100}
}; // Node positions for drawing on canva.

const canvas = document.getElementById("graph-canva");
const ctx = canvas.getContext('2d');

const editNodeForm = document.getElementById('edit-edge-form');
const createNodeForm = document.getElementById('create-edge-form');

const editNodeFormBtn = document.getElementById('show-edit-edge-form');
const createNodeFormBtn = document.getElementById('show-create-edge-form');

editNodeFormBtn.addEventListener('click', () => {
    createNodeForm.style.display = "none";
    editNodeForm.style.display = "flex";
});

createNodeFormBtn.addEventListener('click', () => {
    createNodeForm.style.display = "flex";
    editNodeForm.style.display = "none";
});

const priorityQueueList = document.getElementById('priority-queue');

createNodeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const source = document.getElementById('source').value.toUpperCase();
    const destination = document.getElementById('destination').value.toUpperCase();
    const cost = parseInt(document.getElementById('cost').value.toUpperCase(), 10);
    const x = parseInt(document.getElementById('x-axis').value, 10);
    const y = parseInt(document.getElementById('y-axis').value, 10);
    
    addEdge(source, destination, cost, x, y);
});

function addEdge(source, destination, cost, x, y) {
    if (!graph[source]) graph[source] = [];
    if (!graph[destination]) graph[destination] = [];
    if (!positions[source]) positions[source] = {x, y};
    if (!positions[destination]) positions[destination] = {x: x + 50, y: y + 150};

    graph[source].push({ destination, cost });
    graph[destination].push({ destination: source, cost });
    createNodeForm.reset();
    updateTraversingOptions();
    drawGraph();
}

const source = document.getElementById('source');
const x_axis = document.getElementById('x-axis');
const y_axis = document.getElementById('y-axis');

source.addEventListener('input', () => {
    const source = document.getElementById('source').value.toUpperCase();
    if (graph[source]) {
        x_axis.value = positions[source].x;
        x_axis.disabled = true;
        y_axis.value = positions[source].y;
        y_axis.disabled = true;
    } else {
        if(x_axis.disabled == true)
            x_axis.disabled = false;
    
        if(y_axis.disabled == true)
            y_axis.disabled = false
    }
});

editNodeForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const oldSourceName = selectNode.value;
    const newSourceName = updatedSourceName.value.toUpperCase();
    
    if(oldSourceName !== newSourceName) {
        positions[newSourceName] = {x: parseInt(updatedX_Axis.value, 10), y: parseInt(updatedY_Axis.value, 10)}
        delete positions[oldSourceName];
        graph[newSourceName] = graph[oldSourceName];
        delete graph[oldSourceName];
        
        for (const edge of graph[newSourceName] || []) {
            for (const neighbor of graph[edge.destination] || []) {
                if(neighbor.destination === oldSourceName)
                    neighbor.destination = newSourceName;
            }
        }
    } else
        positions[oldSourceName] = {x: parseInt(updatedX_Axis.value, 10), y: parseInt(updatedY_Axis.value, 10)}   
    

    editNodeForm.reset();
    updateTraversingOptions();
    drawGraph();
})

const selectNode = document.getElementById('source-node')
const selectGoal = document.getElementById('goal-node');
const selectSource = document.getElementById('starting-node');

function updateTraversingOptions() {
    selectSource.innerHTML = '<option value="">Select Starting Node</option>';
    selectGoal.innerHTML = '<option value="">Select Goal Node</option>';
    selectNode.innerHTML = '<option value="">Select Source Node</option>';

    for (const source in graph) {
        const nodeOption = document.createElement('option');
        nodeOption.value = source;
        nodeOption.textContent = source;

        const sourceOption = document.createElement('option');
        sourceOption.value = source;
        sourceOption.textContent = source;

        const goalOption = document.createElement('option');
        goalOption.value = source;
        goalOption.textContent = source;

        selectNode.appendChild(nodeOption);
        selectSource.appendChild(sourceOption);
        selectGoal.appendChild(goalOption);
    }
}

const updatedSourceName = document.getElementById('upd-source');
const updatedX_Axis = document.getElementById('upd-x-axis');
const updatedY_Axis = document.getElementById('upd-y-axis');

selectNode.addEventListener('change', () => {
    const node = selectNode.value;
    if(graph[node]) {
        updatedSourceName.value = node;
        updatedX_Axis.value = positions[node].x;
        updatedY_Axis.value = positions[node].y;
    }
});

function drawGraph() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const visited = new Set();
    for (const source in graph) {
        if(!visited.has(source)) {
            visited.add(source);
            for (const edge of graph[source]) {
                const destination = edge.destination;
                if(!visited.has(destination)) {
                    const start = positions[source];
                    const end = positions[destination];
        
                    ctx.beginPath(); // For drawing lines
                    ctx.moveTo(start.x, start.y);
                    ctx.lineTo(end.x, end.y);
                    ctx.strokeStyle = 'black'
                    ctx.lineWidth = 2
                    ctx.stroke();
                    ctx.closePath();
       
                    const radius = 12;
                    const midX = (start.x + end.x) / 2;
                    const midY = (start.y + end.y) / 2;

                    ctx.fillStyle = '#f79967';
                    ctx.beginPath();
                    ctx.arc(midX, midY, radius, 0, 2 * Math.PI);
                    ctx.fill();

                    ctx.fillStyle = 'white';
                    ctx.font = "13px Arial";
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.fillText(edge.cost, midX, midY);
                } // ensure that just one line draw between nodes
            }
        }
    }

    for (const key in positions) {
        const {x, y} = positions[key];
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, 2 * Math.PI);
        ctx.fillStyle = '#ff945b';
        ctx.fill();
        ctx.closePath();
        
        ctx.fillStyle = 'black';
        ctx.fillText(key, x, y - 28);
    }
}

const reselAllBtn = document.getElementById('reset-graph-btn');
const startTraversingBtn = document.getElementById('start-traversing-btn');

reselAllBtn.addEventListener('click', () => {
    editNodeForm.reset();
    createNodeForm.reset();
    Object.keys(graph).forEach(key => delete graph[key]);
    Object.keys(positions).forEach(key => delete positions[key]);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updateTraversingOptions();
});

startTraversingBtn.addEventListener('click', () => {
    const algorithm = document.getElementById('algorithm').value;

    const goal = document.getElementById('goal-node').value;
    const start = document.getElementById('starting-node').value;
    drawGraph();
    let queue;

    if (algorithm === "BFS")
        queue = [BFS(start, goal)];
    else if (algorithm === "DFS")
        queue = [DFS(start, goal)];
    else if (algorithm === "UCS")
        queue = uniformCostSearch(start, goal);

    updateQueueUI(queue);
    drawPath(queue[0].path);
});

async function updateQueueUI(queue) {
    priorityQueueList.innerHTML = '';
    for (const item of queue[0].path) {
        await sleep(1000);
        const li = document.createElement('li');
        li.textContent = `${item}`;
        priorityQueueList.appendChild(li);
    }
    await sleep(1000);
    const li = document.createElement('li');
    li.textContent = `Overall Cost: ${queue[0].cost}`
    priorityQueueList.appendChild(li);
}

async function drawPath(path) {
    for (const edge of path) {
        await sleep(1000);
        const {x, y} = positions[edge];
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, 2 * Math.PI);
        ctx.fillStyle = '#222';
        ctx.fill();
        ctx.closePath();
    }
}

async function sleep(ms) {
    await new Promise(resolve => setTimeout(resolve, ms));
}

function BFS(start = "KAMOKE", goal = "SHEKHUPURA") {
    const visited = new Set();
    const queue = [{node: start, cost: 0, path: [start]}];

    while(queue.length > 0) {
        const current = queue.shift();

        if(!visited.has(current.node)) {
            visited.add(current.node);

            if(current.node === goal)
                return {
                    cost: current.cost,
                    path: current.path
                };

            for (const neighbor of graph[current.node] || []) {
                if(!visited.has(neighbor.destination)) {
                    queue.push({
                        node: neighbor.destination,
                        cost: current.cost + neighbor.cost,
                        path: [...current.path, neighbor.destination]
                    })
                } // Only push unexplored nodes.
            }
        }
    }
}

function DFS(start = "KAMOKE", goal = "SHEKHUPURA") {
    const visited = new Set();
    const stack = [{node: start, cost: 0, path: [start]}];

    while(stack.length > 0) {
        const current = stack.pop();

        if(!visited.has(current.node)) {
            visited.add(current.node);

            if(current.node === goal)
                return {
                    cost: current.cost,
                    path: current.path
                };

            for (const neighbor of graph[current.node] || []) {
                if(!visited.has(neighbor.destination)) {
                    stack.push({
                        node: neighbor.destination,
                        cost: current.cost + neighbor.cost,
                        path: [...current.path, neighbor.destination]
                    })
                } // Only push unexplored nodes.
            }
        }
    }
}

function uniformCostSearch(start = "KAMOKE", goal = "LAHORE") {
    const visited = new Set();
    const queue = [{node: start, cost: 0, path: [start]}];
    const paths = [];

    while(queue.length > 0) {
        queue.sort((a, b) => a.cost - b.cost);
        const current = queue.shift();
        
        if(current.node === goal) {
            paths.push({
                cost: current.cost,
                path: current.path,
            });
            continue;
        }

        if(!visited.has(current.node)) {
            visited.add(current.node);

            for (const neighbor of graph[current.node] || []) {
                if (!visited.has(neighbor.destination)) {
                    queue.push({
                        node: neighbor.destination,
                        cost: current.cost + neighbor.cost,
                        path: [...current.path, neighbor.destination]
                    });
                } // Push only unexplored nodes.
            }
        }
    }

    return paths;
}

drawGraph();
updateTraversingOptions();