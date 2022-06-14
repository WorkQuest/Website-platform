<template>
  <div
    class="main"
    data-selector="PAGE-DISPUTES-ID"
  >
    <div class="main__body">
      <div class="dispute__top">
        <div
          class="dispute__back"
          data-selector="ACTION-DISPUTE-BACK-BTN"
          @click="backToDisputes()"
        >
          <span class="icon-chevron_big_left" />
          <span class="dispute__back_text">
            {{ $t('meta.dispute') }}
          </span>
        </div>
        <div class="dispute__number">
          {{ `№ ${disputeData.number}` }}
        </div>
        <div class="dispute__status">
          {{ disputeStatus }}
        </div>
      </div>
      <card-quest
        :quest="disputeData.quest"
        :data-selector="`QUEST-CARD-${disputeData.quest.id}`"
        :dispute-id="disputeData.id"
      />
      <div class="dispute__chat-history">
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
</template>

<script>
import { mapGetters } from 'vuex';
import { DisputeStatues } from '~/utils/enums';

export default {
  name: 'Index',
  computed: {
    ...mapGetters({
      disputeData: 'disputes/getDispute',
    }),
    disputeId() {
      return this.$route.params.id;
    },
    disputeStatus() {
      const obj = {
        [DisputeStatues.PENDING]: this.$t('disputes.pending'),
        [DisputeStatues.IN_PROGRESS]: this.$t('disputes.inProgress'),
        [DisputeStatues.COMPLETED]: this.$t('meta.completed'),
      };
      return obj[this.disputeData.status];
    },
  },
  async created() {
    await this.$store.dispatch('disputes/getDispute', this.disputeId);
  },
  async beforeDestroy() {
    await this.$store.commit('disputes/resetDisputeCard');
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
  &__chat-history {
    background: $white;
    border-radius: 6px;
    margin: 20px 0 0 0;
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
