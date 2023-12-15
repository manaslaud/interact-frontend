import { OrganizationHistory } from '@/types';
import OrganizationHistoryWrapper from '@/wrappers/organisation_history';
import React from 'react';

interface Props {
  history: OrganizationHistory;
}

const Deleted = ({ history }: Props) => {
  switch (history.historyType) {
    case 1:
      return (
        <OrganizationHistoryWrapper history={history}>
          <div className="w-fit text-center flex-center gap-4">Deleted an event: {history.event?.description}.</div>
        </OrganizationHistoryWrapper>
      );
      case 4: 
      return (
        <OrganizationHistoryWrapper history={history}>
          <div className="w-fit text-center flex-center gap-4">Withdrew an invitation:{history.invitation?.user.id}</div>
        </OrganizationHistoryWrapper>
      );
      case 5: 
      return (
        <OrganizationHistoryWrapper history={history}>
          <div className="w-fit text-center flex-center gap-4">Removed a member: {history.user.id}.</div>
        </OrganizationHistoryWrapper>
      );
      case 7: 
      return (
        <OrganizationHistoryWrapper history={history}>
          <div className="w-fit text-center flex-center gap-4">Deleted a post: {history.post?.content}.</div>
        </OrganizationHistoryWrapper>
      );
      case 10: 
      return (
        <OrganizationHistoryWrapper history={history}>
          <div className="w-fit text-center flex-center gap-4">Deleted a project: {history.project?.description}.</div>
        </OrganizationHistoryWrapper>
      );
      case 13: 
      return (
        <OrganizationHistoryWrapper history={history}>
          <div className="w-fit text-center flex-center gap-4">Deleted a task: {history.task?.description}</div>
        </OrganizationHistoryWrapper>
      );
    default:
      return <></>;
  }
};

export default Deleted;
