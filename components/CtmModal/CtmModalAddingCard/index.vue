<template>
  <ctm-modal-box
    class="card"
    :title="$t('modals.addingCard')"
  >
    <div class="card__content content">
      <ValidationObserver
        v-slot="{ handleSubmit }"
        class="content__observer"
        tag="div"
      >
        <form
          class="restore__body"
          action=""
          @submit.prevent="handleSubmit(card)"
        >
          <div class="content__input input">
            <div class="input__title">
              {{ $t('modals.numberCard') }}
            </div>
            <base-field
              v-model="cardNumberInput"
              class="input__field"
              :placeholder="'1234 1234 1234 1234'"
              rules="required|CardNumber"
              :name="$t('modals.creditCardNumber')"
            />
          </div>
          <div class="content__input input">
            <div class="input__title">
              {{ $t('modals.cardHolder') }}
            </div>
            <base-field
              v-model="cardHolder"
              class="input__field"
              :placeholder="'AAAA AAAAAAAAA'"
              is-hide-error="true"
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
                :placeholder="'02/24'"
                is-hide-error="true"
              />
            </div>
            <div class="grid__field">
              <span class="grid__title">
                {{ $t('modals.cvv') }}
              </span>
              <base-field
                v-model="cvvInput"
                class="grid__field"
                placeholder="242"
                is-hide-error="true"
              />
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
              @click="showCardHasBeenAddedModal"
            >
              {{ $t('modals.add') }}
            </base-btn>
          </div>
        </form>
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
      cardNumberInput: '',
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
    hide() {
      this.CloseModal();
    },
    showCardHasBeenAddedModal() {
      if (this.options.branch === 'payment') {
        this.ShowModal({
          key: modals.paymentOptions,
          step: 2,
        });
      } else {
        this.ShowModal({
          key: modals.cardAdded,
          branch: this.options.branch,
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
    padding: 7px 28px 30px 28px!important;
  }
}

.input{
  &__field{
    cursor: pointer;
  }
  &__title{
    margin: 15px 0 4px 0;
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
    margin-top: 25px;
  }
}
.grid{
  &__title{
    margin: 15px 0 4px 0;
  }
}

</style>
