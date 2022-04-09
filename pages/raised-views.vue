<template>
  <div
    class="main"
    data-selector="PAGE-RAISED-VIEWS"
  >
    <div class="main__body page">
      <div class="page">
        <div class="page__btn-container btn-container__left">
          <div class="btn-container__btn_back">
            <base-btn
              mode="back"
              data-selector="PREVIOUS-STEP"
              @click="goBack()"
            >
              {{ $t('meta.btns.back') }}
              <template v-slot:left>
                <span class="icon-chevron_big_left" />
              </template>
            </base-btn>
          </div>
        </div>
        <div class="page__raising">
          {{ $t('raising-views.raisingViews') }}
        </div>
        <div class="page__period period">
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
              @click="switchPeriod(item)"
            >
              <h2
                class="period__title"
                :class="{'period__title_active': period === item.number}"
              >
                {{ item.title }}
              </h2>
            </div>
          </div>

          <div class="period__level level">
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
                    @input="selectRadio(i,item)"
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
          <div class="period__btn-container btn-container">
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
import { mapGetters } from 'vuex';
import modals from '~/store/modals/modals';
import { Path } from '~/utils/enums';

export default {
  name: 'RaisedViews',
  async asyncData({ store }) {
    const { result } = await store.dispatch('user/getRaiseViewPrice', { type: 'usersTariff' });
    return { prices: result };
  },
  data() {
    return {
      ads: {
        currentAdPrice: '',
      },
      period: 1,
      prices: '',
      type: '',
      currentTariff: '',
    };
  },
  computed: {
    ...mapGetters({
      balance: 'wallet/getBalanceData',
    }),
    days() {
      return [
        {
          level: this.$t('quests.levels.1.title'),
          code: 1,
          desc: this.$t('quests.levels.1.desc'),
          cost: this.prices['4']['1'],
          tariff: '4',
        },
        {
          level: this.$t('quests.levels.2.title'),
          code: 2,
          desc: this.$t('quests.levels.2.desc'),
          cost: this.prices['3']['1'],
          tariff: '3',
        },
        {
          level: this.$t('quests.levels.3.title'),
          code: 3,
          desc: this.$t('quests.levels.3.desc'),
          cost: this.prices['2']['1'],
          tariff: '2',
        },
        {
          level: this.$t('quests.levels.4.title'),
          code: 4,
          desc: this.$t('quests.levels.4.desc'),
          cost: this.prices['1']['1'],
          tariff: '1',
        },
      ];
    },
    weeks() {
      return [
        {
          level: this.$t('quests.levels.1.title'),
          code: 1,
          desc: this.$t('quests.levels.1.desc'),
          cost: this.prices['4']['7'],
          tariff: '4',
        },
        {
          level: this.$t('quests.levels.2.title'),
          code: 2,
          desc: this.$t('quests.levels.2.desc'),
          cost: this.prices['3']['7'],
          tariff: '3',
        },
        {
          level: this.$t('quests.levels.3.title'),
          code: 3,
          desc: this.$t('quests.levels.3.desc'),
          cost: this.prices['2']['7'],
          tariff: '2',
        },
        {
          level: this.$t('quests.levels.4.title'),
          code: 4,
          desc: this.$t('quests.levels.4.desc'),
          cost: this.prices['1']['7'],
          tariff: '1',
        },
      ];
    },
    months() {
      return [
        {
          level: this.$t('quests.levels.1.title'),
          code: 1,
          desc: this.$t('quests.levels.1.desc'),
          cost: this.prices['4']['30'],
          tariff: '4',
        },
        {
          level: this.$t('quests.levels.2.title'),
          code: 2,
          desc: this.$t('quests.levels.2.desc'),
          cost: this.prices['3']['30'],
          tariff: '3',
        },
        {
          level: this.$t('quests.levels.3.title'),
          code: 3,
          desc: this.$t('quests.levels.3.desc'),
          cost: this.prices['2']['30'],
          tariff: '2',
        },
        {
          level: this.$t('quests.levels.4.title'),
          code: 4,
          desc: this.$t('quests.levels.4.desc'),
          cost: this.prices['1']['30'],
          tariff: '1',
        },
      ];
    },
    periods() {
      return {
        1: this.days,
        2: this.weeks,
        3: this.months,
      };
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
      return {
        1: 'level__card_plus-active',
        2: 'level__card_gold-active',
        3: 'level__card_silver-active',
        4: 'level__card_bronze-active',
      };
    },
    cardBorder() {
      return {
        1: 'level__card_plus',
        2: 'level__card_gold',
        3: 'level__card_silver',
        4: 'level__card_bronze',
      };
    },
    cardStatus() {
      return {
        1: 'card__level_plus',
        2: 'card__level_gold',
        3: 'card__level_silver',
        4: 'card__level_bronze',
      };
    },
    duration() {
      return {
        1: 1,
        2: 7,
        3: 30,
      };
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
        this.type = '';
        this.currentTariff = '';
        this.$refs[`card${i}`][0].classList.remove(this.cardActive[i + 1]);
      }
      this.$refs[`radio${idx}`][0].checked = true;
      this.ads.currentAdPrice = this.$refs[`radio${idx}`][0].value;
      this.type = item.code - 1;
      this.currentTariff = item.tariff;
      this.$refs[`card${idx}`][0].classList.add(this.cardActive[item.code]);
    },
    switchPeriod(item) {
      this.period = item.number;
      for (let i = 0; i < Object.keys(this.$refs).filter((el) => el.match(/radio/g)).length; i += 1) {
        if (this.$refs[`radio${i}`][0].checked) {
          this.ads.currentAdPrice = this.periods[this.period][i].cost;
        }
      }
    },
    async showPaymentModal() {
      if (!(this.balance?.WUSD?.balance && +this.balance.WUSD.balance)) {
        this.ShowModal({
          key: modals.status,
          img: require('~/assets/img/ui/error.svg'),
          title: this.$t('modals.errors.error'),
          subtitle: this.$t('staking.notEnoughFunds'),
        });
        return;
      }

      this.ShowModal({
        key: modals.paymentOptions,
        step: 1,
        submit: async () => {
          this.SetLoader(true);
          const period = this.duration[this.period];
          const cost = this.ads.currentAdPrice;
          const tariff = this.currentTariff;
          const { ok } = await this.$store.dispatch('user/promoteUserOnContract', {
            tariff,
            period,
            cost,
          });
          if (ok) {
            // TODO delete, waiting when backend will be catch all this events
            await this.$store.dispatch('user/payUserRaisedView', {
              duration: period,
              type: this.type,
            });
          }
          this.ShowModal({
            key: modals.status,
            img: ok ? require('~/assets/img/ui/questAgreed.svg') : require('~/assets/img/ui/error.svg'),
            title: ok ? this.$t('modals.yourLevelHasBeenRaised') : this.$t('modals.errors.error'),
            callback: ok
              ? () => {
                if (window.history.length > 2) this.$router.go(-1);
                else this.$router.push(Path.PROFILE);

                this.$store.dispatch('user/getUserData');
              } : '',
          });
          this.SetLoader(false);
        },
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
  &__raising {
    @include text-simple;
    font-weight: 500;
    font-size: 20px;
    color: $black800;
    margin: 0 0 20px 0;
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
      width: 92px;
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

    &_plus {
      &:hover {
        border: 1px solid $yellow100;
      }

      &-active {
        border: 1px solid $yellow100;
      }
    }

    &_gold {
      &:hover {
        border: 1px solid $yellow100;
      }

      &-active {
        border: 1px solid $yellow100;
      }
    }

    &_silver {
      &:hover {
        border: 1px solid $grey200;
      }

      &-active {
        border: 1px solid $grey200;
      }
    }

    &_bronze {
      &:hover {
        border: 1px solid $brown;
      }

      &-active {
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

    &_gold {
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
    padding: 12px 0;
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

.icon-chevron_big_left {
  color: $black800;
  font-size: 25px;
}

@include _1199 {
  .main__body {
    padding: 0 20px;
  }
}

@include _767 {
  .radio__input {
    margin: 0 10px;
  }
  .card__cost {
    padding-right: 10px;
  }
}

@include _480 {
  .period {
    &__container {
      flex-direction: column;
    }

    &__period {
      margin-bottom: 10px;

      &:last-child {
        margin-bottom: 0;
      }
    }

    &__btn-container {
      flex-direction: column;
      width: 100%;
    }
  }
  .btn-container__btn {
    width: 100%;
    margin-bottom: 10px;

    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
