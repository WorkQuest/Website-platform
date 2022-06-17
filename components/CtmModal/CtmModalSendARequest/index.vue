<template>
  <ctm-modal-box
    class="message"
    :title="options.title"
  >
    <div class="ctm-modal__content">
      <validation-observer v-slot="{handleSubmit}">
        <div class="message">
          <div class="message__content">
            <div class="modal__desc">
              <div class="message__wrapper">
                <!--suppress XmlInvalidId -->
                <label
                  for="textarea"
                  class="modal__labelMessage"
                >
                  {{ $t('modals.message') }}
                </label>
                <div>
                  <base-textarea
                    id="textarea"
                    v-model="text"
                    data-selector="MESSAGE"
                    class="message__textarea"
                    rules="required"
                    :name="$t('modals.message')"
                    :placeholder="$t('meta.typeYourMessage')"
                  />
                </div>
                <files-uploader
                  :multiple="true"
                  :limit="10"
                  :limit-bytes="10485760"
                  :limit-bytes-video="10485760"
                  :accept="'image/png, image/jpg, image/jpeg, video/mp4'"
                  class="message__uploader"
                  @change="updateFiles"
                />
              </div>
              <div class="btn__container">
                <div class="btn__wrapper">
                  <base-btn
                    data-selector="SEND"
                    class="message__action"
                    :disabled="!text || isRespondActionInProgress"
                    @click="handleSubmit(handleSend)"
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
            </div>
          </div>
        </div>
      </validation-observer>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';
import modals from '~/store/modals/modals';
import { images } from '~/utils/images';

export default {
  name: 'ModalSendARequest',
  data() {
    return {
      isRespondActionInProgress: false,
      text: '',
      files: [],
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
    }),
  },
  methods: {
    updateFiles(files) {
      this.files = files;
    },
    async handleSend() {
      if (this.isRespondActionInProgress) return;
      this.isRespondActionInProgress = true;

      const { submit } = this.options;
      await submit(this.files, this.text);

      this.isRespondActionInProgress = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.ctm-modal {
  @include modalKit;
  &__box {
    max-width: 800px;
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
  }
  &__labelMessage {
    @include text-simple;
    font-size: 16px;
    color: $black800;
  }
}
.file {
  &__wrapper {
    margin: 0 0 25px 0;
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
    height: 214px;
    width: 100%;
    &::placeholder {
      color: $black200;
    }
  }

  &__uploader {
    margin-top: 20px;
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
.ctm-modal{
  &__box {
    max-width: 800px !important;
  }
  &__title {
    margin: 0 0 0 9% !important;
  }
}
</style>
