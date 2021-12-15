<template>
  <div class="staking-page">
    <div class="staking-page__container">
      <div class="staking-page__header">
        <div class="head-btns">
          <base-btn
            class="btn"
            @click="handleBackToMainstaking()"
          >
            <template v-slot:left>
              <span class="icon-chevron_left" />
            </template>
            {{ $t('staking.back') }}
          </base-btn>
          <base-btn
            class="btn_wh"
            @click="showClaimModal"
          >
            {{ $t('staking.claimRewards') }}
          </base-btn>
        </div>
        <div class="head-cont">
          <div class="title">
            {{ $t('staking.pool') }}
          </div>
          <div class="link-cont">
            <div class="link-cont__link link-cont__link_gray">
              {{ getPoolAddress() }}
            </div>
            <button
              type="button"
              @click="doCopy"
            >
              <span class="icon-copy link-cont__icon" />
            </button>
          </div>
        </div>
        <div
          v-if="poolData && !poolData.isNative"
          class="link-cont"
        >
          <div class="link-cont__link">
            {{ $t('staking.stakeTokenAddress') }}
          </div>
          <a
            :href="etherscanRef"
            target="_blank"
            type="button"
          >
            <img
              src="~assets/img/ui/launch.svg"
              alt=""
              class="link-cont__icon"
            >
          </a>
        </div>
        <div
          v-if="poolData && !poolData.isNative"
          class="link-cont"
        >
          <div class="link-cont__link">
            {{ $t('staking.rewardTokenAddress') }}
          </div>
          <a
            :href="etherscanRef"
            target="_blank"
            type="button"
          >
            <img
              src="~assets/img/ui/launch.svg"
              alt=""
              class="link-cont__icon"
            >
          </a>
        </div>
      </div>
      <div class="staking-page__content">
        <div class="info-block__couple">
          <div
            v-for="(item, i) in cards"
            :key="i"
            class="info-block__half"
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
            {{ $t('staking.staking') }}
          </div>
          <div class="info-block__info-cards">
            <div
              v-for="(item, i) in stakingCards"
              :key="i"
              class="info-card"
            >
              <div class="info-card__name">
                {{ item.name }}
              </div>
              <div class="info-card__about">
                {{ item.about }}
              </div>
            </div>
          </div>
        </div>
        <div class="info-block">
          <div class="info-block__name_bold">
            {{ $t('staking.userInformation') }}
          </div>
          <div class="info-block__info-cards">
            <div
              v-for="(item, i) in userInfoCards"
              :key="i"
              class="info-card"
            >
              <div class="info-card__name">
                {{ item.name }}
              </div>
              <div class="info-card__about">
                {{ item.about }}
              </div>
            </div>
          </div>
        </div>
        <div class="info-block">
          <div class="info-block__name_bold">
            {{ $t('staking.stake') }}
          </div>
          <div class="info-block__info-cards">
            <div
              v-for="(item, i) in stakeCards"
              :key="i"
              class="info-card"
            >
              <div class="info-card__name">
                {{ item.name }}
              </div>
              <div class="info-card__about">
                {{ item.about }}
              </div>
            </div>
          </div>
          <div class="info-block__btns-cont">
            <base-btn @click="handleAutoRenewal">
              {{ $t('staking.autoRenewal') }}
            </base-btn>
            <base-btn
              mode="outline"
              @click="showUnstakeModal"
            >
              {{ $t('staking.unstake') }}
            </base-btn>
            <base-btn
              mode="outline"
              @click="showStakeModal"
            >
              {{ $t('staking.stake') }}
            </base-btn>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import { mapGetters } from 'vuex';
import BigNumber from 'bignumber.js';
import modals from '~/store/modals/modals';
import { Chains, NativeTokenSymbolByChainId, StakingTypes } from '~/utils/enums';

