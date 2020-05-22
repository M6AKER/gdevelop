gdjs.LightRuntimeObject = function (runtimeScene, lightObjectData) {
    gdjs.RuntimeObject.call(this, runtimeScene, lightObjectData);

    if (this._renderer)
        gdjs.LightRuntimeObjectRenderer.call(this._renderer, this, runtimeScene);
    else
        /** @type {gdjs.TextRuntimeObjectRenderer} */
        this._renderer = new gdjs.LightRuntimeObjectRenderer(this, runtimeScene);

    // *ALWAYS* call `this.onCreated()` at the very end of your object constructor.
    this.onCreated();
} 

gdjs.LightRuntimeObject.prototype = Object.create( gdjs.RuntimeObject.prototype );
gdjs.registerObject("LightObject::Light", gdjs.LightRuntimeObject);

gdjs.LightRuntimeObject.prototype.getRendererObject = function() {
    return this._renderer.getRendererObject();
};

gdjs.LightRuntimeObject.prototype.update = function() {
    //this._renderer.ensureUpToDate();
};
