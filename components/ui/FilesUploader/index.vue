<template>
  <div
    ref="uploader"
    class="uploader"
    :class="uploaderStyles()"
    @dragover="dragover"
    @dragleave="dragleave"
    @drop="drop"
  >
    <div
      v-if="!files.length"
      class="uploader__message_container"
    >
      <div class="uploader__message">
        Upload files
      </div>
      <div class="icon-add_to_queue" />
    </div>
    <div
      v-if="errorInfo.isShow"
      class="uploader__error error"
    >
      {{ errorInfo.text }}
    </div>
    <div
      class="uploader__files files-container"
    >
      <div
        v-for="(item, i) of files"
        :key="i"
        class="file"
      >
        <img
          :src="item.src"
          :class="{ file__img: item.type === 'image' }"
        >
        <span
          class="icon-close_big file__remover"
          @click="removeItem(item.id)"
        />
      </div>
    </div>
    <div
      class="uploader__input_handler"
      @click="openExplorer"
    />
    <input
      ref="input"
      class="uploader__input"
      type="file"
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
    };
  },
  mounted() {
    this.files = this.preloadedFiles;
  },
  methods: {
    uploaderStyles() {
      return [
        { uploader__preview: !this.files.length },
      ];
    },
    openExplorer() {
      this.$refs.input.click();
    },
    removeItem(id) {
      this.errorInfo.isShow = false;
      this.files = this.files.filter((item) => item.id !== id);
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
    onChange() {
      this.errorInfo.isShow = false;
      const inputs = this.$refs.input.files;
      if (!inputs.length) return;
      // eslint-disable-next-line no-restricted-syntax
      for (const file of inputs) {
        if (this.limit && this.files.length >= this.limit) {
          this.showError(this.$t('uploader.errors.filesLimit', { n: this.limit }));
          return;
        }
        if (this.limitBytes && file.size >= this.limitBytes) {
          const kb = Math.ceil(this.limitBytes / 1024);
          const mb = Math.ceil(this.limitBytes / 1024 / 1024);
          if (mb >= 1) {
            // this.showError(`File size limit: ${mb}mb`);
            this.showError(this.$t('uploader.errors.fileSizeLimit', { n: mb }) + this.$t('uploader.mb'));
          } else {
            this.showError(this.$t('uploader.errors.fileSizeLimit', { n: kb }) + this.$t('uploader.kb'));
          }
          // eslint-disable-next-line no-continue
          continue;
        }
        if (!this.acceptDuplicates && this.files.filter((item) => item.file.size === file.size
          && item.file.lastModified === file.lastModified
          && item.file.name === file.name).length) {
          return;
        }
        this.files.push({
          id: this.id,
          src: URL.createObjectURL(file),
          type: file.type.split('/')[0],
          file,
        });
        this.id += 1;
      }
      this.$emit('change', this.files);
      this.$refs.input.value = null;
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
  margin-left: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  &__img {
    object-fit: cover;
    width: 100%;
    height: 100%;
    border-radius: 6px;
  }
  &__remover {
    position: absolute;
    font-size: 64px;
    cursor: pointer;
    &::before {
      opacity: 0;
    }
    &:hover::before {
      color: $red;
      background: $grey;
      border-radius: 50%;
      opacity: 75%;
    }
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
}

@include _575 {
  .file {
    width: 70vw;
    height: 70vw;
    margin-left: 0;
    margin-bottom: 15px;
    &__remover {
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
