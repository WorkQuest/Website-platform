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
              <template #cell(poolAddress)="el">
                <div class="table__value_gray">
                  {{ el.item.poolAddress }}
                </div>
              </template>
              <template #cell(assets)="el">
                <div class="table__value">
                  {{ el.item.assets }}
                </div>
              </template>
              <template #cell(sdsdsdsd)="el">
                <div class="table__value">
                  {{ el.item.sdsdsdsd }}
                </div>
              </template>
              <template #cell(volume)="el">
                <div class="table__value">
                  {{ el.item.volume }}
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
          poolAddress: this.$t('crosschain.table.poolAddress'),
          assets: this.$t('crosschain.table.assets'),
          template1: this.$t('crosschain.table.sdsdsdsd'),
          template2: this.$t('crosschain.table.sdsdsdsd'),
          template3: this.$t('crosschain.sdsdsdsd'),
          volume: this.$t('crosschain.table.volume'),
        },
        {
          poolAddress: this.$t('crosschain.table.poolAddress'),
          assets: this.$t('crosschain.table.assets'),
          template1: this.$t('crosschain.table.sdsdsdsd'),
          template2: this.$t('crosschain.table.sdsdsdsd'),
          template3: this.$t('crosschain.sdsdsdsd'),
          volume: this.$t('crosschain.table.volume'),
        },
      ],
      testFields: [
        {
          key: 'poolAddress',
          label: this.$t('crosschain.tableHead.poolAddress'),
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
          key: 'assets',
          label: this.$t('crosschain.tableHead.assets'),
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
          key: 'template1',
          label: this.$t('crosschain.tableHead.sdsdsdsd'),
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
          key: 'template2',
          label: this.$t('crosschain.tableHead.sdsdsdsd'),
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
          key: 'template3',
          label: this.$t('crosschain.tableHead.sdsdsdsd'),
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
          key: 'volume',
          label: this.$t('crosschain.tableHead.volume'),
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

    .btn-group {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
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
      height: 35px;
      margin-top: 3px;

      &__doc {
        @extend .btn;
        width: 220px;
        height: 46px;
        margin: 0;

        .download {
          display: unset;
          vertical-align: unset;
          margin-left: 5px;
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

      &__square {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 20px;
      }

      &__quarter {
        @extend .info-block;
        text-align: center;
        display: grid;
        align-content: center;
        gap: 20px;
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
      }

      &__about {
        width: calc(100% - 50px);
        grid-template-areas:
          "hd ."
          "ft sd";
        margin-left: 20px;
        display: grid;
        grid-template-columns: 60% auto;
        grid-template-rows: auto 63px;
        gap: 20px;
        position: relative;

        .info-block__subtitle {
          grid-area: hd;
        }

        .calendar-img {
          grid-area: sd;
          position: absolute;
          right: 0px;
          bottom: 0;
        }

        .btn-group {
          grid-area: ft;
        }
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

        &_gray {
          @extend .table__value;
          color: #7C838D;
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
    background: linear-gradient(to bottom, #103D7C 270px, #f6f8fa 270px);
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
    }
  }

  @include _575 {
    &__content {
      .btn {
        &__doc {
          border: 0;
          width: 23px;
          font-size: 0;
        }
      }
    }
  }
}
</style>
