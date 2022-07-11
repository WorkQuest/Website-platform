<template>
  <div class="staking-page">
    <div class="staking-page__container">
      <div class="staking-page__header">
        <div class="head-btns">
          <base-btn
            data-selector="PREVIOUS-STEP"
            class="btn"
            @click="handleBackToMainStaking()"
          >
            <template v-slot:left>
              <span class="icon-chevron_left" />
            </template>
            {{ $t('meta.btns.back') }}
          </base-btn>
        </div>
        <div class="head-cont">
          <div class="title">
            {{ $t('staking.pool') }}
          </div>
          <div class="link-cont">
            <div class="link-cont__link link-cont__link_gray">
              {{ convertToBech32('wq', poolAddress) }}
            </div>
            <!--TODO : change this button to button-copy -->
            <button
              type="button"
              data-selector="COPY-BTN"
              @click="doCopy"
            >
              <span class="icon-copy link-cont__icon" />
            </button>
            <!--<button-copy-->
            <!--@click="doCopy" -->
            <!-- >-->
            <!--<span class="icon-copy link-cont__icon" />-->
            <!--</button-copy>-->
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
            :href="explorerRef"
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
            :href="explorerRef"
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
            <div
              v-if="poolData.poolAddress"
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
              <div
                v-if="poolData.poolAddress"
                class="info-card__about"
              >
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
              <div
                v-if="userInfo.staked"
                class="info-card__about"
              >
                {{ item.about }}
              </div>
            </div>
          </div>
          <div class="info-block__btns-cont">
            <base-btn
              mode="outline"
              data-selector="CLAIM-REWARDS"
              @click="showClaimModal"
            >
              {{ $t('meta.claimRewards') }}
            </base-btn>
          </div>
        </div>
        <div class="info-block">
          <div class="info-block__name_bold">
            {{ $t('meta.btns.stake') }}
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
              <div
                v-if="poolData.minStake"
                class="info-card__about"
              >
                {{ item.about }}
              </div>
            </div>
          </div>
          <div class="info-block__btns-cont">
            <base-btn
              data-selector="AUTO-RENEWAL"
              @click="handleAutoRenewal"
            >
              {{ $t('staking.autoRenewal') }}
            </base-btn>
            <base-btn
              mode="outline"
              data-selector="SHOW-UNSTAKE-MODAL"
              @click="showUnstakeModal"
            >
              {{ $t('meta.btns.unstake') }}
            </base-btn>
            <base-btn
              data-selector="SHOW-STAKE-MODAL"
              mode="outline"
              @click="showStakeModal"
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
import moment from 'moment';
import { mapGetters } from 'vuex';
import BigNumber from 'bignumber.js';
import modals from '~/store/modals/modals';
import {
  ExplorerUrl, Path, StakingTypes, TokenSymbols,
} from '~/utils/enums';
import { getWalletAddress } from '~/utils/wallet';

