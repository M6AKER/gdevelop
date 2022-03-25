//@flow
import React from 'react';
import { LeaderboardAdmin } from '../GameDashboard/LeaderboardAdmin';

import Dialog from '../UI/Dialog';
import FlatButton from '../UI/FlatButton';
import { Trans } from '@lingui/macro';

type Props = {|
  onClose: () => void,
  open: boolean,
|};

const LeaderboardDialog = ({ onClose, open }: Props) => {
  const [isLoading, setIsLoading] = React.useState(false);
  return (
    <Dialog
      actions={[
        <FlatButton
          label={<Trans>Close</Trans>}
          disabled={isLoading}
          onClick={onClose}
          key={'Close'}
        />,
      ]}
      open={open}
      cannotBeDismissed={true}
      onRequestClose={() => {
        if (!isLoading) onClose();
      }}
      title={<Trans>Leaderboards</Trans>}
      flexBody
      fullHeight
    >
      <LeaderboardAdmin onLoading={setIsLoading} />
    </Dialog>
  );
};

export default LeaderboardDialog;
