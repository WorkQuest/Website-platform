<template>
  <ctm-modal-box
    class="deposit"
    :title="$t('crediting.deposit')"
  >
    <div class="deposit__content content">
      <validation-observer
        v-slot="{handleSubmit, validated, passed, invalid}"
        tag="div"
      >
        <div class="content__grid">
          <div class="content__body">
            <div
              v-if="userRole==='employer'"
              class="content__checkpoints checkpoints"
            >
              <label
                for="checkpoints__main"
                class="checkpoints__label"
              >
                {{ $t('modals.chooseTheCurrency') }}
              </label>
              <div
                id="checkpoints__main"
                class="checkpoints__main"
              >
                <div
                  v-for="(item, i) in checkpoints"
                  :key="i"
                  class="checkpoints__array"
                >
                  <input
                    :id="item.name"
                    v-model="selCurrencyID"
                    type="radio"
                    class="checkpoints__item"
                    :value="item.id"
                  >
                  <label
                    class="checkpoints__name"
                    :for="item.name"
                  >
                    {{ item.name }}
                  </label>
                </div>
              </div>
            </div>
            <div class="content__field">
              <div class="content__label">
                {{ $t('modals.howMuchEthWouldYouLikeToLock') }}
              </div>
              <base-field
                v-model="quantity"
                class="content__input"
                :placeholder="'1000 ETH'"
                rules="required|decimal"
                :name="$t('modals.quantityField')"
              />
            </div>
            <div class="content__field">
              <div class="content__label">
                {{ $t('modals.howMuchWusdWouldYouLikeToGenerate') }}
              </div>
              <base-field
                id="amountOfPercents_input"
                v-model="generate"
                class="content__input"
                :placeholder="'10 ETH'"
                rules="required|decimal"
                :name="$t('modals.generateField')"
              />
            </div>
            <div class="content__field">
              <div class="content__text">
                {{ $t('modals.tipAbout') }}
              </div>
            </div>
          </div>
          <div class="content__zone zone">
            <div
              v-for="(item, i) in abouts"
              :key="i"
            >
              <div class="zone__title">
                {{ item.title }}
              </div>
              <div class="zone__subtitle">
                {{ item.subtitle }}
              </div>
            </div>
          </div>
        </div>
        <div class="content__buttons buttons">
          <base-btn
            class="buttons__button"
            mode="outline"
            selector="CANCEL"
            @click="hide"
          >
            {{ $t('meta.cancel') }}
          </base-btn>
          <base-btn
            class="buttons__button"
            selector="SUBMIT"
            :disabled="!validated || !passed || invalid"
            @click="handleSubmit(openConfirmDetailsModal)"
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
  name: 'ModalTakeCreditingDeposit',
  data() {
    return {
      selCurrencyID: 1,
      quantity: '',
      generate: '',
      checkpoints: [
        {
          name: this.$t('modals.bnb'),
          id: 1,
        },
        {
          name: this.$t('modals.eth'),
          id: 2,
        },
        {
          name: this.$t('modals.wqt'),
          id: 3,
        },
      ],
      abouts: [
        {
          title: this.$t('modals.collateralization'),
          subtitle: this.$tc('modals.percentsCount', 0),
        },
        {
          title: this.$t('modals.liquidationPrice'),
          subtitle: this.$tc('modals.percentsCount', 0),
        },
        {
          title: this.$t('modals.currentPrice'),
          subtitle: this.$tc('modals.percentsCount', 0),
        },
        {
          title: this.$t('modals.stabilityFee'),
          subtitle: this.$tc('modals.percentsCount', 0),
        },
        {
          title: this.$t('modals.liquidationRatio'),
          subtitle: this.$tc('modals.percentsCount', 0),
        },
        {
          title: this.$t('modals.liquidationPenalty'),
          subtitle: this.$tc('modals.percentsCount', 0),
        },
      ],
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
      userRole: 'user/getUserRole',
    }),
  },
  methods: {
    hide() {
      this.CloseModal();
    },
    openConfirmDetailsModal() {
      this.ShowModal({
        key: modals.confirmDetails,
        needChangeModal: this.options.needChangeModal || undefined,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.deposit {
  max-width: 943px !important;
  height: auto !important;
  padding: 0!important;
  &__content{
    padding: 20px 28px 30px 28px;
  }
}
.buttons{
  display: grid;
  grid-template-columns: repeat(2, calc(50% - 10px));
  grid-gap: 20px;
  gap: 20px;
  margin-top: 25px;
}
.content{
  &__body{
  }
  &__field{
    margin-top: 3px;
    font-weight: 500;
  }
  &__label {
    margin-bottom: 13px;
  }
  &__text {
    color: $black500;
    font-size: 14px;
    margin: 3px 0 15px 0;
    line-height: 130%;
    font-weight: 400;
  }
  &__grid{
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 25px;
  }
  &__checkpoints {
    margin-bottom: 25px;
    &_label {
      margin-bottom: 10px;
    }
  }
  &__zone {
    background-color: #F7F8FA;
    border-radius: 5px;
    margin-top: 15px;
    padding: 0 20px 20px 20px;
    height: fit-content;
  }
}
.checkpoints{
  &__label {
    margin-bottom: 15px;
    font-weight: 500;
    font-size: 16px;
    line-height: 130%;
  }
  &__main{
    display: grid;
    grid-template-rows: repeat(3, 1fr);
    text-align: left;
    justify-content: flex-start;
    gap: 13px;
  }
  &__array {
    display: grid;
    grid-template-columns: repeat(2, auto);
    gap: 10px;
    > label {
      margin: unset;
    }
  }
  &__item{
    font-size: 16px;
    font-weight: 400;
    border-radius: 50%;
    width: 25px;
    height: 25px;
    border: 1px solid #0083C7;
    cursor: pointer;
  }
}
.zone{
  &__title {
    font-size: 16px;
    font-weight: 400;
    margin-top: 20px;
  }
  &__subtitle {
    color: #7C838D;
    font-weight: 500;
    font-size: 14px;
  }
}

@include _575 {
  .content {
    &__grid {
      grid-template-columns: 1fr;
    }
    &__label {
      margin-bottom: 5px;
    }
  }
}

</style>
