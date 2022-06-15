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
          <base-pager
            v-if="totalPages > 1"
            v-model="page"
            :total-pages="totalPages"
            class="mining-page__pager"
          />
        </div>
        <emptyData
          v-else
          :description="$tc(`errors.emptyData.emptyDisputes`)"
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

export default {
  name: 'Disputes',
  components: {
    emptyData,
  },
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
      return Math.ceil(this.disputesCount / this.offset);
    },
  },
  async mounted() {
    this.SetLoader(true);
    await this.$store.dispatch('disputes/getUserDisputes');
    this.SetLoader(false);
  },
  methods: {
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
  }
  &__title {
    @include text-simple;
    margin: 20px 0 0 0;
    font-size: 25px;
    color: $black800;
    text-align: left;
  }
  &__card-body {
    margin: 20px;
  }
  &__dispute-cards {
    display: grid;
    width: 100%;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 15px;
  }
  &__card {
    background-color: $white;
    border-radius: 6px;
    display: grid;
    grid-template-columns: 10fr 0.5fr 10fr;
    width: 100%;
    margin: 20px 10px 10px 0;
    height: 100%;
    transition: .5s;
    &:hover {
      box-shadow: -1px 1px 8px 0px rgba(34, 60, 80, 0.1);
      cursor: pointer;
    }
  }
  &__text {
    @include text-simple;
    font-size: 16px;
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
    &__title {
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
