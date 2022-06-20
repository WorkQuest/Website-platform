<template>
  <ctm-modal-box
    class="ctm-modal"
    :is-header="false"
  >
    <div class="ctm-modal__content content">
      <div
        v-if="options.portfolio && isMyProfile"
        class="content__btns"
      >
        <base-btn
          data-selector="SHOW-DELETE-CASE-MODAL"
          class="portfolio__close"
          mode="portfolioClose"
          @click="showDeleteCaseModal(options.id)"
        >
          <span class="icon-close_big" />
        </base-btn>
        <base-btn
          class="portfolio__edit"
          data-selector="SHOW-EDIT-CASE-MODAL"
          mode="portfolioEdit"
          @click="showEditCaseModal(options.id)"
        >
          <span class="icon-edit" />
        </base-btn>
      </div>
      <video
        v-if="options.contentType === 'video'"
        :src="options.url"
        controls
        class="content__file"
      />
      <img
        v-else
        :src="options.url"
        alt=""
        class="content__file"
      >
    </div>
    <div
      v-if="options.title || options.description"
      class="ctm-modal__desc desc"
    >
      <div
        v-if="options.title"
        class="desc__title"
      >
        {{ options.title }}
      </div>
      <div
        v-if="options.description"
        class="desc__desc"
      >
        {{ options.description }}
      </div>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';
import modals from '~/store/modals/modals';

export default {
  name: 'ShowImage',
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
      userData: 'user/getUserData',
    }),
    isMyProfile() {
      return this.$route.params.id === this.userData.id;
    },
  },
  methods: {
    showDeleteCaseModal(id) {
      this.ShowModal({ key: modals.deleteCase, id });
    },
    showEditCaseModal(id) {
      this.ShowModal({
        key: modals.editCase,
        id,
        title: this.options.title,
        desc: this.options.description,
        media: this.options.medias,
      });
    },
  },
};
</script>

<style lang="scss" scoped>

.portfolio {
  &__edit {
    transition: .5s ease-in-out;
    opacity: 0;
    visibility: hidden;
  }
  &__close {
    transition: .5s ease-in-out;
    opacity: 0;
    visibility: hidden;
  }
}

.ctm-modal__content:hover .portfolio__close,
.ctm-modal__content:hover .portfolio__edit {
  transition: .5s ease-in-out;
  opacity: 1;
  visibility: visible;
}

.ctm-modal {
  @include modalKit;
  &__box {
    max-width: 1200px !important;
    width: 100% !important;
    height: auto !important;
    padding: 0 !important;
  }
  &__content {
    padding: 0 28px 5px 28px !important;
  }
  &__desc {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: baseline;
    padding: 28px 28px 5px 28px !important;
  }
}
.content {
  margin-top: 28px;
  max-height: 800px;
  height: 100vh;
  max-width: 1200px;
  width: 100%;
  &__btns {
    position: absolute;
    left: 25px;
    top: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 25px;
    width: 60px;
    border-radius: 6px;
    padding: 2px;
  }
  &__file {
    max-width: 1200px;
    width: 100%;
    height: 100%;
    border-radius: 6px;
    object-fit: contain;
  }
}
.desc {
  display: flex;
  flex-direction: column;
  &__title {
    @include text-simple;
    justify-content: center;
    margin: 10px 10px 0 0;
    font-size: 18px;
    font-weight: 500;
    display: flex;
    overflow: hidden;
    width: 100%;
  }
  &__desc {
    @include text-simple;
    display: flex;
    text-align: left;
    margin: 10px 10px 0 0;
    font-size: 16px;
    font-weight: 400;
    overflow: hidden;
    width: 100%;
    word-break: break-word;
    white-space: pre-line;
  }
}

@include _767 {
  .content {
    max-height: 600px !important;
  }
}

@include _575 {
  .content {
    max-height: 400px !important;
  }
}

@include _480 {
  .content {
    max-height: 300px !important;
  }
}

</style>
