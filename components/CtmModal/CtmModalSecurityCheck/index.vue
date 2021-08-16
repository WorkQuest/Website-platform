<template>
  <ctm-modal-box
    class="check"
    :title="$t('securityCheck.title')"
  >
    <div class="check__content">
      <div class="content__msg">
        {{ errorMsg ? $t('errors.incorrectPass') : null }}
      </div>
      <div class="content__field">
        <div class="content__title">
          {{ $t('securityCheck.confCode') }}
        </div>
        <base-field
          v-model="securityCode"
          :is-hide-error="true"
          :placeholder="$t('securityCheck.placeholder')"
        />
        <div class="content__input">
          {{ $t('securityCheck.confCodeDesc') }}
        </div>
      </div>
      <div class="content__buttons buttons">
        <base-btn
          class="buttons__button"
          @click="hide()"
        >
          {{ $t('meta.send') }}
        </base-btn>
      </div>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'ModalSecurityCheck',
  data() {
    return {
      securityCode: '',
      errorMsg: '',
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
    }),
  },
  methods: {
    async hide() {
      this.CloseModal();
    },
  },
};
</script>

<style lang="scss" scoped>
.check {
  max-width: 382px !important;
  &__content {
    justify-items: center;
    padding: 0 28px 30px 28px!important;
  }

}
.content{
  &__msg{
    color: red;
  }
  &__title{
    font-size: 16px;
    line-height: 130%;
    margin-bottom: 4px;
  }
  &__field{
    margin: 25px 0 0 0;
  }
  &__buttons{
    margin-top: 25px;
  }
  &__input{
    font-size: 14px;
    margin-top: 10px;
    color: #8D96A2;
  }
}

</style>
