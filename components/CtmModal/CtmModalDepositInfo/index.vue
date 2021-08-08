<template>
  <ctm-modal-box
    class="info"
    :title="$t('modals.depositInfo')"
  >
    <div class="info__content content">
      <div class="content__field field">
        <div
          v-for="(item, i) in items"
          :key="i"
          class="field__item"
        >
          <div class="field__title">
            {{ item.title }}
          </div>
          <div class="field__subtitle">
            {{ item.subtitle }}
          </div>
        </div>
      </div>
      <div class="сontent__buttons buttons">
        <div class="buttons__group">
          <base-btn
            class="buttons__button"
            mode="outline"
            @click="hide()"
          >
            {{ $t('meta.cancel') }}
          </base-btn>
          <base-btn
            class="buttons__button"

            @click="showTransactionSend()"
          >
            {{ $t('meta.confirm') }}
          </base-btn>
        </div>
      </div>
    </div>
  </ctm-modal-box>
</template>

<script>
import modals from '~/store/modals/modals';

export default {
  name: 'ModalDepositInfo',
  data() {
    return {
      items: [
        {
          title: this.$t('modals.walletAddress'),
          subtitle: '83479B2E7809F7D7C0A9184EEDA74CCF122ABF3147CB4572BDEBD252F8E352A8',
        },
        {
          title: this.$t('modals.amount'),
          subtitle: '15 WUSD',
        },
        {
          title: this.$t('modals.totalFee'),
          subtitle: '$ 0,15',
        },
      ],
    };
  },

  methods: {
    hide() {
      this.CloseModal();
    },
    showTransactionSend() {
      this.ShowModal({
        key: modals.transactionSend,
      });
    },
  },
};
</script>

<style lang="scss" scoped>

.field{
  &__item{
    margin-bottom: 20px;
    &:last-child{
      margin-bottom: 0;
    }
  }
  &__title{
    font-size: 16px;
    line-height: 130%;
    color: $black800;
    margin-bottom: 5px;
  }
  &__subtitle{
    color: $black500;
    font-weight: 500;
    font-size: 14px;
  }
}

.content{
  padding: 0 28px 30px 28px!important;
  &__field{
    padding: 20px 20px 20px;
    background-color: #F7F8FA;
    border-radius: 5px;
    margin-top: 25px;
    margin-right: 13px;
  }
}
.buttons{
  &__group{
    display: grid;
    grid-template-columns: repeat(2, calc(50% - 10px));
    grid-gap: 20px;
    gap: 20px;
    margin-top: 25px;
  }
}
</style>
