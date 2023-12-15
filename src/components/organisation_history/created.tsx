import {  OrganizationHistory } from '@/types';
import  OrganizationHistoryWrapper from '@/wrappers/organisation_history';
import React from 'react';

interface Props {
  history:  OrganizationHistory;
}

const Created = ({ history }: Props) => {
  switch (history.HistoryType) {
   case -1:
   return ( < OrganizationHistoryWrapper history={history}>
    <div className="w-fit text-center flex-center gap-4">Created new organisation: {history.OrganizationID}! 🎉</div>
  </  OrganizationHistoryWrapper>)
  case 0:
    return (< OrganizationHistoryWrapper history={history}>
      <div className="w-fit text-center flex-center gap-4">Created new event: {history.Event?.title} 🎉</div>
    </  OrganizationHistoryWrapper>)
  case 3:
   return ( < OrganizationHistoryWrapper history={history}>
    <div className="w-fit text-center flex-center gap-4">Invited new user: {history.Invitation?.user.id}🎉</div>
  </  OrganizationHistoryWrapper>)

  case 6:
   return ( < OrganizationHistoryWrapper history={history}>
    <div className="w-fit text-center flex-center gap-4">Created a post: {history.Post?.content} 🎉</div>
  </  OrganizationHistoryWrapper>)
  case 9:
    return (< OrganizationHistoryWrapper history={history}>
      <div className="w-fit text-center flex-center gap-4">Created a project:{history.Project?.description} 🎉</div>
    </  OrganizationHistoryWrapper>)
  case 12:
    return (< OrganizationHistoryWrapper history={history}>
      <div className="w-fit text-center flex-center gap-4">Created a task:{history.Task?.description} 🎉</div>
    </  OrganizationHistoryWrapper>)

    default:
      return <></>;
  }
};

export default Created;
