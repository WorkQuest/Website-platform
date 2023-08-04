<template>
  <ctm-modal-box
    :title="step === 1 ? ' ' : $tc('modals.titles.securityCheckBig')"
    :title-img-alt="step === 1 ? 'Are you sure to delete?' : null"
    class="confirm"
  >
    <!-- v-slot="{invalid, handleSubmit}" -->

    <validation-observer
      v-slot="{invalid}"
      tag="div"
      class="confirm__content"
    >
      <div v-if="step === 1">
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
            data-selector="NEXT-STEP"
            @click="nextStep()"
          >
            {{ $t('meta.btns.delete') }}
          </base-btn>
        </div>
      </div>
      <div v-if="step === 2">
        <!-- handleSubmit(deleteProfile) -->
        <form @submit.prevent="success()">
          <base-field
            v-model="totp"
            :label="$tc('meta.googleConfCode')"
            class="change-role__action"
            data-selector="GOOGLE-CONF-CODE"
            :placeholder="$t('meta.googleConfCode')"
            rules="min:6|numeric|max:6|required"
            :name="$tc('meta.googleConfCode')"
          />
          <div class="change-role__sub">
            {{ $t('meta.googleConfCodeDesc') }}
          </div>
          <div class="btn__container">
            <base-btn
              class="message__action"
              data-selector="DELETE-PROFILE"
              :disabled="invalid"
            >
              {{ $t('meta.btns.send') }}
            </base-btn>
          </div>
        </form>
      </div>
    </validation-observer>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';
import { Path } from '~/utils/enums';

export default {
  name: 'ModalAreYouSureDelete',
  data() {
    return {
      step: 1,
      totp: '',
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
      userData: 'user/getUserData',
    }),
  },
  methods: {
    nextStep() {
      this.step += 1;
    },
    async deleteProfile() {
      // const result = await this.$store.dispatch('user/deleteProfile', { totp: this.totp });
      // if (result.ok) {
      //   this.success();
      // } else {
      // }
    },
    async success() {
      this.CloseModal();
      await this.$store.dispatch('user/logout', false);
      await this.$router.push(Path.SIGN_IN);
    },
  },
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
