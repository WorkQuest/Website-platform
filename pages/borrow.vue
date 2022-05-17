<template>
  <div class="borrow">
    <div class="borrow__container">
      <div class="borrow__header">
        <div class="header__title">
          Borrow
        </div>
        <div class="header__sub">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luctus venenatis, lectus magna fringilla urna, porttitor
        </div>
      </div>
      <div class="borrow__content">
        <div class="content__buttons-block">
          <base-btn
            data-selector="ACTIVE_LOANS"
            :mode="mode==='loans' ? '' : 'outline'"
            @click="mode='loans'"
          >
            Active loans
          </base-btn>
          <base-btn
            data-selector="TEST"
            :mode="mode==='notLoans' ? '' : 'outline'"
            @click="mode='notLoans'"
          >
            Not active loans
          </base-btn>
        </div>
        <base-btn
          data-selector="TEST"
          mode="outline"
          class="switch-mode"
          @click="isTableHide ? isTableHide = false : isTableHide = true"
        >
          {{ isTableHide ? 'With cards' : 'With table' }}
        </base-btn>
        <div
          v-if="isTableHide"
          class="content__cards-block"
        >
          <template v-if="mode === 'loans'">
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
          </template>
          <template v-else>
            <div
              v-for="(item, key) in notLoansData"
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
          </template>
        </div>
        <div
          v-if="!isTableHide"
          class="content__table"
        >
          <div class="mining-page__table">
            <b-table
              :items="tableData"
              :fields="tableHeaders"
              borderless
              caption-top
              thead-class="table__header"
              tbody-tr-class="table__row"
            >
              <template #cell(poolAddress)="el">
                <div class="user__info">
                  <div class="user__name">
                    {{ el.item.poolAddress }}
                  </div>
                </div>
              </template>
              <template #cell(totalValue)="el">
                <div class="user__value_gray">
                  {{ `${Floor(el.item.totalValue, 2)} $` }}
                </div>
              </template>
              <template #cell(tokenAmount0)="el">
                <div class="user__value_gray">
                  {{ el.item.tokenAmount0 }}
                </div>
              </template>
              <template #cell(tokenAmount1)="el">
                <div class="user__value_gray">
                  {{ el.item.tokenAmount1 }}
                </div>
              </template>
              <template #cell(time)="el">
                <div class="user__value_green">
                  {{ el.item.time }}
                </div>
              </template>
            </b-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BigNumber from 'bignumber.js';
import modals from '~/store/modals/modals';

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
      notLoansData: [
        {
          price: 1000,
          days: 14,
          percent: 5,
        },
        {
          price: 10200,
          days: 31,
          percent: 10,
        },
        {
          price: 10000,
          days: 5,
          percent: 15,
        },
        {
          price: 100,
          days: 140,
          percent: 1,
        },
        {
          price: 100000,
          days: 365,
          percent: 14,
        },
        {
          price: 1500,
          days: 14,
          percent: 8,
        },
        {
          price: 1003,
          days: 18,
          percent: 9,
        },
        {
          price: 1600,
          days: 14,
          percent: 10,
        },
        {
          price: 10020,
          days: 31,
          percent: 10,
        },
        {
          price: 10000,
          days: 5,
          percent: 15,
        },
        {
          price: 100,
          days: 140,
          percent: 1,
        },
        {
          price: 100000,
          days: 365,
          percent: 14,
        },
        {
          price: 150,
          days: 14,
          percent: 8,
        },
        {
          price: 1003,
          days: 18,
          percent: 9,
        },
        {
          price: 1060,
          days: 14,
          percent: 10,
        },
      ],
      tableData: [
        {
          poolAddress: 100,
          totalValue: 100,
          tokenAmount0: 100,
          tokenAmount1: 100,
          time: 100,
        },
        {
          poolAddress: 100,
          totalValue: 100,
          tokenAmount0: 100,
          tokenAmount1: 100,
          time: 100,
        },
        {
          poolAddress: 100,
          totalValue: 100,
          tokenAmount0: 100,
          tokenAmount1: 100,
          time: 100,
        },
      ],
      mode: 'loans',
      isTableHide: true,
    };
  },
  computed: {
    tableHeaders() {
      return [
        {
          key: 'poolAddress',
          label: this.$t('mining.tableHead.swaps'),
          thStyle: { padding: '0 0 0 23px', height: '27px', lineHeight: '27px' },
          tdAttr: { style: 'padding: 0 0 0 23px; height: 64px; line-height: 64px' },
        },
        {
          key: 'totalValue',
          label: this.$t('mining.tableHead.totalValue'),
          thStyle: { padding: '0', height: '27px', lineHeight: '27px' },
          tdAttr: { style: 'padding: 0; height: 64px; line-height: 64px' },
        },
        {
          key: 'tokenAmount0',
          label: this.$t('mining.tableHead.tokenAmount'),
          thStyle: { padding: '0', height: '27px', lineHeight: '27px' },
          tdAttr: { style: 'padding: 0; height: 64px; line-height: 64px' },
        },
        {
          key: 'tokenAmount1',
          label: this.$t('mining.tableHead.tokenAmount'),
          thStyle: { padding: '0', height: '27px', lineHeight: '27px' },
          tdAttr: { style: 'padding: 0; height: 64px; line-height: 64px' },
        },
        {
          key: 'account',
          label: this.$t('mining.tableHead.account'),
          thStyle: { padding: '0', height: '27px', lineHeight: '27px' },
          tdAttr: { style: 'padding: 0; height: 64px; line-height: 64px' },
        },
        {
          key: 'time',
          label: this.$t('mining.tableHead.time'),
          thStyle: { padding: '0', height: '27px', lineHeight: '27px' },
          tdAttr: { style: 'padding: 0; height: 64px; line-height: 64px' },
        },
      ];
    },
  },
  // async beforeCreate() {
  //   await this.$store.dispatch('wallet/checkWalletConnected', { nuxt: this.$nuxt });
  // },
  // async mounted() {
  //   this.SetLoader(true);
  //   if (!this.isWalletConnected) return;
  //   await Promise.all([
  //     this.$store.dispatch('crediting/getCreditData'),
  //     this.$store.dispatch('oracle/getCurrentPrices'),
  //     this.$store.dispatch('crediting/getWalletsData'),
  //   ]);
  //   this.SetLoader(false);
  // },
  methods: {
    openCreditingDepositModal() {
      this.ShowModal({
        key: modals.creditingDeposit,
        mode: 'borrow',
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
          const symbol = checkpoints[selCurrencyID - 1].name;
          this.ShowModal({
            key: modals.confirmDetails,
            receiptData,
            submit: async () => {
              this.ShowModal({
                key: modals.areYouSure,
                text: this.$t('modals.approveRouter', { token: symbol }),
                okBtnTitle: this.$t('meta.btns.submit'),
                okBtnFunc: async () => {
                  this.ShowModalSuccess({ title: this.$t('meta.success') });
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
      grid-template-rows: 140px max-content;
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
  .switch-mode {
    width: 150px;
  }
</style>
