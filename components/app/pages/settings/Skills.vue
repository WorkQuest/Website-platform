<template>
  <div
    class="skills"
    data-selector="COMPONENT-SKILLS"
  >
    <div class="skills__container">
      <div class="skills__title">
        {{ $t("settings.employmentInfo") }}
      </div>
      <div class="skills__items">
        <specializations-selector
          v-if="skills.selectedSpecAndSkills !== null"
          :skills="skills.selectedSpecAndSkills"
          @changeSkills="$emit('updateSelectedSkills', $event)"
        />
        <div class="skills__add-info">
          <base-dd
            v-for="(dd,index) in dropdowns"
            :key="index"
            v-model="skills[dd.model]"
            class="skills__drop-down"
            :data-selector="dd.model"
            type="gray"
            :placeholder="$t(dd.placeholder)"
            :items="dd.items"
            mode="small"
            :label="$tc(dd.label)"
          />
          <base-field
            v-model="skills.perHour"
            rules="greaterThanZero|max:7|decimal"
            class="skills__cost"
            data-selector="COST-PER-HOUR"
            :placeholder="skills.perHour || $t('meta.costPerHour')"
            :label="$tc('meta.costPerHour')"
            :name="$tc('meta.costPerHour')"
            type="number"
          />
        </div>
        <div class="skills__save">
          <base-btn
            class="skills__btn"
            data-selector="SAVE-CHANGES"
            @click="$emit('click')"
          >
            {{ $t("meta.btns.save") }}
          </base-btn>
          <span v-if="validationError">
            {{ $t('messages.formError') }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { PayPeriodsIndex } from '~/utils/enums';

export default {
  name: 'Skills',
  props: {
    skills: {
      type: Object,
      default: null,
    },
    validationError: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      dropdowns: [],
    };
  },
  beforeMount() {
    this.dropdowns = [
      {
        model: 'priorityIndex',
        placeholder: 'meta.priority.title',
        items: [
          this.$t('meta.priority.all'),
          this.$t('meta.priority.fixedDelivery'),
          this.$t('meta.priority.shortTerm'),
          this.$t('meta.priority.employee.urgent'),
        ],
        label: 'settings.priority',
      },
      {
        model: 'distantIndex',
        placeholder: 'settings.distantWork.select',
        items: [
          this.$t('settings.distantWork.distantWork'),
          this.$t('settings.distantWork.workInOffice'),
          this.$t('settings.distantWork.bothVariant'),
        ],
        label: 'settings.distantWork.title',
      },
      {
        model: 'payPeriodIndex',
        placeholder: 'settings.selectPayPeriod',
        items: PayPeriodsIndex.map((item) => this.$t(`quests.payPeriods.${item}`)),
        label: 'quests.payPeriods.title',
      },
    ];
  },
};
</script>

<style lang="scss" scoped>
.skills {
  &__container {
    background: $white;
    padding: 20px;
    border-radius: 6px;
    display: grid;
    gap: 20px;
  }
  &__add-info {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 20px;
    margin-top: 20px;
  }
  &__save {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-end;
    margin: 0;
    span {
      color: $errorText;
      font-size: 14px;
      min-height: 23px;
      width: 250px;
      text-align: center;
      }
  }
  &__btn {
    max-width: 250px;
    margin: 0;
  }
}

@include _767 {
  .skills {
    &__add-info {
      grid-template-columns: 1fr;
    }
  }
}
@include _575 {
  .skills {
    &__container {
      border-radius: 0;
    }
    &__save {
      button {
        max-width: none;
        width: 100%;
      }
      span {
        width: 100%;
      }
    }
  }
}
</style>
