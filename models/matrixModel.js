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

MatrixModel.prototype.getRandomValue = function () {
    return Math.random() < 0.6 ? 2 : 4;
}

MatrixModel.prototype.getRandomCell = function () {
    return Math.floor(Math.random() * 4);
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

    var randomRow = Math.floor(Math.random() * 4);

    if (this.attributes.grid[randomRow].includes('')) {
        return randomRow;
    } else {
        return this.getRandomRow();
    }
}

MatrixModel.prototype.getRandomCellExist = function (row) {
    var i, newArr = [], randomRow = this.attributes.grid[row], size = randomRow.length;

    for (i = 0; i < size; i += 1) {
        if (randomRow[i] === '') {
            newArr.push(i);
        }
    }

    return newArr[Math.floor(Math.random() * newArr.length)];
}

MatrixModel.prototype.getRandomCellWithoutDuplicates = function () {
    var randomRow = this.getRandomRow();
    this.attributes.grid[randomRow][this.getRandomCellExist(randomRow)] = this.getRandomValue();
}

MatrixModel.prototype.initialRender = function () {
    this.attributes.grid[this.getRandomRow()][this.getRandomCell()] = this.getRandomValue();
    this.getRandomCellWithoutDuplicates();

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

MatrixModel.prototype.moveRight = function (grid, gridSize, i, score) {
    for (i = 0; i < gridSize; i += 1) {
        grid[i].forEach(function (cell, index) {
            if (cell === '') {
                grid[i].unshift(grid[i].splice(index, 1).shift());
            }
        });

        score += this.sumSameNumbers(grid[i], grid[i].length);
    }

    return score;
}

MatrixModel.prototype.moveLeft = function (grid, gridSize, i, score) {
    for (i = 0; i < gridSize; i += 1) {
        grid[i].reverse().forEach(function (cell, index) {
            if (cell === '') {
                grid[i].unshift(grid[i].splice(index, 1).shift());
            }
        });

        score += this.sumSameNumbers(grid[i], grid[i].length);
        grid[i].reverse();
    }

    return score;
}

MatrixModel.prototype.moveUp = function (arr, grid, i, score) {
    grid.forEach(function (row) {
        row.forEach(function (cell, index) {
            if (!arr[index]) {
                arr.push([]);
            }
            arr[index].push(cell);
        });
    });

    arr.forEach(function (subArr) {
        subArr.reverse().forEach(function (element, index) {
            if (element === '') {
                subArr.unshift(subArr.splice(index, 1).shift());
            }
        });
    });

    for (i = 0; i < arr.length; i += 1) {
        score += this.sumSameNumbers(arr[i], arr[i].length);
        arr[i].reverse();
        arr[i].forEach(function (element, index) {
            grid[index].push(element);
        });
    }

    grid.forEach(function (row) {
        row.splice(0, arr.length);
    });

    return score;
}

MatrixModel.prototype.moveDown = function (arr, grid, i, score) {
    grid.forEach(function (row) {
        row.forEach(function (cell, index) {
            if (!arr[index]) {
                arr.push([]);
            }
            arr[index].push(cell);
        });
    });

    arr.forEach(function (subArr) {
        subArr.forEach(function (element, index) {
            if (element === '') {
                subArr.unshift(subArr.splice(index, 1).shift());
            }
        });
    });

    for (i = 0; i < arr.length; i += 1) {
        score += this.sumSameNumbers(arr[i], arr[i].length);
        arr[i].forEach(function (element, index) {
            grid[index].push(element);
        });
    }

    grid.forEach(function (row) {
        row.splice(0, arr.length);
    });

    return score;
}

MatrixModel.prototype.sumSameNumbers = function (subArr, subArrSize) {
    var i, sum = 0;

    for (i = 0; i < subArrSize; i += 1) {
        if (subArr[i] !== '' && subArr[i + 1] !== '' && subArr[i] === subArr[i + 1]) {
            subArr[i] += subArr[i + 1];
            sum += parseInt(subArr[i]);
            subArr.splice(i + 1, 1);
            subArr.unshift('');
        }
    }

    return sum;
}

MatrixModel.prototype.displayActions = function (key) {
    var arr = [], grid = this.attributes.grid, gridSize = grid.length, i, score = 0;

    switch (key) {
        case 'right':
            score += this.moveRight(grid, gridSize, i, score);
            break;
        case 'left':
            score += this.moveLeft(grid, gridSize, i, score);
            break;
        case 'up':
            score += this.moveUp(arr, grid, i, score);
            break;
        case 'down':
            score += this.moveDown(arr, grid, i, score);
            break;
    }

    this.getRandomCellWithoutDuplicates();
    localStorage.setItem('grid', JSON.stringify(grid));
    this.publish('changeData');

    return score;
}

MatrixModel.prototype.showWin = function () {
    var grid = this.attributes.grid;

    grid.forEach(function (row) {
        row.forEach(function (cell, index) {
            row.splice(index, 1, 'win');
        });
    });

    localStorage.setItem('grid', JSON.stringify(grid));
    this.publish('changeData');
}
