<template>
  <div
    class="skills-spec"
    data-selector="COMPONENT-SKILLS"
  >
    <div
      v-for="(skills, specialization) in getSkillTitle"
      :key="specialization"
      :data-selector="`SPECS-${specialization}`"
      class="spec"
    >
      <div class="spec__title">
        {{ $t(`filters.skills.${specialization}.title`) }}
      </div>
      <ul class="spec__skills">
        <li
          v-for="(skill, key) in skills"
          :key="key"
          :data-selector="`SKILLS-${skill}`"
          class="skills__item skills__item_blue"
        >
          {{ $t(`filters.skills.${specialization}.sub.${skill}`) }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SkillsCont',
  props: {
    specializations: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    getSkillTitle() {
      const specData = {};
      this.specializations.forEach((data) => {
        const [spec, skill] = data.path.split('.');
        if (!specData[spec]) specData[spec] = [];
        specData[spec].push(skill);
      });
      return specData;
    },
  },
};
</script>

<style lang="scss" scoped>
  .skills-spec {
    display: grid;
    gap: 20px;
  }
  .spec {
    display: flex;
    flex-direction: column;
    grid-gap: 10px;
    &__container {
      display: flex;
      flex-direction: column;
      grid-gap: 10px;
    }
    &__title {
      font-size: 14px;
      line-height: 130%;
    }
    &__skills {
      display: flex;
      grid-gap: 8px;
      flex-wrap: wrap;
    }
  }
  .skills {
    &__item {
      font-size: 16px;
      line-height: 130%;
      &_blue {
        background-color: rgba(0, 131, 199, 0.1);
        border-radius: 44px;
        padding: 5px 7px;
        color: #0083C7;
      }
    }
  }
</style>
