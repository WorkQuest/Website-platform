<template>
  <ctm-modal-box
    class="addLiquidity"
    :title="$t('modals.confirmDetails')"
  >
    <div class="ctm-modal__content">
      <div class="ctm-modal__gray-zone">
        <div
          v-for="(item, i) in abouts"
          :key="i"
        >
          <div class="ctm-modal__title-head">
            {{ item.title }}
          </div>
          <div class="ctm-modal__subtitle">
            {{ item.subtitle }}
          </div>
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
            @click="openStatusModal()"
          >
            {{ $t('meta.submit') }}
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
  name: 'ModalConfirmDetails',
  data() {
    return {
      abouts: [
        {
          title: this.$t('modals.currency'),
          subtitle: 1 + this.$t('modals.eth'),
        },
        {
          title: this.$t('modals.loan'),
          subtitle: 1000 + this.$t('modals.wusd'),
        },
        {
          title: this.$t('modals.percentage'),
          subtitle: this.$tc('modals.percentsCount', 150),
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
        subTitle: '',
        path: this.options.needChangeModal ? '/crediting/1' : undefined,
      });
    },
  },
};
</script>

<style lang="scss" scoped>

.ctm-modal {
  @include modalKit;

  .addLiquidity {
    max-width: 490px !important;
  }

  &__gray-zone {
    background-color: #F7F8FA;
    border-radius: 5px;
    margin-top: 15px;
    padding: 20px;
    display: grid;
    gap: 20px;
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

  &__content {
    padding-top: 0 !important;
  }

  &__title-head {
    font-size: 16px;
    font-weight: 400;
  }

  &__subtitle {
    color: #7C838D;
    font-weight: 500;
    font-size: 14px;
  }
}
</style>
