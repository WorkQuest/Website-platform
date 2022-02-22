<template>
  <div class="crediting-page">
    <div class="crediting-page__container">
      <div class="crediting-page__header">
        <div class="title">
          {{ $t('crediting.lending') }}
        </div>
        <div class="title_sub">
          {{ $t('crediting.templateText') }}
        </div>
      </div>
      <div class="crediting-page__content">
        <div class="info-block__couple">
          <div
            v-for="(item, i) in cards"
            :key="i"
            class="info-block_half"
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
          <div class="info-block__name">
            {{ $t('crediting.openPositions') }}
            <button
              class="plus-btn"
              @click="openCreditingDepositModal()"
            >
              +
            </button>
          </div>
          <div class="crediting-page__table">
            <b-table
              :items="items"
              :fields="testFields"
              borderless
              caption-top
              thead-class="table__header"
              tbody-tr-class="table__row"
            >
              <template #cell(id)="el">
                <div class="table__value_gray">
                  {{ el.item.id }}
                </div>
              </template>
              <template #cell(currentRatio)="el">
                <div class="table__value_green">
                  {{ el.item.currentRatio }}
                </div>
              </template>
              <template #cell(deposited)="el">
                <div class="table__value_gray">
                  {{ el.item.deposited }}
                </div>
              </template>
              <template #cell(availableToWithdraw)="el">
                <div class="table__value">
                  {{ el.item.availableToWithdraw }}
                </div>
              </template>
              <template #cell(wusd)="el">
                <div class="table__value">
                  {{ el.item.wusd }}
                </div>
              </template>
              <template #cell(manage)="el">
                <base-btn
                  class="btn_bl"
                  @click="handleClickManage(el)"
                >
                  {{ el.item.manage }}
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

export default {
  data() {
    return {
      items: [
        {
          id: 565464,
          currentRatio: this.$tc('meta.percentsCount', { count: '500%' }),
          deposited: this.$tc('meta.ETHCount', { count: '531' }),
          availableToWithdraw: this.$t('meta.ETHCount', { count: '531' }),
          wusd: this.$t('meta.WUSDCount', { count: '532' }),
          manage: this.$t('crediting.table.manage'),
        },
        {
          id: 565465,
          currentRatio: this.$tc('meta.percentsCount', { count: '500%' }),
          deposited: this.$t('meta.ETHCount', { count: '531' }),
          availableToWithdraw: this.$t('meta.ETHCount', { count: '531' }),
          wusd: this.$t('meta.WUSDCount', { count: '532' }),
          manage: this.$t('crediting.table.manage'),
        },
      ],
      testFields: [
        {
          key: 'ID',
          label: this.$t('crediting.tableHead.id'),
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
          key: 'currentRatio',
          label: this.$t('crediting.tableHead.currentRatio'),
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
          key: 'deposited',
          label: this.$t('crediting.tableHead.deposited'),
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
          key: 'availableToWithdraw',
          label: this.$t('crediting.tableHead.availableToWithdraw'),
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
          key: 'WUSD',
          label: this.$t('meta.wusd'),
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
          key: 'manage',
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
      cards: [
        {
          title: this.$tc('meta.USDCount', { count: '255.5' }),
          subtitle: this.$t('crediting.totalCollateralLocked'),
        },
        {
          title: this.$tc('meta.WUSDCount', { count: '2,150.26' }),
          subtitle: this.$t('crediting.totalWusdDebt'),
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
    handleClickManage(el) {
      this.$router.push('/crediting/1/1');
    },
    openCreditingDepositModal() {
      this.ShowModal({
        key: modals.creditingDeposit,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.crediting-page {
  background: linear-gradient(to bottom, #103D7C 284px, #f6f8fa 284px);
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
    grid-template-rows: 141px max-content;

    .btn-group {
      display: grid;
      grid-template-columns: repeat(2, calc(50% - 10px));
      gap: 20px;
      padding-bottom: 20px;

      &_exp {
        @extend .btn-group;
        width: calc(100% - 20px);
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
        position: absolute;
        top: 100px;
        right: 100px;
        width: 150px;
        color: #fff;
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
    }

    .info-block {
      background-color: #fff;
      border-radius: 6px;
      overflow: hidden;

      &__couple {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
      }

      &_half {
        @extend .info-block;
        padding: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        justify-content: center;
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

      &__name {
        font-size: 16px;
        color: #1D2127;
        padding: 20px 20px 10px 20px;
        font-weight: 400;
        position: relative;

        .plus-btn {
          position: absolute;
          width: 33px;
          right: 15px;
          color: #103D7C;
          font-size: 22px;
          top: 14px;
        }
      }
    }
  }

  &__table {

    .table {
      margin: 0;
      border-radius: 0 !important;

      &__value {
        font-size: 16px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-weight: 400;

        &_green {
          @extend .table__value;
          color: #00AA5B;
        }

        &_gray {
          @extend .table__value;
          color: #7C838D;
          font-weight: 400;
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
        border-radius: 0 !important;
      }
    }
  }

  @include _767 {
    background: linear-gradient(to bottom, #103D7C 220px, #f6f8fa 220px);
    &__container {
      grid-template-rows: auto auto;
      gap: 20px;
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
      grid-template-rows: repeat(2, auto);
    }
  }

  @include _575 {
    &__content {
      .info-block {
        &__couple {
          grid-template-columns: unset;
          grid-template-rows: repeat(2, 1fr);
        }
      }
    }
  }
}
</style>
