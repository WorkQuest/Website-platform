<template>
  <div class="switcher">
    <div
      class="switcher__item"
      :class="{'switcher_selected': connectionType === $options.ConnectionTypes.WQ_WALLET}"
      @click="handleSelect($options.ConnectionTypes.WQ_WALLET)"
    >
      {{ $t('walletSwitcher.wqWallet') }}
    </div>
    <div
      class="switcher__item"
      :class="{'switcher_selected': connectionType === $options.ConnectionTypes.WEB3}"
      @click="handleSelect($options.ConnectionTypes.WEB3)"
    >
      {{ $t('walletSwitcher.otherWallet') }}
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { ConnectionTypes, Path } from '~/utils/enums';
import { images } from '~/utils/images';
import modals from '~/store/modals/modals';

export default {
  name: 'WalletSwitcher',
  images,
  ConnectionTypes,
  computed: {
    ...mapGetters({
      access: 'user/accessToken',
      connectionType: 'web3/getConnectionType',
      isWalletConnected: 'wallet/getIsWalletConnected',
    }),
  },
  beforeMount() {
    if (this.isWalletConnected) this.$store.commit('web3/setConnectionType', ConnectionTypes.WQ_WALLET);
  },
  methods: {
    async handleSelect(connectionType) {
      if (connectionType === ConnectionTypes.WQ_WALLET) {
        if (!this.access) {
          this.ShowModal({
            key: modals.status,
            title: 'WorkQuest Wallet',
            img: images.WARNING,
            text: 'For using WQ Wallet you need to login on platform',
            cancel: this.$t('meta.btns.close'),
            button: this.$t('meta.login'),
            callback: () => {
              this.$router.push(Path.SIGN_IN);
            },
          });
          return;
        }
        if (!this.isWalletConnected) {
          await this.$store.dispatch('wallet/checkWalletConnected', { nuxt: this.$nuxt });
        }
      }
      this.$store.commit('web3/setConnectionType', connectionType);
    },
  },
};
</script>

<style lang="scss" scoped>

.switcher {
  width: fit-content;
  display: flex;
  text-align: center;
  background: $black300;
  border-radius: 6px;
  overflow: hidden;

  &__item {
    display: flex;
    align-items: center;
    padding: 5px 20px;
    user-select: none;
    color: $black600;

    cursor: pointer;
    &:hover {
      background: $black200;
    }
  }

  &_selected {
    font-weight: 600;
    background: $black0 !important;
    cursor: default;
  }
}

</style>
