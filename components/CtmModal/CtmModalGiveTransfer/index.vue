<template>
  <ctm-modal-box
    class="transfer"
    :title="$t('modals.transfer')"
  >
    <div class="transfer__content content">
      <validation-observer
        v-slot="{handleSubmit, invalid}"
      >
        <div
          class="content__container"
        >
          <div class="content__input input">
            <span class="input__title">
              {{ $t('modals.recepient') }}
            </span>
            <base-field
              v-model="recipient"
              class="input__field"
              :placeholder="'Enter address'"
              rules="required"
              :name="$t('modals.addressField')"
            />
          </div>
          <div class="content__input input">
            <span class="input__title">
              {{ $t('modals.amount') }}
            </span>
            <base-field
              v-model="amount"
              class="input__field"
              :placeholder="'Enter amount'"
              :rules="`required|decimal|max:${balance}`"
              :name="$t('modals.amountField')"
            >
              <template
                v-slot:right-absolute
                class="content__max max"
              >
                <base-btn
                  mode="max"
                  class="max__button"
                  @click="maxBalance"
                >
                  <span class="max__text">
                    {{ $t('modals.maximum') }}
                  </span>
                </base-btn>
              </template>
            </base-field>
          </div>
        </div>
        <div class="content__buttons buttons">
          <base-btn
            :mode="'outline'"
            class="buttons__action"
            @click="hide"
          >
            {{ $t('meta.cancel') }}
          </base-btn>
          <base-btn
            class="buttons__action"
            :disabled="invalid || isLoading"
            @click="handleSubmit(transfer)"
          >
            {{ $t('meta.send') }}
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
  name: 'ModalTakeTransfer',
  data() {
    return {
      recipient: '0xAc6dbbD2148A4A06D44080d2bB23743288B54C84', // TODO: remove to ''
      amount: '',
      step: 1,
      balance: 0,
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
      isLoading: 'main/getIsLoading',
    }),
  },
  mounted() {
    this.balance = this.options.balance || 0;
  },
  methods: {
    hide() {
      this.CloseModal();
    },
    maxBalance() {
      this.amount = this.balance;
    },
    async transfer() { // TODO: выводить инфу о транзакции перед ее отправкой
      this.SetLoader(true);
      const { callback } = this.options;
      this.hide();
      const res = await this.$store.dispatch('wallet/transfer', {
        recipient: this.recipient,
        value: this.amount,
      });
      if (res?.ok) {
        if (callback) {
          await callback();
        }
        this.ShowModal({
          key: modals.transactionSend,
        });
      }
      this.SetLoader(false);
    },
    showWithdrawInfo() {
      this.ShowModal({
        key: modals.withdrawInfo,
        title: this.$t('modals.transferInfo'),
        recipient: this.recipient,
        amount: this.amount,
      });
    },
  },
};
</script>

<style lang="scss" scoped>

.transfer{
  max-width: 500px !important;
  padding: 0!important;
  &__content{
    padding: 20px 28px 30px 28px!important;
  }
}
.buttons {
  display: flex;
  justify-content: space-between;
  &__action{
    width: 212px!important;
    &:not(:last-child) {
      margin-right: 10px;
    }
  }
}

.input{
  &__field{
    margin-top: 5px;
  }
}
.content{
  &__step {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
  }
  &__panel{
    @include text-simple;
    font-weight: 400;
    font-size: 16px;
    color: $black500;
    margin: 0 20px 0 0;
    cursor: pointer;
    &_active {
      color: $black800;
      border-bottom: 2px solid $blue;
      padding: 0 0 12px 0;
    }
  }
  &__card{
    margin: 40px auto;
  }
  &__text {
    font-size: 16px;
    line-height: 130%;
    color: #D8DFE3;
    text-align: center;
  }
}
.grid{
  &__title{
    margin: 15px 5px 0 0;
  }
}
.max{
  &__button{
    margin-right: 10px!important;
    background-color: transparent!important;
  }
}
</style>
