const createMatrix = rows => {
    return Array(rows).fill().map(() => Array(rows).fill(0));
}

const randBinary = () => {
    return Math.round(Math.random())
}

const randomizeMatrix = (matrix) => {
    for (let row = 0; row < matrix.length; row++) {
        const cols = matrix[row].length
        for (let col = 0; col < cols; col++) {
            matrix[row][col] = randBinary()
        }
    }
}

const copyMatrix = src => {
    return src.map(function(arr) {
        return arr.slice();
    });
}

const fillPixel = (row,col,pixelSize) => {
    context.fillRect(col*pixelSize, row*pixelSize, pixelSize, pixelSize);
}

const drawGrid = (matrix, context, pixelSize) => { 
    width = matrix.length * pixelSize
    context.clearRect(0, 0, width, width);
    for (let row = 12; row < matrix.length - 12; row++) {
        for (let col = 12; col < matrix.length - 12; col++) {
            if (matrix[row][col] === 1) {
                context.fillStyle = "#000";
                fillPixel(row-12, col-12, pixelSize);
            } else {
                context.fillStyle = "#fff";
                fillPixel(row-12, col-12, pixelSize);
            }
        }
    }
}

const conway = (matrix, next_matrix) => {
    for (let row = 0; row < matrix.length; row++) {
        for (let col = 0; col < matrix.length; col++) {
            neighbors = 0
            for (let testrow = Math.max(0,row - 1); testrow < Math.min(matrix.length,row + 2); testrow++) {
                for (let testcol = Math.max(0,col - 1); testcol < Math.min(matrix.length,col + 2); testcol++) {
                    if (matrix[testrow][testcol] == 1 && (testrow != row || testcol != col)) {
                        neighbors++
                    }
                }
            }
            if (matrix[row][col] == 1) { //alive
                if (neighbors == 2 || neighbors == 3) {
                    next_matrix[row][col] = 1
                } else {
                    next_matrix[row][col] = 0
                }
            } else { //dead
                if (neighbors == 3) {
                    next_matrix[row][col] = 1
                } else {
                    next_matrix[row][col] = 0
                }
            }
        }
    }

}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


const toggleElem = (row, col, pixelSize) => {
    curr = matrix[row][col]
    if (curr) {
        matrix[row+12][col+12] = 0;
        context.fillStyle = "#fff";
    } else {
        matrix[row+12][col+12] = 1;
        context.fillStyle = "#000";
    }
    fillPixel(row, col, pixelSize);
}


canvas = document.getElementById("canvas")
context = canvas.getContext("2d");
let elemLeft = canvas.offsetLeft;
let elemTop = canvas.offsetTop;

let matrix = null
let next_matrix = null

const initialize = (size) => {
    matrix = createMatrix(size)
    next_matrix = copyMatrix(matrix)
}

const pixelSize = 10
const pixelWidth = 75
initialize(pixelWidth)

canvas.addEventListener('click', function(event) {
   let xVal = event.pageX - elemLeft;
   let yVal = event.pageY - elemTop;
   let row = Math.floor(yVal / pixelSize)
   let col = Math.floor(xVal / pixelSize)
   toggleElem(row, col, pixelSize)

}, false);


