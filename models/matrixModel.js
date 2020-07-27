function MatrixModel() {
    BaseModel.call(this);
    this.attributes = {
        grid: [
            ['', '', '', ''],
            ['', '', '', ''],
            ['', '', '', ''],
            ['', '', '', '']
        ],
        size: {
            width: 4,
            height: 4
        }
    }

    var instance = this;
    MatrixModel = function () {
        return instance;
    }

    this.initialRender();

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
    this.attributes.grid[this.getRandomCell()][this.getRandomCell()] = this.getRandomValue();
    this.getRandomCellWithoutDuplicates();
    this.publish('changeData');
}

MatrixModel.prototype.startNewGame = function () {
    this.publish('changeData');
}

MatrixModel.prototype.moveRight = function () {
    var grid = this.attributes.grid, i, gridSize = grid.length;

    for (i = 0; i < gridSize; i += 1) {
        grid[i].forEach(function (cell, index) {
            if (cell === '') {
                grid[i].unshift(grid[i].splice(index, 1));
            }
        });

        this.addSameNumbers(grid[i], grid[i].length);
    }
}

MatrixModel.prototype.moveLeft = function () {
    var grid = this.attributes.grid, i, gridSize = grid.length;

    for (i = 0; i < gridSize; i += 1) {
        grid[i].reverse().forEach(function (cell, index) {
            if (cell === '') {
                grid[i].unshift(grid[i].splice(index, 1));
            }
        });

        this.addSameNumbers(grid[i], grid[i].length);
        grid[i].reverse();
    }
}

MatrixModel.prototype.moveUp = function () {
    var arr = [], grid = this.attributes.grid, i;

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
                subArr.unshift(subArr.splice(index, 1));
            }
        });
    });

    for (i = 0; i < arr.length; i += 1) {
        this.addSameNumbers(arr[i], arr[i].length);
        arr[i].reverse();
        arr[i].forEach(function (element, index) {
            grid[index].push(element);
        });
    }

    grid.forEach(function (row) {
        row.splice(0, arr.length);
    });
}

MatrixModel.prototype.moveDown = function () {
    var arr = [], grid = this.attributes.grid, i;

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
                subArr.unshift(subArr.splice(index, 1));
            }
        });
    });

    for (i = 0; i < arr.length; i += 1) {
        this.addSameNumbers(arr[i], arr[i].length);
        arr[i].forEach(function (element, index) {
            grid[index].push(element);
        });
    }

    grid.forEach(function (row) {
        row.splice(0, arr.length);
    });
}

MatrixModel.prototype.addSameNumbers = function (subArr, subArrSize) {
    var i;
    for (i = 0; i < subArrSize; i += 1) {
        if (subArr[i] !== '' && subArr[i + 1] !== '' && subArr[i] === subArr[i + 1]) {
            subArr[i] += subArr[i + 1];
            subArr.unshift('');
            subArr.pop();
        }
    }
}

MatrixModel.prototype.displayActions = function (key) {
    switch (key) {
        case 'right':
            this.moveRight();
            break;
        case 'left':
            this.moveLeft();
            break;
        case 'up':
            this.moveUp();
            break;
        case 'down':
            this.moveDown();
            break;
    }

    this.publish('changeData');
}
