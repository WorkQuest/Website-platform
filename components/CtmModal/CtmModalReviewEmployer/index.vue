<template>
  <ctm-modal-box
    class="review"
    :title="$t('modals.reviewOnEmployer')"
  >
    <div class="review__body body">
      <div class="body__rating">
        <star-rating
          :rating-type="'modal'"
          :rating="rating"
          :stars-number="5"
          @input="changeReview($event)"
        />
      </div>
      <validation-observer
        v-slot="{handleSubmit, valid}"
        class="body__content content"
        tag="div"
      >
        <div class="content__desc">
          <div class="content__wrapper">
            <p class="content__labelMessage">
              {{ $t('modals.couple') }}
            </p>
            <div class="content__body">
              <base-textarea
                v-model="textArea"
                class="content__textarea"
                :placeholder="$t('modals.hello')"
                rules="required|min:1|max:600"
                name="review"
              />
            </div>
          </div>
          <div class="content__buttons buttons">
            <div class="buttons__wrapper">
              <base-btn
                class="buttons__action"
                :disabled="!valid"
                @click="handleSubmit(sendReviewForUser())"
              >
                {{ $t('meta.send') }}
              </base-btn>
            </div>
            <div class="buttons__wrapper">
              <base-btn
                class="buttons__action"
                mode="outline"
                @click="hide"
              >
                {{ $t('meta.cancel') }}
              </base-btn>
            </div>
          </div>
        </div>
      </validation-observer>
    </div>
  </ctm-modal-box>
</template>

<script>
/* eslint-disable object-shorthand,no-var */
import { mapGetters } from 'vuex';
import modals from '~/store/modals/modals';

export default {
  name: 'ModalSendARequest',
  data() {
    return {
      textArea: '',
      rating: 0,
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
    }),
  },
  mounted() {
    this.getQuestRating();
  },
  methods: {
    changeReview(value) {
      this.rating = value;
    },
    getQuestRating() {
      this.rating = this.options.rating;
    },
    removeLocalStorageRating() {
      localStorage.removeItem('questRating');
    },
    hide() {
      this.CloseModal();
    },
    async sendReviewForUser() {
      const { ok } = await this.$store.dispatch('user/sendReviewForUser', {
        questId: this.options.item.id,
        message: this.textArea,
        mark: this.rating,
      });
      if (ok) this.showThanksModal();
      this.removeLocalStorageRating();
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

  &__body {
    padding: 15px 30px 15px 30px;
  }
}
.content {
  &__wrapper {
    margin: 0 0 25px 0;
  }

  &__body {
    padding-bottom: 10px;
  }

  &__buttons {
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
    background-color: $black0;
    resize: none;
    &::placeholder {
      color: $black200;
    }
  }
}

.buttons__wrapper {
  width: 45%;
}

.body__rating {
  padding-bottom: 15px;
}
</style>
