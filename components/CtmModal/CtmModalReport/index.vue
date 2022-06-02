<template>
  <ctm-modal-box
    class="buy-wqt"
    :title="`Complain about ${options.userName}`"
  >
    <validation-observer
      v-slot="{handleSubmit, invalid}"
      class="buy-wqt__content content"
      tag="div"
    >
      <div class="content__field">
        <div class="content__field_label">
          Subject
        </div>
        <base-field
          v-model="amount"
          placeholder="Subject of the post"
          :name="$t('modals.amount')"
          :rules="`required`"
          data-selector="SUBJECT"
          @input="handleInput"
        />
      </div>
      <div class="content__field">
        <div class="content__field_label">
          Message
        </div>
        <base-textarea />
      </div>
      <base-btn
        :disabled="invalid"
        @click="handleSubmit(submit)"
      >
        {{ $t('meta.btns.send') }}
      </base-btn>
    </validation-observer>
  </ctm-modal-box>
</template>

<script>

import { mapGetters } from 'vuex';

export default {
  name: 'ModalReport',
  data() {
    return {
      amount: '',
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
    }),
  },
  watch: {
  },
  methods: {
    submit() {
      console.log('Submit');
    },
    handleInput() {
      console.log('Handle Input');
    },
  },
};
</script>

<style lang="scss" scoped>
.buy-wqt {
  &__content {
    padding: 20px 28px 30px 28px !important;
  }
}
.content {
  display: grid;
  grid-gap: 20px;
  &__change-network {
    color: $red;
  }
  &__field {
    display: grid;
    grid-gap: 10px;
    &_label {
      color: $black500;
    }
  }
  &__wqt {
    min-height: 24px;
  }
  &__balance {
    color: $black500;
  }
}
.max {
  &__text {
    padding: 0 10px;
  }
}
</style>
