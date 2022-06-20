// eslint-disable-next-line import/prefer-default-export

export const QuestsResponseStatus = Object.freeze({
  Rejected: -1,
  Open: 0,
  Accepted: 1,
  Closed: 2,
});

export const EditQuestState = Object.freeze({
  EDITING: 1,
  RAISE_VIEWS: 2,
});

export const QuestStatuses = {
  Closed: -3, // Employer closed quest on contract
  Dispute: -2,
  Rejected: -1, // Blocked by admin
  Blocked: -1, // Blocked by admin
  Pending: 0,
  Created: 1, // Waiting worker to start quest
  WaitWorkerOnAssign: 2, // Waiting for worker accept assign to quest
  WaitWorker: 3, // Work in progress
  WaitEmployerConfirm: 4, // Accepting or decline worker job
  Done: 5,

  ADChat: 9,
  Responded: 10,
  Invited: 11,
};

export const QuestMethods = Object.freeze({
  Arbitration: 'arbitration',
  // Employer
  EditJob: 'editJob',
  CancelJob: 'cancelJob',
  AssignJob: 'assignJob',
  AcceptJobResult: 'acceptJobResult',
  // Worker
  AcceptJob: 'acceptJob',
  VerificationJob: 'verificationJob',
});

export const PaidTariff = Object.freeze({
  GoldPlus: 'GoldPlus',
  Gold: 'Gold',
  Silver: 'Silver',
  Bronze: 'Bronze',
});
