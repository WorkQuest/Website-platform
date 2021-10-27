<template>
  <div class="staking-page">
    <div class="staking-page__container">
      <div class="staking-page__header">
        <div class="title">
          {{ $t('staking.mainHeader') }}
        </div>
        <div class="title_sub">
          {{ $t('staking.tempHeader') }}
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
                <div class="table__value table__value_gray">
                  {{ getFormattedAddress(el.item.poolAddress) }}
                </div>
              </template>
              <template #cell(totalStaked)="el">
                <div class="table__value">
                  {{ el.item.totalStaked }} {{ el.item.stakeTokenSymbol }}
                </div>
              </template>
              <template #cell(totalDistributed)="el">
                <div class="table__value">
                  {{ el.item.totalDistributed }} {{ el.item.tokenSymbol }}
                </div>
              </template>
              <template #cell(stakeTokenAddress)="el">
                <div class="table__value table__value_blue">
                  {{ getFormattedAddress(el.item.rewardTokenAddress) }}
                </div>
              </template>
              <template #cell(rewardTokenAddress)="el">
                <div class="table__value table__value_blue">
                  {{ getFormattedAddress(el.item.rewardTokenAddress) }}
                </div>
              </template>
              <template #cell(open)="el">
                <base-btn
                  class="btn_bl"
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
import modals from '~/store/modals/modals';
import { Chains, NativeTokenSymbolByChainId, StakingTypes } from '~/utils/enums';

export default {
  name: 'Staking',
  data() {
    return {
      firstLoading: true,
      fields: [
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
      ],
      poolsData: null,
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
      isConnected: 'web3/isConnected',
    }),
  },
  watch: {
    async isConnected(newValue) {
      if (this.firstLoading) return;
      const rightChain = await this.$store.dispatch('web3/chainIsCompareToCurrent', Chains.ETHEREUM);
      if (newValue && rightChain) {
        await this.getPoolsData();
      } else {
        this.poolsData = [];
      }
    },
  },
  async mounted() {
    this.SetLoader(true);
    await this.checkMetamaskStatus();
    await this.getPoolsData();
    this.SetLoader(false);
    this.firstLoading = false;
  },
  async beforeDestroy() {
    await this.$store.dispatch('web3/unsubscribeStakingActions');
  },
  methods: {
    async getPoolsData() {
      const rightChain = await this.$store.dispatch('web3/chainIsCompareToCurrent', Chains.ETHEREUM);
      if (!rightChain) {
        this.poolsData = [];
      }
      const [wqtPool, wusdPool] = await Promise.all([
        this.$store.dispatch('web3/fetchStakingInfo', { stakingType: StakingTypes.WQT }),
        this.$store.dispatch('web3/fetchStakingInfo', { stakingType: StakingTypes.WUSD }),
      ]);
      if (wqtPool && wusdPool) {
        wqtPool.poolAddress = process.env.STAKING;
        wqtPool.link = StakingTypes.WQT;

        const { netId } = await this.$store.dispatch('web3/getAccount');
        wusdPool.poolAddress = process.env.STAKING_NATIVE;
        wusdPool.stakeTokenSymbol = NativeTokenSymbolByChainId[netId];
        wusdPool.link = StakingTypes.WUSD;
        this.poolsData = [wqtPool, wusdPool];
      }
    },
    async checkMetamaskStatus() {
      if (!this.isConnected) {
        if (typeof window.ethereum === 'undefined') {
          localStorage.setItem('metamaskStatus', 'notInstalled');
          this.ShowModal({
            key: modals.status,
            img: '~assets/img/ui/cardHasBeenAdded.svg',
            title: 'Please install Metamask!',
            subtitle: 'Please click install...',
            button: 'Install',
            type: 'installMetamask',
          });
        } else {
          localStorage.setItem('metamaskStatus', 'installed');
          await this.$store.dispatch('web3/goToChain', { chain: Chains.ETHEREUM });
          await this.$store.dispatch('web3/connect');
        }
      }
    },
    handleOpenPool(el) {
      this.$router.push(`/staking/${el.item.link}`);
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
