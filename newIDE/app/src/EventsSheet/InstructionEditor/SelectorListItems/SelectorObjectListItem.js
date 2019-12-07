// @flow
import * as React from 'react';
import { ListItem } from '../../../UI/List';
import ListIcon from '../../../UI/ListIcon';
import ObjectsRenderingService from '../../../ObjectsRendering/ObjectsRenderingService';
import type { ObjectWithContext } from '../../../ObjectsList/EnumerateObjects';
import {
  getObjectOrObjectGroupListItemValue,
  getObjectListItemKey,
} from './Keys';

type Props = {|
  project: gdProject,
  objectWithContext: ObjectWithContext,
  iconSize: number,
  onClick: () => void,
  selectedValue: ?string,
|};

export const renderObjectListItem = ({
  project,
  objectWithContext,
  iconSize,
  onClick,
  selectedValue,
}: Props) => {
  const objectName: string = objectWithContext.object.getName();
  return (
    <ListItem
      key={getObjectListItemKey(objectWithContext)}
      selected={
        selectedValue === getObjectOrObjectGroupListItemValue(objectName)
      }
      primaryText={objectName}
      leftIcon={
        <ListIcon
          iconSize={iconSize}
          src={ObjectsRenderingService.getThumbnail(
            project,
            objectWithContext.object
          )}
        />
      }
      onClick={onClick}
    />
  );
};
