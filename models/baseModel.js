function BaseModel() {
    PubSub.call(this);
}

BaseModel.prototype = new PubSub();
BaseModel.prototype.constructor = BaseModel;

BaseModel.prototype.clear = function () {
    throw new Error('Override clear method!');
}
