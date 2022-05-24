<template>
  <ctm-modal-box
    class="sure"
    :is-header="false"
  >
    <div class="sure__content content">
      <img
        src="~assets/img/ui/message.svg"
        alt="Are you sure to delete?"
        class="content__picture"
      >
      <div class="content__title">
        {{ options.title || $t('modals.areYouSure') }}
      </div>
      <div class="content__desc">
        {{ options.text }}
      </div>
      <div class="content__action action">
        <base-btn
          class="action__button"
          mode="outline"
          data-selector="CANCEL"
          @click="handleCancel"
        >
          {{ $t('meta.btns.cancel') }}
        </base-btn>
        <base-btn
          class="action__button"
          data-selector="APPLY"
          @click="handleApply"
        >
          {{ options.okBtnTitle }}
        </base-btn>
      </div>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'ModalAreYouSure',
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
      chatId: 'chat/getCurrChatId',
    }),
  },
  methods: {
    async handleApply() {
      const { okBtnFunc, isNotClose } = this.options;
      if (okBtnFunc) await okBtnFunc();
      if (!isNotClose) this.CloseModal();
    },
    async handleCancel() {
      const { cancelBtnFunc } = this.options;
      if (cancelBtnFunc) await cancelBtnFunc();
      this.CloseModal();
    },
  },
};
</script>

<style lang="scss" scoped>

.sure{
  max-width: 337px !important;
  &__content {
    padding: 30px!important;
  }
}
.content{
  &__title{
    font-weight: 500;
    font-size: 23px;
    line-height: 130%;
    margin: 30px 0 20px 0;
    text-align: center;
  }
  &__desc{
    color: #4C5767;
    font-size: 16px;
    line-height: 130%;
    text-align: center;
  }
  &__picture{
    margin-left: auto;
    margin-right: auto;
  }

}
.action{
  display: grid;
  grid-gap: 20px;
  gap: 20px;
  margin-top: 30px;
  grid-auto-flow: column;
  &__button{
    max-width: 129px!important;
  }
}
</style>
