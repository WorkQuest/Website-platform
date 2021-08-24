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
          @click="hide"
        />
      </div>
      <div class="content__subtitle">
        {{ $t('modals.areYouSure') }}
      </div>
      <div class="content__desc">
        {{ $t('modals.areYouSureNotificationText') }}
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

export default {
  name: 'ModalAreYouSureNotification',
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
  }
}
</style>
