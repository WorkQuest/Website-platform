<template>
  <div
    class="main"
    data-selector="PAGE-RAISED-VIEWS"
  >
    <div
      v-click-outside="hide"
      class="main__body page"
    >
      <div class="page">
        <div class="page btn-container__left">
          <div class="btn-container__btn_back">
            <base-btn
              mode="back"
              selector="PREVIOUS-STEP"
              @click="goBack()"
            >
              {{ $t('meta.back') }}
              <template v-slot:left>
                <span class="icon-chevron_big_left" />
              </template>
            </base-btn>
          </div>
        </div>
        <div class="page page__raising">
          {{ $t('raising-views.raisingViews') }}
        </div>
        <div class="page period">
          <h3 class="period__choose">
            {{ $t('raising-views.choosePeriod') }}
          </h3>
          <div class="period__container">
            <div
              v-for="(item, i) in periodTabs"
              :key="i"
              :data-selector="`ACTION-BTN-SWITCH-PERIOD-${i}`"
              class="period__period"
              :class="{'period__period_active': period === item.number}"
              @click="switchPeriod(item, i)"
            >
              <h2
                class="period__title"
                :class="{'period__title_active': period === item.number}"
              >
                {{ item.title }}
              </h2>
            </div>
          </div>

          <div class="period level">
            <div class="level__title">
              {{ $t('raising-views.chooseLevel') }}
            </div>
            <div
              v-if="period"
              class="level__container"
            >
              <div
                v-for="(item, i) in periods(period)"
                :key="i"
                :ref="`item${i}`"
                :data-selector="`ACTION-BTN-SWITCH-PERIOD-LEVEL-${i}`"
                :class="cardShadow(item)"
                :style="cardBorder"
                class="level__card"
                @click="selectRadio(i,item)"
              >
                <div class="level__option">
                  <input
                    :ref="`radio${i}`"
                    name="higherLevel"
                    type="radio"
                    class="radio__input"
                    :value="item.cost"
                    @input="selectRadio(i)"
                  >
                </div>
                <div class="level card">
                  <div
                    class="card__level"
                    :class="cardStatus(item)"
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
                mode="outline"
                data-selector="ACTION-BTN-SKIP-AND-END"
                @click="goBack()"
              >
                {{ $t('meta.skipAndEnd') }}
              </base-btn>
            </div>
            <div class="btn-container__btn">
              <base-btn
                data-selector="ACTION-BTN-PAY"
                :disabled="ads.currentAdPrice === ''"
                @click="showPaymentModal"
              >
                {{ $t('meta.pay') }}
              </base-btn>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ClickOutside from 'vue-click-outside';
import modals from '~/store/modals/modals';
import { userRaiseViewPriceDay, userRaiseViewPriceWeek, userRaiseViewPriceMonth } from '~/utils/enums';

