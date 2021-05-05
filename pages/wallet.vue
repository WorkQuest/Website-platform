<template>
  <div class="wallet">
    <div class="wallet__nav">
      <span class="wallet__title">{{ $t('wallet.wallet') }}</span>
      <div class="wallet__address">
        <span>{{ userWallet }}</span>
        <span class="icon-copy wallet__icon" />
      </div>
    </div>
    <div class="wallet__info">
      <div class="wallet__balance balance">
        <div class="balance__left">
          <span class="balance__title">{{ $t('wallet.balance') }}</span>
          <span class="balance__currency">{{ `${userBalance} ${currency}` }}</span>
          <span class="balance__usd">{{ `$ ${usd}` }}</span>
        </div>
        <div class="balance__right">
          <base-button
            mode="outline"
            class="balance__btn"
          >
            {{ $t('wallet.deposit') }}
          </base-button>
          <base-button class="balance__btn">
            {{ $t('wallet.withdraw') }}
          </base-button>
        </div>
      </div>
      <div
        class="wallet__card card"
        :class="{'card_closed' : cardClosed }"
      >
        <span class="card__title">{{ $t('wallet.addCardProposal') }}</span>
        <span class="icon-close_big card__icon" />
        <img
          src="/img/app/card.svg"
          alt="card"
          class="card__img"
        >
        <base-button
          class="card__btn"
          mode="outline"
        >
          {{ $t('wallet.addCard') }}
        </base-button>
      </div>
    </div>
    <div class="wallet__table">
      <base-table :title="$t('wallet.table.trx')" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cardClosed: false,
      userWallet: '0xnf8o29837hrvbn42o37hsho3b74thb3',
      userBalance: '1500',
      currency: 'WUSD',
      usd: '120.34',
    };
  },
  async mounted() {
    this.SetLoader(true);
    this.SetLoader(false);
  },
};
</script>

<style lang="scss" scoped>
.wallet {
  max-width: 1180px;
  margin: 20px auto;
  line-height: 130%;
  &__nav {
    display: flex;
    justify-content: space-between;
    font-size: 16px;
  }

  &__address {
    display: flex;
    align-items: center;
    font-weight: 500;
    font-size: 16px;
    line-height: 130%;
  }

  &__icon {
    margin-left: 22px;
    font-size: 24px;
    &::before {
      color: $blue;

    }
  }

  &__title {
    font-size: 25px;
    font-weight: 500;
  }

  &__info {
    display: flex;
    align-items: center;
  }
}

.balance {
  display: flex;
  margin: 20px 0;
  background: $white;
  justify-content: space-between;
  border-radius: 6px;
  min-width: 660px;
  padding: 20px;

  &__left {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  &__right {
    width: 220px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  &__title {
    color: #4C5767;
  }

  &__currency {
    font-weight: 600;
    font-size: 35px;
    line-height: 130%;
  }

  &__usd {
    color: $blue;
  }

  &__btn {
    margin-top:20px;
  }
}

.card {
  width: 100%;
  max-height: 166px;
  padding: 20px;
  display: grid;
  grid-template-rows: 80px;
  grid-template-columns: 277px 180px;
  margin: 20px 0 20px 20px;
  background: $blue;
  color: $white;
  position: relative;
  overflow: hidden;

  &_closed {
    display: none;
  }

  &__title {
    font-size: 20px;
  }

  &__btn {
    grid-column-start: 2;
    z-index: 2;
  }

  &__img {
    position: absolute;
    left: 144px;
    top: -43px;
    width: 355px;
    height: 250px;
    z-index: 1;
  }

  &__icon {
    display: flex;
    justify-content: flex-end;
    z-index: 2;
    &:before {
      cursor: pointer;
      font-size: 20px;
      color: $white;
    }
  }
}
</style>
