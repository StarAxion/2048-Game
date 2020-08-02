function BaseView() {
    this.rootElement = document.createElement('div');
}

BaseView.prototype.show = function (element) {
    this.beforeRender();
    this.rootElement.innerHTML = this.render();
    this.rootElement.classList.add(this.className);
    element.appendChild(this.rootElement);
    this.afterRender();
}

// Render phase
BaseView.prototype.render = function () {
    throw new Error('Your component should have render method!');
}

BaseView.prototype.beforeRender = function () { };
BaseView.prototype.afterRender = function () { };

// Update phase
BaseView.prototype.reRender = function () {
    this.beforeUpdate();
    this.rootElement.innerHTML = this.render();
    this.afterUpdate();
}

BaseView.prototype.beforeUpdate = function () { };
BaseView.prototype.afterUpdate = function () { };
