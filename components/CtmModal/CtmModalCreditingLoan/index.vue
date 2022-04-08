<template>
  <ctm-modal-box
    class="loan"
    :title="$t('modals.titles.loan')"
  >
    <div class="loan__content content">
      <validation-observer
        v-slot="{handleSubmit, validated, passed, invalid}"
      >
        <div class="content__body">
          <div class="content__field">
            <div class="content__label">
              {{ $t('modals.howMuchTokensWouldYouLikeToLock', { token:'WUSD' }) }}
            </div>
            <div class="content__text content__text_small">
              {{ $t('modals.smallDescriptionForLoan') }}
            </div>
            <base-field
              v-model="quantity"
              class="content__input"
              placeholder="10 WUSD"
              rules="required|decimal"
              data-selector="VALUE-FOR-LOAN"
              :name="$t('modals.quantityField')"
            >
              <template
                v-slot:right-absolute
                class="content__max max"
              >
                <base-btn
                  mode="max"
                  data-selector="MAX-BALANCE"
                  class="max__button"
                  @click="maxBalance()"
                >
                  <span class="max__text">{{ $t('modals.maximum') }}</span>
                </base-btn>
              </template>
            </base-field>
            <div class="content__text">
              {{ $t('modals.tipAbout') }}
            </div>
          </div>
        </div>
        <div class="content__buttons buttons">
          <base-btn
            class="buttons__button"
            mode="outline"
            data-selector="CANCEL"
            @click="hide"
          >
            {{ $t('meta.btns.cancel') }}
          </base-btn>
          <base-btn
            class="buttons__button"
            :disabled="!validated || !passed || invalid"
            data-selector="SUBMIT"
            @click="handleSubmit(openConfirmDetailsModal)"
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
import BigNumber from 'bignumber.js';
import modals from '~/store/modals/modals';

export default {
  name: 'ModalCreditingLoan',
  data() {
    return {
      selCurrencyID: 1,
      quantity: '',
      debt: '',
      percents: '',
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
      balanceData: 'wallet/getBalanceData',
    }),
  },
  async mounted() {
    await this.$store.dispatch('wallet/getBalance');
  },
  methods: {
    hide() {
      this.CloseModal();
    },
    async openConfirmDetailsModal() {
      this.SetLoader(true);
      const res = await this.$store.dispatch('crediting/sendMethod', {
        value: new BigNumber(this.quantity).shiftedBy(18).toString(),
        data: [],
        method: 'deposit',
        type: 'lending',
      });
      this.SetLoader(false);
      if (res.ok) {
        this.ShowModal({
          key: modals.status,
          img: require('~/assets/img/ui/transactionSend.svg'),
          title: this.$t('modals.loanIsOpened'),
          subtitle: '',
          path: 'crediting/1',
        });
        return;
      }
      this.ShowModal({
        key: modals.status,
        img: require('~/assets/img/ui/warning.svg'),
        title: this.$t('modals.transactionFail'),
      });
    },
    maxBalance() {
      this.quantity = this.balanceData.WUSD.fullBalance;
    },
  },
};
</script>

<style lang="scss" scoped>
.max {
  &__button {
    margin-right: 10px !important;
    background-color: transparent !important;
  }
}
.loan {
  max-width: 490px !important;
  height: auto !important;
  padding: 0!important;
  &__content{
    padding: 25px 28px 30px 28px;
  }
}
  .buttons{
    display: grid;
    grid-template-columns: repeat(2, calc(50% - 10px));
    grid-gap: 20px;
    gap: 20px;
    margin-top: 40px;
  }
.content{
  &__field{
    margin-top: 3px;
  }
  &__label {
    margin-bottom: 5px;
  }
  &__text {
    color: #7C838D;
    font-weight: 400;
    font-size: 14px;
    margin-top: 3px;
    &_small {
      margin-bottom:10px;
    }
  }
}
</style>
