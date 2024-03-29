// eslint-disable-next-line import/prefer-default-export

export const NotificationAction = {
  OPENED_DISPUTE: 'OpenDispute',
  QUEST_STATUS_UPDATED: 'QuestStatusUpdated',
  QUEST_STARTED: 'questStarted',
  WORKER_REJECTED_QUEST: 'workerRejectedQuest',
  WORKER_ACCEPTED_QUEST: 'workerAcceptedQuest',
  WORKER_COMPLETED_QUEST: 'workerCompletedQuest',
  EMPLOYER_ACCEPTED_COMPLETED_QUEST: 'employerAcceptedCompletedQuest',
  EMPLOYER_REJECTED_COMPLETED_QUEST: 'employerRejectedCompletedQuest',
  WORKER_RESPONDED_TO_QUEST: 'workerRespondedToQuest',
  EMPLOYER_INVITED_WORKER_TO_QUEST: 'employerInvitedWorkerToQuest',
  WORKER_ACCEPTED_INVITATION_TO_QUEST: 'workerAcceptedInvitationToQuest',
  WORKER_REJECTED_INVITATION_TO_QUEST: 'workerRejectedInvitationToQuest',
  EMPLOYER_REJECTED_WORKERS_RESPONSE: 'employerRejectedWorkersResponse',
  WAIT_WORKER: 'waitWorker',
  USER_LEFT_REVIEW_ABOUT_QUEST: 'userLeftReviewAboutQuest',
  DISPUTE_DECISION: 'DisputeDecision',
  DISPUTE_DECISION_REWORK: 'disputeDecision',
  DISPUTE_DECISION_ON_CONTRACT: 'DisputeDecisionOnContract',
  QUEST_EDITED: 'questEdited',
  QUEST_END_SOON: 'questEndSoon',
  COMMENT_LIKED: 'commentLiked',
  NEW_COMMENT_IN_DISCUSSION: 'newCommentInDiscussion',
  NEW_DISCUSSION_LIKE: 'newDiscussionLike',
  QUEST_EDITED_ON_CONTRACT: 'QuestEditedOnContract',
  UPDATE_RATING_STATISTIC: 'updateRatingStatistic',
  NEW_QUEST_FOR_SPECIALIZATION: 'newQuestForSpecialization',
  PAID_REFERRAL: 'PaidReferral',
  REPORT_DECIDED: 'ReportDecided',
  REPORT_SUBMITTED: 'ReportSubmitted',
  REPORT_REJECTED: 'ReportRejected',

  // notifications after registration
  KYC: 'EnableSumsubKYC',
  TWOFA: 'EnableDoubleAuthentication',
  WIKI: 'WorkQuestWikiPage',
  GET_REWARD: 'InviteFriendsReward',
  PROFILE_FILLED: 'FillProfileDataOnSettings',
};

export const LocalNotificationAction = {
  RATE_THE_QUEST: 'quest',
  QUEST_DRAFT: 'questDraft',
  QUESTS_SPECS: 'questsSpecs',
  WALLET_UPDATE: 'walletUpdate',
};

export const notificationsQuestsActions = Object.freeze([
  NotificationAction.QUEST_STARTED,
  NotificationAction.WORKER_REJECTED_QUEST,
  NotificationAction.WORKER_ACCEPTED_QUEST,
  NotificationAction.WORKER_COMPLETED_QUEST,
  NotificationAction.EMPLOYER_ACCEPTED_COMPLETED_QUEST,
  NotificationAction.EMPLOYER_REJECTED_COMPLETED_QUEST,
  NotificationAction.WORKER_RESPONDED_TO_QUEST,
  NotificationAction.EMPLOYER_INVITED_WORKER_TO_QUEST,
  NotificationAction.WORKER_ACCEPTED_INVITATION_TO_QUEST,
  NotificationAction.WORKER_REJECTED_INVITATION_TO_QUEST,
  NotificationAction.EMPLOYER_REJECTED_WORKERS_RESPONSE,
  NotificationAction.WAIT_WORKER,
  NotificationAction.QUEST_EDITED,
  NotificationAction.QUEST_EDITED_ON_CONTRACT,
  NotificationAction.QUEST_END_SOON,
]);

// Setup sender as assigned quest employer
export const notificationCommonFilterActions = Object.freeze([
  NotificationAction.EMPLOYER_INVITED_WORKER_TO_QUEST,
  NotificationAction.WORKER_ACCEPTED_INVITATION_TO_QUEST,
  NotificationAction.WORKER_REJECTED_INVITATION_TO_QUEST,
  NotificationAction.WORKER_RESPONDED_TO_QUEST,
  NotificationAction.DISPUTE_DECISION,
  NotificationAction.EMPLOYER_REJECTED_WORKERS_RESPONSE,
]);

// Setup sender as assigned quest worker
export const notificationEmployerFilterActions = Object.freeze([
  NotificationAction.WORKER_RESPONDED_TO_QUEST,
  NotificationAction.WORKER_ACCEPTED_QUEST,
  NotificationAction.WORKER_COMPLETED_QUEST,
  NotificationAction.WORKER_REJECTED_QUEST,
]);

// Setup sender as notification.user
export const notificationCommonFilterAction2 = Object.freeze([
  NotificationAction.QUEST_EDITED,
  NotificationAction.NEW_DISCUSSION_LIKE,
  NotificationAction.NEW_COMMENT_IN_DISCUSSION,
  NotificationAction.EMPLOYER_ACCEPTED_COMPLETED_QUEST,
  NotificationAction.WAIT_WORKER,
]);

export const QuestNotificationByStatus = Object.freeze({
  [-3]: 'questClosed',
  [-2]: 'questDisputeStarted',
  [-1]: 'questBlockedByAdmin',
  1: 'QuestStatusUpdated',
  2: 'questInvitationSentToWorker',
  3: 'questWorkInProgress',
  4: 'questWorkSentForReview',
  5: 'questCompleted',
});
