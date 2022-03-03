<template>
  <ctm-modal-box
    class="deposit"
    :title="$t('saving.openADeposit')"
  >
    <div class="deposit__content content">
      <validation-observer v-slot="{handleSubmit, validated, passed, invalid}">
        <div class="content__field">
          <label
            for="deposit__input"
            class="content__label"
          >{{ $t("modals.lockedSavings") }}
          </label>
          <base-field
            id="deposit__input"
            v-model="saving"
            :placeholder="'3 500'"
            class="content__input"
            rules="required|decimal"
            :name="$t('modals.lockedSavingsField')"
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
            :placeholder="'180'"
            class="content__input"
            rules="required|numeric"
            :name="$t('modals.durationDaysField')"
          />
        </div>
        <div class="content__buttons buttons">
          <base-btn
            class="buttons__button"
            mode="outline"
            selector="CANCEL"
            @click="hide"
          >
            {{ $t('meta.btns.cancel') }}
          </base-btn>
          <base-btn
            class="buttons__button"
            selector="SUBMIT"
            :disabled="!validated || !passed || invalid"
            @click="handleSubmit(showDepositIsOpenedModal)"
          >
            {{ $t('meta.btns.submit') }}
          </base-btn>
        </div>
      </validation-observer>
    </div>
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
    hide() {
      this.CloseModal();
    },
    showDepositIsOpenedModal() {
      this.ShowModal({
        key: modals.status,
        img: require('~/assets/img/ui/transactionSend.svg'),
        title: this.$t('modals.depositIsOpened'),
        subtitle: this.$t('meta.empty'),
        path: '/savings/1',
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
