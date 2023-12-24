// @flow
import { Trans } from '@lingui/macro';
import { I18n } from '@lingui/react';
import { type I18n as I18nType } from '@lingui/core';
import { t } from '@lingui/macro';

import * as React from 'react';
import { AutoSizer } from 'react-virtualized';
import Background from '../UI/Background';
import SearchBar from '../UI/SearchBar';
import NewObjectDialog from '../AssetStore/NewObjectDialog';
import newNameGenerator from '../Utils/NewNameGenerator';
import Clipboard, { SafeExtractor } from '../Utils/Clipboard';
import Window from '../Utils/Window';
import {
  serializeToJSObject,
  unserializeFromJSObject,
} from '../Utils/Serializer';
import { showWarningBox } from '../UI/Messages/MessageBox';
import { type ObjectEditorTab } from '../ObjectEditor/ObjectEditorDialog';
import type { ObjectWithContext } from '../ObjectsList/EnumerateObjects';
import { type MessageDescriptor } from '../Utils/i18n/MessageDescriptor.flow';
import TreeView, { type TreeViewInterface } from '../UI/TreeView';
import { type UnsavedChanges } from '../MainFrame/UnsavedChangesContext';
import { type HotReloadPreviewButtonProps } from '../HotReload/HotReloadPreviewButton';
import { getInstanceCountInLayoutForObject } from '../Utils/Layout';
import EventsFunctionsExtensionsContext from '../EventsFunctionsExtensionsLoader/EventsFunctionsExtensionsContext';
import useForceUpdate from '../Utils/UseForceUpdate';
import { type ResourceManagementProps } from '../ResourcesList/ResourceSource';
import { getShortcutDisplayName } from '../KeyboardShortcuts';
import defaultShortcuts from '../KeyboardShortcuts/DefaultShortcuts';
import PreferencesContext from '../MainFrame/Preferences/PreferencesContext';
import { Column, Line } from '../UI/Grid';
import ResponsiveRaisedButton from '../UI/ResponsiveRaisedButton';
import Add from '../UI/CustomSvgIcons/Add';
import InAppTutorialContext from '../InAppTutorial/InAppTutorialContext';
import { mapFor } from '../Utils/MapFor';
import IconButton from '../UI/IconButton';
import AddFolder from '../UI/CustomSvgIcons/AddFolder';
import { LineStackLayout } from '../UI/Layout';
import KeyboardShortcuts from '../UI/KeyboardShortcuts';
import Link from '../UI/Link';
import { getHelpLink } from '../Utils/HelpLink';
import useAlertDialog from '../UI/Alert/useAlertDialog';
import { useResponsiveWindowWidth } from '../UI/Reponsive/ResponsiveWindowMeasurer';
import ErrorBoundary from '../UI/ErrorBoundary';

const gd: libGDevelop = global.gd;

const extensionObjectsRootFolderId = 'extension-objects';
const extensionBehaviorsRootFolderId = 'extension-behaviors';
const extensionFunctionsRootFolderId = 'extension-functions';
const extensionObjectsEmptyPlaceholderId = 'extension-objects-placeholder';
const extensionBehaviorsEmptyPlaceholderId = 'extension-behaviors-placeholder';
const extensionFunctionsEmptyPlaceholderId = 'extension-functions-placeholder';

const globalObjectsWikiLink = getHelpLink(
  '/interface/scene-editor/global-objects/',
  ':~:text=Global%20objects%20are%20objects%20which,are%20usable%20by%20all%20Scenes'
);

const styles = {
  listContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  autoSizerContainer: { flex: 1 },
  autoSizer: { width: '100%' },
};

export const objectWithContextReactDndType = 'GD_OBJECT_WITH_CONTEXT';

interface TreeViewItem {
  isRoot?: boolean;
  isPlaceholder?: boolean;
  getName(): string | React.Node;
  getId(): string;
  getHtmlId(index: number): ?string;
  getChildren(): ?Array<TreeViewItem>;
  getThumbnail(): ?string;
  getDataset(): ?HTMLDataset;
}

class ObjectTreeViewItem implements TreeViewItem {
  object: gdEventsBasedObject;

  constructor(object: gdEventsBasedObject) {
    this.object = object;
  }

