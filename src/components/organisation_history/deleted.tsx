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
          <div className="w-fit text-center flex-center gap-4">Deleted an event: {history.Event?.description}.</div>
        </OrganizationHistoryWrapper>
      );
      case 4: 
      return (
        <OrganizationHistoryWrapper history={history}>
          <div className="w-fit text-center flex-center gap-4">Withdrew an invitation:{history.Invitation?.user.id}</div>
        </OrganizationHistoryWrapper>
      );
      case 5: 
      return (
        <OrganizationHistoryWrapper history={history}>
          <div className="w-fit text-center flex-center gap-4">Removed a member: {history.User.id}.</div>
        </OrganizationHistoryWrapper>
      );
      case 7: 
      return (
        <OrganizationHistoryWrapper history={history}>
          <div className="w-fit text-center flex-center gap-4">Deleted a post: {history.Post?.content}.</div>
        </OrganizationHistoryWrapper>
      );
      case 10: 
      return (
        <OrganizationHistoryWrapper history={history}>
          <div className="w-fit text-center flex-center gap-4">Deleted a project: {history.Project?.description}.</div>
        </OrganizationHistoryWrapper>
      );
      case 13: 
      return (
        <OrganizationHistoryWrapper history={history}>
          <div className="w-fit text-center flex-center gap-4">Deleted a task: {history.Task?.description}</div>
        </OrganizationHistoryWrapper>
      );
    default:
      return <></>;
  }
};

export default Deleted;
