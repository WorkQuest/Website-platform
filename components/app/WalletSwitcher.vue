<template>
  <div class="switcher">
    <div
      class="switcher__item"
      :class="{'switcher_selected': connectionType === $options.ConnectionTypes.WQ_WALLET,
               'switcher_default': connectionType !== $options.ConnectionTypes.WQ_WALLET}"
      @click="handleSelect($options.ConnectionTypes.WQ_WALLET)"
    >
      <img
        :src="$options.images.WQ_LOGO"
        class="switcher__icon"
      > Wallet
    </div>
    <div
      class="switcher__item"
      :class="{'switcher_selected': connectionType === $options.ConnectionTypes.WEB3,
               'switcher_default': connectionType !== $options.ConnectionTypes.WEB3}"
      @click="handleSelect($options.ConnectionTypes.WEB3)"
    >
      <img
        :src="$options.images.ETH_BLACK"
        class="switcher__icon"
      > MetaMask
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { ConnectionTypes, Path } from '~/utils/enums';
import { getIsWalletConnected } from '~/utils/wallet';
import { images } from '~/utils/images';
import modals from '~/store/modals/modals';

export default {
  name: 'WalletSwitcher',
  images,
  ConnectionTypes,
  computed: {
    ...mapGetters({
      userData: 'user/getUserData',
      connectionType: 'web3/getConnectionType',
      isWalletConnected: 'wallet/getIsWalletConnected',
    }),
  },
  beforeMount() {
    if (this.isWalletConnected) this.$store.commit('web3/setConnectionType', ConnectionTypes.WQ_WALLET);
  },
  methods: {
    isWalletConnected() {
      return getIsWalletConnected();
    },
    async handleSelect(connectionType) {
      if (connectionType === ConnectionTypes.WQ_WALLET) {
        if (!this.userData) {
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
      this.$emit('selectedType', connectionType);
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
  }

  &_default {
    cursor: pointer;
    &:hover {
      background: $black200;
    }
  }

  &__icon {
    width: 20px;
    height: 20px;
    margin-right: 5px;
  }

  &_selected {
    background: $black0;
  }
}

</style>
