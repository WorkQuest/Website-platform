<template>
  <ctm-modal-box
    class="review"
    :title="options.title"
  >
    <div class="review__body body">
      <div class="body__rating">
        <star-rating
          rating-type="modal"
          :rating="rating"
          :stars-number="5"
          @input="changeReview($event)"
        />
      </div>
      <validation-observer
        v-slot="{handleSubmit, valid}"
        class="body__content content"
        mode="aggressive"
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
                data-selector="MESSAGE"
                :placeholder="$t('meta.typeYourMessage')"
                rules="required|min:1|max:600"
                name="review"
              />
            </div>
          </div>
          <div class="content__buttons buttons">
            <div class="buttons__wrapper">
              <base-btn
                class="buttons__action"
                data-selector="SEND-REVIEW-FOR-USER"
                :disabled="!valid"
                @click="handleSubmit(sendReviewForUser)"
              >
                {{ $t('meta.btns.send') }}
              </base-btn>
            </div>
            <div class="buttons__wrapper">
              <base-btn
                data-selector="CANCEL"
                class="buttons__action"
                mode="outline"
                @click="CloseModal"
              >
                {{ $t('meta.btns.cancel') }}
              </base-btn>
            </div>
          </div>
        </div>
      </validation-observer>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';

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
    this.rating = this.options.rating;
  },
  methods: {
    changeReview(value) {
      this.rating = value;
    },
    async sendReviewForUser() {
      const { questId, callback, questMode } = this.options;
      await callback({
        questId,
        questMode,
        message: this.textArea,
        mark: this.rating,
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
    height: 214px;
    width: 100%;
  }
}

.buttons__wrapper {
  width: 45%;
}

.body__rating {
  padding-bottom: 15px;
}
</style>
