<template>
  <ctm-modal-box
    class="confirm"
    :title="$t('modals.confirmDetails')"
  >
    <div class="confirm__content content">
      <div class="content__field field">
        <div
          v-for="(item, i) in abouts"
          :key="i"
          class="field__body"
        >
          <div class="field__title">
            {{ item.title }}
          </div>
          <div class="field__subtitle">
            {{ item.subtitle }}
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
          {{ $t('meta.btns.cancel') }}
        </base-btn>
        <base-btn
          class="buttons__button"
          selector="SUBMIT"
          @click="openStatusModal"
        >
          {{ $t('meta.btns.submit') }}
        </base-btn>
      </div>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';
import modals from '~/store/modals/modals';

export default {
  name: 'ModalConfirmDetails',
  data() {
    return {
      abouts: [
        {
          title: this.$t('modals.currencyDetails'),
          subtitle: this.$t('meta.coins.eth'),
        },
        {
          title: this.$t('modals.depositing'),
          subtitle: this.$tc('meta.coins.count.ETHCount', 1),
        },
        {
          title: this.$t('modals.generatingDetails'),
          subtitle: this.$tc('meta.coins.count.WUSDCount', 1000),
        },
        {
          title: this.$t('modals.collateralizationRatio'),
          subtitle: this.$tc('meta.units.percentsCount', 0),
        },
        {
          title: this.$t('modals.liquidationRatio'),
          subtitle: this.$tc('meta.units.percentsCount', 150),
        },
        {
          title: this.$t('modals.liquidationPrice'),
          subtitle: 122,
        },
        {
          title: this.$t('modals.liquidationFee'),
          subtitle: 10,
        },
        {
          title: this.$t('modals.stabilityFee'),
          subtitle: this.$tc('meta.units.percentsCount', 5.85),
        },
      ],
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
    openStatusModal() {
      this.ShowModal({
        key: modals.status,
        img: require('~/assets/img/ui/transactionSend.svg'),
        title: this.$t('modals.depositIsOpened'),
        subtitle: '',
        path: this.options.needChangeModal ? '/crediting/1' : undefined,
      });
    },
  },
};
</script>

<style lang="scss" scoped>

.confirm {
  max-width: 490px !important;
  height: auto;
  &__content {
    padding: 22px 28px 30px 28px!important;
  }
}
.content{
  &__field {
    background-color: $black0;
    border-radius: 5px;
    padding: 20px;
    display: grid;
    gap: 20px;
  }
  &__buttons{
    display: grid;
    grid-template-columns: repeat(2, calc(50% - 10px));
    grid-gap: 20px;
    gap: 20px;
    margin-top: 25px;
  }
}
.field{
  &__title{
    font-size: 16px;
    font-weight: 400;
    color: #353C47;
  }
  &__subtitle {
    color: $black500;
    font-weight: 500;
    font-size: 14px;
  }
}
</style>
