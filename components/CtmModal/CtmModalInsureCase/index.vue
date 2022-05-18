<template>
  <ctm-modal-box
    class="insure"
    :title="$tc('modals.titles.insureCase')"
  >
    <div class="insure__content content">
      <div class="content__user user">
        <img
          class="user__avatar"
          src="~/assets/img/temp/avatar-small.jpg"
          alt="user avatar"
        >
        <span class="user__name">
          Cody Fisher :
        </span>
        <span class="user__text">
          {{ $t('insuring.paymentOfInsurance') }}
        </span>
      </div>
      <div class="content__pictures">
        <img
          v-for="(pic, i) in pics"
          :key="i"
          class="content__picture picture"
          :src="pic"
          alt="picture"
        >
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
      </div>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'ModalInsureCase',
  data() {
    return {
      pics: [
        require('~/assets/img/ui/insure-case_1.svg'),
        require('~/assets/img/ui/insure-case_2.svg'),
        require('~/assets/img/ui/insure-case_3.svg'),
      ],
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
    }),
  },
};
</script>

<style lang="scss" scoped>

.insure {
  max-width: 537px !important;

  &__content {
    padding: 0 28px 30px 28px!important;
    display: grid;
    grid-template-columns: 1fr;
    justify-items: center;
    grid-gap: 25px;
  }
}
.content{
  &__user{
    display: flex;
    align-items: center;
    background-color: $black0;
    border-radius: 5px;
    height: 42px;
    width: 100%;
    margin-top: 25px;
  }
  &__text{
    text-align: left;
    font-size: 16px;
    font-weight: 400;
    line-height: 21px;
    color: $black500;
  }
  &__pictures{
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }
  &__buttons{
    width: 100%;
  }
}
.user{
  &__name{
    font-size: 16px;
    line-height: 130%;
    margin: 0 5px 0 15px;
  }
  &__text {
    weight: 400;
    font-size: 16px;
    color: $black500;

  }
  &__avatar{
    height: 25px;
    width:  25px;
    border-radius: 50%;
  }
}

</style>
