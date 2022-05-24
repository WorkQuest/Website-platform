<template>
  <ctm-modal-box
    class="deposit"
    :title="$tc('modals.titles.openADeposit')"
  >
    <validation-observer
      v-slot="{handleSubmit, validated, passed, invalid}"
      class="deposit__content content"
      tag="div"
    >
      <div class="content__field">
        <label
          for="deposit__input"
          class="content__label"
        >{{ $t("modals.lockedSavings") }}
        </label>
        <base-field
          id="deposit__input"
          v-model="saving"
          data-selector="LOCKED-SAVINGS"
          placeholder="3 500"
          class="content__input"
          rules="required|decimal"
          :name="$tc('modals.lockedSavingsField')"
        />
      </div>
      <div class="content__field">
        <label
          for="amount__input"
          class="content__label"
        >{{ $t("modals.durationDays") }}
        </label>
        <base-field
          id="amount__input"
          v-model="duration"
          placeholder="180"
          data-selector="DURATION-DAYS"
          class="content__input"
          rules="required|numeric"
          :name="$tc('modals.durationDaysField')"
        />
      </div>
      <div class="content__buttons buttons">
        <base-btn
          class="buttons__button"
          mode="outline"
          data-selector="CANCEL"
          @click="CloseModal"
        >
          {{ $t('meta.btns.cancel') }}
        </base-btn>
        <base-btn
          class="buttons__button"
          data-selector="SUBMIT"
          :disabled="!validated || !passed || invalid"
          @click="handleSubmit(showDepositIsOpenedModal)"
        >
          {{ $t('meta.btns.submit') }}
        </base-btn>
      </div>
    </validation-observer>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';
import modals from '~/store/modals/modals';

export default {
  name: 'ModalOpenADeposit',
  data() {
    return {
      duration: '',
      saving: '',
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
    }),
  },
  methods: {
    showDepositIsOpenedModal() {
      const receiptData = [
        {
          title: this.$t('modals.currencyDetails'),
          subtitle: this.$t('meta.coins.eth'),
        },
        {
          title: this.$t('modals.depositing'),
          subtitle: this.$tc('meta.coins.count.ETHCount', 1),
        },
        {
          title: this.$t('modals.generatingDetails'),
          subtitle: this.$tc('meta.coins.count.WUSDCount', 1000),
        },
      ];
      this.ShowModal({
        key: modals.confirmDetails,
        receiptData,
      });
    },
  },
};
</script>

<style lang="scss" scoped>

.deposit {
  max-width: 487px !important;
  &__content {
    padding: 20px 28px 30px 28px!important;
  }
}
.content{
  &__label{
  margin: 2px 0 4px 0!important;
  }
  &__buttons{
    display: grid;
    grid-template-columns: repeat(2, calc(50% - 10px));
    grid-gap: 20px;
    gap: 20px;
    margin-top: 2px;
  }
}
</style>