  getName(): string | React.Node {
    return this.object.getName();
  }
  getId(): string {
    return this.object.getName();
  }
  getHtmlId(index: number): ?string {
    return `object-item-${index}`;
  }
  getChildren(): ?Array<TreeViewItem> {
    const functions = this.object.getEventsFunctions();
    return mapFor(
      0,
      functions.getEventsFunctionsCount(),
      i => new FunctionTreeViewItem(functions.getEventsFunctionAt(i), this.getId())
    );
  }
  getThumbnail(): ?string {
    return null;
  }
  getDataset(): ?HTMLDataset {
    return null;
  }
}

class BehaviorTreeViewItem implements TreeViewItem {
  behavior: gdEventsBasedBehavior;

  constructor(behavior: gdEventsBasedBehavior) {
    this.behavior = behavior;
  }

  getName(): string | React.Node {
    return this.behavior.getName();
  }
  getId(): string {
    return this.behavior.getName();
  }
  getHtmlId(index: number): ?string {
    return `behavior-item-${index}`;
  }
  getChildren(): ?Array<TreeViewItem> {
    const functions = this.behavior.getEventsFunctions();
    return mapFor(
      0,
      functions.getEventsFunctionsCount(),
      i => new FunctionTreeViewItem(functions.getEventsFunctionAt(i), this.getId())
    );
  }
  getThumbnail(): ?string {
    return null;
  }
  getDataset(): ?HTMLDataset {
    return null;
  }
}

class FunctionTreeViewItem implements TreeViewItem {
  eventFunction: gdEventsFunction;
  parentId: string;

  constructor(eventFunction: gdEventsFunction, parentId: string) {
    this.eventFunction = eventFunction;
    this.parentId = parentId;
  }

  getName(): string | React.Node {
    return this.eventFunction.getName();
  }
  getId(): string {
    return this.parentId + "." + this.eventFunction.getName();
  }
  getHtmlId(index: number): ?string {
    return `function-item-${index}`;
  }
  getChildren(): ?Array<TreeViewItem> {
    return null;
  }
  getThumbnail(): ?string {
    switch (this.eventFunction.getFunctionType()) {
      default:
        return 'res/functions/function.svg';
      case gd.EventsFunction.Action:
      case gd.EventsFunction.ActionWithOperator:
        switch (this.eventFunction.getName()) {
          default:
            return 'res/functions/action.svg';

          case 'onSceneUnloading':
          case 'onDestroy':
            return 'res/functions/destroy.svg';

          case 'onSceneResumed':
          case 'onActivate':
            return 'res/functions/activate.svg';

          case 'onScenePaused':
          case 'onDeActivate':
            return 'res/functions/deactivate.svg';

          case 'onScenePreEvents':
          case 'onScenePostEvents':
          case 'doStepPreEvents':
          case 'doStepPostEvents':
            return 'res/functions/step.svg';

          case 'onSceneLoaded':
          case 'onFirstSceneLoaded':
          case 'onCreated':
            return 'res/functions/create.svg';

          case 'onHotReloading':
            return 'res/functions/reload.svg';
        }
      case gd.EventsFunction.Condition:
        return 'res/functions/condition.svg';
      case gd.EventsFunction.Expression:
      case gd.EventsFunction.ExpressionAndCondition:
        return 'res/functions/expression.svg';
    }
  }
  getDataset(): ?HTMLDataset {
    return null;
  }
}

class PlaceHolderTreeViewItem implements TreeViewItem {
  isPlaceholder = true;
  id: string;
  label: string | React.Node;

  constructor(id: string, label: string | React.Node) {
    this.id = id;
    this.label = label;
  }

  getName(): string | React.Node {
    return this.label;
  }
  getId(): string {
    return this.id;
  }
  getHtmlId(index: number): ?string {
    return null;
  }
  getChildren(): ?Array<TreeViewItem> {
    return null;
  }
  getThumbnail(): ?string {
    return null;
  }
  getDataset(): ?HTMLDataset {
    return null;
  }
}

const getTreeViewItemName = (item: TreeViewItem) => item.getName();
const getTreeViewItemId = (item: TreeViewItem) => item.getId();
const getTreeViewItemHtmlId = (item: TreeViewItem, index: number) =>
  item.getHtmlId();
const getTreeViewItemChildren = (item: TreeViewItem) => item.getChildren();
const getTreeViewItemThumbnail = (item: TreeViewItem) => item.getThumbnail();
const getTreeViewItemData = (item: TreeViewItem) => item.getDataset();

