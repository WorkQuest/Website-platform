<template>
  <div class="collateral-page">
    <div class="collateral-page__container">
      <div class="collateral-page__header">
        <div class="title_sub">
          {{ $t('collateral.lending') }}
        </div>
        <div class="title">
          {{ $t('collateral.collateral') }}:
        </div>
        <div class="title_sub">
          {{ $t('collateral.sub') }}
        </div>
      </div>
      <div class="collateral-page__content">
        <div class="info-block__triple">
          <div
            v-for="(item, i) in cards"
            :key="i"
            class="info-block__third"
          >
            <div
              v-if="item.isLoading"
              class="info-block__loader-wrapper"
            >
              <loader
                class="info-block__loader"
                is-mini-loader
              />
            </div>
            <div
              v-else
              class="info-block__title_big info-block__title_blue"
            >
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
              {{ $t('collateral.howToGetWUSD') }}
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
              {{ $t('collateral.auctionDescription') }}
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
              <a
                :href="item.url"
                target="_blank"
                class="btn__doc"
              >
                {{ $t('meta.btns.download') }}
                <img
                  class="download"
                  src="~/assets/img/ui/download.svg"
                  alt=""
                >
              </a>
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
import {
  Path,
  Layout,
  TokenMap,
  TokenSymbols,
} from '~/utils/enums';
import { getGasPrice, getWalletAddress } from '~/utils/wallet';
import { WQRouter } from '~/abi';
import walletOperations from '~/plugins/mixins/walletOperations';
import { IS_PLUG_PROD } from '~/utils/locker-data';

