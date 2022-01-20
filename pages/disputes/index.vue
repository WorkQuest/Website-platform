<template>
  <div class="main">
    <div class="main__body">
      <div class="page">
        <h2 class="page__title">
          {{ $t('disputes.disputes') }}
        </h2>
        <div
          v-if="disputesCount > 0"
          class="page__grid"
        >
          <div
            v-for="(item, i) in disputes"
            :key="i"
            class="page__card"
            @click="toDisputes(item.id)"
          >
            <div class="page__card-body">
              <div class="page__text">
                {{ $t('disputes.dispute') }} <span class="page__text_blue">{{ item.disputeNumber }}</span>
              </div>
              <div class="page__text">
                {{ $t('disputes.quest') }} <span class="page__text_blue">{{ item.quest.title }}</span>
              </div>
              <div class="page__text">
                {{ $t('disputes.employer') }} <span class="page__text_blue">{{ `${item.quest.user.firstName} ${item.quest.user.lastName}` }}</span>
              </div>
              <div class="page__text">
                {{ $t('disputes.questSalary') }} <span class="page__text_blue">{{ item.quest.price }}</span>
              </div>
              <div class="page__text">
                {{ $t('disputes.disputeTime') }} <span class="page__text_blue">{{ convertDate(item.quest.createdAt) }}</span>
              </div>
              <div class="page__text">
                {{ $t('disputes.status') }} <span
                  class="page__text_yellow"
                >{{ disputeStatus(item.status) }}</span>
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
        </div>
        <emptyData
          v-else
          :description="$t(`errors.emptyData.emptyDisputes`)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import moment from 'moment';
import emptyData from '~/components/app/info/emptyData';
import { disputeStatues } from '~/utils/enums';

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
  },
  async mounted() {
    this.SetLoader(true);
    await this.$store.dispatch('disputes/getUserDisputes');
    this.SetLoader(false);
  },
  methods: {
    toDisputes(item) {
      this.$router.push({ path: `/disputes/${item}` });
    },
    convertDate(createdAt) {
      return createdAt ? moment(createdAt).format('MMMM Do YYYY, h:mm') : '';
    },
    disputeStatus(status) {
      const obj = {
        [disputeStatues.Pending]: this.$t('disputes.pending'),
        [disputeStatues.InProgress]: this.$t('disputes.inProgress'),
        [disputeStatues.Completed]: this.$t('disputes.completed'),
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
  &__grid {
    display: grid;
    width: 100%;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 15px;
  }
  &__card {
    background-color: $white;
    border-radius: 6px;
    display: grid;
    grid-template-columns: 5fr 1fr 5fr;
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
    margin: 20px 0 0 0;
    border-left: 1px solid $black0;
    height: 110px;
  }
}
@include _1199 {
  .main {
    &__body {
      padding: 20px;
    }
  }
  .page {
    &__grid {
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
    &__grid {
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
