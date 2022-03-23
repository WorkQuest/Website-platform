<template>
  <div class="crediting">
    <div class="crediting__container">
      <div class="crediting__header">
        <base-btn
          class="btn"
          @click="handleBackToCrediting()"
        >
          <template v-slot:left>
            <span class="icon-chevron_left" />
          </template>
          {{ $t('meta.btns.back') }}
        </base-btn>
        <div class="title">
          {{ $t('meta.crediting') }}
        </div>
        <div class="desc">
          {{ $t('crediting.description') }}
        </div>
      </div>
      <div class="crediting__content">
        <div class="info-block__couple">
          <div
            v-for="(data, index) in blocksData"
            :key="index"
            class="info-block_half"
          >
            <div class="info-block__title_big">
              {{ data.title }}
            </div>
            <div class="info-block__price">
              <div class="info-block__title_small">
                {{ data.priceTitle }}
              </div>
              <div class="info-block__title_big info-block__title_blue">
                {{ data.price }}
              </div>
            </div>
            <div class="info-block__info-data">
              <div
                v-for="(info, key) in data.info"
                :key="key"
                class="info-data__content"
              >
                <div class="info-data__title">
                  {{ info.title }}
                </div>
                <div class="info-data__desc">
                  {{ info.desc }}
                </div>
              </div>
            </div>
            <div class="info-block__buttons">
              <base-btn
                v-for="(button, key) in data.buttons"
                :key="key"
                :mode="button.mode"
                @click="openModal(button.action)"
              >
                {{ button.title }}
              </base-btn>
            </div>
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
    blocksData() {
      return [
        {
          title: this.$t('crediting.currentLoan'),
          priceTitle: this.$t('crediting.totalCollateralLocked'),
          price: this.$tc('meta.coins.count.USDCount', 225.5),
          info: [
            {
              title: 'ID',
              desc: 565464,
            },
            {
              title: this.$t('crediting.tableHead.currentRatio'),
              desc: 565464,
            },
            {
              title: this.$t('crediting.tableHead.deposited'),
              desc: 123,
            },
          ],
          buttons: [
            {
              title: this.$t('meta.withdraw'),
              mode: '',
              action: 'withdraw',
            },
            {
              title: this.$t('meta.deposit'),
              mode: 'outline',
            },
            {
              title: this.$t('modals.claim'),
              mode: 'outline',
            },
          ],
        },
        {
          title: this.$t('crediting.currentCredit'),
          priceTitle: this.$t('crediting.totalWusdDebt'),
          price: this.$tc('meta.coins.count.WUSDCount', 225.5),
          info: [
            {
              title: 'ID',
              desc: 565464,
            },
            {
              title: this.$t('crediting.tableHead.currentRatio'),
              desc: 565464,
            },
            {
              title: this.$t('crediting.tableHead.deposited'),
              desc: 123,
            },
          ],
          buttons: [
            {
              title: this.$t('crediting.refund'),
              mode: '',
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
      this.$router.push('/crediting');
    },
    openModal(action) {
      this.ShowModal({
        key: modals.claimRewards,
        needChangeModal: 1,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.crediting {
  background: linear-gradient(to bottom, #103D7C 290px, #f6f8fa 232px);
  display: flex;
  justify-content: center;

  &__container {
    display: grid;
    grid-template-rows: 180px max-content;
    max-width: 1180px;
    grid-gap: 40px;
    width: 100%;
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
    grid-template-rows: max-content;

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
      &__info-data {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-gap: 20px;
      }
      &__buttons {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-gap: 20px;
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
        display: grid;
        grid-gap: 20px;
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
    .info-data {
      &__title {
        font-weight: 600;
        font-size: 18px;
        line-height: 130%;
      }
      &__desc {
        font-weight: 400;
        font-size: 16px;
        line-height: 130%;
        color: $black500;
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

  .desc {
    width: 540px;
    color: #8299bb;
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
