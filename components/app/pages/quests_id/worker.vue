<template>
  <div
    v-if="userRole === 'worker'"
    class="btns__container"
  >
    <div
      v-if="infoDataMode === 1"
      class="btns__wrapper"
    >
      <div class="btn__wrapper">
        <base-btn
          @click="acceptWorkOnQuest"
        >
          {{ $t('btn.agree') }}
        </base-btn>
      </div>
      <div class="btn__wrapper">
        <base-btn
          mode="outline"
          @click="rejectWorkOnQuest"
        >
          {{ $t('btn.disagree') }}
        </base-btn>
      </div>
      <div class="btn__wrapper">
        <base-btn
          class="base-btn_goToChat"
          @click="goToChat"
        >
          {{ $t('btn.goToChat') }}
          <template v-slot:right>
            <span class="icon-chat icon_fs-20" />
          </template>
        </base-btn>
      </div>
    </div>
    <div
      v-if="infoDataMode === 2"
      class="btns__wrapper"
    >
      <div class="btn__wrapper">
        <base-btn
          disabled="true"
          class="base-btn_dispute"
        >
          {{ $t('btn.dispute') }}
        </base-btn>
      </div>
      <div class="btn__wrapper">
        <base-btn
          @click="completeWorkOnQuest"
        >
          {{ $t('btn.completeWorkOnQuest') }}
        </base-btn>
      </div>
      <div class="btn__wrapper">
        <base-btn
          class="base-btn_goToChat"
          @click="goToChat"
        >
          {{ $t('btn.goToChat') }}
          <template v-slot:right>
            <span class="icon-chat icon_fs-20" />
          </template>
        </base-btn>
      </div>
    </div>
    <div
      v-if="infoDataMode === 3"
      class="btns__wrapper"
    >
      <div class="btn__wrapper">
        <base-btn
          :disabled="true"
          @click="sendARequestOnQuest"
        >
          {{ $t('btn.responded') }}
        </base-btn>
      </div>
    </div>
    <div
      v-if="infoDataMode === 5"
      class="btns__wrapper"
    >
      <div class="btn__wrapper">
        <base-btn
          @click="sendARequestOnQuest"
        >
          {{ $t('btn.sendARequest') }}
        </base-btn>
      </div>
    </div>
    <div
      v-if="infoDataMode !== 4"
      class="price__container"
    >
      <span class="price__value">
        {{ questData.price }} WUSD
      </span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import modals from '~/store/modals/modals';

export default {
  name: 'QuestIdWorker',
  props: {
    infoData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      questData: {},
      userAvatar: '',
      questResponses: {},
      response: {},
    };
  },
  computed: {
    ...mapGetters({
      userData: 'user/getUserData',
      userRole: 'user/getUserRole',
      infoDataMode: 'quests/getInfoDataMode',
    }),
  },
  async mounted() {
    this.SetLoader(true);
    await this.getResponsesToQuestForAuthUser();
    await this.initData();
    // await this.getResponseId();
    this.SetLoader(false);
  },
  methods: {
    async initData() {
      this.questData = await this.$store.dispatch('quests/getQuest', this.$route.params.id);
    },
    async goToChat() {
      this.SetLoader(true);
      await this.$router.push('/messages/1');
      this.SetLoader(false);
    },
    async acceptWorkOnQuest() {
      this.SetLoader(true);
      await this.$store.dispatch('quests/acceptWorkOnQuest', this.questData.id);
      this.ShowModal({
        key: modals.status,
        img: require('~/assets/img/ui/questAgreed.svg'),
        title: 'Quest info',
        subtitle: 'Work on quest accepted!',
      });
      await this.$store.dispatch('quests/setInfoDataMode', 2);
      this.SetLoader(false);
    },
    async rejectWorkOnQuest() {
      this.SetLoader(true);
      await this.$store.dispatch('quests/rejectWorkOnQuest', this.questData.id);
      this.ShowModal({
        key: modals.status,
        img: require('~/assets/img/ui/questAgreed.svg'),
        title: 'Quest info',
        subtitle: 'Work on quest rejected!',
      });
      await this.$store.dispatch('quests/setInfoDataMode', 5);
      this.SetLoader(false);
    },
    async completeWorkOnQuest() {
      this.SetLoader(true);
      await this.$store.dispatch('quests/completeWorkOnQuest', this.questData.id);
      this.ShowModal({
        key: modals.status,
        img: require('~/assets/img/ui/questAgreed.svg'),
        title: 'Quest info',
        subtitle: 'Work on quest completed! Please, wait your employer!',
      });
      await this.$store.dispatch('quests/setInfoDataMode', 4);
      this.SetLoader(false);
    },
    // async getResponseId() {
    //   if (this.userRole === 'worker') {
    //     const questId = this.$route.path.slice(8);
    //     const { responses } = this.questResponses;
    //     this.response = responses.filter((r) => r.quest.id === questId);
    //   }
    // },
    async getResponsesToQuestForAuthUser() {
      if (this.userRole === 'worker') {
        this.questResponses = await this.$store.dispatch('quests/getResponsesToQuestForAuthUser');
      }
    },
    // async acceptQuestInvitationWorker(responseId) {
    //   if (this.userRole === 'worker') {
    //     await this.$store.dispatch('quests/acceptQuestInvitation', responseId);
    //     await this.$store.dispatch('quests/setInfoDataMode', 2);
    //   }
    // },
    async sendARequestOnQuest() {
      this.ShowModal({
        key: modals.sendARequest,
        questId: this.questData.id,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.price {
  display: flex;
  flex-direction: row;
  align-items: center;
  &__value {
    @include text-simple;
    color: $green;
    font-weight: bold;
    font-size: 25px;
  }
  &__container {
    @extend .price;
    justify-content: flex-end;
  }
  &__wrapper {
    @extend .price;
    margin:0 0 30px 0;
    justify-content: space-between;
  }
}
.btns {
  &__container {
    display: grid;
    grid-template-columns: 8fr 4fr;
    margin-bottom: 20px;
  }
  &__wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
}
.btn {
  &__wrapper {
    width: 220px;
    margin: 0 20px 0 0;
  }
}

</style>
