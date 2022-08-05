<template>
  <div
    class="selector__skills skills"
    data-selector="COMPONENT-SPEC-SELECTOR"
  >
    <div
      v-for="key in specCount"
      :key="key"
      class="skills__block block"
    >
      <div class="block__skill-spec">
        <div class="block__specialization specialization">
          <base-dd
            v-model="displaySpecIndex[key]"
            class="specialization__dd"
            type="gray"
            :items="specializationsNames"
            :placeholder="$t('settings.selectSpec')"
            :search-placeholder="$t('meta.placeholders.specialization')"
            :data-selector="`SPECIALIZATIONS-DD-${displaySpecIndex[key]}`"
            mode="small"
            rules="required"
            :label="$tc('settings.specialization')"
            :hide-selected="hideSelectedSpecs"
            :is-search="true"
            @input="switchSkill($event, key)"
          />
          <div class="specialization__skills skills">
            <base-dd
              v-model="skillIndex[key]"
              class="specialization__dd"
              :data-selector="`SKILLS-DD-${specIndex[key]}`"
              :type="specIndex[key] < 0 || selectedSkills[key].length === 5 ? 'disabled' : 'gray'"
              :disabled="specIndex[key] < 0 || selectedSkills[key].length === 5"
              :placeholder="$t('settings.selectSkills')"
              :search-placeholder="$t('meta.placeholders.skill')"
              :items="skillsNames[displaySpecIndex[key]]"
              mode="small"
              rules="required"
              :label="$tc('meta.skills')"
              :hide-selected="hideSelectedSkills[key]"
              :is-search="true"
              @input="addSkillToBadge($event, key)"
            />
            <div
              v-if="selectedSkills[key].length === 5"
              class="skills__error"
            >
              {{ $t('ui.buttons.errors.manySkills') }}
            </div>
          </div>
        </div>
        <div class="block__skill skill">
          <div
            v-for="(item, i) in selectedSkills[key]"
            :key="i"
            :data-selector="`SELECTED-SKILLS-${i}`"
            class="skill__badge"
          >
            {{ item.name }}
            <button
              class="skill__remove"
              :data-selector="`ACTION-BTN-REMOVE-SKILL-TO-BADGE-${i}`"
              @click="removeSkillToBadge(item, key)"
            >
              <img
                src="~assets/img/ui/close_blue.svg"
                alt="x"
              >
            </button>
          </div>
        </div>
      </div>
      <base-btn
        :text="$tc('settings.removeSpec')"
        class="specialization__btn specialization__btn_remove"
        :selector="`REMOVE-SKILL-TO-BADGE-${key}`"
        @click="removeSpecialization(key)"
      />
    </div>
    <base-btn
      :text="$tc('settings.addSpec')"
      :disabled="specCount === 3"
      class="skills__btn-add"
      :class="specCount === 3 ? 'skills__btn-add_disabled' : ''"
      selector="ADD-SPEC"
      @click="addSpecialization"
    />
    <div
      v-if="specCount === 3"
      class="skills__error"
    >
      {{ $t('ui.buttons.errors.manySpec') }}
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'SpecializationsSelector',
  props: {
    isClearData: {
      type: Boolean,
      default: false,
    },
    skills: {
      type: Array,
      default: null,
    },
  },
  data() {
    return {
      specCount: 0,
      specIndex: { 1: -1, 2: -1, 3: -1 }, // Выбранные специализации по id в filters
      displaySpecIndex: { 1: -1, 2: -1, 3: -1 }, // Выбранные для отображения названия специализации
      hideSelectedSkills: { 1: [], 2: [], 3: [] },
      skillIndex: { 1: -1, 2: -1, 3: -1 },
      selectedSkills: { 1: [], 2: [], 3: [] },
    };
  },
  computed: {
    ...mapGetters({
      filters: 'quests/getFilters',
    }),
    specializationsNames() {
      const specs = [];
      const keys = Object.keys(this.filters);
      for (let i = 0; i < keys.length; i += 1) {
        const key = keys[i];
        specs.push(this.$t(`filters.skills.${this.filters[key].id}.title`));
      }
      return specs;
    },
    specsIndexes() { // id спеки из filters
      const specsIndexes = [];
      const keys = Object.keys(this.filters);
      for (let i = 0; i < keys.length; i += 1) {
        const key = keys[i];
        specsIndexes.push(this.filters[key].id);
      }
      return specsIndexes;
    },
    skillsNames() {
      const skillsData = {};
      const keys = Object.keys(this.filters);
      for (let i = 0; i < keys.length; i += 1) {
        const key = keys[i];
        const skillsBySpec = this.filters[key].skills;
        const skillsIndexes = Object.values(skillsBySpec);
        const skillsNames = [];
        for (let j = 0; j < skillsIndexes.length; j += 1) {
          const name = this.$t(`filters.skills.${this.filters[key].id}.sub.${skillsIndexes[j]}`);
          skillsNames.push(name);
        }
        skillsData[i] = skillsNames;
      }
      return skillsData;
    },
    skillsIndexes() {
      const skillsIndexesData = {};
      const keys = Object.keys(this.filters);
      for (let i = 0; i < keys.length; i += 1) {
        const key = keys[i];
        const skillsBySpec = this.filters[key].skills;
        skillsIndexesData[i] = Object.values((skillsBySpec)); // skills indexes from filters
      }
      return skillsIndexesData;
    },
    hideSelectedSpecs() {
      return Object.values(this.displaySpecIndex);
    },
  },
  watch: {
    async isClearData() {
      if (this.isClearData) {
        this.specCount = 0;
        this.specIndex = { 1: -1, 2: -1, 3: -1 };
        this.displaySpecIndex = { 1: -1, 2: -1, 3: -1 };
        this.hideSelectedSkills = { 1: [], 2: [], 3: [] };
        this.skillIndex = { 1: -1, 2: -1, 3: -1 };
        this.selectedSkills = { 1: [], 2: [], 3: [] };
      }
    },
  },
  async beforeMount() {
    if (!this.filters) await this.$store.dispatch('quests/getFilters');
    if (this.skills && this.skills.length) await this.fillData();
  },
  methods: {
    async fillData() {
      const specKeys = {};
      let key = 1;
      // eslint-disable-next-line no-restricted-syntax
      for (const item of this.skills) {
        const [_spec, _skill] = item?.path ? item.path.split('.') : item.split('.');
        const spec = parseInt(_spec, 10);
        const skill = parseInt(_skill, 10);
        if (!Object.keys(specKeys).includes(_spec)) {
          specKeys[spec] = key;
          this.displaySpecIndex[key] = this.specsIndexes.indexOf(spec);
          this.selectedSkills[key] = [];
          this.specIndex[specKeys[spec]] = spec;
          key += 1;
        }
        const displaySkillIndex = this.skillsIndexes[this.displaySpecIndex[specKeys[spec]]].indexOf(skill);

        // eslint-disable-next-line no-continue
        if (this.hideSelectedSkills[specKeys[spec]].indexOf(displaySkillIndex) !== -1) continue;

        if (!this.hideSelectedSkills[specKeys[spec]]) this.hideSelectedSkills[specKeys[spec]] = [displaySkillIndex];
        else this.hideSelectedSkills[specKeys[spec]].push(displaySkillIndex);
        this.selectedSkills[specKeys[spec]].push({
          index: skill,
          name: this.skillsNames[this.displaySpecIndex[specKeys[spec]]][displaySkillIndex],
        });
      }
      this.specCount = key - 1;
      this.onChangeInputSpecs();
    },
    onChangeInputSpecs() {
      const specAndSkills = [];
      let key = 1;
      // eslint-disable-next-line guard-for-in,no-restricted-syntax
      for (const spec in this.specIndex) {
        if (this.specIndex[spec] !== -1) {
          for (let i = 0; i < this.selectedSkills[key].length; i += 1) {
            specAndSkills.push(`${this.specIndex[spec]}.${this.selectedSkills[key][i].index}`);
          }
        }
        key += 1;
      }
      this.$emit('changeSkills', specAndSkills);
    },
    addSkillToBadge(event, key) {
      const index = this.skillsIndexes[this.displaySpecIndex[key]][event];
      if (this.selectedSkills[key].length > 4
        || this.selectedSkills[key].filter((obj) => obj.index === index).length) return;
      this.selectedSkills[key].push({
        index,
        name: this.skillsNames[this.displaySpecIndex[key]][event],
      });
      this.hideSelectedSkills[key].push(event);
      this.onChangeInputSpecs();
    },
    removeSkillToBadge(skill, key) {
      let hideIndex = null;
      for (let i = 0; i < this.skillsIndexes[key].length; i += 1) {
        if (this.skillsIndexes[this.displaySpecIndex[key]][i] === skill.index) {
          hideIndex = i;
          break;
        }
      }
      const numberInHide = this.hideSelectedSkills[key].indexOf(hideIndex);
      if (numberInHide > -1) this.hideSelectedSkills[key].splice(numberInHide, 1);

      const numberInArray = this.selectedSkills[key].indexOf(skill);
      this.selectedSkills[key].splice(numberInArray, 1);
      if (!this.selectedSkills[key].length) this.skillIndex[key] = -1;
      this.onChangeInputSpecs();
    },
    switchSkill(event, key) {
      this.specIndex[key] = this.specsIndexes[event];
      this.skillIndex[key] = -1;
      this.selectedSkills[key] = [];
      this.hideSelectedSkills[key] = [];
      this.onChangeInputSpecs();
    },
    addSpecialization() {
      if (this.specCount <= 2) this.specCount += 1;
    },
    removeSpecialization(key) {
      this.selectedSkills[key] = [];
      this.specIndex[key] = -1;
      this.displaySpecIndex[key] = -1;
      this.skillIndex[key] = -1;
      this.specCount -= 1;
      this.onChangeInputSpecs();
    },
  },
};
</script>

