import { Component } from 'react';
import optionalRequire from '../Utils/OptionalRequire.js';
const path = optionalRequire('path');
const electron = optionalRequire('electron');
const dialog = electron ? electron.remote.dialog : null;
const gd = global.gd;

export default [
  {
    name: 'localAudioFileOpener',
    displayName: 'Choose a new audio file',
    kind: 'audio',
    component: class LocalAudioFileOpener extends Component {
      chooseResources = (
        project,
        multiSelections = true
      ): Promise<Array<any>> => {
        return new Promise((resolve, reject) => {
          if (!dialog) return reject('Not supported');

          const properties = ['openFile'];
          if (multiSelections) properties.push('multiSelections');
          const projectPath = path.dirname(project.getProjectFile());

          const browserWindow = electron.remote.getCurrentWindow();
          dialog.showOpenDialog(
            browserWindow,
            {
              title: 'Choose an audio file',
              properties,
              filters: [{ name: 'Audio files', extensions: ['wav', 'mp3', 'ogg'] }],
              defaultPath: projectPath,
            },
            paths => {
              if (!paths) return resolve([]);

              const resources = paths.map(resourcePath => {
                const audioResource = new gd.AudioResource();
                const projectPath = path.dirname(project.getProjectFile());
                audioResource.setFile(path.relative(projectPath, resourcePath));
                audioResource.setName(path.relative(projectPath, resourcePath));

                return audioResource;
              });
              return resolve(resources);
            }
          );
        });
      };

      render() {
        return null;
      }
    },
  },
  {
    name: 'localFileOpener',
    displayName: 'Choose a new image',
    kind: 'image',
    component: class LocalFileOpener extends Component {
      chooseResources = (
        project,
        multiSelections = true
      ): Promise<Array<any>> => {
        return new Promise((resolve, reject) => {
          if (!dialog) return reject('Not supported');

          const properties = ['openFile'];
          if (multiSelections) properties.push('multiSelections');
          const projectPath = path.dirname(project.getProjectFile());

          const browserWindow = electron.remote.getCurrentWindow();
          dialog.showOpenDialog(
            browserWindow,
            {
              title: 'Choose an image',
              properties,
              filters: [{ name: 'Image files', extensions: ['png', 'jpg'] }],
              defaultPath: projectPath,
            },
            paths => {
              if (!paths) return resolve([]);

              const resources = paths.map(resourcePath => {
                const imageResource = new gd.ImageResource();
                const projectPath = path.dirname(project.getProjectFile());
                imageResource.setFile(path.relative(projectPath, resourcePath));
                imageResource.setName(path.relative(projectPath, resourcePath));

                return imageResource;
              });
              return resolve(resources);
            }
          );
        });
      };

      render() {
        return null;
      }
    },
  },
  {
    name: 'localFontFileOpener',
    displayName: 'Choose a new font file',
    kind: 'font',
    component: class LocalFontFileOpener extends Component {
      chooseResources = (
        project,
        multiSelections = true
      ): Promise<Array<any>> => {
        return new Promise((resolve, reject) => {
          if (!dialog) return reject('Not supported');

          const properties = ['openFile'];
          if (multiSelections) properties.push('multiSelections');
          const projectPath = path.dirname(project.getProjectFile());

          const browserWindow = electron.remote.getCurrentWindow();
          dialog.showOpenDialog(
            browserWindow,
            {
              title: 'Choose a font file',
              properties,
              filters: [{ name: 'Font files', extensions: ['ttf'] }],
              defaultPath: projectPath,
            },
            paths => {
              if (!paths) return resolve([]);

              const resources = paths.map(resourcePath => {
                const fontResource = new gd.FontResource();
                const projectPath = path.dirname(project.getProjectFile());
                fontResource.setFile(path.relative(projectPath, resourcePath));
                fontResource.setName(path.relative(projectPath, resourcePath));

                return fontResource;
              });
              return resolve(resources);
            }
          );
        });
      };

      render() {
        return null;
      }
    },
  },
];
