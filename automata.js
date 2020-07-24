
// Variables

let canvas, ctx;
let grid;
let gridDimension;
let detectionDiameter;
let codeMirror;

// Page start

document.addEventListener("DOMContentLoaded", function(event) { 
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    init();
    loop();
    codeMirror = new CodeMirror.fromTextArea(document.getElementById("codearea"), {
        lineNumbers: true,
        theme: "dracula"
    });
});

// Core functions

function init() {
    gridDimension = document.getElementById("dimension").value;
    detectionDiameter = document.getElementById("diameter").value;

    // Create and populate grid
    let randomise = document.getElementById("randomise").checked;
    grid = new Array(gridDimension);
    for (let row=0; row<gridDimension; row++) {
        grid[row] = new Array(gridDimension);
        for (let col=0; col<gridDimension; col++) {
            grid[row][col] = randomise && ( Math.random() > 0.75 );
        }
    }
}

function tick() {
    
    // Sync canvas resolution with css-prompted resizing
    canvas.width = canvas.clientWidth*2;
    canvas.height = canvas.clientHeight*2;

    // Create alternate grid
    let alt = new Array(gridDimension);
    for (let i=0; i<gridDimension; i++)
        alt[i] = new Array(gridDimension);

    // Update cells
    for (let row=0; row<gridDimension; row++) for (let col=0; col<gridDimension; col++) {

        // Create neighbour grid
        let neighbours = new Array(detectionDiameter);
        for (let y=0; y<detectionDiameter; y++) {
            neighbours[y] = new Array(detectionDiameter);
            for (let x=0; x<detectionDiameter; x++) {
                let nx = col - Math.floor(detectionDiameter/2) + x;
                let ny = row - Math.floor(detectionDiameter/2) + y;
                neighbours[y][x] = (nx>=0) && (ny>=0) && (nx<gridDimension) && (ny<gridDimension) ? grid[ny][nx] : false;
            }
        }

        // Update cell
        alt[row][col] = updateCell(neighbours, detectionDiameter);
    }

    // Switch grid
    grid = alt;

    // Fill background
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);

    // Calculate rounded pixel dimensions
    let stride = canvas.clientWidth / gridDimension * 2;
    let dim = Math.ceil( canvas.clientWidth / gridDimension ) * 2 + 1;

    // Draw cells
    for (let row=0; row<gridDimension; row++) for (let col=0; col<gridDimension; col++) {
        ctx.fillStyle = grid[row][col] ? "black" : "white";
        ctx.fillRect( col*stride, row*stride, dim, dim );
    }
}

function loop() {
    tick();
    setTimeout( loop, 1000 / document.getElementById("speed").value );
}
