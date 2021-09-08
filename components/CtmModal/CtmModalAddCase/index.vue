<template>
  <ctm-modal-box
    class="message"
    :title="$t('modals.addCase')"
  >
    <div class="ctm-modal__content">
      <div class="message">
        <div class="message__content">
          <div class="modal__desc">
            <ValidationProvider
              v-slot="{ validate }"
              rules="required|ext:png,jpeg,jpg,gif"
              tag="div"
            >
              <input
                id="coverUpload"
                class="edit__avatar"
                type="file"
                accept="image/*"
                @change="processFile($event, validate)"
              >
            </ValidationProvider>
            <div>
              <base-field
                v-model="caseTitle"
                :label="$t('modals.title')"
                :placeholder="$t('modals.addTitle')"
                :mode="'gray'"
              />
            </div>
            <div class="message__wrapper">
              <p class="modal__labelMessage">
                {{ $t('modals.description') }}
              </p>
              <div>
                <textarea
                  id="textarea"
                  v-model="caseDescription"
                  class="message__textarea"
                  :placeholder="$t('modals.addDesc')"
                />
              </div>
            </div>
            <div class="btn__container">
              <div class="btn__wrapper">
                <base-btn
                  class="message__action"
                  :disabled="!valid"
                  @click="addUserCase"
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
  components: {},
  data() {
    return {
      valid: '',
      caseTitle: '',
      caseDescription: '',

      portfolio: {
        data: {},
        file: {},
      },
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
      userData: 'user/getUserData',
      medias: 'user/getUserPortfolio',
    }),
  },
  methods: {
    hide() {
      this.CloseModal();
    },
    async addUserCase() {
      try {
        this.SetLoader(true);
        await this.setCaseImage();
        await this.setCaseData();
        await this.getPortfolios();
        this.showToastAdded();
        this.hide();
        this.SetLoader(false);
      } catch (e) {
        await this.getPortfolios();
        this.hide();
        this.showToastError(e);
        this.SetLoader(false);
      }
    },
    showToastAdded() {
      return this.$store.dispatch('main/showToast', {
        title: this.$t('toasts.caseAdded'),
        variant: 'success',
        text: this.$t('toasts.caseAdded'),
      });
    },
    showToastError(e) {
      return this.$store.dispatch('main/showToast', {
        title: this.$t('toasts.error'),
        variant: 'warning',
        text: `${e}`,
      });
    },
    async getPortfolios() {
      return await this.$store.dispatch('user/getUserPortfolios', this.userData.id);
    },
    async setCaseImage() {
      const { file, data } = this.portfolio;
      const formData = new FormData();
      formData.append('image', file);
      if (data.ok) {
        const payload = {
          url: data.result.url,
          formData: file,
          type: file.type,
        };
        await this.$store.dispatch('user/setCaseImage', payload);
      }
    },
    async setCaseData() {
      const { data } = this.portfolio;
      const payload = {
        title: this.caseTitle,
        description: this.caseDescription,
        medias: [data.result.mediaId],
      };
      await this.$store.dispatch('user/setCaseData', payload);
    },
    async processFile(e, validate) {
      this.valid = await validate(e);
      const file = e.target.files[0];
      if (this.valid.valid) {
        if (!file) {
          return false;
        }
        const reader = new FileReader();
        reader.readAsDataURL(file);
        this.portfolio.data = await this.$store.dispatch('user/imageType', { contentType: file.type });
        this.portfolio.file = file;
      }
      return this.portfolio;
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
  &__wrapper {
    margin: 0 0 25px 0;
  }
  &__content {
    display: grid;
    grid-template-columns: 1fr;
    justify-items: center;
    grid-gap: 20px;
  }
  &__action {
    margin-top: 10px;
  }

  &__textarea {
    border-radius: 6px;
    padding: 11px 20px 11px 15px;
    height: 214px;
    width: 100%;
    border: 0;
    background-color: $black0;
    resize: none;

    &::placeholder {
      color: $black200;
    }
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
