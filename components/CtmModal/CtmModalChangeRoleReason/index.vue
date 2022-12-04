<template>
  <ctm-modal-box
    class="change-role"
    :class="[{'change-role_wide': step === 1}]"
    :is-unclosable="true"
    :title="step === 1 ? $tc('modals.titles.reason') : $tc('modals.titles.securityCheckBig')"
  >
    <validation-observer
      v-slot="{invalid, handleSubmit}"
      tag="div"
      class="ctm-modal__content"
    >
      <div class="change-role">
        <div
          v-if="step === 1"
          class="change-role__content"
        >
          <span class="change-role__describe">{{ $t('modals.pleaseDescribe') }}</span>
          <base-field
            v-model="reason"
            data-selector="REASON"
            class="change-role__action"
            :placeholder="$t('modals.reason')"
          />
          <div class="btn__container">
            <div class="btn__wrapper">
              <base-btn
                class="message__action"
                data-selector="NEXT-STEP"
                @click="nextStep()"
              >
                {{ $t('meta.btns.change') }}
              </base-btn>
            </div>
            <div class="btn__wrapper">
              <base-btn
                mode="outline"
                class="message__action"
                data-selector="CANCEL"
                @click="CloseModal"
              >
                {{ $t('meta.btns.cancel') }}
              </base-btn>
            </div>
          </div>
        </div>
        <div
          v-if="step === 2"
          class="change-role__content"
        >
          <form @submit.prevent="handleSubmit(changeRole)">
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
                data-selector="CHANGE-ROLE"
                :disabled="invalid"
              >
                {{ $t('meta.btns.send') }}
              </base-btn>
            </div>
          </form>
        </div>
      </div>
    </validation-observer>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';
import modals from '~/store/modals/modals';
import { images } from '~/utils/images';

export default {
  name: 'CtmModalChangeRoleReason',
  data() {
    return {
      step: 2,
      reason: '',
      totp: '',
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
    async changeRole() {
      const result = await this.$store.dispatch('user/changeRole', { totp: this.totp });
      if (result.ok) {
        this.CloseModal();
        this.success();
      } else {
        const date = new Date(result.data.endDateOfTimeout);
        if (result.code === 403000) {
          this.ShowModal({
            key: modals.status,
            img: require('~/assets/img/ui/error.svg'),
            title: this.$t('modals.titles.warning'),
            subtitle: this.$t('modals.waitRoleCooldown', { date: date.toLocaleDateString(this.$i18n.locale), time: date.toLocaleTimeString(this.$i18n.locale) }),
            button: this.$t('meta.btns.close'),
          });
        }
      }
    },
    success() {
      this.$root.$emit('roleChanged');
      this.ShowModal({
        key: modals.status, img: images.SUCCESS, title: 'Success', subtitle: 'Your role has been changed', isRoleChanged: true,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
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
