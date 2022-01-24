<template>
  <div class="main">
    <div class="main__body">
      <div class="dispute__top">
        <div
          class="dispute__back"
          @click="backToDisputes()"
        >
          <span class="icon-chevron_big_left" />
          <span class="dispute__back_text">{{ $t('disputes.Dispute') }}</span>
        </div>
        <div class="dispute__number">
          {{ `№ ${disputeData.disputeNumber}` }}
        </div>
        <div class="dispute__status">
          {{ disputeStatus }}
        </div>
      </div>
      <quests
        class="dispute__quests"
        :quests="disputeData.quest ? [disputeData.quest] : []"
      />
      <div class="dispute__chat-history">
        <div class="chat-history">
          <div class="chat-history__container">
            <div class="chat-history__title">
              {{ $t('disputes.chatHistory') }}
            </div>
          </div>
          <div
            v-if="disputeData.quest && disputeData.quest.questChat.chatId"
            class="messages__container"
          >
            <messages-list
              class="messages__block"
              :chat-id="disputeData.quest.questChat.chatId"
              :is-hide-footer="false"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { disputeStatues, InfoModeWorker } from '~/utils/enums';

export default {
  name: 'Index',
  data() {
    return {
      disputeId: this.$route.params.id,
    };
  },
  computed: {
    ...mapGetters({
      disputeData: 'disputes/getDispute',
    }),
    disputeStatus() {
      const obj = {
        [disputeStatues.PENDING]: this.$t('disputes.pending'),
        [disputeStatues.IN_PROGRESS]: this.$t('disputes.inProgress'),
        [disputeStatues.COMPLETED]: this.$t('disputes.completed'),
      };
      return obj[this.disputeData.status];
    },
  },
  async beforeMount() {
    await this.$store.dispatch('disputes/getDispute', this.disputeId);
  },
  async beforeDestroy() {
    await this.$store.commit('disputes/setDispute', {});
  },
  methods: {
    backToDisputes() {
      this.$router.back();
    },
  },
};
</script>

<style lang="scss" scoped>

.icon {
  &-chevron_big_left:before {
    content: "\ea4d";
    color: $black800;
    font-size: 25px;
  }
}

.main {
  @include main;
}

.messages {
  &__container {
    margin: 0 20px 20px 20px;
    padding: 0 0 20px 0;
  }
  &__block {
    max-height: 450px;
  }
}

.chat-history {
  background: $white;
  border-radius: 6px;
  margin: 20px 0 0 0;
  &__container {
    display: flex;
    align-items: flex-start;
  }
  &__title {
    @include text-simple;
    font-weight: 500;
    font-size: 18px;
    color: $black800;
    margin: 15px;
  }
}

.dispute {
  &__top {
    margin: 20px 0 20px 0;
    display: flex;
    align-items: center;
  }
  &__back {
    display: flex;
    align-items: center;
    transition: .5s;
    &:hover {
      cursor: pointer;
    }
    &_text {
      @include text-simple;
      font-weight: 500;
      font-size: 25px;
      color: $black800;
      margin: 0 0 0 22px;
    }
  }
  &__number {
    @include text-simple;
    font-weight: 400;
    font-size: 16px;
    color: $black300;
    margin: 0 15px 0 15px;
  }
  &__status {
    @include text-simple;
    font-weight: 500;
    font-size: 16px;
    color: #E8D20D;
  }
}
@include _1199() {
  .dispute {
    &__quests {
      padding: 0 10px;
    }
    &__chat-history {
      padding: 0 10px;
    }
  }
}
</style>
