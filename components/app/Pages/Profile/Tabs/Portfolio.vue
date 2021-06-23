<template>
  <div>
    <div class="portfolio__items">
      <div
        v-for="(item, i) in Portfolios"
        :key="i"
        class="portfolio__item"
      >
        <div class="portfolio__card">
          <div class="portfolio__body">
            <img
              class="portfolio__img"
              :src="item.imgUrl"
              :alt="item.name"
            >
          </div>
          <div class="portfolio__footer">
            <div class="portfolio__name">
              {{ item.name }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'PortfolioTab',
  computed: {
    ...mapGetters(['data/getPortfolios']),
    Portfolios() {
      return this.$store.getters['data/getPortfolios'];
    },
  },
};
</script>

<style lang="scss" scoped>

.portfolio {
  &__card {
    border-radius: 6px;
    cursor: pointer;
    position: relative;
  }
  &__items {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 20px;
  }
  &__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 6px;
  }
  &__name {
    @include text-simple;
    text-align: left;
    color: $white;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 18px;
    font-weight: 500;
  }
  &__footer {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: $black700;
    height: 71px;
    display: flex;
    align-items: center;
    padding-left: 20px;
    border-radius: 0 0 6px 6px;
  }
}

@include _575 {
  .portfolio__items {
    grid-template-columns: repeat(2, auto);
    margin: 0 20px 0 0;
  }
}

</style>
