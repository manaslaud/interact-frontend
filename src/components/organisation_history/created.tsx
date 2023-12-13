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
    <div className="w-fit text-center flex-center gap-4">Created {history.OrganizationID}! 🎉</div>
  </  OrganizationHistoryWrapper>)
  case 0:
    return (< OrganizationHistoryWrapper history={history}>
      <div className="w-fit text-center flex-center gap-4">Created {history.Event?.title} 🎉</div>
    </  OrganizationHistoryWrapper>)
  case 3:
   return ( < OrganizationHistoryWrapper history={history}>
    <div className="w-fit text-center flex-center gap-4">{history.Invitation?.user.id}🎉</div>
  </  OrganizationHistoryWrapper>)

  case 6:
   return ( < OrganizationHistoryWrapper history={history}>
    <div className="w-fit text-center flex-center gap-4">{history.Post?.content} 🎉</div>
  </  OrganizationHistoryWrapper>)
  case 9:
    return (< OrganizationHistoryWrapper history={history}>
      <div className="w-fit text-center flex-center gap-4">{history.Project?.description} 🎉</div>
    </  OrganizationHistoryWrapper>)
  case 12:
    return (< OrganizationHistoryWrapper history={history}>
      <div className="w-fit text-center flex-center gap-4">{history.Task?.description} 🎉</div>
    </  OrganizationHistoryWrapper>)

    default:
      return <></>;
  }
};

export default Created;
