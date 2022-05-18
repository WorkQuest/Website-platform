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
            :mode="isLoans ? '' : 'outline'"
            @click="mode='loans'"
          >
            Active loans
          </base-btn>
          <base-btn
            data-selector="LOANS_FOR_SALE"
            :mode="!isLoans ? '' : 'outline'"
            @click="mode='notLoans'"
          >
            Loans for sale
          </base-btn>
        </div>
        <div class="content__text">
          Sort by
        </div>
        <div class="content__buttons-block content__buttons-block_sort">
          <base-btn
            data-selector="SORT_DAYS"
            :mode="sortMode==='days' ? '' : 'outline'"
            @click="sortAction('days')"
          >
            Days
          </base-btn>
          <base-btn
            data-selector="SORT_PRICE"
            :mode="sortMode==='price' ? '' : 'outline'"
            @click="sortAction('price')"
          >
            Amount
          </base-btn>
          <base-btn
            v-if="isLoans"
            data-selector="SORT_PERCENT"
            :mode="sortMode==='percent' ? '' : 'outline'"
            @click="sortAction('percent')"
          >
            Percent
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
          <template v-if="isLoans">
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
                @click="openCreditingDepositModal(item)"
              >
                Take credit
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
                  {{ $tc('meta.coins.count.WUSDCount', item.priceWUSD) }}
                </div>
                <div class="card__percent">
                  {{ $tc(`meta.coins.count.${item.symbol}Count`, item.price) }}
                </div>
                <div class="card__days">
                  {{ $tc('meta.units.days', item.days) }}
                </div>
              </div>
              <base-btn
                :data-selector="`OPEN_LOAN_${key}`"
                mode="agree"
                @click="openModal()"
              >
                Buy
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
              :items="isLoans ? loansData : notLoansData"
              :fields="tableHeaders"
              borderless
              caption-top
              thead-class="table__header"
              tbody-tr-class="table__row"
            >
              <template #cell(price)="el">
                <div class="user__info">
                  <div class="user__name">
                    {{ isLoans ? $tc('meta.coins.count.WUSDCount', el.item.price) : $tc('meta.coins.count.WUSDCount', el.item.priceWUSD) }}
                  </div>
                </div>
              </template>
              <template #cell(days)="el">
                <div class="user__value_gray">
                  {{ el.item.days }}
                </div>
              </template>
              <template
                v-if="isLoans"
                #cell(percent)="el"
              >
                <div class="user__value_gray">
                  {{ $tc('meta.units.percentsCount', el.item.percent) }}
                </div>
              </template>
              <template
                v-else
                #cell(amount)="el"
              >
                <div class="user__value_gray">
                  {{ $tc(`meta.coins.count.${el.item.symbol}Count`, el.item.price) }}
                </div>
              </template>
              <template #cell(action)="el">
                <base-btn
                  mode="agree"
                  @click="isLoans ? openCreditingDepositModal(el.item) : openModal()"
                >
                  Take credit
                </base-btn>
              </template>
            </b-table>
          </div>
        </div>
        <base-pager
          v-if="totalPages > 1"
          v-model="page"
          :total-pages="totalPages"
          class="mining-page__pager"
        />
      </div>
    </div>
  </div>
</template>

<script>
import modals from '~/store/modals/modals';

