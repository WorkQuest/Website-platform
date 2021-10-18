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
              {{ templateLink }}
            </div>
            <button
              type="button"
              @click="doCopy"
            >
              <span class="icon-copy link-cont__icon" />
            </button>
          </div>
        </div>
        <div class="link-cont">
          <div class="link-cont__link">
            {{ $t('staking.stakeTokenAddress') }}
          </div>
          <button
            type="button"
          >
            <img
              src="~assets/img/ui/launch.svg"
              alt=""
              class="link-cont__icon"
            >
          </button>
        </div>
        <div class="link-cont">
          <div class="link-cont__link">
            {{ $t('staking.rewardTokenAddress') }}
          </div>
          <button
            type="button"
          >
            <img
              src="~assets/img/ui/launch.svg"
              alt=""
              class="link-cont__icon"
            >
          </button>
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
            {{ $t('staking.withdrawal') }}
          </div>
          <div class="info-block__info-cards">
            <div
              v-for="(item, i) in withdrawalCards"
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
            <base-btn>
              {{ $t('staking.autoRenewal') }}
            </base-btn>
            <base-btn
              mode="outline"
              @click="showWithdrawalModal"
            >
              {{ $t('staking.withdraw') }}
            </base-btn>
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
      templateLink: '0xnf8o29837hrvbn42o37hsho3b74thb3',
      btns: [
        {
          name: this.$t('staking.addLiquidity'),
          clickFunc: () => {
            this.ShowModal({
              key: modals.addLiquidity,
            });
          },
        },
        {
          name: this.$t('staking.removeLiquidity'),
          clickFunc: () => {
            this.ShowModal({
              key: modals.removeLiquidity,
            });
          },
        },
      ],
      userInfoCards: [
        {
          name: this.$t('staking.userInformationCards.staked'),
          about: this.$tc('staking.wqtCount', '10 000'),
        },
        {
          name: this.$t('staking.userInformationCards.stakeBalance'),
          about: this.$tc('staking.wqtCount', '10 000'),
        },
        {
          name: this.$t('staking.userInformationCards.claimed'),
          about: this.$tc('staking.wqtCount', '10 000'),
        },
      ],
      poolData: null,
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
      isConnected: 'web3/isConnected',
    }),
    cards() {
      if (!this.poolData) return [];
      return [
        {
          title: this.$tc('staking.wqtCount', this.poolData.totalStaked),
          subtitle: this.$t('staking.totalStaked'),
        },
        {
          title: this.$tc('staking.wqtCount', this.poolData.totalDistributed),
          subtitle: this.$t('staking.totalDistributed'),
        },
      ];
    },
    stakingCards() {
      if (!this.poolData) return [];
      return [
        {
          name: this.$t('staking.stakingCards.distributionTime'),
          about: this.$t('staking.stakingCards.distributionTimeData'),
        },
        {
          name: this.$t('staking.stakingCards.rewardTotal'),
          about: `${this.poolData.rewardTotal} ${this.poolData.tokenSymbol}`,
        },
        {
          name: this.$t('staking.stakingCards.takePeriod'),
          about: this.$t('staking.stakingCards.takePeriodData'),
        },
        {
          name: this.$t('staking.stakingCards.claimPeriod'),
          about: this.$t('staking.stakingCards.claimPeriodData', { n: this.poolData.claimPeriod }),
        },
        {
          name: this.$t('staking.stakingCards.duration'),
          about: this.$t('staking.stakingCards.durationData'),
        },
      ];
    },
    withdrawalCards() {
      if (!this.poolData) return [];
      return [
        {
          name: this.$t('staking.withdrawalCards.displayedInTheCurrentPeriod'),
          about: this.$t('staking.withdrawalCards.displayedInTheCurrentPeriodData'),
        },
        {
          name: this.$t('staking.withdrawalCards.withdrawalLimit'),
          about: this.poolData.maxStake, // this.$t('staking.withdrawalCards.withdrawalLimitData'),
        },
        {
          name: this.$t('staking.withdrawalCards.periodUpdate'),
          about: this.poolData.stakePeriod, // this.$t('staking.withdrawalCards.periodUpdateData'),
        },
      ];
    },
  },
  async mounted() {
    this.SetLoader(true);

    if (!this.isConnected) {
      await this.$store.dispatch('web3/connect');
    }
    const wusdPool = await this.$store.dispatch('web3/fetchStakingInfo', { native: true });
    console.log('native:', wusdPool);
    this.poolData = wusdPool;
    this.SetLoader(false);
  },
  methods: {
    handleBackToMainstaking() {
      this.$router.push('/staking');
    },
    doCopy(ev) {
      ev.stopPropagation();
      this.$copyText(this.templateLink).then(() => {
      });
    },
    showClaimModal() {
      this.ShowModal({
        key: modals.claim,
      });
    },
    showWithdrawalModal() {
      this.ShowModal({
        key: modals.takeWithdraw,
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
