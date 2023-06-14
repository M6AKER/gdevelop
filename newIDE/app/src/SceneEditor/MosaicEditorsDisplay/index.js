// @flow

import * as React from 'react';
import { t } from '@lingui/macro';
import { I18n } from '@lingui/react';
import { type I18n as I18nType } from '@lingui/core';

import { useResponsiveWindowWidth } from '../../UI/Reponsive/ResponsiveWindowMeasurer';
import PreferencesContext from '../../MainFrame/Preferences/PreferencesContext';
import EditorMosaic from '../../UI/EditorMosaic';
import InstancesEditor from '../../InstancesEditor';
import InstancePropertiesEditor, {
  type InstancePropertiesEditorInterface,
} from '../../InstancesEditor/InstancePropertiesEditor';
import LayersList, { type LayersListInterface } from '../../LayersList';
import FullSizeInstancesEditorWithScrollbars from '../../InstancesEditor/FullSizeInstancesEditorWithScrollbars';
import TagsButton from '../../UI/EditorMosaic/TagsButton';
import CloseButton from '../../UI/EditorMosaic/CloseButton';
import ObjectsList, { type ObjectsListInterface } from '../../ObjectsList';
import ObjectGroupsList from '../../ObjectGroupsList';
import InstancesList from '../../InstancesEditor/InstancesList';
import ObjectsRenderingService from '../../ObjectsRendering/ObjectsRenderingService';

import {
  getTagsFromString,
  buildTagsMenuTemplate,
  type SelectedTags,
} from '../../Utils/TagsHelper';
import { enumerateObjects } from '../../ObjectsList/EnumerateObjects';
import Rectangle from '../../Utils/Rectangle';
import { type EditorId } from '..';
import {
  type SceneEditorsDisplayProps,
  type SceneEditorsDisplayInterface,
} from '../EditorsDisplay.flow';

const initialMosaicEditorNodes = {
  direction: 'row',
  first: 'properties',
  splitPercentage: 23,
  second: {
    direction: 'row',
    first: 'instances-editor',
    second: 'objects-list',
    splitPercentage: 77,
  },
};

const noop = () => {};

const defaultPanelConfigByEditor = {
  'objects-list': {
    position: 'end',
    splitPercentage: 75,
    direction: 'column',
  },
  properties: {
    position: 'start',
    splitPercentage: 25,
    direction: 'column',
  },
  'object-groups-list': {
    position: 'end',
    splitPercentage: 75,
    direction: 'column',
  },
  'instances-list': {
    position: 'end',
    splitPercentage: 75,
    direction: 'row',
  },
  'layers-list': {
    position: 'end',
    splitPercentage: 75,
    direction: 'row',
  },
};

// Forward ref to allow Scene editor to force update some editors
const MosaicEditorsDisplay = React.forwardRef<
  SceneEditorsDisplayProps,
  SceneEditorsDisplayInterface
