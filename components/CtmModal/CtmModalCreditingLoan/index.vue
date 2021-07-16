<template>
  <ctm-modal-box
    class="addLiquidity"
    :title="$t('modals.loan')"
  >
    <div class="ctm-modal__content">
      <div class="ctm-modal__checkpoints">
        <label
          for="checkpoints-cont"
          class="ctm-modal__label"
        >
          {{ $t('modals.chooseTheCurrency') }}
        </label>
        <div
          id="checkpoints-cont"
          class="checkpoints-cont"
        >
          <div
            v-for="(item, i) in checkpoints"
            :key="i"
            class="checkpoint-cont"
          >
            <input
              :id="item.name"
              v-model="selCurrencyID"
              type="radio"
              class="checkpoint"
              :value="item.id"
            >
            <label
              class=""
              :for="item.name"
            >
              {{ item.name }}
            </label>
          </div>
        </div>
      </div>
      <div class="ctm-modal__content-field">
        <base-field
          :is-hide-error="true"
          class="input"
          :label="$t('modals.howMuchETHWouldYouLikeToOpen')"
          :tip="$t('modals.smallTemp')"
          :placeholder="'10 ETH'"
        />
      </div>
      <div class="ctm-modal__content-field">
        <base-field
          id="amountOfPercents_input"
          :is-hide-error="true"
          class="input"
          :label="$t('modals.howMuchPercentWouldYouLikeToSet')"
          :tip="$t('modals.smallTemp')"
          :placeholder="'10 ETH'"
        />
      </div>
      <div class="ctm-modal__content-field">
        <base-field
          :is-hide-error="true"
          :label="$t('modals.enterTermToReturnDebtBack')"
          :tip="$t('modals.smallTemp')"
          class="input"
          :placeholder="'10 ETH'"
        />
        <div class="ctm-modal__title-head" />
        <div class="ctm-modal__subtitle">
          {{ $t('modals.tipAbout') }}
        </div>
      </div>
      <div class="ctm-modal__content-btns">
        <div class="btn-group">
          <base-btn
            class="btn"
            @click="hide()"
          >
            {{ $t('meta.cancel') }}
          </base-btn>
          <base-btn
            class="btn_bl"
            @click="openConfirmDetailsModal()"
          >
            {{ $t('meta.submit') }}
          </base-btn>
        </div>
      </div>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';
import modals from '~/store/modals/modals';

export default {
  name: 'ModalCreditingLoan',
  data() {
    return {
      selCurrencyID: 1,
      checkpoints: [
        {
          name: this.$t('modals.bnb'),
          id: 1,
        },
        {
          name: this.$t('modals.eth'),
          id: 2,
        },
        {
          name: this.$t('modals.wqt'),
          id: 3,
        },
      ],
      abouts: [
        {
          title: this.$t('modals.collateralization'),
          subtitle: this.$tc('modals.percentsCount', 0),
        },
        {
          title: this.$t('modals.liquidationPrice'),
          subtitle: this.$tc('modals.percentsCount', 0),
        },
        {
          title: this.$t('modals.currentPrice'),
          subtitle: this.$tc('modals.percentsCount', 0),
        },
        {
          title: this.$t('modals.stabilityFee'),
          subtitle: this.$tc('modals.percentsCount', 0),
        },
        {
          title: this.$t('modals.liquidationRatio'),
          subtitle: this.$tc('modals.percentsCount', 0),
        },
        {
          title: this.$t('modals.liquidationPenalty'),
          subtitle: this.$tc('modals.percentsCount', 0),
        },
      ],
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
    }),
  },
  methods: {
    hide() {
      this.CloseModal();
    },
    openConfirmDetailsModal() {
      this.ShowModal({
        key: modals.confirmLoanDetails,
        needChangeModal: this.options.needChangeModal || undefined,
      });
    },
  },
};
</script>

<style lang="scss" scoped>

.ctm-modal {
  @include modalKit;

  .addLiquidity {
    max-width: 490px !important;
    max-height: 80vh;
  }
  &__content-field,
  &__checkpoints{
    margin: 15px 0 0 0;
  }

  &__checkpoints {
    .ctm-modal__label {
      margin-bottom: 10px;
    }
  }

  .checkpoints-cont {
    display: grid;
    grid-template-rows: repeat(3, 1fr);
    text-align: left;
    justify-content: flex-start;
    gap: 15px;

    .checkpoint-cont {
      display: grid;
      grid-template-columns: repeat(2, auto);
      gap: 10px;

      >label {
        margin: unset;
      }

      .checkpoint {
        font-size: 16px;
        font-weight: 400;
        border-radius: 50%;
        width: 25px;
        height: 25px;
        border: 1px solid #0083C7;
        cursor: pointer;
      }
    }
  }

  &__content-btns {
    .btn-group{
      display: grid;
      grid-template-columns: repeat(2, calc(50% - 10px));
      grid-gap: 20px;
      gap: 20px;
      margin-top: 25px;

      .btn {
        box-sizing: border-box;
        font-weight: 400;
        font-size: 16px;
        color: #0083C7;
        border: 1px solid #0083C71A;
        border-radius: 6px;
        transition: .3s;
        background-color: #fff;

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
    }
  }

  &__content {
    padding-top: 0 !important;
  }

  &__title-head {
    font-size: 16px;
    font-weight: 400;
    margin-top: 20px;
  }

  &__subtitle {
    color: #7C838D;
    font-weight: 400;
    font-size: 16px;
  }
}
</style>

<style lang="scss">
.ctm-field__header {
  color: #212529 !important;
}
</style>
