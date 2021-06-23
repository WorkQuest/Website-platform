<template>
  <div class="crediting-page">
    <div class="crediting-page__container">
      <div class="crediting-page__header">
        <div class="title">
          {{ $t('crediting.crediting') }}
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
          id: this.$t('crediting.table.id'),
          currentRatio: this.$t('crediting.table.currentRatio'),
          deposited: this.$t('crediting.table.deposited'),
          availableToWithdraw: this.$t('crediting.table.availableToWithdraw'),
          wusd: this.$t('crediting.table.wusd'),
          manage: this.$t('crediting.table.manage'),
        },
        {
          id: this.$t('crediting.table.id'),
          currentRatio: this.$t('crediting.table.currentRatio'),
          deposited: this.$t('crediting.table.deposited'),
          availableToWithdraw: this.$t('crediting.table.availableToWithdraw'),
          wusd: this.$t('crediting.table.wusd'),
          manage: this.$t('crediting.table.manage'),
        },
      ],
      testFields: [
        {
          key: 'ID',
          label: this.$t('crediting.tableHead.id'),
          sortable: false,
          thClass: 'cell_head',
        },
        {
          key: 'currentRatio',
          label: this.$t('crediting.tableHead.currentRatio'),
          sortable: false,
          thClass: 'cell_head',
        },
        {
          key: 'deposited',
          label: this.$t('crediting.tableHead.deposited'),
          sortable: false,
          thClass: 'cell_head',
        },
        {
          key: 'availableToWithdraw',
          label: this.$t('crediting.tableHead.availableToWithdraw'),
          sortable: false,
          thClass: 'cell_head',
        },
        {
          key: 'WUSD',
          label: this.$t('crediting.tableHead.wusd'),
          sortable: false,
          thClass: 'cell_head',
        },
        {
          key: 'manage',
          label: '',
          sortable: false,
        },
      ],
      cards: [
        {
          title: this.$tc('crediting.usdCount', '255.5'),
          subtitle: this.$t('crediting.totalCollateralLocked'),
        },
        {
          title: this.$tc('crediting.wusdCount', '2,150.26'),
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
      .cell {
        padding: 0;

        &_head {
          @extend .cell;
        }
      }

      &__header {
        height: 27px;
        align-items: center;
        background-color: rgba(0, 131, 199, 0.1);
        display: grid;
        grid-template-columns: repeat(6, 1fr);
        padding: 0 20px;
        margin-bottom: 10px;
        grid-gap: 10px;
        font-size: 12px;
        color: #0083C7;
      }

      &__rows {
        display: grid;
        grid-auto-rows: 33px;
        grid-row-gap: 20px;
        padding-bottom: 20px;
      }

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
}
</style>
