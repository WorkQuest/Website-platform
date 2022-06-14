<template>
  <ctm-modal-box
    class="privacy"
    :title="$tc('modals.titles.privacyPolicy')"
  >
    <div class="ctm-modal__content">
      <div class="ctm-modal__desc">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luctus venenatis, lectus magna fringilla urna, porttitor
      </div>
      <div class="privacy__forms">
        <base-checkbox
          v-model="privacy"
          name="privacy"
          :label="$tc('privacy.agree')"
        >
          <template v-slot:sub>
            <a
              class="privacy__link"
              href="/docs/privacy.pdf"
              target="_blank"
            >
              {{ $t('modals.titles.privacyPolicy') }}
            </a>
          </template>
        </base-checkbox>
        <base-checkbox
          v-model="terms"
          name="terms"
          :label="$tc('privacy.agree')"
        >
          <template v-slot:sub>
            <a
              class="privacy__link"
              href="/docs/terms.pdf"
              target="_blank"
            >
              {{ $t('meta.terms') }}
            </a>
          </template>
        </base-checkbox>
        <base-checkbox
          v-model="aml"
          name="aml"
          :label="$tc('privacy.agree')"
        >
          <template v-slot:sub>
            <a
              class="privacy__link"
              href="/docs/aml.pdf"
              target="_blank"
            >
              {{ $t('meta.aml') }}
            </a>
          </template>
        </base-checkbox>
        <base-btn
          class="privacy__action"
          :disabled="!isAllChecked"
          data-selector="OK"
          @click="onSubmit()"
        >
          {{ $t('meta.btns.ok') }}
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
      // Role page
      let response;
      if (this.options.isSocialNetwork) {
        response = await this.$store.dispatch('user/setUserRole', {
          role: this.options.role,
        });
      } else {
        response = await this.$store.dispatch('user/confirm', {
          confirmCode: sessionStorage.getItem('confirmToken'),
          role: this.options.role,
        });
      }

      if (response?.ok) {
        this.$cookies.set('userLogin', true, { path: Path.ROOT });
        this.$cookies.set('userStatus', UserStatuses.Confirmed, { path: Path.ROOT });
        sessionStorage.removeItem('confirmToken');
        this.ShowToast(this.$t('modals.yourAccountVerified'), this.$t('meta.success'));
        await this.options.callback();
      } else {
        // Wrong confirm token or errors with social network login
        await this.$store.dispatch('user/logout');
        await this.$router.push(Path.SIGN_IN);
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
