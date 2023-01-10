// @flow
import RenderedInstance from './RenderedInstance';
import PixiResourcesLoader from '../../ObjectsRendering/PixiResourcesLoader';
import ResourcesLoader from '../../ResourcesLoader';
import * as PIXI from 'pixi.js-legacy';

/**
 * Objects with an unknown type are rendered with a placeholder rectangle.
 */
export default class RenderedUnknownInstance extends RenderedInstance {
  _width: number;
  _height: number;

  constructor(
    project: gdProject,
    layout: gdLayout,
    instance: gdInitialInstance,
    associatedObjectConfiguration: gdObjectConfiguration,
    pixiContainer: PIXI.Container,
    pixiResourcesLoader: Class<PixiResourcesLoader>
  ) {
    super(
      project,
      layout,
      instance,
      associatedObjectConfiguration,
      pixiContainer,
      pixiResourcesLoader
    );

    //This renderer show a placeholder for the object:
    this._pixiObject = new PIXI.Graphics();
    this._pixiContainer.addChild(this._pixiObject);

    this._width = instance.hasCustomSize() ? instance.getCustomWidth() : 32;
    this._height = instance.hasCustomSize() ? instance.getCustomHeight() : 32;

    this._pixiObject.beginFill(0x0033ff);
    this._pixiObject.lineStyle(1, 0xffd900, 1);
    this._pixiObject.moveTo(0, 0);
    this._pixiObject.lineTo(this._width, 0);
    this._pixiObject.lineTo(this._width, this._height);
    this._pixiObject.lineTo(0, this._height);
    this._pixiObject.endFill();
  }

  static getThumbnail(
    project: gdProject,
    resourcesLoader: Class<ResourcesLoader>,
    objectConfiguration: gdObjectConfiguration
  ) {
    return 'res/unknown32.png';
  }

  update() {
    this._pixiObject.position.x = this._instance.getX();
    this._pixiObject.position.y = this._instance.getY();
    this._pixiObject.rotation = (this._instance.getAngle() * Math.PI) / 180.0;
  }

  getCenterX() {
    return this._width / 2;
  }

  getCenterY() {
    return this._height / 2;
  }
}
