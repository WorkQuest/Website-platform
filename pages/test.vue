<template>
  <div style="color: #c0c0c0; padding: 150px">
    <raise-views-panel
      :period-tabs="periodTabs"
      :level-tabs="levelTabs"
    />
  </div>
</template>

<script>
export default {
  name: 'TestPage',
  computed: {
    periodTabs() {
      return [
        this.$t('raising-views.forOneDay'),
        this.$t('raising-views.forOneWeek'),
        this.$t('raising-views.forOneMonth'),
      ];
    },
    // TODO: в зависимости от периода передавать другие значения price
    levelTabs() {
      return [
        {
          title: this.$t('quests.levels.1.title'),
          description: this.$t('quests.levels.1.desc'),
          color: 'gold',
          price: 20,
        },
        {
          title: this.$t('quests.levels.2.title'),
          description: this.$t('quests.levels.2.desc'),
          color: 'gold',
          price: 20,
        },
        {
          title: this.$t('quests.levels.3.title'),
          description: this.$t('quests.levels.3.desc'),
          color: 'silver',
          price: 20,
        },
        {
          title: this.$t('quests.levels.4.title'),
          description: this.$t('quests.levels.4.desc'),
          color: 'bronze',
          price: 20,
        },

      ];
    },
  },
};
</script>

<style scoped>

</style>
