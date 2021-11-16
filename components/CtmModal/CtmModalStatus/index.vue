<template>
  <ctm-modal-box
    class="status"
    :is-header="false"
  >
    <div class="status__content">
      <img
        v-if="options.img"
        :src="options.img"
        alt="Status"
        class="content__picture"
      >
      <img
        v-if="options.type === 'installMetamask'"
        src="~/assets/img/ui/warning.svg"
        alt="Status"
        class="content__picture"
      >
      <div class="status__title">
        {{ options.title }}
      </div>
      <div class="status__desc">
        <span v-if="options.subtitle">
          {{ options.subtitle }}
        </span>
      </div>
      <a
        v-if="options.txHash"
        :href="link"
        target="_blank"
      >
        {{ $t('modals.transactionCheck') }}
      </a>
      <base-btn
        v-if="options.type === 'installMetamask'"
        class="status__action"
        @click="installMetamask()"
      >
        <span
          v-if="options.button"
          class="status__text"
        >
          {{ options.button }}
        </span>
        <span
          v-else
          class="status__text"
        >
          {{ $t('meta.ok') }}
        </span>
      </base-btn>
      <div
        v-if="options.type === 'goToChat'"
        class="btn__cols-two"
      >
        <base-btn
          class="status__action"
          mode="agree"
          @click="goToChat()"
        >
          <span
            v-if="options.button"
            class="status__text"
          >
            {{ options.button }}
          </span>
        </base-btn>
        <base-btn
          class="status__action"
          @click="goToChat()"
        >
          <span
            class="status__text"
            @click="hide()"
          >
            {{ $t('meta.ok') }}
          </span>
        </base-btn>
      </div>
      <base-btn
        v-else
        class="status__action"
        @click="hide()"
      >
        <span
          v-if="options.button"
          class="status__text"
        >
          {{ options.button }}
        </span>
        <span
          v-else
          class="status__text"
        >
          {{ $t('meta.ok') }}
        </span>
      </base-btn>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'ModalStatus',
  data() {
    return {
      link: '',
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
      chatInfoInviteOnQuest: 'quests/getChatInfoInviteOnQuest',
    }),
  },
  async mounted() {
    this.initLink();
    if (this.options.recipient) {
      const payload = {
        recipientAddress: this.options.recipient,
        query: '',
      };
      await this.$store.dispatch('defi/swapsForCrosschain', payload);
    }
  },
  methods: {
    goToChat() {
      const chatId = this.chatInfoInviteOnQuest.id;
      this.$router.push(`/messages/${chatId}`);
      this.hide();
    },
    installMetamask() {
      window.open('https://metamask.io/download.html');
    },
    hide() {
      if (this.options.path) this.$router.push(this.options.path);
      this.CloseModal();
    },
    initLink() {
      if (process.env.PROD === 'false') {
        if (this.options.chainTo === 3) {
          this.link = `https://rinkeby.etherscan.io/tx/${this.options.txHash}`;
        } else {
          this.link = `https://testnet.bscscan.com/tx/${this.options.txHash}`;
        }
      } else if (process.env.PROD === 'true') {
        if (this.options.chainTo === 3) {
          this.link = `https://etherscan.io/tx/${this.options.txHash}`;
        } else {
          this.link = `https://bscscan.com/tx/${this.options.txHash}`;
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>

.btn {
  &__cols-two {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 10px;
  }
}

.status {
  max-width: 337px !important;
  height: auto !important;
  padding: 0!important;
  &__content {
    display: grid;
    grid-template-columns: 1fr;
    justify-items: center;
    grid-gap: 20px;
    padding: 30px!important;
  }
  &__title {
    text-align: center;
    margin-top: 10px;
    font-weight: 500;
    font-size: 23px;
    line-height: 130%;
  }
  &__action {
    margin-top: 10px;
  }
  &__desc {
    font-size: 16px;
    line-height: 130%;
    text-align: center;
    color: $black600;
  }
}
</style>
