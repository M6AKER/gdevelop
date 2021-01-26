// @flow
/**
 * This is a declaration of an extension for GDevelop 5.
 *
 * ℹ️ Changes in this file are watched and automatically imported if the editor
 * is running. You can also manually run `node import-GDJS-Runtime.js` (in newIDE/app/scripts).
 *
 * The file must be named "JsExtension.js", otherwise GDevelop won't load it.
 * ⚠️ If you make a change and the extension is not loaded, open the developer console
 * and search for any errors.
 *
 * More information on https://github.com/4ian/GDevelop/blob/master/newIDE/README-extensions.md
 */

/*::
// Import types to allow Flow to do static type checking on this file.
// Extensions declaration are typed using Flow (like the editor), but the files
// for the game engine are checked with TypeScript annotations.
import { type ObjectsRenderingService, type ObjectsEditorService } from '../JsExtensionTypes.flow.js'
*/

module.exports = {
  createExtension: function (
    _ /*: (string) => string */,
    gd /*: libGDevelop */
  ) {
    const extension = new gd.PlatformExtension();
    extension
      .setExtensionInformation(
        'BitmapText',
        _('Bitmap Text Object'),
        _('Displays a text as a bitmap image.'),
        'Aurélien Vivet',
        'Open source (MIT License)'
      )
      .setExtensionHelpPath('/objects/bitmaptext');

    const bitmapTextObject = new gd.ObjectJsImplementation();
    // $FlowExpectedError
    bitmapTextObject.updateProperty = function (
      objectContent,
      propertyName,
      newValue
    ) {
      if (propertyName in objectContent) {
        if (typeof objectContent[propertyName] === 'boolean')
          objectContent[propertyName] = newValue === '1';
        else if (typeof objectContent[propertyName] === 'number')
          objectContent[propertyName] = parseFloat(newValue);
        else objectContent[propertyName] = newValue;
        return true;
      }

      return false;
    };
    // $FlowExpectedError
    bitmapTextObject.getProperties = function (objectContent) {
      const objectProperties = new gd.MapStringPropertyDescriptor();

      objectProperties
        .getOrCreate('text')
        .setValue(objectContent.text)
        .setType('textarea')
        .setLabel(_('Text'));

      objectProperties
        .getOrCreate('opacity')
        .setValue(objectContent.opacity.toString())
        .setType('number')
        .setLabel(_('Opacity (0-255)'));

      objectProperties
        .getOrCreate('align')
        .setValue(objectContent.align)
        .setType('choice')
        .addExtraInfo('left')
        .addExtraInfo('center')
        .addExtraInfo('right')
        .setLabel(_('Alignment, when multiple lines are displayed'));

      objectProperties
        .getOrCreate('bitmapFontFile')
        .setValue(objectContent.bitmapFontFile)
        .setType('resource')
        .addExtraInfo('bitmapFont') //fnt or xml files
        .setLabel(_('Bitmap Font'));

      objectProperties
        .getOrCreate('bitmapTextureFile')
        .setValue(objectContent.bitmapTextureFile)
        .setType('resource')
        .addExtraInfo('image')
        .setLabel(_('Bitmap texture'));

      objectProperties
        .getOrCreate('scale')
        .setValue(objectContent.scale.toString())
        .setType('number')
        .setLabel(_('Text scale'));

      objectProperties
        .getOrCreate('tint')
        .setValue(objectContent.tint)
        .setType('color')
        .setLabel(_('Font tint'));

      objectProperties
        .getOrCreate('wordWrap')
        .setValue(objectContent.wordWrap ? 'true' : 'false')
        .setType('boolean')
        .setLabel(_('Word wrapping'));

      return objectProperties;
    };
    bitmapTextObject.setRawJSONContent(
      JSON.stringify({
        text:
          'This text use the default bitmap font,\nadd your files in the object properties.',
        opacity: 255,
        scale: 1,
        fontSize: 60,
        tint: '#000000',
        bitmapFontFile: '',
        bitmapTextureFile: '',
        align: 'left',
        wordWrap: true,
      })
    );

    // $FlowExpectedError
    bitmapTextObject.updateInitialInstanceProperty = function (
      objectContent,
      instance,
      propertyName,
      newValue,
      project,
      layout
    ) {
      return false;
    };
    // $FlowExpectedError
    bitmapTextObject.getInitialInstanceProperties = function (
      content,
      instance,
      project,
      layout
    ) {
      var instanceProperties = new gd.MapStringPropertyDescriptor();
      return instanceProperties;
    };

    const object = extension
      .addObject(
        'BitmapTextObject',
        _('BitmapText'),
        _(
          'Displays a text using a "Bitmap Font", which is more performant than a traditional text but also less flexible (only alphanumerical characters are supported).'
        ),
        'JsPlatform/Extensions/bitmapfont32.png',
        bitmapTextObject
      )
      .setIncludeFile('Extensions/BitmapText/bitmaptextruntimeobject.js')
      .addIncludeFile(
        'Extensions/BitmapText/bitmaptextruntimeobject-pixi-renderer.js'
      );

    object
      .addCondition(
        'Text',
        _('Compare the text'),
        _('Compare the text of the Bitmap text object.'),
        _('the text'),
        '',
        'res/conditions/text24.png',
        'res/conditions/text.png'
      )
      .addParameter('object', _('Bitmap text'), 'BitmapTextObject', false)
      .useStandardOperatorParameters('string')
      .getCodeExtraInformation()
      .setFunctionName('getText');

    object
      .addCondition(
        'Opacity',
        _('Opacity'),
        _(
          'Compare the opacity of the Bitmap text object, between 0 (fully transparent) to 255 (opaque).'
        ),
        _('the opacity'),
        '',
        'res/conditions/opacity24.png',
        'res/conditions/opacity.png'
      )
      .addParameter('object', _('Bitmap text'), 'BitmapTextObject', false)
      .useStandardOperatorParameters('number')
      .getCodeExtraInformation()
      .setFunctionName('getOpacity');

    object
      .addCondition(
        'FontSize',
        _('Font size'),
        _('Compare the font size of the Bitmap text object.'),
        _('the font size'),
        '',
        'res/conditions/characterSize24.png',
        'res/conditions/characterSize.png'
      )
      .addParameter('object', _('Bitmap text'), 'BitmapTextObject', false)
      .useStandardRelationalOperatorParameters('number')
      .getCodeExtraInformation()
      .setFunctionName('getFontSize');

    object
      .addCondition(
        'Scale',
        _('Scale'),
        _('Compare the scale of the Bitmap text object.'),
        _('the scale'),
        '',
        'res/actions/scale24.png',
        'res/actions/scale.png'
      )
      .addParameter('object', _('Bitmap text'), 'BitmapTextObject', false)
      .useStandardRelationalOperatorParameters('number')
      .getCodeExtraInformation()
      .setFunctionName('getScale');

    object
      .addCondition(
        'Font',
        _('Font'),
        _(
          'Compare the name of the font resource used for the Bitmap text object.'
        ),
        _('the font'),
        _('Style'),
        'res/conditions/font24.png',
        'res/conditions/font.png'
      )
      .addParameter('object', _('Bitmap text'), 'BitmapTextObject', false)
      .useStandardRelationalOperatorParameters('string')
      .getCodeExtraInformation()
      .setFunctionName('getBitmapFontResourceName'); //TODO

    object
      .addCondition(
        'Alignment',
        _('Alignment'),
        _('Compare the alignment of the Bitmap text object.'),
        _('the alignment'),
        _('Style'),
        'res/actions/textAlign24.png',
        'res/actions/textAlign.png'
      )
      .addParameter('object', _('Bitmap text'), 'BitmapTextObject', false)
      .useStandardRelationalOperatorParameters('string')
      .getCodeExtraInformation()
      .setFunctionName('getAlignment');

    object
      .addCondition(
        'WordWrap',
        _('Wrapping'),
        _('Check if word wrap is enabled.'),
        _('_PARAM0_ word wrapping is activated'),
        _('Style'),
        'res/conditions/wordWrap24.png',
        'res/conditions/wordWrap.png'
      )
      .addParameter('object', _('Bitmap text'), 'BitmapTextObject', false)
      .getCodeExtraInformation()
      .setFunctionName('getWordWrap');

    object
      .addCondition(
        'WrappingWidth',
        _('Wrapping width'),
        _(
          'Compare the width, in pixels, after which the text is wrapped on next line.'
        ),
        _('the wrapping width'),
        _('Style'),
        'res/actions/wordWrap24.png',
        'res/actions/wordWrap.png'
      )
      .addParameter('object', _('Bitmap text'), 'BitmapTextObject', false)
      .useStandardRelationalOperatorParameters('number')
      .getCodeExtraInformation()
      .setFunctionName('getWrappingWidth');

    object
      .addAction(
        'Text',
        _('Modify the text'),
        _('Modify the text of a Bitmap text object.'),
        _('the Bitmap text'),
        '',
        'res/actions/text24.png',
        'res/actions/text.png'
      )
      .addParameter('object', _('Bitmap text'), 'BitmapTextObject', false)
      .useStandardOperatorParameters('string')
      .getCodeExtraInformation()
      .setFunctionName('setText')
      .setGetter('getText');

    object
      .addAction(
        'Tint',
        _('Tint'),
        _('Change the tint of an object. The default color is white.'),
        _('Change tint of _PARAM0_ to _PARAM1_'),
        _('Effects'),
        'res/actions/color24.png',
        'res/actions/color24.png'
      )
      .addParameter('object', _('Bitmap text'), 'BitmapTextObject', false)
      .addParameter('color', _('Color'), '', false)
      .setDefaultValue('0;0;0')
      .getCodeExtraInformation()
      .setFunctionName('setTint');

    object
      .addAction(
        'Opacity',
        _('Change text opacity'),
        _('Modify the opacity of a Bitmap text object.'),
        _('the opacity'),
        '',
        'res/actions/opacity24.png',
        'res/actions/opacity.png'
      )
      .addParameter('object', _('Bitmap text'), 'BitmapTextObject', false)
      .useStandardOperatorParameters('number')
      .getCodeExtraInformation()
      .setFunctionName('setOpacity')
      .setGetter('getOpacity');

    object
      .addAction(
        'Scale',
        _('Scale'),
        _('Modify the scale of a Bitmap text object.'),
        _('the scale'),
        '',
        'res/actions/scale24.png',
        'res/actions/scale.png'
      )
      .addParameter('object', _('Bitmap text'), 'BitmapTextObject', false)
      .useStandardOperatorParameters('number')
      .getCodeExtraInformation()
      .setFunctionName('setScale')
      .setGetter('getScale');

    object
      .addAction(
        'BitmapFontName',
        _('Font'),
        _('Change the font used by the Bitmap text object.'),
        _('Set the font of _PARAM0_ to _PARAM1_'),
        _('Style'),
        'res/actions/font24.png',
        'res/actions/font.png'
      )
      .addParameter('object', _('Bitmap text'), 'BitmapTextObject', false)
      .addParameter('font', _('Font resource'), '', false)
      .getCodeExtraInformation()
      .setFunctionName('setFont');

    object
      .addAction(
        'Alignment',
        _('Alignment'),
        _('Change the alignment of a Bitmap text object.'),
        _('Set alignement of _PARAM0_ to _PARAM1_'),
        _('Style'),
        'res/actions/textAlign24.png',
        'res/actions/textAlign.png'
      )
      .addParameter('object', _('Bitmap text'), 'BitmapTextObject', false)
      .addParameter(
        'stringWithSelector',
        _('Alignment'),
        '["left", "center", "right"]',
        false
      )
      .getCodeExtraInformation()
      .setFunctionName('setAlignment');

    object
      .addAction(
        'WordWrap',
        _('Word wrap'),
        _('Modify the word wrap of a Bitmap text object.'),
        _('Set word wrapping of _PARAM0_: _PARAM1_'),
        _('Style'),
        'res/actions/wordWrap24.png',
        'res/actions/wordWrap.png'
      )
      .addParameter('object', _('Bitmap text'), 'BitmapTextObject', false)
      .addParameter('yesorno', _('Activate word wrap'), '', false)
      .getCodeExtraInformation()
      .setFunctionName('setWordWrap');

    object
      .addAction(
        'WrappingWidth',
        _('Wrapping width'),
        _(
          'Change the width, in pixels, after which the text is wrapped on next line.'
        ),
        _('the wrapping width'),
        _('Style'),
        'res/actions/scaleWidth24.png',
        'res/actions/scaleWidth.png'
      )
      .addParameter('object', _('Bitmap text'), 'BitmapTextObject', false)
      .useStandardOperatorParameters('number')
      .getCodeExtraInformation()
      .setFunctionName('setWrappingWidth')
      .setGetter('getWrappingWidth');

    object
      .addExpression(
        'Scale',
        _('Scale'),
        _('Scale'),
        _('Scale'),
        'res/actions/scale24.png',
        'res/actions/scale24.png'
      )
      .addParameter('object', _('Bitmap text'), 'BitmapTextObject', false)
      .getCodeExtraInformation()
      .setFunctionName('getScale');

    object
      .addExpression(
        'FontSize',
        _('Font size'),
        _('Font size'),
        _('Font'),
        'res/actions/characterSize24.png',
        'res/actions/characterSize24.png'
      )
      .addParameter('object', _('Bitmap text'), 'BitmapTextObject', false)
      .getCodeExtraInformation()
      .setFunctionName('getFontSize');

    object
      .addExpression(
        'Text',
        _('Text'),
        _('Text'),
        '',
        'res/actions/characterSize24.png',
        'res/actions/characterSize24.png'
      )
      .addParameter('object', _('Bitmap text'), 'BitmapTextObject', false)
      .getCodeExtraInformation()
      .setFunctionName('getText');

    object
      .addExpression(
        'FontName',
        _('Font name'),
        _('Font name'),
        _('Font'),
        'res/actions/characterSize24.png',
        'res/actions/characterSize24.png'
      )
      .addParameter('object', _('Bitmap text'), 'BitmapTextObject', false)
      .getCodeExtraInformation()
      .setFunctionName('getFont');

    return extension;
  },

  /**
   * You can optionally add sanity tests that will check the basic working
   * of your extension behaviors/objects by instanciating behaviors/objects
   * and setting the property to a given value.
   *
   * If you don't have any tests, you can simply return an empty array.
   *
   * But it is recommended to create tests for the behaviors/objects properties you created
   * to avoid mistakes.
   */
  runExtensionSanityTests: function (
    gd /*: libGDevelop */,
    extension /*: gdPlatformExtension*/
  ) {
    return [];
  },
  /**
   * Register editors for objects.
   *
   * ℹ️ Run `node import-GDJS-Runtime.js` (in newIDE/app/scripts) if you make any change.
   */
  registerEditorConfigurations: function (
    objectsEditorService /*: ObjectsEditorService */
  ) {
    objectsEditorService.registerEditorConfiguration(
      'BitmapText::BitmapTextObject',
      objectsEditorService.getDefaultObjectJsImplementationPropertiesEditor({
        helpPagePath: '/objects/bitmaptext',
      })
    );
  },
  /**
   * Register renderers for instance of objects on the scene editor.
   *
   * ℹ️ Run `node import-GDJS-Runtime.js` (in newIDE/app/scripts) if you make any change.
   */
  registerInstanceRenderers: function (
    objectsRenderingService /*: ObjectsRenderingService */
  ) {
    const RenderedInstance = objectsRenderingService.RenderedInstance;
    const PIXI = objectsRenderingService.PIXI;

    /**
     * Renderer for instances of BitmapText inside the IDE.
     *
     * @extends RenderedBitmapTextInstance
     * @class RenderedBitmapTextInstance
     * @constructor
     */
    function RenderedBitmapTextInstance(
      project,
      layout,
      instance,
      associatedObject,
      pixiContainer,
      pixiResourcesLoader
    ) {
      RenderedInstance.call(
        this,
        project,
        layout,
        instance,
        associatedObject,
        pixiContainer,
        pixiResourcesLoader
      );

      // Set up a and generate a default bitmap font
      // It will then be replaced with the bitmap font setup by the user (see `update` method)

      // Define same as  bitmapTextObject.setRawJSONContent() on top of this file
      this._bitmapFontStyle = new PIXI.TextStyle();
      this._bitmapFontStyle.fontFamily = 'Arial';
      this._bitmapFontStyle.fontSize = 60;
      this._bitmapFontStyle.align = 'left';
      this._bitmapFontStyle.wordWrap = true;
      this._bitmapFontStyle.fill = '#000000';

      const defaultSlugFontName =
        this._bitmapFontStyle.fontFamily +
        '-' +
        this._bitmapFontStyle.fontSize +
        '-' +
        this._bitmapFontStyle.fill +
        '-bitmapFont';
      this._bitmapFontStyle.fontName = defaultSlugFontName;

      //Generate default bitmap font
      PIXI.BitmapFont.from(defaultSlugFontName, this._bitmapFontStyle, {
        chars: [
          [' ', '~'], // All the printable ASCII characters
        ],
      });

      this._defaultFont = true;

      // We'll track changes of the font to trigger the loading of the new font.
      this._currentBitmapFontFile = '';
      this._currentBitmapTextureFile = '';

      this._pixiObject = new PIXI.BitmapText(
        'Text placeholder, default Arial font used',
        {
          fontName: this._bitmapFontStyle.fontName,
        }
      );

      this._pixiObject.anchor.x = 0.5;
      this._pixiObject.anchor.y = 0.5;
      this._pixiContainer.addChild(this._pixiObject);
      this.update();
    }
    RenderedBitmapTextInstance.prototype = Object.create(
      RenderedInstance.prototype
    );

    /**
     * Return the path to the thumbnail of the specified object.
     */
    RenderedBitmapTextInstance.getThumbnail = function (
      project,
      resourcesLoader,
      object
    ) {
      return 'JsPlatform/Extensions/bitmapfont24.png';
    };

    /**
     * Generate the PIXI.BitmapFont for the object according to `this._bitmapFontStyle`.
     * You must ensure that *the font family is already loaded* before calling this.
     */
    RenderedBitmapTextInstance.prototype._ensureFontAvailableAndGetFontName = async function () {
      const slugFontName =
        this._bitmapFontStyle.fontFamily +
        '-' +
        this._bitmapFontStyle.fontSize +
        '-' +
        this._bitmapFontStyle.fill +
        '-bitmapFont';

      // NOTE : The name of the fontFamily used is the name in the fnt/xml not the name of the file/resource name from resource tabs of GD,
      // this particularity should require an optionnal string property in the object panel 'Override font name'.
      // instead for now rename the resource name of the fnt/xml file to the name of the font.

      // Load the font if it's not available yet.
      if (!PIXI.BitmapFont.available[slugFontName]) {
        try {
          const bitmapFontResourceName = this._associatedObject
            .getProperties()
            .get('bitmapFontFile')
            .getValue();

          const fontData = await this._pixiResourcesLoader.getResourceBitmapFont(
            this._project,
            bitmapFontResourceName
          );

          const bitmapTextureResourceName = this._associatedObject
            .getProperties()
            .get('bitmapTextureFile')
            .getValue();

          const texture = this._pixiResourcesLoader.getPIXITexture(
            this._project,
            bitmapTextureResourceName
          );

          const bitmapFont = PIXI.BitmapFont.install(fontData, texture);
          return bitmapFont.font;
        } catch (err) {
          console.error('Unable to load the bitmap font: ', error);
        }
      } else {
        console.error(
          'The bitmap font: ' + slugFontName + ', has already been generated.'
        );
      }

      // TODO: find a way to unload the BitmapFont that are not used anymore, otherwise
      // we risk filling up the memory with useless BitmapFont - especially when the user
      // plays with the color/size.
    };

    // This is called to update the PIXI object on the scene editor
    RenderedBitmapTextInstance.prototype.update = function () {
      const properties = this._associatedObject.getProperties();

      // Update the rendered text properties (note: Pixi is only
      // applying changes if there were changed).
      const rawText = properties.get('text').getValue();
      this._pixiObject.text = rawText;

      if (this._defaultFont) {
        this._pixiObject.text =
          'This text use the default bitmap font,\nadd your files in the object properties.';
      }

      const opacity = properties.get('opacity').getValue();
      this._pixiObject.alpha = opacity / 255;

      const align = properties.get('align').getValue();
      this._pixiObject.align = align;

      const color = properties.get('tint').getValue();
      this._pixiObject.tint = color;

      const scale = properties.get('scale').getValue() || 1;
      this._pixiObject.scale.set(scale);

      // Track the changes in font to load the new requested font.
      const bitmapFontFile = properties.get('bitmapFontFile').getValue();
      const bitmapTextureFile = properties.get('bitmapTextureFile').getValue();

      if (
        this._currentBitmapFontFile !== bitmapFontFile ||
        this._currentBitmapTextureFile !== bitmapTextureFile
      ) {
        this._currentBitmapFontFile = bitmapFontFile;
        this._currentBitmapTextureFile = bitmapTextureFile;

        this._texture = this._pixiResourcesLoader.getPIXITexture(
          this._project,
          bitmapTextureFile
        );

        this._pixiResourcesLoader
          .getResourceBitmapFont(this._project, bitmapFontFile)
          .then((fontData) => {
            const bitmapFont = PIXI.BitmapFont.install(fontData, this._texture);

            //this._bitmapFontStyle.font = bitmapFont.font;
            this._pixiObject.fontName = bitmapFont.font;
            this._pixiObject.dirty = true;
            this._defaultFont = false;
          })
          .catch((err) => {
            console.warn('Unable to load font data', err);
            this._defaultFont = true;
          });
      }

      // Set up the wrapping width if enabled.
      const wordWrap = properties.get('wordWrap').getValue() === 'true';
      if (wordWrap && this._instance.hasCustomSize()) {
        this._pixiObject.maxWidth =
          this._instance.getCustomWidth() / this._pixiObject.scale.x;
        this._pixiObject.dirty = true;
      } else {
        this._pixiObject.maxWidth = 0;
        this._pixiObject.dirty = true;
      }

      this._pixiObject.position.x =
        this._instance.getX() + this._pixiObject.width / 2;
      this._pixiObject.position.y =
        this._instance.getY() + this._pixiObject.height / 2;
      this._pixiObject.rotation = RenderedInstance.toRad(
        this._instance.getAngle()
      );
    };

    /**
     * Return the width of the instance, when it's not resized.
     */
    RenderedBitmapTextInstance.prototype.getDefaultWidth = function () {
      return this._pixiObject.width;
    };

    /**
     * Return the height of the instance, when it's not resized.
     */
    RenderedBitmapTextInstance.prototype.getDefaultHeight = function () {
      return this._pixiObject.height;
    };

    objectsRenderingService.registerInstanceRenderer(
      'BitmapText::BitmapTextObject',
      RenderedBitmapTextInstance
    );
  },
};