export default {
  name: 'RisedViews',
  directives: {
    ClickOutside,
  },
  data() {
    return {
      ads: {
        currentAdPrice: '',
      },
      bordered: false,
      currentBorder: '',
      period: 1,
    };
  },
  computed: {
    periodTabs() {
      return [
        {
          number: 1,
          title: this.$t('raising-views.forOneDay'),
        },
        {
          number: 2,
          title: this.$t('raising-views.forOneWeek'),
        },
        {
          number: 3,
          title: this.$t('raising-views.forOneMonth'),
        },
      ];
    },
    days() {
      return [
        {
          level: this.$t('quests.levels.1.title'),
          code: 1,
          desc: this.$t('quests.levels.1.desc'),
          cost: userRaiseViewPriceDay.PLUS,
        },
        {
          level: this.$t('quests.levels.2.title'),
          code: 2,
          desc: this.$t('quests.levels.2.desc'),
          cost: userRaiseViewPriceDay.GOLD,
        },
        {
          level: this.$t('quests.levels.3.title'),
          code: 3,
          desc: this.$t('quests.levels.3.desc'),
          cost: userRaiseViewPriceDay.SILVER,
        },
        {
          level: this.$t('quests.levels.4.title'),
          code: 4,
          desc: this.$t('quests.levels.4.desc'),
          cost: userRaiseViewPriceDay.BRONZE,
        },
      ];
    },
    weeks() {
      return [
        {
          level: this.$t('quests.levels.1.title'),
          code: 1,
          desc: this.$t('quests.levels.1.desc'),
          cost: userRaiseViewPriceWeek.PLUS,
        },
        {
          level: this.$t('quests.levels.2.title'),
          code: 2,
          desc: this.$t('quests.levels.2.desc'),
          cost: userRaiseViewPriceWeek.GOLD,
        },
        {
          level: this.$t('quests.levels.3.title'),
          code: 3,
          desc: this.$t('quests.levels.3.desc'),
          cost: userRaiseViewPriceWeek.SILVER,
        },
        {
          level: this.$t('quests.levels.4.title'),
          code: 4,
          desc: this.$t('quests.levels.4.desc'),
          cost: userRaiseViewPriceWeek.BRONZE,
        },
      ];
    },
    months() {
      return [
        {
          level: this.$t('quests.levels.1.title'),
          code: 1,
          desc: this.$t('quests.levels.1.desc'),
          cost: userRaiseViewPriceMonth.PLUS,
        },
        {
          level: this.$t('quests.levels.2.title'),
          code: 2,
          desc: this.$t('quests.levels.2.desc'),
          cost: userRaiseViewPriceMonth.GOLD,
        },
        {
          level: this.$t('quests.levels.3.title'),
          code: 3,
          desc: this.$t('quests.levels.3.desc'),
          cost: userRaiseViewPriceMonth.SILVER,
        },
        {
          level: this.$t('quests.levels.4.title'),
          code: 4,
          desc: this.$t('quests.levels.4.desc'),
          cost: userRaiseViewPriceMonth.BRONZE,
        },
      ];
    },
  },
  async mounted() {
    this.SetLoader(true);
    this.SetLoader(false);
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    cardStatus(item) {
      let style;
      if (item.code === 1) {
        style = 'level__card_gold';
      } if (item.code === 3) {
        style = 'card__level_reliable';
      } if (item.code === 4) {
        style = 'card__level_checked';
      }
      return style;
    },
    cardShadow(item) {
      let style;
      if (item.code === 1 || item.code === 2) {
        style = 'level__card-golden';
      } if (item.code === 3) {
        style = 'level__card-silver';
      } if (item.code === 4) {
        style = 'level__card-bronze';
      }
      return style;
    },
    cardBorder() {
      let style;
      if (this.currentBorder.code === 1) {
        const plus = this.$refs.item0;
        plus[0].style.boxShadow = '0 0 10px 2px rgba(246, 207, 0, 0.3)';
      } if (this.currentBorder.code === 2) {
        const gold = this.$refs.item1;
        gold[0].style.boxShadow = '0 0 10px 2px rgba(246, 207, 0, 0.3)';
      } if (this.currentBorder.code === 3) {
        const silver = this.$refs.item2;
        silver[0].style.boxShadow = '0 0 10px 2px rgba(187,192,199, 0.3)';
      } if (this.currentBorder.code === 4) {
        const bronze = this.$refs.item3;
        bronze[0].style.boxShadow = '0 0 10px 2px rgba(183,151,104, 0.3)';
      }
      return style;
    },
    periods(period) {
      let val;
      if (period === 1) {
        val = this.days;
      } if (period === 2) {
        val = this.weeks;
      } if (period === 3) {
        val = this.months;
      }
      return val;
    },
    selectRadio(idx, item) {
      this.currentBorder = item;
      this.cardBorder();
      const radio = this.$refs[`radio${idx}`];
      for (let i = 0; i < Object.keys(this.$refs[`radio${i}`]).length; i += 1) {
        if (radio[i].checked) {
          radio[i].checked = false;
          this.ads.currentAdPrice = '';
        } else if (!radio[i].checked) {
          radio[i].checked = true;
          this.ads.currentAdPrice = radio[i].value;
        }
      }
    },
    switchPeriod(item) {
      const hideElement = this.$refs[`item${this.currentBorder.code - 1}`];
      if (hideElement) {
        hideElement[0].style = '';
      }
      for (let idx = 0; idx < Object.keys(this.$refs).filter((el) => el.match(/radio/g)).length - 1; idx += 1) {
        const radio = this.$refs[`radio${idx}`];
        for (let i = 0; i < Object.keys(radio).length; i += 1) {
          radio[0].checked = false;
        }
        this.period = item.number;
        this.ads.currentAdPrice = '';
      }
    },
    async showPaymentModal() {
      this.ShowModal({
        key: modals.paymentOptions,
        step: 1,
      });
    },
    hide() {
      const hideElement = this.$refs[`item${this.currentBorder.code - 1}`];
      hideElement[0].style = '';
      for (let idx = 0; idx < Object.keys(this.$refs).filter((el) => el.match(/radio/g)).length - 1; idx += 1) {
        const radio = this.$refs[`radio${idx}`];
        for (let i = 0; i < Object.keys(radio).length; i += 1) {
          radio[0].checked = false;
        }
        this.ads.currentAdPrice = '';
      }
    },
  },
};
</script>

