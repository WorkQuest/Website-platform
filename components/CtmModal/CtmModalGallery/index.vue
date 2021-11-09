<template>
  <div class="ctm-modal">
    <div class="gallery-modal">
      <div class="gallery-modal__container">
        <div class="gallery-modal__pager">
          <img
            :src="options.url"
            alt=""
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'CtmGallery',
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
    }),
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
  }
}
</style>