<style lang="scss" scoped>
.selector {
  &__skills {
    width: 100%;
    display: grid;
    gap: 20px;
    .block {
      display: flex;
      grid-gap: 20px;
      justify-content: space-between;
      &__skill-spec {
        width: 100%;
      }
      &__specialization {
        display: flex;
        align-items: flex-start;
        flex-direction: row;
        grid-gap: 20px;
      }
      &__skill {
        display: flex;
        flex-direction: row;
        align-items: center;
        flex-wrap: wrap;
        grid-gap: 10px;
        .skill {
          &__badge {
            background: rgba(0, 131, 199, 0.1);
            border-radius: 44px;
            color: $blue;
            white-space: nowrap;
            grid-gap: 8px;
            padding: 5px 10px 5px 10px;
            display: flex;
            text-align: center;
            &-skills {
              padding: 15px;
            }
          }
        }
      }
    }
  }
  &__spec {
    flex-direction: row;
    flex-wrap: wrap;
    display: flex;
    max-width: 1180px;
    width: 100%;
    justify-content: flex-start;
  }
}
.specialization {
  &__dd {
    margin-bottom: 15px;
    width: 100%;
  }
  &__skills {
    width: 100%;
  }
  &__btn {
    text-align: center;
    &_remove {
      margin-top: 37px;
      width: 50%;
      background: #ffffff;
      color: #d73838;
      border: 1px solid #e79a9a;
    }
    &_remove:hover {
      background: #e79a9a;
    }
  }
}
.skills {
  &__add-info {
    display: flex;
    flex-wrap: nowrap;
    grid-gap: 20px;
    margin-top: 20px;
  }
  &__btn {
    &-add {
      text-align: center;
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
}
@include _767 {
  .selector {
    &__skills {
      .block {
        flex-direction: column;
        &__specialization {
          flex-direction: column;
          grid-gap: 0;
        }
      }
    }
  }
  .specialization {
    &__btn {
      &_remove {
        margin-top: 0;
      }
    }
  }
  .skills {
    &__add-info {
      display: flex;
      flex-wrap: nowrap;
      grid-gap: 20px;
      margin-top: 20px;
    }
  }
}
@include _575 {
  .specialization {
    &__btn {
      &_remove {
        width: 100%;
      }
    }
  }
  .skills {
    &__btn {
      &-add {
        width: 100%;
      }
    }
  }
}
</style>
