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


const drawGrid = (matrix) => { 
    let c = document.getElementById("canvas");
    let context = c.getContext("2d");
    context.clearRect(0, 0, 500, 500);
    for (let row = 0; row < matrix.length; row++) {
        for (let col = 0; col < matrix.length; col++) {
            if (matrix[row][col] === 1) {
                context.fillStyle = "#000";
                context.fillRect(row*10, col*10, 10, 10);
            } else {
                context.fillStyle = "#fff";
                context.fillRect(row*10, col*10, 10, 10);
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
    drawGrid(matrix);
    conway(matrix, next_matrix)
    matrix = copyMatrix(next_matrix)
    await sleep(200)
    requestAnimationFrame(tick);
}



tick()