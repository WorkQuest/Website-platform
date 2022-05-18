<template>
  <div
    class="verification"
    data-selector="COMPONENT-VER-CARD"
  >
    <div class="verification__info">
      <div class="verification__title">
        {{ $t('settings.addInfo') }}
      </div>
      <div class="verification__subtitle">
        {{ $t('settings.alsoRating') }}
      </div>
      <div class="verification__button">
        <base-btn
          mode="ver"
          data-selector="GO-TO-SUMSUB"
          @click="goToSumSub"
        >
          {{ $t('settings.getVerification') }}
        </base-btn>
      </div>
    </div>
    <img
      class="verification__img"
      src="~/assets/img/ui/settingsHigherLevel.svg"
      alt=""
    >
  </div>
</template>

<script>
export default {
  name: 'VerificationCard',
  methods: {
    goToSumSub() {
      this.$router.push('/sumsub');
    },
  },

};
</script>

<style lang="scss" scoped>
.verification {
    display: grid;
    position: relative;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    background-color: $blue;
    border-radius: 6px;
    color: $white;
    &__info {
        padding: 20px 0 20px 20px;
    }
    &__title {
        font-size: 25px;
        font-weight: 500;
        line-height: 32px;
        margin-bottom: 10px;
    }
    &__subtitle {
        margin-bottom: 30px;
        font-size: 16px;
        font-weight: 400;
        line-height: 21px;

    }
    &__button {
        display: flex;
        max-width: 250px;
    }
    &__img {
        z-index: 1;
        height: 100%;
        width: 100%;
    }
}
@include _1199 {
  .verification {
    &__title {
      font-size: 20px;
      line-height: 26px;
    }
  }
}
@include _991 {
  .verification {
    grid-template-columns: 1fr;
    padding-right: 20px;
    &__img {
      display: none;
    }
  }
}
@include _575 {
  .verification {
    border-radius: 0;
  }
}
@include _480 {
  .verification {
    &__button {
      max-width: none;
      width: 100%;
    }
  }
}
</style>