export default {
  name: 'StakingPool',
  data() {
    return {
      updateInterval: null,
    };
  },
  computed: {
    ...mapGetters({
      isWalletConnected: 'wallet/getIsWalletConnected',
      balanceData: 'wallet/getBalanceData',
      stakingPoolsData: 'wallet/getStakingPoolsData',
      stakingUserData: 'wallet/getStakingUserData',
    }),
    slug() { return this.$route.params.id.toUpperCase(); },
    userInfo() { return this.stakingUserData[this.slug]; },
    poolData() { return this.stakingPoolsData[this.slug]; },
    poolAddress() { return this?.poolData?.poolAddress ? this.poolData.poolAddress.toLowerCase() : ''; },
    cards() {
      return [
        {
          title: this.$t(`meta.coins.count.${this.poolData.stakeTokenSymbol || this.slug}Count`, { count: this.NumberWithSpaces(this.poolData.totalStaked) }),
          subtitle: this.$t('staking.totalStaked'),
        },
        {
          title: this.$t(`meta.coins.count.${this.poolData.tokenSymbol || this.slug}Count`, { count: this.NumberWithSpaces(this.poolData.totalDistributed) }),
          subtitle: this.$t('staking.totalDistributed'),
        },
      ];
    },
    stakingCards() {
      return [
        {
          name: this.$t('staking.stakingCards.distributionTime'),
          about: this.getTimeFromMin(this.poolData.distributionTime),
        },
        {
          name: this.$t('staking.stakingCards.rewardTotal'),
          about: `${this.NumberWithSpaces(this.poolData.rewardTotal)} ${this.poolData.tokenSymbol}`,
        },
        {
          name: this.$t('staking.stakingCards.takePeriod'),
          about: this.getTimeFromMin(this.poolData.stakePeriod),
        },
        {
          name: this.$t('staking.stakingCards.claimPeriod'),
          about: this.getTimeFromMin(this.poolData.claimPeriod),
        },
      ];
    },
    userInfoCards() {
      const data = [
        {
          name: this.$t('staking.userInformationCards.staked'),
          about: this.$t(`meta.coins.count.${this.slug}Count`, { count: this.NumberWithSpaces(this.userInfo.staked || '') }),
        },
        {
          name: this.$t('staking.userInformationCards.yourBalance'),
          about: this.$t(`meta.coins.count.${this.slug}Count`, { count: this.NumberWithSpaces(this.userInfo.balance || '') }),
        },
        {
          name: this.$t('mining.reward'),
          about: this.$t(`meta.coins.count.${this.slug}Count`, { count: this.NumberWithSpaces(this.userInfo.claim || '') }),
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
            about: this.$tc('meta.units.minutes', this.DeclOfNum(minutes >= 0 ? minutes : 0), { count: minutes >= 0 ? minutes : 0 }),
          });
        } else if (hours <= 24) {
          data.push({
            name: this.$t('staking.stakingCards.duration'),
            about: this.$tc('meta.units.hours', this.DeclOfNum(hours >= 0 ? hours : 0), { count: hours >= 0 ? hours : 0 }),
          });
        } else {
          data.push({
            name: this.$t('staking.stakingCards.duration'),
            about: this.$tc('meta.units.days', this.DeclOfNum(days >= 0 ? days : 0), { count: days >= 0 ? days : 0 }),
          });
        }
      }
      return data;
    },
    stakeCards() {
      return [
        {
          name: this.$t('staking.stakeCards.stakeMin'),
          about: this.$t(`meta.coins.count.${this.slug}Count`, { count: this.NumberWithSpaces(this.poolData.minStake || '') }),
        },
        {
          name: this.$t('staking.stakeCards.stakeLimit'),
          about: this.$t(`meta.coins.count.${this.slug}Count`, { count: this.NumberWithSpaces(this.poolData.maxStake || '') }),
        },
        {
          name: this.$t('staking.stakeCards.periodUpdate'),
          about: this.getTimeFromMin(this.poolData.stakePeriod),
        },
      ];
    },
    explorerRef() {
      if (!this.poolData || !this.poolData.rewardTokenAddress) return '/';
      return `${ExplorerUrl}/address/${this.poolData.rewardTokenAddress.toLowerCase()}`;
    },
  },
  async mounted() {
    await this.$store.dispatch('wallet/checkWalletConnected', { nuxt: this.$nuxt });
    if (!this.isWalletConnected) return;
    await this.loadData();
  },
  async beforeDestroy() {
    clearInterval(this.updateInterval);
  },
  methods: {
    getTimeFromMin(min) {
      if (!min) return '';
      if (Math.floor(min / 60 / 24) > 0) return this.$tc('meta.units.days', this.DeclOfNum(min / 60 / 24), { count: min / 60 / 24 });
      if (Math.floor(min / 60) > 0) return this.$tc('meta.units.hours', this.DeclOfNum(Math.floor(min / 60)), { count: Math.floor(min / 60) });
      return this.$tc('meta.units.hours', this.DeclOfNum(min), { count: min });
    },
    async loadData() {
      this.SetLoader(true);
      await Promise.all([
        this.$store.dispatch('wallet/getStakingPoolsData', this.slug),
        this.$store.dispatch('wallet/getStakingUserInfo', this.slug),
      ]);
      this.updateInterval = setInterval(() => this.$store.dispatch('wallet/getStakingUserInfo', this.slug), 60000);
      this.SetLoader(false);
    },
    handleBackToMainStaking() {
      this.$router.push(Path.STAKING);
    },
    doCopy(ev) {
      ev.stopPropagation();
      this.$copyText(this.poolAddress).then(() => {});
      this.$store.dispatch('main/showToast', {
        title: this.$t('modals.textCopy'),
        text: this.poolAddress,
      });
    },
    async showClaimModal() {
      if (!this.userInfo || !this.stakingPoolsData[this.slug]) return;
      if (+this.userInfo.claim === 0) {
        this.ShowModal({
          key: modals.status,
          img: require('~/assets/img/ui/warning.svg'),
          title: this.$t('staking.notification'),
          recipient: '',
          subtitle: this.$t('modals.nothingToClaim'),
        });
        return;
      }
      this.SetLoader(true);
      const [txFee] = await Promise.all([
        this.$store.dispatch('wallet/getStakingClaimFeeData', {
          stakingType: this.slug,
          poolAddress: this.poolAddress,
        }),
        this.$store.dispatch('wallet/getBalance'),
      ]);
      this.SetLoader(false);
      if (!txFee.ok) {
        if (txFee.msg.includes('You cannot claim tokens yet') || txFee.msg.includes('You cannot stake tokens yet')) {
          await this.ShowModal({
            key: modals.status,
            img: require('~/assets/img/ui/warning.svg'),
            title: this.$t('staking.notification'),
            subtitle: this.$t('staking.cannotClaimYet'),
          });
        } else this.ShowToast(txFee.msg);
        return;
      }
      this.ShowModal({
        key: modals.transactionReceipt,
        title: this.$t('meta.claimRewards'),
        fields: {
          from: { name: this.$t('meta.fromBig'), value: getWalletAddress() },
          to: { name: this.$t('meta.toBig'), value: this.poolData.poolAddress },
          fee: { name: this.$t('wallet.table.trxFee'), value: txFee.result.fee, symbol: TokenSymbols.WUSD },
        },
        submitMethod: async () => await this.$store.dispatch('wallet/stakingClaimRewards', {
          poolAddress: this.poolData.poolAddress,
          stakingType: this.slug,
        }),
        callback: async () => await this.loadData(),
      });
    },
    async showUnstakeModal() {
      if (!this.userInfo || !this.poolData) return;
      if (+this.userInfo.fullStaked === 0) {
        await this.ShowModal({
          key: modals.status,
          img: require('~/assets/img/ui/warning.svg'),
          title: this.$t('staking.notification'),
          subtitle: this.$t('staking.stakeIsEmpty'),
        });
        return;
      }
      // For not native token exists lock duration
      if (this.slug !== StakingTypes.WUSD) {
        this.SetLoader(true);
        const txFee = await this.$store.dispatch('wallet/getStakingUnstakeFeeData', {
          poolAddress: this.poolAddress,
          stakingType: this.slug,
        });
        this.SetLoader(false);
        if (!txFee.ok) {
          if (txFee.msg.includes('You cannot unstake token yet')) {
            await this.ShowModal({
              key: modals.status,
              img: require('~/assets/img/ui/warning.svg'),
              title: this.$t('staking.notification'),
              subtitle: this.$t('staking.stakeDurationIsNotOver'),
            });
          } else this.ShowToast(txFee.msg);
          return;
        }
      }
      this.ShowModal({
        key: modals.claimRewards,
        type: 2,
        stakingType: this.slug,
        staked: this.userInfo.fullStaked,
      });
    },
    async showStakeModal() {
      if (!this.userInfo || !this.stakingPoolsData[this.slug]) return;
      if (+this.userInfo.balance === 0) {
        await this.ShowModal({
          key: modals.status,
          img: require('~/assets/img/ui/warning.svg'),
          title: this.$t('staking.notification'),
          subtitle: this.$t('staking.notEnoughFunds'),
        });
        return;
      }
      if (new BigNumber(this.userInfo.fullStaked).isGreaterThanOrEqualTo(this.poolData.fullMaxStake)) {
        await this.ShowModal({
          key: modals.status,
          img: require('~/assets/img/ui/warning.svg'),
          title: this.$t('staking.notification'),
          subtitle: this.$t('staking.stakeLimitReached'),
        });
        return;
      }
      this.ShowModal({
        key: modals.stake,
        stakingType: this.slug,
      });
    },
    async handleAutoRenewal() {
      this.SetLoader(true);
      await this.loadData();
      this.SetLoader(false);
      if (new BigNumber(this.userInfo.fullStaked).isGreaterThanOrEqualTo(this.poolData.fullMaxStake)) {
        this.ShowModal({
          key: modals.status,
          img: require('~/assets/img/ui/warning.svg'),
          title: this.$t('staking.notification'),
          subtitle: this.$t('staking.stakeLimitReached'),
        });
        return;
      }
      let renewalValue;
      if (new BigNumber(this.userInfo.fullClaim).isGreaterThanOrEqualTo(this.poolData.fullMaxStake)) {
        renewalValue = new BigNumber(this.poolData.fullMaxStake).minus(this.userInfo.fullStaked).toString();
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
        text: this.$t('staking.renewalTokens', { count: renewalValue }),
        callback: async () => {
          this.SetLoader(true);
          const [txFee] = await Promise.all([
            this.$store.dispatch('wallet/getStakingRenewalFeeData', {
              stakingType: this.slug,
              poolAddress: this.poolAddress,
            }),
            this.$store.dispatch('wallet/getBalance'),
          ]);
          this.SetLoader(false);
          if (!txFee.ok) {
            let errorMessage;
            if (txFee.msg.includes('You cannot claim tokens yet') || txFee.msg.includes('You cannot stake tokens yet')) {
              errorMessage = this.$t('staking.cannotStakeYet');
            } else {
              errorMessage = txFee.msg;
            }
            this.ShowToast(errorMessage, this.$t('staking.autoRenewal'));
            return;
          }
          this.ShowModal({
            key: modals.transactionReceipt,
            title: this.$t('staking.autoRenewal'),
            fields: {
              from: { name: this.$t('meta.fromBig'), value: getWalletAddress() },
              to: { name: this.$t('meta.toBig'), value: this.poolAddress },
              fee: { name: this.$t('wallet.table.trxFee'), value: txFee.result.fee, symbol: TokenSymbols.WUSD },
            },
            submitMethod: async () => await this.$store.dispatch('wallet/stakingRenewal', { stakingType: this.slug, poolAddress: this.poolAddress }),
            callback: async () => await this.loadData(),
          });
        },
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
          color: $black0;
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

      &__claim-btn {
        display: flex;
        justify-items: flex-end;
      }

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
          background-color: $black0;
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
          grid-template-columns: repeat(1, 1fr);
        }
      }
    }
  }
}
</style>
