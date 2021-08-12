<template>
  <ctm-modal-box
    class="deposit"
    :title="$t('saving.openADeposit')"
  >
    <div class="deposit__content content">
      <div class="content__field">
        <label
          for="saving__input"
          class="content__label"
        >{{ $t("modals.lockedSavings") }}
        </label>
        <base-field
          id="saving__input"
          :is-hide-error="true"
          :placeholder="'3 500'"
          class="content__input"
        />
      </div>
      <div class="content__field">
        <label
          for="amount__input"
          class="content__label"
        >{{ $t("modals.durationDays") }}
        </label>
        <base-field
          id="amount__input"
          :is-hide-error="true"
          :placeholder="'180'"
          class="content__input"
        />
      </div>
      <div class="content__buttons buttons">
        <base-btn
          class="buttons__button"
          mode="outline"
          @click="hide()"
        >
          {{ $t('meta.cancel') }}
        </base-btn>
        <base-btn
          class="buttons__button"
          @click="showDepositIsOpenedModal()"
        >
          {{ $t('meta.submit') }}
        </base-btn>
      </div>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';
import modals from '~/store/modals/modals';

export default {
  name: 'ModalOpenADeposit',
  data() {
    return {};
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
    showDepositIsOpenedModal() {
      this.ShowModal({
        key: modals.status,
        img: require('~/assets/img/ui/transactionSend.svg'),
        title: this.$t('modals.depositIsOpened'),
        subtitle: this.$t('saving.depositIsOpenedText'),
        path: '/savings/1',
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
  &__label{
  margin: 25px 0 4px 0!important;
  }
  &__buttons{
    display: grid;
    grid-template-columns: repeat(2, calc(50% - 10px));
    grid-gap: 20px;
    gap: 20px;
    margin-top: 25px;
  }
}
</style>
