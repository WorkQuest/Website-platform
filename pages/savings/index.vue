<template>
  <div class="saving-page">
    <div class="saving-page__container">
      <div class="saving-page__header">
        <div class="title">
          {{ $t('saving.workQuestSavings') }}<br>{{ $t('saving.lendAndEarn') }}
        </div>
        <div class="title_sub">
          {{ $t('saving.templateText') }}
        </div>
      </div>
      <div class="saving-page__content">
        <div class="info-block">
          <div class="info-block__name_bold">
            {{ $t("saving.conditions") }}
          </div>
          <div class="info-block__double">
            <div class="info-block__send-block">
              <base-field
                v-model="address"
                data-selector="ADDRESS"
                :label="$t('modals.lockedSavings')"
              />
              <base-dd
                v-model="date"
                class="grid__drop"
                type="gray"
                data-selector="DATE-DD"
                :label="$t('modals.durationDays')"
                :items="dates"
              />
              <base-btn
                class="btn_bl"
                @click="openOpenADepositModal()"
              >
                {{ $t("saving.openADeposit") }}
              </base-btn>
            </div>
            <div class="info-block__data">
              <div class="text">
                {{ $t("saving.annualizedInterestRate") }}
              </div>
              <div class="info-block__small info-block__small_top">
                <div
                  v-for="(item, i) in interestRateTop"
                  :key="i"
                  class="text-block"
                >
                  <template v-if="item.perc !== 'line'">
                    <div class="text_blue">
                      {{ item.perc }}
                    </div>
                    <div class="text_small">
                      {{ item.date }}
                    </div>
                  </template>
                  <template v-else>
                    <div class="info-block__line" />
                  </template>
                </div>
              </div>
              <div class="info-block__small info-block__small_bottom">
                <div
                  v-for="(item, i) in interestRateBottom"
                  :key="i"
                  class="text-block"
                >
                  <template v-if="item.perc !== 'line'">
                    <div class="text_blue">
                      {{ item.perc }}
                    </div>
                    <div class="text_small">
                      {{ item.date }}
                    </div>
                  </template>
                  <template v-else>
                    <div class="info-block__line" />
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="FAQs.length"
          class="info-block"
        >
          <div class="info-block__name_bold">
            {{ $t("meta.faq") }}
          </div>
          <div class="info-block__faqs">
            <button
              v-for="(item, i) in FAQs"
              :key="i"
              class="info-block__faq"
              @click="handleClickFAQ(i)"
            >
              <div class="text__faq">
                {{ item.name }}
              </div>
              <img
                class="select-img"
                :class="{'select-img_rotate' : indexFAQ.includes(i)}"
                src="~/assets/img/ui/arrow-down.svg"
                alt=""
              >
              <div
                class="text__faq_gray"
                :class="{'text__faq_opened' : indexFAQ.includes(i)}"
              >
                {{ item.about }}
              </div>
            </button>
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
              <button class="btn__doc">
                {{ $t('meta.btns.download') }}
                <img
                  class="download"
                  src="~/assets/img/ui/download.svg"
                  alt=""
                >
              </button>
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
  name: 'SavingProduct',
  data() {
    return {
      selCardID: -1,
      indexFAQ: [],
      date: 0,
      windowSize: window.innerWidth,
      address: '',
    };
  },
  computed: {
    dates() {
      return [
        this.$tc('meta.units.days', this.DeclOfNum(7), { count: 7 }),
        this.$tc('meta.units.days', this.DeclOfNum(14), { count: 14 }),
        this.$tc('meta.units.days', this.DeclOfNum(30), { count: 30 }),
        this.$tc('meta.units.days', this.DeclOfNum(90), { count: 90 }),
        this.$tc('meta.units.days', this.DeclOfNum(180), { count: 180 }),
      ];
    },
    FAQs() {
      return [
        {
          name: this.$t('saving.faq1'),
          about: this.$t('saving.ans1'),
        },
        {
          name: this.$t('saving.faq2'),
          about: this.$t('saving.ans2'),
        },
        {
          name: this.$t('saving.faq3'),
          about: this.$t('saving.ans3'),
        },
        {
          name: this.$t('saving.faq4'),
          about: this.$t('saving.ans4'),
        },
        {
          name: this.$t('saving.faq5'),
          about: this.$t('saving.ans5'),
        },
        {
          name: this.$t('saving.faq6'),
          about: this.$t('saving.ans6'),
        },
      ];
    },
    cards() {
      return [
        {
          text: this.$tc('saving.card', { rate: 4.51, duration: 7 }),
          sel: false,
        },
        {
          text: this.$t('saving.card', { rate: 4.67, duration: 14 }),
          sel: false,
        },
        {
          text: this.$t('saving.card', { rate: 4.82, duration: 30 }),
          sel: false,
        },
        {
          text: this.$t('saving.card', { rate: 5.11, duration: 90 }),
          sel: false,
        },
        {
          text: this.$t('saving.card', { rate: 5.23, duration: 180 }),
          sel: false,
        },
      ];
    },
    documents() {
      return [
        {
          name: 'Some_document.pdf',
          size: this.$tc('meta.units.mb', 1.2),
          url: '',
        },
        {
          name: 'Some_document.pdf',
          size: this.$tc('meta.units.mb', 1.2),
          url: '',
        },
        {
          name: 'Some_document.pdf',
          size: this.$tc('meta.units.mb', 1.2),
          url: '',
        },
      ];
    },
    interestRateTop() {
      if (this.windowSize < 575) {
        return [
          {
            perc: this.$tc('meta.units.percentsCount', 5.31),
            date: this.$tc('meta.units.days', this.DeclOfNum(7), { count: 7 }),
          },
          {
            perc: this.$tc('meta.units.percentsCount', 5.48),
            date: this.$tc('meta.units.days', this.DeclOfNum(14), { count: 14 }),
          },
          {
            perc: this.$tc('meta.units.percentsCount', 5.66),
            date: this.$tc('meta.units.days', this.DeclOfNum(30), { count: 30 }),
          },
        ];
      }
      return [
        {
          perc: this.$tc('meta.units.percentsCount', 5.31),
          date: this.$tc('meta.units.days', this.DeclOfNum(7), { count: 7 }),
        },
        {
          perc: 'line',
        },
        {
          perc: this.$tc('meta.units.percentsCount', 5.48),
          date: this.$tc('meta.units.days', this.DeclOfNum(14), { count: 14 }),
        },
        {
          perc: 'line',
        },
        {
          perc: this.$tc('meta.units.percentsCount', 5.66),
          date: this.$tc('meta.units.days', this.DeclOfNum(30), { count: 30 }),
        },
      ];
    },
    interestRateBottom() {
      if (this.windowSize < 575) {
        return [
          {
            perc: this.$tc('meta.units.percentsCount', 6),
            date: this.$tc('meta.units.days', 90),
          },
          {
            perc: this.$tc('meta.units.percentsCount', 6.5),
            date: this.$tc('meta.units.days', this.DeclOfNum(180), { count: 180 }),
          },
        ];
      }
      return [
        {
          perc: this.$tc('meta.units.percentsCount', 6),
          date: this.$tc('meta.units.days', this.DeclOfNum(90), { count: 90 }),
        },
        {
          perc: 'line',
        },
        {
          perc: this.$tc('meta.units.percentsCount', 6.5),
          date: this.$tc('meta.units.days', this.DeclOfNum(180), { count: 180 }),
        },
      ];
    },
  },
  beforeMount() {
    window.addEventListener('resize', () => {
      this.windowSize = window.innerWidth;
    });
  },
  async mounted() {
    this.SetLoader(true);
    this.SetLoader(false);
  },
  beforeDestroy() {
    window.removeEventListener('resize', () => false);
  },
  methods: {
    handleClickFAQ(index) {
      if (this.indexFAQ.includes(index)) {
        this.indexFAQ.splice(this.indexFAQ.indexOf(index), 1);
      } else {
        this.indexFAQ.push(index);
      }
    },
    openOpenADepositModal() {
      const receiptData = [
        {
          title: this.$t('modals.currencyDetails'),
          subtitle: this.$t('meta.coins.eth'),
        },
        {
          title: this.$t('modals.depositing'),
          subtitle: this.$tc('meta.coins.count.ETHCount', 1),
        },
        {
          title: this.$t('modals.generatingDetails'),
          subtitle: this.$tc('meta.coins.count.WUSDCount', 1000),
        },
      ];
      const dataForStatusModal = {
        img: require('~/assets/img/ui/transactionSend.svg'),
        title: this.$t('modals.depositIsOpened'),
        subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam',
        path: 'savings/1',
      };
      this.ShowModal({
        key: modals.confirmDetails,
        receiptData,
        dataForStatusModal,
      });
    },
    handleClickCard(i) {
      this.selCardID = this.selCardID === i ? -1 : i;
    },
  },
};
</script>

