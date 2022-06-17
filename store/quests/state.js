export default () => ({
  respondOnQuest: null,
  chatInfoInviteOnQuest: {},
  employeeList: [],
  employeeCount: null,
  allQuests: {
    count: 0,
    quests: [],
  },
  quest: null,
  infoDataMode: 0,
  responded: [],
  invited: [],
  currentStepEditQuest: 1,
  filters: null,
  selectedSpecializationsFilters: {
    query: '', selected: {}, visible: {}, selectedAll: {},
  },
  selectedPriceFilter: { from: null, to: null },
  availableQuests: {},
});
