<template>
  <div class="bankCard">
    <div class="grid__3col">
      <div class="ctm-modal__content-field">
        <base-field
          v-model="amountInput"
          placeholder="0 WUSD"
          data-selector="AMOUNT2"
          :label="$tc('modals.amount')"
          rules="min_value:0|numeric|required"
          name="Amount"
        />
      </div>
      <div class="ctm-modal__equal">
        =
      </div>
      <div class="ctm-modal__content-field">
        <div class="ctm-modal__fake-input">
          $ 0
        </div>
      </div>
    </div>
    <div class="ctm-modal__content-field">
      <base-field
        id="cardNumber_input"
        v-model="cardNumberInput"
        placeholder="0000 0000 0000 0000"
        data-selector="CARD-NUMBER"
        :label="$tc('modals.numberOfCard')"
        rules="required|numberOfCard"
        name="Card number"
      />
    </div>
    <div class="grid__2col">
      <div class="ctm-modal__content-field">
        <base-field
          v-model="dateInput"
          placeholder="02/24"
          data-selector="CARD-DATE"
          :label="$tc('modals.date')"
          rules="required"
          name="Date"
        />
      </div>
      <div class="ctm-modal__content-field">
        <base-field
          v-model="cvvInput"
          placeholder="242"
          data-selector="CARD-CVV"
          :label="$tc('modals.cvv')"
          rules="required|cvv"
          name="CVV"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BankDeposit',
  data() {
    return {
      amountInput: '',
      cardNumberInput: '',
      dateInput: '',
      cvvInput: '',
    };
  },
};
</script>

<style lang="scss" scoped>
.ctm-modal {
  &__content-field {
    margin: 15px 0 0 0;
  }
  &__equal {
    margin: 0 0 35px 10px;
  }
  &__fake-input {
    font: inherit;
    height: 46px;
    padding: 10px 20px;
    width: 100%;
    color: #B1B3B8;
    background: #FFFFFF;
    border-radius: 6px;
    border: 1px solid $black0;
    margin-bottom: 23px;
  }
}
.grid {
&__2col {
   display: grid;
   grid-template-columns: repeat(2, 1fr);
   justify-content: space-between;
   align-items: flex-end;
   grid-gap: 10px;
 }
&__3col {
   display: grid;
   grid-template-columns: 6fr 1fr 6fr;
   justify-content: space-between;
   align-items: flex-end;
 }
}
.input {
  &_white {
    border-radius: 6px;
    border: 1px solid $black0;
    padding: 11px 20px 11px 15px;
    height: 46px;
    width: 100%;
    background-color: $white;
    resize: none;
    &::placeholder {
      color: $black800;
    }
  }
}
</style>
