<template>
  <div
    class="worker__card"
    data-selector="COMPONENT-WORKERS-LIST"
  >
    <div class="worker__title">
      {{ $t(`${isInvited ? 'meta.invited' : 'meta.responded'}`) }}
    </div>
    <div
      v-if="getCurrUsersArr.length"
      class="invited__list"
    >
      <div
        v-for="response in getCurrUsersArr"
        :key="response.worker.id"
        class="worker__container"
      >
        <div class="worker user-data">
          <img
            class="worker__avatar"
            :src="response.worker.avatar ? response.worker.avatar.url : $options.images.EMPTY_AVATAR"
            alt=""
            @click="toUserProfile(response)"
          >
          <div class="worker__user">
            <div
              class="worker__name"
              @click="toUserProfile(response)"
            >
              {{ `${response.worker.firstName} ${response.worker.lastName}` }}
            </div>
            <div
              v-if="isInvited && response.status === $options.QuestsResponseStatus.Accepted"
              class="worker__status"
            >
              {{ $t('meta.accepted') }}
            </div>
          </div>
          <item-rating :rating="response.worker.ratingStatistic.status" />
        </div>
        <base-dd
          :data-selector="`WORKERS-LIST-USER-ACTIONS-${userActionsArr(response)}`"
          class="worker__menu"
          :placeholder="30"
          :items="userActionsArr(response)"
          is-dots-view
          @input="handleUserAction($event, response)"
        />
        <div class="worker__message-cont">
          <div class="worker__message">
            {{ response.message }}
          </div>
          <div v-if="response.medias && response.medias.length">
            <files-preview
              :medias="response.medias"
              small
            />
          </div>
        </div>
      </div>
    </div>
    <div
      v-else
      class="invited__title"
    >
      {{ $t(`quests.${isInvited ? 'workersNotInvited' : 'employer.usersNotResponded'}`) }}
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import {
  Path, TokenSymbols, ChatType,
} from '~/utils/enums';
import { QuestMethods, QuestsResponseStatus } from '~/utils/сonstants/quests';
import modals from '~/store/modals/modals';
import { error, success } from '~/utils/web3';
import { WorkQuest } from '~/abi';
import { images } from '~/utils/images';

export default {
  name: 'WorkersList',
  Path,
  QuestsResponseStatus,
  images,
  props: {
    isInvited: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters({
      isWalletConnected: 'wallet/getIsWalletConnected',
      userWalletAddress: 'user/getUserWalletAddress',
      currentWorker: 'quests/getCurrentWorker',
      questData: 'quests/getQuest',
      invited: 'quests/getInvited',
      responded: 'quests/getResponded',
    }),
    getCurrUsersArr() {
      const { isInvited, invited, responded } = this;
      return isInvited ? invited : responded;
    },
    ddUserChatActions() {
      return [this.$t('meta.btns.goToChat')]; // WaitWorkerOnAssign state
    },
    ddUserInvitedActions() { // Worker accepted invitation
      return [
        this.$t('meta.btns.goToChat'),
        this.$t('quests.startQuest'),
      ];
    },
    ddUserRespondedActions() { // Responds from worker
      return [
        this.$t('meta.btns.goToChat'),
        this.$t('quests.startQuest'),
        this.$t('quests.decline'),
      ];
    },
  },
  beforeCreate() {
    this.$store.dispatch('wallet/checkWalletConnected', { nuxt: this.$nuxt });
  },
  methods: {
    toUserProfile(response) {
      this.$router.push(`${Path.PROFILE}/${response.worker.id}`);
    },
    userActionsArr(response) {
      const { worker } = response;
      if (this.questData?.assignedWorker?.id === worker?.id
        // Waiting for worker (dis)agree invitation
        || (this.isInvited && response.status === QuestsResponseStatus.Open)) {
        return this.ddUserChatActions;
      }
      if (this.isInvited && response.status === QuestsResponseStatus.Accepted) {
        return this.ddUserInvitedActions;
      }
      return this.ddUserRespondedActions;
    },
    handleUserAction(index, response) {
      const funcKey = ['goToChat', 'startQuest', 'reject'][index];
      this[funcKey](response);
    },
    goToChat(response) {
      this.$router.push({ path: `${Path.MESSAGES}/${response.questChat.chatId}`, query: { type: ChatType.QUEST } });
    },
    async getQuest() {
      await this.$store.dispatch('quests/getQuest', this.questData.id);
    },
    async startQuest(response) {
      this.SetLoader(true);
      const { contractAddress } = this.questData;
      const { worker } = response;
      const workerAddress = worker.wallet.address;
      const [feeRes] = await Promise.all([
        this.$store.dispatch('quests/getFeeDataJobMethod', {
          method: QuestMethods.AssignJob,
          abi: WorkQuest,
          contractAddress,
          data: [workerAddress],
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
        title: this.$t('quests.startQuest'),
        isDontOffLoader: true,
        fields: {
          from: { name: this.$t('meta.fromBig'), value: this.userWalletAddress },
          to: { name: this.$t('meta.toBig'), value: contractAddress },
          fee: {
            name: this.$t('wallet.table.trxFee'),
            value: feeRes.result.fee,
            symbol: TokenSymbols.WQT,
          },
        },
        submitMethod: async () => {
          this.$store.commit('notifications/setWaitForUpdateQuest', {
            id: this.questData.id,
            callback: () => this.$store.dispatch('modals/show', { key: modals.transactionSend }),
          });
          const txRes = await this.$store.dispatch('quests/assignJob', {
            contractAddress,
            workerAddress,
          });
          if (txRes.ok) {
            return success();
          }
          return error();
        },
      });
    },
    async reject(response) {
      this.SetLoader(true);
      if (await this.$store.dispatch('quests/rejectTheAnswerToTheQuest', response.id)) {
        await this.$store.dispatch('quests/responsesToQuest', this.questData.id);
      }
      this.SetLoader(false);
    },
  },
};
</script>

<style lang="scss" scoped>
.invited {
  &__title {
    color: #7C838DFF;
    font-size: 16px;
  }
  &__list {
    display: grid;
    gap: 20px;
  }
}
.user-data {
  display: flex;
  align-items: center;
  gap: 10px;
}
.worker {
  font-size: 16px;
  font-weight: 500;
  color: $black800;
  &__menu {
    align-self: center;
    flex-shrink: 0;
  }
   &__card {
    background: $white;
    border-radius: 6px;
     padding: 15px;
  }
 &__message {
   @include text-simple;
   margin: 0 0 10px 0;
   font-size: 16px;
   color: $black500;
 }

  &__container {
    display: grid;
    grid-template-columns: 1fr max-content;
    gap: 10px;
  }
  &__avatar {
    border-radius: 50%;
    width: 40px;
    height: 40px;
    cursor: pointer;
    object-fit: cover;
 }
  &__status {
    background: $green;
    border-radius: 6px;
    display: inline-block;
    font-size: 14px;
    padding: 1px 4px;
    user-select: none;
    color: $white;
  }
  &__name {
    @extend .worker;
    color: $black800;
    cursor: pointer;
    transition: .3s;
    &:hover {
      color: $blue;
    }
  }
 &__title {
    font-size: 18px;
    margin-bottom: 20px;
  }
}

@include _575 {
  .user-data {
    display: grid;
    grid-template-columns: 40px 1fr max-content;
  }
}
</style>
