<template>
  <div
    ref="uploader"
    class="uploader"
    :class="uploaderStyles"
    data-selector="COMPONENT-FILE-UPLOADER"
    @dragover="dragover"
    @dragleave="dragleave"
    @drop="drop"
  >
    <div
      v-if="!files.length"
      class="uploader__message_container"
    >
      <div class="uploader__message">
        <span>
          {{ $t('uploader.uploadFile') }}
        </span>
        <span>
          {{ $t('uploader.maxFileSize', { n: this.limitSize.image.mb }) }}
        </span>
        <span>
          {{ $t('uploader.supportedFileTypes', { n: this.accept }) }}
        </span>
      </div>
      <div class="icon-add_to_queue" />
    </div>
    <div
      v-if="errorInfo.isShow"
      class="uploader__error error"
    >
      {{ errorInfo.text }}
    </div>
    <div class="uploader__files files-container">
      <div
        v-for="(item, i) of files"
        :key="i"
        :data-selector="`FILE-UPLOADER-FILE-${i}`"
        class="file"
      >
        <img
          v-if="item.type === 'image'"
          :src="item.src"
          alt=""
          class="file__img"
        >
        <video
          v-else-if="item.type === 'video'"
          :src="item.src"
          class="file__video"
        />
        <div class="file__info">
          {{ item.type }}
        </div>
        <span
          class="icon-close_big file__remover"
          :data-selector="`ACTION-BTN-REMOVE-FILE-${item.id}`"
          @click="removeItem(item.id)"
        />
      </div>
    </div>
    <div
      class="uploader__input_handler"
      data-selector="ACTION-BTN-OPEN-EXPLORER"
      @click="openExplorer"
    />
    <input
      ref="input"
      class="uploader__input"
      type="file"
      data-selector="FILE-UPLOADER-INPUT"
      :multiple="multiple"
      :accept="accept"
      :value="selectedFile"
      @change="onChange"
    >
  </div>
</template>

<script>
import imageOptimization from '~/plugins/mixins/imageOptimization';

export default {
  name: 'FilesUploader',
  mixins: [imageOptimization],
  props: {
    accept: {
      type: String,
      default: '',
    },
    limit: {
      type: Number,
      default: 0,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    limitBytes: {
      type: Number,
      default: 0,
    },
    limitBytesVideo: {
      type: Number,
      default: 0,
    },
    acceptDuplicates: {
      type: Boolean,
      default: false,
    },
    preloadedFiles: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      files: [],
      id: 0,
      errorInfo: {
        isShow: false,
        text: '',
      },
      acceptedTypes: [],
      selectedFile: '',
      limitSize: {
        image: {
          kb: null,
          mb: null,
        },
        video: {
          kb: null,
          mb: null,
        },
      },

      isUploading: false,
    };
  },
  computed: {
    uploaderStyles() {
      return [{ uploader__preview: !this.files?.length }];
    },
  },
  async created() {
    this.acceptedTypes = this.accept.replace(/\s/g, '').split(',');
    // eslint-disable-next-line no-restricted-syntax
    for (const file of this.preloadedFiles) {
      this.files.push({
        id: this.id,
        mediaId: file?.id,
        src: file?.url,
        type: file?.contentType.split('/')[0],
      });
      this.id += 1;
    }
    this.$emit('change', this.files);

    this.limitSize = {
      image: {
        kb: Math.ceil(this.limitBytes / 1024),
        mb: Math.ceil(this.limitBytes / 1024 / 1024),
      },
      video: {
        kb: Math.ceil(this.limitBytesVideo / 1024),
        mb: Math.ceil(this.limitBytesVideo / 1024 / 1024),
      },
    };
  },
  methods: {
    openExplorer() {
      this.$refs.input.click();
    },
    removeItem(id) {
      this.errorInfo.isShow = false;
      this.files = this.files.filter((item) => item.id !== id);
      this.$emit('change', this.files);
    },
    dragover(e) {
      e.preventDefault();
      if (!e.currentTarget.classList.contains('uploader__message_hover')) {
        e.currentTarget.classList.add('uploader__message_hover');
      }
    },
    dragleave(e) {
      e.currentTarget.classList.remove('uploader__message_hover');
    },
    drop(e) {
      e.preventDefault();
      this.$refs.input.files = e.dataTransfer.files;
      this.$refs.input.dispatchEvent(new Event('change'));
      e.currentTarget.classList.remove('uploader__message_hover');
    },
    async onChange(e) {
      if (this.isUploading) return;
      this.isUploading = true;

      this.errorInfo.isShow = false;
      const inputs = this.$refs.input.files;
      if (!inputs.length) return;
      // eslint-disable-next-line no-restricted-syntax
      for (const file of inputs) {
        let originalFile = file;
        if (originalFile.type === 'image/heic') {
          // eslint-disable-next-line no-await-in-loop
          originalFile = await this.HEICConvertTo(originalFile);
          // eslint-disable-next-line no-continue
          if (!originalFile) continue;
        }

        if (this.acceptedTypes.indexOf(originalFile.type) === -1) {
          // eslint-disable-next-line no-continue
          continue;
        }

        if (this.limit && this.files.length >= this.limit) {
          this.showError(this.$t('uploader.errors.filesLimit', { n: this.limit }));
          return;
        }

        if (originalFile.type.startsWith('image')) {
          const fileInput = e.target;
          // eslint-disable-next-line no-await-in-loop
          await this.OptimizeImage(fileInput, originalFile, 1920, 1080);
          // eslint-disable-next-line prefer-destructuring
          originalFile = fileInput.files[0];
        }

        if (!originalFile?.type) {
          console.error('Error on uploading file', originalFile, file);
          // eslint-disable-next-line no-continue
          continue;
        }

        const type = originalFile.type.split('/')[0];
        if (type === 'image' && this.limitBytes && file.size >= this.limitBytes) {
          if (this.limitSize.image.mb >= 1) this.showError(this.$t('uploader.errors.fileSizeLimit', { n: this.$t('meta.units.mb', { count: this.limitSize.image.mb }) }));
          else this.showError(this.$t('uploader.errors.fileSizeLimit', { n: this.$t('meta.units.kb', { count: this.limitSize.image.kb }) }));
          // eslint-disable-next-line no-continue
          continue;
        }
        if (type === 'video' && this.limitBytesVideo && file.size >= this.limitBytesVideo) {
          if (this.limitSize.video.mb >= 1) this.showError(this.$t('uploader.errors.fileSizeLimit', { n: this.$t('meta.units.mb', { count: this.limitSize.video.mb }) }));
          else this.showError(this.$t('uploader.errors.fileSizeLimit', { n: this.$t('meta.units.kb', { count: this.limitSize.video.kb }) }));
          // eslint-disable-next-line no-continue
          continue;
        }
        if (!this.acceptDuplicates && this.files?.filter((item) => !item.mediaId && item.file?.size === file?.size
          && item.file?.lastModified === file?.lastModified
          && item.file?.name === file?.name).length) {
          // eslint-disable-next-line no-continue
          continue;
        }
        this.files.push({
          id: this.id,
          src: URL.createObjectURL(file),
          type: originalFile.type.split('/')[0],
          file: originalFile,
        });
        this.id += 1;
      }
      this.$refs.input.value = null;
      this.$emit('change', this.files);

      this.isUploading = false;
    },
    showError(errorText) {
      this.errorInfo.isShow = true;
      this.errorInfo.text = errorText;
    },
  },
};
</script>

