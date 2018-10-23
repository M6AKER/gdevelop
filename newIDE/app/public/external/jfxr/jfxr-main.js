import {
  createPathEditorHeader
} from '../utils/path-editor.js';

const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;
const fs = require('fs');
const remote = electron.remote;

let editorContentDocument, headerObject,
  jfxr = null;

const loadMetaData = metaData => {
  jfxr.autoplay = false
  if ('jfxr' in metaData) {
    jfxr.getSound().parse(metaData.jfxr.data);
    jfxr.getSound().name = metaData.jfxr.name;
  } else {
    jfxr.applyPreset(jfxr.presets[1]);
  };
  jfxr.autoplay = true
  remote.getCurrentWebContents().setAudioMuted(false)
};

const closeWindow = () => {
  remote.getCurrentWindow().close();
};

const saveSoundEffect = pathEditor => {
  const metadata = {
    data: jfxr.getSound().serialize(),
    name: headerObject.nameInput.value
  }
  const clip = jfxr.synth.run();
  clip.then(data => {
    var blob = new Blob([data.toWavBytes()], {
      type: 'audio/wav',
    });
    var fileReader = new FileReader();
    fileReader.onload = function () {
      fs.writeFileSync(
        pathEditor.state.fullPath,
        Buffer(new Uint8Array(this.result))
      );
      ipcRenderer.send(
        'jfxr-changes-saved',
        pathEditor.state.fullPath,
        metadata
      );
      closeWindow();
    };
    fileReader.readAsArrayBuffer(blob);
  });
};

// Wait for the window to be fully initialized before sending the
// ready event. Don't use DOMContentLoaded as it was observed to be fired
// even if jfxr DOM/scripts are not yet loaded.
window.addEventListener('load', function () {
  ipcRenderer.send('jfxr-ready');
});

// Called to load a sound. Should be called after the window is fully loaded.
ipcRenderer.on('jfxr-open', (event, receivedOptions) => {
  // Gain access to control elements
  const editorFrameEl = document.getElementById('jfxr-frame');
  editorContentDocument = editorFrameEl.contentDocument;
  jfxr = editorFrameEl.contentWindow.angular
    .element(editorContentDocument.getElementsByClassName('ng-scope')[0])
    .scope().ctrl;

  // load metadata if found
  loadMetaData(receivedOptions.metadata);

  // load a custom save file(s) header
  const pathEditorHeaderDiv = document.getElementById('path-editor-header');
  const headerStyle = {
    saveFolderLabel: 'float: left;margin-left: 2px; font-size:15px;margin-top: 10px;color:aqua',
    nameInput: 'font-family:"Courier New";height:27px;width:90px;float:left;margin-left: 2px;padding:4px;margin-top: 4px;font-size:15px;border: 2px solid #e5cd50;border-radius: 3px;background-color:black; color: #e5cd50;',
    saveButton: 'float:right;margin-left:2px;margin-right:4px;border: 2px solid white;border-radius: 1px;margin-top: 5px;background-color:white;',
    cancelButton: 'float:right;margin-right:2px;border: 2px solid white;border-radius: 1px;margin-top: 5px;background-color:white;',
    setFolderButton: 'float:right;margin-left:2px;margin-right:4px;border: 2px solid white;border-radius: 1px;margin-top: 5px;background-color:white;',
    fileExistsLabel: 'height:27px;color:blue;float: left;margin-left: 2px;margin-top: 10px; font-size:15px;',
  };
  headerObject = createPathEditorHeader({
    parentElement: pathEditorHeaderDiv,
    editorContentDocument: document,
    onSaveToGd: saveSoundEffect,
    onCancelChanges: closeWindow,
    projectPath: receivedOptions.projectPath,
    initialResourcePath: receivedOptions.resourcePath,
    extension: '.wav',
    headerStyle,
  });

  // alter the interface of the external editor
  editorContentDocument.getElementsByClassName('github')[0].remove();
});