function MatrixModel() {
    BaseModel.call(this);

    this.attributes = {
        grid: JSON.parse(localStorage.getItem('grid')) || [
            ['', '', '', ''],
            ['', '', '', ''],
            ['', '', '', ''],
            ['', '', '', '']
        ],
        size: {
            width: 4,
            height: 4
        }
    };

    var instance = this;
    MatrixModel = function () {
        return instance;
    }

    if (!JSON.parse(localStorage.getItem('grid'))) {
        this.initialRender();
    }
}

MatrixModel.prototype = Object.create(BaseModel.prototype);
MatrixModel.prototype.constructor = MatrixModel;

MatrixModel.prototype.getPrimalNumber = function () {
    return Math.random() < 0.6 ? 2 : 4;
}

MatrixModel.prototype.getRandomCell = function () {
    return Math.floor(Math.random() * this.attributes.size.width);
}

MatrixModel.prototype.getRandomRow = function () {
    var freeRows = 0;

    this.attributes.grid.forEach(function (row) {
        if (row.includes('')) {
            freeRows += 1;
        }
    });

    if (freeRows === 0) {
        return 0;
    }

    var randomRow = Math.floor(Math.random() * this.attributes.size.height);

    if (this.attributes.grid[randomRow].includes('')) {
        return randomRow;
    } else {
        return this.getRandomRow();
    }
}

