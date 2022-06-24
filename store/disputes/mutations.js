import Vue from 'vue';

export default {
  setDispute(state, data) {
    state.dispute = data;
  },
  resetDisputeCard(state) {
    state.dispute = {
      id: '',
      questId: '',
      openDisputeUserId: '',
      opponentUserId: '',
      assignedAdminId: '',
      disputeNumber: 0,
      status: 0,
      reason: '',
      openOnQuestStatus: 0,
      problemDescription: '',
      decisionDescription: '',
      openDisputeUser: {
        id: '',
        avatarId: '',
        firstName: '',
        lastName: '',
        avatar: { id: '', url: '', contentType: '' },
        ratingStatistic: {
          id: '',
          userId: '',
          reviewCount: 0,
          averageMark: 0,
          status: '',
        },
      },
      opponentUser: {
        id: '',
        avatarId: '',
        firstName: '',
        lastName: '',
        avatar: { id: '', url: '', contentType: '' },
        ratingStatistic: {
          id: '',
          userId: '',
          reviewCount: 0,
          averageMark: 0,
          status: '',
        },
      },
      assignedAdmin: {
        id: '',
        email: '',
        firstName: '',
        lastName: '',
        isActive: false,
        adminRole: '',
      },
      quest: {
        id: '',
        userId: '',
        assignedWorkerId: '',
        category: '',
        status: 0,
        workplace: '',
        employment: '',
        priority: 0,
        location: { longitude: 0, latitude: 0 },
        locationPlaceName: '',
        title: '',
        description: '',
        price: '',
        adType: 0,
        user: {
          id: '',
          avatarId: '',
          firstName: '',
          lastName: '',
          avatar: { id: '', url: '', contentType: '' },
          ratingStatistic: {
            id: '',
            userId: '',
            reviewCount: 0,
            averageMark: 0,
            status: '',
          },
        },
        assignedWorker: {
          id: '',
          avatarId: '',
          firstName: '',
          lastName: '',
          avatar: { id: '', url: '', contentType: '' },
          ratingStatistic: {
            id: '',
            userId: '',
            reviewCount: 0,
            averageMark: 0,
            status: '',
          },
        },
        medias: [{ id: '', url: '', contentType: '' }],
        questChat: {
          id: '',
          employerId: '',
          workerId: '',
          questId: '',
          responseId: '',
          chatId: '',
          status: '0',
        },
        questSpecializations: [{ path: '' }],
        startedAt: '',
        createdAt: '',
      },
      resolveAt: '',
      createdAt: '',
    };
  },
  setUserDisputes(state, data) {
    state.userDisputes = data;
  },
  setMarkInDisputes(state, payload) {
    Vue.set(state.userDisputes.disputes, payload.indexDispute, payload.dispute);
  },
};
