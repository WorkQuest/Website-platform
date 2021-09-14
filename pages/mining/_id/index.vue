<template>
  <div class="mining-page">
    <div class="mining-page__container">
      <div class="mining-page__header">
        <base-btn
          class="btn"
          @click="handleBackToMainMining()"
        >
          <template v-slot:left>
            <span class="icon-chevron_left" />
          </template>
          {{ $t('mining.back') }}
        </base-btn>
        <base-btn
          v-if="!isConnected"
          mode="light"
          class="mining-page__connect"
          @click="connectToMetamask"
        >
          {{ $t('mining.connectWallet') }}
        </base-btn>
        <base-btn
          v-else
          mode="light"
          :disabled="true"
          class="mining-page__connect"
        >
          {{ $t('meta.connected') }}
        </base-btn>
      </div>
      <div class="mining-page__content">
        <div class="info-block__grid">
          <div class="info-block__icons">
            <div
              v-for="(item, i) in iconUrls()"
              :key="i"
              class="icon-cont"
            >
              <img
                class="icon-cont__img"
                :src="item"
                alt=""
              >
            </div>
          </div>
          <div class="info-block__about">
            <div class="info-block__title_black info-block__title_big">
              {{ $t(`mining.${miningPoolId === 'BNB' ? 'wusdBnbPool' : 'wusdEthPool'}`) }}
            </div>
            <div class="info-block__title">
              {{ $tc('mining.dollarsCount', "176 904.49") }}
            </div>
          </div>
          <div class="info-block__btns">
            <base-btn
              :link="'https://app.uniswap.org/#/add/v2/0x06677dc4fe12d3ba3c7ccfd0df8cd45e4d4095bf/ETH'"
              class="btn_bl"
            >
              {{ $t('mining.addLiquidity') }}
            </base-btn>
          </div>
        </div>
        <div class="info-block__double">
          <div
            v-for="(item, i) in cards"
            :key="i"
            class="info-block__third"
          >
            <div class="info-block third">
              <div class="third__wrapper">
                <div class="third__container">
                  <div class="third info-block__title_big info-block__title_blue">
                    {{ item.title }}
                  </div>
                  <div class="info-block__title_small">
                    {{ item.subtitle }}
                  </div>
                </div>
                <div class="third bnt__container">
                  <base-btn
                    v-if="item.button"
                    :mode="'outline'"
                    class="bnt__claim"
                  >
                    {{ $t('mining.claimReward') }}
                  </base-btn>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="info-block">
          <div class="info-block__name_bold">
            {{ $t('mining.liquidityPoolProviders') }}
          </div>
          <div class="info-block__title_small info-block__title_pad">
            {{ $t('mining.liquidityProvidersEarn') }}
          </div>
        </div>
        <div class="info-block">
          <div class="info-block__name">
            {{ $t('mining.liquidity') }}
          </div>
          <img
            class="info-block__chart"
            src="~assets/img/ui/chart.svg"
            alt=""
          >
        </div>
        <div class="info-block">
          <div class="info-block__name">
            {{ $t('mining.transactions') }}
          </div>
          <div class="mining-page__table">
            <b-table
              :items="items"
              :fields="testFields"
              borderless
              caption-top
              thead-class="table__header"
              tbody-tr-class="table__row"
            >
              <template #cell(userName)="el">
                <div class="user__info">
                  <img
                    class="ava"
                    src="~/assets/img/temp/avatar-small.jpg"
                    alt=""
                  >
                  <div class="user__name">
                    {{ el.item.userName }}
                  </div>
                </div>
              </template>
              <template #cell(userID)="el">
                <div class="user__value_gray">
                  {{ el.item.userID }}
                </div>
              </template>
              <template #cell(txHash)="el">
                <div class="user__value_gray">
                  {{ el.item.txHash }}
                </div>
              </template>
              <template #cell(time)="el">
                <div class="user__value_gray">
                  {{ el.item.time }}
                </div>
              </template>
              <template #cell(status)="el">
                <div class="user__value_green">
                  {{ el.item.status }}
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
import { mapGetters } from 'vuex';
import modals from '~/store/modals/modals';

