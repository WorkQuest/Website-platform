<template>
  <div
    class="main"
    data-selector="PAGE-DISPUTES"
  >
    <div class="main__body">
      <div class="page">
        <h2 class="page__title">
          {{ $t('meta.disputes') }}
        </h2>
        <div
          v-if="disputesCount > 0"
          class="page__dispute-cards"
        >
          <div
            v-for="(item, i) in disputes"
            :key="i"
            :data-selector="`TO-DISPUTES-ROUTE-${i}`"
            class="wrapperCard"
          >
            <div
              class="page__card"
              @click="toDisputes(item.id)"
            >
              <div class="page__card-body">
                <div
                  v-for="(card, key) in cardData(item)"
                  :key="key"
                  :data-selector="`DISPUTES-${key}`"
                  class="page__text"
                >
                  {{ card.title }}
                  <span class="page__text_blue">
                    {{ card.value }}
                  </span>
                </div>
                <div class="page__text">
                  {{ $t('disputes.status') }}
                  <span :class="[colorDisputeStatus[item.status]]">
                    {{ disputeStatus(item.status) }}
                  </span>
                </div>
              </div>
              <div class="page__vl" />
              <div class="page__card-body">
                <div class="page__text">
                  {{ $t('disputes.decision') }}
                  <div class="page__decision">
                    {{ item.decisionDescription ? item.decisionDescription : '-' }}
                  </div>
                </div>
              </div>
            </div>
            <div
              v-if="item.status === $options.DisputeStatues.CLOSED"
              class="page__review"
            >
              <star-rating
                :stars-number="5"
                :data-selector="`ACTION-BTN-SHOW-REVIEW-MODAL-${item.id}`"
                :rating="item.currentUserDisputeReview && item.currentUserDisputeReview.mark"
                :is-disabled="item.currentUserDisputeReview && !!item.currentUserDisputeReview.mark"
                @input="showReviewModal($event, item.id)"
              />
            </div>
          </div>
        </div>
        <emptyData
          v-else
          :description="$tc(`errors.emptyData.emptyDisputes`)"
        />
        <base-pager
          v-if="totalPages > 1"
          v-model="currentPage"
          :total-pages="totalPages"
          class="page__pager"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import moment from 'moment';
import BigNumber from 'bignumber.js';
import emptyData from '~/components/app/info/emptyData';
import { DisputeStatues, Path, TokenSymbols } from '~/utils/enums';
import modals from '~/store/modals/modals';

const LIMIT = 10;

