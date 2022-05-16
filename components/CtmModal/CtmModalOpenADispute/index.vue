<template>
  <ctm-modal-box
    class="dispute"
    :is-unclosable="true"
    :title="$tc('modals.titles.openADispute')"
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
        data-selector="REASON"
        :placeholder="$t('chat.reason')"
      />
      <div class="content__subtitle">
        {{ $t('modals.description') }}
      </div>
      <base-textarea
        v-model="description"
        :placeholder="$t('modals.description')"
        :error-text="$tc('modals.textLengthExceeded', 1000)"
        :is-hide-error="!isMoreCharacters"
        data-selector="DESCRIPTION"
        rules="required|text-desc"
      />
      <div class="content__buttons buttons">
        <base-btn
          class="buttons__button"
          :disabled="!drop || isMoreCharacters"
          data-selector="SHOW-REQUEST-SEND"
          @click="onSubmit"
        >
          {{ $t('meta.btns.send') }}
        </base-btn>
        <base-btn
          mode="outline"
          class="buttons__button"
          data-selector="CANCEL"
          @click="CloseModal"
        >
          {{ $t('meta.btns.cancel') }}
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
      questId: '',
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
    }),
    items() {
      return [
        this.$t('modals.disputes.NoAnswer'),
        this.$t('modals.disputes.PoorlyDoneJob'),
        this.$t('modals.disputes.AdditionalRequirement'),
        this.$t('modals.disputes.RequirementDoesNotMatch'),
        this.$t('modals.disputes.NoConfirmationOfComplete'),
        this.$t('modals.disputes.AnotherReason'),
      ];
    },
    itemsForPayload() {
      return [
        'NoAnswer',
        'PoorlyDoneJob',
        'AdditionalRequirement',
        'RequirementDoesNotMatch',
        'NoConfirmationOfComplete',
        'AnotherReason',
      ];
    },
    isMoreCharacters() {
      return this.description.length > 1000;
    },
  },
  mounted() {
    this.questId = this.options.questId;
  },
  beforeDestroy() {
    this.$cookies.set('disputeInfo', {
      questId: this.questId,
      reason: this.itemsForPayload[this.drop],
      problemDescription: this.description,
    });
  },
  methods: {
    async onSubmit() {
      const {
        callback,
        submitMethod,
      } = this.options;
      this.SetLoader(true);
      if (submitMethod) {
        const res = await submitMethod();
        if (res?.ok) {
          if (callback) await callback();
        }
      }
      this.SetLoader(false);
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
