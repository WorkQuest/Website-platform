<template>
  <div class="skills">
    <div
      v-if="true"
      class="skills__title"
    >
      {{ $t('settings.employmentInfo') }}
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
            class="specialization__dd"
            type="gray"
            :placeholder="$t('priority.title')"
            :items="priority"
            :mode="'small'"
            :label="$t('settings.priority')"
          />
          <base-dd
            v-model="distantIndex"
            class="specialization__dd"
            type="gray"
            :placeholder="$t('settings.distantWork.select')"
            :items="distantWork"
            :mode="'small'"
            :label="$t('settings.distantWork.title')"
          />
          <base-field
            v-model="perHour"
            class="specialization__skills"
            :placeholder="perHour ||$t('priority.title')"
            :label="$t('settings.costPerHour')"
            :name="$t('settings.costPerHour')"
            type="gray"
          />
        </div>
        <div class="page__btn">
          <base-btn
            class="btn__save"
          >
            {{ $t('settings.save') }}
          </base-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Skills',

};
</script>

<style lang="scss" scoped>
.skills {
&__title {
font-family: Inter, Arial, sans-serif;
font-weight: 500;
font-size: 25px;
line-height: 32px;
}
&__container{
    background: $white;
}
  &__add-info {
    display: flex;
    flex-wrap: nowrap;
    grid-gap: 20px;
    margin-top: 20px;
  }
}
/* .skills {

  &__btn {
    &-add {
      text-align: center;
      margin-top: 20px;
      width: 250px;
      background: #FFFFFF;
      color: #0083C7;
      border: 1px solid #bce8ff;
      &_disabled {
        color: #aaaaaa !important;
        border: 0.5px solid #aaaaaa;
      }
    }
    &-add:hover {
      background: #bce8ff;
    }
  }
  &__error {
    color: #f36262;
    margin-bottom: 10px;
  }
} */
</style>