export default {
  name: 'Collateral',
  mixins: [walletOperations],
  layout({ app }) {
    // TODO PLUG for release
    if (IS_PLUG_PROD) return Layout.DEFAULT;
    return app.$cookies.get('access') ? Layout.DEFAULT : Layout.GUEST;
  },
  data() {
    return {
      indexFAQ: [],
    };
  },
  computed: {
    ...mapGetters({
      isAuth: 'user/isAuth',
      userData: 'user/getUserData',

      totalSupply: 'collateral/getTotalSupply',
      availableAssets: 'collateral/getAvailableAssets',
      maxRatio: 'collateral/getMaxRatio',

      oraclePrices: 'oracle/getPrices',
      oracleSymbols: 'oracle/getSymbols',
      oracleCurrentPrices: 'oracle/getCurrentPrices',

      currentBalance: 'wallet/getBalanceData',
      isWalletConnected: 'wallet/getIsWalletConnected',
    }),
    documents() {
      return [
        {
          name: 'WUSD Formed.pdf',
          size: this.$tc('meta.units.mb', 2.9),
          url: 'docs/collateral/WUSD Formed.pdf',
        },
        {
          name: 'WUSD Liquidation Parameters.pdf',
          size: this.$tc('meta.units.mb', 1.7),
          url: 'docs/collateral/WUSD Liquidation Parameters.pdf',
        },
        {
          name: 'WUSD Price Stabilization Mechanism.pdf',
          size: this.$tc('meta.units.mb', 1.4),
          url: 'docs/collateral/WUSD Price Stabilization Mechanism.pdf',
        },
      ];
    },
    cards() {
      return [
        {
          title: this.$t('meta.coins.count.dollarsCount', { count: this.totalSupply }),
          subtitle: this.$t('collateral.marketSize'),
          isLoading: this.totalSupply === null,
        },
        {
          title: this.availableAssets.join(', '),
          subtitle: this.$t('collateral.availableAsset'),
          isLoading: this.availableAssets.length === 0,
        },
        {
          title: this.$t('meta.units.percentsCount', { count: `102-${this.maxRatio}` }),
          subtitle: this.$t('collateral.percent'),
          isLoading: this.maxRatio === null,
        },
      ];
    },
    FAQs() {
      return [
        {
          name: this.$t('collateral.faq1'),
          about: this.$t('collateral.res1'),
        },
        {
          name: this.$t('collateral.faq2'),
          about: this.$t('collateral.res2'),
        },
        {
          name: this.$t('collateral.faq3'),
          about: this.$t('collateral.res3'),
        },
        {
          name: this.$t('collateral.faq4'),
          about: this.$t('collateral.res4'),
        },
        {
          name: this.$t('collateral.faq5'),
          about: this.$t('collateral.res5'),
        },
        {
          name: this.$t('collateral.faq6'),
          about: this.$t('collateral.res6'),
        },
        {
          name: this.$t('collateral.faq7'),
          about: this.$t('collateral.res7'),
        },
        {
          name: this.$t('collateral.faq8'),
          about: this.$t('collateral.res8'),
        },
        {
          name: this.$t('collateral.faq9'),
          about: this.$t('collateral.res9'),
        },
      ];
    },
  },
  async beforeMount() {
    if (!this.isWalletConnected) {
      await this.$store.dispatch('wallet/checkWalletConnected', {
        nuxt: this.$nuxt,
        needConfirm: this.isAuth,
      });
    }
  },
  async mounted() {
    await this.$store.dispatch('collateral/fetchCollateralsCommonInfo');
  },
  methods: {
    async openModalGetWUSD() {
      if (!this.isAuth) {
        this.ShowToast(this.$t('messages.loginToContinue'));
        return;
      }
      await this.$store.dispatch('wallet/getBalance');
      this.ShowModal({
        key: modals.getWUSD,
        submit: async ({
          amountWUSD, collateral, percent, currency,
        }) => {
          this.SetLoader(true);
          const { result: { gas, gasPrice }, msg } = await this.$store.dispatch('oracle/feeSetTokensPrices');
          this.SetLoader(false);

          if (!gas || !gasPrice) {
            this.ShowToast(msg);
            return;
          }

          await this.ShowTxReceipt({
            title: this.$t('modals.setTokenPrice', { token: currency }),
            from: this.convertToBech32('wq', getWalletAddress()),
            fee: { gas, gasPrice },
          }).then(async () => {
            this.SetLoader(true);
            await this.$store.dispatch('oracle/setCurrentPriceTokens');

            await this.MakeApprove({
              tokenAddress: TokenMap[currency],
              contractAddress: this.ENV.WORKNET_ROUTER,
              amount: collateral,
              symbol: currency,
              approveTitle: this.$t('modals.approveRouter', { token: currency }),
            }).then(async () => {
              const collateralBN = new BigNumber(collateral).shiftedBy(+this.currentBalance[currency].decimals || 18).toFixed(0);
              const ratioBN = new BigNumber(percent).dividedBy(100).shiftedBy(18).toFixed(0);

              const fee = await getGasPrice(
                WQRouter,
                this.ENV.WORKNET_ROUTER,
                'produceWUSD',
                [collateralBN, ratioBN, currency],
              );

              this.SetLoader(false);
              if (!fee.gas || !fee.gasPrice) return;

              await this.ShowTxReceipt({
                from: this.convertToBech32('wq', getWalletAddress()),
                to: this.ENV.WORKNET_ROUTER,
                amount: amountWUSD,
                currency: TokenSymbols.WUSD,
                fee,
                title: this.$t('modals.takeWUSD'),
              }).then(async () => {
                const res = await this.$store.dispatch('collateral/sendProduceWUSD', {
                  collateral: collateralBN,
                  ratio: ratioBN,
                  currency,
                  fee,
                });
                if (res.ok) this.ShowToast(this.$t('modals.successBuyWUSD'), this.$t('meta.success'));
              });
            });
          }).finally(() => {
            this.SetLoader(false);
          });
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
  &__container {
    display: grid;
    grid-template-rows: 195px max-content;
    max-width: 1180px;
    grid-row-gap: 30px;
    width: 100%;
    box-sizing: border-box;
  }

  &__header {
    align-self: center;

    .title {
      max-width: 530px;
      font-weight: 500;
      color: $white;
      font-size: 45px;
      line-height: 110%;
      margin: 24px 0;

      &_sub {
        @extend .title;
        font-size: 16px;
        line-height: 115%;
        opacity: 0.5;
        text-align: justify;
        margin: 0;
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
      color: $blue;
      background-color: $white;
      border: 1px solid $blue100;
      border-radius: 6px !important;
      transition: .3s;

      &__doc {
        @extend .btn;
        display: flex;
        width: 220px;
        height: 46px;
        justify-content: center;
        align-items: center;
        margin: 0;
        text-decoration: none;

        .download {
          display: unset;
          vertical-align: unset;
          margin-left: 5px;
        }
      }

      &:hover {
        background-color: $blue100;
        border: 0;
      }

      &_bl {
        @extend .btn;
        background-color: $blue;
        border: unset;
        color: $white;

        &:hover {
          background-color: $darkblue;
        }
      }
    }

    .text {
      font-size: 16px;
      font-weight: 400;
      color: $black400;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      &__faq {
        color: $black600;
        font-weight: 500;

        &_gray {
          font-size: 16px;
          font-weight: 400;
          color: $black400;
          height: 0;
          transition: height 300ms;
          overflow: hidden;
        }

        &_opened {
          height: auto;
          font-size: 16px;
          font-weight: 400;
          color: $black400;
          transition: height 300ms;
          margin-top: 20px;
        }
      }

      &_blue {
        @extend .text;
        font-weight: 500;
        font-size: 18px;
        color: $blue;
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
      background-color: $white;
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

      &__loader-wrapper {
        width: 37.5px;
        height: 37.5px;
        position: relative;
      }

      &__loader {
        position: absolute;
        top: -10px;
        background: none;
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
        color: $black800;
        opacity: 0.5;

        &_black {
          color: $black800;
        }

        &_big {
          font-size: 25px;
          font-weight: 500;
        }

        &_blue {
          color: $blue;
          font-weight: 700;
        }

        &_small {
          font-size: 16px;
          font-weight: 400;
          color: $black400;
        }

        &_pad {
          padding: 0 0 20px 20px;
          width: 50%;
        }
      }

      &__subtitle {
        font-weight: 400;
        font-size: 16px;
        color: $black400;
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
          border: 1px solid $black100;
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
            color: $black300;
          }
        }
      }

      &__name {
        font-size: 16px;
        color: $black800;
        padding: 20px 20px 10px 20px;
        font-weight: 400;

        &_bold {
          font-weight: 500;
          font-size: 25px;
          color: $darkblue;
          line-height: 1;
          padding: 20px;
        }
      }

      &_blue {
        background-color: $blue;
        .info-block {
          &__name {
            color: $white;
            &_bold {
              color: $white;
            }
          }
          &__subtitle {
            color: $white;
          }
        }
        .btn {
          &:hover {
            background-color: $darkblue;
            color: $white;
          }
        }
      }
    }
  }
}
@include _767 {
  .collateral-page {
    &__container {
      grid-template-rows: auto auto;
      gap: 15px;
    }
    &__header {
      .title {
        font-size: 38px;
        width: 100%;
        &_sub {
          font-size: 16px;
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

        &__subtitle {
          margin-bottom: 20px;
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
          grid-gap: 0;

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
    &__header {
      .title {
        margin: 15px 0;
        &_sub {
          margin-top: 3px;
        }
      }
    }
  }
}
</style>
