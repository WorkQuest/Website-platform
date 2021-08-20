<template>
  <ctm-modal-box
    class="deposit"
    :title="$t('modals.depositTitle')"
  >
    <div class="deposit__content content">
      <validation-observer
        v-slot="{handleSubmit, validated, passed, invalid}"
      >
        <div class="content__field">
          <div class="content__text">
            {{ $t('modals.depositAmount') }}
          </div>
          <base-field
            v-model="amountInput"
            :placeholder="'3 500'"
            class="content__input"
            rules="required|numeric"
            :name="$t('modals.depositAmountField')"
          />
        </div>
        <div class="content__buttons">
          <base-btn
            class="buttons__button"
            mode="outline"
            @click="hide"
          >
            {{ $t('meta.cancel') }}
          </base-btn>
          <base-btn
            class="buttons__button"
            :disabled="!validated || !passed || invalid"
            @click="handleSubmit(showPensionIsRegisteredModal)"
          >
            {{ $t('meta.submit') }}
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
  name: 'ModalMakeDeposit',
  data() {
    return {
      amountInput: '',
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
    showPensionIsRegisteredModal() {
      this.ShowModal({
        key: modals.status,
        img: require('~/assets/img/ui/transactionSend.svg'),
        title: this.$t('modals.depositIsDone'),
        subtitle: this.$t('modals.pensionIsRegisteredText'),
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.deposit {
  max-width: 495px !important;
  &__content {
    padding: 0 28px 30px 28px!important;
  }
}
.content{
  &__field {
    margin: 15px 0 0 0;
  }
  &__buttons{
    display: grid;
    grid-template-columns: repeat(2, calc(50% - 10px));
    grid-gap: 20px;
    gap: 20px;
    margin-top: 2px;
  }
  &__text{
    margin: 22px 0 4px 0;
    font-size: 16px;
    line-height: 130%;
  }
}

</style>
