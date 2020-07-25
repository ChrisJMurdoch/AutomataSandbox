
// Variables

let canvas, ctx; // Canvas object and context
let codeMirror; // Text editor object
let grid, gridDimension = 50; // 2D value grid

// Page load

document.addEventListener("DOMContentLoaded", function(event) { 
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    codeMirror = new CodeMirror(document.getElementById("codearea"), {
        value: "\n// Count living neighbours minus self\nlet livingNeighbours = -neighbours[1][1];\nneighbours.forEach( row => row.forEach( cell => livingNeighbours += cell ) );\n\n// Conway's rules\nswitch (livingNeighbours) {\n\tcase 0:\n\tcase 1:\n\t\treturn 0; // Die from loneliness\n\tcase 2:\n\t\treturn neighbours[1][1]; // Stay the same\n\tcase 3:\n\t\treturn 1; // Spring to life\n\tdefault:\n\t\treturn 0; // Die from overpopulation\n}",
        lineNumbers: true,
        theme: "nebula",
        viewportMargin: Infinity
    });
    init();
    loop();
});

// Core functions

function init() {
    let randomise = document.getElementById("randomise").checked;
    grid = new Array(gridDimension);
    for (let row=0; row<gridDimension; row++) {
        grid[row] = new Array(gridDimension);
        for (let col=0; col<gridDimension; col++) {
            grid[row][col] = randomise && ( Math.random() > 0.75 );
        }
    }
}

function loop() {
    tick( 100 );
    setTimeout( loop, 1000 / document.getElementById("speed").value );
}

function tick( timeLimit ) {
    
    let start = Date.now();

    // Read CodeMirror to function
    let func;
    try {
        let body = codeMirror.getValue();
        func = new Function( "neighbours", body );
    } catch(e) {
        console.log("invalid function");
        console.log(e);
        return;
    }

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
        let neighbours = new Array(3);
        for (let y=0; y<3; y++) {
            neighbours[y] = new Array(3);
            for (let x=0; x<3; x++) {
                let nx = col - 1 + x;
                let ny = row - 1 + y;
                neighbours[y][x] = (nx>=0) && (ny>=0) && (nx<gridDimension) && (ny<gridDimension) ? grid[ny][nx] : false;
            }
        }

        // Update cell
        try {
            alt[row][col] = func( neighbours );
        } catch(e) {
            console.log("runtime failure");
            console.log(e);
            return;
        }

        // Check time limit
        if ( Date.now() - start > timeLimit ) {
            console.log("tick timed out");
            return;
        }
    }

    // Switch grid
    grid = alt;

    // Calculate rounded pixel dimensions
    let stride = canvas.clientWidth / gridDimension * 2;
    let dim = Math.ceil( canvas.clientWidth / gridDimension ) * 2 + 1;

    // Draw cells
    for (let row=0; row<gridDimension; row++) for (let col=0; col<gridDimension; col++) {
        ctx.fillStyle = grid[row][col] ? "black" : "white";
        ctx.fillRect( col*stride, row*stride, dim, dim );
    }
}
