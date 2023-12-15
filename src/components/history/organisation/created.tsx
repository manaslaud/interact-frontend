import { OrganizationHistory } from '@/types';
import OrganizationHistoryWrapper from '@/wrappers/organisation_history';
import React from 'react';

interface Props {
  history: OrganizationHistory;
}

const Created = ({ history }: Props) => {
  switch (history.historyType) {
    case -1:
      return (
        <OrganizationHistoryWrapper history={history}>
          <div className="w-fit text-center flex-center gap-4">Created organisation: {history.organizationID}! 🎉</div>
        </OrganizationHistoryWrapper>
      );
    case 0:
      return (
        <OrganizationHistoryWrapper history={history}>
          <div className="w-fit text-center flex-center gap-4">Created event: {history.event?.title} 🎉</div>
        </OrganizationHistoryWrapper>
      );
    case 3:
      return (
        <OrganizationHistoryWrapper history={history}>
          <div className="w-fit text-center flex-center gap-4"> Invited user :{history.invitation?.user.username}🎉</div>
        </OrganizationHistoryWrapper>
      );

    case 6:
      return (
        <OrganizationHistoryWrapper history={history}>
          <div className="w-fit text-center flex-center gap-4">Created post: {history.post?.content} 🎉</div>
        </OrganizationHistoryWrapper>
      );
    case 9:
      return (
        <OrganizationHistoryWrapper history={history}>
          <div className="w-fit text-center flex-center gap-4"> Created project:{history.project?.description} 🎉</div>
        </OrganizationHistoryWrapper>
      );
    case 12:
      return (
        <OrganizationHistoryWrapper history={history}>
          <div className="w-fit text-center flex-center gap-4">Created task:{history.task?.description} 🎉</div>
        </OrganizationHistoryWrapper>
      );

    default:
      return <></>;
  }
};

export default Created;
