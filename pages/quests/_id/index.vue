<template>
  <div
    v-if="questData"
    class="quest-page"
  >
    <info />
    <div class="main main-white">
      <div class="main__body main__body_20gap">
        <questPanel :location="questLocation" />

        <div class="quest__container">
          <h2 class="quest__title">
            {{ questData.title }}
          </h2>
          <span class="quest__description">
            {{ questData.description }}
          </span>
        </div>
        <div
          v-if="questData.medias && questData.medias.length"
          class="main__quest_materials"
        >
          <div class="quest_materials__title">
            {{ $t('quests.questMaterials') }}
          </div>
          <files-preview :medias="questData.medias" />
        </div>
        <div
          v-if="assignedWorker"
          class="worker-data"
        >
          <div class="worker-data__title">
            {{ $t('quests.worker') }}
          </div>
          <div class="worker-data__container">
            <nuxt-link
              :to="`/profile/${assignedWorker.id}`"
              class="worker-data__user-cont"
            >
              <img
                class="worker-data__avatar"
                :src="avatar"
                alt=""
              >
              <div class="worker-data__title worker-data__title_small">
                {{ assignedWorker.firstName }} {{ assignedWorker.lastName }}
              </div>
            </nuxt-link>
            <item-rating
              v-if="assignedWorker.ratingStatistic.status !== 'noStatus'"
              :rating="assignedWorker.ratingStatistic.status"
            />
          </div>
        </div>

        <div class="worker-data worker-data__more-data">
          <div
            v-if="actionBtnsArr.length"
            class="worker-data__btns"
          >
            <div
              v-for="(btn, i) in actionBtnsArr"
              :key="i"
              class="worker-data__button"
            >
              <base-btn
                :class="btn.class"
                :mode="btn.mode"
                :disabled="btn.disabled"
                @click="handleClickSpecBtn(btn.funcKey)"
              >
                {{ btn.name }}
                <template
                  v-if="btn.icon"
                  v-slot:right
                >
                  <span :class="btn.icon" />
                </template>
              </base-btn>
            </div>
          </div>
          <div class="worker-data__priority">
            <span class="worker-data__price">
              {{ questData.price }} {{ $t('quests.wusd') }}
            </span>
            <div
              class="worker-data__priority-title"
              :class="getPriorityClass"
            >
              {{ getPriority }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="main">
      <div class="main__body main__body_30gap">
        <div class="main__map">
          <transition name="fade-fast">
            <GmapMap
              ref="gMap"
              class="quests__map"
              language="en"
              :center="questLocation"
              :zoom="15"
              :options="{scrollWheel: false, navigationControl: false, mapTypeControl: false, scaleControl: false, height: '205px'}"
            >
              <GMapMarker
                v-for="(item, key) in locations"
                :key="key"
                :position="questLocation"
                :options="{ icon: pins.quest.blue, show: true}"
                @click="coordinatesChange(item)"
              >
                <GMapInfoWindow :options="{maxWidth: 280}">
                  <template>
                    <h3>{{ questData.title }}</h3>
                    <span>{{ questData.description }}</span>
                  </template>
                </GMapInfoWindow>
              </GMapMarker>
            </GmapMap>
          </transition>
        </div>
        <template v-if="userRole === 'employer' && infoDataMode === InfoModeEmployer.Created">
          <workers-list is-invited />
          <workers-list />
        </template>
        <div
          v-if="userRole === 'worker'"
          class="spec__container"
        >
          <div class="quest__group">
            <h2 class="quest__spec">
              {{ $t('quests.otherQuestsSpec') }}
              <nuxt-link
                :to="`/quests?specialization=${randomSpec}&statuses=0`"
                class="spec__link"
              >
                "{{ $t(`filters.items.${randomSpec}.title`) }}"
              </nuxt-link>
            </h2>
            <div class="quest__count">
              {{ `${otherQuestsCount} ${$t('quests.questsSmall')}` }}
            </div>
          </div>
          <div class="quest__card">
            <quests
              v-if="otherQuestsCount"
              :quests="sameQuest"
            />
            <emptyData
              v-else
              :description="$t(`errors.emptyData.emptyQuests`)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import {
  QuestStatuses, InfoModeWorker, InfoModeEmployer, UserRole, ResponseStatus,
} from '~/utils/enums';
import modals from '~/store/modals/modals';
import info from '~/components/app/info/index.vue';
import questPanel from '~/components/app/panels/questPanel';
import quests from '~/components/app/pages/common/quests';
import itemRating from '~/components/app/info/item-rating';
import emptyData from '~/components/app/info/emptyData';

