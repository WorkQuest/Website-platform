<template>
  <div
    class="worker__card"
    data-selector="COMPONENT-WORKERS-LIST"
  >
    <div
      v-if="getCurrUsersArr.length"
      class="invited__list"
    >
      <div
        v-for="response in getCurrUsersArr"
        :key="response.worker.id"
        class="worker__container"
      >
        <div class="worker__top-wrap">
          <div class="worker__action-container">
            <div class="worker__title">
              {{ $t(`${isInvited ? 'meta.invited' : 'meta.responded'}`) }}
            </div>
          </div>
          <div class="worker user-data">
            <img
              class="worker__avatar"
              :src="
                response.worker.avatar
                  ? response.worker.avatar.url
                  : $options.images.EMPTY_AVATAR
              "
              alt=""
              @click="toUserProfile(response)"
            >
            <div class="worker__user">
              <div
                class="worker__name"
                @click="toUserProfile(response)"
              >
                {{
                  UserName(response.worker.firstName, response.worker.lastName)
                }}
              </div>
              <div
                v-if="
                  isInvited &&
                    response.status === $options.QuestsResponseStatus.Accepted
                "
                class="worker__status"
              >
                {{ $t('meta.accepted') }}
              </div>
            </div>
            <item-rating :rating="response.worker.ratingStatistic.status" />
          </div>
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
        <div class="dd__items">
          <button
            v-for="(item, i) in userActionsArr(response)"
            :key="`dd__item-${i}`"
            class="dd__item"
            :data-selector="`ACTION-BTN-SELECT-ITEM-${`WORKERS-LIST-USER-ACTIONS-${userActionsArr(
              response,
            )}`.toUpperCase()}-${i}`"
            @click="handleUserAction(i, response)"
          >
            {{ item }}
          </button>
          <slot name="buttonCard" />
        </div>
      </div>
    </div>
    <div
      v-else
      class="invited__title"
    >
      {{
        $t(
          `quests.${
            isInvited ? 'workersNotInvited' : 'employer.usersNotResponded'
          }`,
        )
      }}
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { Path, TokenSymbols } from '~/utils/enums';
import { ChatType } from '~/utils/сonstants/chat';
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
    ddUserInvitedActions() {
      // Worker accepted invitation
      return [this.$t('meta.btns.goToChat'), this.$t('quests.startQuest')];
    },
    ddUserRespondedActions() {
      // Responds from worker
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
      if (
        this.questData?.assignedWorker?.id === worker?.id
        // Waiting for worker (dis)agree invitation
        || (this.isInvited && response.status === QuestsResponseStatus.Open)
      ) {
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
      this.$router.push({
        path: `${Path.MESSAGES}/${response.questChat.chatId}`,
        query: { type: ChatType.QUEST },
      });
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
          from: {
            name: this.$t('meta.fromBig'),
            value: this.userWalletAddress,
          },
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
            callback: () => this.$store.dispatch('modals/show', {
              key: modals.transactionSend,
            }),
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
      if (
        await this.$store.dispatch(
          'quests/rejectTheAnswerToTheQuest',
          response.id,
        )
      ) {
        await this.$store.dispatch(
          'quests/responsesToQuest',
          this.questData.id,
        );
      }
      this.SetLoader(false);
    },
    selectItem(i) {
      this.$emit('input', i);
    },
  },
};
</script>

<style lang="scss" scoped>
.invited {
  &__title {
    color: #7c838dff;
    font-size: 16px;
  }
  &__list {
    display: flex;
    flex-wrap: wrap;
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
  &__top-wrap {
    padding: 15px;
  }

  &__action-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  &__menu {
    align-self: center;
    flex-shrink: 0;
  }
  &__card {
    position: relative;
    background: $white;
    border-radius: 6px;
    padding: 30px 15px;
  }
  &__message {
    @include text-simple;
    max-width: 90%;
    margin: 0 0 10px 0;
    font-size: 16px;
    color: $black500;
    word-break: break-word;
  }

  &__container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 10px;
    flex-basis: calc((100% - 40px) / 3);
    border: 1px solid #f0f0f0;
    border-radius: 6px;
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
    transition: 0.3s;
    &:hover {
      color: $blue;
    }
  }
  &__title {
    font-size: 18px;
  }
}

@include _575 {
  .user-data {
    display: grid;
    grid-template-columns: 40px 1fr max-content;
  }
  .worker__name {
    font-size: 14px;
  }
}

@include _480 {
  .worker__name {
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 150px;
  }
}

@include _380 {
  .worker__name {
    max-width: 120px;
    font-size: 12px;
  }
}

@include _350 {
  .worker__name {
    max-width: 80px;
  }
}
.dd {
  display: flex;
  align-items: center;
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 130%;
  color: $black500;
  text-align: left;
  &__items {
    background: #fafafa;
    border-top: 1px solid #f0f0f0;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    grid-gap: 15px;
    padding: 15px 20px;
    z-index: 4;

    &_underline-type {
      width: fit-content;
      min-width: fit-content;
      right: 0;
    }

    &_small {
      max-height: 200px;
      grid-gap: 10px;
      overflow-y: auto;
      overscroll-behavior-y: contain;
    }

    &_wide {
      min-width: 131px;
      right: 30px;
      top: 15px;
    }
  }
  &__item {
    flex-basis: 100%;
    width: 100%;
    height: 100%;
    color: $black500;
    &:hover {
      color: $blue;
    }
    &:not(:last-child) {
      border-right: 1px solid #f0f0f0;
    }
    &_disabled {
      cursor: default;
      color: $black300;
      &:hover {
        color: $black300;
      }
    }
    &_icon {
      display: flex;
      align-items: center;
      img {
        margin-right: 5px;
        height: 24px;
        width: 24px;
      }
    }
    &_hide {
      display: none;
    }
  }
}
</style>
