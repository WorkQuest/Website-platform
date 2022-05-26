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
            :src="response.worker.avatar ? response.worker.avatar.url : require('~/assets/img/app/avatar_empty.png')"
            alt=""
          >
          <div class="worker__name">
            {{ `${response.worker.firstName} ${response.worker.lastName}` }}
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
import { QuestMethods } from '~/utils/сonstants/quests';
import modals from '~/store/modals/modals';
import { error, success } from '~/utils/web3';
import { WorkQuest } from '~/abi';

export default {
  name: 'WorkersList',
  props: {
    isInvited: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      ddUserActions: [
        this.$t('meta.btns.goToChat'),
      ],
      ddUserFullActions: [
        this.$t('meta.btns.goToChat'),
        this.$t('quests.startQuest'),
        this.$t('quests.decline'),
      ],
    };
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
  },
  beforeCreate() {
    this.$store.dispatch('wallet/checkWalletConnected', { nuxt: this.$nuxt });
  },
  methods: {
    userActionsArr({ worker }) {
      if (this.questData?.assignedWorker?.id === worker?.id) {
        return this.ddUserActions;
      }
      return this.ddUserFullActions;
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
  display: grid;
  grid-template-columns: 40px 1fr max-content;
  align-items: center;
  gap: 10px;
}
.worker {
  font-size: 16px;
  font-weight: 500;
  color: $black800;
  &__menu {
    align-self: center;
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
 }
  &__name {
    @extend .worker;
  }
 &__title {
    font-size: 18px;
    margin-bottom: 20px;
  }
}
</style>
