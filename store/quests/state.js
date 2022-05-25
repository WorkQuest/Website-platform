export default () => ({
  respondOnQuest: null,
  chatInfoInviteOnQuest: {},
  currentWorker: null,
  employeeList: [],
  employeeCount: null,
  allQuests: {
    count: 0,
    quests: [],
  },
  quest: null,
  infoDataMode: 0,
  starredQuests: {},
  responded: [],
  invited: [],
  currentStepCreateQuest: 1,
  currentStepEditQuest: 1,
  filters: null,
  selectedSpecializationsFilters: {
    query: '', selected: {}, visible: {}, selectedAll: {},
  },
  selectedPriceFilter: { from: null, to: null },
  availableQuests: {},
});
