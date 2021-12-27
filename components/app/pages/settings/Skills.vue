<template>
  <div class="skills">
    <div
      v-if="true"
      class="skills__title"
    >
      {{ $t("settings.employmentInfo") }}
    </div>
    <div
      v-if="true"
      class="skills__container"
    >
      <div class="skills__items">
        <specializations-selector
          :skills="userSpecializations"
          @changeSkills="updateSelectedSkills"
        />
        <div class="skills__add-info">
          <base-dd
            v-model="priorityIndex"
            class="skills__drop-down"
            type="gray"
            :placeholder="$t('priority.title')"
            :items="priority"
            :mode="'small'"
            :label="$t('settings.priority')"
          />
          <base-dd
            v-model="distantIndex"
            class="skills__drop-down"
            type="gray"
            :placeholder="$t('settings.distantWork.select')"
            :items="distantWork"
            :mode="'small'"
            :label="$t('settings.distantWork.title')"
          />
          <base-field
            v-model="perHour"
            class="skills__cost"
            :placeholder="perHour || $t('priority.title')"
            :label="$t('settings.costPerHour')"
            :name="$t('settings.costPerHour')"
            type="gray"
          />
        </div>
        <div class="skills__save">
          <base-btn class="skills__btn">
            {{ $t("settings.save") }}
          </base-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Skills',
  data() {
    return {
      perHour: 0,
      priorityIndex: -1,
      distantIndex: -1,
    };
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
    &__save {
      button {
        max-width: none;
        width: 100%;
      }
    }
  }
}
</style>