<style lang="scss" scoped>
.uploader {
  position: relative;
  width: 100%;
  min-height: 150px;
  border-radius: 6px;
  border: 1px solid $black100;
  cursor: pointer;
  color: $black600;

  &:hover {
    background: $black0;
  }
  &__preview {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &__message {
    display: flex;
    flex-direction: column;
    align-items: center;

    margin-bottom: 5px;
    user-select: none;
    &_container {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    &_hover {
      color: $blue !important;
      background: $black0 !important;
    }
  }
  &__input {
    visibility: hidden;
    position: absolute;
    left: -999px;
    &_handler {
      left: 0;
      top: 0;
      position: absolute;
      width: 100%;
      height: 100%;
      pointer-events: auto;
    }
  }
}
.files-container {
  pointer-events: none;
  padding: 15px;
  display: flex;
  flex-wrap: wrap;
  & >* {
    margin: 5px;
  }
  margin: -5px;
}
.file {
  z-index: 1;
  pointer-events: auto;
  position: relative;
  width: 150px;
  height: 150px;
  border: 1px solid $black100;
  border-radius: 6px;
  cursor: default;
  display: flex;
  align-items: center;
  justify-content: center;

  &__info {
    padding: 1px 3px;
    border-radius: 6px;
    background: $black700;
    color: $black0;
    z-index: 1;
    position: absolute;
    left: 0;
    bottom: 0;
    font-size: 12px;
  }
  &__img {
    object-fit: cover;
    width: 100%;
    height: 100%;
    border-radius: 6px;
  }
  &__video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 6px;
  }
  &__remover {
    position: absolute;
    z-index: 10;
    font-size: 64px;
    cursor: pointer;
    opacity: 0;
  }
  &:hover .file__remover {
    border-radius: 50%;
    opacity: 50%;
    background: $black800;
  }
}
.error {
  z-index: 10;
  position: absolute;
  left: 0;
  top: 0;
  background: $red;
  color: $black0;
  padding: 5px;
  border-radius: 6px;
  cursor: auto;
}
.icon-add_to_queue {
  color: $blue;
}
@include _575 {
  .file {
    width: 70vw;
    height: 70vw;
    margin-left: 0;
    margin-bottom: 15px;
    &__remover {
      opacity: 100% !important;
      &::before {
        opacity: 75%;
        color: $red;
        background: $grey;
        border-radius: 50%;
      }
    }
  }
  .files-container {
    justify-content: center;
  }
}
</style>
