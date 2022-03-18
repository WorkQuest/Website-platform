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
        {{ $t('modals.areYouSure') }}
      </div>
      <div class="content__desc">
        {{ $t('modals.deletePortfolio') }}
      </div>
      <div class="content__action action">
        <base-btn
          class="action__button"
          mode="outline"
          selector="CANCEL"
          @click="hide()"
        >
          {{ $t('meta.btns.cancel') }}
        </base-btn>
        <base-btn
          class="action__button"
          selector="DELETE"
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
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
      userData: 'user/getUserData',
    }),
  },
  methods: {
    hide() {
      this.CloseModal();
    },
    async deletePortfolio(id) {
      try {
        this.SetLoader(true);
        await this.$store.dispatch('user/deletePortfolio', id);
        this.showToastDeleted();
        await this.getAllPortfolios();
        this.hide();
        this.SetLoader(false);
      } catch (e) {
        await this.getAllPortfolios();
        this.hide();
        this.showToastError(e);
        this.SetLoader(false);
      }
    },
    async getAllPortfolios() {
      try {
        await this.$store.dispatch('user/getUserPortfolios', { userId: this.userData.id });
      } catch (e) {
        this.showToastError(e);
      }
    },
    showToastDeleted() {
      return this.$store.dispatch('main/showToast', {
        title: this.$t('toasts.caseDeleted'),
        variant: 'success',
        text: this.$t('toasts.caseDeleted'),
      });
    },
    showToastError(e) {
      return this.$store.dispatch('main/showToast', {
        title: this.$t('toasts.error'),
        variant: 'warning',
        text: `${e}`,
      });
    },
  },
};
</script>

<style lang="scss" scoped>

.sure {
  max-width: 337px !important;
  &__content {
    padding: 30px!important;
  }
}
.content {
  &__title{
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
.action {
  display: grid;
  grid-gap: 20px;
  gap: 20px;
  margin-top: 30px;
  grid-auto-flow: column;
  &__button {
    max-width: 129px!important;
  }
}
</style>
