<template>
  <ctm-modal-box
    class="pension"
    :title="$t('pension.applyForAPension')"
  >
    <div class="pension__content content">
      <validation-observer
        v-slot="{handleSubmit, validated, passed, invalid}"
      >
        <div class="content__percent">
          <div class="content__title">
            {{ $t('modals.depositPercentFromAQuest') }}
          </div>
          <base-field
            v-model="depositPercentFromAQuest"
            :placeholder="$tc('modals.percentsCount', 13)"
            class="content__input"
            :name="$t('modals.depositPercent')"
            rules="required|numeric"
          />
        </div>
        <div class="content__amount">
          <div class="content__title">
            {{ $t('modals.firstDepositAmount') }}
          </div>
          <base-field
            v-model="firstDepositAmount"
            :placeholder="$tc('pension.wusdCount', 130)"
            class="content__input"
            :name="$t('modals.firstDepositAmountField')"
            rules="required|numeric"
          />
          <div class="content__text">
            {{ $t('modals.firstDepositText') }}
          </div>
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
            :disabled="!validated || !passed || invalid"
            @click="handleSubmit(showPensionIsRegisteredModal)"
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
  name: 'ModalApplyForAPension',
  data() {
    return {
      depositPercentFromAQuest: '',
      firstDepositAmount: '',
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
    showPensionIsRegisteredModal() {
      this.ShowModal({
        key: modals.status,
        img: require('~/assets/img/ui/document.svg'),
        title: this.$t('modals.pensionIsRegistered'),
        subtitle: this.$t('modals.pensionIsRegisteredText'),
        path: '/pension/1',
      });
    },
  },
};
</script>

<style lang="scss" scoped>

.pension{
  max-width: 487px !important;
  &__content {
    padding: 22px 28px 30px 28px!important;
  }
}
.content{
  &__text {
    color: $black500;
    font-weight: 400;
    font-size: 14px;
  }
  &__buttons{
    display: grid;
    grid-template-columns: repeat(2, calc(50% - 10px));
    grid-gap: 20px;
    gap: 20px;
    margin-top: 25px;
  }
  &__title{
    margin-bottom: 4px;
    font-size: 16px;
    line-height: 130%;
  }
}
</style>