>((props, ref) => {
  const {
    project,
    layout,
    initialInstances,
    selectedLayer,
    onSelectInstances,
  } = props;
  const windowWidth = useResponsiveWindowWidth();
  const {
    getDefaultEditorMosaicNode,
    setDefaultEditorMosaicNode,
  } = React.useContext(PreferencesContext);
  const selectedInstances = props.instancesSelection.getSelectedInstances();
  const [
    selectedObjectTags,
    setSelectedObjectTags,
  ] = React.useState<SelectedTags>([]);

  const instancesPropertiesEditorRef = React.useRef<?InstancePropertiesEditorInterface>(
    null
  );
  const layersListRef = React.useRef<?LayersListInterface>(null);
  const instancesListRef = React.useRef<?InstancesList>(null);
  const editorRef = React.useRef<?InstancesEditor>(null);
  const objectsListRef = React.useRef<?ObjectsListInterface>(null);
  const editorMosaicRef = React.useRef<?EditorMosaic>(null);
  const objectGroupsListRef = React.useRef<?ObjectGroupsList>(null);

  const forceUpdateInstancesPropertiesEditor = React.useCallback(() => {
    if (instancesPropertiesEditorRef.current)
      instancesPropertiesEditorRef.current.forceUpdate();
  }, []);
  const forceUpdateInstancesList = React.useCallback(() => {
    if (instancesListRef.current) instancesListRef.current.forceUpdate();
  }, []);
  const forceUpdateObjectsList = React.useCallback(() => {
    if (objectsListRef.current) objectsListRef.current.forceUpdateList();
  }, []);
  const forceUpdateObjectGroupsList = React.useCallback(() => {
    if (objectGroupsListRef.current) objectGroupsListRef.current.forceUpdate();
  }, []);
  const forceUpdateLayersList = React.useCallback(() => {
    if (layersListRef.current) layersListRef.current.forceUpdate();
  }, []);
  const getInstanceSize = React.useCallback((instance: gdInitialInstance) => {
    if (!editorRef.current) return [0, 0, 0];

    return editorRef.current.getInstanceSize(instance);
  }, []);
  const openNewObjectDialog = React.useCallback(() => {
    if (!objectsListRef.current) return;

    objectsListRef.current.openNewObjectDialog();
  }, []);
  const toggleEditorView = React.useCallback((editorId: EditorId) => {
    if (!editorMosaicRef.current) return;
    const config = defaultPanelConfigByEditor[editorId];
    editorMosaicRef.current.toggleEditor(
      editorId,
      config.position,
      config.splitPercentage,
      config.direction
    );
  }, []);
  const isEditorVisible = React.useCallback((editorId: EditorId) => {
    if (!editorMosaicRef.current) return false;
    return editorMosaicRef.current.getOpenedEditorNames().includes(editorId);
  }, []);

  React.useImperativeHandle(ref, () => {
    const { current: editor } = editorRef;
    return {
      getName: () => 'mosaic',
      forceUpdateInstancesList,
      forceUpdateInstancesPropertiesEditor,
      forceUpdateObjectsList,
      forceUpdateObjectGroupsList,
      forceUpdateLayersList,
      openNewObjectDialog,
      toggleEditorView,
      isEditorVisible,
      viewControls: {
        zoomBy: editor ? editor.zoomBy : noop,
        setZoomFactor: editor ? editor.setZoomFactor : noop,
        zoomToInitialPosition: editor ? editor.zoomToInitialPosition : noop,
        zoomToFitContent: editor ? editor.zoomToFitContent : noop,
        zoomToFitSelection: editor ? editor.zoomToFitSelection : noop,
        centerViewOnLastInstance: editor
          ? editor.centerViewOnLastInstance
          : noop,
        getLastCursorSceneCoordinates: editor
          ? editor.getLastCursorSceneCoordinates
          : () => [0, 0],
        getLastContextMenuSceneCoordinates: editor
          ? editor.getLastContextMenuSceneCoordinates
          : () => [0, 0],
        getViewPosition: editor ? editor.getViewPosition : noop,
      },
      instancesHandlers: {
        getSelectionAABB: editor
          ? editor.selectedInstances.getSelectionAABB
          : () => new Rectangle(),
        addInstances: editor ? editor.addInstances : () => [],
        clearHighlightedInstance: editor
          ? editor.clearHighlightedInstance
          : noop,
        resetInstanceRenderersFor: editor
          ? editor.resetInstanceRenderersFor
          : noop,
        forceRemountInstancesRenderers: editor ? editor.forceRemount : noop,
        addSerializedInstances: editor
          ? editor.addSerializedInstances
          : () => [],
      },
    };
  });

  const selectInstances = React.useCallback(
    (instances: Array<gdInitialInstance>, multiSelect: boolean) => {
      onSelectInstances(instances, multiSelect);
      forceUpdateInstancesList();
      forceUpdateInstancesPropertiesEditor();
    },
    [
      forceUpdateInstancesList,
      forceUpdateInstancesPropertiesEditor,
      onSelectInstances,
    ]
  );

  const getAllObjectTags = React.useCallback(
    (): Array<string> => {
      const tagsSet: Set<string> = new Set();
      enumerateObjects(project, layout).allObjectsList.forEach(({ object }) => {
        getTagsFromString(object.getTags()).forEach(tag => tagsSet.add(tag));
      });

      return Array.from(tagsSet);
    },
    [project, layout]
  );

  const buildObjectTagsMenuTemplate = React.useCallback(
    (i18n: I18nType): Array<any> => {
      return buildTagsMenuTemplate({
        noTagLabel: i18n._(t`No tags - add a tag to an object first`),
        getAllTags: getAllObjectTags,
        selectedTags: selectedObjectTags,
        onChange: setSelectedObjectTags,
      });
    },
    [selectedObjectTags, getAllObjectTags]
  );

  const editors = {
    properties: {
      type: 'secondary',
      title: t`Properties`,
      renderEditor: () => (
        <I18n>
          {({ i18n }) => (
            <InstancePropertiesEditor
              i18n={i18n}
              project={project}
              layout={layout}
              instances={selectedInstances}
              editInstanceVariables={props.editInstanceVariables}
              onEditObjectByName={props.editObjectByName}
              onInstancesModified={forceUpdateInstancesList}
              onGetInstanceSize={getInstanceSize}
              ref={instancesPropertiesEditorRef}
              unsavedChanges={props.unsavedChanges}
              historyHandler={props.historyHandler}
            />
          )}
        </I18n>
      ),
    },
    'layers-list': {
      type: 'secondary',
      title: t`Layers`,
      renderEditor: () => (
        <LayersList
          project={project}
          selectedLayer={selectedLayer}
          onSelectLayer={props.onSelectLayer}
          onEditLayerEffects={props.editLayerEffects}
          onEditLayer={props.editLayer}
          onRemoveLayer={props.onRemoveLayer}
          onRenameLayer={props.onRenameLayer}
          onCreateLayer={forceUpdateInstancesPropertiesEditor}
          layersContainer={layout}
          unsavedChanges={props.unsavedChanges}
          ref={layersListRef}
          hotReloadPreviewButtonProps={props.hotReloadPreviewButtonProps}
        />
      ),
    },
    'instances-list': {
      type: 'secondary',
      title: t`Instances List`,
      renderEditor: () => (
        <InstancesList
          instances={initialInstances}
          selectedInstances={selectedInstances}
          onSelectInstances={selectInstances}
          ref={instancesListRef}
        />
      ),
    },
    'instances-editor': {
      type: 'primary',
      noTitleBar: true,
      renderEditor: () => (
        <FullSizeInstancesEditorWithScrollbars
          project={project}
          layout={layout}
          selectedLayer={selectedLayer}
          initialInstances={initialInstances}
          instancesEditorSettings={props.instancesEditorSettings}
          onInstancesEditorSettingsMutated={
            props.onInstancesEditorSettingsMutated
          }
          instancesSelection={props.instancesSelection}
          onInstancesAdded={props.onInstancesAdded}
          onInstancesSelected={props.onInstancesSelected}
          onInstanceDoubleClicked={props.onInstanceDoubleClicked}
          onInstancesMoved={props.onInstancesMoved}
          onInstancesResized={props.onInstancesResized}
          onInstancesRotated={props.onInstancesRotated}
          selectedObjectNames={props.selectedObjectNames}
          onContextMenu={props.onContextMenu}
          isInstanceOf3DObject={props.isInstanceOf3DObject}
          instancesEditorShortcutsCallbacks={
            props.instancesEditorShortcutsCallbacks
          }
          wrappedEditorRef={editor => {
            editorRef.current = editor;
          }}
          pauseRendering={!props.isActive}
        />
      ),
    },
    'objects-list': {
      type: 'secondary',
      title: t`Objects`,
      toolbarControls: [
        <TagsButton
          key="tags"
          buildMenuTemplate={buildObjectTagsMenuTemplate}
        />,
        <CloseButton key="close" />,
      ],
      renderEditor: () => (
        <I18n>
          {({ i18n }) => (
            <ObjectsList
              getThumbnail={ObjectsRenderingService.getThumbnail.bind(
                ObjectsRenderingService
              )}
              project={project}
              objectsContainer={layout}
              layout={layout}
              onSelectAllInstancesOfObjectInLayout={
                props.onSelectAllInstancesOfObjectInLayout
              }
              resourceManagementProps={props.resourceManagementProps}
              selectedObjectNames={props.selectedObjectNames}
              canInstallPrivateAsset={props.canInstallPrivateAsset}
              onEditObject={props.onEditObject}
              onExportObject={props.onExportObject}
              onDeleteObject={(objectWithContext, cb) =>
                props.onDeleteObject(i18n, objectWithContext, cb)
              }
              canRenameObject={(newName, global) =>
                props.canObjectOrGroupUseNewName(newName, global, i18n)
              }
              onObjectCreated={props.onObjectCreated}
              onObjectSelected={props.onObjectSelected}
              renamedObjectWithContext={props.renamedObjectWithContext}
              onRenameObjectStart={props.onRenameObjectStart}
              onRenameObjectFinish={props.onRenameObjectFinish}
              onAddObjectInstance={props.onAddObjectInstance}
              onObjectPasted={props.updateBehaviorsSharedData}
              selectedObjectTags={selectedObjectTags}
              beforeSetAsGlobalObject={objectName =>
                props.canObjectOrGroupBeGlobal(i18n, objectName)
              }
              onChangeSelectedObjectTags={setSelectedObjectTags}
              getAllObjectTags={getAllObjectTags}
              ref={objectsListRef}
              unsavedChanges={props.unsavedChanges}
              hotReloadPreviewButtonProps={props.hotReloadPreviewButtonProps}
            />
          )}
        </I18n>
      ),
    },
    'object-groups-list': {
      type: 'secondary',
      title: t`Object Groups`,
      renderEditor: () => (
        <I18n>
          {({ i18n }) => (
            <ObjectGroupsList
              ref={objectGroupsListRef}
              globalObjectGroups={project.getObjectGroups()}
              objectGroups={layout.getObjectGroups()}
              onEditGroup={props.onEditObjectGroup}
              onDeleteGroup={props.onDeleteObjectGroup}
              onRenameGroup={props.onRenameObjectGroup}
              canRenameGroup={(newName, global) =>
                props.canRenameObjectGroup(newName, global, i18n)
              }
              beforeSetAsGlobalGroup={groupName =>
                props.canObjectOrGroupBeGlobal(i18n, groupName)
              }
              unsavedChanges={props.unsavedChanges}
            />
          )}
        </I18n>
      ),
    },
  };
  return (
    <EditorMosaic
      editors={editors}
      limitToOneSecondaryEditor={windowWidth === 'small'}
      initialNodes={
        getDefaultEditorMosaicNode('scene-editor') || initialMosaicEditorNodes
      }
      onOpenedEditorsChanged={props.onOpenedEditorsChanged}
      onPersistNodes={node => setDefaultEditorMosaicNode('scene-editor', node)}
      ref={editorMosaicRef}
    />
  );
});

export default MosaicEditorsDisplay;
