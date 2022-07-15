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
        {{ $t('uploader.uploadFile') }}
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
      @change="onChange"
    >
  </div>
</template>

<script>
export default {
  name: 'FilesUploader',
  props: {
    accept: {
      type: String,
      default: '',
    },
    limit: {
      type: Number,
      default: 0,
    },
    multiple: Boolean,
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
    dragover(event) {
      event.preventDefault();
      if (!event.currentTarget.classList.contains('uploader__message_hover')) {
        event.currentTarget.classList.add('uploader__message_hover');
      }
    },
    dragleave(event) {
      event.currentTarget.classList.remove('uploader__message_hover');
    },
    drop(event) {
      event.preventDefault();
      this.$refs.input.files = event.dataTransfer.files;
      this.onChange();
      event.currentTarget.classList.remove('uploader__message_hover');
    },
    async onChange() {
      this.errorInfo.isShow = false;
      const inputs = this.$refs.input.files;
      if (!inputs.length) return;
      // eslint-disable-next-line no-restricted-syntax
      for (let file of inputs) {
        if (file.type === 'image/heic') {
          // eslint-disable-next-line no-await-in-loop
          file = await this.HEICConvertTo(file);
          // eslint-disable-next-line no-continue
          if (!file) continue;
        }

        if (!this.checkContentType(file)) {
          // eslint-disable-next-line no-continue
          continue;
        }
        if (this.limit && this.files.length >= this.limit) {
          this.showError(this.$t('uploader.errors.filesLimit', { n: this.limit }));
          return;
        }
        const type = file.type.split('/')[0];
        if (type === 'image' && this.limitBytes && file.size >= this.limitBytes) {
          const kb = Math.ceil(this.limitBytes / 1024);
          const mb = Math.ceil(this.limitBytes / 1024 / 1024);
          if (mb >= 1) this.showError(this.$t('uploader.errors.fileSizeLimit'), this.$tc('meta.units.mb', { count: mb }));
          else this.showError(this.$t('uploader.errors.fileSizeLimit'), this.$tc('meta.units.kb', { count: kb }));
          // eslint-disable-next-line no-continue
          continue;
        }
        if (type === 'video' && this.limitBytesVideo && file.size >= this.limitBytesVideo) {
          const kb = Math.ceil(this.limitBytesVideo / 1024);
          const mb = Math.ceil(this.limitBytesVideo / 1024 / 1024);
          if (mb >= 1) this.showError(this.$t('uploader.errors.fileSizeLimit'), this.$tc('meta.units.mb', { count: mb }));
          else this.showError(this.$t('uploader.errors.fileSizeLimit'), this.$tc('meta.units.kb', { count: kb }));
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
          type: file.type.split('/')[0],
          file,
        });
        this.id += 1;
      }
      this.$refs.input.value = null;
      this.$emit('change', this.files);
    },
    checkContentType(file) {
      return this.acceptedTypes.indexOf(file.type) !== -1;
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
    opacity: 100%;
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
