<template>
  <ctm-modal-box
    class="pension"
    :title="$t('pension.applyForAPension')"
  >
    <div class="pension__content content">
      <div class="content__percent">
        <div class="content__title">
          {{ $t('modals.depositPercentFromAQuest') }}
        </div>
        <base-field
          v-model="depositPercentFromAQuest"
          :is-hide-error="true"
          :placeholder="$tc('modals.percentsCount', 13)"
          class="content__input"
        />
      </div>
      <div class="content__amount">
        <div class="content__title">
          {{ $t('modals.firstDepositAmount') }}
        </div>
        <base-field
          v-model="firstDepositAmount"
          :is-hide-error="true"
          :placeholder="$tc('pension.wusdCount', 130)"
          class="content__input"
        />
        <div class="content__text">
          {{ $t('modals.firstDepositText') }}
        </div>
      </div>
      <div class="content__buttons buttons">
        <base-btn
          class="buttons__button"
          mode="outline"
          @click="hide()"
        >
          {{ $t('meta.cancel') }}
        </base-btn>
        <base-btn
          class="buttons__button"
          @click="showPensionIsRegisteredModal()"
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
  &__content {
    max-width: 495px !important;
  }
}

.content{
  padding: 0 28px 30px 28px!important;
  &__percent{
    margin-top: 25px;
  }
  &__amount{
    margin-top: 15px;
  }
  &__text {
    color: #7C838D;
    font-weight: 400;
    font-size: 14px;
    margin-top: 15px;
  }
  &__buttons{
    display: grid;
    grid-template-columns: repeat(2, calc(50% - 10px));
    grid-gap: 20px;
    gap: 20px;
    margin-top: 25px;
  }
  &__title{
    margin-bottom: 2px;
    font-size: 16px;
    line-height: 130%;
  }
}

</style>
