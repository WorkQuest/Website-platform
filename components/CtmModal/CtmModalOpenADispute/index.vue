<template>
  <ctm-modal-box
    class="dispute"
    :title="$t('modals.openADispute')"
  >
    <div class="dispute__content content">
      <div class="content__subtitle">
        {{ $t('modals.reason') }}
      </div>
      <base-dd
        id="reason-dd"
        v-model="drop"
        type="gray"
        :items="items"
        class="content__drop"
      >
        <template
          v-if="drop===''"
          v-slot:choose
        >
          <span class="content__choose">
            {{ $t('modals.choose') }}
          </span>
        </template>
      </base-dd>
      <div class="content__buttons buttons">
        <base-btn
          class="buttons__button"
          @click="showRequestSendModal() "
        >
          {{ $t('meta.send') }}
        </base-btn>
        <base-btn
          :mode="'outline'"
          class="buttons__button"
          @click="hide()"
        >
          {{ $t('meta.cancel') }}
        </base-btn>
      </div>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';
import modals from '~/store/modals/modals';

export default {
  name: 'ModalOpenADispute',
  data() {
    return {
      drop: '',
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
    }),
    items() {
      return [
        this.$t('modals.badService'),
        this.$t('modals.otherReason'),
      ];
    },
  },
  methods: {
    hide() {
      this.CloseModal();
    },
    showRequestSendModal() {
      this.ShowModal({
        key: modals.status,
        img: require('~/assets/img/ui/dispute.svg'),
        title: this.$t('modals.requestSend'),
        subtitle: this.$t('modals.openDisputeText'),
      });
    },
  },
};
</script>

<style lang="scss" scoped>

.dispute{
  max-width: 382px!important;
  &__content{
  padding: 0 28px 30px 28px!important;
  }
}
.content{
  &__subtitle{
    font-size: 16px;
    line-height: 130%;
    margin: 25px 0 4px 0;
  }
  &__buttons{
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
    margin: 25px 0 0 0;
  }
  &__choose{
    color: #D8DFE3;
    font-size: 16px;
    line-height: 130%;
    margin-right: auto;
  }
}
.buttons{
  &__button {
    max-width: 153px!important;
  }
}

</style>
