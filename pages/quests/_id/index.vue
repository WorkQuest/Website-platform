<template>
  <div
    v-if="quest"
    class="quest-page"
    data-selector="PAGE-QUESTS-ID"
  >
    <info />
    <div class="main main-white">
      <div class="main__body main__body_20gap">
        <quest-panel :location="questLocation" />
        <div class="quest__container">
          <h2 class="quest__title">
            {{ quest.title }}
          </h2>
          <span class="quest__description">
            {{ quest.description }}
          </span>
        </div>
        <div
          v-if="quest.medias && quest.medias.length"
          class="main__quest_materials"
        >
          <div class="quest_materials__title">
            {{ $t('quests.questMaterials') }}
          </div>
          <files-preview :medias="quest.medias" />
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
              :to="`${$options.Path.PROFILE}/${assignedWorker.id}`"
              :data-selector="`TO-ASSIGNED-WORKER-PROFILE-${assignedWorker.id}`"
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
            <item-rating :rating="assignedWorker.ratingStatistic.status" />
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
                :selector="`ACTION-BTNS-ARRAY-${i}`"
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
            <star-rating
              v-if="starRating(quest)"
              rating-type="questPage"
              :stars-number="5"
              :rating="rating"
              :is-disabled="!!rating"
              @input="showReviewModal($event, quest.id)"
            />
            <span class="worker-data__price">
              {{ questReward }} {{ $t('meta.coins.wusd') }}
            </span>
            <div
              class="worker-data__payPeriod"
            >
              {{ $tc(`quests.payPeriods.${quest.payPeriod}`) }}
            </div>
            <div
              class="worker-data__priority-title"
              :class="priorityClass"
            >
              {{ priority }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <g-map-loader
      class="map"
      :is-draggable="false"
    />

    <div class="main">
      <div class="main__body main__body_30gap">
        <template
          v-if="userRole === $options.UserRole.EMPLOYER
            && (infoDataMode === $options.InfoModeEmployer.Created || infoDataMode === $options.InfoModeEmployer.WaitWorkerOnAssign)"
        >
          <workers-list is-invited />
          <workers-list />
        </template>
        <div
          v-if="userRole === $options.UserRole.WORKER"
          class="spec__container"
        >
          <div class="quest__group">
            <h2 class="quest__spec">
              {{ $t('quests.otherQuestsSpec') }}
              <nuxt-link
                :data-selector="`ACTION-TO-SPEC-${randomSpec}`"
                :to="`${$options.Path.QUESTS}?specializations=${randomSpec}&statuses=0`"
                class="spec__link"
              >
                "{{ $t(`filters.skills.${randomSpec}.title`) }}"
              </nuxt-link>
            </h2>
            <div class="quest__count">
              {{ `${otherQuestsCount > 0 ? otherQuestsCount : 0} ${$t('meta.questsSmall')}` }}
            </div>
          </div>
          <div class="quest__card">
            <card-quest
              v-if="otherQuestsCount"
              :key="sameQuest.id"
              :quest="sameQuest"
            />
            <empty-data
              v-else
              :description="$tc(`errors.emptyData.emptyQuests`)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else-if="!isLoading">
    <empty-data
      :description="$tc('errors.emptyData.emptyQuests')"
      :link="$options.Path.QUESTS"
      :btn-text="$tc('meta.btns.ok')"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import BigNumber from 'bignumber.js';
import {
  Path,
  UserRole,
  ResponseStatus,
  questPriority,
  QuestModeReview,
  TokenSymbols,
} from '~/utils/enums';

import { NotificationAction } from '~/utils/notifications';
import modals from '~/store/modals/modals';
import {
  QuestMethods, EditQuestState, QuestStatuses, InfoModeWorker, InfoModeEmployer,
} from '~/utils/сonstants/quests';
import { images } from '~/utils/images';
import { WorkQuest, WQFactory } from '~/abi';
import { fetchContractData } from '~/utils/web3';
import { getWalletAddress, GetWalletProvider } from '~/utils/wallet';

export default {
  name: 'Quests',
  UserRole,
  QuestStatuses,
  InfoModeEmployer,
  Path,
  data() {
    return {
      questLocation: { lat: 0, lng: 0 },
      actionBtnsArr: [],
      sameQuest: {},
      mounted: false,
    };
  },
  computed: {
    ...mapGetters({
      isWalletConnected: 'wallet/getIsWalletConnected',
      userAddress: 'user/getUserWalletAddress',
      quest: 'quests/getQuest',
      assignedWorker: 'quests/getAssignedWorker',
      userRole: 'user/getUserRole',
      infoDataMode: 'quests/getInfoDataMode',
      userData: 'user/getUserData',
      otherQuestsCount: 'quests/getAllQuestsCount',
      otherQuests: 'quests/getAllQuests',
      isLoading: 'main/getIsLoading',
      notifications: 'notifications/getNotificationsList',
    }),
    isEmployer() {
      return this.userRole === UserRole.EMPLOYER;
    },
    questReward() {
      return new BigNumber(this.quest.price).shiftedBy(-18).toString();
    },
    rating() {
      return this.quest.yourReview?.mark || 0;
    },
    avatar() {
      return this.assignedWorker.avatar?.url || images.EMPTY_AVATAR;
    },
    priority() {
      const { priority } = this.quest;
      const priorities = {
        [questPriority.Low]: this.$t('meta.priority.fixedDelivery'),
        [questPriority.Normal]: this.$t('meta.priority.shortTerm'),
        [questPriority.Urgent]: this.$t('meta.priority.urgent'),
      };
      return priorities[priority] || '';
    },
    priorityClass() {
      const { priority } = this.quest;
      const priorities = {
        [questPriority.Low]: 'worker-data__priority-title_low',
        [questPriority.Normal]: 'worker-data__priority-title_normal',
        [questPriority.Urgent]: 'worker-data__priority-title_urgent',
      };
      return priorities[priority] || '';
    },
    randomSpec() {
      const { questSpecializations } = this.quest;
      if (!questSpecializations.length) return '';
      return Math.floor(questSpecializations[Math.floor(Math.random() * questSpecializations.length)].path);
    },
    checkAvailabilityDisputeTime() {
      const now = this.$moment().valueOf();
      // TODO fixme Вернуть, нужно для тестов Роме
      // this.$moment(this.quest.startedAt).add(1, 'day').valueOf();
      return now >= this.$moment(this.quest.startedAt).add(1, 'm').valueOf();
    },
  },
  watch: {
    infoDataMode(newVal, oldVal) {
      if (oldVal === undefined || newVal === oldVal) return;
      this.setActionBtnsArr();
    },
    notifications: {
      handler() {
        const notification = this.notifications[0];
        if (this.mounted && notification
          && !this.isEmployer
          && notification.data?.questId === this.$route.params.id
          && notification.action === NotificationAction.QUEST_STATUS_UPDATED
          && notification.data.status === QuestStatuses.Done
          && this.userData.id === notification.data.assignedWorkerId
          && !this.quest.yourReview) this.suggestToAddReview();
      },
      immediate: false,
    },
  },
  beforeCreate() {
    this.$store.dispatch('wallet/checkWalletConnected', { nuxt: this.$nuxt });
  },
  async beforeMount() {
    if (!this.isWalletConnected) return;

    this.SetLoader(true);
    const res = await this.getQuest();
    if (!res) {
      this.SetLoader(false);
      return;
    }
    this.initMapData();
    const {
      isEmployer, userData, quest: { assignedWorkerId },
    } = this;
    if (!isEmployer) {
      await this.getSameQuests();
      if (!res.yourReview && this.quest.status === QuestStatuses.Done
        && userData.id === assignedWorkerId) await this.suggestToAddReview();
    }
    await this.getResponsesToQuest();
    await this.setActionBtnsArr();
    this.SetLoader(false);
  },
  mounted() {
    this.mounted = true;
  },
  async beforeDestroy() {
    await this.$store.dispatch('google-map/resetMap');
    this.$store.commit('quests/setQuest', null);
    this.$store.commit('quests/setAllQuests', { count: 0, quests: [] });
    this.$store.commit('user/setCurrentReviewMarkOnQuest', { questId: null, message: null, mark: null });
  },
  methods: {
    starRating(item) {
      const { isEmployer, userData: { id } } = this;

      if (!item) return false;
      if (!isEmployer) return item.status === QuestStatuses.Done && item.assignedWorkerId === id;
      return item.status === QuestStatuses.Done && id === item.userId;
    },
    showReviewModal(rating, id) {
      this.ShowModal({
        key: modals.review,
        questMode: QuestModeReview.QUEST_SINGLE,
        questId: id,
        rating,
        callback: async (payload) => {
          const ok = await this.$store.dispatch('user/sendReviewForUser', payload);
          if (ok) this.ShowModal({ key: modals.thanks });
          else this.CloseModal();
        },
      });
    },
    async getSameQuests() {
      const skills = Object.keys(this.$t(`filters.skills.${this.randomSpec}.sub`));
      const specFilter = {};
      skills.forEach((skill, i) => {
        specFilter[`specializations[${i}]`] = `${this.randomSpec}.${skills[i]}`;
      });

      await this.$store.dispatch('quests/getAllQuests', {
        query: {
          limit: 10,
          statuses: [0],
        },
        specFilter,
      });

      const questsData = this.otherQuests.filter((quest) => quest.id !== this.quest.id);
      if (questsData.length) this.sameQuest = questsData[Math.floor(Math.random() * questsData.length)];
      else {
        this.$store.commit('quests/setAllQuests', {
          count: 0,
          quests: [],
        });
      }
    },
    setActionBtnsArr() {
      const {
        quest: {
          questChat,
          assignedWorkerId,
          status,
        },
        userData: { id },
        isEmployer,
      } = this;
      const arr = isEmployer ? this.setEmployerBtnsArr() : this.setWorkerBtnsArr();

      if ((questChat?.workerId === id || (questChat?.employerId === id && assignedWorkerId))
        && ![QuestStatuses.Closed, QuestStatuses.Rejected, QuestStatuses.Done].includes(status)) {
        arr.push({
          name: this.$t('meta.btns.goToChat'),
          class: 'base-btn_goToChat',
          funcKey: 'goToChat',
          icon: 'icon-chat icon_fs-20',
          disabled: false,
        });
      }

      this.actionBtnsArr = arr;
    },
    setEmployerBtnsArr() {
      if (this.userData.id !== this.quest.userId) return [];
      const {
        Dispute,
        Created,
        WaitEmployerConfirm,
      } = InfoModeEmployer;
      let arr = [];
      switch (this.infoDataMode) {
        case Created: {
          arr = [{
            name: this.$t('meta.raiseViews'),
            funcKey: 'toRaisingViews',
            disabled: false,
          },
          {
            name: this.$t('meta.btns.closeQuest'),
            mode: 'delete',
            funcKey: 'closeQuest',
            disabled: false,
          }];
          break;
        }
        case WaitEmployerConfirm: {
          arr = [{
            name: this.$t('meta.btns.acceptCompletedWorkOnQuest'),
            mode: 'approve',
            funcKey: 'acceptCompletedWorkOnQuest',
            disabled: false,
          },
          {
            name: this.$t('meta.openDispute'),
            funcKey: 'openDispute',
            disabled: false,
          }];
          break;
        }
        case Dispute: {
          arr = [{
            name: this.$t('meta.openDispute'),
            funcKey: 'openDispute',
            disabled: false,
          }];
          break;
        }
        default:
          break;
      }
      return arr;
    },
    setWorkerBtnsArr() {
      const {
        quest: {
          assignedWorkerId,
          response,
        },
        userData,
        infoDataMode,
      } = this;
      const {
        ADChat,
        WaitWorker,
        Created,
        Dispute,
        Invited,
        WaitWorkerOnAssign,
        WaitEmployerConfirm,
      } = InfoModeWorker;
      let arr = [];
      switch (infoDataMode) {
        case ADChat: {
          arr = [{
            name: this.$t('meta.btns.agree'),
            funcKey: 'acceptWorkOnQuest',
            disabled: false,
          },
          {
            name: this.$t('meta.btns.disagree'),
            mode: 'outline',
            funcKey: 'rejectWorkOnQuest',
            disabled: false,
          }];
          break;
        }
        case WaitWorker: {
          if (assignedWorkerId !== userData.id) break;
          arr = [{
            name: this.$t('meta.openDispute'),
            funcKey: 'openDispute',
            disabled: false,
          },
          {
            name: this.$t('meta.btns.completeWorkOnQuest'),
            funcKey: 'completeWorkOnQuest',
            disabled: false,
          }];
          break;
        }
        case Created: {
          arr = [{
            name: this.$t('meta.sendARequest'),
            funcKey: 'sendARequestOnQuest',
            disabled: false,
          }];
          break;
        }
        case WaitEmployerConfirm:
        case Dispute: {
          arr = [{
            name: this.$t('meta.openDispute'),
            funcKey: 'openDispute',
            disabled: false,
          }];
          break;
        }
        case Invited: {
          if (response.status !== ResponseStatus.awaiting || (assignedWorkerId && assignedWorkerId !== userData.id)) break;
          arr = [{
            name: this.$t('meta.btns.agree'),
            funcKey: 'acceptQuestInvitation',
            disabled: false,
          },
          {
            name: `${this.$t('meta.btns.disagree')}`,
            mode: 'outline',
            funcKey: 'rejectQuestInvitation',
            disabled: false,
          }].concat(arr);
          break;
        }
        case WaitWorkerOnAssign: {
          if (assignedWorkerId !== userData.id) break;
          arr = [{
            name: this.$t('meta.btns.agree'),
            funcKey: 'acceptWorkOnQuest',
            disabled: false,
          }];
          break;
        }
        default:
          break;
      }
      return arr;
    },
    handleClickSpecBtn(funcKey) {
      this[funcKey]();
    },
    async getQuest() {
      return await this.$store.dispatch('quests/getQuest', this.$route.params.id);
    },
    initMapData() {
      this.$store.commit('google-map/setZoom', 15);
      this.questLocation = {
        lat: this.quest.location.latitude,
        lng: this.quest.location.longitude,
      };
      this.$store.commit('google-map/setCenter', this.questLocation);
      this.$store.commit('google-map/setPoints', [this.quest]);
    },
    async getResponsesToQuest() {
      const { quest: { id, user }, userData, isEmployer } = this;
      if (this.userRole === UserRole.EMPLOYER && user.id === userData.id) {
        if (isEmployer && user.id === userData.id) {
          await this.$store.dispatch('quests/responsesToQuest', id);
        }
      }
    },
    async closeQuest() {
      if (this.quest.status !== InfoModeEmployer.WaitWorker) {
        this.ShowModal({
          key: modals.securityCheck,
          actionMethod: async () => await this.DeleteQuest(this.quest),
        });
      }
    },
    async openDispute() {
      const {
        checkAvailabilityDisputeTime, ShowModal, ShowModalFail, quest: {
          status, openDispute, id, contractAddress,
        },
      } = this;
      if (status === QuestStatuses.Dispute) return await this.$router.push(`${Path.DISPUTES}/${openDispute.id}`);
      const payment = async ({ reason = '', problemDescription = '', feeTx }) => {
        const currentQuest = await this.$store.dispatch('quests/getQuest', this.$route.params.id);
        if (!openDispute) {
          await this.$store.dispatch('disputes/createDispute', { reason, problemDescription, questId: id });
        }
        const { result } = await this.$store.dispatch('quests/arbitration', { contractAddress, value: feeTx });
        if (!result.status) {
          ShowModalFail({
            title: this.$t('modals.transactionError'),
            subtitle: this.$t('modals.tryLater'),
            img: images.ERROR,
          });
        } else {
          ShowModal({
            key: modals.status,
            title: this.$t('modals.transactionSent'),
            subtitle: this.$t('modals.checkExplorer'),
            link: `${process.env.WQ_EXPLORER_TX}/${result.transactionHash}`,
            img: images.SUCCESS,
            callback: await this.$router.push(`${Path.DISPUTES}/${currentQuest.openDispute.id}`),
          });
        }
      };
      if (checkAvailabilityDisputeTime) {
        const feeTx = await fetchContractData(
          'feeTx',
          WQFactory,
          process.env.WORKNET_WQ_FACTORY,
          null,
          GetWalletProvider(),
        );
        if (openDispute) {
          /** Флоу, если сознан диспут и не было оплаты */
          await payment({ feeTx });
        } else {
          /** Флоу, если не сознан диспут и не было оплаты */
          return ShowModal({
            key: modals.openADispute,
            submitMethod: async ({ reason, problemDescription }) => ShowModal({
              key: modals.transactionReceipt,
              isDontOffLoader: true,
              fields: {
                from: { name: this.$t('meta.fromBig'), value: getWalletAddress() },
                to: { name: this.$t('meta.toBig'), value: contractAddress },
                fee: { name: this.$t('wallet.table.trxFee'), value: 0 },
                amount: {
                  name: this.$t('wallet.table.value'),
                  value: new BigNumber(feeTx).shiftedBy(-18).toString(),
                  symbol: TokenSymbols.WUSD,
                },
              },
              title: this.$t('modals.titles.disputePayment'),
              text: this.$t('modals.payForDispute'),
              submitMethod: async () => await payment({
                reason,
                problemDescription,
                feeTx,
              }),
            }),
          });
        }
      }
      return ShowModal({
        key: modals.status,
        img: images.ERROR,
        title: this.$t('modals.errors.error'),
        subtitle: this.$t('modals.errors.youCantCreateDispute'),
        button: this.$t('meta.btns.close'),
      });
    },
    async acceptCompletedWorkOnQuest() {
      this.SetLoader(true);
      const { contractAddress, id } = this.quest;
      const [feeRes] = await Promise.all([
        this.$store.dispatch('quests/getFeeDataJobMethod', {
          abi: WorkQuest,
          method: QuestMethods.AcceptJobResult,
          contractAddress,
        }),
        this.$store.dispatch('wallet/getBalance'),
      ]);
      this.SetLoader(false);
      if (feeRes.ok === false) {
        this.ShowToast(feeRes.msg);
        return;
      }
      this.ShowModal({
        key: modals.transactionReceipt,
        isDontOffLoader: true,
        fields: {
          from: { name: this.$t('meta.fromBig'), value: this.userAddress },
          to: { name: this.$t('meta.toBig'), value: contractAddress },
          fee: { name: this.$t('wallet.table.trxFee'), value: feeRes.result.fee.toString(), symbol: TokenSymbols.WQT },
        },
        submitMethod: async () => {
          this.$store.commit('notifications/setWaitForUpdateQuest', {
            id,
            callback: () => this.showQuestModal(2),
          });
          await this.$store.dispatch('quests/acceptJobResult', contractAddress);
        },
      });
    },
    toRaisingViews() {
      if (![QuestStatuses.Closed, QuestStatuses.Dispute].includes(this.quest.status)) {
        this.$router.push({ path: `/edit-quest/${this.quest.id}`, query: { mode: 'raise' } });
        this.$store.commit('quests/setCurrentStepEditQuest', EditQuestState.RAISE_VIEWS);
      } else this.showToastWrongStatusRaisingViews();
    },
    showToastWrongStatusRaisingViews() {
      return this.$store.dispatch('main/showToast', {
        title: this.$t('meta.questInfo'),
        variant: 'warning',
        text: this.$t('toasts.questCantRaisingViews'),
      });
    },
    showQuestModal(modalMode) {
      this.ShowModal({
        key: modals.status,
        img: images.QUEST_AGREED,
        title: this.$t('meta.questInfo'),
        subtitle: this.modalMode(modalMode),
        isNotClose: true,
        callback: () => this.suggestToAddReview(),
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
      await this.$store.dispatch('quests/rejectQuestInvitation', this.quest.response.id);
      await this.getQuest();
      this.setActionBtnsArr();
      this.SetLoader(false);
    },
    async acceptQuestInvitation() {
      this.SetLoader(true);
      await this.$store.dispatch('quests/acceptQuestInvitation', this.quest.response.id);
      await this.getQuest();
      this.setActionBtnsArr();
      this.SetLoader(false);
    },
    async goToChat() {
      this.SetLoader(true);
      const { openDispute, questChat, status } = this.quest;
      const disputeStatus = openDispute?.status;
      const disputeId = openDispute?.id;
      await this.$router.push({
        path: `${Path.MESSAGES}/${questChat.chatId}`,
        query: {
          disputeStatus, id: disputeId, type: 'quest', status,
        },
      });
      this.SetLoader(false);
    },
    async acceptWorkOnQuest() {
      this.SetLoader(true);
      const { contractAddress, id } = this.quest;
      const [feeRes] = await Promise.all([
        this.$store.dispatch('quests/getFeeDataJobMethod', {
          abi: WorkQuest,
          method: QuestMethods.AcceptJob,
          contractAddress,
        }),
        this.$store.dispatch('wallet/getBalance'),
      ]);
      this.SetLoader(false);
      if (feeRes.ok === false) {
        this.ShowToast(feeRes.msg);
        return;
      }
      this.ShowModal({
        key: modals.transactionReceipt,
        isDontOffLoader: true,
        fields: {
          from: { name: this.$t('meta.fromBig'), value: this.userAddress },
          to: { name: this.$t('meta.toBig'), value: contractAddress },
          fee: { name: this.$t('wallet.table.trxFee'), value: feeRes.result.fee.toString(), symbol: TokenSymbols.WQT },
        },
        submitMethod: async () => {
          this.$store.commit('notifications/setWaitForUpdateQuest', {
            id,
            callback: () => this.ShowModal({
              key: modals.status,
              img: images.QUEST_AGREED,
              title: this.$t('meta.questInfo'),
              subtitle: this.$t('quests.workOnQuestAccepted'),
            }),
          });
          await this.$store.dispatch('quests/acceptJob', contractAddress);
        },
      });
    },
    async completeWorkOnQuest() {
      this.SetLoader(true);
      const { contractAddress, id } = this.quest;
      const [feeRes] = await Promise.all([
        this.$store.dispatch('quests/getFeeDataJobMethod', {
          abi: WorkQuest,
          method: QuestMethods.VerificationJob,
          contractAddress,
        }),
        this.$store.dispatch('wallet/getBalance'),
      ]);
      this.SetLoader(false);
      if (!feeRes.ok) {
        console.error('completeWorkOnQuest', feeRes);
        return;
      }
      this.ShowModal({
        key: modals.transactionReceipt,
        isDontOffLoader: true,
        fields: {
          from: { name: this.$t('meta.fromBig'), value: this.userAddress },
          to: { name: this.$t('meta.toBig'), value: contractAddress },
          fee: { name: this.$t('wallet.table.trxFee'), value: feeRes.result.fee.toString(), symbol: TokenSymbols.WQT },
        },
        submitMethod: async () => {
          this.$store.commit('notifications/setWaitForUpdateQuest', {
            id,
            callback: () => this.ShowModal({
              key: modals.status,
              img: images.QUEST_AGREED,
              title: this.$t('meta.questInfo'),
              subtitle: this.$t('quests.pleaseWaitEmp'),
            }),
          });
          await this.$store.dispatch('quests/verificationJob', contractAddress);
        },
      });
    },
    async sendARequestOnQuest() {
      this.ShowModal({
        key: modals.sendARequest,
        questId: this.quest.id,
      });
    },
    async suggestToAddReview() {
      this.ShowModal({
        key: modals.areYouSure,
        title: ' ',
        text: this.$t(`modals.${!this.isEmployer ? 'wouldReviewEmployer' : 'wouldReviewEmployee'}`),
        okBtnTitle: this.$t('meta.btns.ok'),
        isNotClose: true,
        okBtnFunc: () => this.showReviewModal(0, this.quest.id),
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.quest {
  &__container {
    display: flex;
    flex-direction: column;
    min-width: 0;
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
    word-break: break-word;
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
    border-top: 1px solid $black0;
  }
}

.map {
  height: 200px;
  margin-bottom: 20px;
}

.worker-data {
  min-width: 0;
  padding-top: 20px;
  border-top: 1px solid $black0;

  &__title {
    font-weight: 500;
    color: $black800;
    font-size: 18px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    word-break: break-word;

    &_small {
      font-size: 16px;
    }
  }

  &__rating {
    display: flex;
    align-self: center;
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
    min-width: 0;
    display: grid;
    grid-auto-flow: column;
    gap: 10px;
    justify-content: start;
    align-items: center;
  }

  &__avatar {
    display: flex;
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
  &__payPeriod {
    @include text-simple;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 3px;
    font-size: 12px;
    line-height: 130%;
    height: 24px;
    padding: 0 5px;
    background: $grey100;
    color: $black800;
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

  &__link {
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
  .map {
    margin-bottom: 0;
  }
}

@include _991 {
  .main-white {
    display: block;
  }
  .worker-data {
    &__btns {
      margin-bottom: 10px;
    }

    &__more-data {
      grid-template-columns: 1fr;
    }
  }
}

@include _767 {
  .main {
    display: block;
  }

  .worker-data {
    &__btns {
      width: 100%;
      display: flex;
      flex-direction: column;

      .worker-data__button {
        width: 100% !important;
      }
    }

    &__priority {
      width: 100%;
      display: flex;
      justify-content: space-between;
      flex-direction: row-reverse;
      align-items: center;

      &-title {
        font-size: 16px;
        height: 100%;
      }
    }
  }
}

@include _575 {
  .worker-data {
    &__price {
      font-size: 21px;
    }

    &__btns {
      grid-auto-flow: row;
    }

    &__more-data {
      justify-items: center;
    }
  }

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
