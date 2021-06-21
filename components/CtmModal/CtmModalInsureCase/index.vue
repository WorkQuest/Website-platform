<template>
  <ctm-modal-box
    class="messageSend"
    :title="$t('modals.insureCase')"
  >
    <div class="ctm-modal__content">
      <div class="user">
        <img
          class="ava"
          src="~/assets/img/temp/avatar-small.jpg"
          alt=""
        >
        <div class="name">
          {{ $tc('insuring.paymentOfInsurance', $t('insuring.userName') ) }}
        </div>
      </div>
      <div class="ctm-modal_left">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luctus venenatis, lectus magna fringilla urna, porttitor
      </div>
      <div class="ctm-modal__pics">
        <img
          v-for="(pic, i) in pics"
          :key="i"
          class="pic"
          :src="pic"
          alt=""
        >
      </div>
      <div class="ctm-modal__content-btns">
        <base-btn
          class="btn"
          @click="hide()"
        >
          {{ $t('meta.cancel') }}
        </base-btn>
      </div>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';
import modals from '~/store/modals/modals';

export default {
  name: 'ModalApplyForAPension',
  data() {
    return {
      pics: [
        require('~/assets/img/ui/insure-case_1.svg'),
        require('~/assets/img/ui/insure-case_2.svg'),
        require('~/assets/img/ui/insure-case_3.svg'),
      ],
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
    }),
  },
  methods: {
    hide() {
      this.CloseModal();
    },
    showPensionIsRegisteredModal() {
    },
  },
};
</script>

<style lang="scss" scoped>

.ctm-modal {
  @include modalKit;
  &__content-field {
    margin: 15px 0 0 0;
  }

  .user {
    display: flex;
    gap: 15px;
    align-items: center;
    background-color: #F7F8FA;
    border-radius: 5px;
    height: 42px;
    width: 100%;
    padding: 0 10px;
    margin-bottom: 25px;

    .ava {
      height: 25px;
      width:  25px;
      border-radius: 50%;
    }

    .name {
      font-weight: 400;
      font-size: 16px;
      color: #7C838D;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: calc(100% - 55px);
    }
  }

  &_left {
    text-align: left;
    font-size: 16px;
    font-weight: 400;
    line-height: 21px;
    color: #4C5767;
  }

  &__pics {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin: 25px 0;

    .pic {}
  }

  &__content-btns {
    .btn {
        box-sizing: border-box;
        font-weight: 400;
        font-size: 16px;
        color: #0083C7;
        border: 1px solid #0083C71A;
        border-radius: 6px;
        transition: .3s;
        background-color: #fff;

        &:hover {
          background-color: #0083C71A;
          border: 0px;
        }
      }
  }
}

.messageSend {
  max-width: 495px !important;

  &__content {
    display: grid;
    grid-template-columns: 1fr;
    justify-items: center;
    grid-gap: 20px;
  }
}
</style>
