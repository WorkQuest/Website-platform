<template>
  <ctm-modal-box
    class="withdrawal"
    :title="$t('modals.transfer')"
  >
    <div class="withdrawal__content content">
      <div
        class="content__container"
      >
        <div class="content__input input">
          <span class="input__title">
            {{ $t('modals.recepient') }}
          </span>
          <base-field
            v-model="recepient"
            class="input__field"
            :placeholder="'Enter address'"
            is-hide-error
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
            is-hide-error
          >
            <template
              v-slot:right-absolute
              class="content__max max"
            >
              <base-btn
                mode="max"
                class="max__button"
              >
                <span class="max__text">{{ $t('modals.maximum') }}</span>
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
          @click="showWithdrawInfo"
        >
          {{ $t('meta.next') }}
        </base-btn>
      </div>
    </div>
  </ctm-modal-box>
</template>

<script>
import modals from '~/store/modals/modals';

export default {
  name: 'ModalTakeWithdrawal',
  data() {
    return {
      recepient: '',
      amount: '',
      step: 1,
    };
  },
  methods: {
    hide() {
      this.CloseModal();
    },
    showWithdrawInfo() {
      this.ShowModal({
        key: modals.withdrawInfo,
        title: this.$t('modals.transferInfo'),
        recepientAddress: 'Recepient address',
      });
    },
  },
};
</script>

<style lang="scss" scoped>

.withdrawal{
  max-width: 500px !important;
  padding: 0!important;
  &__content{
    padding: 10px 28px 30px 28px!important;
  }
}
.buttons {
  display: flex;
  justify-content: space-between;
  &__action{
    width: 212px!important;
  }
}

.input{
  &__field{
    margin-top: 5px;
  }
}
.content{
  &__input{
    margin-top: 15px;
  }
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
  &__buttons{
    margin-top: 25px;
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
  }
}
</style>
