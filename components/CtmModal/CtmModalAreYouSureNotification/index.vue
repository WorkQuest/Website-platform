<template>
  <ctm-modal-box
    class="sure"
    :is-header="false"
  >
    <div class="sure__content content">
      <div class="content__header header">
        <div class="header__warning icon-warning_outline" />
        <div
          class="header__close icon-close_big"
          @click="CloseModal"
        />
      </div>
      <div class="content__subtitle">
        {{ options.title || $t('modals.areYouSure') }}
      </div>
      <div class="content__desc">
        {{ options.text }}
      </div>
      <div class="content__buttons buttons">
        <base-btn
          class="buttons__button"
          :class="{'buttons__button_solo' : options.isFiles}"
          mode="outline"
          data-selector="CANCEL"
          @click="CloseModal"
        >
          {{ $t('meta.btns.cancel') }}
        </base-btn>
        <base-btn
          v-if="!options.isFiles"
          class="buttons__button"
          data-selector="SUBMIT"
          @click="submit"
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
  name: 'ModalAreYouSureNotification',
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
    }),
  },
  methods: {
    async submit() {
      const { callback } = this.options;
      this.CloseModal();
      if (callback) await callback();
    },
  },
};
</script>

<style lang="scss" scoped>

.sure{
  max-width: 350px !important;
  &__content {
    padding: 30px;
  }
}
.content{
  &__header{
    display: flex;
    justify-content: space-between;
  }
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
    font-size: 16px;
    line-height: 130%;
    color: $black600;
  }
  &__subtitle{
    font-weight: 500;
    font-size: 23px;
    line-height: 130%;
    margin: 31px 0 25px 0;
  }
  &__buttons{
    display: flex;
    justify-content: space-between;
    margin-top: 25px;
  }
}
.header{
  display: flex;
  justify-content: space-between;
  &__warning:before{
    font-size: 25px;
    color: $blue;
  }
  &__close:before{
    font-size: 25px;
    cursor: pointer;
  }
}
.buttons{
  &__button{
    max-width: 140px;
    &_solo {
      max-width: unset;
    }
  }
}
</style>
