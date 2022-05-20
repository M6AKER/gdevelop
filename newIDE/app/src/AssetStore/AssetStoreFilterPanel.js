// @flow
import * as React from 'react';
import { I18n } from '@lingui/react';
import { t, Trans } from '@lingui/macro';
import { Accordion, AccordionHeader, AccordionBody } from '../UI/Accordion';
import Text from '../UI/Text';
import InlineCheckbox from '../UI/InlineCheckbox';
import { ColumnStackLayout } from '../UI/Layout';
import {
  TagAssetStoreSearchFilter,
  AnimatedAssetStoreSearchFilter,
  ObjectTypeAssetStoreSearchFilter,
  LicenseAssetStoreSearchFilter,
  DimensionAssetStoreSearchFilter,
} from './AssetStoreSearchFilter';
import { type AssetFiltersState } from './AssetStoreContext';
import { type License } from '../Utils/GDevelopServices/Asset';
import Slider from '@material-ui/core/Slider';

/** @typedef { import("../UI/Search/UseSearchItem").TagSearchFilter } TagSearchFilter */

type Choice = {|
  label: ?React.Node,
  value: string,
|};

type MultipleChoiceFilterProps = {|
  filterKey: string,
  title: ?React.Node,
  choices: Choice[],
  isChoiceChecked: (choice: string) => boolean,
  setChoiceChecked: (choice: string, checked: boolean) => void,
|};

const MultipleChoiceFilter = ({
  filterKey,
  title,
  choices,
  isChoiceChecked,
  setChoiceChecked,
}: MultipleChoiceFilterProps) => {
  return (
    <I18n>
      {({ i18n }) => (
        <Accordion key={filterKey} defaultExpanded>
          <AccordionHeader>
            <Text displayInlineAsSpan>{title}</Text>
          </AccordionHeader>
          <AccordionBody>
            <ColumnStackLayout>
              {choices.map(tag => (
                <InlineCheckbox
                  key={tag.value}
                  label={tag.label ? i18n._(tag.label) : tag.value}
                  checked={isChoiceChecked(tag.value)}
                  onCheck={(e, checked) => setChoiceChecked(tag.value, checked)}
                />
              ))}
            </ColumnStackLayout>
          </AccordionBody>
        </Accordion>
      )}
    </I18n>
  );
};

type SetFilterProps = {|
  filterKey: string,
  title: ?React.Node,
  choices: Choice[],
  values: Set<string>,
  setValues: (Set<string>) => void,
|};

const SetFilter = ({
  filterKey,
  title,
  choices,
  values,
  setValues,
}: SetFilterProps) => {
  return (
    <MultipleChoiceFilter
      filterKey={filterKey}
      title={title}
      choices={choices}
      isChoiceChecked={choice => values.has(choice)}
      setChoiceChecked={(choice, checked) => {
        if (checked) {
          values.add(choice);
        } else {
          values.delete(choice);
        }
        setValues(values);
      }}
    />
  );
};

type TagFilterProps = {|
  filterKey: string,
  title: ?React.Node,
  choices: Choice[],
  searchFilter: TagAssetStoreSearchFilter,
  setSearchFilter: TagAssetStoreSearchFilter => void,
  onFilterChange: () => void,
|};

const TagFilter = ({
  filterKey,
  title,
  choices,
  searchFilter,
  setSearchFilter,
  onFilterChange,
}: TagFilterProps) => {
  return (
    <SetFilter
      filterKey={filterKey}
      title={title}
      choices={choices}
      values={searchFilter.tags}
      setValues={values => {
        setSearchFilter(new TagAssetStoreSearchFilter(values));
        onFilterChange();
      }}
    />
  );
};

type RangeFilterProps = {|
  filterKey: string,
  title: ?React.Node,
  min: number,
  max: number,
  step: number,
  scale: number => number,
  range: [number, number],
  setRange: ([number, number]) => void,
|};

const RangeFilter = ({
  filterKey,
  title,
  min,
  max,
  scale,
  step,
  range,
  setRange,
}: RangeFilterProps) => {
  return (
    <I18n>
      {({ i18n }) => (
        <Accordion key={filterKey} defaultExpanded>
          <AccordionHeader>
            <Text displayInlineAsSpan>{title}</Text>
          </AccordionHeader>
          <AccordionBody>
            <Slider
              value={range}
              min={min}
              max={max}
              step={step}
              scale={scale}
              marks={true}
              valueLabelDisplay="auto"
              onChange={(event, newValue) => setRange(newValue)}
            />
          </AccordionBody>
        </Accordion>
      )}
    </I18n>
  );
};

