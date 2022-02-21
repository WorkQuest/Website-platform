<template>
  <div class="crediting-page">
    <div class="crediting-page__container">
      <div class="crediting-page__header">
        <base-btn
          class="btn"
          @click="handleBackToCrediting()"
        >
          <template v-slot:left>
            <span class="icon-chevron_left" />
          </template>
          {{ $t('meta.back') }}
        </base-btn>
        <div class="title">
          {{ $t('crediting.tempName') }}
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
        <div
          v-for="(item, i) in containers"
          :key="i"
          class="info-block"
        >
          <div class="info-block__name_bold">
            {{ item.name }}
          </div>
          <div class="info-block__couple_gr">
            <div
              v-for="(block, ind) in item.blocks"
              :key="ind"
              class="info-block_gray"
            >
              <div class="info-block__left">
                <div class="title">
                  {{ block.name }}
                </div>
                <div class="title_blue">
                  {{ block.about }}
                </div>
              </div>
              <base-btn class="btn_bl">
                {{ block.btn.name }}
              </base-btn>
            </div>
          </div>
        </div>
        <div class="info-block">
          <div class="info-block__name">
            {{ $t('crediting.history') }}
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
              <template #cell(activity)="el">
                <div class="table__value_gray">
                  {{ el.item.activity }}
                </div>
              </template>
              <template #cell(amount)="el">
                <div class="table__value_blue">
                  {{ el.item.amount }}
                </div>
              </template>
              <template #cell(time)="el">
                <div class="table__value_gray">
                  {{ el.item.time }}
                </div>
              </template>
              <template #cell(sender)="el">
                <div class="table__value">
                  {{ el.item.sender }}
                </div>
              </template>
              <template #cell(sender)="el">
                <div class="table__value">
                  {{ el.item.sender }}
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
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
    }),
    items() {
      return [
        {
          activity: this.$t('crediting.credTable.activity'),
          amount: this.$t('crediting.credTable.amount'),
          time: this.$t('crediting.credTable.time'),
          sender: this.$t('crediting.credTable.sender'),
          txHash: this.$t('crediting.credTable.txHash'),
        },
        {
          activity: this.$t('crediting.credTable.activity'),
          amount: this.$t('crediting.credTable.amount'),
          time: this.$t('crediting.credTable.time'),
          sender: this.$t('crediting.credTable.sender'),
          txHash: this.$t('crediting.credTable.txHash'),
        },
      ];
    },
    testFields() {
      return [
        {
          key: 'activity',
          label: this.$t('crediting.credTableHeader.activity'),
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
          key: 'amount',
          label: this.$t('crediting.credTableHeader.amount'),
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
          label: this.$t('crediting.credTableHeader.time'),
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
          key: 'sender',
          label: this.$t('crediting.credTableHeader.sender'),
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
          label: this.$t('crediting.credTableHeader.txHash'),
          thStyle: {
            padding: '0',
            height: '27px',
            lineHeight: '27px',
          },
          tdAttr: {
            style: 'padding: 0; height: 64px; line-height: 64px',
          },
        },
      ];
    },
    cards() {
      return [
        {
          title: this.$tc('crediting.usdCount', '114.92'),
          subtitle: this.$t('crediting.liquidationPrice'),
        },
        {
          title: this.$tc('crediting.percentsCount', '171.65'),
          subtitle: this.$t('crediting.collateralizationRatio'),
        },
      ];
    },
    containers() {
      return [
        {
          name: this.$t('crediting.ethLocked'),
          blocks: [
            {
              name: this.$t('crediting.ethLocked'),
              about: this.$tc('crediting.ethCount', '3.00'),
              btn: {
                name: this.$t('crediting.deposit'),
              },
            },
            {
              name: this.$t('crediting.ableToWithdraw'),
              about: this.$tc('crediting.ethCount', '3.00'),
              btn: {
                name: this.$t('crediting.withdraw'),
              },
            },
          ],
        },
        {
          name: this.$t('crediting.outstandingWusdDebt'),
          blocks: [
            {
              name: this.$t('crediting.outstandingWusdDebt'),
              about: this.$tc('meta.WUSDCount', '3.00'),
              btn: {
                name: this.$t('crediting.payback'),
              },
            },
            {
              name: this.$t('crediting.availableToGenerate'),
              about: this.$tc('meta.WUSDCount', '5 6543.23'),
              btn: {
                name: this.$t('crediting.generate'),
              },
            },
          ],
        },
      ];
    },
  },
  async mounted() {
    this.SetLoader(true);
    this.SetLoader(false);
  },
  methods: {
    handleBackToCrediting() {
      this.$router.push('/crediting/1');
    },
  },
};
</script>

<style lang="scss" scoped>
.crediting-page {
  background: linear-gradient(to bottom, #103D7C 232px, #f6f8fa 232px);
  display: flex;
  justify-content: center;

  &__container {
    display: grid;
    grid-template-rows: 130px max-content;
    max-width: 1180px;
    grid-row-gap: 50px;
    width: 100%;
    gap: 28px;
    padding: 10px;
    box-sizing: border-box;
  }

  &__header {
    align-self: flex-end;

    .btn {
      background-color: unset;
      color: #fff;
      width: 100px;
      padding: 0;
      gap: 5px;
      font-size: 18px;
      font-weight: 400;
      margin-bottom: 10px;

      .icon-chevron_left {
        font-size: 26px;
        &:before {
          color: #fff;
        }
      }
    }

    .title {
      font-weight: 500;
      color: #FFF;
      max-width: 530px;
      font-size: 35px;
      line-height: 110%;
      margin: 0 0 20px;
    }
  }

  &__content {
    display: grid;
    grid-row-gap: 30px;
    width: 100%;
    grid-template-rows: 141px max-content;

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

      &_gray {
        border-radius: 5px;
        background-color: #F7F8FA;
        padding: 20px;
        display: grid;
        grid-template-columns: 3fr 1fr;
        gap: 20px;

        .btn {
          align-self: flex-end;
        }
      }

      &__left {
        display: grid;
        gap: 20px;

        .title {
          color: #7C838D;
          font-size: 16px;
          font-weight: 400;

          &_blue {
            color: #0083C7;
            font-size: 18px;
            font-weight: 500;
          }
        }
      }

      &__couple {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;

        &_gr {
          @extend .info-block__couple;
          padding: 0 20px 20px 20px;
        }
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
      }

      &__name {
        font-size: 16px;
        color: #1D2127;
        padding: 20px 20px 10px 20px;
        font-weight: 400;
        position: relative;

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
      }
    }
  }

  @include _767 {
    background: linear-gradient(to bottom, #103D7C 195px, #f6f8fa 195px);
    &__container {
      grid-template-rows: auto auto;
      gap: 15px;
    }
    &__header {
      .btn {
        justify-content: left;
      }
      .title {
        font-size: 38px;
        margin-bottom: 15px;
        width: 100%;
      }
    }
    &__content {
      grid-template-rows: auto;
      .info-block {
        &_gray {
          grid-template-columns: unset;
          grid-template-rows: repeat(2, auto);
        }
      }
    }
  }

  @include _575 {
    &__content {
      .info-block {
        &__couple {
          grid-template-rows: repeat(2, 1fr);
          grid-template-columns: unset;
        }
      }
    }
  }
}
</style>
