<template>
  <div class="skills">
    <div class="skills__title">
      {{ $t("settings.employmentInfo") }}
    </div>
    <div class="skills__container">
      <div class="skills__items">
        <specializations-selector
          v-if="skills.selectedSpecAndSkills !== null"
          :skills="skills.selectedSpecAndSkills"
          @changeSkills="updateSelectedSkills"
        />
        <div class="skills__add-info">
          <base-dd
            v-for="(dd,index) in dropdowns"
            :key="index"
            v-model="skills[dd.model]"
            class="skills__drop-down"
            type="gray"
            :placeholder="$t(dd.placeholder)"
            :items="dd.items"
            :mode="'small'"
            :label="$t(dd.label)"
          />
          <base-field
            v-model="skills.perHour"
            rules="max:7"
            class="skills__cost"
            :placeholder="skills.perHour || $t('priority.title')"
            :label="$t('settings.costPerHour')"
            :name="$t('settings.costPerHour')"
            type="gray"
          />
        </div>
        <div class="skills__save">
          <base-btn
            class="skills__btn"
            @click="$emit('click')"
          >
            {{ $t("settings.save") }}
          </base-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Skills',
  props: {
    skills: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      dropdowns: [
        {
          model: 'priorityIndex',
          placeholder: 'priority.title',
          items: [
            this.$t('settings.distantWork.distantWork'),
            this.$t('settings.distantWork.workInOffice'),
            this.$t('settings.distantWork.bothVariant'),
          ],
          label: 'settings.priority',
        },
        {
          model: 'distantIndex',
          placeholder: 'settings.distantWork.select',
          items: [
            this.$t('priority.all'),
            this.$t('priority.employee.low'),
            this.$t('priority.employee.normal'),
            this.$t('priority.employee.urgent'),
          ],
          label: 'settings.distantWork.title',
        },
      ],
    };
  },
  computed: {
    ...mapGetters({
      userData: 'user/getUserData',
    }),
  },
  methods: {
    updateSelectedSkills(specAndSkills) {
      this.skills.selectedSpecAndSkills = specAndSkills;
    },
  },
};
</script>

<style lang="scss" scoped>
.skills {
  display: grid;
  gap: 20px;
  &__title {
    font-family: Inter, Arial, sans-serif;
    font-weight: 500;
    font-size: 25px;
    line-height: 32px;
  }
  &__container {
    background: $white;
    padding: 20px;
    border-radius: 6px;
  }
  &__add-info {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 20px;
    margin-top: 20px;
  }
  &__save {
    display: flex;
    justify-content: flex-end;
    margin: 0;
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
    }
  }
}
</style>
