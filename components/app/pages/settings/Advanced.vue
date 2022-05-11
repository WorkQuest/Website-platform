<template>
  <div
    class="advanced"
    data-selector="COMPONENT-ADVANCED"
  >
    <div class="advanced__left">
      <div class="advanced__title">
        {{ $t('meta.settings') }}
      </div>
      <div
        v-for="(checkBox) in checkBoxButtons"
        :key="checkBox.index"
        data-selector="ADVANCED-CHECKBOX"
        class="advanced__options advanced__options_left"
      >
        <div class="advanced__subtitle">
          {{ checkBox[0].title }}
        </div>
        <div
          v-for="input in checkBox"
          :key="input.index"
          data-selector="ADVANCED-WHO-CAN-SEE-CHECKBox"
          class="advanced__option"
          @click="setSelectedCheckboxByBlock(input.name, input.value)"
        >
          <base-checkbox
            :id="input.id"
            :name="input.id"
            :value="isCheckboxChecked(input.name, input.value)"
            :data-selector="`ADVANCED-WHO-CAN-SEE-CHECKBOX-${input.id}`"
            :label="String($t(input.local))"
          />
        </div>
      </div>
    </div>
    <div class="advanced__right">
      <div class="advanced__title">
        {{ $t('meta.settings') }}
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
            :disabled="button.disabled"
            :data-selector="button.modal"
            @click="showModalKey(button.modal)"
          >
            {{ $t(button.buttonName) }}
          </base-btn>
          <div
            v-if="button.isSwitcher"
            class="advanced__option-buttons"
          >
            <base-btn
              :data-selector="!statusTotp ? button.secondModal : button.firstModal"
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
import { UserRole, RatingFilter, RatingStatus } from '~/utils/enums';

export default {
  name: 'Advanced',
  data() {
    return {
      mounted: false,
      checkboxBlocks: {
        visibilityUser: [],
        restrictionRankingStatus: [],
      },
      checkBoxButtons: {
        visibilityUser: [],
        restrictionRankingStatus: [],
      },
    };
  },
  computed: {
    ...mapGetters({
      userRole: 'user/getUserRole',
      statusTotp: 'user/getStatusTotp',
      status2FA: 'user/getStatus2FA',
      secondNumber: 'user/getUserSecondMobileNumber',
      userData: 'user/getUserData',
    }),
    rightSideButtons() {
      return [
        {
          title: 'settings.changePass',
          buttonName: 'meta.btns.change',
          modal: 'changePassInSettings',
          isSwitcher: false,
        },
        {
          title: 'settings.enableTwoStepAuth',
          firstButtonName: 'meta.btns.disable',
          secondButtonName: 'settings.enable',
          firstModal: 'disable2FA',
          secondModal: 'twoFAAuth',
          isSwitcher: true,
        },
        {
          title: 'settings.smsVerification',
          buttonName: this.userData?.phone?.fullPhone ? 'meta.verified' : 'settings.enable',
          modal: 'smsVerification',
          isSwitcher: false,
          disabled: !!this.userData?.phone?.fullPhone,
        },
        {
          title: 'settings.changeRole',
          firstButtonName: 'meta.btns.change',
          secondButtonName: 'meta.btns.change',
          firstModal: 'changeRoleWarning',
          secondModal: 'neededToEnable2FA',
          isSwitcher: true,
        },
      ];
    },
  },
  beforeMount() {
    this.checkBoxButtons.restrictionRankingStatus = RatingFilter.map((item, i) => ({
      title: this.$t(`settings.${this.userRole === UserRole.EMPLOYER ? 'whoCouldIInvite' : 'whoCouldInviteMe'}`),
      id: item.key,
      value: item.value,
      local: i === 0 ? 'settings.allUsers' : `quests.rating.${item.key}`,
      name: 'restrictionRankingStatus',
    }));
    this.checkBoxButtons.visibilityUser = RatingFilter.map((item, i) => ({
      title: this.$t(`settings.${this.userRole === UserRole.EMPLOYER ? 'whoAppearsInMyListEmployees' : 'whoAppearsInMyListEmployers'}`),
      id: item.key,
      value: item.value,
      local: i === 0 ? 'settings.allUsers' : `quests.rating.${item.key}`,
      name: 'visibilityUser',
    }));
  },
  created() {
    const { employerProfileVisibilitySetting, workerProfileVisibilitySetting } = JSON.parse(JSON.stringify(this.userData));
    if (this.userRole === UserRole.EMPLOYER) {
      const { arrayRatingStatusCanRespondToQuest, arrayRatingStatusInMySearch } = employerProfileVisibilitySetting;
      this.checkboxBlocks.visibilityUser = arrayRatingStatusCanRespondToQuest;
      this.checkboxBlocks.restrictionRankingStatus = arrayRatingStatusInMySearch;
    } else {
      const { arrayRatingStatusCanInviteMeOnQuest, arrayRatingStatusInMySearch } = workerProfileVisibilitySetting;
      this.checkboxBlocks.visibilityUser = arrayRatingStatusCanInviteMeOnQuest;
      this.checkboxBlocks.restrictionRankingStatus = arrayRatingStatusInMySearch;
    }
    this.checkMaskAllUser();
  },
  methods: {
    async showModalKey(modalKey) {
      this.$emit('showModalKey', modalKey);
    },
    smsVerErrorModal() {
      this.ShowModal({
        key: modals.status,
        title: this.$t('modals.errors.errorSmsVer'),
        subtitle: this.$t('modals.fillNumber'),
      });
    },
    setSelectedCheckboxByBlock(checkBoxBlockName, value) {
      const isHas = this.checkboxBlocks[checkBoxBlockName].includes(value);
      const isAllStatuses = value === RatingStatus.AllStatuses;

      if (isHas && isAllStatuses) {
        this.checkboxBlocks[checkBoxBlockName] = [];
      } else if (isHas) {
        this.checkboxBlocks[checkBoxBlockName] = this.checkboxBlocks[checkBoxBlockName].filter((e) => e !== value);
      } else if (isAllStatuses) {
        this.checkboxBlocks[checkBoxBlockName] = [RatingStatus.AllStatuses];
      } else {
        this.checkboxBlocks[checkBoxBlockName] = this.checkboxBlocks[checkBoxBlockName].filter((e) => e
          !== RatingStatus.AllStatuses);
        this.checkboxBlocks[checkBoxBlockName].push(value);
        this.checkMaskAllUser();
      }
      this.$emit('updateVisibility', this.checkboxBlocks);
      return null;
    },
    isCheckboxChecked(checkBoxBlockName, value) {
      const checkboxes = this.checkboxBlocks[checkBoxBlockName];
      return checkboxes.includes(value) || checkboxes.includes(RatingStatus.AllStatuses);
    },
    checkMaskAllUser() {
      const ratingStatus = [
        RatingStatus.NoStatus,
        RatingStatus.Verified,
        RatingStatus.Reliable,
        RatingStatus.TopRanked,
      ];
      if (JSON.stringify(this.checkboxBlocks.visibilityUser.sort()) === JSON.stringify(ratingStatus.sort())) {
        this.checkboxBlocks.visibilityUser = [RatingStatus.AllStatuses];
      }
      if (JSON.stringify(this.checkboxBlocks.restrictionRankingStatus.sort()) === JSON.stringify(ratingStatus.sort())) {
        this.checkboxBlocks.restrictionRankingStatus = [RatingStatus.AllStatuses];
      }
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
    }
    &_left:not(:last-child) {
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
        min-width: auto;
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
