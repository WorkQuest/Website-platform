<template>
  <div class="cardBank">
    <img
      class="cCard"
      src="~assets/img/ui/creditCard.svg"
      alt="credit card"
    >
    <p class="cardBank__text">
      {{ $t('modals.deposit.uHaveToAddCard') }}
    </p>
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
        :disabled="true"
        @click="showModal({key: 'addCard', branchText: 'adding' })"
      >
        {{ $t('modals.deposit.coming') }}
      </base-btn>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BankCard',
  props: {
    cardList: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style lang="scss" scoped>
.cardBank{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  &__text{
  align-self: flex-start;
    color:$black200;
   }
}
.cCard{
  width: 125px;
  height: 110px;
  object-fit: cover;
  margin: 30px 0;
}
.btn-container{
  width: 100%;
  margin-top: 25px;
  justify-self: flex-start;
  display: flex;
  gap:10px;
}
.cardList{

}
</style>
