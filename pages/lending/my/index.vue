<template>
  <div class="crediting">
    <div class="crediting__container">
      <div class="crediting__header">
        <base-btn
          class="btn"
          data-selector="BACK-TO-CREDITING"
          @click="handleBackToLending()"
        >
          <template v-slot:left>
            <span class="icon-chevron_left" />
          </template>
          {{ $t('meta.btns.back') }}
        </base-btn>
        <div class="title">
          {{ $t('meta.crediting') }}
        </div>
        <div class="desc">
          {{ $t('crediting.description') }}
        </div>
      </div>
      <div class="crediting__content">
        <div
          class="content__couple"
          :class="{'content__couple_solo' : !isHaveCredit || !isHaveLoan}"
        >
          <template
            v-for="(data, index) in blocksData"
          >
            <div
              v-if="data.show"
              :key="index"
              class="content__half"
            >
              <div class="content__title content__title_big">
                {{ data.title }}
              </div>
              <div class="content__price">
                <div class="content__title content__title_small">
                  {{ data.priceTitle }}
                </div>
                <div class="content__title content__title_big content__title_blue">
                  {{ data.price }}
                </div>
              </div>
              <div class="content__info-data">
                <div
                  v-for="(info, key) in data.info"
                  :key="key"
                  class="info-data__info-block"
                >
                  <div class="info-data__title">
                    {{ info.title }}
                  </div>
                  <div class="info-data__desc">
                    {{ info.desc }}
                  </div>
                </div>
              </div>
              <div class="content__buttons">
                <base-btn
                  v-for="(button, key) in data.buttons"
                  :key="key"
                  :data-selector="button.title.toUpperCase()"
                  :mode="button.mode"
                  :disabled="button.disabled"
                  @click="button.action === 'claim' ? sendClaim() : openModal(button.action)"
                >
                  {{ button.title }}
                </base-btn>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import moment from 'moment';
import BigNumber from 'bignumber.js';
import modals from '~/store/modals/modals';
import { WQBorrowing, WQLending } from '~/abi/abi';
import { Path } from '~/utils/enums';

export default {
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
      creditData: 'crediting/getCreditData',
      walletData: 'crediting/getWalletData',
      rewardsData: 'crediting/getRewards',
      currentFee: 'crediting/getCurrentFee',
    }),
    blocksData() {
      return [
        {
          title: this.$t('crediting.currentCredit'),
          priceTitle: this.$t('crediting.totalWusdDebt'),
          price: this.$tc('meta.coins.count.WUSDCount', (+this.convertedCredit).toFixed(4)),
          show: this.isHaveCredit,
          info: [
            {
              title: this.$t('crediting.needRefund'),
              desc: this.$tc('meta.coins.count.WUSDCount', (+this.fullValueForRefund).toFixed(4)),
            },
            {
              title: this.$t('modals.totalFee'),
              desc: this.$tc('meta.coins.count.WUSDCount', (+this.convertedCurrentFee).toFixed(4)),
            },
            {
              title: this.$t('crediting.dueDate'),
              desc: moment.unix(this.creditData.borrowedAt).add(7, 'days').format('DD.MM.YYYY'),
            },
          ],
          buttons: [
            {
              title: this.$t('crediting.refund'),
              action: 'refund',
              disabled: false,
            },
          ],
        },
        {
          title: this.$t('crediting.currentLoan'),
          priceTitle: this.$t('crediting.totalCollateralLocked'),
          price: this.$tc('meta.coins.count.WUSDCount', new BigNumber(this.walletData.amount).shiftedBy(-18).toString()),
          show: this.isHaveLoan,
          info: [
            {
              title: this.$t('meta.claimRewards'),
              desc: this.rewardsData > 0 ? this.rewardsData : this.$t('modals.nothingToClaim'),
            },
          ],
          buttons: [
            {
              title: this.$t('meta.withdraw'),
              disabled: false,
              action: 'withdraw',
            },
            {
              title: this.$t('meta.deposit'),
              mode: 'outline',
              disabled: false,
              action: 'deposit',
            },
            {
              title: this.$t('modals.claim'),
              mode: 'outline',
              disabled: this.rewardsData <= 0,
              action: 'claim',
            },
          ],
        },
      ];
    },
    isHaveCredit() {
      return this.convertedCredit > 0;
    },
    isHaveLoan() {
      return this.walletData.amount > 0;
    },
    convertedCredit() {
      return this.amountConvert(this.creditData.credit);
    },
    convertedCurrentFee() {
      return this.amountConvert(this.currentFee);
    },
    fullValueForRefund() {
      return new BigNumber(this.convertedCredit).plus(this.convertedCurrentFee).toString();
    },
  },
  async mounted() {
    this.SetLoader(true);
    await Promise.all([
      this.$store.dispatch('crediting/getCreditData'),
      this.$store.dispatch('crediting/getWalletsData'),
      this.$store.dispatch('crediting/getRewards'),
      this.$store.dispatch('crediting/getCurrentFee'),
    ]);
    this.SetLoader(false);
  },
  methods: {
    handleBackToLending() {
      this.$router.push(Path.LENDING);
    },
    async openModal(action) {
      let maxValue = null;
      if (action === 'refund') {
        await this.$store.dispatch('crediting/getCurrentFee');
        maxValue = this.fullValueForRefund;
      } else if (action === 'withdraw') {
        maxValue = new BigNumber(this.walletData.amount).shiftedBy(-18).toString();
      }
      this.ShowModal({
        key: modals.valueSend,
        mode: action,
        maxValue,
        submit: async (amount) => {
          this.SetLoader(true);
          let payload = {};
          const feeData = await this.$store.dispatch('crediting/getCurrentFee');
          let value = new BigNumber(amount).shiftedBy(18);
          if (maxValue) {
            maxValue = new BigNumber(maxValue).shiftedBy(18).toString();
          }
          if (+value.toString() === +maxValue && action === 'refund') {
            value = value.plus(10000).toString();
          } else {
            value = value.toString();
          }
          const valueWithoutFee = new BigNumber(amount).shiftedBy(18).minus(feeData).toString();
          switch (action) {
            case 'refund':
              payload = {
                value,
                data: [1, valueWithoutFee],
                method: 'refund',
                abi: WQBorrowing,
                address: process.env.WORKNET_BORROWING,
              };
              break;
            case 'withdraw':
              payload = {
                data: [value],
                method: 'withdraw',
                abi: WQLending,
                address: process.env.WORKNET_LENDING,
              };
              break;
            case 'deposit':
              payload = {
                value,
                data: [],
                method: 'deposit',
                abi: WQLending,
                address: process.env.WORKNET_LENDING,
              };
              break;
            default:
              console.log('default');
          }
          const res = await this.$store.dispatch('crediting/sendMethod', payload);
          this.SetLoader(false);
          if (res.ok) {
            await Promise.all([
              this.$store.dispatch('crediting/getCreditData'),
              this.$store.dispatch('crediting/getWalletsData'),
              this.$store.dispatch('crediting/getRewards'),
            ]);
            this.ShowModalSuccess(this.$t(`modals.successfulMethods.${action}`));
          } else {
            this.ShowModalFail(this.$t('modals.transactionFail'));
          }
        },
      });
    },
    async sendClaim() {
      const res = await this.$store.dispatch('crediting/sendMethod', {
        method: 'claim',
        abi: WQLending,
        address: process.env.WORKNET_LENDING,
      });
      if (res.ok) {
        this.ShowModal({
          key: modals.status,
          img: require('~/assets/img/ui/transactionSend.svg'),
          title: this.$t('modals.successfulMethod.claim'),
        });
      } else {
        this.ShowModal({
          key: modals.status,
          img: require('~/assets/img/ui/warning.svg'),
          title: this.$t('modals.transactionFail'),
        });
      }
    },
    amountConvert(value) {
      return new BigNumber(value).shiftedBy(-18).toString();
    },
  },
};
</script>

