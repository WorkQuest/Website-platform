<template>
  <div class="main">
    <div class="main__body">
      <div>
        <h2 class="page__title">
          {{ $t('disputes.disputes') }}
        </h2>
        <span
          v-for="(item, i) in Disputes"
          :key="i"
        >
          <div
            v-if="item.number.length === 0"
            class="page__zero-el"
          >
            <img src="~assets/img/ui/youAreHaven'tDisputs.svg">
          </div>
        </span>
        <div class="page__grid">
          <span
            v-for="(item, i) in Disputes"
            :key="i"
          >
            <div
              class="page__card"
              @click="toDisputes()"
            >
              <div class="page__card-body">
                <div class="page__text">
                  {{ $t('disputes.dispute') }} <span class="page__text_blue">{{ item.number }}</span>
                </div>
                <div class="page__text">
                  {{ $t('disputes.quest') }} <span class="page__text_blue">{{ item.quest }}</span>
                </div>
                <div class="page__text">
                  {{ $t('disputes.employer') }} <span class="page__text_blue">{{ item.employer }}</span>
                </div>
                <div class="page__text">
                  {{ $t('disputes.questSalary') }} <span class="page__text_blue">{{ item.questSalary }}</span>
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
                    v-if="item.decision.length === 0"
                    class="page__decision"
                  >
                    -
                  </div>
                  <div
                    v-if="item.decision.length !== 0"
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
export default {
  name: 'Disputes',
  computed: {
    Disputes() {
      return this.$store.getters['data/getDisputes'];
    },
  },
  async mounted() {
    this.SetLoader(true);
    this.SetLoader(false);
  },
  methods: {
    toDisputes() {
      this.$router.push('/disputes/1');
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
  &__zero-el {
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
