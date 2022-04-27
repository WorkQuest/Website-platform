<template>
  <div class="crediting-page">
    <div class="crediting-page__container">
      <div class="crediting-page__header">
        <div class="title">
          {{ $t('crediting.lending') }}
        </div>
      </div>
      <div class="crediting-page__content">
        <div class="info-block__triple">
          <div
            v-for="(item, i) in cards"
            :key="i"
            class="info-block__third"
          >
            <div class="info-block__title_big info-block__title_blue">
              {{ item.title }}
            </div>
            <div class="info-block__title_small">
              {{ item.subtitle }}
            </div>
          </div>
        </div>
        <div class="info-block">
          <div class="info-block__name_bold">
            {{ $t('crediting.wantToTakeALoan') }}
          </div>
          <div class="info-block__about">
            <div class="info-block__subtitle">
              {{ $t('crediting.templateText') }}
            </div>
            <img
              class="calendar-img"
              src="~/assets/img/ui/cards.svg"
              alt=""
            >
            <div class="btn-group">
              <base-btn
                v-if="isHaveCredit || isHaveLoan"
                class="btn"
                data-selector="MY-LOANS"
                @click="handleGoToLendingMy()"
              >
                {{ $t('crediting.myLoans') }}
              </base-btn>
              <base-btn
                class="btn"
                :mode="!isHaveCredit ? 'outline' : ''"
                :disabled="isHaveCredit"
                data-selector="CREDITING-DEPOSIT"
                @click="openCreditingDepositModal()"
              >
                {{ $t('crediting.borrow') }}
              </base-btn>
              <base-btn
                class="btn"
                :mode="!isHaveLoan ? 'outline' : ''"
                :disabled="isHaveLoan"
                data-selector="CREDITING-LOAN"
                @click="openCreditingLoanModal()"
              >
                {{ $t('meta.lend') }}
              </base-btn>
            </div>
          </div>
        </div>
        <div
          v-if="documents.length"
          class="info-block"
        >
          <div class="info-block__name_bold">
            {{ $t("meta.information") }}
          </div>
          <div class="info-block__documents">
            <div
              v-for="(item, i) in documents"
              :key="i"
              class="document"
            >
              <img
                class="document__img"
                src="~/assets/img/ui/pdf.svg"
                alt=""
              >
              <div class="document__title">
                <div class="document__name">
                  {{ item.name }}
                </div>
                <div class="document__size">
                  {{ item.size }}
                </div>
              </div>
              <button class="btn__doc">
                {{ $t('meta.btns.download') }}
                <img
                  class="download"
                  src="~/assets/img/ui/download.svg"
                  alt=""
                >
              </button>
            </div>
          </div>
        </div>
        <div
          v-if="FAQs.length"
          class="info-block"
        >
          <div class="info-block__name_bold">
            {{ $t("meta.faq") }}
          </div>
          <div class="info-block__faqs">
            <button
              v-for="(item, i) in FAQs"
              :key="i"
              class="info-block__faq"
              @click="handleClickFAQ(i)"
            >
              <div class="text__faq">
                {{ item.name }}
              </div>
              <img
                class="select-img"
                :class="{'select-img_rotate' : indexFAQ.includes(i)}"
                src="~/assets/img/ui/arrow-down.svg"
                alt=""
              >
              <div
                class="text__faq_gray"
                :class="{'text__faq_opened' : indexFAQ.includes(i)}"
              >
                {{ item.about }}
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import BigNumber from 'bignumber.js';
import modals from '~/store/modals/modals';
import { getGasPrice } from '~/utils/wallet';
import { WQOracle, WQBorrowing, WQLending } from '~/abi/index';
import { Path } from '~/utils/enums';
import { images } from '~/utils/images';

