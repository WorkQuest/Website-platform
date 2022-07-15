<template>
  <ctm-modal-box
    class="ctm-modal ctm-modal_center"
    :title="$tc('modals.titles.editCase')"
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
          :accept="'image/png, image/jpg, image/jpeg, image/heic'"
          :preloaded-files="options.media"
          rules="required"
          @change="updateFiles"
        />
        <base-field
          v-model="caseTitle"
          class="content__title"
          data-selector="CASE-TITLE"
          :label="$tc('modals.title')"
          :placeholder="$t('modals.addTitle')"
          rules="required|text-title|max:70"
          mode="gray"
          :name="$tc('modals.title')"
        />
        <base-textarea
          id="textarea"
          v-model="caseDescription"
          :label="$tc('modals.description')"
          class="content__textarea"
          data-selector="CASE-DESCRIPTION"
          :placeholder="$t('modals.addDesc')"
          rules="text-desc|max:350"
          :name="$tc('modals.description')"
        />
        <div class="content__btn btn">
          <div class="btn__wrapper">
            <base-btn
              mode="outline"
              data-selector="CANCEL"
              class="btn__action"
              @click="CloseModal"
            >
              {{ $t('meta.btns.cancel') }}
            </base-btn>
          </div>
          <div class="btn__wrapper">
            <base-btn
              class="btn__action"
              data-selector="EDIT-USER-CASE"
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
  async mounted() {
    this.caseTitle = await this.options.title;
    this.caseDescription = await this.options.desc.trim();
  },
  methods: {
    updateFiles(files) {
      this.files = files;
    },
    async editUserCase(id) {
      this.SetLoader(true);
      const medias = await this.uploadFiles(this.files);
      if (medias.length) {
        const res = await this.$store.dispatch('user/editCaseData', {
          payload: { title: this.caseTitle.trim(), description: this.caseDescription.trim() || ' ', mediaIds: medias }, id,
        });
        if (res.ok) {
          await this.$store.dispatch('user/getUserPortfolios', { userId: this.userData.id });
          await this.$store.dispatch('main/showToast', {
            title: this.$t('toasts.caseEdited'),
            variant: 'success',
            text: this.$t('toasts.caseEdited'),
          });
        }
        this.CloseModal();
      }
      this.SetLoader(false);
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
