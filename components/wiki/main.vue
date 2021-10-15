<template>
  <div class="main">
    <h5 class="main__header">
      {{ $t(`wiki.navigation.${currentTab.name}.${currentTab.name}`) }}
    </h5>
    <p class="main__subtitle">
      <span v-if="currentTab.subtitle">{{ $t(`wiki.navigation.${currentTab.name}.${currentTab.subtitle}`) }}</span>
    </p>
    <!-- {{ currentTab.cards }} -->
    <div
      v-for="(card, index) in currentTab.cards"
      :key="index"
      class="example"
    >
      <p class="example__header">
        {{ $t(`wiki.navigation.${currentTab.name}.cards.${card.title}.${card.title}`) }}
      </p>
      <p class="example__description">
        <span v-if="card.subtitle">{{ $t(`wiki.navigation.${currentTab.name}.cards.${card.title}.${card.subtitle}`) }}</span>
      </p>
      <div class="example__image">
        <img
          :src="require('@/assets/img/wiki/'+card.image+'.png')"
          :alt="card.title"
        >
      </div>
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
<style lang="scss" scoped>
.main {
  padding: 20px;
  background: $white;
  &__header {
    @include text-simple;
    @include normal-font-size;
    font-weight: 600;
    color: $black800;
    margin-bottom: 20px;
  }
  &__subtitle {
    @include text-simple;
    @include normal-font-size;
    color: $black700;
    margin-bottom: 15px;
  }
}
.example {
  &__header {
    @include text-simple;
    @include normal-font-size;
    font-weight: 500;
    color: $black800;
    margin-bottom: 10px;
  }
  &__description {
    @include text-simple;
    @include normal-font-size;
    color: $black600;
    margin-bottom: 10px;
  }
  &__image {
    margin-bottom: 20px;
    display: flex;
    justify-content: center;
    box-shadow: 0px 2px 10px rgba(56, 71, 79, 0.1);
  }
}
</style>
