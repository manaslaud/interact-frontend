import { OrganizationHistory } from '@/types';
import OrganizationHistoryWrapper from '@/wrappers/organisation_history';
import React from 'react';

interface Props {
  history: OrganizationHistory;
}

const Deleted = ({ history }: Props) => {
  switch (history.HistoryType) {
    case 1: 
      return (
        <OrganizationHistoryWrapper history={history}>
          <div className="w-fit text-center flex-center gap-4">deleted an Opening.</div>
        </OrganizationHistoryWrapper>
      );
    default:
      return <></>;
  }
};

export default Deleted;
