
const samples = {

game_of_life:
`
const DEAD = 0, ALIVE = 1;

// Count living (truthy) neighbours minus self
let livingNeighbours = -Boolean(neighbours[1][1]);
neighbours.forEach( row => row.forEach( cell => livingNeighbours += Boolean(cell) ) );

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

// BLOCK
if (neighbours[1][1])
    return neighbours[2][1]==AIR ? AIR : BLOCK; // Fall below or stay the same

// AIR
else
    return neighbours[0][1]>=BLOCK ? BLOCK : AIR; // Fill from above or stay the same`,

falling_sand:
`
const WALL = null, AIR = 0, SAND = 1, SAND_L = 2, SAND_R = 3; // Sand with directional propensity
const isSand = (type) => type===SAND || type===SAND_L || type===SAND_R; // Check for all kinds of sand
const isCollidable = (type) => isSand(type) || type===WALL; // Check sand or wall
const makeSand = () => Math.random() > 0.5 ? SAND_L : SAND_R; // Randomise directional propensity

switch(neighbours[1][1]) {
    case AIR:
        return (
            isSand(neighbours[0][1]) // Any sand above
  		    || neighbours[0][0]===SAND_R && isSand(neighbours[1][0]) // Top left sand sliding right
            || neighbours[0][2]===SAND_L && isSand(neighbours[1][2]) // Top right sand sliding left
        ) ? makeSand() : AIR;
            
    case SAND:
        return isCollidable(neighbours[2][1]) ? makeSand() : AIR; // Fall below or stay the same
        
    case SAND_L:
        return isCollidable(neighbours[2][1]) && isCollidable(neighbours[2][0]) ? makeSand() : AIR; // Fall below, left or stay the same
        
    case SAND_R:
        return isCollidable(neighbours[2][1]) && isCollidable(neighbours[2][2]) ? makeSand() : AIR; // Fall below, right or stay the same
        
}`

};
