<template>
  <div class="borrow">
    <div class="borrow__container">
      <div class="borrow__header">
        <div class="header__title">
          {{ $t('pension.retirementProgram') }}
        </div>
        <div class="header__sub">
          {{ $t('ui.menu.pension.desc') }}
        </div>
      </div>
      <div class="borrow__content">
        <div class="content__buttons-block">
          <base-btn
            data-selector="ACTIVE_LOANS"
          >
            {{ $t('meta.btns.stake') }}
          </base-btn>
          <base-btn
            data-selector="TEST"
            mode="outline"
          >
            {{ $t('meta.btns.unstake') }}
          </base-btn>
        </div>
        <div class="content__cards-block">
          <div
            v-for="(item, key) in loansData"
            :key="key"
            class="cards-block__card"
          >
            <div class="card__info">
              <div class="card__price">
                {{ $tc('meta.coins.count.WUSDCount', item.price) }}
              </div>
              <div class="card__days">
                {{ $tc('meta.units.days', item.days) }}
              </div>
              <div class="card__percent">
                {{ $tc('meta.units.percentsCount', item.percent) }}
              </div>
            </div>
            <base-btn
              :data-selector="`OPEN_LOAN_${key}`"
              mode="agree"
              @click="openCreditingDepositModal()"
            >
              {{ $t('meta.btns.stake') }}
            </base-btn>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BigNumber from 'bignumber.js';
import modals from '~/store/modals/modals';
import { WQBorrowing } from '~/abi';
import { images } from '~/utils/images';

export default {
  name: 'Borrow',
  data() {
    return {
      loansData: [
        {
          price: 100,
          days: 14,
          percent: 5,
        },
        {
          price: 1020,
          days: 31,
          percent: 10,
        },
        {
          price: 1000,
          days: 5,
          percent: 15,
        },
        {
          price: 10,
          days: 140,
          percent: 1,
        },
        {
          price: 10000,
          days: 365,
          percent: 14,
        },
        {
          price: 150,
          days: 14,
          percent: 8,
        },
        {
          price: 103,
          days: 18,
          percent: 9,
        },
        {
          price: 160,
          days: 14,
          percent: 10,
        },
        {
          price: 1020,
          days: 31,
          percent: 10,
        },
        {
          price: 1000,
          days: 5,
          percent: 15,
        },
        {
          price: 10,
          days: 140,
          percent: 1,
        },
        {
          price: 10000,
          days: 365,
          percent: 14,
        },
        {
          price: 150,
          days: 14,
          percent: 8,
        },
        {
          price: 103,
          days: 18,
          percent: 9,
        },
        {
          price: 160,
          days: 14,
          percent: 10,
        },
      ],
    };
  },
  async mounted() {
    this.SetLoader(true);
    if (!this.isWalletConnected) return;
    await Promise.all([
      this.$store.dispatch('crediting/getCreditData'),
      this.$store.dispatch('oracle/getCurrentPrices'),
      this.$store.dispatch('crediting/getWalletsData'),
    ]);
    this.SetLoader(false);
  },
  methods: {
    openCreditingDepositModal() {
      this.ShowModal({
        key: modals.creditingDeposit,
        submit: async ({
          fundsSource, selFundID, checkpoints, selCurrencyID, datesNumber, date, quantity,
        }) => {
          const receiptData = [
            {
              title: this.$t('crediting.chosenSource'),
              subtitle: fundsSource[selFundID - 1].name,
            },
            {
              title: this.$t('modals.depositing'),
              subtitle: this.$tc(`meta.coins.count.${checkpoints[selCurrencyID - 1].name}Count`, quantity),
            },
            {
              title: this.$t('crediting.dueDate'),
              subtitle: this.$moment().add(datesNumber[date], 'days').format('DD.MM.YYYY'),
            },
          ];
          const valueWithDecimals = new BigNumber(quantity).shiftedBy(18).toString();
          const symbol = checkpoints[selCurrencyID - 1].name;
          const duration = datesNumber[date];
          this.ShowModal({
            key: modals.confirmDetails,
            receiptData,
            submit: async () => {
              this.SetLoader(true);
              const checkTokenPrice = await this.setTokenPrice();
              this.SetLoader(false);
              if (!checkTokenPrice) {
                this.ShowModalFail({ title: this.$t('modals.transactionFail'), subtitle: 'incorrect price in Oracle' });
                return;
              }
              this.ShowModal({
                key: modals.areYouSure,
                text: this.$t('modals.approveRouter', { token: symbol }),
                okBtnTitle: this.$t('meta.btns.submit'),
                okBtnFunc: async () => {
                  this.CloseModal();
                  this.SetLoader(true);
                  const approveAllowed = await this.$store.dispatch('wallet/approveRouter', {
                    symbol,
                    spenderAddress: process.env.WORKNET_BORROWING,
                    value: valueWithDecimals,
                  });
                  this.SetLoader(false);
                  if (!approveAllowed) {
                    this.ShowModalFail({
                      title: this.$t('modals.transactionFail'),
                      subtitle: 'incorrect action in approve or allowance',
                    });
                    return;
                  }
                  this.SetLoader(true);
                  const res = await this.$store.dispatch('crediting/sendMethod', {
                    address: process.env.WORKNET_BORROWING,
                    method: 'borrow',
                    abi: WQBorrowing,
                    data: [
                      1, // 1 in data this is nonce, required parameter for method "borrow"
                      valueWithDecimals,
                      selFundID - 1,
                      duration,
                      symbol,
                    ],
                  });
                  this.SetLoader(false);
                  if (res.ok) {
                    await this.$store.dispatch('crediting/getCreditData');
                    this.ShowModalSuccess({
                      title: this.$t('modals.depositIsOpened'),
                      img: images.TRANSACTION_SEND,
                    });
                  } else this.ShowModalFail({ title: this.$t('modals.transactionFail') });
                },
              });
            },
          });
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
  .borrow {
    background: linear-gradient(to bottom, #103D7C 320px, #f6f8fa 320px);
    display: flex;
    justify-content: center;
    &__container {
      max-width: 1180px;
      width: 100%;
      display: grid;
      grid-template-rows: 195px max-content;
    }
    &__header {
      align-self: flex-end;
      .header {
        &__title {
          font-weight: 500;
          color: #FFF;
          width: 530px;
          font-size: 45px;
          line-height: 110%;
          margin: 0 0 24px;
        }
        &__sub {
          @extend .header__title;
          font-size: 16px;
          line-height: 100%;
          opacity: 0.5;
        }
      }
    }
    &__content {
      display: grid;
      grid-gap: 20px;
    }
  }
  .content {
    &__buttons-block {
      background-color: #fff;
      border-radius: 6px;
      padding: 20px;
      display: flex;
      flex-direction: row;
      gap: 10px;
    }
    &__cards-block {
      display: grid;
      grid-template-columns: repeat(4, auto);
      grid-gap: 30px;
      .cards-block {
        &__card {
          display: grid;
          grid-gap: 10px;
          background-color: #fff;
          border-radius: 6px;
          padding: 10px;
        }
      }
    }
  }
</style>