//based on "0" being middle of grid
const patterns = [
    //select
    [],
    //random
    [],
    //blank
    [],
    //glider
    [[0, 0], [0, 1], [-1, -1], [1, -1], [1, 0]],
    //LWSS
    [[0, 0], [0, 1], [0,-1], [0, -2], [-1, -1], [-1,-2], [-1,1], [-1,2], [-2,0], [-2,1], [1, -1], [1, 0]],
    //MWSS
    [[0,0],[0,-1],[0,-2],[0,1],[0,2],[-1,-2],[-1,-1],[-1,0],[-1,2],[-1,3],[-2,1],[-2,2],[1,-1],[1,0],[1,1]],
    //HWSS
    [[-2,1],[-2,2],[-1,-3],[-1,-2],[-1,-1],[-1,0],[-1,2],[-1,3],[0,-3],[0,-2],[0,-1],[0,0],[0,1],[0,2],[1,-2],[1,-1],[1,0],[1,1]],
    //Gosper Glider Gun
    [[0,-1],[0,-7],[0,-16],[0,-17],[0,3],[0,4],[-1,-2],[-1,-6],[-1,3],[-1,4],[-1,17],[-1,18],[-2,-4],[-2,-5],[-2,3],[-2,4],[-2,17],[-2,18],[-3,5],[-3,7],[-4,7],[1,0],[1,-1],[1,-3],[1,-7],[1,-16],[1,-17],[1,5],[1,7],[2,-1],[2,-7],[3,-2],[3,-6],[4,-4],[4,-5], [2,7]],
    //Simkin Glider Gun
    [[0,5],[0,11],[2,5],[2,6],[2,7],[2,11],[2,15],[2,16],[1,5],[1,12],[1,15],[1,16],[3,10],[7,4],[7,5],[8,4],[9,5],[9,6],[9,7],[10,7],[-1,6],[-1,7],[-1,9],[-1,10],[-6,-11],[-6,-12],[-7,-11],[-7,-12],[-9,-8],[-9,-9],[-9,-15],[-9,-16],[-10,-8],[-10,-9],[-10,-15],[-10,-16]],
    //Pulsar
    [[1,2],[1,3],[1,4],[2,1],[2,6],[3,1],[3,6],[4,1],[4,6],[6,2],[6,3],[6,4],[-1,2],[-1,3],[-1,4],[-2,1],[-2,6],[-3,1],[-3,6],[-4,1],[-4,6],[-6,2],[-6,3],[-6,4],[1,-2],[1,-3],[1,-4],[2,-1],[2,-6],[3,-1],[3,-6],[4,-1],[4,-6],[6,-2],[6,-3],[6,-4],[-1,-2],[-1,-3],[-1,-4],[-2,-1],[-2,-6],[-3,-1],[-3,-6],[-4,-1],[-4,-6],[-6,-2],[-6,-3],[-6,-4]],
    //Penta-decathlon
    [[0,0],[1,0],[2,0],[4,0],[5,0],[-1,0],[-3,0],[-4,0],[-2,-1],[3,-1],[-2,1],[3,1]],
    //Beacon
    [[0,-1],[-1,0],[-1,-1],[1,2],[2,1],[2,2]],
    //Toad
    [[0,0],[0,1],[0,2],[1,-1],[1,0],[1,1]],
]

let middle = Math.floor(pixelWidth/2)+1
for (let i = 0; i < patterns.length; i++) {
    for (let j = 0; j < patterns[i].length; j++) {
        patterns[i][j][0] += middle
        patterns[i][j][1] += middle
    }
}

let pattern = document.getElementById("pattern")

const clear = () => {
    loop = false;
    generations = -1;
    increment()
    initialize(pixelWidth)
}



pattern.addEventListener('change', function(event) {
    clear()
    if (pattern.selectedIndex == 1) {
        randomizeMatrix(matrix)
        drawGrid(matrix, context, pixelSize);
    } else {
        drawPattern(patterns[pattern.selectedIndex])
        drawGrid(matrix, context, pixelSize);
    }
 
 }, false);
 
 const speed = document.getElementById("speed")
 
 speed.addEventListener('change', function(event) {
     timeBetween = 1000/(speed.selectedIndex+1)
  
  }, false);

 const drawPattern = (pattern) => {
     for (let i = 0; i < pattern.length; i++) {
        matrix[pattern[i][0]][pattern[i][1]] = 1
     }
 }


generations = 0
const count = document.getElementById("count")

const increment = () => {
    generations++
    count.innerText = generations
 }

let timeBetween = 200
let loop = false
async function tick() {
    if (loop) {
        drawGrid(matrix, context, pixelSize);
        conway(matrix, next_matrix)
        matrix = copyMatrix(next_matrix)
        increment()
        await sleep(timeBetween)
    }
    requestAnimationFrame(tick);
}


const start = document.getElementById("start")
const stop = document.getElementById("stop")
const clearBtn = document.getElementById("clear")


start.addEventListener('click', function(event) {
    loop = true;
}, false);

stop.addEventListener('click', function(event) {
    loop = false;
}, false);

clearBtn.addEventListener('click', function(event) {
    clear();
    drawGrid(matrix, context, pixelSize);
    pattern.selectedIndex = 2;
}, false);


tick()