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