<template>
  <ctm-modal-box
    class="privacy"
    :title="$t('privacy.title')"
  >
    <div class="ctm-modal__content">
      <div class="ctm-modal__desc">
        {{ $t('privacy.desc') }}
      </div>
      <div class="privacy__forms">
        <base-checkbox
          v-model="privacy"
          name="privacy"
          :label="$t('privacy.agree')"
        >
          <template v-slot:sub>
            <a
              class="privacy__link"
              href="/docs/privacy.pdf"
              target="_blank"
            >
              {{ $t('privacy.privacyLink') }}
            </a>
          </template>
        </base-checkbox>
        <base-checkbox
          v-model="terms"
          name="terms"
          :label="$t('privacy.agree')"
        >
          <template v-slot:sub>
            <a
              class="privacy__link"
              href="/docs/terms.pdf"
              target="_blank"
            >
              {{ $t('privacy.termsLink') }}
            </a>
          </template>
        </base-checkbox>
        <base-checkbox
          v-model="aml"
          name="aml"
          :label="$t('privacy.agree')"
        >
          <template v-slot:sub>
            <a
              class="privacy__link"
              href="/docs/aml.pdf"
              target="_blank"
            >
              {{ $t('privacy.amlLink') }}
            </a>
          </template>
        </base-checkbox>
        <base-btn
          class="privacy__action"
          :disabled="!isAllChecked"
          @click="onSubmit()"
        >
          {{ $t('meta.ok') }}
        </base-btn>
      </div>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';
import { Path, UserStatuses } from '~/utils/enums';

export default {
  name: 'PrivacyModal',
  data() {
    return {
      privacy: false,
      terms: false,
      aml: false,
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
      userData: 'user/getUserData',
    }),
    isAllChecked() {
      return this.privacy && this.terms && this.aml;
    },
  },
  methods: {
    async onSubmit() {
      if (this.$cookies.get('userStatus') === UserStatuses.NeedSetRole) {
        this.$cookies.set('role', this.options.role);
        await this.$store.dispatch('user/setUserRole', { role: this.options.role });
        const response = await this.$store.dispatch('user/getUserData');
        if (response?.ok) {
          await Promise.all([
            this.$store.dispatch('user/getStatistic'),
            this.$store.dispatch('user/getNotifications'),
          ]);
          if (!this.userData?.wallet?.address) {
            this.options.callback();
            this.CloseModal();
            return;
          }
        }
      } else {
        const payload = {
          confirmCode: this.options.confirmCode,
          role: this.options.role,
        };
        const response = await this.$store.dispatch('user/confirm', payload);
        if (response?.ok) {
          await this.$store.dispatch('main/showToast', {
            title: this.$t('modals.success'),
            text: this.$t('modals.yourAccountVerified'),
          });
          if (this.$route.name === 'confirm') {
            await this.$store.dispatch('user/logout');
            await this.$router.push('/sign-in');
          } else await this.$router.push(Path.ROLE);
        }
      }
      this.CloseModal();
    },
  },
};
</script>

<style lang="scss" scoped>
.ctm-modal {
  @include modalKit;
  &__desc {
    text-align: left;
  }
}
.privacy {
  max-width: 382px !important;
  &__forms {
    padding-top: 25px;
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 15px;
  }
  &__link {
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 130%;
    text-decoration-line: underline;
    color: $blue;
  }
  &__action {
    margin-top: 20px;
  }
}
</style>