export default {
  name: 'StakingPool',
  data() {
    return {
      poolData: null,
      userInfo: null,
      firstLoading: true,
      updateInterval: null,
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
      isConnected: 'web3/isConnected',
    }),
    slug() {
      return this.$route.params.id;
    },
    stakeDurationIsOver() {
      return this.userInfo && moment.duration(moment(this.userInfo.date).diff(moment.now())).asMilliseconds() <= 0;
    },
    cards() {
      if (!this.poolData) {
        return [
          {
            subtitle: this.$t('staking.totalStaked'),
          },
          {
            subtitle: this.$t('staking.totalDistributed'),
          },
        ];
      }
      return [
        {
          title: this.$tc(`staking.${this.poolData.stakeTokenSymbol || this.slug}Count`, this.poolData.totalStaked),
          subtitle: this.$t('staking.totalStaked'),
        },
        {
          title: this.$tc(`staking.${this.poolData.tokenSymbol || this.slug}Count`, this.poolData.totalDistributed),
          subtitle: this.$t('staking.totalDistributed'),
        },
      ];
    },
    stakingCards() {
      if (!this.poolData) {
        return [
          {
            name: this.$t('staking.stakingCards.distributionTime'),
          },
          {
            name: this.$t('staking.stakingCards.rewardTotal'),
          },
          {
            name: this.$t('staking.stakingCards.takePeriod'),
          },
          {
            name: this.$t('staking.stakingCards.claimPeriod'),
          },
        ];
      }
      return [
        {
          name: this.$t('staking.stakingCards.distributionTime'),
          about: this.$t('staking.min', { n: this.poolData.distributionTime }),
        },
        {
          name: this.$t('staking.stakingCards.rewardTotal'),
          about: `${this.poolData.rewardTotal} ${this.poolData.tokenSymbol}`,
        },
        {
          name: this.$t('staking.stakingCards.takePeriod'),
          about: this.$t('staking.hours', { n: this.poolData.stakePeriod }),
        },
        {
          name: this.$t('staking.stakingCards.claimPeriod'),
          about: this.$t('staking.hours', { n: this.poolData.claimPeriod }),
        },
      ];
    },
    userInfoCards() {
      if (!this.userInfo) {
        return [
          {
            name: this.$t('staking.userInformationCards.staked'),
          },
          {
            name: this.$t('staking.userInformationCards.yourBalance'),
          },
          {
            name: this.$t('staking.userInformationCards.claimed'),
          },
        ];
      }
      const data = [
        {
          name: this.$t('staking.userInformationCards.staked'),
          about: this.$tc(`staking.${this.poolData.stakeTokenSymbol || this.slug}Count`, this.userInfo.staked),
        },
        {
          name: this.$t('staking.userInformationCards.yourBalance'),
          about: this.$tc(`staking.${this.poolData.stakeTokenSymbol || this.slug}Count`, this.userInfo.balance),
        },
        {
          name: this.$t('staking.userInformationCards.claimed'),
          about: this.$tc(`staking.${this.poolData.tokenSymbol || this.slug}Count`, this.userInfo.claim),
        },
      ];
      if (this.userInfo.date && this.userInfo.staked !== '0') {
        const now = moment.now();
        const ends = moment(this.userInfo.date);
        const minutes = ends.diff(now, 'minutes');
        const hours = ends.diff(now, 'hours');
        const days = ends.diff(now, 'days');
        if (minutes <= 60) {
          data.push({
            name: this.$t('staking.stakingCards.duration'),
            about: this.$t('staking.min', { n: minutes >= 0 ? minutes : 0 }),
          });
        } else if (hours <= 24) {
          data.push({
            name: this.$t('staking.stakingCards.duration'),
            about: this.$t('staking.hours', { n: hours >= 0 ? hours : 0 }),
          });
        } else {
          data.push({
            name: this.$t('staking.stakingCards.duration'),
            about: this.$t('staking.days', { n: days >= 0 ? days : 0 }),
          });
        }
      }
      return data;
    },
    stakeCards() {
      if (!this.poolData) {
        return [
          {
            name: this.$t('staking.stakeCards.stakeMin'),
          },
          {
            name: this.$t('staking.stakeCards.stakeLimit'),
          },
          {
            name: this.$t('staking.stakeCards.periodUpdate'),
          },
        ];
      }
      return [
        {
          name: this.$t('staking.stakeCards.stakeMin'),
          about: this.$t(`staking.${this.poolData.stakeTokenSymbol || this.slug}Count`, { n: this.poolData.minStake }),
        },
        {
          name: this.$t('staking.stakeCards.stakeLimit'),
          about: this.$t(`staking.${this.poolData.stakeTokenSymbol || this.slug}Count`, { n: this.poolData.maxStake }),
        },
        {
          name: this.$t('staking.stakeCards.periodUpdate'),
          about: this.$t('staking.hours', { n: this.poolData.stakePeriod }),
        },
      ];
    },
    etherscanRef() {
      if (!this.poolData) return '/';
      return (process.env.PROD === 'true') ? `https://etherscan.io/address/${this.poolData.rewardTokenAddress}`
        : `https://rinkeby.etherscan.io/address/${this.poolData.rewardTokenAddress}`;
    },
  },
  watch: {
    async isConnected(newValue) {
      if (this.firstLoading) return;
      const rightChain = await this.$store.dispatch('web3/chainIsCompareToCurrent', Chains.ETHEREUM);
      if (newValue && rightChain) {
        await this.initPage();
      } else {
        this.userInfo = null;
        this.poolData = null;
        clearInterval(this.updateInterval);
      }
    },
  },
  async mounted() {
    await this.initPage();
  },
  async beforeDestroy() {
    await this.$store.dispatch('web3/unsubscribeActions');
    clearInterval(this.updateInterval);
  },
  methods: {
    async initPage() {
      this.SetLoader(true);
      await this.checkMetamaskStatus();
      await this.getPoolData();
      await this.getUserInfo();
      const events = this.slug === StakingTypes.WQT
        ? ['tokensStaked', 'tokensClaimed', 'tokensUnstaked']
        : ['Staked', 'Claimed', 'Unstaked'];
      await this.$store.dispatch('web3/fetchStakingActions', {
        stakingType: this.slug,
        events,
        callback: () => {
          this.getPoolData();
          this.getUserInfo();
        },
      });
      this.updateInterval = setInterval(() => this.getUserInfo(), 30000);
      this.firstLoading = false;
      this.SetLoader(false);
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
          const rightChain = await this.$store.dispatch('web3/chainIsCompareToCurrent', Chains.ETHEREUM);
          if (!rightChain) await this.$store.dispatch('web3/goToChain', { chain: Chains.ETHEREUM });
          await this.$store.dispatch('web3/connectToMetaMask');
        }
      }
    },
    handleAutoRenewal() {
      if (new BigNumber(this.userInfo._staked).isGreaterThanOrEqualTo(this.poolData._maxStake)) {
        this.ShowModal({
          key: modals.status,
          img: require('~/assets/img/ui/warning.svg'),
          title: this.$t('staking.notification'),
          subtitle: this.$t('staking.stakeLimitReached'),
        });
        return;
      }
      let renewalValue;
      if (this.userInfo.claim >= this.poolData._maxStake) {
        renewalValue = new BigNumber(this.poolData._maxStake).minus(this.userInfo._staked).toString();
      } else {
        renewalValue = this.userInfo.claim;
      }
      if (!+renewalValue) {
        this.ShowModal({
          key: modals.status,
          img: require('~/assets/img/ui/warning.svg'),
          title: this.$t('staking.notification'),
          subtitle: this.$t('staking.notEnoughClaim'),
        });
        return;
      }
      this.ShowModal({
        key: modals.areYouSureNotification,
        title: this.$t('modals.areYouSure'),
        text: this.$t('staking.renewalTokens', { n: renewalValue }),
        callback: async () => {
          this.SetLoader(true);
          await this.$store.dispatch('web3/autoRenewal', { stakingType: this.slug });
          this.SetLoader(false);
        },
      });
    },
    async getPoolData() {
      this.poolData = await this.$store.dispatch('web3/fetchStakingInfo', { stakingType: this.slug });
      if (this.slug === StakingTypes.WUSD) {
        const { netId } = await this.$store.dispatch('web3/getAccount');
        this.poolData.stakeTokenSymbol = NativeTokenSymbolByChainId[netId];
        this.poolData.tokenSymbol = NativeTokenSymbolByChainId[netId];
        this.poolData.isNative = true;
      }
    },
    async getUserInfo() {
      this.userInfo = await this.$store.dispatch('web3/fetchStakingUserInfo', { stakingType: this.slug, decimals: this.poolData.decimals });
    },
    getPoolAddress() {
      if (this.slug === StakingTypes.WQT) return process.env.WQT_STAKING;
      if (this.slug === StakingTypes.WUSD) return process.env.WQT_STAKING_NATIVE;
      return '';
    },
    handleBackToMainstaking() {
      this.$router.push('/staking');
    },
    doCopy(ev) {
      ev.stopPropagation();
      this.$copyText(this.getPoolAddress()).then(() => {});
      this.ShowModal({
        key: modals.copiedSuccess,
      });
    },
    async showClaimModal() {
      if (!this.userInfo || !this.poolData) return;
      await this.checkMetamaskStatus();
      if (this.userInfo.claim === '0') {
        this.ShowModal({
          key: modals.status,
          img: require('~/assets/img/ui/warning.svg'),
          title: this.$t('staking.notification'),
          recipient: '',
          subtitle: this.$t('modals.nothingToClaim'),
        });
        return;
      }
      const txFeeData = await this.$store.dispatch('web3/getStakingRewardTxFee', this.slug);
      if (txFeeData?.ok === false) {
        await this.ShowModal({
          key: modals.status,
          title: this.$t('staking.notification'),
          subtitle: this.$t('staking.cannotClaimYet'),
        });
        return;
      }
      this.ShowModal({
        key: modals.claim,
        txFee: txFeeData.result,
        stakingType: this.slug,
        rewardAmount: this.userInfo.claim,
        tokenSymbol: this.poolData.tokenSymbol,
      });
    },
    async showUnstakeModal() {
      if (!this.userInfo || !this.poolData) return;
      if (this.slug !== StakingTypes.WUSD && !this.stakeDurationIsOver) {
        await this.ShowModal({
          key: modals.status,
          img: require('~/assets/img/ui/warning.svg'),
          title: this.$t('staking.notification'),
          subtitle: this.$t('staking.stakeDurationIsNotOver'),
        });
        return;
      }
      if (+this.userInfo.staked === 0) {
        await this.ShowModal({
          key: modals.status,
          img: require('~/assets/img/ui/warning.svg'),
          title: this.$t('staking.notification'),
          subtitle: this.$t('staking.stakeIsEmpty'),
        });
        return;
      }
      await this.checkMetamaskStatus();
      const stakingType = this.slug === StakingTypes.WQT ? StakingTypes.WQT : StakingTypes.WUSD;
      this.ShowModal({
        key: modals.claimRewards,
        type: 2,
        stakingType,
        decimals: this.poolData.decimals,
        staked: this.userInfo._staked,
      });
    },
    async showStakeModal() {
      if (!this.userInfo || !this.poolData) return;
      if (+this.userInfo.balance === 0) {
        await this.ShowModal({
          key: modals.status,
          img: require('~/assets/img/ui/warning.svg'),
          title: this.$t('staking.notification'),
          subtitle: this.$t('staking.notEnoughFunds'),
        });
        return;
      }
      if (new BigNumber(this.userInfo._staked).isGreaterThanOrEqualTo(this.poolData._maxStake)) {
        await this.ShowModal({
          key: modals.status,
          img: require('~/assets/img/ui/warning.svg'),
          title: this.$t('staking.notification'),
          subtitle: this.$t('staking.stakeLimitReached'),
        });
        return;
      }
      await this.checkMetamaskStatus();
      this.ShowModal({
        key: modals.claimRewards,
        type: 1,
        balance: this.userInfo._balance,
        decimals: this.poolData.decimals,
        stakingType: this.slug,
        minStake: this.poolData.minStake === '0' ? this.poolData._minStake : this.poolData.minStake,
        maxStake: this.poolData._maxStake,
        staked: this.userInfo._staked,
        alreadyStaked: +this.userInfo.staked !== 0, // for duration selecting
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.staking-page {
  background: linear-gradient(to bottom, #103D7C 325px, #f6f8fa 325px);
  display: flex;
  justify-content: center;

  &__container {
    display: grid;
    grid-template-rows: repeat(2, max-content);
    max-width: 1180px;
    width: 100%;
    gap: 40px;
    padding: 30px 10px 10px 10px;
    box-sizing: border-box;
  }

  &__header {
    display: grid;
    grid-template-rows: 50px repeat(3, auto);
    gap: 20px;

    .head-btns {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .head-cont {
      display: grid;
      grid-template-columns: max-content 1fr;
      gap: 10px;
      line-height: 1;
      align-items: flex-end;
    }

    .title {
      font-size: 35px;
      font-weight: 500;
      color: #fff;
    }

    .link-cont {
      display: grid;
      grid-template-columns: minmax(70px, max-content) 23px;
      gap: 10px;
      align-items: flex-end;
      button {
        margin-top: 3px;
      }
      &__link {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 18px;
        font-weight: 500;
        color: #fff;

        &_gray {
          color: #F7F8FA;
          font-weight: 400;
        }
      }
      &__icon {
        font-size: 20px;
        &::before {
          color: #fff;
        }
      }
    }

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

      &_wh {
        width: 200px;
        height: 35px;
        background-color: #fff;
        color: #0083C7;
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

      &__btns-cont {
        padding: 0 20px 20px;
        display: grid;
        gap: 20px;
        grid-template-columns: repeat(5, 1fr);
        direction: rtl;
      }

      &__info-cards {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
        padding: 0 20px 20px;

        .info-card {
          display: grid;
          grid-template-rows: repeat(2, 1fr);
          background-color: #F7F8FA;
          height: 104px;
          padding: 20px;
          gap: 10px;
          border-radius: 6px;

          &__name {
            font-size: 16px;
            font-weight: 400;
            color: #8D96A1;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          &__about {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            font-weight: 500;
            font-size: 18px;
            color: #0083C7;
          }
        }
      }

      &__title {
        font-size: 20px;
        font-weight: 600;
        color: #1D2127;
        opacity: 0.5;

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
      }

      &__couple {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
      }

      &__half {
        @extend .info-block;
        padding: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;

        box-shadow: 0 17px 17px rgba(0, 0, 0, 0.05), 0 5px 5px rgba(0, 0, 0, 0.03), 0 2px 2px rgba(0, 0, 0, 0.025), 0 0.7px 0.7px rgba(0, 0, 0, 0.01);
      }

      &__name {
        font-size: 16px;
        color: #1D2127;
        padding: 20px 20px 10px 20px;
        font-weight: 400;

        &_bold {
          line-height: 1;
          padding: 20px;
          font-weight: 500;
          font-size: 25px;
          color: #103D7C;
        }
      }
    }
  }

  @include _767 {
    background: linear-gradient(to bottom, #103D7C 270px, #f6f8fa 270px);
    &__container {
      grid-template-rows: repeat(2, auto);
      gap: 15px;
      padding: 10px;
    }
    &__header {
      gap: 15px;
      .btn {
        justify-content: left;
      }
    }
    &__content {
      .info-block {
        &__info-cards {
          grid-template-columns: repeat(2, 1fr);
        }
        &__btns-cont {
          grid-template-columns: repeat(3, 1fr);
        }
      }
    }
  }

  @include _575 {
    &__content {
      .info-block {
        &__couple,
        &__info-cards {
          grid-template-columns: 1fr;
        }
        &__btns-cont {
          grid-template-columns: repeat(2, 1fr);
        }
      }
    }
  }
}
</style>
