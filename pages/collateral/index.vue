<template>
  <div class="collateral-page">
    <div class="collateral-page__container">
      <div class="collateral-page__header">
        <div class="title">
          {{ $t('collateral.lending') }}
        </div>
        <div class="title_sub">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luctus venenatis, lectus magna fringilla urna, porttitor
        </div>
      </div>
      <div class="collateral-page__content">
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
            {{ $t('collateral.wantToGetWUSDTitle') }}
          </div>
          <div class="info-block__about">
            <div class="info-block__subtitle">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luctus venenatis, lectus magna fringilla urna, porttitor
            </div>
            <img
              class="info-block-image"
              src="~/assets/img/app/getWUSD.svg"
              alt=""
            >
            <div class="btn-group">
              <base-btn
                class="btn"
                data-selector="GET-WUSD"
                @click="openModalGetWUSD"
              >
                {{ $t('collateral.getWUSD') }}
              </base-btn>
            </div>
          </div>
        </div>
        <div class="info-block info-block_blue">
          <div class="info-block__name_bold">
            {{ $t('collateral.wantToGoAuctionTitle') }}
          </div>
          <div class="info-block__about">
            <div class="info-block__subtitle">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luctus venenatis, lectus magna fringilla urna, porttitor
            </div>
            <img
              class="info-block-image"
              src="~/assets/img/app/goAuction.svg"
              alt=""
            >
            <div class="btn-group">
              <base-btn
                class="btn"
                data-selector="GO-AUCTION"
                @click="goAuction"
              >
                {{ $t('collateral.goAuction') }}
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
import { Path, TokenMap, TokenSymbols } from '~/utils/enums';
import { getGasPrice, getWalletAddress } from '~/utils/wallet';
import { WQRouter } from '~/abi';

export default {
  name: 'Collateral',
  data() {
    return {
      indexFAQ: [],
    };
  },
  computed: {
    ...mapGetters({
      userData: 'user/getUserData',

      oraclePrices: 'oracle/getPrices',
      oracleSymbols: 'oracle/getSymbols',
      oracleCurrentPrices: 'oracle/getCurrentPrices',

      currentBalance: 'wallet/getBalanceData',
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
          subtitle: this.$t('collateral.marketSize'),
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
          name: this.$t('collateral.faq1'),
          about: this.$t('collateral.faq1'),
        },
        {
          name: this.$t('collateral.faq2'),
          about: this.$t('collateral.ans2'),
        },
        {
          name: this.$t('collateral.faq3'),
          about: this.$t('collateral.faq3'),
        },
        {
          name: this.$t('collateral.faq4'),
          about: this.$t('collateral.faq4'),
        },
        {
          name: this.$t('collateral.faq5'),
          about: this.$t('collateral.faq5'),
        },
      ];
    },
  },
  beforeMount() {
    this.$nuxt.setLayout(this.userData.id ? 'default' : 'guest');
  },
  methods: {
    async openModalGetWUSD() {
      await this.$store.dispatch('wallet/getBalance');
      this.ShowModal({
        key: modals.getWUSD,
        needChangeModal: 1,
        submit: async ({
          amount, collateral, percent, currency,
        }) => {
          this.SetLoader(true);

          const { result: { gas, gasPrice } } = await this.$store.dispatch('oracle/feeSetTokensPrices');
          this.SetLoader(false);
          if (gas && gasPrice) {
            this.ShowModal({
              key: modals.transactionReceipt,
              title: this.$t('modals.setTokenPrice', { token: currency }),
              fields: {
                from: { name: this.$t('modals.fromAddress'), value: this.convertToBech32('wq1', getWalletAddress()) },
                fee: {
                  name: this.$t('wallet.table.trxFee'),
                  value: new BigNumber(gasPrice).multipliedBy(gas).shiftedBy(-(this.currentBalance[currency].decimal) || -18).toFixed(),
                  symbol: TokenSymbols.WQT,
                },
              },
              submitMethod: async () => {
                this.SetLoader(true);
                await this.$store.dispatch('oracle/setCurrentPriceTokens');
                await this.MakeApprove({
                  tokenAddress: TokenMap[currency],
                  contractAddress: this.ENV.WORKNET_ROUTER,
                  amount: collateral,
                  approveTitle: this.$t('modals.approveRouter', { token: currency }),
                }).then(async () => {
                  const collateralBN = new BigNumber(collateral).shiftedBy(this.currentBalance[currency].decimal || 18).toFixed(0);
                  const ratioBN = new BigNumber(percent).dividedBy(100).shiftedBy(18).toFixed(0);

                  console.log(collateralBN, ratioBN, currency);
                  console.log('WORKNET_ROUTER', this.ENV.WORKNET_ROUTER);
                  console.log('WORKNET_USDT_TOKEN', this.ENV.WORKNET_USDT_TOKEN);
                  const fee = await getGasPrice(
                    WQRouter,
                    this.ENV.WORKNET_ROUTER,
                    'produceWUSD',
                    [collateralBN, ratioBN, currency],
                  );

                  this.SetLoader(false);
                  if (fee.ok) {
                    console.log('before tx receipt');
                    await this.ShowTxReceipt({
                      from: this.convertToBech32('wq1', getWalletAddress()),
                      to: this.ENV.WORKNET_ROUTER,
                      amount,
                      currency,
                      fee,
                      title: this.$t('modals.takeWUSD'),
                    }).then(async () => {
                      console.log('success receipt');
                      this.SetLoader(true);
                      await this.$store.dispatch('collateral/sendProduceWUSD', {
                        collateral: collateralBN,
                        ratio: ratioBN,
                        currency,
                        fee,
                      });
                    }).finally(() => {
                      this.SetLoader(false);
                      this.ShowToast(this.$t('modals.successBuyWUSD'), this.$t('modals.success'));
                    });
                  }
                  console.log('err');
                }).finally(() => {
                  this.SetLoader(false);
                });
              },
            });
          }
        },
      });
    },

    goAuction() {
      this.$router.push(Path.AUCTION);
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
.collateral-page {
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
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      padding-bottom: 20px;
    }

    .btn {
      box-sizing: border-box;
      font-weight: 400;
      font-size: 16px;
      color: #0083C7;
      background-color: #fff;
      border: 1px solid #0083C71A;
      border-radius: 6px !important;
      transition: .3s;

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

      &:hover {
        background-color: #0083C71A;
        border: 0;
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

        .info-block-image {
          grid-area: sd;
          position: absolute;
          right: 0;
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

      &_blue {
        background-color: $blue;
        .info-block {
          &__name {
            color: #fff;
            &_bold {
              color: #fff;
            }
          }
          &__subtitle {
            color: #fff;
          }
        }
        .btn {
          &:hover {
            background-color: #103d7c;
            color: #fff;
          }
        }
      }
    }
  }
}
@include _767 {
  .collateral-page {
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
        &__about {
          .btn-group {
            grid-template-columns: repeat(1, 1fr);
          }
        }
        &__triple {
          gap: 10px;
        }
      }
    }
  }
}

@include _575 {
  .collateral-page {
    &__content {
      .info-block {
        &__triple {
          grid-template-columns: unset;
          grid-template-rows: repeat(3, 1fr);
        }

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

          .info-block-image {
            position: relative;
            width: 100%;
            max-width: 370px;
            justify-self: center;
          }

          .btn-group {
            padding: 0;
            display: grid;
            grid-template-columns: unset;
            grid-template-rows: repeat(1, 1fr);
            gap: 20px;
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