MatrixModel.prototype.getEmptyCell = function (row) {
    var i,
        emptyCells = [],
        randomRow = this.attributes.grid[row],
        rowSize = randomRow.length;

    for (i = 0; i < rowSize; i += 1) {
        if (randomRow[i] === '') {
            emptyCells.push(i);
        }
    }

    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

MatrixModel.prototype.getNewNumber = function () {
    var randomRow = this.getRandomRow();
    this.attributes.grid[randomRow][this.getEmptyCell(randomRow)] = this.getPrimalNumber();
}

MatrixModel.prototype.initialRender = function () {
    this.attributes.grid[this.getRandomRow()][this.getRandomCell()] = this.getPrimalNumber();
    this.getNewNumber();

    this.publish('changeData');
}

MatrixModel.prototype.startNewGame = function () {
    this.attributes.grid.forEach(function (row) {
        row.forEach(function (cell, index) {
            row.splice(index, 1, '');
        });
    });

    localStorage.removeItem('grid');
    this.initialRender();
}

MatrixModel.prototype.moveRight = function (grid, gridSize, arr, shifts, emptyCells, score, direction) {
    var i, j;

    for (i = 0; i < gridSize; i += 1) {
        for (j = 0; j < grid[i].length; j += 1) {
            if (grid[i][j] !== '' && grid[i][j + 1] === '') {
                shifts += 1;
            }
            if (grid[i][j] === '') {
                grid[i].unshift(grid[i].splice(j, 1).shift());
            }
        }
        score += this.sumSameNumbers(grid[i], grid[i].length, direction);
    }

    this.addNewElementToGrid(shifts, score);
    this.checkForEmptyCells(grid, arr, emptyCells);

    return score;
}

MatrixModel.prototype.moveLeft = function (grid, gridSize, arr, shifts, emptyCells, score, direction) {
    var i, j;

    for (i = 0; i < gridSize; i += 1) {
        grid[i].reverse();
        for (j = 0; j < grid[i].length; j += 1) {
            if (grid[i][j] !== '' && grid[i][j + 1] === '') {
                shifts += 1;
            }
            if (grid[i][j] === '') {
                grid[i].unshift(grid[i].splice(j, 1).shift());
            }
        }
        grid[i].reverse();
        score += this.sumSameNumbers(grid[i], grid[i].length, direction);
    }

    this.addNewElementToGrid(shifts, score);
    this.checkForEmptyCells(grid, arr, emptyCells);

    return score;
}

MatrixModel.prototype.moveUp = function (grid, arr, shifts, emptyCells, score, direction) {
    var i, j;

    this.groupCellsByIndex(grid, arr);

    for (i = 0; i < arr.length; i += 1) {
        arr[i].reverse();
        for (j = 0; j < arr[i].length; j += 1) {
            if (arr[i][j] !== '' && arr[i][j + 1] === '') {
                shifts += 1;
            }
            if (arr[i][j] === '') {
                arr[i].unshift(arr[i].splice(j, 1).shift());
            }
        }
        arr[i].reverse();
        score += this.sumSameNumbers(arr[i], arr[i].length, direction);
    }

    arr.forEach(function (subArr) {
        subArr.forEach(function (element, index) {
            grid[index].push(element);
        });
    });

    grid.forEach(function (row) {
        row.splice(0, arr.length);
    });

    this.addNewElementToGrid(shifts, score);
    this.checkForEmptyCells(grid, arr, emptyCells);

    return score;
}

MatrixModel.prototype.moveDown = function (grid, arr, shifts, emptyCells, score, direction) {
    var i, j;

    this.groupCellsByIndex(grid, arr);

    for (i = 0; i < arr.length; i += 1) {
        for (j = 0; j < arr[i].length; j += 1) {
            if (arr[i][j] !== '' && arr[i][j + 1] === '') {
                shifts += 1;
            }
            if (arr[i][j] === '') {
                arr[i].unshift(arr[i].splice(j, 1).shift());
            }
        }
        score += this.sumSameNumbers(arr[i], arr[i].length, direction);
    }

    arr.forEach(function (subArr) {
        subArr.forEach(function (element, index) {
            grid[index].push(element);
        });
    });

    grid.forEach(function (row) {
        row.splice(0, arr.length);
    });

    this.addNewElementToGrid(shifts, score);
    this.checkForEmptyCells(grid, arr, emptyCells);

    return score;
}

MatrixModel.prototype.groupCellsByIndex = function (grid, arr) {
    if (arr.length) {
        arr.splice(0);
    }

    grid.forEach(function (row) {
        row.forEach(function (cell, index) {
            if (!arr[index]) {
                arr.push([]);
            }
            arr[index].push(cell);
        });
    });
}

MatrixModel.prototype.sumSameNumbers = function (subArr, subArrSize, direction) {
    var i, sum = 0;

    if (direction === 'right' || direction === 'down') {
        for (i = subArrSize - 1; i >= 0; i -= 1) {
            if (subArr[i] !== '' && subArr[i - 1] !== '' && subArr[i] === subArr[i - 1]) {
                subArr[i] += subArr[i - 1];
                sum += parseInt(subArr[i]);
                subArr.splice(i - 1, 1);
                subArr.unshift('');
            }
        }
    } else if (direction === 'left' || direction === 'up') {
        for (i = 0; i < subArrSize; i += 1) {
            if (subArr[i] !== '' && subArr[i + 1] !== '' && subArr[i] === subArr[i + 1]) {
                subArr[i] += subArr[i + 1];
                sum += parseInt(subArr[i]);
                subArr.splice(i + 1, 1);
                subArr.push('');
            }

        }
    }

    return sum;
}

MatrixModel.prototype.addNewElementToGrid = function (shifts, score) {
    if (shifts > 0 || score > 0) {
        this.getNewNumber();
    }
}

MatrixModel.prototype.checkForEmptyCells = function (grid, arr, emptyCells) {
    var i;

    grid.forEach(function (row) {
        if (row.includes('')) {
            emptyCells += 1;
        }
        for (i = 0; i < row.length; i += 1) {
            if (row[i] !== '' && row[i + 1] !== '' && row[i] === row[i + 1]) {
                emptyCells += 1;
            }
        }
    });

    this.groupCellsByIndex(grid, arr);

    arr.forEach(function (subArr) {
        for (i = 0; i < subArr.length; i += 1) {
            if (subArr[i] !== '' && subArr[i + 1] !== '' && subArr[i] === subArr[i + 1]) {
                emptyCells += 1;
            }
        }
    });

    if (emptyCells === 0) {
        setTimeout(() => {
            this.showDefeat();
        }, 200);
    }
}

MatrixModel.prototype.displayActions = function (key) {
    var grid = this.attributes.grid,
        gridSize = grid.length,
        arr = [],
        shifts = 0,
        emptyCells = 0,
        score = 0,
        totalScore = 0;

    switch (key) {
        case 'right':
            totalScore += this.moveRight(grid, gridSize, arr, shifts, emptyCells, score, key);
            break;
        case 'left':
            totalScore += this.moveLeft(grid, gridSize, arr, shifts, emptyCells, score, key);
            break;
        case 'up':
            totalScore += this.moveUp(grid, arr, shifts, emptyCells, score, key);
            break;
        case 'down':
            totalScore += this.moveDown(grid, arr, shifts, emptyCells, score, key);
            break;
        default:
            return false;
    }

    localStorage.setItem('grid', JSON.stringify(grid));
    this.publish('changeData');

    return totalScore;
}

MatrixModel.prototype.showWin = function () {
    alert("Winner, winner, chicken dinner!");

    var grid = this.attributes.grid;

    grid.forEach(function (row) {
        row.forEach(function (cell, index) {
            row.splice(index, 1, 'win');
        });
    });

    localStorage.setItem('grid', JSON.stringify(grid));
    this.publish('changeData');
}

MatrixModel.prototype.showDefeat = function () {
    alert("Oops, you lost! Try again!");
}
