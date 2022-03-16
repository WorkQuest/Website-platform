<template>
  <div class="referral-page">
    <div class="referral-page__container">
      <div class="referral-page__header">
        <div class="title">
          {{ $t('referral.inviteFriendsHead') }}
          <br>
          {{ $t('referral.earnCryptoTogether') }}
        </div>
        <div class="title_sub">
          {{ $t('referral.headerSubtitle') }}
        </div>
      </div>
      <div class="referral-page__content">
        <div class="info-block_couple">
          <div class="info-block">
            <div class="info-block__wrap">
              <div class="info-block__inner">
                <div class="info-block__name">
                  {{ $t('referral.referralReward') }}
                </div>
                <div class="info-block__tokens">
                  {{ $tc('referral.wqtCount', referralReward) }}
                </div>
              </div>
              <div class="info-block__btn-wrap">
                <base-btn
                  :disabled="Number(referralReward) === 0"
                  :selector="`claim`"
                  @click="clickClaimBtnHandler"
                >
                  {{ $t('modals.claim') }}
                </base-btn>
              </div>
            </div>
            <div class="info-block__name">
              {{ $t('referral.lastRefReward') }}
            </div>
            <div class="user_last-reward">
              <div class="user__info">
                <img
                  class="ava"
                  src="~/assets/img/temp/avatar-small.jpg"
                  alt="avatar"
                >
                <div class="user__name">
                  Edward Cooper
                </div>
              </div>
              <div class="user__value_green">
                {{ $tc('referral.plusCount', $tc('referral.wqtCount', 0)) }}
              </div>
            </div>
          </div>
          <div class="info-block">
            <div class="info-block__wrap">
              <div class="info-block__inner">
                <div class="info-block__name">
                  {{ $t('referral.yourRefers') }}
                </div>
              </div>
              <div class="info-block__btn-wrap">
                <base-btn
                  :selector="`registration`"
                  @click="clickRegistrationBtnHandler"
                >
                  {{ $t('modals.registration') }}
                </base-btn>
              </div>
            </div>
            <div class="info-block__refers">
              <div class="info-block__avatar">
                <img
                  class="ava_list"
                  src="~/assets/img/social/FACEBOOK.png"
                  alt=""
                >
              </div>
              <div class="info-block__avatar">
                <img
                  class="ava_list"
                  src="~/assets/img/social/TWITTER.png"
                  alt=""
                >
              </div>
              <div class="info-block__avatar">
                <img
                  class="ava_list"
                  src="~/assets/img/social/GOOGLE_+_.png"
                  alt=""
                >
              </div>
              <div class="info-block__avatar">
                <div class="info-block__more">
                  {{ $tc('referral.plusCount', 0) }}
                </div>
              </div>
            </div>
            <div class="info-block__name">
              {{ $t('referral.yourReferralLink') }}
            </div>
            <div class="info-block__link">
              <div class="address">
                {{ referLink }}
              </div>
              <button
                type="button"
                @click="doCopy"
              >
                <span class="icon-copy address__icon" />
              </button>
            </div>
          </div>
        </div>
        <div class="info-block">
          <div class="info-block__name_bold">
            {{ $t('referral.howToInviteYourFriends') }}
          </div>
          <div class="info-block__steps">
            <div class="step">
              <div class="step__name">
                {{ $t('referral.getLink') }}
              </div>
              <div class="step__about">
                {{ $t('referral.registerAndGenerate') }}
              </div>
            </div>
            <div class="step">
              <div class="step__name">
                {{ $t('referral.inviteFriends') }}
              </div>
              <div class="step__about">
                {{ $t('referral.inviteYourFriends') }}
              </div>
            </div>
            <div class="step">
              <div class="step__name">
                {{ $t('referral.earnCrypto') }}
              </div>
              <div class="step__about">
                {{ $t('referral.everyTimeYourFriends') }}
              </div>
            </div>
          </div>
        </div>
        <div class="info-block">
          <div class="info-block__name">
            {{ $t('referral.historyOfRewards') }}
          </div>
          <div class="referral-page__table">
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
        <div class="referral-page__pager">
          <base-pager
            v-if="totalPages > 1"
            v-model="page"
            :total-pages="totalPages"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import modals from '~/store/modals/modals';

