<template>
  <ctm-modal-box
    class="ctm-modal ctm-modal_center"
    :title="$t('modals.titles.editCase')"
  >
    <div class="ctm-modal__content content">
      <validation-observer
        v-slot="{ validated, passed, invalid }"
        class="content__block"
      >
        <files-uploader
          class="content__portfolio portfolio"
          :multiple="false"
          :limit="1"
          :limit-bytes="10485760"
          :limit-bytes-video="10485760"
          :accept="'image/png, image/jpg, image/jpeg'"
          :preloaded-files="options.media"
          rules="required"
          @change="updateFiles"
        />
        <base-field
          v-model="caseTitle"
          class="content__title"
          :label="$t('modals.title')"
          :placeholder="$t('modals.addTitle')"
          rules="required|text-title|max:70"
          :mode="'gray'"
          :name="$t('modals.title')"
        />
        <base-textarea
          id="textarea"
          v-model="caseDescription"
          :label="$t('modals.description')"
          class="content__textarea"
          :placeholder="$t('modals.addDesc')"
          rules="required|text-desc|max:350"
          :name="$t('modals.description')"
        />
        <div class="content__btn btn">
          <div class="btn__wrapper">
            <base-btn
              mode="outline"
              selector="CANCEL"
              class="btn__action"
              @click="hide()"
            >
              {{ $t('meta.btns.cancel') }}
            </base-btn>
          </div>
          <div class="btn__wrapper">
            <base-btn
              class="btn__action"
              selector="EDIT-USER-CASE"
              :disabled="invalid || files.length === 0"
              @click="editUserCase(options.id)"
            >
              {{ $t('meta.btns.send') }}
            </base-btn>
          </div>
        </div>
      </validation-observer>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';
import modals from '~/store/modals/modals';

export default {
  name: 'ModalEditCase',
  data() {
    return {
      caseTitle: '',
      caseDescription: '',
      files: [],
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
      userData: 'user/getUserData',
    }),
  },
  mounted() {
    this.editTitle();
  },
  methods: {
    hide() {
      this.CloseModal();
    },
    updateFiles(files) {
      this.files = files;
    },
    async editUserCase(id) {
      try {
        this.SetLoader(true);
        await this.setCaseData(id);
        await this.getAllPortfolios();
        this.SetLoader(false);
      } catch (e) {
        this.showToastError(e);
        this.SetLoader(false);
      }
    },
    async editTitle() {
      this.caseTitle = await this.options.title;
      this.caseDescription = await this.options.desc;
    },
    showToastEdited() {
      return this.$store.dispatch('main/showToast', {
        title: this.$t('toasts.caseEdited'),
        variant: 'success',
        text: this.$t('toasts.caseEdited'),
      });
    },
    showToastError(e) {
      return this.$store.dispatch('main/showToast', {
        title: this.$t('toasts.error'),
        variant: 'warning',
        text: `${e}`,
      });
    },
    async setCaseData(id) {
      const medias = await this.uploadFiles(this.files);
      if (medias.length) {
        const payload = {
          title: this.caseTitle,
          description: this.caseDescription,
          medias,
        };
        await this.$store.dispatch('user/editCaseData', { payload, id });
        await this.hide();
        this.showToastEdited();
      }
    },
    async getAllPortfolios() {
      try {
        await this.$store.dispatch('user/getUserPortfolios', { userId: this.userData.id });
      } catch (e) {
        this.showToastError(e);
      }
    },
    showRequestSendModal() {
      this.ShowModal({
        key: modals.requestSend,
      });
    },
  },
};
</script>

<style lang="scss" scoped>

.ctm-modal {
  @include modalKit;
  &__box {
    max-width: 800px !important;
  }
  &__content {
    padding: 28px 28px 0 28px !important;
  }
  &_center {
    align-items: center;
    justify-content: center;
    height: auto !important;
  }
}

.content {
  &__block {
    display: flex;
    flex-direction: column;
    grid-gap: 15px;
  }
  &__btn {
    display: flex;
    justify-content: space-between;
    padding: 0;
  }
}
.btn {
  &__wrapper {
    width: 40%;
  }
}
</style>
