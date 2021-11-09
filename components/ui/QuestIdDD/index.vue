<template>
  <div
    v-click-outside="hideDd"
    class="quest"
  >
    <button
      class="quest__button quest__button_menu"
      @click="showQuestMenu()"
    >
      <span
        :class="[
          { 'icon-more_horizontal': userRole === 'employer' },
          { 'icon-share_outline': userRole === 'worker' },
        ]"
      />
      <transition name="fade">
        <div
          v-if="isShowQuestMenu"
          class="quest menu"
        >
          <div class="menu menu__items">
            <span
              class="menu__container"
            >
              <div
                v-if="['employer'].includes(userRole)"
                class="menu__item"
                @click="startChat()"
              >
                <div
                  class="menu__text"
                >
                  {{ $t('quests.startChat') }}
                </div>
              </div>
              <div
                v-if="['employer'].includes(userRole)"
                class="menu__item"
                @click="selectedWorker.length === 0 ? selectWorker(i) : removeWorker()"
              >
                <div
                  class="menu__text"
                >
                  {{ $t('quests.invite') }}
                </div>
              </div>
              <div
                v-if="['employer'].includes(userRole)"
                class="menu__item"
                @click="rejectQuestInvitation(responseId)"
              >
                <div
                  class="menu__text"
                >
                  {{ $t('quests.decline') }}
                </div>
              </div>
            </span>
          </div>
        </div>
      </transition>
    </button>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ClickOutside from 'vue-click-outside';
import modals from '~/store/modals/modals';

export default {
  name: 'ChatMenu',
  directives: {
    ClickOutside,
  },
  props: {
    i: {
      type: [Number, null],
      default: null,
    },
    responseId: {
      type: [String, null],
      default: null,
    },
  },
  data() {
    return {
      isShowQuestMenu: false,
      selectedWorker: [],
    };
  },
  computed: {
    ...mapGetters({
      questData: 'quests/getQuest',
      userRole: 'user/getUserRole',
      responsesToQuest: 'quests/getResponsesToQuest',
    }),
  },
  async created() {
    await this.initData();
    await this.getResponsesToQuest();
  },
  methods: {
    startChat() {
      // TODO: Написать метод для интеграции с бэком, будет готово
    },
    async initData() {
      await this.$store.dispatch('quests/getQuest', this.$route.params.id);
    },
    async getResponsesToQuest() {
      if (this.userRole === 'employer') {
        await this.$store.dispatch('quests/responsesToQuest', this.questData.id);
      }
    },
    async removeWorker() {
      this.selectedWorker.length = 0;
    },
    async selectWorker(i) {
      this.SetLoader(true);
      const { worker } = this.responsesToQuest[i];
      if (this.selectedWorker.length === 0) {
        this.showToastInvited();
        this.selectedWorker.push(worker);
      }
      this.SetLoader(false);
    },
    async rejectQuestInvitation(responseId) {
      this.SetLoader(true);
      await this.$store.dispatch('quests/rejectQuestInvitation', responseId);
      this.showToastReject();
      this.SetLoader(false);
    },
    showToastInvited() {
      return this.$store.dispatch('main/showToast', {
        title: 'Info',
        variant: 'success',
        text: 'Worker invited!',
      });
    },
    showToastReject() {
      return this.$store.dispatch('main/showToast', {
        title: 'Info',
        variant: 'danger',
        text: 'Worker rejected!',
      });
    },
    hideDd() {
      this.isShowQuestMenu = false;
    },
    showQuestMenu() {
      this.isShowQuestMenu = !this.isShowQuestMenu;
    },
  },
};
</script>

<style lang="scss" scoped>
.icon {
  color: $black500;
  font-size: 19px;
  &-more_horizontal {
    @extend .icon;
  }
  &-share_outline {
    @extend .icon;
  }
}

.quest {
  &__button {
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 130%;
    color: $black600;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    width: 20px;
    height: 20px;
    border: 1px solid transparent;
    &:hover {
      color: $black800;
    }
    &_menu {
      width: 30px;
      height: 30px;
    }
  }
}

//TODO: Закрепить меню под кнопкой
.menu {
  position: absolute;
  top: calc(70px + 5px);
  background: #FFFFFF;
  box-shadow: 0 17px 17px rgba(0, 0, 0, 0.05), 0 5.125px 5.125px rgba(0, 0, 0, 0.03), 0 2.12866px 2.12866px rgba(0, 0, 0, 0.025), 0 0.769896px 0.769896px rgba(0, 0, 0, 0.0174206);
  border-radius: 6px;
  min-width: 120px;
  z-index: 10000000;
  margin: 0 73px 0 0;
  &__container {
    display: grid;
    grid-template-columns: 1fr;
    justify-items: flex-start;

  }
  &__item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    min-height: 20px;
    width: 100%;
    border-bottom: 1px solid $black100;
  }
  &__text {
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 130%;
    color: $black500;
    transition: .5s;
    padding: 12px 15px;
    &:hover {
      color: $black800;
    }
    &:last-child {
      border: none;
    }
  }
}

@include _991 {
  .quest {
    &-menu {
      width: max-content;
    }
  }
}
</style>
