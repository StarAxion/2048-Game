function Controller() {
    this.matrixModel = new MatrixModel();
    this.summaryModel = new SummaryModel();
}

Controller.prototype.onKeyPress = function (event) {
    var key, scoreResult = Number(document.getElementById('scoreResult').innerText);

    switch (event.keyCode) {
        case 39:
            key = 'right';
            break;
        case 37:
            key = 'left';
            break;
        case 38:
            key = 'up';
            break;
        case 40:
            key = 'down';
            break;
        default:
            return false;
    }

    if (scoreResult >= 2048) {
        this.matrixModel.showWin();
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
