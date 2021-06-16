<template>
  <ctm-modal-box
    class="addLiquidity"
    :title="$t('modals.removeLiquidity')"
  >
    <div class="ctm-modal__content">
      <div class="ctm-modal__grid-cont">
        <div>
          <div class="ctm-modal__content-field">
            <label
              for="withdrawalAmount_input"
              class="ctm-modal__label"
            >{{ $t('modals.withdrawalAmount') }}</label>
            <input
              id="withdrawalAmount_input"
              class="input_grey"
              placeholder="1000 WUSD"
            >
          </div>
          <div class="ctm-modal__content-field">
            <div
              v-for="(item, i) in currencies"
              :key="i"
              class="ctm-modal__currency"
            >
              <img
                :src="item.url"
                alt=""
              >
              <div class="name">
                {{ item.name }}
              </div>
              <div class="val">
                {{ item.value }}
              </div>
            </div>
          </div>
          <div class="ctm-modal__content-field" />
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
  name: 'ModalRemoveLiquidity',
  data() {
    return {
      abouts: [
        {
          title: this.$t('modals.exchangeRate'),
          subtitle: this.$t('modals.tempForRemove'),
        },
        {
          title: this.$t('modals.currentPoolSize'),
          subtitle: this.$t('modals.tempForRemove'),
        },
        {
          title: this.$t('modals.yourPoolShare'),
          subtitle: this.$t('modals.tempForRemove'),
        },
      ],
      currencies: [
        {
          url: require('~/assets/img/ui/hromb-logo.svg'),
          name: this.$t('modals.eth'),
          value: '25.0256',
        },
        {
          url: require('~/assets/img/ui/w-logo.svg'),
          name: this.$t('modals.wusd'),
          value: '25.0256',
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
    max-width: 875px !important;
  }
  &__content-field {
    margin: 15px 0 0 0;
  }

  &__currency {
    display: grid;
    grid-template-columns: 45px 3fr 1fr;
    align-items: center;
    gap: 10px;

    &:not(:last-child) {
      margin-bottom: 20px;
    }

    .name {
      font-weight: 400;
      font-size: 16px;
      color: #1D2127;
    }

    .val {
      @extend .name;
      text-align: right;
    }
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
  &_grey {
    border-radius: 6px;
    padding: 11px 20px 11px 15px;
    height: 46px;
    width: 100%;
    border: 0;
    background-color: $black0;
    resize: none;
    &::placeholder {
      color: $black200;
    }
  }
}
</style>
