<template>
  <ctm-modal-box
    class="addLiquidity"
    :title="$t('modals.addLiquidity')"
  >
    <div class="ctm-modal__content">
      <div class="ctm-modal__grid-cont">
        <div>
          <div class="ctm-modal__content-field">
            <label
              for="amountOfWusd_input"
              class="ctm-modal__label"
            >{{ $t('modals.amountOfWusd') }}</label>
            <base-field
              id="amountOfWusd_input"
              v-model="amount_input"
              :placeholder="'10 ETH'"
            />
          </div>
          <div class="ctm-modal__content-field">
            <label
              for="amountOfEth_input"
              class="ctm-modal__label"
            >{{ $t('modals.amountOfEth') }}</label>
            <base-field
              id="amountOfEth_input"
              v-model="amount_input"
              :placeholder="'1000 WUSD'"
            >
              <div class="ctm-modal__title-head">
                {{ $t('modals.tip') }}
              </div>
              <div class="ctm-modal__subtitle">
                {{ $t('modals.tipAbout') }}
              </div>
            </base-field>
          </div>
        </div>
        <div class="ctm-modal__gray-zone">
          <div class="ctm-modal__subtitle">
            {{ $t('modals.byAddingLiquidityYouWillEarn') }}
          </div>
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
            @click="hide()"
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
  name: 'ModalAddLiquidity',
  data() {
    return {
      abouts: [
        {
          title: this.$t('modals.amountEthPerWusd'),
          subtitle: 54,
        },
        {
          title: this.$t('modals.amountEthPerWusd'),
          subtitle: 65,
        },
        {
          title: this.$t('modals.shareOfPool'),
          subtitle: '5%',
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
    padding: 20px;
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
</style>
