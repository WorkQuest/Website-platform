<template>
  <div class="insuring-page">
    <div class="insuring-page__container">
      <div class="insuring-page__header">
        <div class="title">
          {{ $t('insuring.peerToPeerInsuring') }}
        </div>
        <div class="title_sub">
          {{ $t('insuring.templateText') }}
        </div>
      </div>
      <div class="insuring-page__content">
        <div class="info-block_pad">
          <div class="info-block__name_blue">
            {{ $t('insuring.minimalProtectionPlan') }}
          </div>
          <div class="info-block__couple">
            <div class="info-block__couple info-block_gray">
              <div class="info-block__flex">
                <div class="title">
                  {{ $t('insuring.yourFundBalance') }}
                </div>
                <div class="title_blue">
                  {{ $tc('insuring.wusdCount', 1500) }}
                </div>
                <div class="title_gray">
                  {{ $tc('insuring.dollarsCount', '120.34') }}
                </div>
              </div>
              <base-btn
                class="btn_bl"
                @click="openWithdrawModule()"
              >
                {{ $t('insuring.withdraw') }}
              </base-btn>
            </div>
            <div class="info-block__points info-block_gray">
              <div
                v-for="(point, i) in points"
                :key="i"
                class="info-block__point"
              >
                {{ point }}
              </div>
            </div>
          </div>
          <div class="btn-group__fifths">
            <base-btn class="btn_bl">
              {{ $t('insuring.changePlan') }}
            </base-btn>
            <base-btn class="btn_red">
              {{ $t('insuring.leaveFund') }}
            </base-btn>
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
      points: [
        this.$t('insuring.pointTemplate'),
        this.$t('insuring.pointTemplate'),
        this.$t('insuring.pointTemplate'),
      ],
      cards: [
        {
          name: this.$t('insuring.minimalProtection'),
          points: [
            this.$t('insuring.pointTemplate'),
            this.$t('insuring.pointTemplate'),
            this.$t('insuring.pointTemplate'),
          ],
        },
        {
          name: this.$t('insuring.standartProtection'),
          points: [
            this.$t('insuring.pointTemplate'),
            this.$t('insuring.pointTemplate'),
            this.$t('insuring.pointTemplate'),
          ],
        },
        {
          name: this.$t('insuring.maximumProtection'),
          points: [
            this.$t('insuring.pointTemplate'),
            this.$t('insuring.pointTemplate'),
            this.$t('insuring.pointTemplate'),
          ],
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
    handleClickBuyProtection() {
      this.$router.push('/insuring/1');
    },
    openWithdrawModule() {
      this.ShowModal({
        key: modals.withdraw,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.insuring-page {
  background: linear-gradient(to bottom, #103D7C 376px, #f6f8fa 376px);
  display: flex;
  justify-content: center;

  &__container {
    display: grid;
    grid-template-rows: 195px max-content;
    max-width: 1280px;
    grid-row-gap: 30px;
    width: 100%;
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

    .btn-group {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;

      &__fifths {
        @extend .btn-group;
        grid-template-columns: repeat(5, 1fr);
        direction: rtl;
      }

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

    .info-block {
      background-color: #fff;
      border-radius: 6px;

      .title {
        color: #4C5767;
        font-weight: 400;
        font-size: 14px;

        &_blue {
          color: #0083C7;
          font-weight: 700;
          font-size: 25px;
        }

        &_gray {
          color: #AAB0B9;
          font-weight: 500;
          font-size: 16px;
        }
      }

      &__flex {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }

      &__couple {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;

        .btn {
          align-self: flex-end;
          width: 80%;
          margin-left: 20%;
        }
      }

      &_gray {
        background-color: #F7F8FA;
        padding: 15px;
      }

      &_pad {
        @extend .info-block;
        padding: 20px;
        display: flex;
        gap: 20px;
        flex-direction: column;
      }

      &__point {
        font-weight: 400;
        font-size: 16px;
        color: #7C838D;
        position: relative;
        padding-left: 17px;
        line-height: 1;

        &:before {
          content: "";
          height: 7px;
          width: 7px;
          position: absolute;
          border-radius: 50%;
          left: 0;
          top: 5px;
          background-color: #0083C7;
        }
      }

      &__points {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      &__triple {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
      }

      &__third {
        @extend .info-block;
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 30px;
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

        &_blue {
          font-weight: 600;
          font-size: 25px;
          color: #0083C7;
          line-height: 1;
        }
      }
    }
  }
}
</style>
