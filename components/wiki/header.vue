<template>
  <div class="main">
    <h5 class="main__header">
      <!-- {{ $t(`wiki.navigation.${currentTab.name}`) }} -->
      <!-- {{ currentTab }} -->
      Header menu
    </h5>
    <p class="main__subtitle">
      There are two types of header: for employer and for employee.
    </p>
    <div class="example">
      <p class="example__header">
        Quests
      </p>
      <p class="example__description">
        General list of job offers published on the platform.
      </p>
      <img
        src="@/assets/img/wiki/header2.png"
        alt="header2"
      >
    </div>
  </div>
</template>
<script>
export default {
  props: {
    currentTab: {
      type: Object,
      default() {
        return { name: 'Object' };
      },
    },
  },
};
</script>
