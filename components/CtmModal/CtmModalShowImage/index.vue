<template>
  <ctm-modal-box
    class="ctm-modal"
    :is-header="false"
  >
    <div class="ctm-modal__content content">
      <div
        v-if="options.portfolio"
        class="content__btns"
      >
        <base-btn
          class="content portfolio__close"
          mode="portfolioClose"
          @click="showDeleteCaseModal(id)"
        >
          <span
            class="icon-close_big"
          />
        </base-btn>
        <base-btn
          class="content portfolio__edit"
          mode="portfolioEdit"
          @click="showEditCaseModal(id)"
        >
          <span
            class="icon-edit"
          />
        </base-btn>
      </div>
      <img
        class="content__img"
        :src="options.imageSrc"
        alt=""
      >
    </div>
    <div class="ctm-modal__desc desc">
      <div
        v-if="options.title"
        class="desc__title"
      >
        {{ options.title }}
      </div>
      <div
        v-if="options.desc"
        class="desc__desc"
      >
        {{ options.desc }}
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
    }),
  },
  methods: {
    hide() {
      this.CloseModal();
    },
    showDeleteCaseModal(id) {
      this.ShowModal({
        key: modals.deleteCase,
        id,
      });
    },
    showEditCaseModal(id) {
      this.ShowModal({
        key: modals.editCase,
        id,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.ctm-modal {
  @include modalKit;
  &__box {
    max-width: 80% !important;
    max-height: 100% !important;
    width: auto !important;
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
  overflow-y: auto;
  max-height: 800px;
  height: 100%;
  &__btns {
    position: absolute;
    left: 25px;
    top: -3px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 25px;
    width: 60px;
    border-radius: 6px;
    padding: 2px;
  }
  &__img {
    width: 100%;
    border-radius: 6px;
    object-fit: cover;
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

</style>