export default {
  name: 'Disputes',
  components: {
    emptyData,
  },
  DisputeStatues,
  data: () => ({
    currentPage: 1,
    query: {
      limit: LIMIT,
      offset: 0,
    },
  }),
  computed: {
    ...mapGetters({
      tags: 'ui/getTags',
      userRole: 'user/getUserRole',
      userData: 'user/getUserData',
      disputes: 'disputes/getUserDisputes',
      disputesCount: 'disputes/getUserDisputesCount',
    }),
    colorDisputeStatus() {
      return {
        [DisputeStatues.PENDING]: 'page__text_blue',
        [DisputeStatues.IN_PROGRESS]: 'page__text_yellow',
        [DisputeStatues.PENDING_CLOSED]: 'page__text_green',
        [DisputeStatues.CLOSED]: 'page__text_green',
      };
    },
    totalPages() {
      return Math.ceil(this.disputesCount / this.query.limit);
    },
  },
  watch: {
    async currentPage() {
      this.query.offset = (this.currentPage - 1) * LIMIT;
      await this.getUserDisputes();
    },
  },
  async mounted() {
    await this.getUserDisputes();
  },
  methods: {
    async getUserDisputes() {
      this.ScrollToTop();
      this.SetLoader(true);
      await this.$store.dispatch('disputes/getUserDisputes', this.query);
      this.SetLoader(false);
    },
    cardData(item) {
      return [
        {
          title: this.$t('disputes.dispute'),
          value: item.number,
        },
        {
          title: this.$t('disputes.quest'),
          value: item.quest.title,
        },
        {
          title: this.$t('disputes.employer'),
          value: `${item.quest.user.firstName} ${item.quest.user.lastName}`,
        },
        {
          title: this.$t('disputes.questSalary'),
          value: `${new BigNumber(item.quest.price).shiftedBy(-18).toString()} ${TokenSymbols.WUSD}`,
        },
        {
          title: this.$t('disputes.disputeTime'),
          value: this.convertDate(item.quest.createdAt),
        },
      ];
    },
    toDisputes(itemId) {
      this.$router.push(`${Path.DISPUTES}/${itemId}`);
    },
    convertDate(createdAt) {
      return createdAt ? moment(createdAt).format('MMMM Do YYYY, h:mm') : '';
    },
    disputeStatus(status) {
      const obj = {
        [DisputeStatues.PENDING]: this.$t('disputes.pending'),
        [DisputeStatues.IN_PROGRESS]: this.$t('disputes.inProgress'),
        [DisputeStatues.PENDING_CLOSED]: this.$t('meta.completed'),
        [DisputeStatues.CLOSED]: this.$t('meta.completed'),
      };
      return obj[status];
    },
    showReviewModal(rating, disputeId) {
      this.ShowModal({
        key: modals.review,
        title: this.$tc('modals.titles.review'),
        rating,
        callback: async (message, mark) => {
          this.CloseModal();
          this.SetLoader(true);
          const { ok, msg } = await this.$store.dispatch('user/sendReviewDispute', { disputeId, message, mark });
          if (ok) {
            this.ShowModal({ key: modals.thanks });
            await this.$store.dispatch('disputes/setMarkInDisputes', { disputeId, mark });
          } else {
            await this.ShowToast(msg || ' ');
          }
          this.SetLoader(false);
        },
      });
    },
  },
};

</script>

<style lang="scss" scoped>

.main {
  @include main;
&-white {
   @include main-white;
 }
}

.page {
  &__none {
    display: grid;
    width: 100%;
    align-items: center;
    justify-items: center;
  }
  &__decision {
    @include text-simple;
    font-weight: 400;
    font-size: 16px;
    color: $black500;

    line-height: 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: initial;
    display: -webkit-box;
    line-clamp: 10;
    -webkit-line-clamp: 10;
    box-orient: vertical;
    -webkit-box-orient: vertical;
    word-break: break-word;
  }
  &__title {
    @include text-simple;
    margin: 20px 0;
    font-size: 25px;
    color: $black800;
    text-align: left;
    word-break: break-word;
  }
  &__card-body {
    height: fit-content;
    max-height: 400px;
    margin: 20px;
    padding-bottom: 35px;
  }
  &__dispute-cards {
    display: grid;
    grid-template-columns: repeat(2, 50%);
    grid-template-rows: auto;
    grid-gap: 15px;
  }
  &__card {
    position:relative;
    background-color: $white;
    border-radius: 6px;
    display: grid;
    grid-template-columns: 10fr 0.5fr 10fr;
    width: 100%;
    transition: .5s;
    &:hover {
      box-shadow: -1px 1px 8px 0px rgba(34, 60, 80, 0.1);
      cursor: pointer;
    }
  }
  &__review{
    position: absolute;
    width:96px;
    bottom: 20px;
    right: 20px;
    margin-top:20px;
  }
  &__text {
    @include text-simple;
    font-size: 16px;
    word-break: break-all;
    &_blue {
      color: $blue;
    }
    &_yellow {
      color: $yellow;
    }
    &_green {
      color: $green;
    }
  }
  &__vl {
    margin: 20px 0;
    border-left: 1px solid $black0;
    height: auto;
  }
  .pager {
    margin-top: 20px;
  }
}
.wrapperCard{
  position: relative;
}
@include _1199 {
  .main {
    &__body {
      padding: 20px;
    }
  }
  .page {
    &__dispute-cards {
      grid-template-columns: 1fr;
      grid-gap: 15px;
    }
  }
}

@include _575 {
  .main {
    &__body {
      padding: 0 20px;
    }
  }
  .page {
    &__dispute-cards {
      grid-gap: 15px;
    }
    &__text {
      font-size: 12px;
    }
    &__decision {
      font-size: 12px;
    }
  }
}

</style>
