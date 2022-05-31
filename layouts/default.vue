<template>
  <div
    class="primary"
    :class="{'stop-scrolling':isShow}"
  >
    <div class="primary__template template">
      <div
        class="template__content"
        :class="{'template__content_rows' : isChatOpened}"
      >
        <Header class="template__header" />
        <div
          class="template__main"
          :class="{'template__main_padding' : isChatOpened}"
        >
          <nuxt />
        </div>
        <Footer
          class="template__footer"
          :is-top-hidden="isChatOpened"
          @clickOnLogo="toMain"
        />
      </div>
    </div>
    <transition name="fade">
      <loader v-if="isLoading" />
    </transition>
    <ctm-modal />
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import ClickOutside from 'vue-click-outside';
import modals from '~/store/modals/modals';
import { Path } from '~/utils/enums';

export default {
  name: 'DefaultLayout',
  middleware: 'auth',
  directives: {
    ClickOutside,
  },
  computed: {
    ...mapGetters({
      isLoading: 'main/getIsLoading',
      userData: 'user/getUserData',
      isChatOpened: 'chat/isChatOpened',
      isShow: 'modals/getIsShow',
    }),
  },
  async mounted() {
    // TODO FOR BOUNTY 30.05, UNCOMMENT AFTER
    // if (!this.$cookies.get('isWorkQuestsAppShowed') && this.$route.path !== Path.WALLET) {
    //   this.ShowModal({
    //     key: modals.downloadApp,
    //     title: this.$tc('modals.titles.downloadApp'),
    //     subtitle: this.$t('modals.downOnSmartphone'),
    //     app: 'isWorkQuestsAppShowed',
    //   });
    // }
    this.GetLocation();
  },
  methods: {
    async getStatistic() {
      await this.$store.dispatch('user/getStatistic');
    },
    toMain() {
      if (this.userData.role === 'worker') {
        this.$router.push('/quests');
      }
      if (this.userData.role === 'employer') {
        this.$router.push('/workers');
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.primary {
  height: 100vh;
  background: $black0;
}

.template {
  min-height: 100vh;
  background: $black0;

  &__content {
    display: grid;
    grid-template-rows: 72px 1fr auto;
    min-height: 100vh;

    &_rows {
      grid-template-rows: 72px 1fr 72px;
    }
  }

  &__main {
    display: grid;
    padding-bottom: 80px;
    transition: 1s;
    width: 100%;

    &_padding {
      padding-bottom: 0;
    }
  }
}
.stop-scrolling{
  overflow: hidden;
  height: 100vh;
}
@include _991 {
  .template {
    &__content {
      grid-template-rows: 72px 1fr auto;
    }
  }
}
</style>
