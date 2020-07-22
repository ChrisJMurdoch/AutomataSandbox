
// Variables

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let grid;
let gridDimension;
let detectionDiameter;

// Core functions

function init( dimension, diameter ) {
    gridDimension = dimension;
    detectionDiameter = diameter;

    // Create and populate grid
    grid = new Array(gridDimension);
    for (let row=0; row<gridDimension; row++) {
        grid[row] = new Array(gridDimension);
        for (let col=0; col<gridDimension; col++) {
            grid[row][col] = ( Math.random() > 0.9 );
        }
    }
}

function tick() {
    
    // Sync canvas resolution with css-prompted resizing
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

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

    // Draw cells
    ctx.fillStyle = "grey";
    ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    for (let row=0; row<gridDimension; row++) for (let col=0; col<gridDimension; col++) {
        ctx.fillStyle = grid[row][col] ? "black" : "white";
        let dim = Math.floor( canvas.clientWidth / gridDimension );
        let off = ( canvas.clientWidth - Math.floor( canvas.clientWidth / gridDimension ) * gridDimension ) / 2;
        ctx.fillRect(off+col*dim, off+row*dim, dim-1, dim-1);
    }
}

function loop() {
    tick();
    setTimeout( loop, 1000 / document.getElementById("speed").value );
}

// Custom code

function updateCell( neighbours, detectionDiameter ) {

    // See if this cell is alive
    let centreIndex = Math.floor(detectionDiameter/2);
    let cell = neighbours[centreIndex][centreIndex];
    
    // Count living neighbours
    let livingNeighbours = 0;
    for (let row=0; row<detectionDiameter; row++) for (let col=0; col<detectionDiameter; col++) {

        // Increment if cell is living and not this cell
        livingNeighbours += neighbours[row][col] && !( row === centreIndex && col === centreIndex );
    }

    // Conway's rules
    switch (livingNeighbours) {
        case 0:
        case 1:
            return false; // Die from loneliness
        case 2:
            return cell; // Stay the same
        case 3:
            return true; // Spring to life
        default:
            return false; // Die from overpopulation
    }
}

// Page start

init( 40, 3 );

loop();
