<template>
  <ctm-modal-box
    class="sure"
    :is-header="false"
  >
    <div class="sure__content content">
      <img
        src="~assets/img/ui/sureDelete.svg"
        alt="AreYouSure"
      >
      <div class="content__title">
        {{ $t('modals.areYouSure') }}
      </div>
      <div class="content__desc">
        {{ $t('modals.areYouSureText') }}
      </div>
      <base-btn
        class="content__action"
        @click="hide()"
      >
        {{ $t('meta.ok') }}
      </base-btn>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'ModalAreYouSure',
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

.sure{
  max-width: 337px !important;
  &__content {
    padding: 30px;
    display: grid;
    grid-template-columns: 1fr;
    justify-items: center;
    grid-gap: 20px;
  }
}
.content{
  &__action {
    margin-top: 10px;
  }
  &__title{
    margin-top: 10px;
    font-weight: 500;
    font-size: 23px;
    line-height: 130%;
  }
  &__desc{
    color: #4C5767;
    text-align: center;
    font-size: 16px;
    line-height: 130%;
  }
}
</style>
