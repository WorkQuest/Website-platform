<template>
  <ctm-modal-box
    class="change"
    :is-header="false"
  >
    <div class="change__content">
      <img
        src="~assets/img/ui/password_changed.svg"
        alt="Password changed"
        class="change__image"
      >
      <div class="change__title">
        {{ $t('restore.modal') }}
      </div>
      <base-btn
        class="change__action"
        @click="hide"
      >
        {{ $t('meta.ok') }}
      </base-btn>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'ModalChangePassword',
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
    }),
  },
  methods: {
    hide() {
      this.CloseModal();
      this.$router.push('/sign-in');
    },
  },
};
</script>

<style lang="scss" scoped>

.change {
  max-width: 307px !important;
  &__content {
    display: grid;
    grid-template-columns: 1fr;
    justify-items: center;
    grid-gap: 30px;
    padding: 30px!important;
  }
  &__title{
    font-size: 23px;
    line-height: 130%;
    font-weight: 500;
  }
}
</style>
