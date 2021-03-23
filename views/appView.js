function AppView() {
    var matrixView = new MatrixView();
    var summaryView = new SummaryView();

    this.render = function (selector) {
        var element = document.getElementById(selector);
        matrixView.show(element);
        summaryView.show(element);
    }
}

var appView = new AppView();
appView.render('root');
