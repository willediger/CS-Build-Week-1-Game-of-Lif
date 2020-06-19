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

const fillPixel = (col,row,pixelSize) => {
    context.fillRect(col*pixelSize, row*pixelSize, pixelSize, pixelSize);
}

const drawGrid = (matrix, context, pixelSize) => { 
    width = matrix.length * pixelSize
    context.clearRect(0, 0, width, width);
    for (let row = 0; row < matrix.length; row++) {
        for (let col = 0; col < matrix.length; col++) {
            if (matrix[row][col] === 1) {
                context.fillStyle = "#000";
                fillPixel(row, col, pixelSize);
            } else {
                context.fillStyle = "#fff";
                fillPixel(row, col, pixelSize);
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
        matrix[row][col] = 0;
        context.fillStyle = "#fff";
    } else {
        matrix[row][col] = 1;
        context.fillStyle = "#000";
    }
    fillPixel(row, col, pixelSize);
}


canvas = document.getElementById("canvas")
context = canvas.getContext("2d");
let elemLeft = canvas.offsetLeft;
let elemTop = canvas.offsetTop;

const initialize = (size) => {
    matrix = createMatrix(size)
    randomizeMatrix(matrix)
    next_matrix = copyMatrix(matrix)
}

const pixelSize = 10
const pixelWidth = 51
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
    [[0, 0],[0, 1], [0,-1],[0,-2],[-1,-1],[-1,-2],[-2,0],[-2,1],[1, -1],[1,0]],
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

middle = Math.floor(pixelWidth/2)+1
for (let i = 0; i < patterns.length; i++) {
    for (let j = 0; j < patterns[i].length; j++) {
        patterns[i][j][0] += middle
        patterns[i][j][1] += middle
    }
}

pattern = document.getElementById("pattern")


pattern.addEventListener('change', function(event) {
    drawPattern(patterns[pattern.selectedIndex])
 
 }, false);

 const drawPattern = (pattern) => {
     context.clearRect(0, 0, width, width);
     context.fillStyle = "#000";
     for (let i = 0; i < pattern.length; i++) {
        fillPixel(pattern[i][1], pattern[i][0], pixelSize);
     }
 }


 async function tick() {
    drawGrid(matrix, context, pixelSize);
    conway(matrix, next_matrix)
    // matrix = copyMatrix(next_matrix)
    // await sleep(200)
    // requestAnimationFrame(tick);
}


tick()