import { OrganizationHistory } from '@/types';
import OrganizationHistoryWrapper from '@/wrappers/organisation_history';
import React from 'react';

interface Props {
  history: OrganizationHistory;
}

const Edited = ({ history }: Props) => {
  switch (history.historyType) {
    case 2:
      return (
        <OrganizationHistoryWrapper history={history}>
          <div className="w-full text-center flex-center gap-4">Updated {history.event?.title}</div>
        </OrganizationHistoryWrapper>
      );
    case 8:
      return (
        <OrganizationHistoryWrapper history={history}>
          <div className="w-full text-center line-clamp-1 flex-center gap-4">Updated {history.post?.content}</div>
        </OrganizationHistoryWrapper>
      );

    case 11:
      return (
        <OrganizationHistoryWrapper history={history}>
          <div className="w-full text-center flex-center gap-4">Updated {history.project?.title}</div>
        </OrganizationHistoryWrapper>
      );

    case 14:
      return (
        <OrganizationHistoryWrapper history={history}>
          <div className="w-fit text-center flex-center gap-4">Updated organization details </div>
        </OrganizationHistoryWrapper>
      );

    default:
      return <></>;
  }
};

export default Edited;
