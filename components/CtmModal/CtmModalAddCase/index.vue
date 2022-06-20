<template>
  <ctm-modal-box
    class="message"
    :title="$tc('modals.titles.addCase')"
  >
    <!--    TODO: Поменять загрузчик-->
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
            <validation-observer v-slot="{ validated, passed, invalid }">
              <div>
                <base-field
                  v-model="caseTitle"
                  :label="$tc('modals.title')"
                  :placeholder="$t('modals.addTitle')"
                  mode="gray"
                  data-selector="CASE-TITLE"
                  rules="required|text-title"
                  :name="$tc('modals.title')"
                />
              </div>
              <div class="message__wrapper">
                <base-textarea
                  id="textarea"
                  v-model="caseDescription"
                  :label="$tc('modals.description')"
                  class="message__textarea"
                  data-selector="CASE-DESCRIPTION"
                  :placeholder="$t('modals.addDesc')"
                  rules="required|text-desc"
                  :name="$tc('modals.description')"
                />
              </div>
              <div class="btn__container">
                <div class="btn__wrapper">
                  <base-btn
                    class="message__action"
                    data-selector="ADD-USER-CASE"
                    :disabled="!valid || !validated || !passed || invalid"
                    @click="addUserCase"
                  >
                    {{ $t('meta.btns.send') }}
                  </base-btn>
                </div>
                <div class="btn__wrapper">
                  <base-btn
                    mode="outline"
                    data-selector="CANCEL"
                    class="message__action"
                    @click="CloseModal"
                  >
                    {{ $t('meta.btns.cancel') }}
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
    async addUserCase() {
      try {
        this.SetLoader(true);
        const { caseTitle, caseDescription } = this;
        const { file, data } = this.portfolio;
        const { url, mediaId } = data.result;
        const formData = new FormData();
        formData.append('image', file);
        if (data.ok) {
          const payload = { url, formData: file, type: file.type };
          await this.$store.dispatch('user/setCaseImage', payload);
        }
        const { ok } = await this.$store.dispatch('user/setCaseData', {
          title: caseTitle,
          description: caseDescription,
          mediaIds: [mediaId],
        });
        if (ok) {
          await this.$store.dispatch('main/showToast', {
            title: this.$t('toasts.caseAdded'),
            variant: 'success',
            text: this.$t('toasts.caseAdded'),
          });
        }
        await this.getPortfolios();
        this.CloseModal();
        this.SetLoader(false);
      } catch (e) {
        await this.getPortfolios();
        this.CloseModal();
        await this.$store.dispatch('main/showToast', {
          title: this.$t('toasts.error'),
          variant: 'warning',
          text: `${e}`,
        });
        this.SetLoader(false);
      }
    },
    async getPortfolios() {
      return await this.$store.dispatch('user/getUserPortfolios', { userId: this.userData.id });
    },
    async processFile(e, validate) {
      this.valid = await validate(e);
      const file = e.target.files[0];
      if (this.valid.valid) {
        if (!file) return false;
        const reader = new FileReader();
        reader.readAsDataURL(file);
        this.portfolio.data = await this.$store.dispatch('user/imageType', { contentType: file.type });
        this.portfolio.file = file;
      }
      return this.portfolio;
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
