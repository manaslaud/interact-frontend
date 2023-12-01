import { ProjectHistory } from '@/types';
import ProjectHistoryWrapper from '@/wrappers/project_history';
import React from 'react';

interface Props {
  history: ProjectHistory;
}

const Membership = ({ history }: Props) => {
  console.log(history);
  switch (history.historyType) {
    case 0: //User sent invitation to user
      return (
        <ProjectHistoryWrapper history={history}>
          <div className="w-fit text-center flex-center gap-4">
            invited <b>{history.user.name}</b> to join this Project!
          </div>
        </ProjectHistoryWrapper>
      );
    case 1: //User joined this project
      return (
        <ProjectHistoryWrapper history={history}>
          <div className="w-fit text-center flex-center gap-4">joined this Project!🎉</div>
        </ProjectHistoryWrapper>
      );
    case 6: //User accepted application of user
      return (
        <ProjectHistoryWrapper history={history}>
          <div className="w-fit text-center flex-center gap-4">
            accepted the application of <b>{history.user.name}</b>!
          </div>
        </ProjectHistoryWrapper>
      );
    case 7: //User rejected application of user
      return (
        <ProjectHistoryWrapper history={history}>
          <div className="w-fit text-center flex-center gap-4">
            rejected the application of <b>{history.user.name}</b>.
          </div>
        </ProjectHistoryWrapper>
      );
    case 10: //User left the project
      return (
        <ProjectHistoryWrapper history={history}>
          <div className="w-fit text-center flex-center gap-4">left this Project.</div>
        </ProjectHistoryWrapper>
      );
    case 11: //User removed user from the project
      return (
        <ProjectHistoryWrapper history={history}>
          <div className="w-fit text-center flex-center gap-4">
            removed <b>{history.user.name}</b> from this Project.
          </div>
        </ProjectHistoryWrapper>
      );
    default:
      return <></>;
  }
};

export default Membership;
