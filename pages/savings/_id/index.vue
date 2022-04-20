<template>
  <div class="saving-page">
    <div class="saving-page__container">
      <div class="saving-page__header">
        <div class="title">
          {{ $t('saving.workQuestSavings') }}<br>{{ $t('saving.lendAndEarn') }}
        </div>
        <div class="title_sub">
          {{ $t('saving.templateText') }}
        </div>
      </div>
      <div class="saving-page__content">
        <div class="info-block__grid">
          <div>
            <div class="info-block__name">
              {{ $t('saving.depositAmount') }}
            </div>
            <div class="info-block__tokens">
              {{ $tc('meta.coins.count.WUSDCount', "4 562") }}
            </div>
          </div>
          <div class="info-block__small_right">
            <div class="info-block__perc">
              + {{ $tc('meta.units.percentsCount', 4.51) }}
            </div>
            <div class="info-block__period">
              {{ $t('pension.everyYear') }}
            </div>
          </div>
          <div>
            <div class="info-block__title_gray">
              {{ $t('pension.timeRemainsUntilTheEndOfThePeriod') }}
            </div>
            <div class="info-block__subtitle_black">
              {{ $tc('meta.units.days', DeclOfNum(152), {count: 152}) }}
            </div>
          </div>
          <div class="btn-group_exp">
            <base-btn
              class="btn_bl"
              data-selector="OPEN-WITHDRAW"
              @click="openModal($options.modals.withdrawAbout)"
            >
              {{ $t('meta.deposit') }}
            </base-btn>
            <base-btn
              class="btn_bl"
              mode="outline"
              data-selector="OPEN-DEPOSIT"
              @click="openModal($options.modals.openADeposit)"
            >
              {{ $t('meta.deposit') }}
            </base-btn>
            <base-btn
              class="btn_bl"
              mode="outline"
              data-selector="OPEN-CLAIM"
              @click="openModal($options.modals.openADeposit)"
            >
              {{ $t('modals.claim') }}
            </base-btn>
          </div>
        </div>
        <div class="info-block">
          <div class="info-block__name">
            {{ $t("saving.historyOfDeposits") }}
          </div>
          <div class="saving-page__table">
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
                  {{ $moment(el.item.time).locale($i18n.locale).format('Do MMM YY') }}
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
  name: 'SavingProduct',
  modals,
  data() {
    return {
      items: [
        {
          userName: 'John Doe',
          avaUrl: '~/assets/img/social/GOOGLE_+_.png',
          userID: '455dad66544ss',
          txHash: 'sf998s...ss877d',
          time: 'Feb 1, 2021',
          amount: this.$tc('meta.coins.count.WQTCount', 12),
          status: this.$t('meta.success'),
        },
        {
          userName: 'John Doe',
          avaUrl: '~/assets/img/social/GOOGLE_+_.png',
          userID: '455dad66544ss',
          txHash: 'sf998s...ss877d',
          time: 'Feb 1, 2021',
          amount: this.$tc('meta.coins.count.WQTCount', 12),
          status: this.$t('meta.success'),
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
            padding: '0 0 0 23px',
            height: '27px',
            lineHeight: '27px',
          },
          tdAttr: {
            style: 'padding: 0 0 0 23px; height: 64px; line-height: 64px',
          },
        },
        {
          key: 'txHash',
          label: this.$t('referral.tableHead.txHash'),
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
      options: 'modals/getOptions',
    }),
  },
  async mounted() {
    this.SetLoader(true);
    this.SetLoader(false);
  },
  methods: {
    openModal(key) {
      this.ShowModal({ key });
    },
  },
};
</script>

<style lang="scss" scoped>
.saving-page {
  background: linear-gradient(to bottom, #103D7C 374px, #f6f8fa 374px);
  display: flex;
  justify-content: center;

  &__container {
    display: grid;
    grid-template-rows: 233px max-content;
    max-width: 1180px;
    grid-row-gap: 40px;
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

    .btn-group {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      padding-bottom: 20px;

      &_exp {
        @extend .btn-group;
        width: calc(100% - 20px);
      }
    }

    .text {
      font-size: 16px;
      font-weight: 400;
      color: #8D96A1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

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

    .info-block {
      background-color: #fff;
      border-radius: 6px;

      &__tokens {
        font-weight: 700;
        font-size: 25px;
        color: #0083C7;
        padding: 0 20px;
      }

      &__grid {
        @extend .info-block;
        display: grid;
        grid-template-columns: 5fr 4fr;
        grid-template-rows: 2fr 1fr;
        position: relative;
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

      &__small {
        background-color: $black0;
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

      &__name {
        font-size: 16px;
        color: #1D2127;
        padding: 20px 20px 10px 20px;
        font-weight: 400;
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
      }
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
      background-color: $black0;
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
    background: linear-gradient(to bottom, #103D7C 280px, #f6f8fa 280px);
    &__container {
      grid-template-rows: auto auto;
      gap: 15px;
    }
    &__header {
      .title {
        font-size: 36px;
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
        &__grid {
          grid-template-columns: repeat(2, 1fr);
          grid-template-rows: repeat(2, auto);
          grid-row-gap: 10px;

          .btn-group_exp {
            align-self: flex-end;
          }
        }
      }
    }
  }

  @include _575 {
    &__content {
      .info-block {
        &__grid {
          grid-template-rows: repeat(3, auto);

          div {
            &:nth-child(3) {
              grid-column-start: 1;
              grid-column-end: 3;
            }
          }

          .btn-group_exp {
            padding-left: 20px;
            grid-row-start: 3;
            grid-column-start: 1;
            grid-column-end: 3;
          }
        }
        &__tokens {
          font-size: 20px;
        }
      }
    }
  }
}
</style>
