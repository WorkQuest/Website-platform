<template>
  <ctm-modal-box
    :title="$t('modals.chooseSkills')"
    class="messageSend"
  >
    <div class="ctm-modal__content">
      <div class="messageSend">
        <div
          id="container"
          class="messageSend__content"
        >
          <div
            id="skill"
            slot="skill"
            class="skill"
          >
            <div>
              <base-dd
                type="gray"
                :items="items"
              />
            </div>
            <div>
              <base-btn
                :mode="'grey'"
                @click="addSkill()"
              >
                <template :v-slot="right">
                  <span
                    v-if="added"
                    class="icon-close_big"
                  />
                  <span
                    v-if="!added"
                    class="icon-plus"
                  />
                </template>
              </base-btn>
            </div>
          </div>
          <div class="btn__container">
            <div class="btn__wrapper">
              <base-btn
                class="btn__apply"
                @click="hide()"
              >
                {{ $t('meta.apply') }}
              </base-btn>
            </div>
            <div class="btn__wrapper">
              <base-btn
                :mode="'outline'"
                class="message__action"
                @click="hide()"
              >
                {{ $t('meta.cancel') }}
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

export default {
  name: 'CtmModalChooseNecessarySkills',
  data() {
    return {
      codeInput: '',
      added: false,
      items: [
        this.$t('modals.paintingWork'),
        this.$t('modals.art'),
        this.$t('modals.cooking'),
        this.$t('modals.coding'),
      ],
    };
  },
  methods: {
    addSkill() {
      const container = document.querySelector('#container');
      const before = document.querySelector('#skill');
      const clonedNode = document.getElementById('skill').cloneNode(true);
      console.log(clonedNode.slot);
      this.added = true;
      container.insertBefore(clonedNode, before);
    },

    hide() {
      this.CloseModal();
    },
    success() {
      this.ShowModal({
        key: modals.status,
        img: require('~/assets/img/ui/success.svg'),
        title: 'Success',
        subtitle: 'Your role has been changed',
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
