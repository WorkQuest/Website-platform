<template>
  <ctm-modal-box
    class="modal"
    :is-header="false"
    :title="$t('modals.addCard')"
  >
    <div class="modal__header">
      <div class="header__title">
        {{ $t('modals.welcomeToWorkQuest') }}
      </div>
      <div class="header__subtitle">
        {{ $t('modals.pleaseTellUsAboutSkills') }}
      </div>
    </div>
    <div class="btn__grid">
      <base-dd
        :type="'gray'"
        :items="items"
      />
      <base-btn :mode="'grey'">
        <span class="icon-plus" />
      </base-btn>
    </div>
    <div class="btn__container">
      <div class="btn__wrapper">
        <base-btn
          class="message__action"
          @click="hide()"
        >
          {{ $t('meta.confirm') }}
        </base-btn>
      </div>
      <div class="btn__wrapper">
        <base-btn
          :mode="'outline'"
          class="message__action"
          @click="hide()"
        >
          {{ $t('meta.remindLater') }}
        </base-btn>
      </div>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';
import modals from '~/store/modals/modals';

export default {
  name: 'ModalWelcome',
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
    }),
    items() {
      return [
        this.$t('modals.paintingWork'),
        this.$t('modals.art'),
        this.$t('modals.cooking'),
        this.$t('modals.coding'),
      ];
    },
  },
  methods: {
    hide() {
      this.CloseModal();
    },
  },
};
</script>

<style lang="scss" scoped>

.icon {
  &-plus:before {
    content: "\e9a8";
    font-size: 20px;
    color: $blue;
  }
}

.ctm-modal {
  @include modalKit;
}

.btn {
  &__grid {
    display: grid;
    grid-template-columns: 10fr 2fr;
    margin: 20px;
    grid-gap: 10px;
  }
  &__container {
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
    margin: 15px 10px 0 10px;
  }
  &__wrapper {
    width: 45%;
  }
}

.header {
  &__title {
    @include text-simple;
    font-weight: 700;
    font-size: 23px;
    color: $white;
    padding: 20px 0 10px 20px;
    width: 200px;
  }
  &__subtitle {
    @include text-simple;
    font-weight: 400;
    font-size: 16px;
    color: $white;
    padding: 0 0 20px 20px;
  }
}

.modal {
  overflow: visible;
  max-width: 413px !important;
  height: 320px;
  &__header {
    height: 180px;
    width: 100%;
    background: linear-gradient(135deg, #0083C7 0%, #00AA5B 100%);
  }
  &__content {
   display: grid;
   grid-template-columns: 1fr;
   justify-items: center;
   grid-gap: 20px;
 }
}
</style>
