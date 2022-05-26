<template>
  <ctm-modal-box
    class="withdraw"
    :title="$tc('meta.withdrawal')"
  >
    <div class="withdraw__content content">
      <validation-observer v-slot="{handleSubmit, invalid}">
        <div class="content__step">
          <div
            class="content__panel"
            @click="showTakeWithdraw"
          >
            {{ $t('modals.walletAddress') }}
          </div>
          <div class="content__panel_active">
            {{ $t('meta.bankCard') }}
          </div>
        </div>
        <div class="content__grid grid">
          <div class="grid__title">
            {{ $t('modals.amount') }}
          </div>
          <div class="grid__body">
            <base-field
              v-model="amount"
              placeholder="0 WUSD"
              data-selector="AMOUNT"
              class="grid__input"
              rules="required|decimal"
              :name="$tc('modals.amountField')"
            />
            <div class="grid__equal">
              =
            </div>
            <div class="grid__field">
              <base-field
                v-model="dollars"
                data-selector="DOLLARS"
                mode="white"
                :disabled="true"
              />
            </div>
          </div>
        </div>
        <div class="content__body body">
          <div>
            <div class="body__title">
              {{ $t('modals.totalFee') }}
            </div>
            <base-field
              v-model="fee"
              data-selector="FEE"
              mode="white"
              class="body__input"
              :disabled="true"
              :is-hide-error="true"
            />
          </div>
        </div>
        <div class="content__drop drop">
          <div class="drop__title">
            {{ $t('modals.chooseCard') }}
          </div>
          <base-dd
            v-model="card"
            class="drop__field"
            :items="items"
            :placeholder="$t('modals.addNewCard')"
          >
            <template v-slot:card>
              <span class="icon-credit_card drop__card" />
            </template>
            <template
              v-slot:buttonCard
            >
              <base-btn
                mode="add"
                class="drop__button button"
                data-selector="SHOW-ADDING-CARD"
                @click="showAddingCard"
              >
                <span class="icon-plus_circle_outline button__icon" />
                <span class="button__text">
                  {{ $t('modals.addNewCard') }}
                </span>
              </base-btn>
            </template>
          </base-dd>
        </div>
        <div class="content__buttons buttons">
          <base-btn
            class="buttons__button"
            data-selector="CANCEL"
            mode="outline"
            @click="CloseModal"
          >
            {{ $t('meta.btns.cancel') }}
          </base-btn>
          <base-btn
            class="buttons__button"
            data-selector="SUBMIT"
            :disabled="invalid||items.length===0"
            @click="handleSubmit(showTransactionSendModal)"
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
  name: 'ModalWithdrawOptions',
  data() {
    return {
      card: 0,
      fee: '$ 0,15',
      dollars: '$ 0',
      time: '5 min',
      amount: '',
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
    }),
    items() {
      return ['Visa *0000', 'Visa *0000'];
    },
  },
  methods: {
    showTransactionSendModal() {
      this.ShowModal({
        key: modals.withdrawInfo,
        title: this.$t('modals.info.withdrawInfo'),
        cardNumber: this.options.cardNumber || '0000000000000000',
      });
    },
    // TODO: Зарефакторить!
    showTakeWithdraw() {
      this.ShowModal({ key: modals.takeWithdraw });
    },
    showAddingCard() {
      this.ShowModal({ key: modals.addingCard, branch: 'withdraw' });
    },
  },
};
</script>

<style lang="scss" scoped>

.withdraw {
  max-width: 500px !important;
  &__content {
    padding: 0 28px 30px 28px;
  }
}
.content {
  &__step {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    margin: 25px 0 15px 0;
  }

  &__panel {
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
      cursor: pointer;
    }
  }
  &__drop{
    margin: 15px 0 25px 0;
  }
}
.drop{
  &__field{
    border: 1px solid $black0;
    border-radius: 6px;
  }
  &__title{
    @include text-simple;
    font-weight: 400;
    font-size: 16px;
    color: $black800;
    margin-bottom: 2px;
  }
  &__card:before{
    font-size: 25px;
    color:$blue!important;
    margin-left: 17px;
  }
}
.grid {
  &__body{
    display: grid;
    grid-template-columns: 47% 6% 47%;
    justify-content: space-between;
    align-items: flex-start;
  }
  &__title{
    @include text-simple;
    font-weight: 400;
    font-size: 16px;
    color: $black800;
  }
  &__equal {
    margin: 10px 10px 30px 10px;
  }
}
.body{
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  &__title{
    @include text-simple;
    font-weight: 400;
    font-size: 16px;
    color: $black800;
    margin-bottom: 2px;
  }
}
.buttons {
  display: grid;
  grid-template-columns: repeat(2, calc(50% - 10px));
  grid-gap: 20px;
  gap: 20px;
}

.button{
  display: flex;
  justify-content: space-between;
  padding: 0 5px;
  &__icon::before{
    font-size: 25px;
    color:$blue!important;
    margin-right: 12px;
  }
}
.button:hover .button__icon:before{
  color: $white!important;
}
</style>
