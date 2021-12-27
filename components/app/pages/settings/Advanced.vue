<template>
  <div class="advanced">
    <div class="advanced__left">
      <div class="advanced__title">
        {{ $t('settings.settings') }}
      </div>
      <div class="advanced__options advanced__options_left">
        <div class="advanced__subtitle">
          {{ $t('settings.whoCanSee') }}
        </div>
        <div class="advanced__option">
          <input
            id="allUsers"
            name="whoCanSee"
            type="radio"
            class="radio__input"
            value="allUsers"
          >
          <label
            class="advanced__label"
            for="allUsers"
          >
            {{ $t('settings.allUsers') }}
          </label>
        </div>
        <div class="advanced__option">
          <input
            id="allInternet"
            name="whoCanSee"
            type="radio"
            class="radio__input"
            value="allInternet"
            checked
          >
          <label
            class="advanced__label"
            for="allInternet"
          >
            {{ $t('settings.allInternet') }}
          </label>
        </div>
        <div class="advanced__option">
          <input
            id="onlyWhenSubmittedWork"
            name="whoCanSee"
            type="radio"
            class="radio__input"
            value="onlyWhenSubmittedWork"
          >
          <label
            class="advanced__label"
            for="onlyWhenSubmittedWork"
          >
            {{ $t('settings.onlyWhenSubmittedWork') }}
          </label>
        </div>
      </div>
      <div class="advanced__options advanced__options_left">
        <div class="advanced__subtitle">
          {{ $t('settings.filterAllEmployeeProfiles') }}
        </div>
        <div class="advanced__option">
          <input
            id="urgentProposals"
            name="filterAllWorkProposals"
            type="radio"
            class="radio__input"
            value="urgentJobOffers"
          >
          <label
            class="advanced__label"
            for="urgentProposals"
          >
            {{ $t('settings.urgentJobOffers') }}
          </label>
        </div>
        <div class="advanced__option">
          <input
            id="onlyImplementation"
            name="filterAllWorkProposals"
            type="radio"
            class="radio__input"
            value="shortTermJobOffers"
          >
          <label
            class="advanced__label"
            for="onlyImplementation"
          >
            {{ $t('settings.shortTermJobOffers') }}
          </label>
        </div>
        <div class="advanced__option">
          <input
            id="onlyReady"
            name="filterAllWorkProposals"
            type="radio"
            class="radio__input"
            value="fixedDeliveryJobOffers"
          >
          <label
            class="advanced__label"
            for="onlyReady"
          >
            {{ $t('settings.fixedDeliveryJobOffers') }}
          </label>
        </div>
      </div>
    </div>
    <div class="advanced__right">
      <div class="advanced__title">
        {{ $t('settings.settings') }}
      </div>
      <div class="advanced__options">
        <div class="advanced__option advanced__option_blue">
          <div class="advanced__option-title">
            {{ $t('settings.changePass') }}
          </div>
          <base-btn @click="showModalKey('changePassInSettings')">
            {{ $t('settings.change') }}
          </base-btn>
        </div>
        <div class="advanced__option advanced__option_blue">
          <div>
            {{ $t('settings.enableTwoStepAuth') }}
          </div>
          <div class="advanced__option-buttons">
            <base-btn
              :disabled="status2FA === 0"
              class="margin__bottom"
              @click="showModalKey('disable2FA')"
            >
              {{ $t('meta.disable') }}
            </base-btn>
            <base-btn
              :disabled="status2FA === 1"
              @click="showModalKey('twoFAAuth')"
            >
              {{ $t('settings.enable') }}
            </base-btn>
          </div>
        </div>
        <div class="advanced__option advanced__option_blue">
          <div>
            {{ $t('settings.smsVerification') }}
          </div>
          <base-btn
            @click="showModalKey('smsVerification')"
          >
            {{ $t('settings.enable') }}
          </base-btn>
        </div>
        <div class="advanced__option advanced__option_blue">
          <div>
            {{ $t('settings.changeRole') }}
          </div>
          <base-btn @click="changeRole()">
            {{ $t('settings.change') }}
          </base-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Advanced',

};
</script>

<style lang="scss" scoped>
.advanced {
  display: grid;
  grid-template-columns: 2fr 3fr;
  gap: 20px;
  &__left {
    background: $white;
    padding: 20px;
  }
  &__right {
    background: $white;
    padding: 20px;
  }
  &__title {
    font-family: Inter, Arial, sans-serif;
    font-weight: 400;
    font-size: 16px;
    line-height: 21px;
    color: #1D2127;
    margin-bottom: 20px;
  }
  &__subtitle {
    font-family: Inter, Arial, sans-serif;
    font-weight: normal;
    font-size: 16px;
    line-height: 21px;
    color: #7C838D;
    margin-bottom: 8px;
  }
  &__options {
    display: grid;
    grid-template-columns: 1fr;
    row-gap: 20px;
    &_left {
      row-gap: 12px;
      margin-bottom: 20px;
    }
  }
  &__option {
    display: flex;
    gap: 10px;
    &_blue {
      background: rgba(0, 131, 199, 0.1);
      display: flex;
      justify-content: space-between;
      border-radius: 6px;
      padding: 10.5px 20px;
      align-items: center;
      button {
        min-width: 220px;
        max-width: 220px;
      }
    }
  }
  &__option-buttons {
    min-width: 220px;
    display: grid;
    gap: 10px;
  }
  label {
    margin: 0;
  }
}
.radio {
    &__input {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    border-radius: 50%;
    width: 25px;
    height: 25px;
    border: 1px solid $blue;
    cursor: pointer;
    &:checked {
      background: radial-gradient($blue 40%, rgba(255, 0, 0, 0) 45%);
    }
  }
}

@include _991 {
  .advanced {
    grid-template-columns: 1fr;
  }
}
@include _575 {
  .advanced {
    &__option_blue {
      flex-direction: column;
      button {
        min-width: none;
        max-width: none;
        width: 100%;
      }
    }
    &__option-buttons {
      width: 100%;
    }
  }
}

</style>
