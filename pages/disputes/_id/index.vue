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
          @click="backToDisputes"
        >
          <span class="icon-chevron_big_left" />
          <span class="dispute__back_text">
            {{ $t('meta.dispute') }}
          </span>
        </div>
        <skeleton-block
          v-if="isFetching"
          class="dispute__number"
          style="width: 120px"
        />
        <template v-else>
          <div class="dispute__number">
            {{ `№ ${disputeData.number}` }}
          </div>
          <div
            class="dispute__status"
            :class="colorDisputeStatus"
          >
            {{ disputeStatus }}
          </div>
        </template>
      </div>
      <div :class="disputeData.status >= $options.DisputeStatues.PENDING_CLOSED ? 'container-quest-decision' :'container-quest'">
        <card-quest
          class="container-quest-decision__card-quest"
          :quest="disputeData.quest"
          :data-selector="`QUEST-CARD-${disputeData.quest.id}`"
          :dispute-id="disputeData.id"
          :is-skeleton="isFetching"
        />
        <div
          v-if="disputeData.status >= $options.DisputeStatues.PENDING_CLOSED"
          class="decision"
        >
          <div class="decision__block">
            <div class="decision__title">
              {{ $t('disputes.decision') }}
            </div>
            <div class="decision__text">
              {{ disputeData.decisionDescription ? disputeData.decisionDescription : '-' }}
            </div>
          </div>
          <star-rating
            class="decision__review"
            :stars-number="5"
            data-selector="ACTION-BTN-SHOW-REVIEW-MODAL-DISPUTE"
            :rating="disputeMark"
            :is-disabled="!!disputeMark"
            @input="showReviewModal($event, disputeId)"
          />
        </div>
      </div>
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
import modals from '~/store/modals/modals';

export default {
  name: 'Index',
  DisputeStatues,
  data: () => ({
    disputeMark: 0,
    isFetching: true,
  }),
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
        [DisputeStatues.CREATED]: this.$t('disputes.created'),
        [DisputeStatues.IN_PROGRESS]: this.$t('disputes.inProgress'),
        [DisputeStatues.PENDING_CLOSED]: this.$t('meta.completed'),
        [DisputeStatues.CLOSED]: this.$t('meta.completed'),
      };
      return obj[this.disputeData.status];
    },
    colorDisputeStatus() {
      return {
        [DisputeStatues.PENDING]: 'dispute__status_blue',
        [DisputeStatues.IN_PROGRESS]: 'dispute__status_yellow',
        [DisputeStatues.PENDING_CLOSED]: 'dispute__status_green',
        [DisputeStatues.CLOSED]: 'dispute__status_green',
        [DisputeStatues.CREATED]: 'dispute__status_darkblue',
      }[this.disputeData.status];
    },

  },
  async created() {
    await this.$store.dispatch('disputes/getDispute', this.disputeId);
    this.disputeMark = this.disputeData.currentUserDisputeReview?.mark;
    this.isFetching = false;
  },
  async beforeDestroy() {
    await this.$store.commit('disputes/resetDisputeCard');
  },
  methods: {
    backToDisputes() {
      this.$router.back();
    },
    showReviewModal(rating, disputeId) {
      this.ShowModal({
        key: modals.review,
        title: this.$tc('modals.titles.review'),
        rating,
        callback: async (message, mark) => {
          this.CloseModal();
          this.SetLoader(true);
          const { ok, msg } = await this.$store.dispatch('user/sendReviewDispute', { disputeId, message, mark });
          if (ok) {
            this.ShowModal({ key: modals.thanks });
            this.disputeMark = mark;
          } else {
            await this.ShowToast(msg || ' ');
          }
          this.SetLoader(false);
        },
      });
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
  &:hover {
    border: 1px solid $black100;
  }
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
    &_blue {
      color: $blue;
    }
    &_yellow {
      color: $yellow;
    }
    &_green {
      color: $green;
    }
    &_darkblue {
      color: $darkblue;
    }
  }
  &__chat-history {
    background: $white;
    border-radius: 6px;
    margin: 20px 0 0 0;
  }
}
.container-quest {
  grid-template-columns: 100%;
}
.container-quest-decision{
  width:100%;
  display:grid;
  grid-template-columns: 69% 30%;
  gap: 1%;
  &__quest-card{
    width:100%;
    height:100%;
  }
}
.decision{
  position: relative;
  display:flex;
  width:100%;
  height:100%;
  background-color: $white;
  border-radius: 6px;
  border: 1px solid transparent;
  &:hover{
    border: 1px solid $black100;
  }
  &__v-spacer {
    width: 1px;
    background-color: $black0;
    margin: 0 20px;
    height: 100%;
  }
  &__block{
    width:100%;
    display: flex;
    flex-direction: column;
    padding: 20px 10px 55px;
    word-break: break-word;
  }
  &__review{
   position: absolute;
    bottom: 23px;
    right: 20px;
  }
  &__title{
    @include text-simple;
    font-weight: 500;
    font-size: 18px;
    color: $black800;
  }
  &__text{
    color: $black600;
    padding-top: 3px;
    max-height: 250px;
    word-wrap: break-word;
    overflow: auto;
    overscroll-behavior: contain;
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
  .container-quest-decision{
    width:100%;
    display:grid;
    grid-template-columns: 100%;
    grid-template-rows: auto auto;
  }
  .decision{
    flex-direction:column;
    &__v-spacer {
      height:1px;
      width: 100%;
      margin-top: 10px;
    }
  }
}
</style>
