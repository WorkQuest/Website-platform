<template>
  <ctm-modal-box
    class="withdraw"
    :title="$t('saving.withdraw')"
  >
    <div class="withdraw__content content">
      <div class="content__desc">
        {{ $t('saving.withdrawText') }}
      </div>
      <div class="content__buttons buttons">
        <base-btn
          class="buttons__button"
          mode="outline"
          @click="hide"
        >
          {{ $t('meta.cancel') }}
        </base-btn>
        <base-btn
          class="buttons__button"
          @click="hide"
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
  name: 'ModalWithdrawAbout',
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
  },
};
</script>

<style lang="scss" scoped>
.withdraw {
  max-width: 390px !important;
  &__content {
  padding: 0px 28px 30px 28px;
  }
}
.content{
  &__desc {
    font-size: 16px;
    font-weight: 400;
    line-height: 21px;
    color: #4C5767;
    margin-top: 22px;
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
