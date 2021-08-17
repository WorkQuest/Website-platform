<template>
  <div
    id="file-drag-drop"
    class="uploader-form__container"
    :class="{'uploader-form__container_files': files.length > 0}"
    @click="openFileUploader"
  >
    <form
      ref="fileform"
      class="uploader-form"
    >
      <span class="drop-files">
        <span v-if="files.length === 0">
          Upload a images or videos
        </span>
      </span>
    </form>
    <button
      v-show="files.length > 0"
      class="btn__submit"
      @click="submitFiles()"
    >
      Upload {{ files.length }} files.
      <progress
        class="uploader-form__progress"
        :class="{'uploader-form__progress_hide': !showLoading}"
        max="100"
        :value.prop="uploadPercentage"
      />
    </button>
    <div class="uploader-form__preview-container">
      <span
        v-for="(file, key) in files"
        :key="key"
        class="uploader-form__file-listing"
      >
        <div class="btn__close">
          <span
            class="icon-close_big"
            @click="removeFile( key )"
          />
        </div>

        <img
          :ref="'preview'+parseInt( key )"
          class="uploader-form__preview"
        >
      </span>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dragAndDropCapable: false,
      files: [],
      uploadPercentage: 0,
      showLoading: false,
    };
  },
  mounted() {
    this.dragAndDropCapable = this.determineDragAndDropCapable();
    if (this.dragAndDropCapable) {
      ['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'].forEach((evt) => {
        this.$refs.fileform.addEventListener(evt, (e) => {
          e.preventDefault();
          e.stopPropagation();
        }, false);
      });
      this.$refs.fileform.addEventListener('drop', (e) => {
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < e.dataTransfer.files.length; i++) {
          this.files.push(e.dataTransfer.files[i]);
          this.getImagePreviews();
        }
      });
    }
  },
  methods: {
    openFileUploader() {},
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
        console.log(this.files.length);
        if (/\.(jpe?g|png|gif)$/i.test(this.files[i].name)) {
          const reader = new FileReader();
          reader.addEventListener('load', () => {
            // eslint-disable-next-line radix
            this.$refs[`preview${parseInt(i)}`][0].src = reader.result;
          }, false);
          reader.readAsDataURL(this.files[i]);
        } else {
          // eslint-disable-next-line func-names
          this.$nextTick(function () {
            // eslint-disable-next-line radix
            this.$refs[`preview${parseInt(i)}`][0].src = '/images/file.png';
          });
        }
      }
    },
    submitFiles() {
      const formData = new FormData();
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < this.files.length; i++) {
        const file = this.files[i];
        formData.append(`files[${i}]`, file);
      }
      this.$axios.post('/file-drag-drop',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          // eslint-disable-next-line func-names
          onUploadProgress: function (progressEvent) {
            // eslint-disable-next-line radix
            this.showLoading = true;
            // eslint-disable-next-line radix
            this.uploadPercentage = parseInt(Math.round((progressEvent.loaded * 100) / progressEvent.total));
            this.showLoading = false;
          }.bind(this),
        }).then(() => {
        console.log('SUCCESS!!');
      })
        .catch(() => {
          console.log('FAILURE!!');
        });
    },
    removeFile(key) {
      this.files.splice(key, 1);
    },
  },
};
</script>

<style lang="scss" scoped>

.btn {
  &__close {
    z-index: 1000;
    position: relative;
    margin-bottom: -60px;
    margin-left: 62px;
  }
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

.uploader-form {
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
  &__container {
    margin-bottom: 250px;
    &_files {
      margin-bottom: 99px;
    }
  }
  &__file-listing {
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
  &__preview-container {
    position: relative;
    z-index: 10;
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    align-items: center;
    margin-top: -230px;
    padding: 0 10px;
  }
  &__preview {
    position: relative;
    border-radius: 6px;
    width: 100%;
    max-width: 150px;
    transition: .5s;
    &:hover .uploader-form {
      background: $black100;
      border: 1px dashed $black200;
    }
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