export default {
  name: 'Quests',
  components: {
    info,
    questPanel,
    quests,
    itemRating,
    emptyData,
  },
  data() {
    return {
      questLocation: { lat: 0, lng: 0 },
      locations: {},
      currentLocation: {},
      pins: {
        quest: {
          red: '/img/app/marker_red.svg',
          green: '/img/app/marker_red.svg',
          yellow: '/img/app/marker_red.svg',
          blue: '/img/app/marker_blue.svg',
        },
        selected: '/img/app/marker_blue.svg',
        notSelected: '/img/app/marker_red.svg',
      },
      actionBtnsArr: [],
      sameQuest: [],
    };
  },
  computed: {
    ...mapGetters({
      questData: 'quests/getQuest',
      assignedWorker: 'quests/getAssignedWorker',
      userRole: 'user/getUserRole',
      infoDataMode: 'quests/getInfoDataMode',
      userData: 'user/getUserData',
      otherQuestsCount: 'quests/getAllQuestsCount',
      otherQuests: 'quests/getAllQuests',
    }),
    InfoModeEmployer() {
      return InfoModeEmployer;
    },
    avatar() {
      return this.assignedWorker.avatar?.url || require('~/assets/img/app/avatar_empty.png');
    },
    getPriority() {
      const { priority } = this.questData;

      const priorityLocale = ['low', 'normal', 'urgent'][priority];

      return priority !== null ? this.$t(`priority.${priorityLocale}`) : '';
    },
    getPriorityClass() {
      const { priority } = this.questData;

      const priorityModifier = ['low', 'normal', 'urgent'][priority];

      return priority !== null ? `worker-data__priority-title_${priorityModifier}` : '';
    },
    randomSpec() {
      const { questSpecializations } = this.questData;
      return Math.floor(questSpecializations[Math.floor(Math.random() * questSpecializations.length)].path);
    },
  },
  watch: {
    questData: {
      deep: true,
      async handler() {
        this.questLocation = {
          lat: this.questData.location.latitude,
          lng: this.questData.location.longitude,
        };
        this.locations = this.questLocation;
      },
    },
    infoDataMode(newVal, oldVal) {
      if (oldVal === undefined || newVal === oldVal) return;
      this.setActionBtnsArr();
    },
  },
  async beforeMount() {
    this.SetLoader(true);
    await this.getQuest();
    if (this.userRole === UserRole.WORKER) await this.getSameQuests();
    await this.getResponsesToQuest();
    await this.setActionBtnsArr();
    this.SetLoader(false);
  },
  methods: {
    async getSameQuests() {
      const skills = Object.keys(this.$t(`filters.items.${this.randomSpec}.sub`));
      const query = {
        limit: 10,
        statuses: [0],
      };
      for (let i = 0; i < skills.length; i += 1) {
        query[`specializations[${i}]`] = `${this.randomSpec}.${skills[i]}`;
      }
      await this.$store.dispatch('quests/getAllQuests', query);
      const questsData = this.otherQuests.filter((quest) => quest.id !== this.questData.id);
      if (questsData.length) this.sameQuest.push(questsData[Math.floor(Math.random() * questsData.length)]);
    },
    setActionBtnsArr() {
      const { questData: { questChat, assignedWorkerId }, userData, userRole } = this;

      const arr = userRole === UserRole.EMPLOYER ? this.setEmployerBtnsArr() : this.setWorkerBtnsArr();

      if (questChat?.workerId === userData.id || (questChat?.employerId === userData.id && assignedWorkerId)) {
        arr.push({
          name: this.$t('btn.goToChat'),
          class: 'base-btn_goToChat',
          mode: '',
          funcKey: 'goToChat',
          icon: 'icon-chat icon_fs-20',
          disabled: false,
        });
      }

      this.actionBtnsArr = arr;
    },
    setEmployerBtnsArr() {
      if (this.userData.id !== this.questData.userId) return [];

      const {
        WaitConfirm, Dispute, Created, Active,
      } = InfoModeEmployer;

      let arr = [];

      switch (this.infoDataMode) {
        case Created: {
          arr = [{
            name: this.$t('quests.raiseViews'),
            class: '',
            mode: '',
            funcKey: 'toRaisingViews',
            icon: '',
            disabled: false,
          },
          {
            name: this.$t('btn.closeQuest'),
            class: '',
            mode: 'delete',
            funcKey: 'closeQuest',
            icon: '',
            disabled: false,
          }];
          break;
        }
        case Active: {
          arr = [{
            name: this.$t('quests.approve'),
            class: '',
            mode: 'approve',
            funcKey: '',
            icon: '',
            disabled: true,
          }];
          break;
        }
        case WaitConfirm: {
          arr = [{
            name: this.$t('btn.acceptCompletedWorkOnQuest'),
            class: '',
            mode: 'approve',
            funcKey: 'acceptCompletedWorkOnQuest',
            icon: '',
            disabled: false,
          },
          {
            name: this.$t('btn.dispute'),
            class: 'base-btn_dispute',
            mode: '',
            funcKey: '',
            icon: '',
            disabled: true,
          }];
          break;
        }
        case Dispute: {
          arr = [{
            name: this.$t('btn.dispute'),
            class: '',
            mode: '',
            funcKey: 'openDispute',
            icon: '',
            disabled: false,
          }];
          break;
        }
        default: break;
      }

      return arr;
    },
    setWorkerBtnsArr() {
      const { questData: { assignedWorkerId, response }, userData, infoDataMode } = this;
      const {
        ADChat, Active, Created, Dispute, Invited, WaitWorker,
      } = InfoModeWorker;

      let arr = [];

      switch (infoDataMode) {
        case ADChat: {
          arr = [{
            name: this.$t('btn.agree'),
            class: '',
            mode: '',
            funcKey: 'acceptWorkOnQuest',
            icon: '',
            disabled: false,
          },
          {
            name: this.$t('btn.disagree'),
            class: '',
            mode: 'outline',
            funcKey: 'rejectWorkOnQuest',
            icon: '',
            disabled: false,
          }];
          break;
        }
        case Active: {
          if (assignedWorkerId !== userData.id) break;

          arr = [{
            name: this.$t('btn.dispute'),
            class: 'base-btn_dispute',
            mode: '',
            funcKey: '',
            icon: '',
            disabled: true,
          },
          {
            name: this.$t('btn.completeWorkOnQuest'),
            class: '',
            mode: '',
            funcKey: 'completeWorkOnQuest',
            icon: '',
            disabled: false,
          }];
          break;
        }
        case Created: {
          arr = [{
            name: this.$t('btn.sendARequest'),
            class: '',
            mode: '',
            funcKey: 'sendARequestOnQuest',
            icon: '',
            disabled: false,
          }];
          break;
        }
        case Dispute: {
          arr = [{
            name: this.$t('btn.dispute'),
            class: 'base-btn_dispute',
            mode: '',
            funcKey: '',
            icon: '',
            disabled: true,
          }];
          break;
        }
        case Invited: {
          if (response.status !== ResponseStatus.awaiting || (assignedWorkerId && assignedWorkerId !== userData.id)) break;

          arr = [{
            name: this.$t('btn.agree'),
            class: '',
            mode: '',
            funcKey: 'acceptQuestInvitation',
            icon: '',
            disabled: false,
          },
          {
            name: this.$t('btn.disagree'),
            class: '',
            mode: 'outline',
            funcKey: 'rejectQuestInvitation',
            icon: '',
            disabled: false,
          }].concat(arr);
          break;
        }
        case WaitWorker: {
          if (assignedWorkerId !== userData.id) break;

          arr = [{
            name: this.$t('btn.agree'),
            class: '',
            mode: '',
            funcKey: 'acceptWorkOnQuest',
            icon: '',
            disabled: false,
          },
          {
            name: this.$t('btn.disagree'),
            class: '',
            mode: 'outline',
            funcKey: 'rejectWorkOnQuest',
            icon: '',
            disabled: false,
          }];
          break;
        }
        default: break;
      }

      return arr;
    },
    handleClickSpecBtn(funcKey) {
      this[funcKey]();
    },
    async getQuest() {
      await this.$store.dispatch('quests/getQuest', this.$route.params.id);
    },
    async getResponsesToQuest() {
      const { questData: { id, user }, userData } = this;

      if (this.userRole === UserRole.EMPLOYER && user.id === userData.id) {
        await this.$store.dispatch('quests/responsesToQuest', id);
      }
    },
    coordinatesChange(item) {
      if (Object.keys(this.currentLocation).length > 0) {
        this.currentLocation = {};
      } else {
        this.currentLocation = item;
      }
    },
    async closeQuest() {
      const modalMode = 1;
      this.SetLoader(true);
      if (this.questData.status !== InfoModeEmployer.Active) {
        await this.$store.dispatch('quests/closeQuest', this.questData.id);
        this.showQuestModal(modalMode);
      }
      await this.$router.push('/my');
      this.SetLoader(false);
    },
    openDispute() {
      const modalMode = 4;
      this.showQuestModal(modalMode);
    },
    async acceptCompletedWorkOnQuest() {
      const modalMode = 2;
      this.SetLoader(true);
      await this.$store.dispatch('quests/acceptCompletedWorkOnQuest', this.questData.id);
      this.showQuestModal(modalMode);
      await this.$store.dispatch('quests/setInfoDataMode', InfoModeEmployer.Done);
      this.SetLoader(false);
    },
    toRaisingViews() {
      if (![QuestStatuses.Closed, QuestStatuses.Dispute].includes(this.questData.status)) {
        this.$router.push({ path: `/edit-quest/${this.questData.id}`, query: { mode: 'raise' } });
        this.$store.commit('quests/setCurrentStepEditQuest', 2);
      } else {
        this.showToastWrongStatusRaisingViews();
      }
    },
    showToastWrongStatusRaisingViews() {
      return this.$store.dispatch('main/showToast', {
        title: this.$t('toasts.questInfo'),
        variant: 'warning',
        text: this.$t('toasts.questCantRaisingViews'),
      });
    },
    showQuestModal(modalMode) {
      this.ShowModal({
        key: modals.status,
        img: require('~/assets/img/ui/questAgreed.svg'),
        title: this.$t('quests.questInfo'),
        subtitle: this.modalMode(modalMode),
      });
    },
    modalMode(modalMode) {
      const subtitles = {
        1: this.$t('quests.questClosed'),
        2: this.$t('quests.completedWorkAccepted'),
        3: this.$t('quests.completedWorkRejected'),
        4: 'Discussion flow in progress..',
      };
      return subtitles[modalMode];
    },
    async rejectQuestInvitation() {
      this.SetLoader(true);
      await this.$store.dispatch('quests/rejectQuestInvitation', this.questData.response.id);
      await this.getQuest();
      this.setActionBtnsArr();
      this.SetLoader(false);
    },
    async acceptQuestInvitation() {
      this.SetLoader(true);
      await this.$store.dispatch('quests/acceptQuestInvitation', this.questData.response.id);
      await this.getQuest();
      this.setActionBtnsArr();
      this.SetLoader(false);
    },
    async goToChat() {
      this.SetLoader(true);
      await this.$router.push(`/messages/${this.questData.questChat.chatId}`);
      this.SetLoader(false);
    },
    async acceptWorkOnQuest() {
      this.SetLoader(true);
      if (await this.$store.dispatch('quests/acceptWorkOnQuest', this.questData.id)) {
        this.ShowModal({
          key: modals.status,
          img: require('~/assets/img/ui/questAgreed.svg'),
          title: this.$t('quests.questInfo'),
          subtitle: this.$t('quests.workOnQuestAccepted'),
        });
        await this.getQuest();
      }
      this.SetLoader(false);
    },
    async rejectWorkOnQuest() {
      this.SetLoader(true);
      if (await this.$store.dispatch('quests/rejectWorkOnQuest', this.questData.id)) {
        await this.getQuest();
        this.ShowModal({
          key: modals.status,
          img: require('~/assets/img/ui/questAgreed.svg'),
          title: this.$t('quests.questInfo'),
          subtitle: this.$t('quests.workOnQuestRejected'),
        });
        await this.getQuest();
      }
      this.SetLoader(false);
    },
    async completeWorkOnQuest() {
      this.SetLoader(true);
      if (await this.$store.dispatch('quests/completeWorkOnQuest', this.questData.id)) {
        await this.getQuest();
        this.ShowModal({
          key: modals.status,
          img: require('~/assets/img/ui/questAgreed.svg'),
          title: this.$t('quests.questInfo'),
          subtitle: this.$t('quests.pleaseWaitEmp'),
        });
      }
      this.SetLoader(false);
    },
    async sendARequestOnQuest() {
      this.ShowModal({
        key: modals.sendARequest,
        questId: this.questData.id,
      });
    },
  },
};
</script>

