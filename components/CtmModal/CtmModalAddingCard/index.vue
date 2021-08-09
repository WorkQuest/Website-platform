<template>
  <ctm-modal-box
    class="card"
    :title="$t('modals.addingCard')"
  >
    <div class="card__content content">
      <div class="content__input input">
        <span class="input__title">
          {{ $t('modals.numberCard') }}
        </span>
        <base-field
          v-model="cardNumberInput"
          class="input__field"
          :placeholder="'1234 1234 1234 1234'"
        />
      </div>
      <div class="content__input input">
        <span class="input__title">
          {{ $t('modals.cardHolder') }}
        </span>
        <base-field
          v-model="cardHolder"
          class="input__field"
          :placeholder="'AAAA AAAAAAAAA'"
        />
      </div>
      <div class="content__grid grid">
        <div class="grid__field">
          <span class="grid__title">
            {{ $t('modals.date') }}
          </span>
          <base-field
            v-model="dateInput"
            class="grid__input"
            :placeholder="'02/24'"
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
          />
        </div>
      </div>
      <div class="buttons">
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
    </div>
  </ctm-modal-box>
</template>

<script>
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
  methods: {
    hide() {
      this.CloseModal();
    },
    showCardHasBeenAddedModal() {
      this.ShowModal({
        key: modals.cardAdded,
      });
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
  max-height: 429px !important;
  padding: 0!important;
  &__content{
    padding: 22px 28px 30px 28px!important;
  }
}

.input{
  &__field{
    cursor: pointer;
  }
  &__title{
    margin: 22px 5px 0 0;
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
}
.grid{
  &__title{
    margin: 15px 5px 0 0;
  }
}

</style>
