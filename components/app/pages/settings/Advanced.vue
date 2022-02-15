<template>
  <div
    class="advanced"
    data-selector="COMPONENT-ADVANCED"
  >
    <div class="advanced__left">
      <div class="advanced__title">
        {{ $t('settings.settings') }}
      </div>
      <div
        v-for="(radio) in radioButtons"
        :key="radio.index"
        data-selector="ADVANCED-RADIOS"
        class="advanced__options advanced__options_left"
      >
        <div class="advanced__subtitle">
          {{ radio[0].id === 'allUsers' ? $t('settings.whoCanSee') : $t('settings.workProposals') }}
        </div>
        <div
          v-for="input in radio"
          :key="input.index"
          data-selector="ADVANCED-WHO-CAN-SEE-RADIO"
          class="advanced__option"
        >
          <input
            :id="input.id"
            :name="input.name"
            :data-selector="`ADVANCED-WHO-CAN-SEE-RADIO-${input.id}`"
            type="radio"
            class="advanced__input"
            :value="input.value"
          >
          <label
            class="advanced__label"
            :for="input.id"
          >
            {{ $t(input.local) }}
          </label>
        </div>
      </div>
    </div>
    <div class="advanced__right">
      <div class="advanced__title">
        {{ $t('settings.settings') }}
      </div>
      <div class="advanced__options">
        <div
          v-for="(button, index) in rightSideButtons"
          :key="index"
          :data-selector="`ADVANCED-SETTINGS-RIGHT-SIDE-BTNS-${button.title}`"
          class="advanced__option advanced__option_blue"
        >
          <div class="advanced__option-title">
            {{ $t(button.title) }}
          </div>
          <base-btn
            v-if="!button.isSwitcher"
            :disabled="button.enable"
            :selector="`${button.buttonName}`"
            @click="showModalKey(button.modal)"
          >
            {{ $t(button.buttonName) }}
          </base-btn>
          <div
            v-if="button.isSwitcher"
            class="advanced__option-buttons"
          >
            <base-btn
              :selector="`${!statusTotp} ? ${$t(button.secondButtonName)} : ${$t(button.firstButtonName)}`"
              @click="!statusTotp ? showModalKey(button.secondModal) : showModalKey(button.firstModal)"
            >
              {{ !statusTotp ? $t(button.secondButtonName) : $t(button.firstButtonName) }}
            </base-btn>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import modals from '~/store/modals/modals';

export default {
  name: 'Advanced',
  data() {
    return {
      radioButtons: {
        whoCanSeeInputs: [
          {
            id: 'allUsers',
            value: 'allUsers',
            local: 'settings.allUsers',
            name: 'whoCanSee',
          },
          {
            id: 'allInternet',
            value: 'allInternet',
            local: 'settings.allInternet',
            name: 'whoCanSee',
          },
          {
            id: 'onlyWhenSubmittedWork',
            value: 'onlyWhenSubmittedWork',
            local: 'settings.onlyWhenSubmittedWork',
            name: 'whoCanSee',
          },
        ],
        employeeProfilesInputs: [
          {
            id: 'urgentProposals',
            value: 'urgentJobOffers',
            local: 'settings.urgentJobOffers',
            name: 'filterAllWorkProposals',
          },
          {
            id: 'onlyImplementation',
            value: 'shortTermJobOffers',
            local: 'settings.shortTermJobOffers',
            name: 'filterAllWorkProposals',
          },
          {
            id: 'onlyReady',
            value: 'fixedDeliveryJobOffers',
            local: 'settings.fixedDeliveryJobOffers',
            name: 'filterAllWorkProposals',
          },
        ],
      },
      rightSideButtons: [
        {
          title: 'settings.changePass',
          buttonName: 'settings.change',
          modal: 'changePassInSettings',
          isSwitcher: false,
        },
        {
          title: 'settings.enableTwoStepAuth',
          firstButtonName: 'meta.disable',
          secondButtonName: 'settings.enable',
          firstModal: 'disable2FA',
          secondModal: 'twoFAAuth',
          isSwitcher: true,
        },
        {
          title: 'settings.smsVerification',
          buttonName: 'settings.enable',
          modal: 'smsVerification',
          isSwitcher: false,
          enable: this.userData?.tempPhone?.fullPhone,
        },
        {
          title: 'settings.changeRole',
          buttonName: 'settings.change',
          modal: 'changeRoleWarning',
          isSwitcher: false,
        },
      ],
    };
  },
  computed: {
    ...mapGetters({
      statusTotp: 'user/getStatusTotp',
      status2FA: 'user/getStatus2FA',
      secondNumber: 'user/getUserSecondMobileNumber',
      userData: 'user/getUserData',
    }),
  },
  methods: {
    async showModalKey(modalKey) {
      this.$emit('showModalKey', modalKey);
    },
    smsVerErrorModal() {
      this.ShowModal({
        key: modals.status,
        title: this.$t('modals.errorSmsVer'),
        subtitle: this.$t('modals.fillNumber'),
      });
    },
  },

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
    border-radius: 6px;
  }
  &__right {
    background: $white;
    padding: 20px;
    border-radius: 6px;
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

@include _991 {
  .advanced {
    grid-template-columns: 1fr;
  }
}
@include _575 {
  .advanced {
    &__left {
      border-radius: 0;
    }
    &__right {
      border-radius: 0;
    }
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
