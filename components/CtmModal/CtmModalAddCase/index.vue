<template>
  <ctm-modal-box
    class="message"
    :title="$tc('modals.titles.addCase')"
  >
    <div class="ctm-modal__content">
      <div class="message">
        <div class="message__content">
          <div class="modal__desc">
            <files-uploader
              :multiple="false"
              :limit="1"
              :limit-bytes="10485760"
              :accept="'image/png, image/jpg, image/jpeg, image/heic'"
              rules="required"
              @change="updateFiles"
            />
            <validation-observer v-slot="{ invalid }">
              <base-field
                v-model="caseTitle"
                :label="$tc('modals.title')"
                :placeholder="$t('modals.addTitle')"
                mode="gray"
                data-selector="CASE-TITLE"
                rules="required|text-title|max:70"
                :name="$tc('modals.title')"
              />
              <div class="message__wrapper">
                <base-textarea
                  id="textarea"
                  v-model="caseDescription"
                  :label="$tc('modals.description')"
                  class="message__textarea"
                  data-selector="CASE-DESCRIPTION"
                  :placeholder="$t('modals.addDesc')"
                  rules="text-desc|max:350"
                  :name="$tc('modals.description')"
                />
              </div>
              <div class="btn__container">
                <div class="btn__wrapper">
                  <base-btn
                    class="message__action"
                    data-selector="ADD-USER-CASE"
                    :disabled="invalid || !files.length"
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
      caseTitle: '',
      caseDescription: '',
      files: [],
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
      this.SetLoader(true);
      const { caseTitle, caseDescription } = this;
      const medias = await this.uploadFiles(this.files);
      if (!medias.length) {
        this.SetLoader(false);
        return;
      }
      const { ok } = await this.$store.dispatch('user/setCaseData', {
        title: caseTitle,
        description: caseDescription.trim() || ' ',
        mediaIds: medias,
      });
      if (ok) {
        await this.getPortfolios();
        await this.$store.dispatch('main/showToast', {
          title: this.$t('toasts.caseAdded'),
          variant: 'success',
          text: this.$t('toasts.caseAdded'),
        });
      }
      this.CloseModal();
      this.SetLoader(false);
    },
    async getPortfolios() {
      return await this.$store.dispatch('user/getUserPortfolios', { userId: this.userData.id });
    },
    async updateFiles(files) {
      this.files = files;
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
