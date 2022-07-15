<template>
  <div
    ref="GalleryModal"
    class="ctm-modal__box gallery-modal"
  >
    <div class="gallery-modal__container">
      <div class="gallery-modal__pager">
        <video
          v-if="isVideo"
          :src="getUrl"
          controls
          class="gallery-modal__image"
        />
        <img
          v-else
          :src="getUrl"
          alt=""
          class="gallery-modal__image"
        >
        <div class="gallery-modal__close">
          <div
            class="control-btn control-btn_bg"
            @click="CloseModal"
          >
            <span class="icon-close_big" />
          </div>
        </div>
        <div
          v-if="options.files.length > 1"
          class="gallery-modal__controls"
        >
          <div class="gallery-modal__switches">
            <div
              class="control-btn"
              @click="turnOver(false)"
            >
              <span class="icon-short_left" />
            </div>
            <div class="gallery-modal__title">
              {{ $t('gallery.counter', {n: options.index + 1, c: options.count} ) }}
            </div>
            <div
              class="control-btn"
              @click="turnOver(true)"
            >
              <span class="icon-short_right" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { KeyCodes } from '~/utils/enums';

export default {
  name: 'CtmGallery',
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
    }),
    isVideo() {
      const file = this.getCurrFile();
      return file.type === 'video';
    },
    getUrl() {
      const file = this.getCurrFile();
      return file.url;
    },
  },
  mounted() {
    document.addEventListener('keydown', this.handleClickBtn);
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.handleClickBtn);
  },
  methods: {
    handleClickBtn(ev) {
      if (this.options.count > 1) {
        if (ev.keyCode === KeyCodes.ArrowRight) {
          this.turnOver(true);
          return;
        }
        if (ev.keyCode === KeyCodes.ArrowLeft) {
          this.turnOver(false);
          return;
        }
      }

      if (ev.keyCode === KeyCodes.Escape) this.hide();
    },
    getCurrFile() {
      const { files, index } = this.options;
      return files[index];
    },
    turnOver(isForward) {
      const { count, index } = this.options;
      const advanceIndex = isForward ? index + 1 : index - 1;
      // eslint-disable-next-line no-nested-ternary
      const currIndex = advanceIndex + 1 > count ? 0 : advanceIndex < 0 ? count - 1 : advanceIndex;
      this.$store.commit('modals/setCurrOptionByKey', [{ key: 'index', val: currIndex }]);
    },
  },
};
</script>

<style lang="scss" scoped>
.gallery-modal {
  width: auto;
  max-width: 1180px !important;
  max-height: 80vh !important;
  min-width: 300px;

  &__pager {
    position: relative;
    box-shadow: 0 85px 147px rgba(10, 27, 61, 0.17), 0 47.1676px 61.4131px rgba(10, 27, 61, 0.078707), 0 26.7219px 32.8344px rgba(10, 27, 61, 0.0629546), 0 14.4955px 18.4067px rgba(10, 27, 61, 0.0598272), 0 6.96225px 9.77565px rgba(10, 27, 61, 0.0584222), 0 2.43911px 4.06787px rgba(10, 27, 61, 0.0492837);
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 80vh;
  }

  &__image {
    border-radius: 6px;
    max-height: 80vh;
  }

  &__close {
    position: absolute;
    top: 20px;
    right: 20px;
  }

  &__controls {
    position: absolute;
    bottom: 20px;
    width: 100%;
    display: flex;
    justify-content: center;
  }

  &__switches {
    display: grid;
    grid-template-columns: repeat(3, max-content);
    gap: 20px;
    background-color: #FFFFFF59;
    border-radius: 6px;
  }

  &__title {
    color: #1D2127;
    font-size: 18px;
    font-weight: 400;
    align-self: center;
  }
}

.control-btn {
  height: 32px;
  width: 32px;
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  &_bg {
    background-color: #FFFFFF59;
  }

  &:hover {
    background-color: #fff;
  }
}

.icon-close_big {
  margin-top: 2px;

  &:before {
    color: #1D2127;
    font-size: 25px;
  }
}

.icon-short {
  &_left,
  &_right {
    &:before {
      color: #1D2127;
      font-size: 25px;
    }
  }
}
</style>