export default {
  data() {
    return {
      miningPoolId: localStorage.getItem('miningPoolId'),
      items: [
        {
          userName: this.$t('pension.table.userName'),
          avaUrl: '~/assets/img/social/GOOGLE_+_.png',
          userID: this.$t('pension.table.userId'),
          txHash: this.$t('pension.table.txHash'),
          time: this.$t('pension.table.time'),
          amount: this.$tc('referral.wqtCount', 12),
          status: this.$t('pension.table.status'),
        },
        {
          userName: this.$t('pension.table.userName'),
          avaUrl: '~/assets/img/social/GOOGLE_+_.png',
          userID: this.$t('pension.table.userId'),
          txHash: this.$t('pension.table.txHash'),
          time: this.$t('pension.table.time'),
          amount: this.$tc('referral.wqtCount', 12),
          status: this.$t('pension.table.status'),
        },
      ],
      testFields: [
        {
          key: 'userName',
          label: this.$t('referral.tableHead.name'),
          thStyle: {
            padding: '0 0 0 23px',
            height: '27px',
            lineHeight: '27px',
          },
          tdAttr: {
            style: 'padding: 0 0 0 23px; height: 64px; line-height: 64px',
          },
        },
        {
          key: 'userID',
          label: this.$t('referral.tableHead.userID'),
          thStyle: {
            padding: '0',
            height: '27px',
            lineHeight: '27px',
          },
          tdAttr: {
            style: 'padding: 0; height: 64px; line-height: 64px',
          },
        },
        {
          key: 'txHash',
          label: this.$t('referral.tableHead.txHash'),
          thStyle: {
            padding: '0',
            height: '27px',
            lineHeight: '27px',
          },
          tdAttr: {
            style: 'padding: 0; height: 64px; line-height: 64px',
          },
        },
        {
          key: 'time',
          label: this.$t('referral.tableHead.time'),
          thStyle: {
            padding: '0',
            height: '27px',
            lineHeight: '27px',
          },
          tdAttr: {
            style: 'padding: 0; height: 64px; line-height: 64px',
          },
        },
        {
          key: 'amount',
          label: this.$t('referral.tableHead.amount'),
          thStyle: {
            padding: '0',
            height: '27px',
            lineHeight: '27px',
          },
          tdAttr: {
            style: 'padding: 0; height: 64px; line-height: 64px',
          },
        },
        {
          key: 'status',
          label: this.$t('referral.tableHead.status'),
          thStyle: {
            padding: '0',
            height: '27px',
            lineHeight: '27px',
          },
          tdAttr: {
            style: 'padding: 0; height: 64px; line-height: 64px',
          },
        },
      ],
      btns: [
        {
          name: this.$t('mining.addLiquidity'),
          clickFunc: () => {
            window.location.href = 'https://app.uniswap.org/#/add/v2/0x06677dc4fe12d3ba3c7ccfd0df8cd45e4d4095bf/ETH';
            return false;
          },
        },
      ],
      cards: [
        {
          title: this.$tc('mining.dollarsCount', '417.1M'),
          subtitle: this.$t('mining.liquidity'),
          button: false,
        },
        {
          title: this.$tc('mining.dollarsCount', '417.1M'),
          subtitle: this.$t('mining.totalReward'),
          button: true,
        },
      ],
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
      isConnected: 'web3/isConnected',
    }),
  },
  async mounted() {
    this.SetLoader(true);
    this.SetLoader(false);
  },
  methods: {
    async connectToMetamask() {
      await this.$store.dispatch('web3/connect');
    },
    handleBackToMainMining() {
      this.$router.push('/mining');
    },
    iconUrls() {
      return [
        require('~/assets/img/ui/wqt-logo.svg'),
        require(`~/assets/img/ui/${this.miningPoolId === 'BNB' ? 'bnb' : 'hromb'}-logo.svg`),
      ];
    },
  },
};
</script>

