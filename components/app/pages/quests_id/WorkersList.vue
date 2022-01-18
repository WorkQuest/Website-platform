<template>
  <div class="worker__card">
    <div class="worker__title">
      {{ $t(`${isInvited ? 'quests.invited' : 'response.title'}`) }}
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
          <item-rating
            v-if="ratingStatistic(response.worker.ratingStatistic) !== 'noStatus'"
            :rating="ratingStatistic(response.worker.ratingStatistic)"
          />
        </div>
        <base-dd
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
          <div v-if="response.medias.length">
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
import itemRating from '~/components/app/info/item-rating';
import { QuestMethods, ResponseStatus, TokenSymbols } from '~/utils/enums';
import modals from '~/store/modals/modals';

export default {
  name: 'WorkersList',
  components: {
    itemRating,
  },
  props: {
    isInvited: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      ddUserActions: [
        this.$t('btn.goToChat'),
      ],
      ddInvitedUserActions: [
        this.$t('btn.goToChat'),
        this.$t('quests.startQuest'),
      ],
      ddUserFullActions: [
        this.$t('btn.goToChat'),
        this.$t('quests.startQuest'),
        this.$t('quests.decline'),
      ],
    };
  },
  computed: {
    ...mapGetters({
      currentWorker: 'quests/getCurrentWorker',
      questData: 'quests/getQuest',
      invited: 'quests/getInvited',
      responded: 'quests/getResponded',
      isWalletConnected: 'wallet/getIsWalletConnected',
      userAddress: 'user/getUserWalletAddress',
    }),
    getCurrUsersArr() {
      const { isInvited, invited, responded } = this;

      return isInvited ? invited : responded;
    },
  },
  async created() {
    this.SetLoader(false);
  },
  methods: {
    userActionsArr({ status }) {
      if (this.isInvited) {
        if (status === ResponseStatus.accepted) return this.ddInvitedUserActions;

        return this.ddUserActions;
      }
      return this.ddUserFullActions;
    },
    ratingStatistic(ratingStatistic) {
      return ratingStatistic?.status || 'noStatus';
    },
    handleUserAction(index, response) {
      const funcKey = ['goToChat', 'startQuest', 'reject'][index];
      this[funcKey](response);
    },
    goToChat(response) {
      this.$router.push(`/messages/${response.questChat.chatId}`);
    },
    async getQuest() {
      await this.$store.dispatch('quests/getQuest', this.questData.id);
    },
    async startQuest(response) {
      if (!this.isWalletConnected) {
        await this.$store.dispatch('wallet/checkWalletConnected', { nuxt: this.$nuxt });
        return;
      }

      // TODO: брать данные ниже из response переменной
      const contractAddress = '0xfD6c0F9643FE826A4F1f0DF57403270A03BC2b32';
      const workerAddress = '0xdad69079e34d777fa94da584472d03cb2f7d6b04';

      const feeRes = await this.$store.dispatch('wallet/getFeeDataJobMethod', {
        method: QuestMethods.AssignJob,
        contractAddress,
        data: [workerAddress],
      });
      if (feeRes.ok === false) {
        // how to handle error?
        return;
      }
      this.ShowModal({
        key: modals.transactionReceipt,
        fields: {
          from: { name: this.$t('modals.fromAddress'), value: this.userAddress },
          to: { name: this.$t('modals.toAddress'), value: contractAddress },
          fee: {
            name: this.$t('wallet.table.trxFee'),
            value: feeRes.result.fee,
            symbol: TokenSymbols.WUSD,
          },
        },
        submitMethod: async () => {
          const res = await this.$store.dispatch('wallet/assignJob', {
            contractAddress,
            workerAddress,
          });
          console.log('assign job res', res);
          const payload = {
            config: {
              assignedWorkerId: response.worker.id,
            },
            questId: this.questData.id,
          };
          await this.$store.dispatch('quests/startQuest', payload);
        },
        callback: async () => await this.getQuest(),
      });
    },
    async reject(response) {
      this.SetLoader(true);
      if (await this.$store.dispatch('quests/rejectTheAnswerToTheQuest', response.id)) await this.$store.dispatch('quests/responsesToQuest', this.questData.id);
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