export default {
  name: 'Lending',
  data() {
    return {
      indexFAQ: [],
    };
  },
  computed: {
    ...mapGetters({
      isWalletConnected: 'wallet/getIsWalletConnected',
      creditData: 'crediting/getCreditData',
      currentPrices: 'oracle/getCurrentPrices',
      walletData: 'crediting/getWalletData',
      prices: 'oracle/getPrices',
      symbols: 'oracle/getSymbols',
    }),
    documents() {
      return [
        {
          name: 'Some_document.pdf',
          size: this.$tc('meta.units.mb', 1.2),
          url: '',
        },
        {
          name: 'Some_document.pdf',
          size: this.$tc('meta.units.mb', 1.2),
          url: '',
        },
        {
          name: 'Some_document.pdf',
          size: this.$tc('meta.units.mb', 1.2),
          url: '',
        },
      ];
    },
    cards() {
      return [
        {
          title: this.$tc('meta.coins.count.dollarsCount', '417.1M'),
          subtitle: this.$t('crediting.marketSize'),
        },
        {
          title: this.$tc('meta.units.percentsCount', 4.31),
          subtitle: this.$t('meta.deposit'),
        },
        {
          title: this.$tc('meta.units.percentsCount', 5),
          subtitle: this.$t('meta.percent'),
        },
      ];
    },
    FAQs() {
      return [
        {
          name: this.$t('crediting.faq1'),
          about: this.$t('crediting.faq1'),
        },
        {
          name: this.$t('crediting.faq2'),
          about: this.$t('crediting.ans2'),
        },
        {
          name: this.$t('crediting.faq3'),
          about: this.$t('crediting.faq3'),
        },
        {
          name: this.$t('crediting.faq4'),
          about: this.$t('crediting.faq4'),
        },
        {
          name: this.$t('crediting.faq5'),
          about: this.$t('crediting.faq5'),
        },
      ];
    },
    isHaveCredit() {
      return this.creditData.credit > 0;
    },
    isHaveLoan() {
      return this.walletData.amount > 0;
    },
  },
  async beforeCreate() {
    await this.$store.dispatch('wallet/checkWalletConnected', { nuxt: this.$nuxt });
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
    handleGoToLendingMy() {
      this.$router.push(`${Path.LENDING}/my`);
    },
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
    openCreditingLoanModal() {
      this.ShowModal({
        key: modals.creditingLoan,
        submit: async (quantity) => {
          this.SetLoader(true);
          const { ok } = await this.$store.dispatch('crediting/sendMethod', {
            value: new BigNumber(quantity).shiftedBy(18).toString(),
            address: process.env.WORKNET_LENDING,
            method: 'deposit',
            abi: WQLending,
            data: [],
          });
          this.SetLoader(false);

          if (ok) {
            await this.$store.dispatch('crediting/getWalletsData');
            this.ShowModalSuccess({
              title: this.$t('modals.loanIsOpened'),
              img: images.TRANSACTION_SEND,
            });
          } else this.ShowModalFail({ title: this.$t('modals.transactionFail') });
        },
      });
    },
    async setTokenPrice() {
      await this.$store.dispatch('oracle/getCurrentPrices');
      const { nonce } = this.currentPrices;
      const { prices, symbols } = this;

      const { gas, gasPrice } = await getGasPrice(
        WQOracle,
        process.env.WORKNET_ORACLE,
        'setTokenPricesUSD',
        [...Object.keys(this.currentPrices).map((key) => this.currentPrices[key]), prices, symbols],
      );

      if (gas && gasPrice) {
        const { ok } = await this.$store.dispatch('crediting/setTokenPrices', {
          ...this.currentPrices,
          timestamp: nonce,
          gasPrice,
          symbols,
          prices,
          gas,
        });
        return ok;
      }

      return false;
    },
    handleClickFAQ(index) {
      if (this.indexFAQ.includes(index)) {
        this.indexFAQ.splice(this.indexFAQ.indexOf(index), 1);
      } else {
        this.indexFAQ.push(index);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.crediting-page {
  background: linear-gradient(to bottom, #103D7C 284px, #f6f8fa 284px);
  display: flex;
  justify-content: center;

  &__container {
    display: grid;
    grid-template-rows: 195px max-content;
    max-width: 1180px;
    grid-row-gap: 30px;
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
  }

  &__header {
    align-self: flex-end;

    .title {
      font-weight: 500;
      color: #FFF;
      max-width: 530px;
      font-size: 45px;
      line-height: 110%;
      margin: 0 0 24px;

      &_sub {
        @extend .title;
        font-size: 16px;
        line-height: 100%;
        opacity: 0.5;
      }
    }
  }

  &__content {
    display: grid;
    grid-row-gap: 30px;
    width: 100%;

    .btn-group {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      padding-bottom: 20px;

      &_exp {
        @extend .btn-group;
        width: calc(100% - 20px);
      }
    }

    .btn {
      box-sizing: border-box;
      font-weight: 400;
      font-size: 16px;
      transition: .3s;
      border-radius: 6px !important;

      &__doc {
        @extend .btn;
        width: 220px;
        height: 46px;

        .download {
          display: unset;
          vertical-align: unset;
          margin-left: 5px;
        }
      }

      &_bl {
        @extend .btn;
        background-color: #0083C7;
        border: unset;
        color: #fff;

        &:hover {
          background-color: #103d7c;
        }
      }
    }

    .text {
      font-size: 16px;
      font-weight: 400;
      color: #8D96A1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      &__faq {
        color: #4C5767;
        font-weight: 500;

        &_gray {
          font-size: 16px;
          font-weight: 400;
          color: #8D96A1;
          height: 0;
          transition: height 300ms;
          overflow: hidden;
        }

        &_opened {
          height: auto;
          font-size: 16px;
          font-weight: 400;
          color: #8D96A1;
          transition: height 300ms;
          margin-top: 20px;
        }
      }

      &_blue {
        @extend .text;
        font-weight: 500;
        font-size: 18px;
        color: #0083C7;
      }

      &_small {
        @extend .text;
        font-size: 14px;
      }
    }

    .select-img {
      height: 7px;
      position: absolute;
      width: 12px;
      right: 30px;
      top: 30px;
      transition: 300ms;

      &_rotate {
        @extend .select-img;
        transform: rotate(180deg);
      }
    }

    .info-block {
      background-color: #fff;
      border-radius: 6px;
      overflow: hidden;

      &__faqs {
        margin: 0 20px 20px 20px;
        display: grid;
        gap: 20px;
      }

      &__faq {
        border-radius: 5px;
        padding: 20px 60px 20px 20px;
        background-color: $black0;
        text-align: left;
        position: relative;
        transition: 300ms;
      }

      &__triple {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
      }

      &__third {
        @extend .info-block;
        padding: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
      }

      &__square {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 20px;
      }

      &__quarter {
        @extend .info-block;
        text-align: center;
        display: grid;
        align-content: center;
        gap: 20px;
      }

      &__title {
        font-size: 20px;
        font-weight: 600;
        color: #1D2127;
        opacity: 0.5;

        &_black {
          color: #1D2127;
        }

        &_big {
          font-size: 25px;
          font-weight: 500;
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

        &_pad {
          padding: 0 0 20px 20px;
          width: 50%;
        }
      }

      &__subtitle {
        font-weight: 400;
        font-size: 16px;
        color: #7C838D;
      }

      &__about {
        width: calc(100% - 50px);
        grid-template-areas:
          "hd ."
          "ft sd";
        margin-left: 20px;
        display: grid;
        grid-template-columns: 60% auto;
        grid-template-rows: auto 63px;
        gap: 20px;
        position: relative;
        min-height: 170px;

        .info-block__subtitle {
          grid-area: hd;
        }

        .calendar-img {
          grid-area: sd;
          position: absolute;
          right: 0px;
          bottom: 0;
        }

        .btn-group {
          grid-area: ft;
        }
      }

      &__documents {
        padding: 0 20px 20px 20px;
        display: grid;
        gap: 20px;

        .document {
          border: 1px solid #E1E4ED;
          border-radius: 8px;
          height: 80px;
          padding: 0 20px;
          align-items: center;
          display: grid;
          grid-template-columns: 33px auto 220px;

          &__title {
            padding: 0 10px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            display: flex;
            align-items: center;
          }

          &__name {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            font-weight: 400;
            font-size: 16px;
            padding-right: 10px;
          }

          &__size {
            font-weight: 400;
            font-size: 13px;
            color: #A7AEB9;
          }
        }
      }

      &__name {
        font-size: 16px;
        color: #1D2127;
        padding: 20px 20px 10px 20px;
        font-weight: 400;

        &_bold {
          font-weight: 500;
          font-size: 25px;
          color: #103D7C;
          line-height: 1;
          padding: 20px;
        }
      }
    }
  }

  @include _767 {
    background: linear-gradient(to bottom, #103D7C 220px, #f6f8fa 220px);
    &__container {
      grid-template-rows: auto auto;
      gap: 15px;
    }
    &__header {
      .title {
        font-size: 38px;
        margin-bottom: 15px;
        width: 100%;

        &_sub {
          font-size: 16px;
          max-width: 400px;
        }
      }
    }
    &__content {
      .info-block {
        &__triple {
          gap: 10px;
        }
      }
    }
    .info-block {
      &__about {
        grid-template-areas:
            "hd"
            "ft"
            "sd";
        grid-template-rows: repeat(3, auto);
        grid-template-columns: unset;
        width: 100%;
        margin: 0;
        padding: 0 20px;

        .calendar-img {
          position: relative;
          width: 100%;
          max-width: 370px;
          justify-self: center;
        }

        .btn-group {
          padding: 0;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-template-rows: unset;
          gap: 20px;
        }
      }
    }
  }

  @include _575 {
    &__content {
      .info-block {
        &__triple {
          grid-template-columns: unset;
          grid-template-rows: repeat(3, 1fr);
        }

        &__about {
          .btn-group {
            grid-template-columns: unset;
            grid-template-rows: repeat(2, 1fr);
          }
        }

        &__documents {
          .document {
            grid-template-columns: 33px auto 23px;
          }
        }
      }

      .btn {
        &__doc {
          border: 0;
          width: 23px;
          font-size: 0;
        }
      }
    }
  }
}
</style>