<style lang="scss" scoped>
.crediting {
  background: linear-gradient(to bottom, #103D7C 290px, #f6f8fa 232px);
  display: flex;
  justify-content: center;

  &__container {
    display: grid;
    grid-template-rows: 180px max-content;
    max-width: 1180px;
    grid-gap: 40px;
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
  }

  &__header {
    align-self: flex-end;

    .btn {
      background-color: unset;
      color: #fff;
      width: 100px;
      padding: 0;
      gap: 5px;
      font-size: 18px;
      font-weight: 400;
      margin-bottom: 10px;
      justify-content: flex-start;

      .icon-chevron_left {
        font-size: 26px;
        color: #fff;
        &:before {
          color: #fff;
        }
      }
    }

    .title {
      font-weight: 500;
      color: #FFF;
      max-width: 530px;
      font-size: 35px;
      line-height: 110%;
      margin: 0 0 20px;
    }

    .desc {
      width: 540px;
      color: #8299bb;
    }
  }

  &__content {
    display: grid;
    grid-row-gap: 30px;
    width: 100%;
    grid-template-rows: max-content;

    .content {
      background-color: #fff;
      border-radius: 6px;
      overflow: hidden;

      &__info-data {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-gap: 20px;
      }
      &__buttons {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-gap: 20px;
      }

      &__couple {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
        &_solo {
          grid-template-columns: auto;
        }
      }

      &__half {
        @extend .content;
        padding: 20px;
        display: grid;
        grid-gap: 20px;
      }

      &__title {
        font-size: 20px;
        font-weight: 600;
        color: #1D2127;

        &_black {
          color: #1D2127;
        }

        &_big {
          font-weight: 500;
          font-size: 20px;
          color: $darkblue,
        }

        &_blue {
          color: #0083C7;
          font-weight: 700;
        }

        &_small {
          font-size: 16px;
          font-weight: 400;
          color: #7C838D;
        }
      }
    }

    .info-data {
      &__title {
        font-weight: 600;
        font-size: 18px;
        line-height: 130%;
      }
      &__desc {
        font-weight: 400;
        font-size: 16px;
        line-height: 130%;
        color: $black500;
      }
    }
  }

  @include _991 {
    .content {
      &__couple {
        grid-template-rows: repeat(2, 1fr);
        grid-template-columns: unset;
        &_solo {
          grid-template-rows: auto;
        }
      }
    }
  }

  @include _767 {
    background: linear-gradient(to bottom, #103D7C 280px, #f6f8fa 195px);
    .desc {
      width: auto;
    }
    &__container {
      grid-template-rows: auto auto;
      grid-gap: 15px;
    }
    &__header {
      .btn {
        justify-content: left;
      }
      .title {
        font-size: 38px;
        margin-bottom: 15px;
        width: 100%;
      }
    }
    &__content {
      grid-template-rows: auto;
    }
  }

  @include _575 {
    .info-data {
      &__info-block {
        display: grid;
        grid-gap: 10px;
        align-content: center;
      }
    }
  }
}
</style>