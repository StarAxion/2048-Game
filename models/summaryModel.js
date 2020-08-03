function SummaryModel() {
    BaseModel.call(this);

    this.attributes = {
        totalScore: JSON.parse(localStorage.getItem('totalScore')) || 0,
        bestScore: JSON.parse(localStorage.getItem('bestScore')) || 0
    }

    var instance = this;
    SummaryModel = function () {
        return instance;
    }
}

SummaryModel.prototype = Object.create(BaseModel.prototype);
SummaryModel.prototype.constructor = SummaryModel;

SummaryModel.prototype.startNewGame = function () {
    this.attributes.totalScore = 0;
    localStorage.setItem('totalScore', JSON.stringify(this.attributes.totalScore));

    this.publish('changeData');
}

SummaryModel.prototype.setTotalScore = function (score) {
    this.attributes.totalScore += score;
    localStorage.setItem('totalScore', JSON.stringify(this.attributes.totalScore));

    this.publish('changeData');
}

SummaryModel.prototype.setBestScore = function () {
    if (this.attributes.bestScore < this.attributes.totalScore) {
        this.attributes.bestScore = this.attributes.totalScore;
        localStorage.setItem('bestScore', JSON.stringify(this.attributes.bestScore));
    }

    this.publish('changeData');
}
