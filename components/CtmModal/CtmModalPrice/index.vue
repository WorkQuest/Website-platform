<t<template>
  <ctm-modal-box
    class="price"
    :title="$t('modals.priceTitle')"
  >
    <div class="price__content content">
      <validation-observer
        v-slot="{handleSubmit, validated, passed, invalid}"
        class="content__observer"
        tag="div"
      >
        <div class="content__title">
          {{ $t('modals.enterPriceRange') }}
        </div>
        <div class="content__grid grid">
          <div class="grid__field">
            <div class="grid__title">
              {{ $t('modals.priceForm') }}
            </div>
            <base-field
              v-model="priceFrom"
              class="grid__input"
              :placeholder="$t('modals.priceFromAmount')"
              rules="required|decimal"
              :name="$t('modals.priceFieldFrom')"
            />
          </div>
          <div class="grid__field">
            <div class="grid__title">
              {{ $t('modals.priceTo') }}
            </div>
            <base-field
              v-model="priceTo"
              class="grid__field"
              :placeholder="$t('modals.priceToAmount')"
              rules="required|decimal"
              :name="$t('modals.priceFieldTo')"
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
            :disabled="!validated || !passed || invalid"
            @click="handleSubmit(hide)"
          >
            {{ $t('meta.submit') }}
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
    }),
  },
  methods: {
    hide() {
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
    margin-top: 30px;
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
  &__field{
    height: 100px;
  }
}

</style>
