<template>
  <div class="main">
    <div class="main__body">
      <div class="btn-container__left">
        <div class="btn-container__btn_back">
          <base-btn
            :mode="'back'"
            @click="goBack()"
          >
            {{ $t('meta.back') }}
            <template v-slot:left>
              <span class="icon-chevron_big_left" />
            </template>
          </base-btn>
        </div>
      </div>
      <div class="page__title">
        {{ $t('raising-views.raisingViews') }}
      </div>
      <div class="choose-period">
        <h3 class="choose-period__title">
          {{ $t('raising-views.choosePeriod') }}
        </h3>
        <div class="choose-period__container">
          <div
            class="choose-period__period"
            :class="{'choose-period__period_active': period === 1}"
            @click="period = 1"
          >
            <h2
              class="choose-period__title"
              :class="{'choose-period__title_active': period === 1}"
            >
              {{ $t('raising-views.forOneDay') }}
            </h2>
            <div class="choose-period__desc">
              {{ desc }}
            </div>
          </div>

          <div
            class="choose-period__period"
            :class="{'choose-period__period_active': period === 2}"
            @click="period = 2"
          >
            <h2
              class="choose-period__title"
              :class="{'choose-period__title_active': period === 2}"
            >
              {{ $t('raising-views.forOneWeek') }}
            </h2>
            <div class="choose-period__desc">
              {{ desc }}
            </div>
          </div>

          <div
            class="choose-period__period"
            :class="{'choose-period__period_active': period === 3}"
            @click="period = 3"
          >
            <h3
              class="choose-period__title"
              :class="{'choose-period__title_active': period === 3}"
            >
              {{ $t('raising-views.forOneMonth') }}
            </h3>
            <div class="choose-period__desc">
              {{ desc }}
            </div>
          </div>
        </div>
        <div class="choose-level">
          <div class="choose-level__title">
            {{ $t('raising-views.chooseLevel') }}
          </div>
          <div
            v-if="period === 1"
            class="choose-level__container"
          >
            <div
              v-for="(item, i) in levels1Day"
              :key="i"
              class="choose-level__card"
            >
              <div class="choose-level__option">
                <input
                  name="higherLevel"
                  type="radio"
                  class="radio__input"
                  :value="level"
                  checked
                >
              </div>
              <div>
                <div
                  class="card__level"
                  :class="[
                    {'card__level_reliable': item.code === 2},
                    {'card__level_checked': item.code === 3}
                  ]"
                >
                  {{ item.level }}
                </div>
                <div class="card__desc">
                  {{ item.desc }}
                </div>
              </div>
              <div class="cost__container">
                <div class="card__cost">
                  {{ item.cost }}$
                </div>
              </div>
            </div>
          </div>
          <div
            v-if="period === 2"
            class="choose-level__container"
          >
            <div
              v-for="(item, i) in levels1Week"
              :key="i"
              class="choose-level__card"
            >
              <div class="choose-level__option">
                <input
                  name="higherLevel"
                  type="radio"
                  class="radio__input"
                  :value="level"
                  checked
                >
              </div>
              <div>
                <div
                  class="card__level"
                  :class="[
                    {'card__level_reliable': item.code === 2},
                    {'card__level_checked': item.code === 3}
                  ]"
                >
                  {{ item.level }}
                </div>
                <div class="card__desc">
                  {{ item.desc }}
                </div>
              </div>
              <div class="cost__container">
                <div class="card__cost">
                  {{ item.cost }}$
                </div>
              </div>
            </div>
          </div>
          <div
            v-if="period === 3"
            class="choose-level__container"
          >
            <div
              v-for="(item, i) in levels1Month"
              :key="i"
              class="choose-level__card"
            >
              <div class="choose-level__option">
                <input
                  name="higherLevel"
                  type="radio"
                  class="radio__input"
                  :value="level"
                  checked
                >
              </div>
              <div>
                <div
                  class="card__level"
                  :class="[
                    {'card__level_reliable': item.code === 2},
                    {'card__level_checked': item.code === 3}
                  ]"
                >
                  {{ item.level }}
                </div>
                <div class="card__desc">
                  {{ item.desc }}
                </div>
              </div>
              <div class="cost__container">
                <div class="card__cost">
                  {{ item.cost }}$
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="btn-container">
          <div class="btn-container__btn">
            <base-btn
              :mode="'outline'"
              @click="period = 1"
            >
              {{ $t('meta.cancel') }}
            </base-btn>
          </div>
          <div class="btn-container__btn">
            <base-btn @click="showPaymentModal()">
              {{ $t('meta.continue') }}
            </base-btn>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import modals from '~/store/modals/modals';

