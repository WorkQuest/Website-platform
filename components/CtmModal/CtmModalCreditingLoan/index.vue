<template>
  <ctm-modal-box
    class="loan"
    :title="$t('modals.titles.loan')"
  >
    <div class="loan__content content">
      <validation-observer
        v-slot="{handleSubmit, validated, passed, invalid}"
      >
        <div class="content__body">
          <div class="content__field">
            <div class="content__label">
              {{ $t('modals.howMuchETHWouldYouLikeToOpen') }}
            </div>
            <div class="content__text content__text_small">
              {{ $t('modals.smallDescriptionForLoan') }}
            </div>
            <base-field
              v-model="quantity"
              class="content__input"
              :placeholder="'10 ETH'"
              rules="required|decimal"
              data-selector="VALUE-FOR-LOAN"
              :name="$t('modals.quantityField')"
            />
            <div class="content__text">
              {{ $t('modals.tipAbout') }}
            </div>
          </div>
        </div>
        <div class="content__buttons buttons">
          <base-btn
            class="buttons__button"
            mode="outline"
            selector="CANCEL"
            @click="hide"
          >
            {{ $t('meta.btns.cancel') }}
          </base-btn>
          <base-btn
            class="buttons__button"
            :disabled="!validated || !passed || invalid"
            selector="SUBMIT"
            @click="handleSubmit(openConfirmDetailsModal)"
          >
            {{ $t('meta.btns.submit') }}
          </base-btn>
        </div>
      </validation-observer>
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
      quantity: '',
      debt: '',
      percents: '',
      checkpoints: [
        {
          name: this.$t('meta.coins.bnb'),
          id: 1,
        },
        {
          name: this.$t('meta.coins.eth'),
          id: 2,
        },
        {
          name: this.$t('meta.coins.wqt'),
          id: 3,
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

.loan {
  max-width: 490px !important;
  height: auto !important;
  padding: 0!important;
  &__content{
    padding: 25px 28px 30px 28px;
  }
}
  .buttons{
    display: grid;
    grid-template-columns: repeat(2, calc(50% - 10px));
    grid-gap: 20px;
    gap: 20px;
    margin-top: 40px;
  }
.content{
  &__field{
    margin-top: 3px;
  }
  &__label {
    margin-bottom: 5px;
  }
  &__text {
    color: #7C838D;
    font-weight: 400;
    font-size: 14px;
    margin-top: 3px;
    &_small {
      margin-bottom:10px;
    }
  }
  &__checkpoints {
    margin-bottom: 25px;
    &_label {
      margin-bottom: 10px;
    }
  }
}
.checkpoints{
  &__label {
    margin-bottom: 15px;
    font-weight: 500;
    font-size: 16px;
    line-height: 130%;
  }
  &__main{
    display: grid;
    grid-template-rows: repeat(3, 1fr);
    text-align: left;
    justify-content: flex-start;
    gap: 13px;
  }
  &__array {
    display: grid;
    grid-template-columns: repeat(2, auto);
    gap: 10px;
    > label {
      margin: unset;
    }
  }
  &__item{
   font-size: 16px;
   font-weight: 400;
   border-radius: 50%;
   width: 25px;
   height: 25px;
   border: 1px solid #0083C7;
   cursor: pointer;
 }
}
</style>
