<template>
  <!--  TODO: Добавить загрузчик картинок-->
  <ctm-modal-box
    class="dispute"
    :title="$t('modals.openADispute')"
  >
    <div class="dispute__content content">
      <div class="content__subtitle">
        {{ $t('modals.reason') }}
      </div>
      <base-dd
        v-model="drop"
        type="gray"
        :items="items"
        class="content__drop"
        :placeholder="$t('modals.chooseTheme')"
      />
      <div class="content__subtitle">
        {{ $t('modals.description') }}
      </div>
      <base-textarea
        v-model="description"
        :placeholder="$t('modals.description')"
        is-hide-error
        rules="required|text-desc"
      />
      <div class="content__buttons buttons">
        <base-btn
          class="buttons__button"
          :disabled="drop === ''"
          @click="createDipute()"
        >
          {{ $t('meta.send') }}
        </base-btn>
        <base-btn
          mode="outline"
          class="buttons__button"
          @click="hide"
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
      description: '',
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
    }),
    items() {
      return [
        this.$t('modals.disputes.thereIsNoResponseFromTheEmployerOrEmployee'),
        this.$t('modals.disputes.badlyDoneWork'),
        this.$t('modals.disputes.additionalRequirementsHaveBeenPutForward'),
        this.$t('modals.disputes.inconsistenciesInTheRequirementsForTheDescriptionOfTheQuest'),
        this.$t('modals.disputes.theQuestIsCompletedButTheEmployeeOrEmployerHasNotConfirmedItsCompletion'),
        this.$t('modals.disputes.anotherReason'),
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
    createDipute() {
      const title = this.items[this.drop].toString();
      const payload = {
        title,
        description: this.description,
        medias: [],
      };
      try {
        this.$store.dispatch('disputes/createDiscussion', payload);
        this.hide();
        this.showRequestSendModal();
      } catch (e) {
        console.log(e);
        this.hide();
      }
    },
  },
};
</script>

<style lang="scss">
.dd__title {
  text-align: left;
}
</style>

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
