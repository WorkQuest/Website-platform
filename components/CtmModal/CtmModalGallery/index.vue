<template>
  <div class="ctm-modal">
    <div class="gallery-modal">
      <div class="gallery-modal__container">
        <div class="gallery-modal__pager">
          <img
            :src="getUrl"
            alt=""
            class="gallery-modal__image"
          >
          <div class="gallery-modal__close">
            <div
              class="control-btn control-btn_bg"
              @click="hide"
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
                {{ $tc('gallery.counter', currIndex >= 0 ? currIndex + 1 : options.index + 1) + options.files.length }}
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
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'CtmGallery',
  data() {
    return {
      currIndex: -1,
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
    }),
    getUrl() {
      const { options: { files, index }, currIndex } = this;
      console.log(index, currIndex);
      return files[currIndex >= 0 ? currIndex : index].url;
    },
  },
  methods: {
    turnOver(isForward) {
      const { options: { files, index }, currIndex } = this;
      const trackedIndex = currIndex >= 0 ? currIndex : index;
      const advanceIndex = isForward ? trackedIndex + 1 : trackedIndex - 1;

      // eslint-disable-next-line no-nested-ternary
      this.currIndex = advanceIndex + 1 > files.length ? 0 : advanceIndex < 0 ? files.length - 1 : advanceIndex;
    },
    hide() {
      this.CloseModal();
    },
  },
};
</script>

<style lang="scss" scoped>
.gallery-modal {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;

  &__container {
    max-width: 1180px;
  }

  &__pager {
    position: relative;
    box-shadow: 0 85px 147px rgba(10, 27, 61, 0.17), 0 47.1676px 61.4131px rgba(10, 27, 61, 0.078707), 0 26.7219px 32.8344px rgba(10, 27, 61, 0.0629546), 0 14.4955px 18.4067px rgba(10, 27, 61, 0.0598272), 0 6.96225px 9.77565px rgba(10, 27, 61, 0.0584222), 0 2.43911px 4.06787px rgba(10, 27, 61, 0.0492837);
    border-radius: 6px;
    min-width: 375px;
    min-height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #C4C4C4;
  }

  &__image {
    border-radius: 6px;
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
