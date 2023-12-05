const getInvitationStatus = (status: number): string => {
  switch (status) {
    case -1:
      return 'Rejected';
    case 0:
      return 'Waiting';
    case 1:
      return 'Accepted';
    default:
      return '';
  }
};

export default getInvitationStatus;
