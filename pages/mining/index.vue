<template>
  <div class="mining-page">
    <div class="mining-page__container">
      <div class="mining-page__header">
        <div class="title">
          {{ $t('meta.liquidityMining') }}
        </div>
        <div class="title_sub">
          {{ $t('mining.liquidityMiningSub') }}
        </div>
      </div>
      <div class="mining-page__content">
        <div class="info-block">
          <div class="info-block__name_bold">
            {{ $t('mining.pools') }}
          </div>
          <div class="mining-page__table">
            <b-table
              :items="pools"
              :fields="tableFields"
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
              <template #cell(choose)="el">
                <base-btn
                  class="btn_bl"
                  :data-selector="`${el.item.chooseBtn}`"
                  :disabled="el.item.disabled"
                  @click="handleOpenPool(el)"
                >
                  {{ el.item.chooseBtn }}
                </base-btn>
              </template>
            </b-table>
          </div>
        </div>
        <div
          v-if="documents.length"
          class="info-block"
        >
          <div class="info-block__name_bold">
            {{ $t("meta.information") }}
          </div>
          <div class="info-block__documents">
            <div
              v-for="(item, i) in documents"
              :key="i"
              class="document"
            >
              <img
                class="document__img"
                src="~/assets/img/ui/pdf.svg"
                alt=""
              >
              <div class="document__title">
                <div class="document__name">
                  {{ item.name }}
                </div>
                <div class="document__size">
                  {{ item.size }}
                </div>
              </div>
              <a
                :href="item.url"
                target="_blank"
                class="btn__doc"
              >
                {{ $t('meta.btns.download') }}
                <img
                  class="download"
                  src="~/assets/img/ui/download.svg"
                  alt=""
                >
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Layout, Path } from '~/utils/enums';

export default {
  name: 'Pools',
  layout({ $cookies }) {
    return $cookies.get('access') ? Layout.DEFAULT : Layout.GUEST;
  },
  data() {
    return {
      poolAddress: '',
    };
  },
  computed: {
    pools() {
      return [
        {
          id: 'ETH',
          poolAddress: '0x06677dc4fe12d3ba3c7ccfd0df8cd45e4d4095bf',
          assets: '50% WQT / 50% ETH',
          chooseBtn: this.$t('mining.choose'),
          disabled: false,
        },
        {
          id: 'BNB',
          poolAddress: '0xbc648cbd7b2b2c666f9f46ac5c5ce6ee77f9c407',
          assets: '50% WQT / 50% BNB',
          chooseBtn: this.$t('mining.choose'),
          disabled: false,
        },
      ];
    },
    documents() {
      return [
        {
          name: this.$t('mining.agreement'),
          size: this.$tc('meta.units.kb', 47),
          url: '/docs/agreement.pdf',
        },
      ];
    },
    tableFields() {
      return [
        {
          key: 'poolAddress',
          label: this.$t('mining.tableHead.poolAddress'),
          thStyle: {
            padding: '0 25px',
            height: '27px',
            lineHeight: '27px',
          },
          tdAttr: {
            style: 'padding: 0 25px; height: 64px; line-height: 64px',
          },
        },
        {
          key: 'assets',
          label: this.$t('mining.tableHead.assets'),
          thStyle: {
            padding: '0 25px',
            height: '27px',
            lineHeight: '27px',
          },
          tdAttr: {
            style: 'padding: 0 25px; height: 64px; line-height: 64px',
          },
        },
        {
          key: 'choose',
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
      ];
    },
  },
  methods: {
    handleOpenPool(el) {
      this.$router.push(`${Path.MINING}/${el.item.id}`);
    },
  },
};
</script>

<style lang="scss" scoped>
.mining-page {
  &__container {
    width: 100%;
  }

  &__head-btn {
    width: 150px;
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
        display: flex;
        width: 220px;
        height: 46px;
        justify-content: center;
        align-items: center;
        margin: 0;
        text-decoration: none;

        .download {
          display: unset;
          vertical-align: unset;
          margin-left: 5px;
        }
      }

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

    .info-block {
      background-color: #fff;
      border-radius: 6px;

      &:not(:first-of-type) {
        margin-top: 30px;
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

      &__documents {
        padding: 0 20px 20px 20px;
        display: grid;
        gap: 20px;

        .document {
          border: 1px solid #E1E4ED;
          border-radius: 8px;
          height: 80px;
          padding: 0 20px;
          align-items: center;
          display: grid;
          grid-template-columns: 33px auto 220px;

          &__title {
            padding: 0 10px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            display: flex;
            align-items: center;
          }

          &__name {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            font-weight: 400;
            font-size: 16px;
            padding-right: 10px;
          }

          &__size {
            font-weight: 400;
            font-size: 13px;
            color: #A7AEB9;
          }
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
          padding: 20px;
        }
      }
    }
  }

  &__table {
    overflow: auto;
    .table {
      min-width: 1180px !important;
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
    }
  }

  @include _575 {
    &__content {
      .info-block {
        &__documents {
          .document {
            grid-template-columns: repeat(3, auto);
          }
        }
      }
      .btn {
        &__doc {
          text-decoration: none;
          border: 0;
          width: 30px;
          height: 30px;
          font-size: 0;
          .download {
            margin-left: 0;
          }
        }
      }
    }
  }
}
</style>
