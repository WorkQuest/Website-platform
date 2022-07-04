<template>
  <ctm-modal-box
    class="price"
    :title="options.title"
  >
    <div class="price__content content">
      <validation-observer
        v-slot="{handleSubmit, validated, passed, invalid}"
        class="content__observer"
        tag="form"
        @submit.prevent="submit"
      >
        <div class="content__title">
          {{ $t('modals.enterPriceRange') }}
        </div>
        <div class="content__grid grid">
          <div class="grid__field">
            <div class="grid__title">
              {{ $t('meta.fromBig') }}
            </div>
            <div class="input__container">
              <base-field
                v-model="priceFrom"
                class="grid__input"
                data-selector="PRICE-FROM"
                :placeholder="$tc('meta.coins.count.WUSDCount', 0)"
                rules="decimal|max_value:99999999999999|decimalPlaces:18"
                :name="$t('meta.fromBig')"
              />
              <span
                class="icon-off_outline_close input__clear"
                @click="priceFrom=null"
              />
            </div>
          </div>
          <div class="grid__field">
            <div class="grid__title">
              {{ $t('meta.toBig') }}
            </div>
            <div class="input__container">
              <base-field
                v-model="priceTo"
                class="grid__field"
                data-selector="PRICE-TO"
                :placeholder="$tc('meta.coins.count.WUSDCount', 10000)"
                :rules="`decimal${priceFrom ? '|min_value:'+priceFrom : ''}|max_value:99999999999999|decimalPlaces:18`"
                :name="$tc('meta.toBig')"
              />
              <span
                class="icon-off_outline_close input__clear"
                @click="priceTo=null"
              />
            </div>
          </div>
        </div>
        <div class="content__buttons buttons">
          <base-btn
            mode="outline"
            class="buttons__action"
            data-selector="CANCEL"
            @click="CloseModal"
          >
            {{ $t('meta.btns.cancel') }}
          </base-btn>
          <base-btn
            class="buttons__action"
            :disabled="invalid"
            data-selector="SUBMIT"
            @click="handleSubmit(submit)"
          >
            {{ $t('meta.btns.submit') }}
          </base-btn>
        </div>
      </validation-observer>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'ModalPrice',
  data() {
    return {
      priceFrom: '',
      priceTo: '',
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
      selectedPriceFilter: 'quests/getSelectedPriceFilter',
    }),
  },
  mounted() {
    if (this.selectedPriceFilter.from) this.priceFrom = this.selectedPriceFilter.from;
    if (this.selectedPriceFilter.to) this.priceTo = this.selectedPriceFilter.to;
  },
  methods: {
    submit() {
      if (this.priceFrom <= 0) this.priceFrom = '';
      if (this.priceTo <= 0) this.priceTo = '';
      this.$store.dispatch('quests/setSelectedPriceFilter', { from: this.priceFrom, to: this.priceTo });
      this.CloseModal();
    },
  },
};
</script>

<style lang="scss" scoped>

.buttons {
  display: flex;
  justify-content: space-between;
  &__action{
    max-width: 187px!important;
  }
}
.price {
  max-width: 440px !important;
  padding: 0!important;
  &__content{
    padding: 10px 28px 30px 28px!important;
  }
}
.input{
  &__title{
    margin-bottom: 4px;
  }
  &__container{
    position: relative;
    height: 46px;
  }
  &__clear {
    position: absolute;
    right: 12px;
    top: 0;
    height: 100%;
    padding: 6% 0;
    cursor: pointer;

    font-size: 26px;
    color: $blue !important;
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
    margin-top: 55px;
    pointer-events: auto;
  }
  &__title{
    color: $black600;
    font-size: 16px;
    line-height: 130%;
  }
}
.grid{
  &__title{
    margin:20px 0 4px;
  }
  &__input{
    height: 100px;
  }
}

@include _480 {
  .buttons {
    flex-direction: column;
    align-items: center;
    margin-top: 55px;
    justify-content: space-between;
    min-height: 100px;
  }

  .content {
    &__grid {
      display: block;
    }
  }

  .grid__field {
    &:nth-child(2) {
      margin-top: 40px;
    }
  }

  .input {
    &__clear {
      padding: 10px 0 0 0;
    }
  }
}
</style>