const CLIPBOARD_KIND = 'Object';

const getPasteLabel = (
  i18n: I18nType,
  { isGlobalObject, isFolder }: {| isGlobalObject: boolean, isFolder: boolean |}
) => {
  let translation = t`Paste`;
  if (Clipboard.has(CLIPBOARD_KIND)) {
    const clipboardContent = Clipboard.get(CLIPBOARD_KIND);
    const clipboardObjectName =
      SafeExtractor.extractStringProperty(clipboardContent, 'name') || '';
    translation = isGlobalObject
      ? isFolder
        ? t`Paste ${clipboardObjectName} as a Global Object inside folder`
        : t`Paste ${clipboardObjectName} as a Global Object`
      : isFolder
      ? t`Paste ${clipboardObjectName} inside folder`
      : t`Paste ${clipboardObjectName}`;
  }
  return i18n._(translation);
};

export type EventsFunctionsListInterface = {|
  forceUpdateList: () => void,
  openNewObjectDialog: () => void,
  closeNewObjectDialog: () => void,
  renameObjectFolderOrObjectWithContext: ObjectFolderOrObjectWithContext => void,
|};

type Props = {|
  project: gdProject,
  eventsFunctionsExtension: gdEventsFunctionsExtension,
  unsavedChanges?: ?UnsavedChanges,

  // Objects
  selectedEventsBasedObject: ?gdEventsBasedObject,
  onSelectEventsBasedObject: (eventsBasedObject: ?gdEventsBasedObject) => void,
  onDeleteEventsBasedObject: (
    eventsBasedObject: gdEventsBasedObject,
    cb: (boolean) => void
  ) => void,
  onRenameEventsBasedObject: (
    eventsBasedObject: gdEventsBasedObject,
    newName: string,
    cb: (boolean) => void
  ) => void,
  onEventsBasedObjectRenamed: (eventsBasedObject: gdEventsBasedObject) => void,
  onEditEventsBasedObjectProperties: (
    eventsBasedObject: gdEventsBasedObject
  ) => void,

  // Behaviors
  selectedEventsBasedBehavior: ?gdEventsBasedBehavior,
  onSelectEventsBasedBehavior: (
    eventsBasedBehavior: ?gdEventsBasedBehavior
  ) => void,
  onDeleteEventsBasedBehavior: (
    eventsBasedBehavior: gdEventsBasedBehavior,
    cb: (boolean) => void
  ) => void,
  onRenameEventsBasedBehavior: (
    eventsBasedBehavior: gdEventsBasedBehavior,
    newName: string,
    cb: (boolean) => void
  ) => void,
  onEventsBasedBehaviorRenamed: (
    eventsBasedBehavior: gdEventsBasedBehavior
  ) => void,
  onEventsBasedBehaviorPasted: (
    eventsBasedBehavior: gdEventsBasedBehavior,
    sourceExtensionName: string
  ) => void,
  onEditEventsBasedBehaviorProperties: (
    eventsBasedBehavior: gdEventsBasedBehavior
  ) => void,

  // Free functions
  selectedEventsFunction: ?gdEventsFunction,
  onSelectEventsFunction: (eventsFunction: ?gdEventsFunction) => void,
  onDeleteEventsFunction: (
    eventsFunction: gdEventsFunction,
    cb: (boolean) => void
  ) => void,
  canRename: (eventsFunction: gdEventsFunction) => boolean,
  onRenameEventsFunction: (
    eventsFunction: gdEventsFunction,
    newName: string,
    cb: (boolean) => void
  ) => void,
  onAddEventsFunction: (
    (parameters: ?EventsFunctionCreationParameters) => void
  ) => void,
  onEventsFunctionAdded: (eventsFunction: gdEventsFunction) => void,
|};

const EventsFunctionsList = React.forwardRef<
  Props,
  EventsFunctionsListInterface
