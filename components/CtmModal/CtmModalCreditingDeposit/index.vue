<template>
  <ctm-modal-box
    class="deposit"
    :title="$t('modals.titles.deposit')"
  >
    <div class="deposit__content content">
      <validation-observer
        v-slot="{handleSubmit, validated, passed, invalid}"
        tag="div"
      >
        <div class="content__grid">
          <div class="content__body">
            <div class="content__checkpoints checkpoints">
              <div class="checkpoints__block">
                <label
                  for="checkpoints__main"
                  class="checkpoints__label"
                >
                  {{ $t('modals.chooseTheCurrency') }}
                </label>
                <div
                  id="checkpoints__main"
                  class="checkpoints__main"
                >
                  <div
                    v-for="(item, i) in checkpoints"
                    :key="i"
                    class="checkpoints__array"
                  >
                    <input
                      :id="item.name"
                      v-model="selCurrencyID"
                      type="radio"
                      class="checkpoints__item"
                      :value="item.id"
                    >
                    <label
                      class="checkpoints__name"
                      :for="item.name"
                    >
                      {{ item.name }}
                    </label>
                  </div>
                </div>
              </div>
              <div class="checkpoints__block">
                <label
                  for="checkpoints__field"
                  class="checkpoints__label"
                >
                  {{ $t('crediting.chooseSource') }}
                </label>
                <div
                  id="checkpoints__field"
                  class="checkpoints__main"
                >
                  <div
                    v-for="(item, i) in fundsSource"
                    :key="i"
                    class="checkpoints__array"
                  >
                    <input
                      :id="item.name"
                      v-model="selFundID"
                      type="radio"
                      class="checkpoints__item"
                      :value="item.id"
                    >
                    <label
                      class="checkpoints__name"
                      :for="item.name"
                    >
                      {{ item.name }}
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div class="content__field">
              <div class="content__label">
                {{ $t('modals.howMuchTokensWouldYouLikeToLock', { token: checkpoints[selCurrencyID - 1].name }) }}
              </div>
              <base-field
                v-model="quantity"
                class="content__input"
                data-selector="TOKEN-VALUE"
                :placeholder="`100 ${checkpoints[selCurrencyID - 1].name}`"
                rules="required|decimal"
                :name="$t('modals.quantityField')"
              />
            </div>
            <div class="content__field">
              <div class="content__label">
                {{ $t('modals.choosePeriod') }}
              </div>
              <base-dd
                v-model="date"
                type="gray"
                class="grid__drop"
                data-selector="DATE-DD"
                :items="dates"
              />
            </div>
            <div class="content__field">
              <div class="content__text">
                {{ $t('modals.tipAbout') }}
              </div>
            </div>
          </div>
          <div class="content__zone zone">
            <div
              v-for="(item, i) in abouts"
              :key="i"
            >
              <div class="zone__title">
                {{ item.title }}
              </div>
              <div class="zone__subtitle">
                {{ item.subtitle }}
              </div>
            </div>
          </div>
        </div>
        <div class="content__buttons buttons">
          <base-btn
            class="buttons__button"
            mode="outline"
            data-selector="CANCEL"
            @click="hide"
          >
            {{ $t('meta.btns.cancel') }}
          </base-btn>
          <base-btn
            class="buttons__button"
            data-selector="SUBMIT"
            :disabled="!validated || !passed || invalid"
            @click="handleSubmit(openConfirmDetailsModal)"
          >
            {{ $t('meta.btns.submit') }}
          </base-btn>
        </div>
      </validation-observer>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';
import moment from 'moment';
import BigNumber from 'bignumber.js';
import modals from '~/store/modals/modals';
import { getGasPrice } from '~/utils/wallet';
import * as abi from '~/abi/abi';

