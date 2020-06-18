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

matrix = createMatrix(50)
randomizeMatrix(matrix)

next_matrix = copyMatrix(matrix)


const drawGrid = (matrix, context) => { 
    context.clearRect(0, 0, 500, 500);
    for (let row = 0; row < matrix.length; row++) {
        for (let col = 0; col < matrix.length; col++) {
            if (matrix[row][col] === 1) {
                context.fillStyle = "#000";
                context.fillRect(col*10, row*10, 10, 10);
            } else {
                context.fillStyle = "#fff";
                context.fillRect(col*10, row*10, 10, 10);
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

async function tick() {
    drawGrid(matrix, context);
    conway(matrix, next_matrix)
    // matrix = copyMatrix(next_matrix)
    // await sleep(200)
    // requestAnimationFrame(tick);
}

const toggleElem = (row, col) => {
    curr = matrix[row][col]
    if (curr) {
        matrix[row][col] = 0
        context.fillStyle = "#fff";
    } else {
        matrix[row][col] = 1
        context.fillStyle = "#000";
    }
    context.fillRect(col*10, row*10, 10, 10);
}

canvas = document.getElementById("canvas")
context = canvas.getContext("2d");
let elemLeft = canvas.offsetLeft;
let elemTop = canvas.offsetTop;

canvas.addEventListener('click', function(event) {
   let xVal = event.pageX - elemLeft;
   let yVal = event.pageY - elemTop;
   let row = Math.floor(yVal / 10)
   let col = Math.floor(xVal / 10)
   toggleElem(row, col)

}, false);

tick()