export default {
  name: 'Borrow',
  data() {
    return {
      page: 1,
      limit: 10,
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
        {
          price: 1020,
          days: 31,
          percent: 10,
        },
      ],
      notLoansData: [
        {
          price: 0.000005,
          symbol: 'ETH',
          priceWUSD: 1000,
          days: 14,
        },
        {
          price: 0.00015,
          symbol: 'ETH',
          priceWUSD: 1000,
          days: 14,
        },
        {
          price: 0.0035,
          symbol: 'ETH',
          priceWUSD: 1000,
          days: 14,
        },
        {
          price: 0.0002,
          symbol: 'ETH',
          priceWUSD: 1000,
          days: 14,
        },
        {
          price: 0.00081,
          symbol: 'ETH',
          priceWUSD: 1000,
          days: 14,
        },
        {
          price: 0.00013,
          symbol: 'ETH',
          priceWUSD: 1000,
          days: 14,
        },
        {
          price: 0.002,
          symbol: 'ETH',
          priceWUSD: 1000,
          days: 14,
        },
        {
          price: 0.000007,
          symbol: 'ETH',
          priceWUSD: 1000,
          days: 14,
        },
        {
          price: 0.0000923,
          symbol: 'ETH',
          priceWUSD: 1000,
          days: 14,
        },
        {
          price: 0.00000092,
          symbol: 'ETH',
          priceWUSD: 1000,
          days: 14,
        },
        {
          price: 0.00025,
          symbol: 'ETH',
          priceWUSD: 1000,
          days: 14,
        },
      ],
      mode: 'loans',
      sortMode: 'days',
      isTableHide: true,
    };
  },
  computed: {
    tableHeaders() {
      const header = [
        {
          key: 'price',
          label: 'Amount',
          thStyle: { padding: '0 0 0 23px', height: '27px', lineHeight: '27px' },
          tdAttr: { style: 'padding: 0 0 0 23px; height: 64px; line-height: 64px' },
        },
        {
          key: 'days',
          label: 'Days',
          thStyle: { padding: '0', height: '27px', lineHeight: '27px' },
          tdAttr: { style: 'padding: 0; height: 64px; line-height: 64px' },
        },
      ];
      if (this.isLoans) {
        header.push(
          {
            key: 'percent',
            label: 'Percent',
            thStyle: { padding: '0', height: '27px', lineHeight: '27px' },
            tdAttr: { style: 'padding: 0; height: 64px; line-height: 64px' },
          },
          {
            key: 'action',
            label: '',
            thStyle: { padding: '0', height: '27px', lineHeight: '27px' },
            tdAttr: { style: 'padding: 10px; width: 150px; height: 64px; line-height: 64px' },
          },
        );
      } else {
        header.push(
          {
            key: 'amount',
            label: 'Amount for another coin',
            thStyle: { padding: '0', height: '27px', lineHeight: '27px' },
            tdAttr: { style: 'padding: 0; height: 64px; line-height: 64px' },
          },
          {
            key: 'action',
            label: '',
            thStyle: { padding: '0', height: '27px', lineHeight: '27px' },
            tdAttr: { style: 'padding: 10px; width: 150px; height: 64px; line-height: 64px' },
          },
        );
      }
      return header;
    },
    isLoans() {
      return this.mode === 'loans';
    },
    totalPages() {
      return Math.ceil(100 / this.limit);
    },
  },
  watch: {
    mode() {
      this.sortMode = 'days';
      this.sortAction(this.sortMode);
    },
  },
  async mounted() {
    this.SetLoader(true);
    this.sortAction(this.sortMode);
    this.SetLoader(false);
  },
  methods: {
    openCreditingDepositModal(item) {
      this.ShowModal({
        key: modals.creditingDeposit,
        mode: 'borrow',
        submit: async ({
          checkpoints, selCurrencyID,
        }) => {
          const receiptData = [
            {
              title: this.$t('modals.depositing'),
              subtitle: this.$tc(`meta.coins.count.${item.symbol ? item.symbol : 'WUSD'}Count`, item.price),
            },
            {
              title: this.$t('crediting.dueDate'),
              subtitle: this.$moment().add(item.days, 'days').format('DD.MM.YYYY'),
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
    openModal() {
      this.ShowModal({
        key: modals.areYouSure,
        okBtnTitle: this.$t('meta.btns.submit'),
        okBtnFunc: async () => {
          this.ShowModalSuccess({ title: this.$t('meta.success') });
        },
      });
    },
    sortAction(mode) {
      if (this.sortMode === mode) {
        if (this.isLoans) this.loansData.reverse();
        else this.notLoansData.reverse();
      }
      if (this.isLoans) this.loansData = this.loansData.sort(this.byField(mode));
      else this.notLoansData = this.notLoansData.sort(this.byField(mode));
      this.sortMode = mode;
    },
    byField(field) {
      return (a, b) => (a[field] > b[field] ? 1 : -1);
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
      &_sort {
        background-color: #FFFFFF00;
        padding: 0;
      }
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
    &__text {
      font-weight: 400;
      color:  #fff;
      font-size: 20px;
    }
  }
  .switch-mode {
    width: 150px;
  }
</style>
