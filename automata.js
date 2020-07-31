
"use strict";

// Variables

let canvas, ctx; // Canvas object and context
let codeMirror; // Text editor object
let grid, gridDimension = 50; // 2D value grid

let conX, conY; // console.log data

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

// Console forwarding

function screenLog(message, stamp) {

    const tray = document.getElementById("consoleTray")

    // Create entry
    let entry = document.createElement("div");
    entry.classList.add("consoleEntry");

    // Create stamp
    if ( stamp ) {
        let st = document.createElement("div");
        st.classList.add("consoleStamp");
        st.appendChild( document.createTextNode("CELL[" + conX + "]" + "[" + conY + "]") );
        entry.append( st );
    }

    // Create text
    let node = document.createElement("div");
    node.classList.add("consoleMessage");
    node.appendChild( document.createTextNode(message) );
    entry.append( node );

    // Add to top of tray
    tray.prepend( entry );

    // Manage overflow
    if ( tray.childElementCount > 25 )
        tray.removeChild(tray.lastChild);
}

console.log = function(message) {
    screenLog( message, true );
}

console.err = function(message) {
    console.log( message, true );
}

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
    tick( 1000 ); // 1 Second time limit
    setTimeout( loop, 1000 / document.getElementById("speed").value );
}

function tick( timeLimit ) {
    
    let start = Date.now();

    // Parse CodeMirror text to function
    try {
        var func = new Function( "neighbours", codeMirror.getValue() );
    } catch(e) {
        screenLog(e);
        return;
    }

    // Sync canvas resolution with css-prompted resizing
    let SSAA = document.getElementById("SSAA").checked ? 2 : 1;
    canvas.width = canvas.clientWidth*SSAA;
    canvas.height = canvas.clientHeight*SSAA;

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
            conX = col;
            conY = row;
            alt[row][col] = func( neighbours );
        } catch(e) {
            console.log(e);
            return;
        }

        // Check time limit
        if ( Date.now() - start > timeLimit ) {
            console.log("Tick timed out!");
            return;
        }
    }

    // Switch grid
    grid = alt;

    // Calculate rounded pixel dimensions
    let stride = canvas.clientWidth / gridDimension * SSAA;
    let dim = ( Math.ceil( canvas.clientWidth / gridDimension ) * SSAA ) + 1;

    // Draw cells
    for (let row=0; row<gridDimension; row++) for (let col=0; col<gridDimension; col++) {
        ctx.fillStyle = grid[row][col] ? "black" : "white";
        ctx.fillRect( col*stride, row*stride, dim, dim );
    }
}
