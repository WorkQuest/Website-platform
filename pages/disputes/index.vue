<template>
  <div class="main">
    <div class="main__body">
      <div class="page">
        <h2 class="page__title">
          {{ $t('disputes.disputes') }}
        </h2>
        {{ disputes }}
        <!--        TODO: Убрать вывод -->
        <div
          v-if="disputes.count === 0"
          class="page__none"
        >
          <img
            alt=""
            src="~assets/img/ui/youAreHaven'tDisputs.svg"
          >
        </div>
        <div
          v-if="disputes.count !== 0"
          class="page__grid"
        >
          <span
            v-for="(item, i) in disputes"
            :key="i"
          >
            <div
              class="page__card"
              @click="toDisputes(item.id)"
            >
              <div class="page__card-body">
                <div class="page__text">
                  {{ $t('disputes.dispute') }} <span class="page__text_blue">{{ item.id }}</span>
                </div>
                <div class="page__text">
                  {{ $t('disputes.quest') }} <span class="page__text_blue">Quest</span>
                </div>
                <div class="page__text">
                  {{ $t('disputes.employer') }} <span class="page__text_blue">{{ item.author.firstName }} {{ item.author.lastName }}</span>
                </div>
                <div class="page__text">
                  {{ $t('disputes.questSalary') }} <span class="page__text_blue">QuestSalary</span>
                </div>
                <div class="page__text">
                  {{ $t('disputes.disputeTime') }} <span class="page__text_blue">{{ $moment(item.createdAt).format('Do MMMM YYYY, hh:mm a') }}</span>
                </div>
                <div class="page__text">
                  {{ $t('disputes.status') }} <span
                    v-if="item.status === 'Pending'"
                    class="page__text_yellow"
                  >{{ item.status }}</span>
                  <span
                    v-if="item.status === 'Completed'"
                    class="page__text_green"
                  >{{ item.status }}</span>
                </div>
              </div>
              <div class="page__vl" />
              <div class="page__card-body">
                <div class="page__text">
                  {{ $t('disputes.decision') }}
                  <div
                    v-if="item"
                    class="page__decision"
                  >
                    -
                  </div>
                  <div
                    v-if="!item"
                    class="page__decision"
                  >
                    {{ item.decision }}
                  </div>
                </div>
              </div>
            </div>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Disputes',
  computed: {
    ...mapGetters({
      tags: 'ui/getTags',
      userRole: 'user/getUserRole',
      userData: 'user/getUserData',
      disputes: 'disputes/getDiscussions',
    }),
  },
  async created() {
    await this.getDiscussionsList();
  },
  async mounted() {
    this.SetLoader(true);
    this.SetLoader(false);
  },
  methods: {
    toDisputes(item) {
      this.$router.push({ path: `/disputes/${item}` });
    },
    getDiscussionsList() {
      this.$store.dispatch('disputes/getDiscussions');
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
