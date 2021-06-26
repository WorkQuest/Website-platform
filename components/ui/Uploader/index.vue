<template>
  <div>
    <dropzone
      id="uploader"
      ref="el"
      :options="optionsModal"
      :include-styling="true"
    />
  </div>
</template>

<script>
import Dropzone from 'nuxt-dropzone';
import 'nuxt-dropzone/dropzone.css';
import '~/assets/scss/vue2Dropzone.min.css';
import '~/assets/scss/dropzone.scss';

export default {
  name: 'Uploader',
  components: {
    Dropzone,
  },
  props: {
    dictDefaultMessage: {
      type: String,
      default: '<div class="uploader-message__container">'
        + '<div class="uploader-message">Upload a images or videos</div><'
        + "span class='icon-add_to_queue_blue'></span>"
        + '</div>',
    },
  },
  data() {
    return {
      optionsModal: {
        url: 'http://httpbin.org/anything',
        addRemoveLinks: true,
        dictRemoveFile: '<span class="icon-close_big_white"></span>',
        dictCancelUpload: '<span class="icon-close_big_white"></span>',
        dictCancelUploadConfirmation: '',
        maxFiles: '3',
        dictDefaultMessage: this.dictDefaultMessage,
      },
      file1: null,
      file2: null,
    };
  },
  mounted() {
    // Everything is mounted and you can access the dropzone instance
    const instance = this.$refs.el.dropzone;
  },
};
</script>

<style lang="scss" scoped>

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

</style>
