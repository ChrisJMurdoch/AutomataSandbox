
const samples = {

game_of_life:
`
// Count living neighbours minus self
let livingNeighbours = -neighbours[1][1];
neighbours.forEach( row => row.forEach( cell => livingNeighbours += cell ) );

// Conway's rules
switch (livingNeighbours) {
    case 0:
    case 1:
        return false; // Die from underpopulation
    case 2:
        return neighbours[1][1]; // Stay the same
    case 3:
        return true; // Spring to life
    default:
        return false; // Die from overpopulation
}`,

white_noise:
`
return Math.random() < 0.5;`

};
