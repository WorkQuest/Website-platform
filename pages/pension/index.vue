<template>
  <div class="pension-page">
    <div class="pension-page__container">
      <div class="pension-page__header">
        <div class="title">
          {{ $t('pension.retirementProgram') }}
        </div>
        <div class="title_sub">
          {{ $t('ui.menu.pension.desc') }}
        </div>
      </div>
      <div class="pension-page__content">
        <div class="info-block__square">
          <div
            v-for="(item, i) in cards"
            :key="i"
            class="info-block__quarter"
          >
            <div class="info-block__title">
              {{ item.title }}
            </div>
            <div class="info-block__subtitle">
              {{ item.subtitle }}
            </div>
          </div>
        </div>
        <div class="info-block">
          <div class="info-block__name_bold">
            {{ $t('pension.howToTakePart') }}
          </div>
          <div class="info-block__about">
            <div class="info-block__subtitle">
              {{ $t('pension.pensionPlanText') }}
            </div>
            <img
              class="calendar-img"
              src="~/assets/img/ui/calendar.svg"
              alt=""
            >
            <div class="btn-group">
              <base-btn
                class="btn_bl"
                @click="openApplyForAPensionModal()"
              >
                {{ $t('pension.applyForRetirement') }}
              </base-btn>
            </div>
          </div>
        </div>
        <div
          v-if="documents.length"
          class="info-block"
        >
          <div class="info-block__name_bold">
            {{ $t("pension.information") }}
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
        <div @click="startPensionProgram">
          start pension (test)
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
import { Chains } from '~/utils/enums';

export default {
  data() {
    return {
      documents: [
        {
          name: this.$t('pension.docName'),
          size: this.$tc('pension.mb', '1.2'),
          url: '',
        },
        {
          name: this.$t('pension.docName'),
          size: this.$tc('pension.mb', '1.2'),
          url: '',
        },
        {
          name: this.$t('pension.docName'),
          size: this.$tc('pension.mb', '1.2'),
          url: '',
        },
      ],
      lockTime: '',
      percent: '',
      FAQs: [
        {
          name: this.$t('pension.faq1.question'),
          about: this.$t('pension.faq1.answer'),
          isOpen: false,
        },
        {
          name: this.$t('pension.faq2.question'),
          about: this.$t('pension.faq2.answer'),
          isOpen: false,
        },
        {
          name: this.$t('pension.faq3.question'),
          about: this.$t('pension.faq3.answer'),
          isOpen: false,
        },
        {
          name: this.$t('pension.faq4.question'),
          about: this.$t('pension.faq4.answer'),
          isOpen: false,
        },
        {
          name: this.$t('pension.faq5.question'),
          about: this.$t('pension.faq5.answer'),
          isOpen: false,
        },
        {
          name: this.$t('pension.faq6.question'),
          about: this.$t('pension.faq6.answer'),
          isOpen: false,
        },
        {
          name: this.$t('pension.faq7.question'),
          about: this.$t('pension.faq7.answer'),
          isOpen: false,
        },
        {
          name: this.$t('pension.faq8.question'),
          about: this.$t('pension.faq8.answer'),
          isOpen: false,
        },
        {
          name: this.$t('pension.faq9.question'),
          about: this.$t('pension.faq9.answer'),
          isOpen: false,
        },
        {
          name: this.$t('pension.faq10.question'),
          about: this.$t('pension.faq10.answer'),
          isOpen: false,
        },
      ],
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
      isConnected: 'web3/isConnected',
    }),
    cards() {
      const percent = this.percent || '';
      const time = this.lockTime || '';
      return [
        {
          title: this.$tc('pension.percents', percent),
          subtitle: this.$t('pension.annualPercent'),
        },
        {
          title: this.$t('pension.optionalFirstDeposit'),
          subtitle: this.$t('pension.optional'),
        },
        {
          title: this.$tc('pension.years', time),
          subtitle: this.$t('pension.term'),
        },
        {
          title: this.$t('pension.configurablePercentage'),
          subtitle: this.$t('pension.depositsFromQuest'),
        },
      ];
    },
  },
  watch: {
    async isConnected(newValue) {
      const rightChain = await this.$store.dispatch('web3/chainIsCompareToCurrent', Chains.ETHEREUM);
      if (newValue && rightChain) {
        this.SetLoader(true);
        await this.checkWalletExists();
        const { lockTime, defaultFee } = await this.$store.dispatch('web3/getPensionDefaultData');
        this.lockTime = lockTime;
        this.percent = defaultFee;
        this.SetLoader(false);
      } else {
        this.lockTime = '';
        this.percent = '';
      }
    },
  },
  async mounted() {
    this.SetLoader(true);
    await this.$store.dispatch('web3/checkConnectionStatus', Chains.ETHEREUM);
    if (this.isConnected) {
      await this.checkWalletExists();
      const { lockTime, defaultFee } = await this.$store.dispatch('web3/getPensionDefaultData');
      this.lockTime = lockTime;
      this.percent = defaultFee;
    }
    this.SetLoader(false);
  },
  methods: {
    async checkWalletExists() {
      const wallet = await this.$store.dispatch('web3/getPensionWallet');
      if (wallet.createdAt !== '0') {
        await this.$router.push('/pension/my');
      }
    },
    openApplyForAPensionModal() {
      this.ShowModal({
        key: modals.applyForAPension,
      });
    },
    handleClickFAQ(FAQ) {
      FAQ.isOpen = !FAQ.isOpen;
    },
    async startPensionProgram() {
      await this.$store.dispatch('web3/startPensionProgram', { fee: 5, firstDeposit: 0.001 });
    },
  },
};
</script>

<style lang="scss" scoped>
.pension-page {
  background: linear-gradient(to bottom, #103D7C 320px, #f6f8fa 320px);
  display: flex;
  justify-content: center;

  &__container {
    display: grid;
    grid-template-rows: 195px max-content;
    max-width: 1180px;
    grid-row-gap: 50px;
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
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
    grid-template-rows: 140px max-content max-content;
    width: 100%;

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
        min-height: 180px;
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
          right: 0;
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

  @include _991 {
    background: linear-gradient(to bottom, #103D7C 245px, #f6f8fa 245px);
    &__container {
      gap: 15px;
      //grid-template-rows: 150px auto;
    }
  }

  @include _767 {
    background: linear-gradient(to bottom, #103D7C 220px, #f6f8fa 220px);
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
      grid-template-rows: max-content max-content max-content;
      .info-block {
        &__square {
          grid-template-rows: repeat(2, 1fr);
          grid-template-columns: repeat(2, 1fr);
        }
        &__quarter {
          padding: 20px 0;
        }
        &__about {
          .btn-group {
            grid-template-columns: 2fr 1fr;
          }
        }
      }
    }
  }

  @include _575 {
    &__content {
      .info-block {
        &__square {
          grid-template-rows: repeat(4, 1fr);
          grid-template-columns: unset;
        }
        &__about {
          grid-template-areas:
            "hd"
            "ft"
            "sd";
          grid-template-rows: repeat(3, auto);
          grid-template-columns: unset;
          width: 100%;
          margin: 0;
          padding: 0 20px;
          .calendar-img {
            position: relative;
            width: 100%;
            max-width: 370px;
            justify-self: center;
          }
          .btn-group {
            padding: 0;
            display: block;
          }
        }
        &__documents {
          .document {
            grid-template-columns: 33px auto 23px;
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
}
</style>
