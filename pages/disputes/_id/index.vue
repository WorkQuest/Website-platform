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
        :quests="disputeData.quest ? [disputeData.quest] : []"
      />
      <div class="chat-history">
        <div class="chat-history__container">
          <div class="chat-history__title">
            {{ $t('disputes.chatHistory') }}
          </div>
        </div>
        <div class="messages__container">
          <Messages />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Messages from '~/components/app/pages/common/messages';
import quests from '~/components/app/pages/common/quests';

export default {
  name: 'Index',
  components: {
    Messages,
    quests,
  },
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
        0: this.$t('disputes.pending'),
        1: this.$t('disputes.inProgress'),
        2: this.$t('disputes.completed'),
      };
      return obj[this.disputeData.status];
    },
  },
  beforeMount() {
    this.$store.dispatch('disputes/getDispute', this.disputeId);
  },
  async mounted() {
    this.SetLoader(true);
    console.log(this.disputeData);
    this.SetLoader(false);
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
</style>
