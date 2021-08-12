<template>
  <div class="pension-page">
    <div
      class="pension-page__container"
      :class="{'pension-page__container_expired' : isDeadline}"
    >
      <div class="pension-page__header">
        <div class="title">
          {{ $t('pension.retirementProgram') }}
        </div>
        <div class="title_sub">
          {{ $t('ui.menu.pension.desc') }}
        </div>
      </div>
      <div
        class="pension-page__content"
        :class="{'pension-page__content_expired' : isDeadline}"
      >
        <template v-if="!isDeadline">
          <base-btn
            class="btn__time-machine"
            @click="jumpInTime()"
          >
            +3 years
          </base-btn>
          <div class="info-block__triple">
            <div class="info-block__third">
              <div class="info-block__name">
                {{ $t('pension.pensionBalance') }}
              </div>
              <div class="info-block__tokens">
                {{ $tc("pension.wusdCount", "4 562") }}
              </div>
              <base-btn
                class="btn_bl"
                @click="openMakeDepositModal()"
              >
                {{ $t('pension.makeADeposit') }}
              </base-btn>
            </div>
            <div class="info-block__third">
              <div class="info-block__name">
                {{ $t('pension.currentPercentFromAQuest') }}
              </div>
              <div class="info-block__tokens">
                {{ $tc('pension.percents', 0) }}
              </div>
              <base-btn
                class="btn_bl"
                @click="openChangePercentModal()"
              >
                {{ $t('pension.changePercent') }}
              </base-btn>
            </div>
            <div class="info-block__third_rate">
              <div class="info-block__small">
                <div class="info-block__perc">
                  {{ $tc('pension.plusPercents', '6') }}
                </div>
                <div class="info-block__period">
                  {{ $t('pension.year') }}
                </div>
              </div>
              <div>
                <div class="info-block__title_gray">
                  {{ $t('pension.timeRemainsUntilTheEndOfThePeriod') }}
                </div>
                <div class="info-block__subtitle_black">
                  3 years
                </div>
              </div>
            </div>
          </div>
          <div class="info-block">
            <div class="info-block__name">
              {{ $t('pension.transactionHistory') }}
            </div>
            <div class="pension-page__table">
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
                <template #cell(amount)="el">
                  <div class="user__value">
                    {{ el.item.amount }}
                  </div>
                </template>
              </b-table>
            </div>
          </div>
        </template>
        <template v-if="isDeadline">
          <div class="info-block__grid">
            <div>
              <div class="info-block__name">
                {{ $t('pension.pensionSavingsBalance') }}
              </div>
              <div class="info-block__tokens">
                {{ $tc("pension.wusdCount", "4 562") }}
              </div>
            </div>
            <div class="info-block__small_right">
              <div class="info-block__perc">
                {{ $tc("pension.plusPercents", "6") }}
              </div>
              <div class="info-block__period">
                {{ $t('pension.year') }}
              </div>
            </div>
            <div class="text-cont">
              <div class="info-block__title_gray">
                {{ $t('pension.timeRemainsUntilTheEndOfThePeriod') }}
              </div>
              <div
                :class="[
                  {'info-block__subtitle_black' : !isExpired},
                  {'info-block__subtitle_red' : isExpired}
                ]"
              >
                {{ isExpired ? '0 days' : '3 years' }}
              </div>
            </div>
            <div
              :class="[
                {'btn-group' : !isExpired},
                {'btn-group_exp' : isExpired}
              ]"
            >
              <base-btn
                v-if="isExpired"
                class="btn_red"
              >
                {{ $t('pension.cancel') }}
              </base-btn>
              <base-btn
                class="btn_bl"
                @click="showWithdrawModal"
              >
                {{ $t('pension.withdraw') }}
              </base-btn>
              <base-btn
                class="btn_bl"
                @click="openApplyForAPensionModal()"
              >
                {{ $t('pension.' + (isExpired ? 'renewFor1Year' : 'prolong')) }}
              </base-btn>
            </div>
          </div>
          <div class="info-block">
            <div class="info-block__name">
              {{ $t('pension.transactionHistory') }}
            </div>
            <div class="pension-page__table">
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
        </template>
        <div
          v-if="FAQs.length"
          class="info-block"
        >
          <div class="info-block__name_bold">
            {{ $t("saving.faq") }}
          </div>
          <div class="info-block__faqs">
            <button
              v-for="(item, i) in FAQs"
              :key="i"
              class="info-block__faq"
              @click="handleClickFAQ(item)"
            >
              <div class="text__faq">
                {{ item.name }}
              </div>
              <img
                class="select-img"
                :class="{'select-img_rotate' : item.isOpen}"
                src="~/assets/img/ui/arrow-down.svg"
                alt=""
              >
              <div
                class="text__faq_gray"
                :class="{'text__faq_opened' : item.isOpen}"
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
import modals from '~/store/modals/modals';

