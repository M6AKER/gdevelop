// @flow

import * as React from 'react';
import { type EditorProps } from './EditorProps.flow';
import { ColumnStackLayout, ResponsiveLineStackLayout } from '../../UI/Layout';
import Text from '../../UI/Text';
import { Trans } from '@lingui/macro';
import SemiControlledTextField from '../../UI/SemiControlledTextField';
import useForceUpdate from '../../Utils/UseForceUpdate';
import ResourceSelectorWithThumbnail from '../../ResourcesList/ResourceSelectorWithThumbnail';
import Checkbox from '../../UI/Checkbox';
import { Column, Line } from '../../UI/Grid';
import { FormHelperText } from '@material-ui/core';
import { MarkdownText } from '../../UI/MarkdownText';
import SelectField from '../../UI/SelectField';
import SelectOption from '../../UI/SelectOption';

const facesProperties = [
  {
    id: 'frontFace',
    blockName: <Trans>Front face</Trans>,
    visibilityProperty: 'frontFaceVisible',
    resourceRepeatProperty: 'frontFaceResourceRepeat',
    resourceNameProperty: 'frontFaceResourceName',
  },
  {
    id: 'backFace',
    blockName: <Trans>Back face</Trans>,
    visibilityProperty: 'backFaceVisible',
    resourceRepeatProperty: 'backFaceResourceRepeat',
    resourceNameProperty: 'backFaceResourceName',
  },
  {
    id: 'leftFace',
    blockName: <Trans>Left face</Trans>,
    visibilityProperty: 'leftFaceVisible',
    resourceRepeatProperty: 'leftFaceResourceRepeat',
    resourceNameProperty: 'leftFaceResourceName',
  },
  {
    id: 'rightFace',
    blockName: <Trans>Right face</Trans>,
    visibilityProperty: 'rightFaceVisible',
    resourceRepeatProperty: 'rightFaceResourceRepeat',
    resourceNameProperty: 'rightFaceResourceName',
  },
  {
    id: 'topFace',
    blockName: <Trans>Top face</Trans>,
    visibilityProperty: 'topFaceVisible',
    resourceRepeatProperty: 'topFaceResourceRepeat',
    resourceNameProperty: 'topFaceResourceName',
  },
  {
    id: 'bottomFace',
    blockName: <Trans>Bottom face</Trans>,
    visibilityProperty: 'bottomFaceVisible',
    resourceRepeatProperty: 'bottomFaceResourceRepeat',
    resourceNameProperty: 'bottomFaceResourceName',
  },
];

