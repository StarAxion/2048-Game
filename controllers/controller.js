function Controller() {
    this.matrixModel = new MatrixModel();
    this.summaryModel = new SummaryModel();
}

Controller.prototype.onKeyPress = function (event) {
    var key, scoreResult = Number(document.getElementById('scoreResult').innerText);

    switch (event.key) {
        case 'ArrowRight':
            key = 'right';
            break;
        case 'ArrowLeft':
            key = 'left';
            break;
        case 'ArrowUp':
            key = 'up';
            break;
        case 'ArrowDown':
            key = 'down';
            break;
        default:
            return false;
    }

    if (scoreResult >= 2048) {
        setTimeout(() => {
            this.matrixModel.showWin();
        }, 200);
    } else {
        this.summaryModel.setTotalScore(this.matrixModel.displayActions(key));
        this.summaryModel.setBestScore();
    }
}

Controller.prototype.onClickNewGame = function (event) {
    if (event.target.id === 'newGameBtn') {
        this.matrixModel.startNewGame();
        this.summaryModel.startNewGame();
    }
}
