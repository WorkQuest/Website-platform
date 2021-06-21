<template>
  <div>
    <div class="add-btn__container">
      <base-btn
        @click="showAddCaseModal()"
      >
        <!--        TODO: Добавить в локализацию-->
        Add Case
        <template v-slot:right>
          <span class="icon-plus" />
        </template>
      </base-btn>
    </div>
    <div class="portfolio__items">
      <div
        v-for="(item, i) in portfolios"
        :key="i"
        class="portfolio__item"
      >
        <div class="portfolio__card">
          <div class="portfolio__body">
            <img
              class="portfolio__img"
              src="~/assets/img/temp/photo.jpg"
              alt=""
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
import modals from '~/store/modals/modals';

export default {
  name: 'PortfolioTab',
  data() {
    return {
      portfolios: [
        {
          name: 'Lorem ipsum dolor sit amet',
          imgUrl: '',
        },
        {
          name: 'Lorem ipsum dolor sit amet',
          imgUrl: '',
        },
        {
          name: 'Lorem ipsum dolor sit amet',
          imgUrl: '',
        },
        {
          name: 'Lorem ipsum dolor sit amet',
          imgUrl: '',
        },
      ],
    };
  },
  methods: {
    showAddCaseModal() {
      this.ShowModal({
        key: modals.addCase,
      });
    },
  },
};
</script>

<style lang="scss" scoped>

.icon {
  font-size: 20px;
  cursor: pointer;
  &-plus:before {
    @extend .icon;
    content: "\e9a8";
    color: $white;
    font-size: 16px;
  }
}

.add-btn {
  &__container {
    width: 154px;
    margin: 20px 0 20px 0;
  }
}

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
