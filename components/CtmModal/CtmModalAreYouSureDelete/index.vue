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
          data-selector="CANCEL"
          class="action__button"
          mode="outline"
          @click="CloseModal"
        >
          {{ $t('meta.btns.cancel') }}
        </base-btn>
        <base-btn
          data-selector="DELETE"
          class="action__button"
          @click="showErrorModal"
        >
          {{ $t('meta.btns.delete') }}
        </base-btn>
      </div>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';
import modals from '~/store/modals/modals';
import { images } from '~/utils/images';

export default {
  name: 'ModalAreYouSureDelete',
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
    }),
  },
  methods: {
    showErrorModal() {
      this.ShowModal({
        key: modals.status,
        img: images.ERROR,
        title: this.$t('modals.errors.error'),
        subtitle: this.$t('modals.errors.youCan’tDeleteActiveQuest'),
        button: this.$t('meta.btns.close'),
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
