<template>
  <ctm-modal-box
    class="status"
    :is-header="false"
  >
    <div class="status__content">
      <img
        :src="options.img"
        alt="RequestSend"
      >
      <div class="status__title">
        {{ options.title }}
      </div>
      <div class="status__desc">
        <span v-if="options.subtitle">
          {{ options.subtitle }}
        </span>
      </div>
      <base-btn
        class="status__action"
        @click="hide()"
      >
        <span v-if="options.button">{{ options.button }}</span>
        <span v-else>{{ $t('meta.ok') }}</span>
      </base-btn>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'ModalStatus',
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
      if (this.options.path) this.$router.push(this.options.path);
      this.CloseModal();
    },
  },
};
</script>

<style lang="scss" scoped>

.status {
  max-width: 337px !important;
  height: auto !important;
  padding: 0!important;
  &__content {
    display: grid;
    grid-template-columns: 1fr;
    justify-items: center;
    grid-gap: 20px;
    padding: 30px!important;
  }
  &__title {
    text-align: center;
    margin-top: 10px;
    font-weight: 500;
    font-size: 23px;
    line-height: 130%;
  }
  &__action {
    margin-top: 10px;
  }
  &__desc{
    font-size: 16px;
    line-height: 130%;
    text-align: center;
  }
}
</style>
