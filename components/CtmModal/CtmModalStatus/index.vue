<template>
  <ctm-modal-box
    class="messageSend"
    :is-header="false"
  >
    <div class="ctm-modal__content">
      <div class="messageSend">
        <div class="messageSend__content">
          <img
            :src="options.img"
            alt="RequestSend"
          >
          <div class="ctm-modal__title">
            {{ options.title }}
          </div>
          <div class="ctm-modal__desc">
            <span v-if="!options.subtitle" />
            <span v-if="options.subtitle">{{ options.subtitle }}</span>
          </div>
          <base-btn
            class="email__action"
            @click="hide()"
          >
            {{ $t('meta.ok') }}
          </base-btn>
        </div>
      </div>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Status',
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
.ctm-modal {
  @include modalKit;
  &__title {
    text-align: center;
  }
}

.messageSend {
  max-width: 337px !important;
  &__content {
    display: grid;
    grid-template-columns: 1fr;
    justify-items: center;
    grid-gap: 20px;
  }
  &__action {
    margin-top: 10px;
  }
}
</style>