export default {
  name: 'RaisingViews',
  data() {
    return {
      period: 1,
      desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      levels1Day: [
        {
          level: 'HIGHER LEVEL',
          code: 1,
          desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Volutpat eleifend accumsan neque, sollicitudin ut id amet, sodales.',
          cost: '10',
        },
        {
          level: 'RELIABLE EMP.',
          code: 2,
          desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Volutpat eleifend accumsan neque, sollicitudin ut id amet, sodales.',
          cost: '10',
        },
        {
          level: 'VERIFIED EMP.',
          code: 3,
          desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Volutpat eleifend accumsan neque, sollicitudin ut id amet, sodales.',
          cost: '10',
        },
      ],
      levels1Week: [
        {
          level: 'HIGHER LEVEL',
          code: 1,
          desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Volutpat eleifend accumsan neque, sollicitudin ut id amet, sodales.',
          cost: '40',
        },
        {
          level: 'RELIABLE EMP.',
          code: 2,
          desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Volutpat eleifend accumsan neque, sollicitudin ut id amet, sodales.',
          cost: '40',
        },
        {
          level: 'VERIFIED EMP.',
          code: 3,
          desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Volutpat eleifend accumsan neque, sollicitudin ut id amet, sodales.',
          cost: '40',
        },
      ],
      levels1Month: [
        {
          level: 'HIGHER LEVEL',
          code: 1,
          desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Volutpat eleifend accumsan neque, sollicitudin ut id amet, sodales.',
          cost: '70',
        },
        {
          level: 'RELIABLE EMP.',
          code: 2,
          desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Volutpat eleifend accumsan neque, sollicitudin ut id amet, sodales.',
          cost: '70',
        },
        {
          level: 'VERIFIED EMP.',
          code: 3,
          desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Volutpat eleifend accumsan neque, sollicitudin ut id amet, sodales.',
          cost: '70',
        },
      ],
    };
  },
  async mounted() {
    this.SetLoader(true);
    this.SetLoader(false);
  },
  methods: {
    goBack() {
      this.$router.back();
    },
    showPaymentModal() {
      this.ShowModal({
        key: modals.paymentOptions,
        step: 1,
      });
    },
  },
};
</script>

<style lang="scss" scoped>

.btn-container {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin: 20px 0 0 0;
  &__left {
    justify-content: flex-start;
    margin: 35px 0 0 0;
  }
  &__btn {
    width: 200px;
    margin: 0 10px 0 0;
    &_back {
      width: 50px;
      margin: 0 0 0 20px;
    }
    &:last-child {
      margin: 0;
    }
  }
}

.cost__container {
  display: flex;
  align-self: center;
}

.card {
  &__level {
    @include text-simple;
    font-weight: 500;
    font-size: 12px;
    color: $white;
    background: #F7CF00;
    border-radius: 3px;
    width: 100px;
    padding: 2px 5px;
    &_reliable {
      background: #BBC0C7;
    }
    &_checked {
      background: #B79768;
      width: 120px;
    }
  }
  &__desc {
    @include text-simple;
    font-weight: 400;
    font-size: 16px;
    color: $black500;
  }
  &__cost {
    @include text-simple;
    color: $black800;
    font-weight: 500;
    font-size: 20px;
    display: flex;
    justify-content: center;
  }
}

.choose-level {
  &__title {
    @extend .choose-period__title;
  }
  &__container {}
  :first-child {
    margin: 5px 0 0 0;
  }
  &__card {
    background: $white;
    border-radius: 6px;
    padding: 20px 0;
    display: grid;
    grid-template-columns: 1fr 15fr 1fr;
    margin: 20px 0 0 0;
  }
  &__option {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.radio {
  &__input {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    border-radius: 50%;
    width: 25px;
    height: 25px;
    border: 1px solid $blue;
    cursor: pointer;
    &:checked {
      background: radial-gradient($blue 50%, rgba(255, 0, 0, 0) 55%);
    }
  }
}

.choose-period {
  &__title {
    @include text-simple;
    font-weight: 400;
    font-size: 16px;
    color: $black800;
    margin: 0 0 10px 0;
    &_active {
      color: $white;
    }
  }
  &__container {
    display: flex;
    flex-direction: row;
    max-width: 1180px;
    width: 100%;
    margin: 0 0 10px 0;
  }
  &__period {
    color: $black800;
    background: $white;
    padding: 20px;
    margin: 0 20px 0 0;
    border-radius: 6px;
    transition: .5s;
    &:hover {
      cursor: pointer;
    }
    &_active {
      background: $blue;
      color: $white;
    }
    &:last-child {
      margin: 0;
    }
    &__title {
      color: $black800;
      font-weight: 500;
      font-size: 16px;
    }
    &__desc {
      @include text-simple;
      font-weight: 400;
      font-size: 16px;
      color: $black500;
    }
  }
}

.page {
  &__title {
    @include text-simple;
    font-weight: 500;
    font-size: 20px;
    color: $black800;
    margin: 0 0 20px 0;
  }
}

.main {
  @include main;
  &-white {
    @include main;
    background: $white;
    background: #FFFFFF;
    margin: 0 0 20px 0;
    border-radius: 6px;
    justify-content: center;
  }
  &__body {
    max-width: 1180px;
    width: 100%;
    height: 100%;
  }
}

</style>
