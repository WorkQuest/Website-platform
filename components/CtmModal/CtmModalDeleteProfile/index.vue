<template>
  <ctm-modal-box
    :title="$tc('modals.titles.changePass')"
    class="confirm"
  >
    <div class="confirm__content content">
      <img
        src="~assets/img/ui/coolicon.svg"
        alt="Are you sure to delete?"
        class="content__picture"
      >
      <div class="content__title">
        {{ $t('modals.areYouSure') }}
      </div>
      <div class="content__desc">
        {{ $t('modals.confirmDeleteProfile') }}
      </div>
      <div class="content__action action">
        <base-btn
          class="action__button"
          mode="outline"
          data-selector="CANCEL"
          @click="CloseModal"
        >
          {{ $t('meta.btns.cancel') }}
        </base-btn>
        <base-btn
          class="action__button"
          data-selector="DELETE"
          @click="deletePortfolio(options.id)"
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

export default {
  name: 'ModalAreYouSureDelete',
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
      userData: 'user/getUserData',
    }),
  },
  // methods: {
  //   async deletePortfolio(id) {
  //     try {
  //       this.SetLoader(true);
  //       await this.$store.dispatch('user/deletePortfolio', id);
  //       await this.$store.dispatch('main/showToast', {
  //         title: this.$t('toasts.caseDeleted'),
  //         variant: 'success',
  //         text: this.$t('toasts.caseDeleted'),
  //       });
  //       await this.getAllPortfolios();
  //       this.CloseModal();
  //       this.SetLoader(false);
  //     } catch (e) {
  //       await this.getAllPortfolios();
  //       this.CloseModal();
  //       await this.$store.dispatch('main/showToast', {
  //         title: this.$t('toasts.error'),
  //         variant: 'warning',
  //         text: `${e}`,
  //       });
  //       this.SetLoader(false);
  //     }
  //   },
  //   async getAllPortfolios() {
  //     try {
  //       await this.$store.dispatch('user/getUserPortfolios', { userId: this.userData.id });
  //     } catch (e) {
  //       await this.$store.dispatch('main/showToast', {
  //         title: this.$t('toasts.error'),
  //         variant: 'warning',
  //         text: `${e}`,
  //       });
  //     }
  //   },
  // },
};
</script>

<style lang="scss" scoped>

.confirm {
  max-width: 356px !important;
  &__content{
    padding: 25px 30px 30px!important;
  }
}
.content {
  &__title{
    margin-bottom: 25px;
    font-family: 'Inter', sans-serif;
    font-weight: 500;
    font-size: 23px;
    color:rgba(29, 33, 39, 1);
    line-height: 130%;
  }
  &__desc {
    margin-bottom: 25px;
    color: #4C5767;
    font-family: 'Inter', sans-serif;
    font-size: 16px;
    line-height: 130%;
  }
}
.action {
  display: grid;
  grid-gap: 10px;
  gap: 10px;
  grid-auto-flow: column;
  &__button {
    max-width: 143px!important;
  }
}
</style>
