
const samples = {

game_of_life:
`
const DEAD = 0, ALIVE = 1;

// Count living neighbours minus self
let livingNeighbours = -neighbours[1][1];
neighbours.forEach( row => row.forEach( cell => livingNeighbours += cell ) );

switch (livingNeighbours) {
    case 0:
    case 1:
        return DEAD; // Die from underpopulation
    case 2:
        return neighbours[1][1]; // Stay the same
    case 3:
        return ALIVE; // Spring to life
    default:
        return DEAD; // Die from overpopulation
}`,

falling_blocks:
`
const AIR = 0, BLOCK = 1;

switch(neighbours[1][1]) {
    case AIR:
        return neighbours[0][1]==BLOCK ? BLOCK : AIR; // Fill from above or stay the same
    case BLOCK:
        return neighbours[2][1]==AIR ? AIR : BLOCK; // Fall below or stay the same
}`

};