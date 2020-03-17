// @flow
import { Trans } from '@lingui/macro';
import * as React from 'react';
import Background from '../../UI/Background';
import enumerateLayers from '../../LayersList/EnumerateLayers';
import EmptyMessage from '../../UI/EmptyMessage';
import PropertiesEditor from '../../PropertiesEditor';
import propertiesMapToSchema from '../../PropertiesEditor/PropertiesMapToSchema';
import { type Schema } from '../../PropertiesEditor';
import VariablesList from '../../VariablesList';
import getObjectByName from '../../Utils/GetObjectByName';
import IconButton from '../../UI/IconButton';
import { Line, Column } from '../../UI/Grid';
import OpenInNew from '@material-ui/icons/OpenInNew';
import Text from '../../UI/Text';
import { type UnsavedChanges } from '../../MainFrame/UnsavedChangesContext';

type Props = {|
  project: gdProject,
  layout: gdLayout,
  instances: Array<gdInitialInstance>,
  onEditObjectByName: string => void,
  editObjectVariables: (?gdObject) => void,
  editInstanceVariables: gdInitialInstance => void,
  unsavedChanges: UnsavedChanges,
|};

export default class InstancePropertiesEditor extends React.Component<Props> {
  _instanceVariablesList: { current: null | VariablesList } = React.createRef();
  schema: Schema = [
    {
      name: 'Object name',
      valueType: 'string',
      disabled: true,
      getValue: (instance: gdInitialInstance) => instance.getObjectName(),
      setValue: (instance: gdInitialInstance, newValue: string) => {
        this.props.unsavedChanges.triggerUnsavedChanges();
        return instance.setObjectName(newValue);
      },
      onEditButtonClick: (instance: gdInitialInstance) =>
        this.props.onEditObjectByName(instance.getObjectName()),
    },
    {
      name: 'Position',
      type: 'row',
      children: [
        {
          name: 'X',
          valueType: 'number',
          getValue: (instance: gdInitialInstance) => instance.getX(),
          setValue: (instance: gdInitialInstance, newValue: number) => {
            this.props.unsavedChanges.triggerUnsavedChanges();
            return instance.setX(newValue);
          },
        },
        {
          name: 'Y',
          valueType: 'number',
          getValue: (instance: gdInitialInstance) => instance.getY(),
          setValue: (instance: gdInitialInstance, newValue: number) => {
            this.props.unsavedChanges.triggerUnsavedChanges();
            return instance.setY(newValue);
          },
        },
      ],
    },
    {
      name: 'Angle',
      valueType: 'number',
      getValue: (instance: gdInitialInstance) => instance.getAngle(),
      setValue: (instance: gdInitialInstance, newValue: number) => {
        this.props.unsavedChanges.triggerUnsavedChanges();
        return instance.setAngle(newValue);
      },
    },
    {
      name: 'Lock position/angle in the editor',
      valueType: 'boolean',
      getValue: (instance: gdInitialInstance) => instance.isLocked(),
      setValue: (instance: gdInitialInstance, newValue: boolean) => {
        this.props.unsavedChanges.triggerUnsavedChanges();
        return instance.setLocked(newValue);
      },
    },
    {
      name: 'Z Order',
      valueType: 'number',
      getValue: (instance: gdInitialInstance) => instance.getZOrder(),
      setValue: (instance: gdInitialInstance, newValue: number) => {
        this.props.unsavedChanges.triggerUnsavedChanges();
        return instance.setZOrder(newValue);
      },
    },
    {
      name: 'Layer',
      valueType: 'string',
      getChoices: () => enumerateLayers(this.props.layout),
      getValue: (instance: gdInitialInstance) => instance.getLayer(),
      setValue: (instance: gdInitialInstance, newValue: string) => {
        this.props.unsavedChanges.triggerUnsavedChanges();
        return instance.setLayer(newValue);
      },
    },
    {
      name: 'Custom size',
      type: 'row',
      children: [
        {
          name: 'Width',
          valueType: 'number',
          getValue: (instance: gdInitialInstance) => instance.getCustomWidth(),
          setValue: (instance: gdInitialInstance, newValue: number) => {
            this.props.unsavedChanges.triggerUnsavedChanges();
            return instance.setCustomWidth(newValue);
          },
        },
        {
          name: 'Height',
          valueType: 'number',
          getValue: (instance: gdInitialInstance) => instance.getCustomHeight(),
          setValue: (instance: gdInitialInstance, newValue: number) => {
            this.props.unsavedChanges.triggerUnsavedChanges();
            return instance.setCustomHeight(newValue);
          },
        },
      ],
    },
    {
      name: 'Custom size?',
      valueType: 'boolean',
      getValue: (instance: gdInitialInstance) => instance.hasCustomSize(),
      setValue: (instance: gdInitialInstance, newValue: boolean) => {
        this.props.unsavedChanges.triggerUnsavedChanges();
        return instance.setHasCustomSize(newValue);
      },
    },
  ];

  _renderEmpty() {
    return (
      <EmptyMessage>
        <Trans>
          Click on an instance in the scene to display its properties
        </Trans>
      </EmptyMessage>
    );
  }

  _renderInstancesProperties() {
    const { project, layout, instances } = this.props;
    const instance = instances[0];
    const associatedObjectName = instance.getObjectName();
    const object = getObjectByName(project, layout, associatedObjectName);
    //TODO: multiple instances support
    const properties = instance.getCustomProperties(project, layout);
    const instanceSchema = propertiesMapToSchema(
      properties,
      (instance: gdInitialInstance) =>
        instance.getCustomProperties(project, layout),
      (instance: gdInitialInstance, name, value) =>
        instance.updateCustomProperty(name, value, project, layout)
    );

    return (
      <div
        style={{ overflowY: 'scroll', overflowX: 'hidden' }}
        key={instances
          .map((instance: gdInitialInstance) => '' + instance.ptr)
          .join(';')}
      >
        <Column>
          <PropertiesEditor
            schema={this.schema.concat(instanceSchema)}
            instances={instances}
          />
          <Line alignItems="center" justifyContent="space-between">
            <Text>
              <Trans>Instance Variables</Trans>
            </Text>
            <IconButton
              onClick={() => {
                this.props.editInstanceVariables(instance);
              }}
            >
              <OpenInNew />
            </IconButton>
          </Line>
        </Column>
        <VariablesList
          inheritedVariablesContainer={object ? object.getVariables() : null}
          variablesContainer={instance.getVariables()}
          onSizeUpdated={
            () =>
              this.forceUpdate() /*Force update to ensure dialog is properly positionned*/
          }
          ref={this._instanceVariablesList}
        />
      </div>
    );
  }

  render() {
    const { instances } = this.props;

    return (
      <Background>
        {!instances || !instances.length
          ? this._renderEmpty()
          : this._renderInstancesProperties()}
      </Background>
    );
  }
}
