<template>
  <div class="main">
    <h5 class="main__header">
      {{ tab.title }}
    </h5>
    <p class="main__subtitle">
      <span v-if="tab.subtitle">{{ tab.subtitle }}</span>
    </p>
    <div
      v-for="(card, key) in cards"
      :key="key"
      class="example"
    >
      <p class="example__header">
        {{ card.title }}
      </p>
      <p class="example__description">
        <span v-if="card.subtitle">{{ card.subtitle }}</span>
      </p>
      <div class="example__image-wrapper">
        <img
          v-if="currentTab === 'instruments'"
          :class="{example__mobile: currentTab === 'instruments'}"
          :src="require('@/assets/img/wiki/'+currentTab+'-'+key+'-small.png')"
          :alt="card.title"
        >
        <img
          class="example__image"
          :class="{example__desktop: currentTab === 'instruments'}"
          :src="require('@/assets/img/wiki/'+currentTab+'-'+key+'.png')"
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
      type: String,
      default: '',
    },
  },
  computed: {
    tab() {
      return this.$t(`wiki.navigation.${this.currentTab}`);
    },
    cards() {
      return this.$t(`wiki.navigation.${this.currentTab}.cards`);
    },
  },
};
</script>
<style lang="scss" scoped>
.main {
  padding: 20px 20px 0 20px;
  background: $white;
  border-radius: 6px;
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
     box-shadow: 0px 2px 10px rgba(56, 71, 79, 0.1);
    &-wrapper {
      margin-bottom: 20px;
      display: flex;
      justify-content: center;
    }
  }
  &__desktop {
    display: block;
  }
  &__mobile {
    display: none;
  }
}
@include _767 {
  .example {
    &__desktop {
      display: none;
    }
    &__mobile {
      display: block;
      box-shadow: 0px 2px 10px rgba(56, 71, 79, 0.1);
    }
  }
}
</style>
