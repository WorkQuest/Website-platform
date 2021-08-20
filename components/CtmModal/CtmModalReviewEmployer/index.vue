<template>
  <ctm-modal-box
    class="review"
    :title="$t('modals.reviewOnEmployer')"
  >
    <div class="review__body body">
      <div class="body__rating">
        <button class="body__button">
          <b-form-rating
            v-model="localRating"
          />
        </button>
      </div>
      <div class="body__content content">
        <div class="content__desc">
          <div class="content__wrapper">
            <p class="content__labelMessage">
              {{ $t('modals.couple') }}
            </p>
            <div>
              <textarea
                class="content__textarea"
                :placeholder="$t('modals.hello')"
              />
            </div>
          </div>
          <div class="content__buttons buttons">
            <div class="buttons__wrapper">
              <base-btn
                class="buttons__action"
                @click="showThanksModal() "
              >
                {{ $t('meta.send') }}
              </base-btn>
            </div>
            <div class="buttons__wrapper">
              <base-btn
                class="buttons__action"
                mode="outline"
                @click="hide()"
              >
                {{ $t('meta.cancel') }}
              </base-btn>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ctm-modal-box>
</template>

<script>
/* eslint-disable object-shorthand,no-var */
import { mapGetters } from 'vuex';
import modals from '~/store/modals/modals';

export default {
  name: 'ModalSendARequest',
  components: {},
  data() {
    return {
      rating: '',
      localRating: 0,
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
    }),
  },
  // mounted() {
  //   this.localRating = JSON.parse(JSON.stringify(this.options.rating));
  // },
  methods: {
    hide() {
      this.CloseModal();
    },
    showThanksModal() {
      this.ShowModal({
        key: modals.thanks,
      });
    },
  },
};
</script>

<style lang="scss" scoped>

.review {
  max-width: 679px !important;
  &__desc {
    @include text-simple;
    width: 100%;
  }

  &__labelMessage {
    @include text-simple;
    font-size: 16px;
    color: $black800;
    padding: 0 0 5px 0;
  }
  &__body{
    padding: 15px 30px 15px 30px;
  }
}
.content {
  &__wrapper {
    margin: 0 0 25px 0;
  }
  &__buttons{
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
  }
  &__textarea {
    border-radius: 6px;
    padding: 11px 20px 11px 15px;
    height: 214px;
    width: 100%;
    border: 0;
    background-color: $grey200;
    resize: none;
    &::placeholder {
      color: $black200;
    }
  }
}
.buttons{
  &__wrapper {
    width: 45%;
  }
}
.body{
  &__rating{
    padding-bottom: 15px;
  }
}
</style>
