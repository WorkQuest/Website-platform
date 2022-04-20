<template>
  <ctm-modal-box
    class="views"
    :title="$tc('modals.titles.raiseViews')"
  >
    <div class="views__content content">
      <validation-observer v-slot="{handleSubmit, validated, passed, invalid}">
        <div class="content__field">
          <div class="field__subtitle">
            {{ $t('modals.priceOfAClick') }}
          </div>
          <base-field
            v-model="priceOfAClick"
            placeholder="0 WUSD"
            data-selector="PRICE-FOR-CLICK"
            class="field__input"
            mode="white"
            rules="required|decimal"
            :name="$tc('modals.priceOfAClickField')"
          />
          <div class="field__subtitle">
            {{ $t('modals.city') }}
          </div>
          <base-field
            v-model="city"
            placeholder="Moscow"
            data-selector="CITY"
            class="field__input"
            mode="white"
            rules="required|alpha_spaces"
            :name="$tc('modals.cityField')"
          />
          <div class="field__subtitle">
            {{ $t('modals.period') }}
          </div>
          <base-dd
            v-model="period"
            class="field__drop"
            :items="items"
            :placeholder="$t('meta.placeholders.default')"
          />
        </div>
        <div class="content__container container">
          <div class="container__title">
            {{ $t('modals.estimatedPayment') }}
          </div>
          <div class="container__cost">
            {{ $tc('meta.coins.count.WUSDCount', 120) }}
          </div>
        </div>
        <div class="content__buttons buttons">
          <base-btn
            class="buttons__action"
            data-selector="OK"
            :disabled="!validated || !passed || invalid || period===''"
            @click="handleSubmit(showTransactionSendModal)"
          >
            {{ $t('meta.btns.ok') }}
          </base-btn>
          <base-btn
            mode="outline"
            data-selector="CANCEL"
            class="buttons__action"
            @click="CloseModal"
          >
            {{ $t('meta.btns.cancel') }}
          </base-btn>
        </div>
      </validation-observer>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';
import modals from '~/store/modals/modals';

export default {
  name: 'ModalRaiseViews',
  data() {
    return {
      priceOfAClick: '',
      city: '',
      period: '',
      example: 'sdf',
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
    }),
    items() {
      return [
        'Day',
        'Week',
        'Month',
        'Year',
      ];
    },
  },
  methods: {
    showTransactionSendModal() {
      this.ShowModal({
        key: modals.transactionSend,
      });
    },
  },
};
</script>

<style lang="scss" scoped>

.views {
  max-width: 650px !important;
  &__content {
    padding: 20px 28px 30px;
  }
}
.content{
  &__container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    margin-top: 25px;
  }
  &__buttons{
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
    margin-top: 25px;
  }
}
.container {
  &__title {
    color: $black500;
    font-weight: 400;
    font-size: 16px;
  }
  &__cost {
    color: $blue;
    font-weight: 500;
    font-size: 16px;
    padding: 0 0 0 5px;
  }
}
.buttons{
  &__action{
    max-width: 271px!important;
  }
}
.field{
  &__subtitle{
    margin-bottom: 4px;
  }
  &__placeholder{
    color: $black300;
    font-size: 16px;
    line-height: 130%;
    margin-right: auto;
  }
  &__drop{
    border: 1px solid $black0;
    border-radius: 6px;
    color: $black800!important;
  }
}
</style>
