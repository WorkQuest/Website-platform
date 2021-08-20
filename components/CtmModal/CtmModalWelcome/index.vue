<template>
  <ctm-modal-box
    class="modal"
    :is-header="false"
    :title="$t('modals.addCard')"
  >
    <div class="modal__content content">
      <div class="content__header header">
        <div class="header__title">
          {{ $t('modals.welcomeToWorkQuest') }}
        </div>
        <div class="header__subtitle">
          {{ $t('modals.welcomeText') }}
        </div>
      </div>
      <div class="content__field">
        <div
          v-for="(elem, index) in skillsArray"
          :key="elem.id"
          class="content__body body"
        >
          <base-dd
            v-model="elem.sign"
            :type="'gray'"
            :items="items"
            class="body__drop"
          >
            <template
              v-slot:choose
              class="body__block"
            >
              <span
                v-if="elem.sign===-1"
                class="body__placeholder"
              >
                {{ $t('placeholders.default') }}
              </span>
            </template>
          </base-dd>
          <base-btn
            v-if="skillsArray.length===index+1"
            :mode="'grey'"
            class="body__add"
            @click="addSkill"
          >
            <span
              class="icon-plus body__picture"
            />
          </base-btn>
          <base-btn
            v-else
            :mode="'grey'"
            class="body__add"
            @click="removeSkill(elem.id)"
          >
            <span
              class="body__remove icon-close_big"
            />
          </base-btn>
        </div>
        <div class="content__buttons buttons">
          <div class="buttons__container">
            <base-btn
              class="buttons__action"
              @click="hide()"
            >
              {{ $t('meta.submit') }}
            </base-btn>

            <base-btn
              :mode="'outline'"
              class="buttons__action"
              @click="hide()"
            >
              {{ $t('meta.later') }}
            </base-btn>
          </div>
        </div>
      </div>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';
import modals from '~/store/modals/modals';

export default {
  element: Date.now(),
  name: 'ModalWelcome',
  data() {
    return {
      skillsArray: [{ sign: -1, id: Date.now() }],
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
    }),
    items() {
      return [
        this.$t('modals.paintingWork'),
        this.$t('modals.art'),
        this.$t('modals.cooking'),
        this.$t('modals.coding'),
      ];
    },
  },
  methods: {
    hide() {
      this.CloseModal();
    },
    addSkill() {
      return this.skillsArray.push({ id: Date.now(), sign: -1 });
    },
    removeSkill(id) {
      this.skillsArray = this.skillsArray.filter((item) => item.id !== id);
      return this.skillsArray;
    },
  },
};
</script>

<style lang="scss" scoped>
.modal {
  overflow: visible;
  max-width: 413px !important;
  height: auto;
}
.content{
  &__header {
    height: 141px;
    width: 100%;
    background: linear-gradient(135deg, #0083C7 0%, #00AA5B 100%);
    border-radius: 6px 6px 0 0;
  }
  &__field{
    padding: 20px;
  }
  &__body{
    display: flex;
  }
}
.body{
  justify-content: space-between;
  &__drop{
    display: block;
    width: 314px!important;
    margin-right: 10px;
  }
  &__picture{
    display: block;
    width: 46px;
  }
  &__add{
    width: 46px!important;
    margin-bottom: 10px;
  }
  &__picture:before{
    font-size: 24px;
    color: $blue;
  }
  &__remove:before{
    font-size: 24px;
    color: $red;
  }
  &__placeholder{
    color: #D8DFE3;
    font-size: 16px;
    line-height: 130%;
    margin-right: auto;
  }
}
.header {
  &__title {
    @include text-simple;
    font-weight: 700;
    font-size: 23px;
    color: $white;
    padding: 20px 0 10px 20px;
    width: 200px;
  }
  &__subtitle {
    @include text-simple;
    font-weight: 400;
    font-size: 16px;
    color: $white;
    padding: 0 0 20px 20px;
  }
}
.buttons{
  &__action{
    max-width: 176px!important;
  }
  &__container{
    width: 100%;
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
    margin-top: 22px;
  }
}
</style>
