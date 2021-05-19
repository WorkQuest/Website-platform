<template>
  <div class="main-white">
    <div class="main__body">
      <h2 class="page__title">
        Create a new quest
      </h2>
      <div class="page__category">
        <div>
          <span>Proposal</span>
          <base-dd
            type="grey"
          />
        </div>
        <div>
          <span>Category</span>
          <base-dd
            type="grey"
          />
        </div>
      </div>
      <div class="page__address">
        <div>
          <label for="">Address</label>
          <base-field
            placeholder="Moscow, Lenina street, 3"
            mode="icon"
          >
            <template v-slot:left>
              <span class="icon-map" />
            </template>
          </base-field>
        </div>
        <div>
          <label for="">Runtime</label>
          <base-field placeholder="1" />
        </div>
      </div>
      <div>
        <base-field placeholder="Title" />
      </div>
      <div>
        <textarea
          id="textarea"
          v-model="text"
          class="page__textarea"
          placeholder="Hello..."
        />
      </div>
      <div>
        <span>Upload quest materials</span>
        <div>
          <dropzone
            id="uploader"
            ref="el"
            :options="optionsModal"
            :include-styling="true"
          />
        </div>
      </div>
      <div>
        <label for="">Price</label>
        <base-field />
      </div>
      <div>
        <base-btn>Create a quest</base-btn>
      </div>
    </div>
  </div>
</template>

<script>
import Dropzone from 'nuxt-dropzone';
import 'nuxt-dropzone/dropzone.css';
import '~/assets/scss/vue2Dropzone.min.css';
import '~/assets/scss/dropzone.scss';

export default {
  name: 'CreateQuest',
  components: {
    Dropzone,
  },
  data() {
    return {
      text: '',
      optionsModal: {
        url: 'http://httpbin.org/anything',
        addRemoveLinks: true,
        dictRemoveFile: '<span class="icon-close_big"></span>',
        dictCancelUpload: '<span class="icon-close_big"></span>',
        dictCancelUploadConfirmation: '',
        maxFiles: '3',
        dictDefaultMessage:
          '<div class="uploader__message_container">'
          + '<div class="uploader__message">Upload a images or videos</div><'
          + "span class='icon-add_to_queue'></span>"
          + '</div>',
      },
      file1: null,
      file2: null,
    };
  },

  async mounted() {
    this.SetLoader(true);
    this.SetLoader(false);
    const instance = this.$refs.el.dropzone;
  },
};
</script>

<style lang="scss" scoped>
.dd {
  &__{
    background: $black0;
  }
}

.page {
  &__page {
    font-weight: 500;
    font-size: 25px;
    color: $black800;
  }
  &__category {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    grid-gap: 20px;
  }
  &__address {
    display: grid;
    grid-template-columns: 4fr 1fr;
    align-items: center;
    grid-gap: 20px;
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
.main {
  @include main;
  &-white {
    border: 1px solid $black0;
    @include main-white;
  }
}
</style>
