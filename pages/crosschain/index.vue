<template>
  <div class="crosschain-page">
    <div class="crosschain-page__container">
      <div class="crosschain-page__header">
        <div class="title">
          {{ $t('crosschain.pageName') }}
        </div>
        <div class="title_sub">
          {{ $t('crosschain.pageAbout') }}
        </div>
      </div>
      <div class="crosschain-page__content">
        <div class="info-block">
          <div class="info-block__swap-cont">
            <div>
              <div class="info-block__name_bold">
                {{ $t("crosschain.sourceBlockchain") }}
              </div>
              <div class="contract-data">
                <div>
                  <div class="contract-data__title">
                    {{ $t('crosschain.blockchain') }}
                  </div>
                  <base-dd
                    v-model="sourceAddressInd"
                    type="border"
                    :items="addresses"
                    :is-icon="true"
                    @input="handleChangeSource"
                  />
                </div>
                <div>
                  <div class="contract-data__title">
                    {{ $t('crosschain.yourWQTAddress') }}
                  </div>
                  <div class="contract-data__link">
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
                <div>
                  <div class="contract-data__title">
                    {{ $t('crosschain.balance') }}
                  </div>
                  <div class="contract-data__balance">
                    <div class="title">
                      15 000 WQT
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <img
              src="~assets/img/ui/swap.png"
              alt=""
              class="swap-icon"
            >
            <div>
              <div class="info-block__name_bold">
                {{ $t("crosschain.targetBlockchain") }}
              </div>
              <div class="contract-data">
                <div>
                  <div class="contract-data__title">
                    {{ $t('crosschain.blockchain') }}
                  </div>
                  <base-dd
                    v-model="targetAddressInd"
                    type="border"
                    :items="addresses"
                    :is-icon="true"
                    @input="handleChangeTarget"
                  />
                </div>
                <div>
                  <div class="contract-data__title">
                    {{ $t('crosschain.YourBSCAddress') }}
                  </div>
                  <div class="contract-data__link">
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
                <div>
                  <div class="contract-data__title">
                    {{ $t('crosschain.balance') }}
                  </div>
                  <div class="contract-data__balance">
                    <div class="title">
                      15 000 WQT
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="info-block__btns-cont">
            <base-btn>
              {{ $t('crosschain.createSwap') }}
            </base-btn>
          </div>
        </div>
        <div class="info-block">
          <div class="info-block__name">
            {{ $t('crosschain.mySwaps') }}
          </div>
          <div class="crosschain-page__table">
            <b-table
              :items="items"
              :fields="testFields"
              borderless
              caption-top
              thead-class="table__header"
              tbody-tr-class="table__row"
            >
              <template #cell(direction)="el">
                <div class="table__direction">
                  <img
                    :src="el.item.direction[0]"
                    alt=""
                  >
                  <img
                    class="arrow-img"
                    src="~/assets/img/ui/arrow-down.svg"
                    alt=""
                  >
                  <img
                    :src="el.item.direction[1]"
                    alt=""
                  >
                </div>
              </template>
              <template #cell(recipient)="el">
                <div class="table__value">
                  {{ el.item.recipient }}
                </div>
              </template>
              <template #cell(tx)="el">
                <div class="table__value">
                  {{ el.item.tx }}
                </div>
              </template>
              <template #cell(created)="el">
                <div class="table__value table__value_blue">
                  {{ el.item.created }}
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
    return {
      referLink: 'https://www.workquest.com/ref?v=44T7iUSo1vU',
      sourceAddressInd: 0,
      targetAddressInd: 1,
      items: [
        {
          direction: [
            require('~/assets/img/ui/WQT.png'),
            require('~/assets/img/ui/Binance.png'),
          ],
          recipient: this.$t('crosschain.recipTemp'),
          tx: this.$t('crosschain.recipTemp'),
          created: this.$t('crosschain.dateTemp'),
        },
        {
          direction: [
            require('~/assets/img/ui/WQT.png'),
            require('~/assets/img/ui/Binance.png'),
          ],
          recipient: this.$t('crosschain.recipTemp'),
          tx: this.$t('crosschain.recipTemp'),
          created: this.$t('crosschain.dateTemp'),
        },
      ],
      testFields: [
        {
          key: 'direction',
          label: this.$t('crosschain.tableHead.direction'),
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
          key: 'recipient',
          label: this.$t('crosschain.tableHead.recipient'),
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
          key: 'tx',
          label: this.$t('crosschain.tableHead.tx'),
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
          key: 'created',
          label: this.$t('crosschain.tableHead.created'),
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
    addresses() {
      return [
        {
          icon: require('~/assets/img/ui/WQT.png'),
          title: this.$t('crosschain.worknet'),
        },
        {
          icon: require('~/assets/img/ui/Binance.png'),
          title: this.$t('crosschain.bsc'),
        },
      ];
    },
  },
  async mounted() {
    this.SetLoader(true);
    this.SetLoader(false);
  },
  methods: {
    doCopy(ev) {
      ev.stopPropagation();
      this.$copyText(this.referLink).then(() => {
      });
    },
    handleChangeTarget(selInd) {
      if (selInd === this.sourceAddressInd) {
        this.sourceAddressInd = selInd ? 0 : 1;
      }
      this.targetAddressInd = selInd;
    },
    handleChangeSource(selInd) {
      if (selInd === this.targetAddressInd) {
        this.targetAddressInd = selInd ? 0 : 1;
      }
      this.sourceAddressInd = selInd;
    },
  },
};
</script>

<style lang="scss" scoped>
.crosschain-page {
  background: linear-gradient(to bottom, #103D7C 420px, #f6f8fa 420px);
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

      &__swap-cont {
        display: grid;
        grid-template-columns: 1fr 34px 1fr;
        gap: 20px;
        align-items: center;
        padding: 20px;

        .contract-data {
          display: grid;
          grid-template-rows: repeat(3, 1fr);
          gap: 15px;
          margin-top: 20px;

          &__title {
            font-weight: 400;
            font-size: 16px;
            margin-bottom: 5px;
          }

          &__link {
            border: 1px solid #F7F8FA;
            border-radius: 6px;
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
          &__balance {
            border: 1px solid #F7F8FA;
            border-radius: 6px;
            padding: 0 20px;
            height: 46px;
            box-sizing: border-box;
            display: grid;

            .title {
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              line-height: 46px;
            }
          }
        }
      }

      &__btns-cont {
        padding: 0 20px 20px 20px;
        display: grid;

        .base-btn {
          grid-column: 7;
        }
      }

      &__title {
        color: #0083C7;
        font-weight: 700;
        font-size: 25px;
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
        }
      }
    }
  }

  &__table {
    .table {
      margin: 0;
      border-radius: 0 !important;

      &__value {
        font-weight: 400;
        font-size: 16px;
        color: #1D2127;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        &_blue {
          color: #0083C7;
        }
      }

      &__direction {
        display: grid;
        grid-template-columns: 25px 14px 25px;
        height: 100%;
        align-items: center;
        gap: 5px;

        .arrow-img {
          transform: rotate(-90deg);
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

      .info-block {
        &__swap-cont {
          grid-template-columns: 1fr 24px 1fr;
        }
      }
    }
  }

  @include _575 {
    &__content {
      .info-block {
        &__swap-cont {
          grid-template-columns: 1fr 34px 1fr;
          grid-template-rows: repeat(3, auto);

          .swap-icon {
            grid-column: 2;
            grid-row: 2;
          }

          >div {
            grid-column: 1/4;
          }
        }

        &__btns-cont {
          .base-btn {
            grid-column: 2;
          }
        }
      }
      .btn {
        &__doc {
          border: 0;
          width: 23px;
          font-size: 0;
        }
      }
    }
  }

  @include _480 {
    &__content {
      .info-block {
        &__btns-cont {
          .base-btn {
            grid-column: 1;
          }
        }
      }
    }
  }
}
</style>
