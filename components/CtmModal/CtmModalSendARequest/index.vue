<template>
  <ctm-modal-box
    class="message"
    :title="'Send a request'"
  >
    <!-- Передать заголовок из локацизации -->
    <div class="ctm-modal__content">
      <div class="message">
        <div class="message__content">
          <div class="modal__desc">
            <div class="message__wrapper">
              <p class="modal__labelMessage">
                {{ $t('modals.message') }}
              </p>
              <div>
                <!-- Передать плейсхолдер из локацизации -->
                <b-form-textarea
                  id="textarea"
                  v-model="text"
                  class="message__textarea"
                  placeholder="Hello..."
                  rows="3"
                  max-rows="6"
                />
              </div>
            </div>
            <dropzone
              id="foo"
              ref="el"
              :options="options"
            />
            <div class="btn__container">
              <div class="btn__wrapper">
                <base-btn
                  class="message__action"
                  @click="showRequestSendModal() "
                >
                  {{ $t('meta.send') }}
                </base-btn>
              </div>
              <div class="btn__wrapper">
                <base-btn
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
/* eslint-disable object-shorthand,no-var */
import { mapGetters } from 'vuex';
import Dropzone from 'nuxt-dropzone';
import modals from '~/store/modals/modals';
import 'nuxt-dropzone/dropzone.css';

export default {
  name: 'ModalSendARequest',
  components: {
    Dropzone,
  },
  data() {
    return {
      options: {
        url: 'http://httpbin.org/anything',
        addRemoveLinks: true,
        dictRemoveFile: '<span class="icon-close_big_white"></span>',
        dictCancelUpload: '<span class="icon-close_big_white"></span>',
        dictCancelUploadConfirmation: '',
        maxFiles: '3',
        dictDefaultMessage:
          '<div class="uploader__message_container">'
          + '<div class="uploader__message">Upload a images or videos</div><'
          + "span class='icon-add_to_queue_blue'></span>"
          + '</div>',
      },
      file1: null,
      file2: null,
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
    }),
  },
  mounted() {
    // Everything is mounted and you can access the dropzone instance
    const instance = this.$refs.el.dropzone;
  },
  methods: {
    hide() {
      this.CloseModal();
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
    border-color: $black100;
    background-color: $black0;
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
.uploader__message_container {
  margin: 0 0 0 10% !important;
}
</style>