<style lang="scss" scoped>
.saving-page {
  background: linear-gradient(to bottom, #103D7C 374px, #f6f8fa 374px);
  display: flex;
  justify-content: center;

  &__container {
    display: grid;
    grid-template-rows: 233px max-content;
    max-width: 1180px;
    grid-row-gap: 40px;
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
        margin-top: 20px;

        &:hover {
          background-color: #103d7c;
        }
      }
    }

    .btn-group {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      padding-bottom: 20px;

      &__third {
        display: grid;
        grid-template-columns: 2fr 1fr;
        align-items: revert;
        margin: 0 20px 20px 20px;
        grid-template-areas: ". sd";
        gap: 40px;

        .btn {
          grid-area: sd;
        }
      }

      &_exp {
        @extend .btn-group;
        width: calc(100% - 20px);
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

    .info-block {
      background-color: #fff;
      border-radius: 6px;

      &__line {
        width: 1px;
        height: 51px;
        background-color: $black100;
      }

      &__send-block {
        display: grid;
        grid-gap: 10px;
      }
      &__data {
        display: grid;
        background-color: $black0;
        padding: 20px;
        border-radius: 6px;
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

      &__faqs {
        margin: 0 20px 20px 20px;
        display: grid;
        gap: 20px;
      }

      &__faq {
        border-radius: 5px;
        padding: 20px 60px 20px 20px;
        background-color: $black0;
        text-align: left;
        position: relative;
        transition: 300ms;
      }

      &__double {
        display: grid;
        grid-template-columns: 35% auto;
        grid-gap: 20px;
        padding: 20px;
      }

      &__small {
        display: grid;
        box-sizing: border-box;
        padding-left: 10px;
        justify-items: center;
        align-self: baseline;
        height: 50px;

        &_top {
          grid-template-columns: repeat(5, 1fr);
        }

        &_bottom {
          grid-template-columns: repeat(3, 1fr);
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

      &__cards {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 20px;
      }

      &__card {
        @extend .info-block;
        text-align: center;
        display: grid;
        align-content: center;
        gap: 20px;
        padding: 20px;

        &:hover {
          background-color: #D1D1CF;
        }

        &_sel {
          @extend .info-block__card;
          background-color: #0083C7;
          .info-block__circle {
            border: 1px solid #fff;
            background-color: #fff;
          }
          .info-block__subtitle {
            color: #fff;
          }
          &:hover {
            background-color: #103d7c;
          }
        }
      }

      &__circle {
        box-sizing: border-box;
        height: 30px;
        width: 30px;
        border-radius: 50%;
        border: 1px solid #000;
        justify-self: center;
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
    }
  }

  @include _1199 {
    &__content {
      .info-block {
        &__cards {
          grid-template-columns: repeat(4, 1fr);
        }
      }
    }
  }

  @include _991 {
    &__content {
      .info-block {
        &__cards {
          grid-template-columns: repeat(3, 1fr);
        }
      }
    }
  }

  @include _767 {
    background: linear-gradient(to bottom, #103D7C 250px, #f6f8fa 250px);
    &__container {
      grid-template-rows: auto auto;
      gap: 15px;
    }
    &__header {
      .title {
        font-size: 38px;
        margin-bottom: 15px;
        &_sub {
          font-size: 16px;
          max-width: 400px;
        }
      }
    }
    &__content {
      .info-block {
        &__cards {
          grid-template-columns: repeat(2, 1fr);
        }
        &__double {
          grid-template-rows: repeat(2, auto);
          grid-template-columns: unset;
        }
      }
      .btn-group__third {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  }

  @include _575 {
    &__content {
      .info-block {
        &__card {
          gap: 10px;
          padding: 10px;
          text-align: left;

          .info-block__subtitle {
            font-size: 14px;
          }
        }
        &__circle {
          width: 20px;
          height: 20px;
        }
        &__triple {
          grid-template-columns: unset;
          grid-template-rows: repeat(3, 1fr);
        }
        &__small {
          &_top {
            grid-template-columns: repeat(3, 1fr);
          }
          &_bottom {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        &__documents {
          .document {
            grid-template-columns: 33px auto 23px;
          }
        }
      }
      .btn-group__third {
        display: block;
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
