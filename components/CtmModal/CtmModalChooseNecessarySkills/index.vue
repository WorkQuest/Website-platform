<template>
  <ctm-modal-box
    :title="$tc('modals.titles.chooseSkills')"
    class="messageSend"
  >
    <div class="ctm-modal__content">
      <div class="messageSend">
        <div
          id="container"
          class="messageSend__content"
        >
          <div
            v-for="(skill, i) in skills"
            id="skill"
            :key="i"
            class="skill"
          >
            <div>
              <base-dd
                v-model="skill.value"
                type="gray"
                :items="ddList"
                :placeholder="skill.value"
                :data-selector="`SKILL-${i}`"
              />
            </div>
            <div>
              <base-btn
                v-if="!skill.added || skill.added === null"
                mode="grey"
                data-selector="ADD-NEW-SKILL"
                @click="addNewSkill(currentValue, skill)"
              >
                <template :v-slot="right">
                  <span
                    class="icon-plus"
                  />
                </template>
              </base-btn>
              <base-btn
                v-if="skill.added"
                mode="grey"
                data-selector="DELETE-SKILL"
                @click="deleteSkill()"
              >
                <template :v-slot="right">
                  <span
                    class="icon-close_big"
                  />
                </template>
              </base-btn>
            </div>
          </div>

          <div class="btn__container">
            <div class="btn__wrapper">
              <base-btn
                class="btn__apply"
                data-selector="APPLY"
                @click="success()"
              >
                {{ $t('meta.btns.apply') }}
              </base-btn>
            </div>
            <div class="btn__wrapper">
              <base-btn
                mode="outline"
                data-selector="CANCEL"
                class="message__action"
                @click="CloseModal"
              >
                {{ $t('meta.btns.cancel') }}
              </base-btn>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ctm-modal-box>
</template>

<script>
import modals from '~/store/modals/modals';
import { images } from '~/utils/images';

export default {
  name: 'CtmModalChooseNecessarySkills',
  data() {
    return {
      codeInput: '',
      currentValue: '',
      skills: [
        {
          value: 1,
          added: false,
        },
      ],
      ddList: [
        this.$t('modals.paintingWork'),
        this.$t('modals.art'),
        this.$t('modals.cooking'),
        this.$t('modals.coding'),
      ],
    };
  },
  methods: {
    addNewSkill(currentValue, skill) {
      const newSkill = { value: skill.value, added: true };
      this.skills.unshift(newSkill);
    },
    deleteSkill(i) {
      this.skills.splice(i, 1);
    },

    success() {
      this.ShowModal({
        key: modals.status,
        img: images.SUCCESS,
        title: this.$t('meta.success'),
        subtitle: this.$t('modals.yourRoleHasBeenChanged'),
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.ctm-modal {
  @include modalKit;
}

.icon {
  &-plus:before {
    content: "\e9a8";
    font-size: 20px;
    color: $blue;
  }
  &-close_big:before {
    content: "\e948";
    font-size: 20px;
    color: $red;
  }
}
.skill {
  width: 100%;
  display: grid;
  grid-template-columns: 5fr 1fr;
  grid-gap: 10px;
  margin: 0 0 10px 0;
}

.message {
  &__action {
    width: 100%;
  }
  &__top {
    display: flex;
    justify-self: flex-start;
  }
  &__sub {
    @include text-simple;
    font-weight: 400;
    color: $black400;
    font-size: 14px;
  }
}

.btn {
  &__container {
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
    margin: 0;
    width: 100%;
  }
  &__wrapper {
    width: 45%;
  }
}

.messageSend {
  max-width: 400px !important;
  &__content {
    display: grid;
    grid-template-columns: 1fr;
    justify-items: center;
    grid-gap: 10px;
  }
  &__action {
    margin-top: 10px;
    width: 100%;
  }
}
</style>
