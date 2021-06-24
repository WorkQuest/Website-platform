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
        <div class="info-block__triple">
          <div
            v-for="(item, i) in cards"
            :key="i"
            class="info-block__third"
          >
            <div class="info-block__name_blue">
              {{ item.name }}
            </div>
            <div class="info-block__points">
              <div
                v-for="(point, ind) in item.points"
                :key="ind"
                class="info-block__point"
              >
                {{ point }}
              </div>
            </div>
            <base-btn
              class="btn_bl"
              @click="handleClickBuyProtection()"
            >
              {{ $t('insuring.buy') }}
            </base-btn>
          </div>
        </div>
        <div
          v-if="documents.length"
          class="info-block"
        >
          <div class="info-block__name_bold">
            {{ $t("insuring.information") }}
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
              <button class="btn__doc">
                {{ $t('pension.download') }}
                <img
                  class="download"
                  src="~/assets/img/ui/download.svg"
                  alt=""
                >
              </button>
            </div>
          </div>
        </div>
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
      documents: [
        {
          name: this.$t('insuring.docName'),
          size: this.$tc('insuring.mb', '1.2'),
          url: '',
        },
        {
          name: this.$t('insuring.docName'),
          size: this.$tc('insuring.mb', '1.2'),
          url: '',
        },
        {
          name: this.$t('insuring.docName'),
          size: this.$tc('insuring.mb', '1.2'),
          url: '',
        },
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
      FAQs: [
        {
          name: this.$t('insuring.faq1'),
          about: this.$t('insuring.faq1'),
          isOpen: false,
        },
        {
          name: this.$t('insuring.faq2'),
          about: this.$t('insuring.ans2'),
          isOpen: false,
        },
        {
          name: this.$t('insuring.faq3'),
          about: this.$t('insuring.faq3'),
          isOpen: false,
        },
        {
          name: this.$t('insuring.faq4'),
          about: this.$t('insuring.faq4'),
          isOpen: false,
        },
        {
          name: this.$t('insuring.faq5'),
          about: this.$t('insuring.faq5'),
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
    handleClickBuyProtection() {
      this.$router.push('/insuring/1');
    },
    handleClickFAQ(FAQ) {
      FAQ.isOpen = !FAQ.isOpen;
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
    max-width: 1180px;
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

    .btn-group {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
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

      &__doc {
        @extend .btn;
        width: 220px;
        height: 46px;

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
        gap: 30px;
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
