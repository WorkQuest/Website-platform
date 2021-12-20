<template>
  <ctm-modal-box
    class="message"
    :title="$t('modals.sendARequest')"
  >
    <div class="ctm-modal__content">
      <validation-observer
        v-slot="{handleSubmit}"
      >
        <div class="message">
          <div class="message__content">
            <div class="modal__desc">
              <div class="message__wrapper">
                <label
                  for="textarea"
                  class="modal__labelMessage"
                >
                  {{ $t('modals.message') }}
                </label>
                <div>
                  <textarea
                    id="textarea"
                    v-model="text"
                    class="message__textarea"
                    rules="required"
                    :placeholder="$t('modals.hello')"
                  />
                </div>
                <files-uploader
                  :multiple="true"
                  :limit="10"
                  :limit-bytes="10485760"
                  :limit-bytes-video="10485760"
                  :accept="'image/png, image/jpg, image/jpeg, video/mp4'"
                  :preloaded-files="questData.medias"
                  @change="updateFiles"
                />
              </div>
              <div class="btn__container">
                <div class="btn__wrapper">
                  <base-btn
                    class="message__action"
                    :disabled="!text"
                    @click="handleSubmit(showRequestSendModal)"
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
      </validation-observer>
    </div>
  </ctm-modal-box>
</template>

<script>
/* eslint-disable object-shorthand,no-var */
import { mapGetters } from 'vuex';
import modals from '~/store/modals/modals';
import { InfoModeWorker, QuestStatuses } from '~/utils/enums';

export default {
  name: 'ModalSendARequest',
  data() {
    return {
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
    hide() {
      this.CloseModal();
    },
    async respondOnQuest() {
      const medias = await this.uploadFiles(this.files);
      const { questId } = this.options;
      const data = {
        message: this.text,
        medias,
      };
      try {
        if (QuestStatuses.Rejected) {
          await this.$store.dispatch('quests/respondOnQuest', { data, questId });
          await this.$store.dispatch('quests/setInfoDataMode', InfoModeWorker.Rejected);
        }
      } catch (e) {
        console.log(e);
      }
    },
    async showRequestSendModal() {
      await this.respondOnQuest();
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
.ctm-modal{
  &__box {
    max-width: 800px !important;
  }
  &__title {
    margin: 0 0 0 9% !important;
  }
}
</style>
