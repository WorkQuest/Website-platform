<template>
  <ctm-modal-box
    class="notice"
    :is-header="false"
  >
    <div class="notice__content content">
      <span class="icon-warning content__icon" />
      <div class="content__title">
        {{ $t('modals.titles.noticeTitle') }}
      </div>
      <div class="content__desc">
        {{ $t('modals.noticeText') }}
      </div>
      <base-btn
        class="content__action"
        data-selector="AGREE"
        @click="CloseModal"
      >
        {{ $t('meta.iAgree') }}
      </base-btn>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'ModelNoticeChat',
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
    }),
  },
};
</script>

<style lang="scss" scoped>
.notice {
  max-width: 260px !important;
  &__content {
    justify-items: center;
    padding: 23px 20px 20px 20px;
    background: #DCDCDC;
    border-radius: 4px;
  }
  &__action {
    margin-top: 10px;
  }
}
.content{
  &__title {
    @include text-simple;
    font-weight: 600;
    font-size: 18px;
    color: $black800;
    display: flex;
    justify-self: flex-start;
    margin-top: 5px;
  }
  &__icon:before {
    font-size: 25px;
    color: $blue;
  }
  &__desc {
    @include text-simple;
    font-weight: 400;
    font-size: 16px;
    color: $black500;
    margin: 10px 0;
  }
}
</style>
