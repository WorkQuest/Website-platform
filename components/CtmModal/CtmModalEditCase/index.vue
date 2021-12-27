<template>
  <ctm-modal-box
    class="message"
    :title="$t('modals.editCase')"
  >
    <div class="ctm-modal__content">
      <div class="message">
        <div class="message__content">
          <div class="modal__desc">
            <validation-observer v-slot="{ validated, passed, invalid }">
              <div class="message__title">
                <base-field
                  v-model="caseTitle"
                  :label="$t('modals.title')"
                  :placeholder="$t('modals.addTitle')"
                  rules="required|text-title|max:70"
                  :mode="'gray'"
                  :name="$t('modals.title')"
                />
              </div>
              <div class="message__wrapper">
                <base-textarea
                  id="textarea"
                  v-model="caseDescription"
                  :label="$t('modals.description')"
                  class="message__textarea"
                  :placeholder="$t('modals.addDesc')"
                  rules="required|text-desc|max:350"
                  :name="$t('modals.description')"
                />
              </div>
              <div class="message__portfolio portfolio">
                <div class="portfolio__title">
                  {{ $t('uploader.uploadFile') }}
                </div>
                <files-uploader
                  :multiple="false"
                  :limit="1"
                  :limit-bytes="10485760"
                  :limit-bytes-video="10485760"
                  :accept="'image/png, image/jpg, image/jpeg'"
                  :preloaded-files="options.media"
                  rules="required"
                  @change="updateFiles"
                />
              </div>
              <div class="btn__container">
                <div class="btn__wrapper">
                  <base-btn
                    class="message__action"
                    :disabled="invalid || files.length === 0"
                    @click="editUserCase(options.id)"
                  >
                    {{ $t('meta.send') }}
                  </base-btn>
                </div>
                <div class="btn__wrapper">
                  <base-btn
                    :mode="'outline'"
                    class="message__action"
                    @click="hide()"
                  >
                    {{ $t('meta.cancel') }}
                  </base-btn>
                </div>
              </div>
            </validation-observer>
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
  name: 'ModalAddCase',
  data() {
    return {
      valid: '',
      caseTitle: '',
      caseDescription: '',
      portfolio: {
        data: {},
        file: {},
      },
      files: [],
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
      portfolios: 'user/getUserPortfolios',
      userData: 'user/getUserData',
      medias: 'user/getUserPortfolio',
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
  &__title {
    margin: 0 0 0 9% !important;
  }
}

.file {
  &__wrapper {
    margin: 0 0 25px 0;
  }
}
.uploader-message {
  &__container {
    margin: 0 0 0 10% !important;
  }
}
.icon {
  &-close_big_white:before {
    content: "\e948";
    color: #FFFFFF;
  }
  &-add_to_queue_blue:before {
    content: "\e995";
    color: #0083C7;
    font-size: 20px;
  }
}

.input {
  &_grey {
    border-radius: 6px;
    padding: 11px 20px 11px 15px;
    height: 46px;
    width: 100%;
    border: 0;
    background-color: $black0;
    resize: none;
    &::placeholder {
      color: $black200;
    }
  }
}

.modal {
  &__title {
    @include text-simple;
    justify-self: left;
    font-weight: 500;
    font-size: 23px;
  }
  &__desc {
    @include text-simple;
    width: 100%;
    display: grid;
    grid-gap: 10px;
  }
  &__labelMessage {
    @include text-simple;
    font-size: 16px;
    color: $black800;
  }
}
.message {
  &__content {
    display: grid;
    grid-template-columns: 1fr;
    justify-items: center;
    grid-gap: 20px;
  }
  &__action {
    margin-top: 10px;
  }
}
.portfolio {
  &__title {
    margin-bottom: 15px;
  }
}
.btn {
  &__container {
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
    margin: 15px 0 0 0;
  }
  &__wrapper {
    width: 45%;
  }
}
</style>
