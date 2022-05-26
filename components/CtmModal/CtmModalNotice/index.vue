<template>
  <ctm-modal-box
    class="messageSend"
    :is-header="false"
  >
    <div class="ctm-modal__content">
      <div class="messageSend">
        <div class="messageSend__content">
          <img
            alt=""
            src="~/assets/img/ui/notice.svg"
            class="modal__icon"
          >
          <div class="modal__title">
            {{ $t('modals.titles.notice') }}
          </div>
          <div class="modal__desc">
            {{ $t('modals.noticeDesc') }}
          </div>
          <base-btn
            class="email__action"
            data-selector="AGREE"
            @click="hide()"
          >
            {{ $t('meta.iAgree') }}
          </base-btn>
        </div>
      </div>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Index',
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
    }),
  },
  methods: {
    hide() {
      this.CloseModal();
      localStorage.setItem('isChatNotificationShown', 'true');
    },
  },
};
</script>

<style lang="scss" scoped>
.ctm-modal {
  @include modalKit;
  &__box {
    background: $black0;
  }
}

.modal {
  &__icon {
    display: flex;
    justify-self: flex-start;
  }
  &__title {
    @include text-simple;
    font-weight: 600;
    font-size: 18px;
    color: $black800;
    display: flex;
    justify-self: flex-start;
  }
  &__desc {
    @include text-simple;
    font-weight: 400;
    font-size: 16px;
    color: $black500;
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