const Cube3DEditor = ({
  objectConfiguration,
  project,
  resourceManagementProps,
}: EditorProps) => {
  const forceUpdate = useForceUpdate();
  const properties = objectConfiguration.getProperties();

  const onChangeProperty = React.useCallback(
    (property: string, value: string) => {
      objectConfiguration.updateProperty(property, value);
      forceUpdate();
    },
    [objectConfiguration, forceUpdate]
  );

  const facesOrientationChoices = properties
    .get('facesOrientation')
    .getExtraInfo()
    .toJSArray()
    .map(value => ({ value, label: value }));
  const backFaceUpThroughWhichAxisRotationChoices = properties
    .get('backFaceUpThroughWhichAxisRotation')
    .getExtraInfo()
    .toJSArray()
    .map(value => ({ value, label: value }));

  return (
    <ColumnStackLayout noMargin>
      <Text size="block-title" noMargin>
        <Trans>Default size</Trans>
      </Text>
      <ResponsiveLineStackLayout expand noColumnMargin>
        <Column noMargin expand>
          <SemiControlledTextField
            commitOnBlur
            floatingLabelFixed
            floatingLabelText={properties.get('width').getLabel()}
            onChange={value => onChangeProperty('width', value)}
            value={properties.get('width').getValue()}
          />
        </Column>
        <Column noMargin expand>
          <SemiControlledTextField
            commitOnBlur
            floatingLabelFixed
            floatingLabelText={properties.get('height').getLabel()}
            onChange={value => onChangeProperty('height', value)}
            value={properties.get('height').getValue()}
          />
        </Column>
        <Column noMargin expand>
          <SemiControlledTextField
            commitOnBlur
            floatingLabelFixed
            floatingLabelText={properties.get('depth').getLabel()}
            onChange={value => onChangeProperty('depth', value)}
            value={properties.get('depth').getValue()}
          />
        </Column>
      </ResponsiveLineStackLayout>
      <Text size="block-title" noMargin>
        <Trans>Settings</Trans>
      </Text>
      <ColumnStackLayout noMargin expand>
        <Checkbox
          checked={
            properties.get('enableTextureTransparency').getValue() === 'true'
          }
          label={
            <React.Fragment>
              <Line noMargin>
                {properties.get('enableTextureTransparency').getLabel()}
              </Line>
              <FormHelperText style={{ display: 'inline' }}>
                <MarkdownText
                  source={properties
                    .get('enableTextureTransparency')
                    .getDescription()}
                />
              </FormHelperText>
            </React.Fragment>
          }
          onCheck={(_, value) => {
            onChangeProperty('enableTextureTransparency', value ? '1' : '0');
          }}
        />
        <SelectField
          value={properties.get('facesOrientation').getValue()}
          floatingLabelText={properties.get('facesOrientation').getLabel()}
          helperMarkdownText={properties
            .get('facesOrientation')
            .getDescription()}
          onChange={(event, index, newValue) => {
            onChangeProperty('facesOrientation', newValue);
          }}
        >
          {facesOrientationChoices.map(choice => (
            <SelectOption
              label={choice.label}
              value={choice.value}
              key={choice.value}
            />
          ))}
        </SelectField>
        <SelectField
          value={properties
            .get('backFaceUpThroughWhichAxisRotation')
            .getValue()}
          floatingLabelText={properties
            .get('backFaceUpThroughWhichAxisRotation')
            .getLabel()}
          helperMarkdownText={properties
            .get('backFaceUpThroughWhichAxisRotation')
            .getDescription()}
          onChange={(event, index, newValue) => {
            onChangeProperty('backFaceUpThroughWhichAxisRotation', newValue);
          }}
        >
          {backFaceUpThroughWhichAxisRotationChoices.map(choice => (
            <SelectOption
              label={choice.label}
              value={choice.value}
              key={choice.value}
            />
          ))}
        </SelectField>
      </ColumnStackLayout>
      {facesProperties.map(faceProperty => (
        <React.Fragment key={faceProperty.id}>
          <Text size="block-title">{faceProperty.blockName}</Text>
          <ColumnStackLayout noMargin>
            <ColumnStackLayout noMargin>
              <Checkbox
                checked={
                  properties.get(faceProperty.visibilityProperty).getValue() ===
                  'true'
                }
                label={properties
                  .get(faceProperty.visibilityProperty)
                  .getLabel()}
                onCheck={(_, value) => {
                  onChangeProperty(
                    faceProperty.visibilityProperty,
                    value ? '1' : '0'
                  );
                }}
              />
              <Checkbox
                checked={
                  properties
                    .get(faceProperty.resourceRepeatProperty)
                    .getValue() === 'true'
                }
                label={properties
                  .get(faceProperty.resourceRepeatProperty)
                  .getLabel()}
                onCheck={(_, value) => {
                  onChangeProperty(
                    faceProperty.resourceRepeatProperty,
                    value ? '1' : '0'
                  );
                }}
              />
            </ColumnStackLayout>
            <ResourceSelectorWithThumbnail
              project={project}
              resourceKind="image"
              floatingLabelText={properties
                .get(faceProperty.resourceNameProperty)
                .getLabel()}
              resourceManagementProps={resourceManagementProps}
              resourceName={properties
                .get(faceProperty.resourceNameProperty)
                .getValue()}
              onChange={value =>
                onChangeProperty(faceProperty.resourceNameProperty, value)
              }
            />
          </ColumnStackLayout>
        </React.Fragment>
      ))}
    </ColumnStackLayout>
  );
};

export default Cube3DEditor;
