<template>
  <ctm-modal-box
    class="messageSend"
    :title="$t('pension.applyForRetirement')"
  >
    <div class="ctm-modal__content">
      <div class="ctm-modal__content-field">
        <base-field
          v-model="depositPercentFromAQuest"
          :is-hide-error="true"
          :label="$t('modals.depositRetirementModalTitle')"
          :placeholder="$t('modals.depositRetirementModalPrecentPlaceholder')"
        />
      </div>
      <div class="ctm-modal__content-field">
        <base-field
          v-model="firstDepositAmount"
          :is-hide-error="true"
          :placeholder="$t('modals.depositRetirementModalAmountPlaceholder')"
          :label="$t('modals.firstDepositAmount')"
        />
        <div class="ctm-modal__subtitle">
          {{ $t('modals.aboutFirstDeposit') }}
        </div>
      </div>
      <div class="ctm-modal__content-btns">
        <div class="btn-group">
          <base-btn
            class="btn"
            @click="hide()"
          >
            {{ $t('meta.cancel') }}
          </base-btn>
          <base-btn
            class="btn_bl"
            @click="showPensionIsRegisteredModal()"
          >
            {{ $t('meta.confirm') }}
          </base-btn>
        </div>
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
        title: this.$t('modals.pensionIsRegisteredTitle'),
        subtitle: this.$t('modals.pensionIsRegisteredDesc'),
        path: '/pension/1',
      });
    },
  },
};
</script>

<style lang="scss" scoped>

.ctm-modal {
  @include modalKit;
  &__content-field {
    margin: 15px 0 0 0;
  }

  &__content-btns {
    .btn-group{
      display: grid;
      grid-template-columns: repeat(2, calc(50% - 10px));
      grid-gap: 20px;
      gap: 20px;
      margin-top: 25px;

      .btn {
        box-sizing: border-box;
        font-weight: 400;
        font-size: 16px;
        color: #0083C7;
        border: 1px solid #0083C71A;
        border-radius: 6px;
        transition: .3s;
        background-color: #fff;

        &:hover {
          background-color: #0083C71A;
          border: 0px;
        }

        &_bl {
          @extend .btn;
          background-color: #0083C7;
          border: unset;
          color: #fff;

          &:hover {
            background-color: #103d7c;
          }
        }
      }
    }
  }

  &__label {
    margin-bottom: 5px;
  }

  &__content {
    padding-top: 0 !important;
  }

  &__subtitle {
    color: #7C838D;
    font-weight: 400;
    font-size: 14px;
    margin-top: 15px;
  }
}

.messageSend {
  max-width: 495px !important;
  &__content {
    display: grid;
    grid-template-columns: 1fr;
    justify-items: center;
    grid-gap: 20px;
  }
  &__action {
    margin-top: 10px;
  }
}
</style>
