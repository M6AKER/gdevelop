import React, { Component } from 'react';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { mapFor } from '../../../Utils/MapFor';
import Add from 'material-ui/svg-icons/content/add';
import IconButton from 'material-ui/IconButton';
import DirectionTools from './DirectionTools';
import MiniToolbar from '../../../UI/MiniToolbar';
import ImageThumbnail, {
  thumbnailContainerStyle,
} from '../../../ResourcesList/ResourceThumbnail/ImageThumbnail';
import { openPiskel } from '../../../Utils/PiskelBridge';
const gd = global.gd;

const SPRITE_SIZE = 100; //TODO: Factor with Thumbnail

const styles = {
  spritesList: {
    whiteSpace: 'nowrap',
    overflowY: 'hidden',
  },
  thumbnailExtraStyle: {
    marginRight: 10,
  },
  addSpriteButton: {
    ...thumbnailContainerStyle,
    background: '#FFF',
  },
  spriteThumbnailImage: {
    maxWidth: SPRITE_SIZE,
    maxHeight: SPRITE_SIZE,
    verticalAlign: 'middle',
  },
};

const AddSpriteButton = SortableElement(({ displayHint, onAdd }) => {
  return (
    <div style={styles.addSpriteButton}>
      <IconButton onClick={onAdd} style={styles.spriteThumbnailImage}>
        <Add />
      </IconButton>
    </div>
  );
});

const SortableSpriteThumbnail = SortableElement(
  ({ sprite, project, resourcesLoader, selected, onSelect, onContextMenu }) => {
    return (
      <ImageThumbnail
        selectable
        selected={selected}
        onSelect={onSelect}
        onContextMenu={onContextMenu}
        resourceName={sprite.getImageName()}
        resourcesLoader={resourcesLoader}
        project={project}
        style={styles.thumbnailExtraStyle}
      />
    );
  }
);

const SortableList = SortableContainer(
  ({
    direction,
    project,
    resourcesLoader,
    onAddSprite,
    selectedSprites,
    onSelectSprite,
    onSpriteContextMenu,
  }) => {
    const spritesCount = direction.getSpritesCount();
    return (
      <div style={styles.spritesList}>
        {[
          ...mapFor(0, spritesCount, i => {
            const sprite = direction.getSprite(i);
            return (
              <SortableSpriteThumbnail
                sprite={sprite}
                key={sprite.ptr}
                index={i}
                selected={!!selectedSprites[sprite.ptr]}
                onContextMenu={(x, y) => onSpriteContextMenu(x, y, sprite)}
                onSelect={selected => onSelectSprite(sprite, selected)}
                resourcesLoader={resourcesLoader}
                project={project}
              />
            );
          }),
          <AddSpriteButton
            displayHint={!direction.getSpritesCount()}
            key="add-sprite-button"
            disabled
            index={spritesCount}
            onAdd={onAddSprite}
          />,
        ]}
      </div>
    );
  }
);

export default class SpritesList extends Component {
  onSortEnd = ({ oldIndex, newIndex }) => {
    this.props.direction.moveSprite(oldIndex, newIndex);
    this.forceUpdate();
  };

  onAddSprite = () => {
    const {
      resourceSources,
      onChooseResource,
      project,
      direction,
    } = this.props;
    if (!resourceSources) return;
    const sources = resourceSources.filter(source => source.kind === 'image');
    if (!sources.length) return;

    onChooseResource(sources[0].name).then(resources => {
      resources.forEach(resource => {
        project.getResourcesManager().addResource(resource);

        const sprite = new gd.Sprite();
        sprite.setImageName(resource.getName());
        direction.addSprite(sprite);
      });

      this.forceUpdate();
    });
  };

  editWithPiskel = () => {
    const { project, direction, resourcesLoader } = this.props;
    const resourceNames = mapFor(0, direction.getSpritesCount(), i => {
      return direction.getSprite(i).getImageName();
    });

    openPiskel({
      project,
      resourcesLoader,
      resourceNames,
      piskelOptions: {
        fps:
          direction.getTimeBetweenFrames() > 0
            ? 1 / direction.getTimeBetweenFrames()
            : 1,
        name: 'Animation', //TODO
        isLooping: direction.isLooping(),
      },
      onChangesSaved: resourceNames => {
        // TODO: this erase any point and collision mask. Should find another way to update sprites
        // without losing this.
        direction.removeAllSprites();
        resourceNames.forEach(resourceName => {
          const sprite = new gd.Sprite();
          sprite.setImageName(resourceName);
          direction.addSprite(sprite);
          sprite.delete();
        });

        // Burst the ResourcesLoader cache to force images to be reloaded (and not cached by the browser).
        // TODO: A more fine-grained cache bursting for specific resources could be done.
        resourcesLoader.burstUrlsCache();
        this.forceUpdate();
      },
    });
  };

  render() {
    return (
      <div>
        <MiniToolbar justifyContent="flex-end" smallest>
          <DirectionTools
            direction={this.props.direction}
            resourcesLoader={this.props.resourcesLoader}
            project={this.props.project}
            editWithPiskel={this.editWithPiskel}
          />
        </MiniToolbar>
        <SortableList
          resourcesLoader={this.props.resourcesLoader}
          direction={this.props.direction}
          project={this.props.project}
          onSortEnd={this.onSortEnd}
          onAddSprite={this.onAddSprite}
          onEditSprites={this.onEditSprites}
          selectedSprites={this.props.selectedSprites}
          onSelectSprite={this.props.onSelectSprite}
          onSpriteContextMenu={this.props.onSpriteContextMenu}
          helperClass="sortable-helper"
          lockAxis="x"
          axis="x"
        />
      </div>
    );
  }
}
