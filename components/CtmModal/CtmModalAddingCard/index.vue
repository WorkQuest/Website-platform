<template>
  <ctm-modal-box
    class="card"
    :title="$tc('modals.titles.addingCard')"
  >
    <div class="card__content content">
      <ValidationObserver
        v-slot="{handleSubmit, validated, passed, invalid}"
        class="content__observer"
        tag="div"
      >
        <div class="content__input input">
          <div class="input__title">
            {{ $t('modals.numberCard') }}
          </div>
          <base-field
            v-model="cardNumber"
            class="input__field"
            placeholder="1234 1234 1234 1234"
            rules="required|numberOfCard"
            data-selector="CARD-NUMBER"
            :name="$tc('modals.creditCardNumber')"
          />
        </div>
        <div class="content__input input">
          <div class="input__title">
            {{ $t('modals.cardHolder') }}
          </div>
          <base-field
            v-model="cardHolder"
            class="input__field"
            placeholder="John Doe"
            data-selector="CARDHOLDER-NAME"
            rules="required|alpha_spaces"
            :name="$tc('modals.cardHolderField')"
          />
        </div>
        <div class="content__grid grid">
          <div class="grid__field">
            <div class="grid__title">
              {{ $t('modals.date') }}
            </div>
            <base-field
              v-model="dateInput"
              class="grid__input"
              placeholder="02/24"
              rules="required|date"
              data-selector="CARD-DATE"
              :name="$tc('modals.dateName')"
            />
          </div>
          <div class="grid__field">
            <div class="grid__title">
              {{ $t('modals.cvv') }}
            </div>
            <base-field
              v-model="cvvInput"
              class="grid__field"
              placeholder="242"
              data-selector="CARD-CVV"
              rules="required|cvv"
              :name="$tc('modals.cvv')"
            />
          </div>
        </div>
        <div class="content__buttons buttons">
          <base-btn
            mode="outline"
            data-selector="CANCEL"
            class="buttons__action"
            @click="CloseModal"
          >
            {{ $t('meta.btns.cancel') }}
          </base-btn>
          <base-btn
            class="buttons__action"
            data-selector="SHOW-MODAL-ADD"
            :disabled="!validated || !passed || invalid"
            @click="handleSubmit(showCardHasBeenAddedModal)"
          >
            {{ $t('meta.btns.add') }}
          </base-btn>
        </div>
      </ValidationObserver>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';
import modals from '~/store/modals/modals';

export default {
  name: 'ModalAddingCard',
  data() {
    return {
      cardNumber: '',
      cardHolder: '',
      dateInput: '',
      cvvInput: '',
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
    }),
  },
  methods: {
    showCardHasBeenAddedModal() {
      if (this.options.branch === 'payment') {
        this.ShowModal({
          key: modals.paymentOptions,
          step: 2,
          cardNumber: this.cardNumber.split(' ').join(''),
        });
      } else {
        this.ShowModal({
          key: modals.cardAdded,
          branch: this.options.branch,
          cardNumber: this.cardNumber.split(' ').join(''),
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>

.buttons {
  display: flex;
  justify-content: space-between;
  &__action{
    width: 212px!important;
  }
}
.card {
  max-width: 500px !important;
  padding: 0!important;
  &__content{
    padding: 20px 28px 30px 28px!important;
  }
}

.input{
  &__title{
    margin-bottom: 4px;
  }
}
.content{
  &__grid{
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    justify-content: space-between;
    align-items: flex-end;
    grid-gap: 10px;
  }
  &__buttons{
    margin-top: 10px;
  }
}
.grid{
  &__title{
    margin-bottom:4px;
  }
}

</style>
