<template>
  <ctm-modal-box
    class="change-role"
    :class="[{'change-role_wide': step === 1}]"
    :is-unclosable="true"
    :title="step === 1 ? $t('modals.reason') : $t('modals.securityCheck')"
  >
    <div class="ctm-modal__content">
      <div class="change-role">
        <div
          v-if="step === 1"
          class="change-role__content"
        >
          <span class="change-role__describe">{{ $t('modals.pleaseDescribe') }}</span>
          <base-field
            v-model="reasonInput"
            class="change-role__action"
            :placeholder="$t('modals.reason')"
          />
          <div class="btn__container">
            <div class="btn__wrapper">
              <base-btn
                class="message__action"
                @click="nextStep()"
              >
                {{ $t('meta.change') }}
              </base-btn>
            </div>
            <div class="btn__wrapper">
              <base-btn
                mode="outline"
                class="message__action"
                @click="hide()"
              >
                {{ $t('meta.cancel') }}
              </base-btn>
            </div>
          </div>
        </div>
        <div
          v-if="step === 2"
          class="change-role__content"
        >
          <base-field
            v-model="codeInput"
            :label="$t('modals.googleConfCode')"
            class="change-role__action"
            :placeholder="$t('modals.googleConfCode')"
          />
          <div class="change-role__sub">
            {{ $t('modals.enterCode') }}
          </div>
          <div class="btn__container">
            <base-btn
              class="message__action"
              @click="success()"
            >
              {{ $t('meta.send') }}
            </base-btn>
          </div>
        </div>
      </div>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';
import modals from '~/store/modals/modals';

export default {
  name: 'CtmModalChangeRoleReason',
  data() {
    return {
      step: 1,
      reasonInput: '',
      codeInput: '',
    };
  },
  computed: {
    ...mapGetters({
      userRole: 'user/getUserRole',
    }),
  },
  methods: {
    nextStep() {
      this.step += 1;
    },
    hide() {
      this.CloseModal();
    },
    async changeRole() {
      // TODO: Сделать смену роли
      const response = await this.$store.dispatch('user/setUserRole');
      if (response?.ok) this.success();
    },
    success() {
      this.ShowModal({
        key: modals.status, img: require('~/assets/img/ui/success.svg'), title: 'Success', subtitle: 'Your role has been changed',
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.ctm-modal {
  @include modalKit;
}
.change-role {
  max-width: 400px !important;
  &_wide {
    max-width: 413px !important;
  }
  &__describe {
    @include text-simple;
    font-weight: 400;
    font-size: 16px;
    color: $black600;
  }
  &__title {
    @include text-simple;
    font-weight: 400;
    font-size: 16px;
    margin-bottom: 13px;
    color: $black800;
  }
  &__sub {
    @include text-simple;
    font-weight: 400;
    font-size: 14px;
    color: $black400;
  }
  &__content {
    display: grid;
    justify-items: center;
    grid-gap: 20px;
  }

  &__action {
    width: 100%;
  }
}

.btn {
  &__container {
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
    margin: 0;
    width: 100%;
  }

  &__wrapper {
    width: 45%;
  }
}
</style>
