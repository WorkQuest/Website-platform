<template>
  <ctm-modal-box
    class="percent"
    :title="$t('modals.changePercent')"
  >
    <div class="percent__content content">
      <div class="content__text">
        {{ $t('modals.changePercentText') }}
      </div>
      <div class="content__field">
        <div class="content__title">
          {{ $t('modals.currentPercentTitle') }}
        </div>
        <base-field
          v-model="amount"
          :is-hide-error="true"
          :placeholder="$tc('modals.percentsCount', 15)"
          class="content__input"
        />
      </div>
      <div class="content__buttons buttons">
        <base-btn
          class="buttons__button"
          mode="outline"
          @click="hide"
        >
          {{ $t('meta.cancel') }}
        </base-btn>
        <base-btn
          class="buttons__button"
          @click="showPercentIsChanged"
        >
          {{ $t('meta.submit') }}
        </base-btn>
      </div>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';
import modals from '~/store/modals/modals';

export default {
  name: 'ModalApplyForAPension',
  data() {
    return {
      amount: '',
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
    showPercentIsChanged() {
      this.ShowModal({
        key: modals.status,
        img: require('~/assets/img/ui/success.svg'),
        title: this.$t('modals.percentIsChanged'),
        subtitle: this.$t('modals.percentIsChangedText'),
      });
    },
  },
};
</script>

<style lang="scss" scoped>

.percent {
  padding: 0!important;
  max-width: 487px !important;
  &__content {
    padding: 0 28px 30px 28px!important;
  }
}

.content{
  &__text{
    margin: 22px 0 15px 0;
    font-size: 16px;
    font-weight: 400;
    line-height: 21px;
    color: #4C5767;
  }
  &__title{
  margin-bottom: 4px;
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
