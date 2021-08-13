<template>
  <ctm-modal-box
    class="payment"
    :title="$t('modals.payment')"
  >
    <div class="payment__content сontent">
      <div class="content__step">
        <div
          class="content__panel"
          :class="{'content__panel_active': options.step === 1}"
          @click="previousStep"
        >
          {{ $t('modals.walletAddress') }}
        </div>
        <div
          class="content__panel"
          :class="{'content__panel_active': options.step === 2}"
          @click="nextStep"
        >
          {{ $t('wallet.bankCard') }}
        </div>
      </div>
      <div
        v-if="options.step === 1"
        class="content__container"
      >
        <div class="content__drop drop">
          <div class="drop__title">
            {{ $t('modals.chooseCurrency') }}
          </div>
          <base-dd
            key="i"
            v-model="money"
            class="drop__field"
            :items="currency"
            :is-icon="true"
          />
        </div>
        <div class="content__drop drop">
          <div class="drop__title">
            {{ $t('modals.wallet') }}
          </div>
          <base-dd
            v-model="method"
            class="drop__field"
            :items="wallet"
            :is-icon="true"
          />
        </div>
      </div>
      <div
        v-if="options.step === 2"
        class="content__container"
      >
        <div class="content__drop drop">
          <div class="drop__title">
            {{ $t('modals.chooseCard') }}
          </div>
          <base-dd
            v-model="card"
            class="drop__field"
            :items="items"
          >
            <template v-slot:card>
              <span class="icon-credit_card drop__card" />
            </template>
            <template
              v-slot:buttonCard
            >
              <base-btn
                mode="add"
                class="drop__button button"
                @click="showAddingCard"
              >
                <span class="icon-plus_circle_outline button__icon" />
                <span class="button__text">
                  {{ $t('modals.addNewCard') }}
                </span>
              </base-btn>
            </template>
          </base-dd>
        </div>
      </div>
      <div class="content_buttons buttons">
        <span class="buttons__step">
          <base-btn
            class="buttons__button"
            mode="outline"
            @click="hide"
          >
            {{ $t('meta.cancel') }}
          </base-btn>
          <base-btn
            class="buttons__button"
            @click="showRaiseLevel"
          >
            {{ $t('meta.submit') }}
          </base-btn>
        </span>
      </div>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';
import modals from '~/store/modals/modals';

export default {
  name: 'ModalPaymentOptions',
  data() {
    return {
      money: 0,
      method: 0,
      card: 0,
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
    }),
    currency() {
      return [
        { title: this.$t('modals.wusd'), icon: require('~/assets/img/ui/wusd.svg') },
        { title: this.$t('modals.wqt'), icon: require('~/assets/img/ui/wqt.svg') },
      ];
    },
    wallet() {
      return [
        { title: this.$t('modals.coinpaymebts'), icon: require('~/assets/img/ui/wallet.svg') },
      ];
    },
    items() {
      return [
        'Visa *0001',
        'Visa *0002',
      ];
    },
    pictures() {
      return [
        '1',
        '2',
      ];
    },
  },
  mounted() {
  },
  methods: {
    hide() {
      this.CloseModal();
    },
    nextStep() {
      this.$store.commit('modals/setOptions', { ...this.options, step: 2 });
    },
    previousStep() {
      this.$store.commit('modals/setOptions', { ...this.options, step: 1 });
    },
    showAddingCard() {
      this.ShowModal({
        key: modals.addingCard,
        branch: 'payment',
      });
    },
    showRaiseLevel() {
      this.ShowModal({
        key: modals.status,
        img: require('~/assets/img/ui/success.svg'),
        title: this.$t('modals.yourLevelHasBeenRaised'),
      });
    },
  },
};
</script>

<style lang="scss" scoped>

.content {
  &__step {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
  }
  &__drop{
    margin: 15px 0;
  }
  &__drop:last-child{
    margin: 0;
  }
  &__panel{
    @include text-simple;
    font-weight: 400;
    font-size: 16px;
    color: $black500;
    margin: 0 20px 0 0;
    cursor: pointer;
    &_active {
      color: $black800;
      border-bottom: 2px solid $blue;
      padding: 0 0 12px 0;
    }
  }
}

.buttons {
  &__step{
    display: flex;
    justify-content: space-between;
    margin-top: 25px;
  }
  &__button{
    max-width: 206px!important;
  }
}

.payment {
  max-width: 487px !important;
  &__content{
    padding: 22px 30px 28px 30px;
  }
}
.drop{
  &__field{
    border: 1px solid #F7F8FA;
    border-radius: 6px;
  }
  &__title{
    @include text-simple;
    font-weight: 400;
    font-size: 16px;
    color: $black800;
    margin-bottom: 4px;
  }
  &__image{
    margin-left:15px;
  }
  &__card:before{
    font-size: 25px;
    color:$blue!important;
    margin-left: 17px;
  }
}
.button{
  display: flex;
  justify-content: space-between;
  padding: 0 5px;
  &__icon::before{
    font-size: 25px;
    color:$blue!important;
    margin-right: 12px;
  }
}
.button:hover .button__icon:before{
  color: $white!important;
}
</style>