type BooleanFilterProps = {|
  filterKey: string,
  title: ?React.Node,
  trueChoice: Choice,
  falseChoice: Choice,
  value: boolean | null,
  setValue: (boolean | null) => void,
|};

const BooleanFilter = ({
  filterKey,
  title,
  trueChoice,
  falseChoice,
  value,
  setValue,
}: BooleanFilterProps) => {
  return (
    <MultipleChoiceFilter
      filterKey={filterKey}
      title={title}
      choices={[trueChoice, falseChoice]}
      isChoiceChecked={choice =>
        (choice === trueChoice.value && value === true) ||
        (choice === falseChoice.value && value === false)
      }
      setChoiceChecked={(choice, checked) => {
        // The value can only toggle between null and not null
        // because only one checkbox changes at once.
        setValue(
          value === null ? (choice === trueChoice.value) === checked : null
        );
      }}
    />
  );
};

type AssetStoreFilterPanelProps = {|
  assetFiltersState: AssetFiltersState,
  licenses: Array<License>,
  onChoiceChange: () => void,
|};

export const AssetStoreFilterPanel = ({
  assetFiltersState,
  licenses,
  onChoiceChange,
}: AssetStoreFilterPanelProps) => {
  return (
    <>
      <MultipleChoiceFilter
        filterKey="Animation"
        title={<Trans>Animation</Trans>}
        choices={[
          { label: t`Multiple Frames`, value: 'multiple-frames' },
          { label: t`Multiple States`, value: 'multiple-states' },
        ]}
        isChoiceChecked={choice =>
          (choice === 'multiple-frames' &&
            assetFiltersState.animatedFilter.mustBeAnimated) ||
          (choice === 'multiple-states' &&
            assetFiltersState.animatedFilter.mustHaveSeveralState)
        }
        setChoiceChecked={(choice, checked) => {
          const animatedFilter = assetFiltersState.animatedFilter;
          if (choice === 'multiple-frames') {
            animatedFilter.mustBeAnimated = checked;
          } else {
            animatedFilter.mustHaveSeveralState = checked;
          }
          assetFiltersState.setAnimatedFilter(
            new AnimatedAssetStoreSearchFilter(
              animatedFilter.mustBeAnimated,
              animatedFilter.mustHaveSeveralState
            )
          );
          onChoiceChange();
        }}
      />
      <TagFilter
        filterKey="Viewpoint"
        title={<Trans>Viewpoint</Trans>}
        choices={[
          { label: t`Top-down`, value: 'top-down' },
          { label: t`Side view`, value: 'side view' },
          { label: t`Isometric`, value: 'isometric' },
        ]}
        searchFilter={assetFiltersState.viewportFilter}
        setSearchFilter={assetFiltersState.setViewportFilter}
        onFilterChange={onChoiceChange}
      />
      <RangeFilter
        filterKey="PixelSize"
        title={<Trans>Pixel size</Trans>}
        min={Math.log2(DimensionAssetStoreSearchFilter.boundMin)}
        max={Math.log2(DimensionAssetStoreSearchFilter.boundMax)}
        step={0.5}
        scale={x => Math.round(2 ** x)}
        range={[
          Math.log2(assetFiltersState.dimensionFilter.dimensionMin),
          Math.log2(assetFiltersState.dimensionFilter.dimensionMax),
        ]}
        setRange={range => {
          assetFiltersState.setDimensionFilter(
            new DimensionAssetStoreSearchFilter(2 ** range[0], 2 ** range[1])
          );
          onChoiceChange();
        }}
      />
      <SetFilter
        filterKey="ObjectType"
        title={<Trans>Type of objects</Trans>}
        choices={[
          { label: t`Sprite`, value: 'sprite' },
          { label: t`Tiled sprite`, value: 'tiled' },
          { label: t`Panel sprite`, value: '9patch' },
        ]}
        values={assetFiltersState.objectTypeFilter.objectTypes}
        setValues={values => {
          assetFiltersState.setObjectTypeFilter(
            new ObjectTypeAssetStoreSearchFilter(values)
          );
          onChoiceChange();
        }}
      />
      <SetFilter
        filterKey="License"
        title={<Trans>License</Trans>}
        choices={licenses.map(license => ({
          label: null,
          value: license.name,
        }))}
        values={assetFiltersState.licenseFilter.licenses}
        setValues={values => {
          assetFiltersState.setLicenseFilter(
            new LicenseAssetStoreSearchFilter(values)
          );
          onChoiceChange();
        }}
      />
    </>
  );
};
