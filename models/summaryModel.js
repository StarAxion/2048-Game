function SummaryModel() {
    BaseModel.call(this);

    this.attributes = {
        totalScore: 0,
        bestScore: 0
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
    this.publish('changeData');
}

SummaryModel.prototype.setTotalScore = function (score) {
    this.attributes.totalScore += score;
    this.publish('changeData');
}

SummaryModel.prototype.setBestScore = function () {
    if (this.attributes.bestScore < this.attributes.totalScore) {
        this.attributes.bestScore = this.attributes.totalScore;
    }
    this.publish('changeData');
}
