<template>
  <div
    class="quests"
    data-selector="PAGE-MY-QUESTS"
  >
    <div class="quests__body">
      <div class="quests__title">
        {{ $t('meta.myQuests') }}
      </div>
      <div
        class="quests__content"
        :class="{'quests__content-wide': userRole === $options.UserRole.WORKER }"
      >
        <base-btn
          v-for="(item, i) in filterTabs"
          :key="i"
          :data-selector="`${item.name}`"
          :mode="selectedTab === item.id ? '' : 'light'"
          class="quests__btn"
          @click="filterByStatus(item.id)"
        >
          {{ item.name }}
        </base-btn>
      </div>
      <div class="quests__cards">
        <card-quest
          v-for="i of $options.QuestsLimit"
          v-show="isFetching"
          :key="i + 'skeleton'"
          is-skeleton
        />
        <card-quest
          v-for="(quest,i) in quests"
          v-show="!isFetching"
          :key="i"
          :quest="quest"
          :quest-index="i"
          @clickFavoriteStar="updateQuests(quest)"
        />
      </div>
      <empty-data
        v-if="!questsCount"
        :description="$t(`errors.emptyData.${userRole}.allQuests.desc`)"
        :btn-text="$t(`errors.emptyData.${userRole}.allQuests.btnText`)"
        :link="getEmptyLink"
      />
      <div class="quests__pager">
        <base-pager
          v-if="totalPages > 1"
          v-model="page"
          :total-pages="totalPages"
        />
      </div>
    </div>
  </div>
</template>

<script>

import { mapGetters } from 'vuex';
import { UserRole, Path } from '~/utils/enums';
import { QuestsLimit, QuestStatuses } from '~/utils/сonstants/quests';

export default {
  name: 'My',
  UserRole,
  QuestsLimit,
  data() {
    return {
      selectedTab: null,
      page: 1,
      statuses: '',
      requestParams: {},
      isFetching: true,
    };
  },
  computed: {
    ...mapGetters({
      userData: 'user/getUserData',
      userRole: 'user/getUserRole',
      quests: 'quests/getAllQuests',
      questsCount: 'quests/getAllQuestsCount',
    }),
    filterTabs() {
      const tabs = [
        { name: this.$t('myQuests.statuses.all'), id: null },
        { name: this.$t('myQuests.statuses.favorites'), id: 1 },
        { name: this.$t('myQuests.statuses.created'), id: 0 },
        { name: this.$t('myQuests.statuses.responded'), id: 2 },
        { name: this.$t('myQuests.statuses.invited'), id: 4 },
        { name: this.$t('myQuests.statuses.active'), id: 3 },
        {
          name: this.userRole === UserRole.WORKER
            ? this.$t('myQuests.statuses.performed')
            : this.$t('myQuests.statuses.completed'),
          id: 5,
        },
      ];
      return this.userRole === UserRole.EMPLOYER
        ? tabs.filter((tab) => (tab.id !== 2 && tab.id !== 4))
        : tabs.filter((tab) => (tab.id !== 0));
    },
    totalPages() {
      return Math.ceil(this.questsCount / QuestsLimit);
    },
    getEmptyLink() {
      return this.userRole === UserRole.WORKER ? '' : Path.CREATE_QUEST;
    },
  },
  watch: {
    async page() {
      this.isFetching = true;
      this.requestParams.query.offset = (this.page - 1) * QuestsLimit;
      this.ScrollToTop();
      await this.getQuests();
      this.isFetching = false;
    },
  },
  async mounted() {
    this.isFetching = true;
    this.requestParams = {
      role: this.userRole,
      specializations: null,
      userId: this.userData.id,
      query: {
        limit: QuestsLimit,
        offset: 0,
        'sort[createdAt]': 'desc',
      },
    };
    await this.getQuests();
    this.isFetching = false;
  },
  destroyed() {
    this.$store.commit('quests/setUserQuests', { count: 0, quests: [] });
    sessionStorage.removeItem('questsListFilter');
  },
  methods: {
    async getQuests() {
      const { requestParams } = this;
      sessionStorage.setItem('questsListFilter', JSON.stringify(requestParams));
      await this.$store.dispatch('quests/getUserQuests', requestParams);
    },
    async updateQuests(item) {
      this.isFetching = true;
      if (!item.star) await this.$store.dispatch('quests/setStarOnQuest', item.id);
      else await this.$store.dispatch('quests/takeAwayStarOnQuest', item.id);

      await this.getQuests();
      this.isFetching = false;
    },
    async filterByStatus(id) {
      this.isFetching = true;
      this.page = 1;
      this.selectedTab = id;
      this.requestParams.query.offset = 0;
      this.requestParams.query['sort[createdAt]'] = 'desc';
      delete this.requestParams.query['sort[invitedCreatedAt]'];
      delete this.requestParams.query.responded;
      delete this.requestParams.query.starred;
      delete this.requestParams.query.invited;
      delete this.requestParams.query['statuses[0]'];
      delete this.requestParams.query['statuses[1]'];
      delete this.requestParams.query['statuses[2]'];

      switch (id) {
        case 0:
          this.requestParams.query['statuses[0]'] = QuestStatuses.Created;
          this.requestParams.query['statuses[1]'] = QuestStatuses.Blocked;
          this.requestParams.query['statuses[2]'] = QuestStatuses.WaitWorkerOnAssign;
          break;
        case 1:
          this.requestParams.query.starred = true;
          break;
        case 2:
          this.requestParams.query.responded = true;
          break;
        case 3:
          this.requestParams.query['statuses[0]'] = QuestStatuses.WaitWorker;
          this.requestParams.query['statuses[1]'] = QuestStatuses.WaitEmployerConfirm;
          this.requestParams.query['statuses[2]'] = QuestStatuses.Dispute;
          break;
        case 4:
          delete this.requestParams.query['sort[createdAt]'];
          this.requestParams.query['sort[invitedCreatedAt]'] = 'desc';
          this.requestParams.query.invited = true;
          break;
        case 5:
          this.requestParams.query['statuses[0]'] = QuestStatuses.Done;
          break;
        default:
          break;
      }

      await this.getQuests();
      this.isFetching = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.quests {
  width: 100%;
  background-color: #f6f8fa;

  &__cards {
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 20px;
  }

  &__title {
    @include text-simple;
    font-style: normal;
    font-weight: 500;
    font-size: 25px;
    line-height: 130%;
    color: $black800;
    margin: 20px 0 20px 0;
  }

  &__body {
    width: 100%;
    max-width: 1180px;
  }

  &__content {
    display: grid;
    align-items: center;
    grid-template-columns: repeat(5, auto);
    grid-gap: 10px;
    margin-bottom: 20px;

    &-wide {
      grid-template-columns: repeat(6, auto);
    }
  }

  &__pager {
    margin-top: 25px;
  }
}

@include _767 {
  .quests__content {
    grid-template-columns: repeat(3, auto);
  }
}

@include _480 {
  .quests__content {
    grid-template-columns: repeat(2, auto);
  }
}
</style>
