// @flow
import { Trans } from '@lingui/macro';
import * as React from 'react';
import EventsBasedBehaviorEditor from './index';
import { Tabs } from '../UI/Tabs';
import EventsBasedBehaviorPropertiesEditor from './EventsBasedBehaviorPropertiesEditor';
import Background from '../UI/Background';
import { Column, Line } from '../UI/Grid';
import { type UnsavedChanges } from '../MainFrame/UnsavedChangesContext';

type TabName = 'configuration' | 'behavior-properties' | 'scene-properties';

type Props = {|
  project: gdProject,
  eventsFunctionsExtension: gdEventsFunctionsExtension,
  eventsBasedBehavior: gdEventsBasedBehavior,
  onRenameProperty: (oldName: string, newName: string) => void,
  onRenameSharedProperty: (oldName: string, newName: string) => void,
  unsavedChanges?: ?UnsavedChanges,
|};

export default function EventsBasedBehaviorEditorPanel({
  eventsBasedBehavior,
  eventsFunctionsExtension,
  project,
  onRenameProperty,
  onRenameSharedProperty,
  unsavedChanges,
}: Props) {
  const [currentTab, setCurrentTab] = React.useState<TabName>('configuration');

  const onPropertiesUpdated = React.useCallback(
    () => {
      if (unsavedChanges) {
        unsavedChanges.triggerUnsavedChanges();
      }
    },
    [unsavedChanges]
  );

  return (
    <Background>
      <Column expand useFullHeight noOverflowParent>
        <Line>
          <Column noMargin expand noOverflowParent>
            <Tabs
              value={currentTab}
              onChange={setCurrentTab}
              options={[
                {
                  value: 'configuration',
                  label: <Trans>Configuration</Trans>,
                },
                {
                  value: 'behavior-properties',
                  label: <Trans>Behavior properties</Trans>,
                },
                {
                  value: 'scene-properties',
                  label: <Trans>Scene properties</Trans>,
                },
              ]}
            />
          </Column>
        </Line>
        {currentTab === 'configuration' && (
          <EventsBasedBehaviorEditor
            project={project}
            eventsFunctionsExtension={eventsFunctionsExtension}
            eventsBasedBehavior={eventsBasedBehavior}
            unsavedChanges={unsavedChanges}
          />
        )}
        {currentTab === 'behavior-properties' && (
          <EventsBasedBehaviorPropertiesEditor
            project={project}
            extension={eventsFunctionsExtension}
            eventsBasedBehavior={eventsBasedBehavior}
            properties={eventsBasedBehavior.getPropertyDescriptors()}
            onRenameProperty={onRenameProperty}
            behaviorObjectType={eventsBasedBehavior.getObjectType()}
            onPropertiesUpdated={onPropertiesUpdated}
          />
        )}
        {currentTab === 'scene-properties' && (
          <EventsBasedBehaviorPropertiesEditor
            isSceneProperties
            project={project}
            extension={eventsFunctionsExtension}
            eventsBasedBehavior={eventsBasedBehavior}
            properties={eventsBasedBehavior.getSharedPropertyDescriptors()}
            onRenameProperty={onRenameSharedProperty}
            onPropertiesUpdated={onPropertiesUpdated}
          />
        )}
      </Column>
    </Background>
  );
}
