<template>
  <div
    class="preview"
    data-selector="COMPONENT-FILES-PREVIEW"
  >
    <div
      v-for="(item, i) of medias"
      :key="i"
      :data-selector="`ACTION-BTN-OPEN-FILE-${i}`"
      @click="openFile(item)"
    >
      <img
        v-if="item.contentType.split('/')[0] === 'image'"
        class="preview__item"
        :class="{preview__item_small: small}"
        :src="item.url"
        alt=""
      >
      <video
        v-else
        class="preview__item"
        :class="{preview__item_small: small}"
        :src="item.url"
      />
    </div>
  </div>
</template>

<script>
import modals from '~/store/modals/modals';

export default {
  name: 'FilesPreview',
  props: {
    medias: {
      type: Array,
      default: () => [],
    },
    small: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    openFile(file) {
      this.ShowModal({
        key: modals.showImage,
        contentType: file.contentType.split('/')[0],
        url: file.url,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.preview {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 20px;

  &__item {
    transition: 0.5s;
    border-radius: 6px;
    width: 280px;
    height: 210px;
    object-fit: cover;

    &_small {
      width: 140px !important;
      height: 105px !important;
    }

    &:hover {
      cursor: pointer;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    }
  }
}
@include _991 {
  .preview {
      grid-template-columns: repeat(2, auto);
      &__item {
        width: 100%;
      }
  }
}

@include _575 {
  .preview {
    grid-template-columns: 1fr;
    &__item {
      width: 100% !important;
      height: 70% !important;
    }
  }
}
</style>
