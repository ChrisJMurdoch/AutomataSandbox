
"use strict";

// Variables

let codeMirror; // Text editor object
let grid, gridDimension = 50; // 2D value grid
let conX, conY; // console.log cell data

// Console forwarding

console.log = function(message) { screenLog( message, true ); }
console.err = function(message) { screenLog( message, true ); }

function screenLog(message, stamp) {

    const tray = document.getElementById("consoleTray")

    // Create entry
    let entry = document.createElement("div");
    entry.className = "consoleEntry";

    // Create stamp
    if ( stamp ) {
        let st = document.createElement("div");
        st.className = "consoleStamp";
        st.appendChild( document.createTextNode("CELL[" + conY + "]" + "[" + conX + "]") );
        entry.append( st );
    }

    // Create text
    let node = document.createElement("div");
    node.className = "consoleMessage";
    node.appendChild( document.createTextNode(message) );
    entry.append( node );

    // Add to top of tray
    tray.prepend( entry );

    // Manage overflow
    if ( tray.childElementCount > 25 )
        tray.removeChild(tray.lastChild);
}

// Page load

document.addEventListener("DOMContentLoaded", function(event) { 
    codeMirror = new CodeMirror(document.getElementById("codearea"), {
        viewportMargin: Infinity,
        lineNumbers: true,
        theme: "nebula",
    });
    loadSample("game_of_life");
    init();
    reset();
    repeat();
});

// Core functions

function init() {
    grid = new Array(gridDimension);
    for (let row=0; row<gridDimension; row++)
        grid[row] = new Array(gridDimension);
}

function reset() {
    const randomise = document.getElementById("randomise").checked;
    for (let row=0; row<gridDimension; row++)
        for (let col=0; col<gridDimension; col++)
            grid[row][col] = randomise && ( Math.random() > 0.5 );
}

function repeat() {
    tick();
    setTimeout( repeat, 1000 / document.getElementById("speed").value );
}

function tick() {

    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    
    // Parse CodeMirror text to function
    try {
        var func = new Function( "neighbours", codeMirror.getValue() );
    } catch(e) {
        screenLog(e);
        return;
    }

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
    }

    // Switch grid
    grid = alt;

    // Repaint canvas
    render(ctx);
}

function render(ctx) {

    const SSAA = document.getElementById("SSAA").checked ? 2 : 1;
    
    // Sync canvas resolution with size
    canvas.width = canvas.clientWidth*SSAA;
    canvas.height = canvas.clientHeight*SSAA;

    // Resolution-adjusted, non-integer cell dimension
    const stride = canvas.width / gridDimension;

    // Each row
    for (let row=0; row<gridDimension; row++) {
        
        // Floor pixel position and height
        const yPix = Math.floor( row*stride ), yDim = Math.floor( (row+1)*stride ) - yPix;

        // Each cell
        for (let col=0; col<gridDimension; col++) {

            // Floor pixel position and width
            const xPix = Math.floor( col*stride ), xDim = Math.floor( (col+1)*stride ) - xPix;

            // Fill square
            ctx.fillStyle = grid[row][col] ? "black" : "white";
            ctx.fillRect( xPix, yPix, xDim, yDim );
        }
    }
}

function loadSample(sample) {
    codeMirror.setValue(samples[sample]);
}
