// @flow
import * as React from 'react';
import { Trans } from '@lingui/macro';
import VariablesEditorDialog from '../VariablesList/VariablesEditorDialog';
import { type HotReloadPreviewButtonProps } from '../HotReload/HotReloadPreviewButton';
import EventsRootVariablesFinder from '../Utils/EventsRootVariablesFinder';

type Props = {|
  open: boolean,
  project: gdProject,
  layout: gdLayout,
  onApply: (selectedVariableName: string | null) => void,
  onCancel: () => void,
  hotReloadPreviewButtonProps?: ?HotReloadPreviewButtonProps,
  /**
   * If set to true, a deleted variable won't trigger a confirmation asking if the
   * project must be refactored to delete any reference to it.
   */
  preventRefactoringToDeleteInstructions?: boolean,
|};

const SceneVariablesDialog = ({
  project,
  layout,
  open,
  onCancel,
  onApply,
  hotReloadPreviewButtonProps,
  preventRefactoringToDeleteInstructions,
}: Props) => {
  const tabs = React.useMemo(
    () => [
      {
        id: 'scene-variables',
        label: <Trans>Scene variables</Trans>,
        variablesContainer: layout.getVariables(),
        emptyPlaceholderTitle: <Trans>Add your first scene variable</Trans>,
        emptyPlaceholderDescription: (
          <Trans>These variables hold additional information on a scene.</Trans>
        ),
      },
    ],
    [layout]
  );
  return (
    <VariablesEditorDialog
      project={project}
      open={open}
      onCancel={onCancel}
      onApply={onApply}
      title={<Trans>{layout.getName()} variables</Trans>}
      tabs={tabs}
      helpPagePath={'/all-features/variables/scene-variables'}
      hotReloadPreviewButtonProps={hotReloadPreviewButtonProps}
      onComputeAllVariableNames={() =>
        EventsRootVariablesFinder.findAllLayoutVariables(
          project.getCurrentPlatform(),
          project,
          layout
        )
      }
      preventRefactoringToDeleteInstructions={
        preventRefactoringToDeleteInstructions
      }
      id="scene-variables-dialog"
    />
  );
};

export default SceneVariablesDialog;
