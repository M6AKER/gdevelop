// @ts-check
describe.only('gdjs.TileMapCollisionMaskRuntimeObject', function () {
  const epsilon = 1 / (2 << 16);

  const createScene = (framePerSecond = 60) => {
    const runtimeGame = new gdjs.RuntimeGame({
      variables: [],
      // @ts-ignore - missing properties.
      properties: { windowWidth: 800, windowHeight: 600 },
      resources: {
        resources: [
          {
            file: 'base/tests-utils/simple-tiled-map/SmallTiledMap.json',
            kind: 'json',
            metadata: '',
            name: 'SmallTiledMap.json',
            userAdded: true,
            alwaysLoaded: true,
          },
          {
            file: 'base/tests-utils/simple-tiled-map/MiniTiledSet.json',
            kind: 'json',
            metadata: '',
            name: 'MiniTiledSet.json',
            userAdded: true,
            alwaysLoaded: true,
          },
        ],
      },
    });
    const runtimeScene = new gdjs.RuntimeScene(runtimeGame);
    runtimeScene.loadFromScene({
      layers: [
        {
          name: '',
          visibility: true,
          effects: [],
          cameras: [],

          ambientLightColorR: 0,
          ambientLightColorG: 0,
          ambientLightColorB: 0,
          isLightingLayer: false,
          followBaseLayerCamera: true,
        },
      ],
      variables: [],
      r: 0,
      v: 0,
      b: 0,
      mangledName: 'Scene1',
      name: 'Scene1',
      stopSoundsOnStartup: false,
      title: '',
      behaviorsSharedData: [],
      objects: [],
      instances: [],
    });
    setFramePerSecond(runtimeScene, framePerSecond);
    return runtimeScene;
  };
  const setFramePerSecond = (runtimeScene, framePerSecond) => {
    runtimeScene._timeManager.getElapsedTime = function () {
      return 1000 / framePerSecond;
    };
  };

  const addTileMapCollisionMask = (runtimeScene) => {
    const tileMap = new gdjs.TileMapCollisionMaskRuntimeObject(runtimeScene, {
      name: 'tilemap',
      type: 'TileMap::CollisionMask',
      behaviors: [],
      effects: [],
      content: {
        tilemapJsonFile: 'SmallTiledMap.json',
        tilesetJsonFile: 'MiniTiledSet.json',
        layerIndex: 0,
        typeFilter: 'obstacle',
        debugMode: false,
        fillColor: '#ffffff',
        outlineColor: '#ffffff',
        fillOpacity: 1,
        outlineOpacity: 1,
        outlineSize: 1,
      },
    });
    runtimeScene.addObject(tileMap);
    return tileMap;
  };

  const addObject = (runtimeScene) => {
    const object = new gdjs.TestRuntimeObject(runtimeScene, {
      name: 'obj1',
      type: '',
      behaviors: [],
      effects: [],
    });
    object.setCustomWidthAndHeight(8, 8);
    runtimeScene.addObject(object);
    return object;
  };

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  let runtimeScene;
  /**
   * @type {gdjs.TileMapCollisionMaskRuntimeObject}
   */
  let tileMap;
  beforeEach(async function () {
    runtimeScene = createScene();
    tileMap = addTileMapCollisionMask(runtimeScene);
    // TODO find a clean way to wait that the json is read.
    await delay(10);
  });

  it('can be measured', function () {
    tileMap.setPosition(100, 200);

    expect(tileMap.getWidth()).to.be(32);
    expect(tileMap.getHeight()).to.be(16);
    expect(tileMap.getCenterX()).to.be(16);
    expect(tileMap.getCenterY()).to.be(8);
  });

  /**
   * insideObject usually use the AABB of the object.
   * But, in case of a tile map, it makes more sense to look each tile individually.
   * It returns true when there is an hitbox in the tile.
   */
  it('can detect a point inside the collision mask', function () {
    tileMap.setPosition(100, 200);

    // The point is in the black square with an hitbox.
    expect(tileMap.insideObject(104, 204)).to.be(true);
    expect(tileMap.isCollidingWithPoint(104, 204)).to.be(true);

    // The point is in wite square without any hitbox.
    expect(tileMap.insideObject(112, 204)).to.be(false);
    expect(tileMap.isCollidingWithPoint(112, 204)).to.be(false);

    // The point is in black triangle part of the square that has an hitbox.
    expect(tileMap.insideObject(110, 210)).to.be(true);
    expect(tileMap.isCollidingWithPoint(110, 210)).to.be(true);

    // The point is in white triangle part of the square that has no hitbox.
    expect(tileMap.insideObject(114, 214)).to.be(true);
    expect(tileMap.isCollidingWithPoint(114, 214)).to.be(false);
  });

  it('can detect collision with an object', function () {
    tileMap.setPosition(100, 200);

    const object = addObject(runtimeScene);

    object.setPosition(96, 196);
    expect(gdjs.RuntimeObject.collisionTest(object, tileMap, true)).to.be(true);

    object.setPosition(90, 190);
    expect(gdjs.RuntimeObject.collisionTest(object, tileMap, true)).to.be(
      false
    );

    object.setPosition(115, 207);
    expect(gdjs.RuntimeObject.collisionTest(object, tileMap, true)).to.be(true);

    object.setPosition(116, 208);
    expect(gdjs.RuntimeObject.collisionTest(object, tileMap, true)).to.be(
      false
    );
  });
});