<style lang="scss" scoped>
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
.page {
  &__skills {
    width: 100%;
    .block {
      display: flex;
      grid-gap: 20px;
      justify-content: space-between;
      margin-top: 20px;
      &__skill-spec {
        width: 100%;
      }
      &__specialization {
        display: flex;
        align-items: flex-start;
        flex-direction: row;
        grid-gap: 20px;
      }
      &__skill {
        display: flex;
        flex-direction: row;
        align-items: center;
        flex-wrap: wrap;
        grid-gap: 10px;
        .skill {
          &__badge {
            background: rgba(0, 131, 199, 0.1);
            border-radius: 44px;
            color: $blue;
            white-space: nowrap;
            grid-gap: 8px;
            padding: 5px 10px 5px 10px;
            display: flex;
            text-align: center;
            &-skills {
              padding: 15px;
            }
          }
        }
      }
    }
  }
  &__spec {
    flex-direction: row;
    flex-wrap: wrap;
    display: flex;
    max-width: 1180px;
    width: 100%;
    justify-content: flex-start;
    //padding: 0 20px 0 0;
  }
  &__title {
    @include text-simple;
    margin: 30px 0 0 0;
  }
  &__raising {
    @include text-simple;
    font-weight: 500;
    font-size: 20px;
    color: $black800;
    margin: 0 0 20px 0;
  }
  &__page {
    font-weight: 500;
    font-size: 25px;
    color: $black800;
  }
  &__dd {
    min-width: 160px;
  }
  &__category {
    align-items: flex-start;
    margin: 20px 0 0 0;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 20px;
  }
  &__address {
    margin: 20px 0 0 0;
    display: grid;
    grid-gap: 20px;
  }
  &__textarea {
    @include text-simple;
    border-radius: 6px;
    padding: 11px 20px 11px 15px;
    height: 214px;
    width: 100%;
    border: 0;
    background-color: #F3F7FA;
    resize: none;
    &::placeholder {
      color: $black300;
    }
  }
}
.btn-container {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin: 20px 0 0 0;
  &__left {
    justify-content: flex-start;
    margin: 30px 0 0 0;
  }
  &__btn {
    width: 200px;
    margin: 0 10px 0 0;
    &_back {
      width: 50px;
    }
    &:last-child {
      margin: 0;
    }
  }
}
.level {
  &__title {
    @extend .period__title;
  }
  &__card {
    background: $white;
    border-radius: 6px;
    padding: 20px 0;
    display: grid;
    grid-template-columns: 1fr 15fr 1fr;
    margin: 20px 0 0 0;
    transition: 0.5s;
    cursor: pointer;
    &-golden{
      &:hover {
        box-shadow: 0 0 10px 2px rgba(246, 207, 0, 0.3);
      }
    }
    &-silver{
      &:hover {
        box-shadow: 0 0 10px 2px rgba(187,192,199, 0.3);
      }
    }
    &-bronze{
      &:hover {
        box-shadow: 0 0 10px 2px rgba(183,151,104, 0.3);
      }
    }
    &_gold {
      border: 1px solid #F7CF00;
    }
  }
  &__option {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.card {
  border: none;
  &__level {
    @include text-simple;
    font-weight: 500;
    font-size: 12px;
    color: $white;
    background: #F7CF00;
    border-radius: 3px;
    width: 120px;
    padding: 2px 5px;
    text-align: center;
    &_reliable {
      background: $grey200 !important;
    }
    &_checked {
      background: $brown !important;
    }
  }
  &__desc {
    @include text-simple;
    font-weight: 400;
    font-size: 16px;
    color: $black500;
    margin-top: 12px;
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
.period {
  &__choose {
    @extend .period__title;
    margin: 20px 0 0 0;
  }
  &__title {
    @include text-simple;
    font-weight: 400;
    font-size: 16px;
    color: $black800;
    &_active {
      color: $white;
    }
  }
  &__container {
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    max-width: 1180px;
    width: 100%;
    margin: 10px 0 20px 0;
  }
  &__period {
    color: $black800;
    background: $white;
    padding: 12px 88px;
    border-radius: 6px;
    transition: .5s;
    text-align: center;
    width: inherit;
    margin: 0 20px 0 0;
    &:last-child {
      margin: 0;
    }
    &:hover {
      cursor: pointer;
      box-shadow: 0 0 10px 2px rgba(34, 60, 80, 0.09);
    }
    &_active {
      background: $blue;
      color: $white;
      &:hover {
        cursor: pointer;
        box-shadow: 0 0 10px 2px rgba(34, 60, 80, 0.09);
      }
    }
    &:last-child {
      margin: 0;
    }
    &__title {
      color: $black800;
      font-weight: 500;
      font-size: 16px;
    }
  }
}
</style>
