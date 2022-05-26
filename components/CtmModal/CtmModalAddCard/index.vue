<template>
  <ctm-modal-box
    class="messageSend"
    :title="$tc('modals.titles.cardAdd')"
  >
    <div class="ctm-modal__content">
      <validation-observer v-slot="{handleSubmit, validated, passed, invalid}">
        <div class="ctm-modal__content-field">
          <base-field
            v-model="cardNumberInput"
            placeholder="0000 0000 0000 0000"
            :label="$tc('modals.numberOfCard')"
            data-selector="CARD-NUMBER"
            rules="required|numberOfCard"
            name="Card number"
          />
        </div>
        <div class="ctm-modal__content-field">
          <base-field
            v-model="nameInput"
            placeholder="John Doe"
            :label="$tc('modals.cardholderName')"
            data-selector="CARDHOLDER-NAME"
            name="cardholder name"
            rules="required|alpha_spaces"
          />
        </div>
        <div class="grid__2col">
          <div class="ctm-modal__content-field">
            <base-field
              v-model="dateInput"
              placeholder="02/24"
              data-selector="CARD-DATE"
              :label="$tc('modals.expirationDate')"
              name="date"
              rules="required"
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
        <div class="btn__container">
          <div class="btn__wrapper">
            <base-btn
              class="message__action"
              data-selector="CONFIRM"
              :disabled="!validated || !passed || invalid"
              @click="handleSubmit(showCardHasBeenAddedModal)"
            >
              {{ $t('meta.btns.confirm') }}
            </base-btn>
          </div>
          <div class="btn__wrapper">
            <base-btn
              mode="outline"
              data-selector="CANCEL"
              class="message__action"
              @click="CloseModal"
            >
              {{ $t('meta.btns.cancel') }}
            </base-btn>
          </div>
        </div>
      </validation-observer>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';
import modals from '~/store/modals/modals';
import { images } from '~/utils/images';

export default {
  name: 'ModalAddCard',
  data() {
    return {
      cardNumberInput: '',
      nameInput: '',
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
      this.ShowModal({
        key: modals.status,
        img: images.CARD_ADDED,
        title: this.$t('modals.cardHasBeenAdded'),
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luctus venenatis, lectus magna fringilla urna, porttitor',
      });
    },
  },
};
</script>

<style lang="scss" scoped>

.ctm-modal {
  @include modalKit;
  &__content-field {
    margin: 15px 0 0 0;
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
}
.btn {
  &__container {
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
    margin: 15px 0 0 0;
  }
  &__wrapper {
    width: 45%;
  }
}

.messageSend {
  max-width: 495px !important;
  &__content {
    display: grid;
    grid-template-columns: 1fr;
    justify-items: center;
    grid-gap: 20px;
  }
  &__action {
    margin-top: 10px;
  }
}
</style>
