// @flow
import * as React from 'react';
import { Line, Column } from '../../../UI/Grid';
import Checkbox from 'material-ui/Checkbox';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import SemiControlledTextField from '../../../UI/SemiControlledTextField';
import ImagePreview from '../../../ResourcesList/ResourcePreview/ImagePreview';
import ResourceSelector from '../../../ResourcesList/ResourceSelector';
import ResourcesLoader from '../../../ResourcesLoader';
import ShapePreview from './ShapePreview.js';
import PolygonEditor from './PolygonEditor.js';
import {
  type ResourceSource,
  type ChooseResourceFunction,
} from '../../../ResourcesList/ResourceSource.flow';
import { type ResourceExternalEditor } from '../../../ResourcesList/ResourceExternalEditor.flow';

type Props = {|
  behavior: Object,
  project: gdProject,
  resourceSources: Array<ResourceSource>,
  onChooseResource: ChooseResourceFunction,
  resourceExternalEditors: Array<ResourceExternalEditor>,
|};

type State = {|
  image: string,
  imageWidth: number,
  imageHeight: number,
|};

function NumericProperty(props: {|
  properties: gdMapStringPropertyDescriptor,
  propertyName: string,
  step: number,
  onUpdate: (newValue: number) => void,
|}) {
  const { properties, propertyName, step, onUpdate } = props;

  return (
    <SemiControlledTextField
      value={properties.get(propertyName).getValue()}
      key={propertyName}
      floatingLabelText={properties.get(propertyName).getLabel()}
      floatingLabelFixed
      step={step}
      onChange={onUpdate}
      type="number"
    />
  );
}

function BitProperty(props: {|
  enabled: boolean,
  propertyName: string,
  pos: number,
  spacing: boolean,
  onUpdate: (enabled: boolean) => void,
|}) {
  const { enabled, propertyName, pos, spacing, onUpdate } = props;

  return (
    <div style={{ width: spacing ? '7.5%' : '5%' }}>
      {
        <Checkbox
          checked={enabled}
          onCheck={(e, checked) => onUpdate(checked)}
        />
      }
      {spacing && (
        <div
          style={{ width: '33%' }}
          key={propertyName + '-space' + pos.toString(10)}
        />
      )}
    </div>
  );
}

export default class Physics2Editor extends React.Component<Props, State> {
  resourcesLoader: typeof ResourcesLoader;

  constructor(props: Props) {
    super(props);

    this.resourcesLoader = ResourcesLoader;

    this.state = {
      image: '',
      imageWidth: 0,
      imageHeight: 0,
    };
  }

  _setImageSize = (width: number, height: number) => {
    this.setState({
      imageWidth: width,
      imageHeight: height,
    });
  };

  _isBitEnabled(bitsValue: number, pos: number) {
    return !!(bitsValue & (1 << pos));
  }

  _enableBit(bitsValue: number, pos: number, enable: boolean) {
    if (enable) bitsValue |= 1 << pos;
    else bitsValue &= ~(1 << pos);
    return bitsValue;
  }