export default {
  async asyncData({ store }) {
    const userAddress = store.getters['user/getUserWalletAddress'];
    try {
      await store.dispatch('referral/fetchRewardBalance', userAddress);
    } catch (err) {
      console.log('fetchRewardBalance err', err);
    }
  },
  data() {
    return {
      page: 1,
      offset: 10,
      referLink: 'https://www.workquest.com/ref?v=44T7iUSo1vU',
      items: [
        {
          userName: this.$t('referral.table.userName'),
          avaUrl: '~/assets/img/social/GOOGLE_+_.png',
          userID: this.$t('referral.table.userId'),
          txHash: this.$t('referral.table.txHash'),
          time: this.$t('referral.table.time'),
          amount: this.$tc('referral.wqtCount', 12),
          status: this.$t('referral.table.status'),
        },
        {
          userName: this.$t('referral.table.userName'),
          avaUrl: '~/assets/img/social/GOOGLE_+_.png',
          userID: this.$t('referral.table.userId'),
          txHash: this.$t('referral.table.txHash'),
          time: this.$t('referral.table.time'),
          amount: this.$tc('referral.wqtCount', 12),
          status: this.$t('referral.table.status'),
        },
        {
          userName: this.$t('referral.table.userName'),
          avaUrl: '~/assets/img/social/GOOGLE_+_.png',
          userID: this.$t('referral.table.userId'),
          txHash: this.$t('referral.table.txHash'),
          time: this.$t('referral.table.time'),
          amount: this.$tc('referral.wqtCount', 12),
          status: this.$t('referral.table.status'),
        },
        {
          userName: this.$t('referral.table.userName'),
          avaUrl: '~/assets/img/social/GOOGLE_+_.png',
          userID: this.$t('referral.table.userId'),
          txHash: this.$t('referral.table.txHash'),
          time: this.$t('referral.table.time'),
          amount: this.$tc('referral.wqtCount', 12),
          status: this.$t('referral.table.status'),
        },
        {
          userName: this.$t('referral.table.userName'),
          avaUrl: '~/assets/img/social/GOOGLE_+_.png',
          userID: this.$t('referral.table.userId'),
          txHash: this.$t('referral.table.txHash'),
          time: this.$t('referral.table.time'),
          amount: this.$tc('referral.wqtCount', 12),
          status: this.$t('referral.table.status'),
        },
        {
          userName: this.$t('referral.table.userName'),
          avaUrl: '~/assets/img/social/GOOGLE_+_.png',
          userID: this.$t('referral.table.userId'),
          txHash: this.$t('referral.table.txHash'),
          time: this.$t('referral.table.time'),
          amount: this.$tc('referral.wqtCount', 12),
          status: this.$t('referral.table.status'),
        },
        {
          userName: this.$t('referral.table.userName'),
          avaUrl: '~/assets/img/social/GOOGLE_+_.png',
          userID: this.$t('referral.table.userId'),
          txHash: this.$t('referral.table.txHash'),
          time: this.$t('referral.table.time'),
          amount: this.$tc('referral.wqtCount', 12),
          status: this.$t('referral.table.status'),
        },
        {
          userName: this.$t('referral.table.userName'),
          avaUrl: '~/assets/img/social/GOOGLE_+_.png',
          userID: this.$t('referral.table.userId'),
          txHash: this.$t('referral.table.txHash'),
          time: this.$t('referral.table.time'),
          amount: this.$tc('referral.wqtCount', 12),
          status: this.$t('referral.table.status'),
        },
        {
          userName: this.$t('referral.table.userName'),
          avaUrl: '~/assets/img/social/GOOGLE_+_.png',
          userID: this.$t('referral.table.userId'),
          txHash: this.$t('referral.table.txHash'),
          time: this.$t('referral.table.time'),
          amount: this.$tc('referral.wqtCount', 12),
          status: this.$t('referral.table.status'),
        },
        {
          userName: this.$t('referral.table.userName'),
          avaUrl: '~/assets/img/social/GOOGLE_+_.png',
          userID: this.$t('referral.table.userId'),
          txHash: this.$t('referral.table.txHash'),
          time: this.$t('referral.table.time'),
          amount: this.$tc('referral.wqtCount', 12),
          status: this.$t('referral.table.status'),
        },
        {
          userName: this.$t('referral.table.userName'),
          avaUrl: '~/assets/img/social/GOOGLE_+_.png',
          userID: this.$t('referral.table.userId'),
          txHash: this.$t('referral.table.txHash'),
          time: this.$t('referral.table.time'),
          amount: this.$tc('referral.wqtCount', 12),
          status: this.$t('referral.table.status'),
        },
        {
          userName: this.$t('referral.table.userName'),
          avaUrl: '~/assets/img/social/GOOGLE_+_.png',
          userID: this.$t('referral.table.userId'),
          txHash: this.$t('referral.table.txHash'),
          time: this.$t('referral.table.time'),
          amount: this.$tc('referral.wqtCount', 12),
          status: this.$t('referral.table.status'),
        },
        {
          userName: this.$t('referral.table.userName'),
          avaUrl: '~/assets/img/social/GOOGLE_+_.png',
          userID: this.$t('referral.table.userId'),
          txHash: this.$t('referral.table.txHash'),
          time: this.$t('referral.table.time'),
          amount: this.$tc('referral.wqtCount', 12),
          status: this.$t('referral.table.status'),
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
    };
  },
  computed: {
    ...mapGetters({
      referralReward: 'referral/getReferralReward',
    }),
    totalPages() {
      return Math.ceil(this.items.length / this.offset);
    },
  },
  async mounted() {
    this.SetLoader(true);
    this.SetLoader(false);
  },
  methods: {
    doCopy(ev) {
      ev.stopPropagation();
      this.$copyText(this.referLink);
    },
    async clickClaimBtnHandler() {
      this.SetLoader(true);
      let res;
      try {
        res = await this.$store.dispatch('referral/claimReferralReward');
      } catch (err) {
        console.log('claimReferralReward err', err);
      }
      this.SetLoader(false);
      if (res) {
        this.ShowModal({
          key: modals.thanks,
        });
      }
    },
    clickRegistrationBtnHandler() {
      console.log('click');
    },
  },
};
</script>

<style lang="scss" scoped>
.referral-page {
  background: linear-gradient(to bottom, #103D7C 370px, #f6f8fa 370px);
  display: flex;
  justify-content: center;

  &__container {
    display: grid;
    grid-template-rows: 225px max-content;
    max-width: 1180px;
    gap: 30px;
    justify-content: center;
    width: 100%;
    padding: 10px;
    box-sizing: content-box;
  }
  &__header {
    max-width: 450px;
    font-weight: 500;
    color: #FFF;
    align-self: center;
    .title {
      @extend .referral-page__header;
      font-size: 45px;
      line-height: 110%;
      margin: 0 0 16px;
      &_sub {
        @extend .referral-page__header;
        font-size: 16px;
        line-height: 100%;
        opacity: 0.5;
      }
    }
  }
  &__content {
    display: grid;
    grid-row-gap: 30px;
    grid-template-rows: 225px max-content max-content;

    .info-block {
      background-color: #fff;
      border-radius: 6px;

      &__wrap {
        display: grid;
        grid-auto-flow: column;
        justify-content: space-between;
      }

      &__btn-wrap {
        padding: 34px 20px 0 0;
        width: 156px;
      }

      &__tokens {
        font-weight: 700;
        font-size: 25px;
        color: #0083C7;
        padding: 0 20px;
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

      .ava {
        height: 33px;
        width: 33px;
        border-radius: 50%;
        background-color: #fff;
        flex: none;
        &_list {
          @extend .ava;
          position: absolute;
        }
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

        &_last-reward {
          display: grid;
          background-color: #F7F8FA;
          border-radius: 5px;
          height: 50px;
          line-height: 50px;
          width: calc(100% - 40px);
          margin-left: 20px;
          padding: 0 10px;
          flex-wrap: wrap;
          gap: 10px;
          grid-template-columns: 5fr auto;
        }
      }

      &__refers {
        display: flex;
        flex-wrap: wrap;
        margin-bottom: 4px;
        width: calc(100% - 40px);
        margin-left: 20px;
        height: 33px;
        position: relative;
      }

      &__avatar {
        width: 25px;
      }

      &__more {
        position: absolute;
        height: 33px;
        width: 53px;
        border-radius: 39px;
        background-color: #F7F8FA;
        text-align: center;
        line-height: 33px;
      }

      &__link {
        border: 1px solid #F7F8FA;
        border-radius: 6px;
        width: calc(100% - 40px);
        margin-left: 20px;
        padding: 0 20px;
        display: grid;
        grid-template-columns: 1fr 23px;
        gap: 10px;
        height: 46px;
        align-items: center;
        button {
          margin-top: 3px;
        }
        .address {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 16px;
          color: #1D2127;
          &__icon {
            font-size: 24px;
            &::before {
              color: $blue;
            }
          }
        }
      }

      &__steps {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-gap: 60px;
        position: relative;
        width: calc(100% - 40px);
        margin: 0 0 20px 20px;

        .step {
          position: relative;
          background-color: #F7F8FA;
          border-radius: 6px;
          z-index: 2;

          &__name {
            font-weight: 500;
            font-size: 18px;
            color: #0083C7;
            padding: 10px;
          }
          &__about {
            font-size: 16px;
            color: #7C838D;
            padding: 0 10px 10px;
          }
          &:not(:last-child) {
            &:after {
              content: "";
              height: 12px;
              width: 12px;
              border-radius: 50%;
              z-index: 3;
              background-color: #D8DFE3;
              position: absolute;
              right: -5px;
              top: calc(50% - 5px);
            }
          }

          &:not(:first-child) {
            &:before {
              content: "";
              height: 12px;
              width: 12px;
              border-radius: 50%;
              z-index: 3;
              background-color: #D8DFE3;
              position: absolute;
              left: -5px;
              top: calc(50% - 5px);
            }
          }
        }
        &:after {
          content: "";
          position: absolute;
          height: 2px;
          width: 100%;
          top: 50%;
          background-color: #D8DFE3;
        }
      }

      &_couple {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
      }
    }
  }

  &__table {
    margin-bottom: 25px;
    table {
      margin: 0 !important;
      border-radius: 0 !important;
    }
  }

  @include _991 {
    background: linear-gradient(to bottom, #103D7C 245px, #f6f8fa 245px);

    &__container {
      gap: 15px;
      grid-template-rows: 150px auto;
    }
    &__table {
      overflow: auto;
      width: calc(100vw - 20px);

      .table {
        width: 1180px;
      }
    }
  }

  @include _767 {
    background: linear-gradient(to bottom, #103D7C 220px, #f6f8fa 220px);
    &__container {
      grid-template-rows: repeat(2, auto);
      gap: 24px;
    }
    &__header {
      .title {
        font-size: 36px;
        margin-bottom: 15px;
        width: 100%;
        &_sub {
          font-size: 16px;
          max-width: 400px;
          width: 100%;
        }
      }
    }
    &__content {
      grid-template-rows: 450px max-content max-content;
      .info-block {
        &_couple {
          grid-template-rows: repeat(2, 1fr);
          grid-template-columns: unset;
          gap: 20px;
        }
        &__steps {
          grid-template-rows: repeat(3, 1fr);
          grid-template-columns: unset;
          gap: 60px;

          .step {
            &:not(:last-child) {
              &:after {
                right: calc(50% - 7px);
                bottom: -5px;
                top: unset;
              }
            }

            &:not(:first-child) {
              &:before {
                right: calc(50% - 7px);
                left: unset;
                top:- 5px;
              }
            }
          }

          &:after {
            height: 100%;
            width: 2px;
            left: 50%;
            top: 0;
          }
        }
      }
    }
  }
}
</style>
