/**
 * @param {string} somebody - Somebody's name.
 */
function updateCell(detectionDiameter, neighbours) {

    // Count living neighbours minus self
    let livingNeighbours = -neighbours[1][1];
    neighbours.forEach( row => row.forEach( cell => livingNeighbours += cell ) );

    // Conway's rules
    switch (livingNeighbours) {
    case 0:
    case 1:
        return 0; // Die from loneliness
    case 2:
        return neighbours[1][1]; // Stay the same
    case 3:
        return 1; // Spring to life
    default:
        return 0; // Die from overpopulation
    }

}