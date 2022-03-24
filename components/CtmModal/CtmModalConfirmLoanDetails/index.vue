<template>
  <ctm-modal-box
    class="details"
    :title="$t('modals.titles.confirmDetails')"
  >
    <div class="details__content content">
      <div class="content__field">
        <div
          v-for="(item, i) in abouts"
          :key="i"
          class="content__body"
        >
          <div class="content__title">
            {{ item.title }}
          </div>
          <div class="content__subtitle">
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
  name: 'ModalConfirmLoanDetails',
  data() {
    return {
      abouts: [
        {
          title: this.$t('modals.currencyDetails'),
          subtitle: this.$t('meta.coins.eth'),
        },
        {
          title: this.$t('modals.titles.loan'),
          subtitle: this.$tc('meta.coins.count.ETHCount', 1),
        },
        {
          title: this.$t('modals.percentage'),
          subtitle: this.$tc('meta.units.percentsCount', 150),
        },
        {
          title: this.$t('modals.loanTerm'),
          subtitle: 122,
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
        title: this.$t('modals.loanIsOpened'),
        subtitle: '',
        path: this.options.needChangeModal ? '/crediting/2' : undefined,
      });
    },
  },
};
</script>

<style lang="scss" scoped>

.details {
  max-width: 490px !important;

  &__content {
    padding: 0 28px 30px 28px !important;
  }
}
.content{
  &__field {
    background-color: #F7F8FA;
    border-radius: 5px;
    margin-top: 20px;
    padding: 20px;
    display: grid;
    gap: 20px;
  }

  &__title {
    font-size: 16px;
    font-weight: 400;
  }

  &__subtitle {
    color: #7C838D;
    font-weight: 500;
    font-size: 14px;
  }
  &__buttons{
    display: grid;
    grid-template-columns: repeat(2, calc(50% - 10px));
    grid-gap: 20px;
    gap: 20px;
    margin-top: 25px;
  }
}

</style>
