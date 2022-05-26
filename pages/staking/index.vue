<template>
  <div class="staking-page">
    <div class="staking-page__container">
      <div class="staking-page__header">
        <div class="title">
          {{ $t('staking.mainHeader') }}
        </div>
        <div class="title_sub">
          {{ $t('staking.stakingSub') }}
        </div>
      </div>
      <div class="staking-page__content">
        <div class="info-block">
          <div class="info-block__name_bold">
            {{ $t('staking.pools') }}
          </div>
          <div class="staking-page__table">
            <b-table
              :items="poolsData"
              :fields="fields"
              borderless
              caption-top
              thead-class="table__header"
              tbody-tr-class="table__row"
            >
              <template #cell(poolAddress)="el">
                <a
                  :href="getExplorerRef(el.item.poolAddress)"
                  target="_blank"
                  class="table__value table__value_gray"
                >
                  {{ !!el.item.poolAddress ? CutTxn(convertToBech32('wq', el.item.poolAddress), 8, 4) : '' }}
                </a>
              </template>
              <template #cell(totalStaked)="el">
                <div class="table__value">
                  {{ NumberWithSpaces(el.item.totalStaked) }} {{ el.item.stakeTokenSymbol }}
                </div>
              </template>
              <template #cell(totalDistributed)="el">
                <div class="table__value">
                  {{ NumberWithSpaces(el.item.totalDistributed) }} {{ el.item.tokenSymbol }}
                </div>
              </template>
              <template #cell(stakeTokenAddress)="el">
                <a
                  :href="getExplorerRef(el.item.rewardTokenAddress)"
                  target="_blank"
                  class="table__value table__value_blue"
                >
                  {{
                    !!el.item.rewardTokenAddress ? CutTxn(convertToBech32('wq', el.item.rewardTokenAddress), 8, 4) : ''
                  }}
                </a>
              </template>
              <template #cell(rewardTokenAddress)="el">
                <div class="table__value table__value_blue">
                  <a
                    :href="getExplorerRef(el.item.rewardTokenAddress)"
                    target="_blank"
                    class="table__value table__value_blue"
                  >
                    {{
                      !!el.item.rewardTokenAddress ? CutTxn(convertToBech32('wq', el.item.rewardTokenAddress), 8, 4) : ''
                    }}
                  </a>
                </div>
              </template>
              <template #cell(open)="el">
                <base-btn
                  class="btn_bl"
                  data-selector="OPEN-STAKING"
                  @click="handleOpenPool(el)"
                >
                  {{ $t('staking.open') }}
                </base-btn>
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
import {
  ExplorerUrl, Path, StakingTypes,
} from '~/utils/enums';

export default {
  name: 'Staking',
  computed: {
    ...mapGetters({
      isWalletConnected: 'wallet/getIsWalletConnected',
      stakingPoolsData: 'wallet/getStakingPoolsData',
    }),
    fields() {
      return [
        {
          key: 'poolAddress',
          label: this.$t('staking.tableHead.poolAddress'),
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
          key: 'totalStaked',
          label: this.$t('staking.tableHead.totalStaked'),
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
          key: 'totalDistributed',
          label: this.$t('staking.tableHead.totalDistributed'),
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
          key: 'stakeTokenAddress',
          label: this.$t('staking.tableHead.stakeTokenAddress'),
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
          key: 'rewardTokenAddress',
          label: this.$t('staking.tableHead.rewardTokenAddress'),
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
          key: 'open',
          label: '',
          thStyle: {
            padding: '0',
            height: '27px',
            lineHeight: '27px',
          },
          tdAttr: {
            style: 'padding-left: 0; padding-right: 20px',
          },
        },
      ];
    },
    poolsData() {
      return [this.stakingPoolsData.WUSD, this.stakingPoolsData.WQT];
    },
  },
  async mounted() {
    this.SetLoader(true);
    await this.$store.dispatch('wallet/checkWalletConnected', { nuxt: this.$nuxt });
    if (this.isWalletConnected === false) return;
    await this.getPoolsData();
    this.SetLoader(false);
  },
  methods: {
    getExplorerRef(address) {
      if (!address) return ExplorerUrl;
      return `${ExplorerUrl}/address/${address.toLowerCase()}`;
    },
    async getPoolsData() {
      await Promise.all([
        this.$store.dispatch('wallet/getStakingPoolsData', StakingTypes.WQT),
        this.$store.dispatch('wallet/getStakingPoolsData', StakingTypes.WUSD),
      ]);
    },
    handleOpenPool(el) {
      this.$router.push(`${Path.STAKING}/${el.item.link.toLowerCase()}`);
    },
    getFormattedAddress(address) {
      return !address ? '' : `${address.slice(0, 8)}...${address.slice(-4)}`;
    },
  },
};
</script>

<style lang="scss" scoped>
.staking-page {
  background: linear-gradient(to bottom, #103D7C 370px, #f6f8fa 370px);
  display: flex;
  justify-content: center;

  &__container {
    display: grid;
    grid-template-rows: 190px max-content;
    max-width: 1180px;
    grid-row-gap: 20px;
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

    .btn {
      box-sizing: border-box;
      font-weight: 400;
      font-size: 16px;
      color: #0083C7;
      border: 1px solid #0083C71A;
      border-radius: 6px;
      transition: .3s;
      height: 35px;
      margin-top: 3px;

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

    .info-block {
      background-color: #fff;
      border-radius: 6px;

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

  &__table {
    .table {
      margin: 0;
      box-shadow: 0 17px 17px rgba(0, 0, 0, 0.05), 0 5px 5px rgba(0, 0, 0, 0.03), 0 2px 2px rgba(0, 0, 0, 0.025), 0 0.7px 0.7px rgba(0, 0, 0, 0.01);
      border-radius: 6px;

      &__value {
        font-weight: 400;
        font-size: 16px;
        color: #1D2127;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        &_gray {
          color: #7C838D;
        }

        &_blue {
          color: #0083C7;
        }
      }
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
    background: linear-gradient(to bottom, #103D7C 320px, #f6f8fa 320px);
    &__container {
      grid-template-rows: auto auto;
      gap: 24px;
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
      grid-template-rows: auto;
    }
  }
}
</style>
