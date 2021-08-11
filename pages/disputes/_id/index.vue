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
          № 87974121
        </div>
        <div class="dispute__status">
          {{ $t('disputes.pending') }}
        </div>
      </div>
      <Card />
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
import Card from '~/components/app/cards/questCards';
import Messages from '~/components/app/Pages/Common/Messages';

export default {
  name: 'Index',
  components: {
    Card,
    Messages,
  },
  async mounted() {
    this.SetLoader(true);
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
