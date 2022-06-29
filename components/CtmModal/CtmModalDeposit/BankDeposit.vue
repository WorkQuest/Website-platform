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

};
</script>

<style scoped>

</style>
