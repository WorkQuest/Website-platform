<template>
  <ctm-modal-box
    class="sure"
    :is-header="false"
  >
    <div class="sure__content content">
      <img
        src="~assets/img/ui/sureDelete.svg"
        alt="Are you sure to delete?"
        class="content__picture"
      >
      <div class="content__title">
        {{ $t('modals.areYouSure') }}
      </div>
      <div class="content__desc">
        {{ $t('modals.sureDeleteText') }}
      </div>
      <div class="content__action action">
        <base-btn
          selector="CANCEL"
          class="action__button"
          mode="outline"
          @click="hide()"
        >
          {{ $t('meta.cancel') }}
        </base-btn>
        <base-btn
          selector="DELETE"
          class="action__button"
          @click="showErrorModal"
        >
          {{ $t('meta.delete') }}
        </base-btn>
      </div>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';
import modals from '~/store/modals/modals';

export default {
  name: 'ModalAreYouSureDelete',
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
    showErrorModal() {
      this.ShowModal({
        key: modals.status,
        img: require('~/assets/img/ui/deleteError.svg'),
        title: this.$t('modals.errors.error'),
        subtitle: this.$t('modals.errors.youCan’tDeleteActiveQuest'),
        button: this.$t('modals.close'),
      });
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
.content {
  &__title {
    font-weight: 500;
    font-size: 23px;
    line-height: 130%;
    margin: 30px 0 20px 0;
    text-align: center;
  }
  &__desc {
    color: #4C5767;
    font-size: 16px;
    line-height: 130%;
    text-align: center;
  }
  &__picture {
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