<style lang="scss">
.gm-svpc {
  top: 27px !important;
}
</style>

<style lang="scss" scoped>
.quest {
  &__container {
    display: flex;
    flex-direction: column;
  }
  &__title {
    @include text-simple;
    font-weight: 500;
    font-size: 30px;
    color: $black800;
    line-height: 39px;
    word-wrap: break-word;
  }
  &__description {
    @include text-simple;
    margin-top: 10px;
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
    color: $black700;
    word-wrap: break-word
  }
  &__count {
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 130%;
    color: #8D96A2;
  }
}
.main {
  @include main;
  &-white {
    @include main-white;
  }

  &__body {
    display: grid;

    &_30gap {
      gap: 30px;
    }

    &_20gap {
      gap: 20px;
    }
  }

  &__quest_materials {
    padding-top: 20px;
    border-top: 1px solid #F7F8FA;
  }
}

.worker-data {
  padding-top: 20px;
  border-top: 1px solid #F7F8FA;

  &__title {
    font-weight: 500;
    color: $black800;
    font-size: 18px;

    &_small {
      font-size: 16px;
    }
  }

  &__container {
    display: grid;
    grid-auto-flow: column;
    gap: 10px;
    justify-content: start;
    align-items: center;
    margin-top: 20px;
  }

  &__user-cont {
    display: grid;
    grid-auto-flow: column;
    gap: 10px;
    justify-content: start;
    align-items: center;
  }

  &__avatar {
    border-radius: 50%;
    width: 40px;
    height: 40px;
    cursor: pointer;
  }

  &__more-data {
    display: grid;
    grid-template-columns: 1fr max-content;
    padding-bottom: 20px;
  }

  &__btns {
    display: grid;
    grid-auto-flow: column;
    align-items: center;
    gap: 20px;
    justify-content: start;
  }

  &__button {
    width: 220px;
  }

  &__priority {
    display: grid;
    grid-auto-flow: column;
    gap: 15px;
    align-items: center;
    justify-content: end;
  }

  &__priority-title {
    @include text-simple;
    display: flex;
    align-items: center;
    border-radius: 3px;
    font-size: 12px;
    height: 24px;
    padding: 0 5px;
    &_low {
      background: rgba(34, 204, 20, 0.1);
      color: #22CC14;
    }
    &_urgent {
      background: rgba(223, 51, 51, 0.1);
      color: #DF3333;
    }
    &_normal {
      background: rgba(232, 210, 13, 0.1);
      color: #E8D20D;
    }
  }

  &__price {
    @include text-simple;
    color: $green;
    font-weight: bold;
    font-size: 25px;
  }
}

