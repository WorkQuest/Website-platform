<template>
  <ctm-modal-box
    class="confirm"
    :title="$tc('modals.titles.confirmDetails')"
  >
    <div class="confirm__content content">
      <div class="content__field field">
        <div
          v-for="(item, i) in abouts"
          :key="i"
          class="field__body"
        >
          <div class="field__title">
            {{ item.title }}
          </div>
          <div class="field__subtitle">
            {{ item.subtitle }}
          </div>
        </div>
      </div>
      <div class="content__buttons buttons">
        <base-btn
          class="buttons__button"
          mode="outline"
          data-selector="CANCEL"
          @click="CloseModal"
        >
          {{ $t('meta.btns.cancel') }}
        </base-btn>
        <base-btn
          class="buttons__button"
          data-selector="SUBMIT"
          @click="openStatusModal"
        >
          {{ $t('meta.btns.submit') }}
        </base-btn>
      </div>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'ModalConfirmDetails',
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
    }),
    abouts() {
      return this.options.receiptData;
    },
  },
  methods: {
    async openStatusModal() {
      const { submit } = this.options;
      this.CloseModal();
      await submit();
    },
  },
};
</script>

<style lang="scss" scoped>

.confirm {
  max-width: 490px !important;
  height: auto;
  &__content {
    padding: 22px 28px 30px 28px!important;
  }
}
.content{
  &__field {
    background-color: $black0;
    border-radius: 5px;
    padding: 20px;
    display: grid;
    gap: 20px;
  }
  &__buttons{
    display: grid;
    grid-template-columns: repeat(2, calc(50% - 10px));
    grid-gap: 20px;
    gap: 20px;
    margin-top: 25px;
  }
}
.field{
  &__title{
    font-size: 16px;
    font-weight: 400;
    color: #353C47;
  }
  &__subtitle {
    color: $black500;
    font-weight: 500;
    font-size: 14px;
  }
}
</style>
