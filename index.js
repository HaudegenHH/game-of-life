/* -------------------------------------------------------------------------*/
/* Rules: 
  1. Any live cell with fewer than 2 neighbours dies, as if by underpopulation
  2. Any live cell with 2 or 3 live neighbours lives on to the next generation
  3. Any live cell with more than 3 live neighbours dies, as if of overpopulation
  4. Any dead cell with exactly 3 live neighbours becomes a live cell, as if by
     reproduction 
*/
/* -------------------------------------------------------------------------*/


const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

const log = console.log

canvas.width = 800
canvas.height = 800
const resolution = 10;

const COLS = canvas.width / resolution
const ROWS = canvas.height / resolution

/* ***************************************************** */

// make a 2D Array of grid cells
function makeGrid() {
  // to make it iterable each cell has to be "filled" with null
  const grid = new Array(COLS).fill(null)
    .map(() => new Array(ROWS).fill(null)
      .map(() => Math.random() * 2 | 0))

  return grid
}

/* ***************************************************** */

// calculating the next generation
function nextGen(grid) {
  // map to loop over and making a copy of the 2D array using spread syntax
  const nextGen = grid.map(array => [...array])
  
  for(let col = 0; col < grid.length; col++) {
    for(let row = 0; row < grid[col].length; row++) {

      // checking the neighbours
      let numNeighbours = 0
      for(let i = -1; i < 2; i++) {
        for(let j = -1; j < 2; j++) {
          if(i === 0 && j === 0) {
            continue  // the cell itself will be skipped
          }          
          // check if current cell is at one of the edges of the canvas
          const cell_x = col + i
          const cell_y = row + j

          if(cell_x >= 0 && cell_y >= 0 && cell_x < COLS && cell_y < ROWS){
            const currentNeighbour = grid[col+i][row+j]
            numNeighbours += currentNeighbour
          }
        }
      }

      const cell = grid[col][row]  // cell is either 1 or 0 (alive or dead)
      
      // 1st rule: cell is alive and has fewer than 2 neighbors (underpopulation)
      if(cell === 1 && numNeighbours < 2){
        // changing the value to 0 in the copy of the grid
        nextGen[col][row] = 0
      // 3rd rule: cell is alive & has more than 3 live neighbors (overpopulation)
      } else if (cell === 1 && numNeighbours > 3) {
        nextGen[col][row] = 0        
       // 4th rule: cell is dead and has exactly 3 live neighbors 
      } else if (cell === 0 && numNeighbours === 3) {
        nextGen[col][row] = 1
      }
      // no need for another else
      // 2nd rule: any live cell with 2 or 3 live neighbors...
      // ...is solved implicitly due to the first and 2nd if statement
    }  
  }
  return nextGen
}

/* ***************************************************** */

// render the grid to the canvas
function renderGrid(grid) {
  for(let col = 0; col < grid.length; col++) {
    for(let row = 0; row < grid[col].length; row++) {
      const cell = grid[col][row]  // cell is 0 or 1
      ctx.beginPath()
      ctx.rect(col*resolution, row*resolution, resolution, resolution)
      ctx.fillStyle = cell ? 'black' : 'white'
      ctx.fill()
      ctx.stroke()
    }
  }
}

/* ***************************************************** */

function animate() {
  grid = nextGen(grid)
  renderGrid(grid)
  requestAnimationFrame(animate)
}

let grid = makeGrid()
//log(grid) // 10x10 Grid

animate()
