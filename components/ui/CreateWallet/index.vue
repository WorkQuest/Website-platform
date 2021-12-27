<template>
  <div>
    <ValidationObserver
      v-if="step === walletState.saveMnemonic"
      v-slot="{ handleSubmit }"
      class="wallet__container"
    >
      <div
        class="wallet__text wallet__text_title"
      >
        {{ $t('createWallet.savePhrase') }}
      </div>
      <form
        class="wallet__fields"
        @submit.prevent="handleSubmit($emit('goStep', walletState.confirmMnemonic))"
      >
        <div class="wallet__mnemonic">
          {{ mnemonic }}
          <button
            v-clipboard:copy="mnemonic"
            v-clipboard:success="ClipboardSuccessHandler"
            v-clipboard:error="ClipboardErrorHandler"
            type="button"
          >
            <span class="icon-copy wallet__mnemonic_copy" />
          </button>
        </div>
        <div class="wallet__confirm-phrase">
          <input
            id="savedMnemonic"
            v-model="savedMnemonicValue"
            type="checkbox"
            class="wallet__confirm-phrase_box"
          >
          <label
            for="savedMnemonic"
            class="wallet__confirm-phrase_label"
          >
            {{ $t('createWallet.keptPhrase') }}
          </label>
        </div>

        <div class="wallet__action">
          <base-btn :disabled="!savedMnemonicValue">
            {{ $t('meta.next') }}
          </base-btn>
        </div>
      </form>
    </ValidationObserver>
    <ValidationObserver
      v-if="step === walletState.confirmMnemonic"
      v-slot="{ handleSubmit, valid }"
      class="wallet__container"
    >
      <div class="wallet__text wallet__text_title">
        {{ $t('createWallet.confirmSecretPhrase') }}
      </div>
      <form
        class="wallet__fields"
        @submit.prevent="handleSubmit(submitNewWallet)"
      >
        <base-field
          v-model="confirmMnemonic.first"
          :rules="`required|is:${confirmMnemonicData.first}`"
          :placeholder="$t('createWallet.typeSecret', { a: 3 })"
          :name="$t('createWallet.secret', { a: 3 })"
        />
        <base-field
          v-model="confirmMnemonic.second"
          :rules="`required|is:${confirmMnemonicData.second}`"
          :placeholder="$t('createWallet.typeSecret', { a: 7 })"
          :name="$t('createWallet.secret', { a: 7 })"
        />
        <div class="wallet__action">
          <base-btn :disabled="!valid">
            <slot name="actionText">
              {{ $t('createWallet.create') }}
            </slot>
          </base-btn>
        </div>
      </form>
    </ValidationObserver>
    <div
      v-if="step === walletState.importOrCreate"
      class="wallet_container"
    >
      <div class="wallet__text wallet__text_title">
        {{ $t('createWallet.createOrImport') }}
      </div>
      <div class="wallet__action">
        <base-btn @click="$emit('goStep', walletState.saveMnemonic)">
          <slot name="actionText">
            {{ $t('createWallet.create') }}
          </slot>
        </base-btn>
      </div>
      <div class="wallet__action">
        <base-btn @click="$emit('goStep', walletState.importMnemonic)">
          <slot name="actionText">
            {{ $t('createWallet.importWallet') }}
          </slot>
        </base-btn>
      </div>
    </div>
    <ValidationObserver
      v-if="step === walletState.importMnemonic"
      v-slot="{ handleSubmit, valid }"
      class="wallet__container"
    >
      <div class="wallet__text wallet__text_title">
        {{ $t('createWallet.importWallet') }}
      </div>
      <form
        class="wallet__fields"
        @submit.prevent="handleSubmit(importWallet)"
      >
        <base-field
          v-model="mnemonicInput"
          rules="required|mnemonic"
          :placeholder="'Type secret phrase'"
          :name="'Secret phrase'"
        />
        <div class="wallet__action">
          <base-btn :disabled="!valid">
            <slot name="actionText">
              {{ $t('createWallet.importWallet') }}
            </slot>
          </base-btn>
        </div>
      </form>
    </ValidationObserver>
  </div>
</template>

<script>
import { createWallet, generateMnemonic } from '~/utils/wallet';

const { walletState } = require('~/utils/enums');

export default {
  name: 'CreateWallet',
  props: {
    step: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      savedMnemonicValue: false,
      mnemonic: '',
      mnemonicInput: '',
      confirmMnemonic: {
        first: '',
        second: '',
      },
      confirmMnemonicData: {
        first: '',
        second: '',
      },
    };
  },
  computed: {
    walletState() {
      return walletState;
    },
  },
  watch: {
    step(newVal) {
      if (newVal === walletState.signPage) this.generate();
    },
  },
  mounted() {
    this.generate();
  },
  methods: {
    generate() {
      this.mnemonic = generateMnemonic();
      const s = this.mnemonic.split(' ');
      this.confirmMnemonicData = {
        first: s[2],
        second: s[6],
      };
    },
    submitNewWallet() {
      const wallet = createWallet(this.mnemonic);
      this.$emit('submit', {
        publicKey: wallet.publicKey,
        address: wallet.address,
        mnemonic: { phrase: this.mnemonic },
      });
    },
    importWallet() {
      const wallet = createWallet(this.mnemonicInput);
      this.$emit('import', {
        publicKey: wallet.publicKey,
        address: wallet.address,
        mnemonic: { phrase: this.mnemonicInput },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.wallet {
  &__back {
    cursor: pointer;
  }
  &__container {
    display: grid;
    grid-template-rows: auto;
  }
  &__text {
    font-family: 'Inter', sans-serif;
    font-style: normal;
    line-height: 130%;
    &_title {
      font-weight: 600;
      font-size: 34px;
      color: $black800;
    }
    &_simple {
      color: #000000;
      font-weight: 300;
      font-size: 16px;
      padding-top: 15px;
    }
    &_link {
      padding-left: 5px;
      font-weight: 300;
      font-size: 16px;
      color: #0083C7;
      text-decoration: underline;
    }
  }
  &__fields {
    padding-top: 40px;
    display: grid;
    grid-template-columns: 1fr;
  }
  &__action {
    padding-top: 30px;
  }
  &__mnemonic {
    position: relative;
    padding: 10px 40px 10px 10px;
    background: $grey;
    border-radius: 12px;
    font-weight: 500;
    min-height: 50px;
    &_copy {
      position: absolute;
      right: 10px;
      top: 25%;
      height: 100%;
      font-size: 28px;
      cursor: pointer;
      &:hover::before {
        color: $blue;
      }
    }
  }
  &__confirm-phrase {
    margin-top: 20px;
    display: flex;
    align-items: center;
    &_label {
      margin: 0 0 0 10px !important;
    }
    &_box {
      width: 20px !important;
      height: 20px !important;
    }
  }
}
@include _1199 {
  .wallet {
    &__text {
      &_title {
        font-size: 28px;
      }
    }
  }
}
</style>