  render() {
    const { behavior, project } = this.props;

    // Parsing error temporary workaround
    if (
      !Array.isArray(
        JSON.parse(
          behavior
            .getProperties()
            .get('vertices')
            .getValue()
        )
      )
    ) {
      behavior.updateProperty('vertices', '[]', project);
    }

    const properties = behavior.getProperties(project);
    const bits = Array(16).fill(null);
    const shape = properties.get('shape').getValue();
    const layersValues = parseInt(properties.get('layers').getValue(), 10);
    const masksValues = parseInt(properties.get('masks').getValue(), 10);

    return (
      <Column>
        <Line>
          <SelectField
            key={'type'}
            floatingLabelText={properties.get('type').getLabel()}
            floatingLabelFixed
            value={properties.get('type').getValue()}
            onChange={(e, index, newValue) => {
              behavior.updateProperty('type', newValue, project);
              this.forceUpdate();
            }}
          >
            {[
              <MenuItem
                key={'dynamic'}
                value={'Dynamic'}
                primaryText={'Dynamic'}
              />,
              <MenuItem
                key={'static'}
                value={'Static'}
                primaryText={'Static'}
              />,
              <MenuItem
                key={'kinematic'}
                value={'Kinematic'}
                primaryText={'Kinematic'}
              />,
            ]}
          </SelectField>
        </Line>
        <Line>
          <Column expand>
            <Checkbox
              label={properties.get('bullet').getLabel()}
              checked={properties.get('bullet').getValue() === 'true'}
              onCheck={(e, checked) => {
                behavior.updateProperty('bullet', checked ? '1' : '0', project);
                this.forceUpdate();
              }}
            />
          </Column>
          <Column expand>
            <Checkbox
              label={properties.get('fixedRotation').getLabel()}
              checked={properties.get('fixedRotation').getValue() === 'true'}
              onCheck={(e, checked) => {
                behavior.updateProperty(
                  'fixedRotation',
                  checked ? '1' : '0',
                  project
                );
                this.forceUpdate();
              }}
            />
          </Column>
          <Column expand>
            <Checkbox
              label={properties.get('canSleep').getLabel()}
              checked={properties.get('canSleep').getValue() === 'true'}
              onCheck={(e, checked) => {
                behavior.updateProperty(
                  'canSleep',
                  checked ? '1' : '0',
                  project
                );
                this.forceUpdate();
              }}
            />
          </Column>
        </Line>
        <Line>
          <SelectField
            floatingLabelText={properties.get('shape').getLabel()}
            floatingLabelFixed
            value={properties.get('shape').getValue()}
            onChange={(e, index, newValue) => {
              behavior.updateProperty('shape', newValue, project);
              this.forceUpdate();
            }}
          >
            <MenuItem key={'box'} value={'Box'} primaryText={'Box'} />
            <MenuItem key={'circle'} value={'Circle'} primaryText={'Circle'} />
            <MenuItem key={'edge'} value={'Edge'} primaryText={'Edge'} />
            <MenuItem
              key={'polygon'}
              value={'Polygon'}
              primaryText={'Polygon'}
            />
          </SelectField>
        </Line>
        <Line>
          {shape !== 'Polygon' && (
            <SemiControlledTextField
              value={properties
                .get(shape === 'Polygon' ? 'PolygonOriginX' : 'shapeDimensionA')
                .getValue()}
              key={'shapeDimensionA'}
              floatingLabelText={
                shape === 'Circle'
                  ? 'Radius'
                  : shape === 'Edge'
                  ? 'Length'
                  : 'Width'
              }
              floatingLabelFixed
              min={0}
              onChange={newValue => {
                behavior.updateProperty(
                  shape === 'Polygon' ? 'PolygonOriginX' : 'shapeDimensionA',
                  newValue,
                  project
                );
                this.forceUpdate();
              }}
              type="number"
            />
          )}
          {shape !== 'Polygon' && shape !== 'Circle' && (
            <SemiControlledTextField
              value={properties
                .get(shape === 'Polygon' ? 'PolygonOriginY' : 'shapeDimensionB')
                .getValue()}
              key={'shapeDimensionB'}
              floatingLabelText={shape === 'Edge' ? 'Angle' : 'Height'}
              floatingLabelFixed
              min={shape === 'Edge' ? undefined : 0}
              onChange={newValue => {
                behavior.updateProperty(
                  shape === 'Polygon' ? 'PolygonOriginY' : 'shapeDimensionB',
                  newValue,
                  project
                );
                this.forceUpdate();
              }}
              type="number"
            />
          )}
          {shape === 'Polygon' && (
            <SelectField
              floatingLabelText={properties.get('polygonOrigin').getLabel()}
              floatingLabelFixed
              value={properties.get('polygonOrigin').getValue()}
              onChange={(e, index, newValue) => {
                behavior.updateProperty('polygonOrigin', newValue, project);
                this.forceUpdate();
              }}
            >
              {[
                <MenuItem
                  key={'center'}
                  value={'Center'}
                  primaryText={'Center'}
                />,
                <MenuItem
                  key={'origin'}
                  value={'Origin'}
                  primaryText={'Origin'}
                />,
                <MenuItem
                  key={'topLeft'}
                  value={'TopLeft'}
                  primaryText={'Top-Left'}
                />,
              ]}
            </SelectField>
          )}
          <NumericProperty
            properties={properties}
            propertyName={'shapeOffsetX'}
            step={1}
            onUpdate={newValue => {
              behavior.updateProperty('shapeOffsetX', newValue, project);
              this.forceUpdate();
            }}
          />
          <NumericProperty
            properties={properties}
            propertyName={'shapeOffsetY'}
            step={1}
            onUpdate={newValue => {
              this.props.behavior.updateProperty(
                'shapeOffsetY',
                newValue,
                this.props.project
              );
              this.forceUpdate();
            }}
          />
        </Line>
        <Line>
          <Column expand>
            <Line>
              <ImagePreview
                resourceName={this.state.image}
                project={this.props.project}
                resourcesLoader={this.resourcesLoader}
                onSize={this._setImageSize}
              >
                <ShapePreview
                  shape={properties.get('shape').getValue()}
                  dimensionA={parseFloat(
                    properties.get('shapeDimensionA').getValue()
                  )}
                  dimensionB={parseFloat(
                    properties.get('shapeDimensionB').getValue()
                  )}
                  offsetX={parseFloat(
                    properties.get('shapeOffsetX').getValue()
                  )}
                  offsetY={parseFloat(
                    properties.get('shapeOffsetY').getValue()
                  )}
                  polygonOrigin={properties.get('polygonOrigin').getValue()}
                  vertices={JSON.parse(properties.get('vertices').getValue())}
                  width={this.state.imageWidth}
                  height={this.state.imageHeight}
                  onMoveVertex={(index, newX, newY) => {
                    let vertices = JSON.parse(
                      properties.get('vertices').getValue()
                    );
                    vertices[index].x = newX;
                    vertices[index].y = newY;
                    behavior.updateProperty(
                      'vertices',
                      JSON.stringify(vertices),
                      project
                    );
                    this.forceUpdate();
                  }}
                />
              </ImagePreview>
            </Line>
            <Line>
              <ResourceSelector
                project={this.props.project}
                resourceSources={this.props.resourceSources}
                onChooseResource={this.props.onChooseResource}
                resourceExternalEditors={this.props.resourceExternalEditors}
                resourcesLoader={this.resourcesLoader}
                resourceKind={'image'}
                initialResourceName={''}
                fullWidth={false}
                onChange={resourceName => {
                  this.setState({ image: resourceName });
                  this.forceUpdate();
                }}
              />
            </Line>
          </Column>
          {shape === 'Polygon' && (
            <PolygonEditor
              vertices={JSON.parse(properties.get('vertices').getValue())}
              onChangeVertexX={(newValue, index) => {
                let vertices = JSON.parse(
                  properties.get('vertices').getValue()
                );
                vertices[index].x = newValue;
                behavior.updateProperty(
                  'vertices',
                  JSON.stringify(vertices),
                  project
                );
                this.forceUpdate();
              }}
              onChangeVertexY={(newValue, index) => {
                let vertices = JSON.parse(
                  properties.get('vertices').getValue()
                );
                vertices[index].y = newValue;
                behavior.updateProperty(
                  'vertices',
                  JSON.stringify(vertices),
                  project
                );
                this.forceUpdate();
              }}
              onAdd={() => {
                let vertices = JSON.parse(
                  properties.get('vertices').getValue()
                );
                if (vertices.length >= 8) return;
                vertices.push({ x: 0, y: 0 });
                behavior.updateProperty(
                  'vertices',
                  JSON.stringify(vertices),
                  project
                );
                this.forceUpdate();
              }}
              onRemove={index => {
                let vertices = JSON.parse(
                  properties.get('vertices').getValue()
                );
                vertices.splice(index, 1);
                behavior.updateProperty(
                  'vertices',
                  JSON.stringify(vertices),
                  project
                );
                this.forceUpdate();
              }}
            />
          )}
        </Line>
        <Line>
          <SemiControlledTextField // Debug vertices raw content
            value={properties.get('vertices').getValue()}
            key={'verticesText'}
            floatingLabelText={'Raw Vertices'}
            floatingLabelFixed
            onChange={newValue => {
              behavior.updateProperty('vertices', newValue, project);
              this.forceUpdate();
            }}
            type="text"
          />
        </Line>
        <Line>
          <Column expand>
            <NumericProperty
              properties={properties}
              propertyName={'density'}
              step={0.1}
              onUpdate={newValue => {
                behavior.updateProperty(
                  'density',
                  newValue > 0 ? newValue : 0,
                  project
                );
                this.forceUpdate();
              }}
            />
          </Column>
          <Column expand>
            <NumericProperty
              properties={properties}
              propertyName={'gravityScale'}
              step={0.1}
              onUpdate={newValue => {
                behavior.updateProperty('gravityScale', newValue, project);
                this.forceUpdate();
              }}
            />
          </Column>
        </Line>
        <Line>
          <Column expand>
            <NumericProperty
              properties={properties}
              propertyName={'friction'}
              step={0.1}
              onUpdate={newValue => {
                behavior.updateProperty(
                  'friction',
                  newValue > 0 ? newValue : 0,
                  project
                );
                this.forceUpdate();
              }}
            />
          </Column>
          <Column expand>
            <NumericProperty
              properties={properties}
              propertyName={'restitution'}
              step={0.1}
              onUpdate={newValue => {
                behavior.updateProperty(
                  'restitution',
                  newValue > 0 ? newValue : 0,
                  project
                );
                this.forceUpdate();
              }}
            />
          </Column>
        </Line>
        <Line>
          <Column expand>
            <NumericProperty
              properties={properties}
              propertyName={'linearDamping'}
              step={0.05}
              onUpdate={newValue => {
                behavior.updateProperty('linearDamping', newValue, project);
                this.forceUpdate();
              }}
            />
          </Column>
          <Column expand>
            <NumericProperty
              properties={properties}
              propertyName={'angularDamping'}
              step={0.05}
              onUpdate={newValue => {
                behavior.updateProperty('angularDamping', newValue, project);
                this.forceUpdate();
              }}
            />
          </Column>
        </Line>
        <Line>
          <label style={{ width: '10%' }}>
            {properties.get('layers').getLabel()}
          </label>
          {bits.map((value, index) => {
            return (
              <BitProperty
                enabled={this._isBitEnabled(layersValues, index)}
                propertyName={'layers'}
                pos={index}
                spacing={index === 7}
                onUpdate={enabled => {
                  const newValue = this._enableBit(
                    layersValues,
                    index,
                    enabled
                  );
                  this.props.behavior.updateProperty(
                    'layers',
                    newValue.toString(10),
                    this.props.project
                  );
                  this.forceUpdate();
                }}
                key={`layer${index}`}
              />
            );
          })}
        </Line>
        <Line>
          <label style={{ width: '10%' }}>
            {properties.get('masks').getLabel()}
          </label>
          {bits.map((value, index) => {
            return (
              <BitProperty
                enabled={this._isBitEnabled(masksValues, index)}
                propertyName={'masks'}
                pos={index}
                spacing={index === 7}
                onUpdate={enabled => {
                  const newValue = this._enableBit(masksValues, index, enabled);
                  this.props.behavior.updateProperty(
                    'masks',
                    newValue.toString(10),
                    this.props.project
                  );
                  this.forceUpdate();
                }}
                key={`mask${index}`}
              />
            );
          })}
        </Line>
      </Column>
    );
  }
}
