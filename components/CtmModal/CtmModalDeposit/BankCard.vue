<template>
  <div class="cardBank">
    <img
      class="cCard"
      src="~assets/img/ui/creditCard.svg"
      alt="credit card"
    >
    <div class="btn-container">
      <base-btn
        mode="outline"
        data-selector="CANCEL"
        class="message__action"
        @click="CloseModal"
      >
        {{ $t('meta.btns.close') }}
      </base-btn>
      <base-btn
        data-selector="CONFIRM"
        @click="CloseModal"
      >
        {{ $t('meta.btns.close') }}
      </base-btn>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BankCard',
};
</script>

<style scoped>
.cardBank{
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.cCard{
  width: 125px;
  height: 110px;
  object-fit: cover;
}
.btn-container{
  width: 100%;
  margin-top: 25px;
  justify-self: flex-start;
  display: flex;
  gap:10px;
}
</style>
