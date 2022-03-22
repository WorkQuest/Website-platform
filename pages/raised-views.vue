<template>
  <div
    class="main"
    data-selector="PAGE-RAISED-VIEWS"
  >
    <div
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
              {{ $t('meta.btns.back') }}
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
                v-for="(item, i) in periods[period]"
                :key="i"
                :ref="`card${i}`"
                :data-selector="`ACTION-BTN-SWITCH-PERIOD-LEVEL-${i}`"
                :class="[cardBorder[item.code]]"
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
                    :class="cardStatus[item.code]"
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
import modals from '~/store/modals/modals';
import { userRaiseViewPriceDay, userRaiseViewPriceWeek, userRaiseViewPriceMonth } from '~/utils/enums';

export default {
  name: 'RisedViews',
  data() {
    return {
      ads: {
        currentAdPrice: '',
      },
      period: 1,
    };
  },
  computed: {
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
    periods() {
      const value = {
        1: this.days,
        2: this.weeks,
        3: this.months,
      };
      return value;
    },
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
    cardActive() {
      const active = {
        1: 'level__card_plus-active',
        2: 'level__card_gold-active',
        3: 'level__card_silver-active',
        4: 'level__card_bronze-active',
      };
      return active;
    },
    cardBorder() {
      const border = {
        1: 'level__card_plus',
        2: 'level__card_gold',
        3: 'level__card_silver',
        4: 'level__card_bronze',
      };
      return border;
    },
    cardStatus() {
      const style = {
        1: 'card__level_plus',
        2: 'card__level_gold',
        3: 'card__level_silver',
        4: 'card__level_bronze',
      };
      return style;
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
    selectRadio(idx, item) {
      for (let i = 0; i < Object.keys(this.$refs).filter((el) => el.match(/radio/g)).length; i += 1) {
        this.$refs[`radio${i}`][0].checked = false;
        this.ads.currentAdPrice = '';
        this.$refs[`card${i}`][0].classList.remove(this.cardActive[i + 1]);
      }
      this.$refs[`radio${idx}`][0].checked = true;
      this.ads.currentAdPrice = this.$refs[`radio${idx}`][0].value;
      this.$refs[`card${idx}`][0].classList.add(this.cardActive[item.code]);
    },
    switchPeriod(item) {
      for (let idx = 0; idx < Object.keys(this.$refs).filter((el) => el.match(/radio/g)).length - 1; idx += 1) {
        const radio = this.$refs[`radio${idx}`];
        for (let i = 0; i < Object.keys(radio).length; i += 1) {
          this.$refs[`card${i}`][0].classList.remove(this.cardActive[i + 1]);
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
    border: 1px solid transparent;
    grid-template-columns: 1fr 15fr 1fr;
    margin: 20px 0 0 0;
    transition: 0.3s;
    cursor: pointer;
    &_plus{
      &:hover {
        border: 1px solid $yellow100;
      }
      &-active{
        border: 1px solid $yellow100;
      }
    }
    &_gold {
      &:hover {
        border: 1px solid $yellow100;
      }
      &-active{
        border: 1px solid $yellow100;
      }
    }
    &_silver{
      &:hover {
        border: 1px solid $grey200;
      }
      &-active{
        border: 1px solid $grey200;
      }
    }
    &_bronze{
      &:hover {
        border: 1px solid $brown;
      }
      &-active{
        border: 1px solid $brown;
      }
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
    border-radius: 3px;
    width: 120px;
    padding: 2px 5px;
    text-align: center;
    &_plus {
      background: $yellow100;
    }
    &_gold{
      background: $yellow100;
    }
    &_silver {
      background: $grey200;
    }
    &_bronze {
      background: $brown;
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
.icon-chevron_big_left{
  content: "\ea4d";
  color: $black800;
  font-size: 25px;
}

</style>
