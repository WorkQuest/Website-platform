<template>
  <div
    id="file-drag-drop"
    class="uploader"
    :class="{'uploader__files': files.length > 0}"
  >
    <ValidationProvider
      v-slot="{ validate }"
      rules="required|ext:png,jpeg,jpg,gif"
      tag="div"
    >
      <input
        id="fileInput"
        ref="fileInput"
        type="file"
        accept=".jpg, .jpeg, .png, .gif"
        hidden
        multiple
        @change="processFile($event, validate)"
      >
      <form
        ref="fileForm"
        class="uploader__container"
        @click="openFileUploader"
      >
        <span class="uploader__drop">
          <div v-if="files.length === 0">
            {{ $t('uploader.uploadText') }}
            <span class="icon-add_to_queue" />
          </div>
        </span>
      </form>
    </ValidationProvider>
    <button
      v-show="files.length > 0"
      class="btn__submit"
      @click="addFiles()"
    >
      {{ $t('uploader.upload') }} {{ files.length }} {{ $t('uploader.files') }}
    </button>
    <div class="uploader preview">
      <div class="preview__container">
        <span
          v-for="(file, i) in files"
          :key="i"
          class="preview__files"
        >
          <div class="preview__close">
            <span
              class="icon-close_big"
              @click="removeFile( i )"
            />
          </div>

          <img
            :ref="'preview'+parseInt( i )"
            class="preview__file"
          >
        </span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dragAndDropCapable: false,
      files: [],
      portfolioChange: {
        data: {},
        file: {},
      },
      uploadPercentage: 0,
      showLoading: false,
      dragEvents: ['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'],
    };
  },
  mounted() {
    this.dragAndDropCapable = this.determineDragAndDropCapable();
    if (this.dragAndDropCapable) {
      this.dragEvents.forEach((evt) => {
        this.$refs.fileForm.addEventListener(evt, (e) => {
          e.preventDefault();
          e.stopPropagation();
        }, false);
      });
    }
    this.watchDrop();
    this.watchInput();
  },
  methods: {
    // eslint-disable-next-line consistent-return
    async processFile(e, validate) {
      const isValid = await validate(e);
      const file = e.target.files[0];
      if (isValid.valid) {
        if (!file) {
          return false;
        }
        const reader = new FileReader();
        reader.readAsDataURL(file);
        const img = this.portfolioChange;
        img.data = await this.$store.dispatch('user/imageCaseType', { contentType: file.type });
        img.file = file;
      }
    },
    async watchDrop() {
      this.$refs.fileForm.addEventListener('drop', async (e, validate) => {
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < e.dataTransfer.files.length; i++) {
          this.files.push(e.dataTransfer.files[i]);
        }
        this.getImagePreviews();
      });
    },
    async watchInput() {
      this.$refs.fileInput.addEventListener('input', (e) => {
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < e.target.files.length; i++) {
          this.files.push(e.target.files[i]);
        }
        this.getImagePreviews();
      });
    },
    async openFileUploader() {
      document.getElementById('fileInput').click();
    },
    determineDragAndDropCapable() {
      const div = document.createElement('div');
      return (('draggable' in div)
        || ('ondragstart' in div && 'ondrop' in div))
        && 'FormData' in window
        && 'FileReader' in window;
    },
    getImagePreviews() {
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < this.files.length; i++) {
        const fileTypes = '/\\.(jpe?g|png|gif)$/i.test(this.files[i].name)';
        if (fileTypes) {
          const reader = new FileReader();
          reader.addEventListener('load', () => {
            this.$refs[`preview${i}`][0].src = reader.result;
          }, false);
          reader.readAsDataURL(this.files[i]);
        }
      }
    },
    async addFiles() {
      const img = this.portfolioChange;
      try {
        const formData = new FormData();
        formData.append('image', img.file);
        if (img.data.ok) {
          const data = {
            url: img.data.result.url,
            formData: img.file,
            type: img.file.type,
          };
          await this.$store.dispatch('user/setUploaderImageInStore', data);
        }
        const payload = {
          medias: [img.data.result.mediaId],
        };
        await this.$store.dispatch('user/setUploaderImageDataInStore', payload);
      } catch (error) {
        console.error(error);
        this.hide();
      }
    },
    removeFile(i) {
      this.files.splice(i, 1);
    },
  },
};
</script>

<style lang="scss" scoped>

.preview {
  &__close {
    z-index: 1000;
    position: relative;
    margin-bottom: -60px;
    margin-left: 62px;
  }
  &__container {
    position: relative;
    z-index: 10;
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    align-items: center;
    margin-top: -230px;
    padding: 0 10px;
  }
  &__file {
    position: relative;
    border-radius: 6px;
    width: 100%;
    max-width: 150px;
    transition: .5s;
    &:hover .uploader {
      background: $black100;
      border: 1px dashed $black200;
    }
  }
  &__files {
    margin: 10px 5px 10px 5px;
    transition: .5s;
    &:hover .uploader-form__preview {
      z-index: 10;
      filter: brightness(0.4);
      }
    &:hover .icon-close_big {
      visibility: visible
    }
    &:first-child {
      padding: 10px 5px 10px 0;
    }
    &:last-child {
      padding: 10px 0 10px 5px;
    }
  }
}

.btn {
  &__submit {
    display: block;
    text-align: center;
    width: 200px;
    height: 50px;
    padding: 0 10px 0 10px;
    text-transform: uppercase;
    background-color: #CCC;
    color: white;
    font-weight: bold;
    margin: -55px auto auto auto;
    border-radius: 6px;
    text-decoration: none;
    transition: .5s;
    &:hover {
      background-color: #a3a3a3;
    }
    &:hover .uploader-form:hover {
      background: $black100;
      border: 1px dashed $black200;
    }
  }
}

.icon-close_big {
  position: relative;
  visibility: hidden;
  background: $red;
  padding: 5px;
  border: 1px solid transparent;
  border-radius: 5px;
  display: table-cell;
  text-align: center;
  vertical-align: middle;
}

.uploader {
  margin-bottom: 250px;
  &__container {
    z-index: 1000;
    display: block;
    height: 400px;
    width: 100%;
    margin: 40px auto auto;
    text-align: center;
    line-height: 400px;
    border-radius: 4px;
    border: 1px dashed $black100;
    transition: .5s;
    &:hover {
      background: $black100;
      border: 1px dashed $black200;
    }
  }
  &__files {
    margin-bottom: 99px;
  }
  &__progress {
    width: 100%;
    display: flex;
    transition: .5s;
    &_hide {
      display: none;
    }
  }
}
</style>
