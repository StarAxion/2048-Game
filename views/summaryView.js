function SummaryView() {
    this.summaryModel = new SummaryModel();
    this.template = document.getElementById('summaryTemplate').innerHTML;
    this.className = 'summary';
    BaseView.call(this);
}

// inheritance SummaryView from BaseView
SummaryView.prototype = Object.create(BaseView.prototype);
SummaryView.prototype.constructor = SummaryView;

SummaryView.prototype.beforeRender = function () {
    this.summaryModel.subscribe('changeData', this.reRender, this);
}

SummaryView.prototype.render = function () {
    return parseModelToView(this.template, this.summaryModel.attributes);
}

SummaryView.prototype.afterRender = function () { }