export default {
  data() {
    return {
      isExpired: false,
      isDeadline: false,
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
      FAQs: [
        {
          name: this.$t('pension.faq1.question'),
          about: this.$t('pension.faq1.answer'),
          isOpen: false,
        },
        {
          name: this.$t('pension.faq2.question'),
          about: this.$t('pension.faq2.answer'),
          isOpen: false,
        },
        {
          name: this.$t('pension.faq3.question'),
          about: this.$t('pension.faq3.answer'),
          isOpen: false,
        },
        {
          name: this.$t('pension.faq4.question'),
          about: this.$t('pension.faq4.answer'),
          isOpen: false,
        },
        {
          name: this.$t('pension.faq5.question'),
          about: this.$t('pension.faq5.answer'),
          isOpen: false,
        },
        {
          name: this.$t('pension.faq6.question'),
          about: this.$t('pension.faq6.answer'),
          isOpen: false,
        },
        {
          name: this.$t('pension.faq7.question'),
          about: this.$t('pension.faq7.answer'),
          isOpen: false,
        },
        {
          name: this.$t('pension.faq8.question'),
          about: this.$t('pension.faq8.answer'),
          isOpen: false,
        },
        {
          name: this.$t('pension.faq9.question'),
          about: this.$t('pension.faq9.answer'),
          isOpen: false,
        },
        {
          name: this.$t('pension.faq10.question'),
          about: this.$t('pension.faq10.answer'),
          isOpen: false,
        },
      ],
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
    }),
  },
  async mounted() {
    this.SetLoader(true);
    this.SetLoader(false);
  },
  methods: {
    showWithdrawModal() {
      this.ShowModal({
        key: modals.takeWithdraw,
      });
    },
    openApplyForAPensionModal() {
      this.ShowModal({
        key: modals.applyForAPension,
      });
    },
    openMakeDepositModal() {
      this.ShowModal({
        key: modals.makeDeposit,
      });
    },
    openChangePercentModal() {
      this.ShowModal({
        key: modals.changePercent,
      });
    },
    jumpInTime() {
      this.isDeadline = true;
    },
    handleClickFAQ(FAQ) {
      FAQ.isOpen = !FAQ.isOpen;
    },
  },
};
</script>