<style lang="scss" scoped>
.mining-page {
  background: linear-gradient(to bottom, #103D7C 325px, #f6f8fa 325px);
  display: flex;
  justify-content: center;

  &__connect {
    width: 150px;
  }

  &__container {
    display: grid;
    grid-template-rows: 65px max-content;
    max-width: 1180px;
    grid-row-gap: 50px;
    width: 100%;
    gap: 20px;
    padding: 10px;
    box-sizing: border-box;
  }

  &__header {
    align-self: flex-end;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .btn {
      background-color: unset;
      color: #fff;
      max-width: 100px;
      padding: 0;
      gap: 5px;
      font-size: 18px;

      .icon-chevron_left {
        font-size: 26px;
        &:before {
          color: #fff;
        }
      }
    }
  }

  &__content {
    display: grid;
    grid-row-gap: 30px;
    width: 100%;

    .info-block {
      background-color: #fff;
      border-radius: 6px;

      &__chart {
        width: 100%;
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

      &__btns {
        display: grid;
        gap: 10px;
        align-content: center;
      }

      &__about {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
      }

      &__icons {
        display: flex;
        flex-wrap: wrap;
        position: relative;
        height: 67px;
        align-self: center;
      }

      .icon-cont {
        width: 41px;

        &__img {
          position: absolute;
          height: 67px;
          width: 67px;
        }
      }

      &__grid {
        @extend .info-block;
        display: grid;
        grid-template-columns: 1fr 5fr 2fr;
        gap: 20px;
        padding: 20px;
        position: relative;
      }

      &__double {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
      }

      &__third {
        @extend .info-block;
        padding: 20px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
      }

      &__name {
        font-size: 16px;
        color: #1D2127;
        padding: 20px 20px 10px 20px;
        font-weight: 400;

        &_bold {
          font-weight: 700;
          font-size: 20px;
          color: #0083C7;
          line-height: 1;
          padding: 20px;
        }
      }
    }

    .ava {
      height: 33px;
      width: 33px;
      border-radius: 50%;
      background-color: #fff;
      flex: none;
    }

    .user {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: 10px;
      width: calc(100% - 40px);
      margin: 0 0 0 20px;
      line-height: 33px;

      &__info {
        display: grid;
        grid-template-columns: 33px 1fr;
        align-items: center;
        gap: 10px;
      }

      &__name {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 16px;
      }

      &__value {
        font-size: 16px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-weight: 500;

        &_green {
          @extend .user__value;
          color: #00AA5B;
        }

        &_gray {
          @extend .user__value;
          color: #7C838D;
          font-weight: 400;
        }
      }
    }
  }

  &__table {
    .table {
      margin: 0;
      border-radius: 0 !important;
    }
  }

  @include _991 {
    &__table {
      overflow: auto;
      width: calc(100vw - 20px);

      .table {
        width: 1180px;
      }
    }
  }

  @include _767 {
    &__container {
      grid-template-rows: auto auto;
      gap: 15px;
    }
    &__header {
      .btn {
        justify-content: left;
      }
    }
    &__content {
      .info-block {
        &__grid {
          grid-template-columns: 105px auto;

          .info-block__btns {
            grid-column-start: 2;
            grid-column-end: 3;
            grid-template-columns: repeat(2, 1fr);
            grid-template-rows: unset;
          }
        }
        &__title {
          &_pad {
            width: 80%;
          }
        }
      }
    }
  }

  @include _575 {
    &__content {
      .info-block {
        &__grid {
          .info-block__btns {
            grid-column-start: 1;
          }
        }
        &__double {
          grid-template-columns: repeat(2, 1fr);
        }
        &__title {
          &_pad {
            width: 100%;
            padding-right: 20px;
          }
        }
      }
    }
  }
}
.third {
  width: 100%;
  align-self: center;
  &__wrapper {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
