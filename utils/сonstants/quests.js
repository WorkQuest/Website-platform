// eslint-disable-next-line import/prefer-default-export

export const EditQuestState = Object.freeze({
  EDITING: 1,
  RAISE_VIEWS: 2,
});

export const QuestStatuses = {
  Closed: -3,
  Dispute: -2,
  Rejected: -1,
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
