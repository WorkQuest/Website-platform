<template>
  <ctm-modal-box
    class="addLiquidity"
    :title="$t('modals.deposit')"
  >
    <div class="ctm-modal__content">
      <div class="ctm-modal__grid-cont">
        <div>
          <div class="ctm-modal__content-field">
            <label
              for="amountOfETH_input"
              class="ctm-modal__label"
            >{{ $t('modals.howMuchEthWouldYouLikeToLock') }}</label>
            <div class="ctm-modal__subtitle">
              {{ $t('modals.smallTemp') }}
            </div>
            <base-field
              id="amountOfETH_input"
              :is-hide-error="true"
              class="input"
              :placeholder="'10 ETH'"
            />
          </div>
          <div class="ctm-modal__content-field">
            <label
              for="amountOfWUSD_input"
              class="ctm-modal__label"
            >{{ $t('modals.howMuchWusdWouldYouLikeToGenerate') }}</label>
            <div class="ctm-modal__subtitle">
              {{ $t('modals.smallTemp') }}
            </div>
            <base-field
              id="amountOfWUSD_input"
              :is-hide-error="true"
              class="input"
              :placeholder="'1000 WUSD'"
            />
            <div class="ctm-modal__title-head" />
            <div class="ctm-modal__subtitle">
              {{ $t('modals.tipAbout') }}
            </div>
          </div>
        </div>
        <div class="ctm-modal__gray-zone">
          <div
            v-for="(item, i) in abouts"
            :key="i"
          >
            <div class="ctm-modal__title-head">
              {{ item.title }}
            </div>
            <div class="ctm-modal__subtitle_small">
              {{ item.subtitle }}
            </div>
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
            @click="openConfirmDetailsModal()"
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
  name: 'ModalCreditingDeposit',
  data() {
    return {
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

.ctm-modal {
  @include modalKit;

  .addLiquidity {
    max-width: 945px !important;
  }
  &__content-field {
    margin: 15px 0 0 0;
  }

  &__gray-zone {
    background-color: #F7F8FA;
    border-radius: 5px;
    margin-top: 15px;
    padding: 0 20px 20px 20px;
  }

  &__grid-cont {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
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

  &__label {
    margin-bottom: 5px;
  }

  &__content {
    padding-top: 0 !important;
  }

  &__title-head {
    font-size: 16px;
    font-weight: 400;
    margin-top: 20px;
  }

  &__subtitle {
    color: #7C838D;
    font-weight: 400;
    font-size: 16px;

    &_small {
      color: #7C838D;
      font-weight: 500;
      font-size: 14px;
    }
  }
}

.input {
    margin-top: 10px;
}
</style>