export default {
  name: 'ModalTakeCreditingDeposit',
  data() {
    return {
      selCurrencyID: 1,
      selFundID: 1,
      quantity: '',
      generate: '',
      date: 0,
      datesNumber: [7, 14, 30, 90, 180],
      checkpoints: [
        {
          name: this.$t('meta.coins.bnb'),
          id: 1,
        },
        {
          name: this.$t('meta.coins.eth'),
          id: 2,
        },
        {
          name: this.$t('meta.coins.wqt'),
          id: 3,
        },
      ],
      fundsSource: [
        {
          name: this.$t('footer.DeFi.lending'),
          id: 1,
        },
        {
          name: this.$t('footer.DeFi.retirement'),
          id: 2,
        },
        {
          name: this.$t('ui.menu.savings.title'),
          id: 3,
        },
      ],
      abouts: [
        {
          title: this.$t('modals.collateralization'),
          subtitle: this.$tc('meta.units.percentsCount', 0),
        },
        {
          title: this.$t('modals.liquidationPrice'),
          subtitle: this.$tc('meta.units.percentsCount', 0),
        },
        {
          title: this.$t('modals.currentPrice'),
          subtitle: this.$tc('meta.units.percentsCount', 0),
        },
        {
          title: this.$t('modals.stabilityFee'),
          subtitle: this.$tc('meta.units.percentsCount', 0),
        },
        {
          title: this.$t('modals.liquidationRatio'),
          subtitle: this.$tc('meta.units.percentsCount', 0),
        },
        {
          title: this.$t('modals.liquidationPenalty'),
          subtitle: this.$tc('meta.units.percentsCount', 0),
        },
        {
          title: this.$t('modals.generatedWUSD'),
          subtitle: this.$tc('meta.coins.count.WUSDCount', 0),
        },
      ],
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
      userRole: 'user/getUserRole',
      funds: 'crediting/getFunds',
      currentPrice: 'oracle/getCurrentPrice',
      securityRatio: 'oracle/getSecurityRatio',
    }),
    dates() {
      return [
        this.$tc('meta.units.days', 7),
        this.$tc('meta.units.days', 14),
        this.$tc('meta.units.days', 30),
        this.$tc('meta.units.days', 90),
        this.$tc('meta.units.days', 180),
      ];
    },
  },
  async mounted() {
    await this.$store.dispatch('crediting/getFunds');
    await this.$store.dispatch('oracle/getCurrentPrice');
    await this.$store.dispatch('oracle/getSecurityRatio');
  },
  methods: {
    hide() {
      this.CloseModal();
    },
    async openConfirmDetailsModal() {
      const receiptData = [
        {
          title: this.$t('crediting.chosenSource'),
          subtitle: this.fundsSource[this.selFundID - 1].name,
        },
        {
          title: this.$t('modals.depositing'),
          subtitle: this.$tc(`meta.coins.count.${this.checkpoints[this.selCurrencyID - 1].name}Count`, this.quantity),
        },
        {
          title: this.$t('crediting.dueDate'),
          subtitle: moment().add(this.datesNumber[this.date], 'days').format('DD.MM.YYYY'),
        },
      ];
      const valueWithDecimals = new BigNumber(this.quantity).shiftedBy(18).toString();
      const symbol = this.checkpoints[this.selCurrencyID - 1].name;
      const duration = this.datesNumber[this.date];
      const callback = async () => {
        const checkTokenPrice = await this.setTokenPrice();
        const approveAllowed = await this.$store.dispatch('wallet/approveRouter', {
          symbol,
          spenderAddress: process.env.BORROWING,
          value: valueWithDecimals,
        });
        let res = false;
        if (checkTokenPrice && approveAllowed) {
          res = await this.$store.dispatch('crediting/sendMethod', {
            data: [
              1,
              valueWithDecimals,
              this.selFundID - 1,
              duration,
              symbol,
            ],
            method: 'borrow',
            type: 'borrowing',
          });
        }
        if (res.ok) {
          this.ShowModal({
            key: modals.status,
            img: require('~/assets/img/ui/transactionSend.svg'),
            title: this.$t('modals.depositIsOpened'),
            subtitle: '',
            path: 'crediting/1',
          });
        } else {
          this.ShowModal({
            key: modals.status,
            img: require('~/assets/img/ui/warning.svg'),
            title: this.$t('modals.transactionFail'),
            recipient: '',
            subtitle: this.$t('modals.errors.error'),
          });
        }
      };
      this.ShowModal({
        key: modals.confirmDetails,
        receiptData,
        callback,
      });
    },
    async setTokenPrice() {
      const {
        nonce, prices, v, r, s, symbols,
      } = this.currentPrice; // TODO price
      const resultGasSetTokenPrices = await getGasPrice(abi.WQOracle, process.env.WORKNET_ORACLE, 'setTokenPricesUSD', [nonce, v, r, s, prices, symbols]);
      if (resultGasSetTokenPrices.gas && resultGasSetTokenPrices.gasPrice) {
        const { ok } = await this.$store.dispatch('crediting/setTokenPrices', {
          gasPrice: resultGasSetTokenPrices.gasPrice,
          gas: resultGasSetTokenPrices.gas,
          timestamp: nonce,
          v,
          r,
          s,
          prices,
          symbols,
        });
        return ok;
      }
      return false;
    },
  },
};
</script>

<style lang="scss" scoped>
.deposit {
  max-width: 943px !important;
  height: auto !important;
  padding: 0!important;
  &__content{
    padding: 20px 28px 30px 28px;
  }
}
.buttons{
  display: grid;
  grid-template-columns: repeat(2, calc(50% - 10px));
  grid-gap: 20px;
  gap: 20px;
  margin-top: 25px;
}
.content{
  &__body{
  }
  &__field{
    margin-top: 3px;
    font-weight: 500;
  }
  &__label {
    margin-bottom: 13px;
  }
  &__text {
    color: $black500;
    font-size: 14px;
    margin: 3px 0 15px 0;
    line-height: 130%;
    font-weight: 400;
  }
  &__grid{
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 25px;
  }
  &__checkpoints {
    display: grid;
    grid-template-columns: repeat(2, auto);
    margin-bottom: 25px;
    &_label {
      margin-bottom: 10px;
    }
  }
  &__zone {
    background-color: #F7F8FA;
    border-radius: 5px;
    margin-top: 15px;
    padding: 0 20px 20px 20px;
    height: fit-content;
  }
}
.checkpoints{
  &__label {
    margin-bottom: 15px;
    font-weight: 500;
    font-size: 16px;
    line-height: 130%;
  }
  &__main{
    display: grid;
    grid-template-rows: repeat(3, 1fr);
    text-align: left;
    justify-content: flex-start;
    gap: 13px;
  }
  &__array {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 10px;
    > label {
      margin: unset;
    }
  }
  &__item{
    font-size: 16px;
    font-weight: 400;
    border-radius: 50%;
    width: 25px;
    height: 25px;
    border: 1px solid #0083C7;
    cursor: pointer;
  }
}
.zone{
  &__title {
    font-size: 16px;
    font-weight: 400;
    margin-top: 20px;
  }
  &__subtitle {
    color: #7C838D;
    font-weight: 500;
    font-size: 14px;
  }
}

@include _991 {
  .content {
    &__checkpoints {
      grid-template-columns: auto;
      grid-gap: 20px;
    }
  }
}

@include _575 {
  .content {
    &__grid {
      grid-template-columns: 1fr;
    }
    &__label {
      margin-bottom: 5px;
    }
  }
}

</style>