<style lang="scss" scoped>
.pension-page {
  background: linear-gradient(to bottom, #103D7C 320px, #f6f8fa 320px);
  display: flex;
  justify-content: center;

  &__container {
    display: grid;
    grid-template-rows: 195px max-content;
    max-width: 1180px;
    grid-row-gap: 50px;
    width: 100%;
    gap: 20px;
    padding: 10px;
    box-sizing: border-box;

    &_expired {
      @extend .pension-page__container;
      gap: 15px;
    }
  }

  &__header {
    align-self: flex-end;

    .title {
      font-weight: 500;
      color: #FFF;
      width: 530px;
      font-size: 45px;
      line-height: 110%;
      margin: 0 0 24px;
//update
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
    grid-template-rows: 196px max-content;

    .btn-group {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      padding-bottom: 20px;
      width: calc(100% - 20px);

      &_exp {
        @extend .btn-group;
        grid-template-columns: repeat(3, 1fr);
      }
    }

    .btn {
      box-sizing: border-box;
      font-weight: 400;
      font-size: 16px;
      color: #0083C7;
      border: 1px solid #0083C71A;
      border-radius: 6px;
      transition: .3s;

      &__time-machine {
        @extend .btn;
        position: fixed;
        top: 130px;
        right: 15px;
        width: 20px;
        color: #fff;
        font-size: 0;

        &:hover {
          width: 150px;
          font-size: 16px;
        }
      }

      &:hover {
        background-color: #0083C71A;
        border: 0px;
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

      &_red {
        @extend .btn_bl;
        background-color: #DF3333;
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

      &__faqs {
        margin: 0 20px 20px 20px;
        display: grid;
        gap: 20px;
      }

      &__faq {
        border-radius: 5px;
        padding: 20px 60px 20px 20px;
        background-color: #F7F8FA;
        text-align: left;
        position: relative;
        transition: 300ms;
      }

      &__grid {
        @extend .info-block;
        display: grid;
        grid-template-columns: 5fr 4fr;
        grid-template-rows: 3fr 1fr;
        position: relative;
      }

      &__small {
        background-color: #F7F8FA;
        display: grid;
        grid-template-rows: repeat(2, 1fr);
        width: 115px;
        height: 66px;
        box-sizing: border-box;
        border-radius: 6px;
        margin: 20px 0 0 20px;
        padding-left: 10px;
        align-self: baseline;

        &_right {
          @extend .info-block__small;
          text-align: right;
          padding: 0 10px 0;
          justify-self: flex-end;
          margin: 20px 20px 0 0;
        }
      }

      &__perc {
        font-weight: 700;
        font-size: 20px;
        color: #0083C7;
        align-self: flex-end;
      }

      &__period {
        font-weight: 400;
        font-size: 16px;
        color: #0083C7;
        align-self: flex-start;
      }

      &__triple {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
      }

      &__third {
        @extend .info-block;
        display: grid;
        grid-template-rows: min-content min-content auto;

        .btn {
          align-self: flex-end;
          margin: 0 0 20px 20px;
          width: calc(100% - 40px);
        }

        &_rate {
          @extend .info-block__third;
          grid-template-rows: repeat(2, 1fr);
          align-items: flex-end;
        }
      }

      &__title {
        color: #0083C7;
        font-weight: 700;
        font-size: 25px;

        &_gray {
          color: #7C838D;
          font-weight: 400;
          font-size: 16px;
          margin-left: 20px;
        }
      }

      &__subtitle {
        font-weight: 400;
        font-size: 16px;
        color: #7C838D;

        &_black {
          @extend .info-block__title_gray;
          margin-bottom: 20px;
          color: #1D2127;
        }

        &_red {
          @extend .info-block__subtitle_black;
          color: #DF3333;
        }
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
    }

    &_expired {
      @extend .pension-page__content;
      grid-template-rows: 208px max-content;
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

  &__table {
    .table {
      margin: 0;
      border-radius: 0 !important;
    }
  }

  @include _1199 {
    &__content {
      .info-block {
        &__grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }
    }
  }

  @include _991 {
    background: linear-gradient(to bottom, #103D7C 245px, #f6f8fa 245px);
    &__container {
      gap: 15px;
      grid-template-rows: 150px auto;
    }
    &__content {
      .info-block {
        &__grid {
          grid-template-columns: 3fr 4fr;
        }
      }
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
      grid-template-rows: max-content max-content max-content;
      .info-block {
        &__triple {
          grid-template-rows: repeat(2, 1fr);
          grid-template-columns: repeat(2, 1fr);

          .info-block__third_rate {
            grid-column-start: 1;
            grid-column-end: 3;
          }
        }
        &__grid {
          grid-template-rows: 1fr auto auto;
          grid-template-columns: repeat(2, 1fr);
          align-items: end;
          grid-row-gap: 10px;

          .btn-group {
            grid-row-start: 3;
            grid-column-start: 1;
            grid-column-end: 3;
            justify-self: center;
          }
        }
      }
    }
  }

  @include _575 {
    &__content {
      .info-block {
        &__triple {
          grid-template-rows: repeat(3, 1fr);
          grid-template-columns: unset;

          .info-block__third_rate {
            grid-column-start: unset;
            grid-column-end: unset;
          }
        }
        &__grid {
          grid-template-columns: repeat(2, auto);
          .text-cont {
            grid-column-start: 1;
            grid-column-end: 3;
          }
          .btn-group {
            &_exp {
              grid-template-rows: repeat(2, 1fr);
              grid-template-columns: repeat(2, 1fr);
              .btn {
                &:last-child {
                  grid-row-start: 1;
                  grid-column-start: 1;
                  grid-column-end: 3;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
