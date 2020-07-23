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
    this.attributes.grid.forEach(row => {
        row.forEach((cell, i) => {
            if (cell === '') row.unshift(row.splice(i, 1));
        });
    });
}

MatrixModel.prototype.moveLeft = function () {
    this.attributes.grid.forEach(row => {
        row.reverse().forEach((cell, i) => {
            if (cell === '') row.unshift(row.splice(i, 1));
        });
        row.reverse();
    });
}

MatrixModel.prototype.moveUp = function () {
    let arr = [], grid = this.attributes.grid;

    grid.forEach(row => {
        row.forEach((cell, i) => {
            if (!arr[i]) arr.push([]);
            arr[i].push(cell);
        });
    });

    arr.forEach(subArr => {
        subArr.reverse().forEach((element, i) => {
            if (element === '') subArr.unshift(subArr.splice(i, 1));
        });
        subArr.reverse();
    });

    arr.forEach(subArr => {
        subArr.forEach((element, i) => grid[i].push(element));
    });

    grid.forEach(row => row.splice(0, arr.length));
}

MatrixModel.prototype.moveDown = function () {
    let arr = [], grid = this.attributes.grid;

    grid.forEach(row => {
        row.forEach((cell, i) => {
            if (!arr[i]) arr.push([]);
            arr[i].push(cell);
        });
    });

    arr.forEach(subArr => {
        subArr.forEach((element, i) => {
            if (element === '') subArr.unshift(subArr.splice(i, 1));
        });
    });

    arr.forEach(subArr => {
        subArr.forEach((element, i) => grid[i].push(element));
    });

    grid.forEach(row => row.splice(0, arr.length));
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
