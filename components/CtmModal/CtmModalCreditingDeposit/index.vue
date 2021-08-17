<template>
  <ctm-modal-box
    class="addLiquidity"
    :title="$t('crediting.deposit')"
  >
    <div class="ctm-modal__content">
      <div class="ctm-modal__grid-cont">
        <div>
          <div class="ctm-modal__checkpoints">
            <label
              for="checkpoints-cont"
              class="ctm-modal__label"
            >
              {{ $t('modals.chooseTheCurrency') }}
            </label>
            <div
              id="checkpoints-cont"
              class="checkpoints-cont"
            >
              <div
                v-for="(item, i) in checkpoints"
                :key="i"
                class="checkpoint-cont"
              >
                <input
                  :id="item.name"
                  v-model="selCurrencyID"
                  type="radio"
                  class="checkpoint"
                  :value="item.id"
                >
                <label
                  class=""
                  :for="item.name"
                >
                  {{ item.name }}
                </label>
              </div>
            </div>
          </div>
          <div class="ctm-modal__content-field">
            <base-field
              :is-hide-error="true"
              class="input"
              :placeholder="'0 ETH'"
              :label="$t('modals.howMuchEthWouldYouLikeToLock')"
              :tip="$t('modals.smallTemp')"
            />
          </div>
          <div class="ctm-modal__content-field">
            <base-field
              :is-hide-error="true"
              class="input"
              :placeholder="'0 WUSD'"
              :label="$t('modals.howMuchWusdWouldYouLikeToGenerate')"
              :tip="$t('modals.smallTemp')"
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
      selCurrencyID: 1,
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
    max-height: 80vh;
  }
  &__content-field,
  &__checkpoints{
    margin: 15px 0 0 0;
  }

  &__checkpoints {
    .ctm-modal__label {
      margin-bottom: 10px;
    }
  }

  .checkpoints-cont {
    display: grid;
    grid-template-rows: repeat(3, 1fr);
    text-align: left;
    justify-content: flex-start;
    gap: 15px;

    .checkpoint-cont {
      display: grid;
      grid-template-columns: repeat(2, auto);
      gap: 10px;

      >label {
        margin: unset;
      }

      .checkpoint {
        font-size: 16px;
        font-weight: 400;
        border-radius: 50%;
        width: 25px;
        height: 25px;
        border: 1px solid #0083C7;
        cursor: pointer;
      }
    }
  }

  &__gray-zone {
    background-color: #F7F8FA;
    border-radius: 5px;
    margin-top: 15px;
    padding: 0 20px 20px 20px;
    height: fit-content;
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

  @include _575 {
    .ctm-modal {
      &__grid-cont {
        grid-template-rows: repeat(2, auto);
        grid-template-columns: unset;
        overflow: auto;
        height: calc(80vh - 170px);
      }
      &__gray-zone {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
        margin: 0;
      }
    }
  }
}

.input {
    margin-top: 10px;
}
</style>