.spec {
  @include text-simple;
  font-weight: 500;
  font-size: 25px;
  &__link{
    @extend .spec;
    color: $blue;
  }
}

.quest_materials {
  &__title {
    @include text-simple;
    font-style: normal;
    font-weight: 500;
    font-size: 18px;
    color: $black800;
    padding: 0 0 20px 0;
  }
}

.map {
  &__container {
    padding: 0;
    display: flex;
    justify-content: center;
    .gmap__block {
      max-width: 1180px;
      width: 100%;
    }
  }
}

.quests::v-deep {

  .ctm-field__left {
    padding-top: 6px;
  }
}

.icon {
  color: $black500;
  font-size: 20px;
  &-chat::before {
    @extend .icon;
    color: $green !important;
  }
  &-location::before {
    @extend .icon;
  }
  &-clock::before {
    @extend .icon;
  }
  &-share_outline {
    @extend .icon;
    margin-left: 5px;
  }
  &-chat_green:before {
    @extend .icon;
    content: "\e9ba";
    color: #00AA5B;
  }
  &-caret_down_blue:before {
    @extend .icon;
    content: "\ea48";
    color: #0083C7;
  }
  &-chevron_big_left:before {
    @extend .icon;
    content: "\ea4d";
    color: #0083C7;
  }
  &-location:before {
    @extend .icon;
    content: "\ea23";
  }
}

@include _1199 {
  .main__body,
  .main {
    padding: 10px;
  }
}
@include _991 {
  .main-white {
    display: block;
  }
}
@include _767 {
  .main {
    display: block;
  }
}
@include _575 {
  .location {
    &__container {
      display: grid;
      grid-template-columns: auto;
      grid-gap: 5px;
    }
  }
  .icon {
    &-clock, &-location {
      width: 30px;
    }
  }
  .quest {
    &__spec {
      font-size: 16px;
    }
  }
  .spec {
    &__link {
      font-size: 16px;
    }
  }
}
</style>
