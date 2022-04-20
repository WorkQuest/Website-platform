<template>
  <ctm-modal-box
    class="deposit"
    :title="$tc('modals.titles.deposit')"
  >
    <div class="deposit__content content">
      <validation-observer
        v-slot="{handleSubmit, validated, passed, invalid}"
        class="content__validator"
      >
        <div class="content__step">
          <div
            class="content__panel"
            @click="showGiveDeposit"
          >
            {{ $t('modals.walletAddress') }}
          </div>
          <div class="content__panel content__panel_active">
            {{ $t('meta.bankCard') }}
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
          >
            <template v-slot:card>
              <span class="icon-credit_card drop__card" />
            </template>
            <template
              v-slot:buttonCard
              class="drop__block"
            >
              <base-btn
                mode="add"
                selector="SHOW-ADDING-CARD"
                class="drop__button button"
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
        <div class="content__grid grid">
          <div class="grid__title">
            {{ $t('modals.amount') }}
          </div>
          <div class="grid__body">
            <base-field
              v-model="amount"
              placeholder="0 WUSD"
              class="grid__input"
              data-selector="AMOUNT"
              :name="$tc('modals.amountField')"
              rules="required|decimal"
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
            />
          </div>
          <div class="body__container">
            <div class="body__title">
              {{ $t('modals.processing') }}
            </div>
            <base-field
              v-model="time"
              data-selector="TIME"
              mode="white"
              class="body__input"
              :disabled="true"
            />
          </div>
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
            :disabled="invalid"
            data-selector="BUY-WUSD"
            @click="handleSubmit(showTransactionSendModal)"
          >
            {{ $t('meta.buyWUSD') }}
          </base-btn>
        </div>
      </validation-observer>
    </div>
  </ctm-modal-box>
</template>

<script>
import modals from '~/store/modals/modals';

export default {
  name: 'ModalDepositOptions',
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
    items() {
      return [
        'Visa *0000',
        'Visa *0000',
      ];
    },
  },
  methods: {
    showTransactionSendModal() {
      this.ShowModal({
        key: modals.withdrawInfo,
        title: this.$t('modals.info.depositInfo'),
      });
    },
    // TODO: Зарефакторить
    showGiveDeposit() {
      this.ShowModal({
        key: modals.giveDeposit,
      });
    },
    showAddingCard() {
      this.ShowModal({
        key: modals.addingCard,
      });
    },
  },
};
</script>

<style lang="scss" scoped>

.deposit {
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
    margin-top: 25px;
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
    margin: 5px 0 15px 0;
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
    margin-bottom: 4px;
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
    margin-bottom: 15px;
  }
  &__title{
    margin-bottom: 5px;
    @include text-simple;
    font-weight: 400;
    font-size: 16px;
    color: $black800;
  }
  &__equal {
    margin: 10px 10px 36px 10px;
  }
}
.body{
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  &__title{
    margin-bottom: 4px;
  }
}
.buttons {
  display: grid;
  grid-template-columns: repeat(2, calc(50% - 10px));
  grid-gap: 20px;
  gap: 20px;
  margin-top: 2px;
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
