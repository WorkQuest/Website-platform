<template>
  <ctm-modal-box
    class="quest"
    :is-header="false"
  >
    <div class="quest__content">
      <img
        src="~/assets/img/ui/questCreated.svg"
        alt="Quest created"
      >
      <div class="quest__title">
        {{ options.title }}
      </div>
      <base-btn
        class="quest__action"
        @click="hide"
      >
        {{ $t('meta.ok') }}
      </base-btn>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'ModalQuestCreated',
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
    }),
  },
  methods: {
    hide() {
      this.CloseModal();
    },
  },
};
</script>

<style lang="scss" scoped>

.quest {
  max-width: 307px !important;
  &__content {
    padding: 30px;
    display: grid;
    grid-template-columns: 1fr;
    justify-items: center;
    grid-gap: 30px;
  }
  &__title{
    font-weight: 500;
    font-size: 23px;
    line-height: 130%;
    text-align: center;
  }
}
</style>
