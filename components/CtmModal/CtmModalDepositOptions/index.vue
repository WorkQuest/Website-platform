<template>
  <ctm-modal-box
    class="deposit"
    :title="$t('modals.depositTitle')"
  >
    <div class="deposit__content content">
      <div
        class="content__step"
      >
        <div
          class="content__panel"
          @click="showGiveDeposit"
        >
          {{ $t('modals.walletAddress') }}
        </div>
        <div
          class="content__panel_active"
        >
          {{ $t('wallet.bankCard') }}
        </div>
      </div>
      <div class="content__drop drop">
        <span class="drop__title">
          {{ $t('modals.chooseCard') }}
        </span>
        <base-dd
          v-model="card"
          class="drop__field"
          :type="'white'"
          :items="items"
        >
          <template v-slot:card>
            <span class="icon-credit_card drop__card" />
          </template>
          <template
            v-slot:buttonCard
          >
            <base-btn
              mode="outline"
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
      <div class="content__grid grid">
        <span class="grid__title">
          {{ $t('modals.amount') }}
        </span>
        <div class="grid__body">
          <base-field
            id="amount_input"
            :is-hide-error="true"
            :placeholder="'0 WUSD'"
            class="grid__input"
          />
          <div class="grid__equal">
            =
          </div>
          <div class="grid__field">
            <base-field
              v-model="dollars"
              :is-hide-error="true"
              mode="white"
            />
          </div>
        </div>
      </div>
      <div class="content__body body">
        <div>
          <span class="body__title">
            {{ $t('modals.totalFee') }}
          </span>
          <base-field
            id="fee_input"
            v-model="fee"
            mode="white"
            class="body__input"
          />
        </div>
        <div>
          <span class="body__title">
            {{ $t('modals.processing') }}
          </span>
          <base-field
            id="time_input"
            v-model="time"
            mode="white"
            class="body__input"
          />
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
          class="buttons__button_white"
          @click="showTransactionSendModal()"
        >
          {{ $t('meta.buyWUSD') }}
        </base-btn>
      </div>
    </div>
  </ctm-modal-box>
</template>

<script>
import modals from '~/store/modals/modals';

export default {
  name: 'ModalDepositOptions',
  data() {
    return {
      card: 0,
      fee: '$ 0,15',
      dollars: '$ 0',
      time: '5 min',
    };
  },
  computed: {
    items() {
      return [
        'Visa *00001',
        'Visa *00002',
      ];
    },
  },
  methods: {
    hide() {
      this.CloseModal();
    },
    showTransactionSendModal() {
      this.ShowModal({
        key: modals.depositInfo,
      });
    },
    showGiveDeposit() {
      this.ShowModal({
        key: modals.giveDeposit,
      });
    },
    showAddingCard() {
      this.ShowModal({
        key: modals.addingCard,
      });
    },
  },
};
</script>

<style lang="scss" scoped>

.deposit {
  max-width: 500px !important;
  &__content {
    padding: 0 28px 30px 28px;
  }

}
.content {
  &__step {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    margin-top: 25px;
  }

  &__panel {
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
      cursor: pointer;
    }
  }
  &__drop{
    margin: 5px 0 15px 0;
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
  }
  &__card:before{
    font-size: 25px;
    color:$blue!important;
    margin-left: 17px;
  }
}
.grid {
  &__body{
    display: grid;
    grid-template-columns: 47% 6% 47%;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 15px;
  }
  &__title{
    margin-bottom: 5px;
    @include text-simple;
    font-weight: 400;
    font-size: 16px;
    color: $black800;
  }
  &__equal {
    margin: 12px 10px;
  }
}
.body{
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.buttons {
  display: grid;
  grid-template-columns: repeat(2, calc(50% - 10px));
  grid-gap: 20px;
  gap: 20px;
  margin-top: 2px;
  &__button {
    box-sizing: border-box;
    font-weight: 400;
    font-size: 16px;
    color: #0083C7;
    border: 1px solid #0083C71A;
    border-radius: 6px;
    transition: .3s;
    background-color: #fff;
    &_white{
      background-color: #0083C7;
      border: unset;
      color: #fff;
      &:hover {
        background-color: #103d7c;
        }
      }
    }
}
.button{
  display: flex;
  justify-content: space-between;
  &__icon::before{
    font-size: 25px;
    color:$blue!important;
    margin-right: 12px;
  }

}
</style>
