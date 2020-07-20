function MatrixView() {
    this.matrixModel = new MatrixModel();
    this.controller = new Controller();
    this.className = 'table';
    this.template = document.getElementById('matrixTemplate').innerHTML;
    BaseView.call(this);
}

// inheritance MatrixView from BaseView
MatrixView.prototype = Object.create(BaseView.prototype);
MatrixView.prototype.constructor = MatrixView;

MatrixView.prototype.beforeRender = function () {
    this.matrixModel.subscribe('changeData', this.reRender, this);
}

MatrixView.prototype.render = function () {
    var i, j, attributes = this.matrixModel.attributes, str = '';

    for (i = 0; i < attributes.size.width; i += 1) {
        str += '<div class="row">';
        for (j = 0; j < attributes.size.height; j += 1) {
            str += '<div class="cell appear-' + attributes.grid[i][j] + ' ">' + attributes.grid[i][j] + '</div>';
        }
        str += '</div>';
    }

    return this.template.replace('{{matrix}}', str);
}

MatrixView.prototype.afterRender = function () {
    window.onkeydown = this.controller.onKeyPress.bind(this.controller);
    var newGameButton = document.getElementById('newGameBtn');
    newGameButton.addEventListener('click', this.controller.onClickNewGame.bind(this.controller));
}