>(({ project, eventsFunctionsExtension, unsavedChanges }: Props, ref) => {
  const preferences = React.useContext(PreferencesContext);
  const { currentlyRunningInAppTutorial } = React.useContext(
    InAppTutorialContext
  );
  const { showDeleteConfirmation } = useAlertDialog();
  const treeViewRef = React.useRef<?TreeViewInterface<TreeViewItem>>(null);
  const forceUpdate = useForceUpdate();
  const windowWidth = useResponsiveWindowWidth();
  const isMobileScreen = windowWidth === 'small';

  const forceUpdateList = React.useCallback(
    () => {
      forceUpdate();
      if (treeViewRef.current) treeViewRef.current.forceUpdateList();
    },
    [forceUpdate]
  );

  const [newObjectDialogOpen, setNewObjectDialogOpen] = React.useState<{
    from: ObjectFolderOrObjectWithContext | null,
  } | null>(null);

  React.useImperativeHandle(ref, () => ({
    forceUpdateList: () => {
      forceUpdate();
      if (treeViewRef.current) treeViewRef.current.forceUpdateList();
    },
    openNewObjectDialog: () => {
      setNewObjectDialogOpen({ from: null });
    },
    closeNewObjectDialog: () => {
      setNewObjectDialogOpen(null);
    },
    renameObjectFolderOrObjectWithContext: objectFolderOrObjectWithContext => {
      if (treeViewRef.current)
        treeViewRef.current.renameItem(objectFolderOrObjectWithContext);
    },
  }));

  const [searchText, setSearchText] = React.useState('');

  const addObject = React.useCallback((objectType: string) => {
    // TODO
  }, []);

  const onAddNewObject = React.useCallback(
    (item: ObjectFolderOrObjectWithContext | null) => {
      setNewObjectDialogOpen({ from: item });
    },
    []
  );

  const onObjectModified = React.useCallback(
    (shouldForceUpdateList: boolean) => {
      if (unsavedChanges) unsavedChanges.triggerUnsavedChanges();

      if (shouldForceUpdateList) forceUpdateList();
      else forceUpdate();
    },
    [forceUpdate, forceUpdateList, unsavedChanges]
  );

  const selectObjectFolderOrObjectWithContext = React.useCallback(
    (objectFolderOrObjectWithContext: ?ObjectFolderOrObjectWithContext) => {
      // TODO
    },
    []
  );

  const deleteObjectFolderOrObjectWithContext = React.useCallback(
    async (
      objectFolderOrObjectWithContext: ?ObjectFolderOrObjectWithContext
    ) => {
      // TODO
    },
    []
  );

  // Initialize keyboard shortcuts as empty.
  // onDelete callback is set outside because it deletes the selected
  // item (that is a props). As it is stored in a ref, the keyboard shortcut
  // instance does not update with selectedObjectFolderOrObjectsWithContext changes.
  const keyboardShortcutsRef = React.useRef<KeyboardShortcuts>(
    new KeyboardShortcuts({
      shortcutCallbacks: {},
    })
  );
  React.useEffect(
    () => {
      if (keyboardShortcutsRef.current) {
        keyboardShortcutsRef.current.setShortcutCallback('onDelete', () => {
          deleteObjectFolderOrObjectWithContext(
            // TODO
            null
          );
        });
      }
    },
    [deleteObjectFolderOrObjectWithContext]
  );

  const copyObjectFolderOrObjectWithContext = React.useCallback(
    (objectFolderOrObjectWithContext: ObjectFolderOrObjectWithContext) => {
      const { objectFolderOrObject } = objectFolderOrObjectWithContext;
      if (objectFolderOrObject.isFolder()) return;
      const object = objectFolderOrObject.getObject();
      Clipboard.set(CLIPBOARD_KIND, {
        type: object.getType(),
        name: object.getName(),
        object: serializeToJSObject(object),
      });
    },
    []
  );

  const cutObjectFolderOrObjectWithContext = React.useCallback(
    (objectFolderOrObjectWithContext: ObjectFolderOrObjectWithContext) => {
      copyObjectFolderOrObjectWithContext(objectFolderOrObjectWithContext);
      deleteObjectFolderOrObjectWithContext(objectFolderOrObjectWithContext);
    },
    [copyObjectFolderOrObjectWithContext, deleteObjectFolderOrObjectWithContext]
  );

  const addSerializedObjectToObjectsContainer = React.useCallback(
    ({
      objectName,
      positionObjectFolderOrObjectWithContext,
      objectType,
      serializedObject,
      addInsideFolder,
    }: {|
      objectName: string,
      positionObjectFolderOrObjectWithContext: ObjectFolderOrObjectWithContext,
      objectType: string,
      serializedObject: Object,
      addInsideFolder?: boolean,
    |}): ObjectWithContext => {
      // TODO
    },
    []
  );

  const paste = React.useCallback(
    (
      objectFolderOrObjectWithContext: ObjectFolderOrObjectWithContext,
      addInsideFolder?: boolean
    ) => {
      // TODO
    },
    []
  );

  const editName = React.useCallback(
    (objectFolderOrObjectWithContext: ?ObjectFolderOrObjectWithContext) => {
      if (!objectFolderOrObjectWithContext) return;
      const treeView = treeViewRef.current;
      if (treeView) {
        if (isMobileScreen) {
          // Position item at top of the screen to make sure it will be visible
          // once the keyboard is open.
          treeView.scrollToItem(objectFolderOrObjectWithContext, 'start');
        }
        treeView.renameItem(objectFolderOrObjectWithContext);
      }
    },
    [isMobileScreen]
  );

  const duplicateObject = React.useCallback(
    (
      objectFolderOrObjectWithContext: ObjectFolderOrObjectWithContext,
      duplicateInScene?: boolean
    ) => {
      const { objectFolderOrObject, global } = objectFolderOrObjectWithContext;
      if (objectFolderOrObject.isFolder()) return;

      const object = objectFolderOrObject.getObject();
      const type = object.getType();
      const name = object.getName();
      const serializedObject = serializeToJSObject(object);

      const newObjectWithContext = addSerializedObjectToObjectsContainer({
        objectName: name,
        positionObjectFolderOrObjectWithContext: objectFolderOrObjectWithContext,
        objectType: type,
        serializedObject,
      });

      const newObjectFolderOrObjectWithContext = {
        objectFolderOrObject: objectFolderOrObject
          .getParent()
          .getObjectChild(newObjectWithContext.object.getName()),
        global,
      };

      forceUpdateList();
      editName(newObjectFolderOrObjectWithContext);
      selectObjectFolderOrObjectWithContext(newObjectFolderOrObjectWithContext);
    },
    [
      addSerializedObjectToObjectsContainer,
      editName,
      forceUpdateList,
      selectObjectFolderOrObjectWithContext,
    ]
  );

  const rename = React.useCallback((item: TreeViewItem, newName: string) => {
    // TODO
  }, []);

  const editItem = React.useCallback((item: TreeViewItem) => {
    // TODO
  }, []);

  const scrollToItem = (
    objectFolderOrObjectWithContext: ObjectFolderOrObjectWithContext
  ) => {
    if (treeViewRef.current) {
      treeViewRef.current.scrollToItem(objectFolderOrObjectWithContext);
    }
  };

  const getClosestVisibleParent = (
    objectFolderOrObjectWithContext: ObjectFolderOrObjectWithContext
  ): ?ObjectFolderOrObjectWithContext => {
    // TODO
    return null;
  };

  const eventBasedObjects = eventsFunctionsExtension.getEventsBasedObjects();
  const eventBasedBehaviors = eventsFunctionsExtension.getEventsBasedBehaviors();
  const getTreeViewData = React.useCallback(
    (i18n: I18nType): Array<TreeViewItem> => {
      const treeViewItems = [
        {
          isRoot: true,
          getName(): string | React.Node {
            return i18n._(t`Objects`);
          },
          getId(): string {
            return extensionObjectsRootFolderId;
          },
          getHtmlId(index: number): ?string {
            return null;
          },
          getChildren(): ?Array<TreeViewItem> {
            if (eventBasedObjects.size() === 0) {
              return [
                new PlaceHolderTreeViewItem(
                  extensionObjectsEmptyPlaceholderId,
                  i18n._(t`Start by adding a new object.`)
                ),
              ];
            }
            return mapFor(
              0,
              eventBasedObjects.size(),
              i => new ObjectTreeViewItem(eventBasedObjects.at(i))
            );
          },
          getThumbnail(): ?string {
            return null;
          },
          getDataset(): ?HTMLDataset {
            return null;
          },
        },
        {
          isRoot: true,
          getName(): string | React.Node {
            return i18n._(t`Behaviors`);
          },
          getId(): string {
            return extensionBehaviorsRootFolderId;
          },
          getHtmlId(index: number): ?string {
            return null;
          },
          getChildren(): ?Array<TreeViewItem> {
            if (eventBasedBehaviors.size() === 0) {
              return [
                new PlaceHolderTreeViewItem(
                  extensionBehaviorsEmptyPlaceholderId,
                  i18n._(t`Start by adding a new behavior.`)
                ),
              ];
            }
            return mapFor(
              0,
              eventBasedBehaviors.size(),
              i => new BehaviorTreeViewItem(eventBasedBehaviors.at(i))
            );
          },
          getThumbnail(): ?string {
            return null;
          },
          getDataset(): ?HTMLDataset {
            return null;
          },
        },
        {
          isRoot: true,
          getName(): string | React.Node {
            return i18n._(t`Functions`);
          },
          getId(): string {
            return extensionFunctionsRootFolderId;
          },
          getHtmlId(index: number): ?string {
            return null;
          },
          getChildren(): ?Array<TreeViewItem> {
            if (eventsFunctionsExtension.getEventsFunctionsCount() === 0) {
              return [
                new PlaceHolderTreeViewItem(
                  extensionFunctionsEmptyPlaceholderId,
                  i18n._(t`Start by adding a new function.`)
                ),
              ];
            }
            return mapFor(
              0,
              eventsFunctionsExtension.getEventsFunctionsCount(),
              i =>
                new FunctionTreeViewItem(
                  eventsFunctionsExtension.getEventsFunctionAt(i)
                )
            );
          },
          getThumbnail(): ?string {
            return null;
          },
          getDataset(): ?HTMLDataset {
            return null;
          },
        },
      ];
      // $FlowFixMe
      return treeViewItems;
    },
    [eventBasedBehaviors, eventBasedObjects, eventsFunctionsExtension]
  );

  const canMoveSelectionTo = React.useCallback(
    (destinationItem: TreeViewItem) => {
      // TODO
      return false;
    },
    []
  );

  const moveSelectionTo = React.useCallback(
    (
      i18n: I18nType,
      destinationItem: TreeViewItem,
      where: 'before' | 'inside' | 'after'
    ) => {
      // TODO
    },
    []
  );

  const addFolder = React.useCallback(
    (items: Array<ObjectFolderOrObjectWithContext>) => {},
    []
  );

  /**
   * Unselect item if one of the parent is collapsed (folded) so that the item
   * does not stay selected and not visible to the user.
   */
  const onCollapseItem = React.useCallback((item: TreeViewItem) => {
    // TODO
  }, []);

  const moveObjectFolderOrObjectToAnotherFolderInSameContainer = React.useCallback(
    (
      objectFolderOrObjectWithContext: ObjectFolderOrObjectWithContext,
      folder: gdObjectFolderOrObject
    ) => {
      const { objectFolderOrObject, global } = objectFolderOrObjectWithContext;
      if (folder === objectFolderOrObject.getParent()) return;
      objectFolderOrObject
        .getParent()
        .moveObjectFolderOrObjectToAnotherFolder(
          objectFolderOrObject,
          folder,
          0
        );
      const treeView = treeViewRef.current;
      if (treeView) {
        const closestVisibleParent = getClosestVisibleParent({
          objectFolderOrObject: folder,
          global,
        });
        if (closestVisibleParent) {
          treeView.animateItem(closestVisibleParent);
        }
      }
      onObjectModified(true);
    },
    [onObjectModified]
  );

  const renderObjectMenuTemplate = React.useCallback(
    (i18n: I18nType) => (item: TreeViewItem, index: number) => {
      // TODO Define drop down menu
      return [];
    },
    []
  );

  // Force List component to be mounted again if project or objectsContainer
  // has been changed. Avoid accessing to invalid objects that could
  // crash the app.
  const listKey = project.ptr + ';' + eventsFunctionsExtension.ptr;
  const initiallyOpenedNodeIds = [
    extensionObjectsRootFolderId,
    extensionBehaviorsRootFolderId,
    extensionFunctionsRootFolderId,
  ];

  const arrowKeyNavigationProps = React.useMemo(
    () => ({
      onGetItemInside: item => {
        if (item.isPlaceholder || item.isRoot) return null;
        if (!item.objectFolderOrObject.isFolder()) return null;
        else {
          if (item.objectFolderOrObject.getChildrenCount() === 0) return null;
          return {
            objectFolderOrObject: item.objectFolderOrObject.getChildAt(0),
            global: item.global,
          };
        }
      },
      onGetItemOutside: item => {
        if (item.isPlaceholder || item.isRoot) return null;
        const parent = item.objectFolderOrObject.getParent();
        if (parent.isRootFolder()) return null;
        return {
          objectFolderOrObject: parent,
          global: item.global,
        };
      },
    }),
    []
  );

  return (
    <Background maxWidth>
      <Column>
        <LineStackLayout>
          <Column expand noMargin>
            <SearchBar
              value={searchText}
              onRequestSearch={() => {}}
              onChange={text => setSearchText(text)}
              placeholder={t`Search objects`}
            />
          </Column>
        </LineStackLayout>
      </Column>
      <div
        style={styles.listContainer}
        onKeyDown={keyboardShortcutsRef.current.onKeyDown}
        onKeyUp={keyboardShortcutsRef.current.onKeyUp}
        id="events-function-list"
      >
        <I18n>
          {({ i18n }) => (
            <div style={styles.autoSizerContainer}>
              <AutoSizer style={styles.autoSizer} disableWidth>
                {({ height }) => (
                  <TreeView
                    key={listKey}
                    ref={treeViewRef}
                    items={getTreeViewData(i18n)}
                    height={height}
                    forceAllOpened={!!currentlyRunningInAppTutorial}
                    searchText={searchText}
                    getItemName={getTreeViewItemName}
                    getItemThumbnail={getTreeViewItemThumbnail}
                    getItemChildren={getTreeViewItemChildren}
                    multiSelect={false}
                    getItemId={getTreeViewItemId}
                    getItemHtmlId={getTreeViewItemHtmlId}
                    getItemDataset={getTreeViewItemData}
                    onEditItem={editItem}
                    onCollapseItem={onCollapseItem}
                    selectedItems={
                      // TODO
                      []
                    }
                    onSelectItems={items => {
                      if (!items) selectObjectFolderOrObjectWithContext(null);
                      const itemToSelect = items[0];
                      if (itemToSelect.isRoot) return;
                      selectObjectFolderOrObjectWithContext(
                        itemToSelect || null
                      );
                    }}
                    onRenameItem={rename}
                    buildMenuTemplate={renderObjectMenuTemplate(i18n)}
                    onMoveSelectionToItem={(destinationItem, where) =>
                      moveSelectionTo(i18n, destinationItem, where)
                    }
                    canMoveSelectionToItem={canMoveSelectionTo}
                    reactDndType={objectWithContextReactDndType}
                    initiallyOpenedNodeIds={initiallyOpenedNodeIds}
                    arrowKeyNavigationProps={arrowKeyNavigationProps}
                  />
                )}
              </AutoSizer>
            </div>
          )}
        </I18n>
      </div>
      <Line>
        <Column expand>
          <ResponsiveRaisedButton
            label={<Trans>Add a new function</Trans>}
            primary
            onClick={() => {
              // TODO
            }}
            id="add-new-function-button"
            icon={<Add />}
          />
        </Column>
      </Line>
      {newObjectDialogOpen &&
        // TODO
        false}
    </Background>
  );
});

const arePropsEqual = (prevProps: Props, nextProps: Props): boolean =>
  // The component is costly to render, so avoid any re-rendering as much
  // as possible.
  // We make the assumption that no changes to objects list is made outside
  // from the component.
  // If a change is made, the component won't notice it: you have to manually
  // call forceUpdate.
  prevProps.selectedObjectFolderOrObjectsWithContext ===
    nextProps.selectedObjectFolderOrObjectsWithContext &&
  prevProps.project === nextProps.project &&
  prevProps.objectsContainer === nextProps.objectsContainer;

const MemoizedObjectsList = React.memo<Props, EventsFunctionsListInterface>(
  EventsFunctionsList,
  arePropsEqual
);

const EventsFunctionsListWithErrorBoundary = React.forwardRef<
  Props,
  EventsFunctionsListInterface
>((props, ref) => (
  <ErrorBoundary
    componentTitle={<Trans>Objects list</Trans>}
    scope="scene-editor-objects-list"
  >
    <MemoizedObjectsList ref={ref} {...props} />
  </ErrorBoundary>
));

export default EventsFunctionsListWithErrorBoundary;
