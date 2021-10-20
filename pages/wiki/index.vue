<template>
  <div class="wiki">
    <div class="wiki__header">
      <div class="wiki__container">
        <h3 class="wiki__title">
          {{ $t('wiki.title') }}
        </h3>
        <div class="wiki__search-field">
          <base-field
            v-model="search"
            class="wiki__input"
            :is-search="true"
            :is-hide-error="true"
            :placeholder="$t('wiki.searchPlaceholder')"
          />
          <div class="wiki__button-field">
            <base-btn
              class="wiki__search-button"
              :text="$t('wiki.search')"
            />
          </div>
        </div>
      </div>
    </div>
    <main class="container wiki__container">
      <nav class="wiki__navigation">
        <ul
          v-for="(item, key) in navigation"
          :key="key"
          class="wiki__ul"
          @click="selectTab(item)"
        >
          <li
            class="wiki__item"
            :class="{'wiki__item_bold': item === currentTab}"
          >
            {{ $t(`wiki.navigation.${item}.title`) }}
          </li>
        </ul>
      </nav>
      <Content
        :current-tab="currentTab"
        :images="images[currentTab]"
      />
    </main>
  </div>
</template>

<script>
import Content from '~/components/wiki/content.vue';

export default {
  name: 'Wiki',
  components: {
    Content,
  },
  data() {
    return {
      currentTab: 'header',
      search: '',
      images: {
        header: {
          employer: 'header-employer',
          employee: 'header-employee',
          quests: 'header-employee',
          employees: 'header-employees',
          myQuests: 'header-my-quests',
        },
        profile: {
          profile: 'profile-profile',
          settings: 'profile-settings',
          disputes: 'profile-disputes',
          logout: 'profile-logout',
        },
        instruments: {
          retirement: 'instruments-retirement',
          referral: 'instruments-referral',
          P2P: 'instruments-P2P',
          savings: 'instruments-savings',
          lending: 'instruments-lending',
          liquidity: 'instruments-liquidity',
          crosschain: 'instruments-crosschain',
          staking: 'instruments-staking',
        },
        statuses: {
          delivery: 'statuses-delivery',
          short: 'statuses-short',
          urgent: 'statuses-urgent',
          top: 'statuses-top',
          reliable: 'statuses-reliable',
        },
        buttons: {
          create: 'buttons-create',
          results: 'buttons-results',
          workers: 'buttons-workers',
          details: 'buttons-details',
          map: 'buttons-map',
          button: 'buttons-button',
          raise: 'buttons-raise',
        },
        employer: {
          specialization: 'employer-specialization',
          rating: 'employer-rating',
          priority: 'employer-priority',
          distant: 'employer-distant',
          price: 'employer-price',
          time: 'employer-time',
        },
        employee: {
          specialization: 'employee-specialization',
          quests: 'employee-quests',
          delivery: 'employee-delivery',
          job: 'employee-job',
          distant: 'employee-distant',
          price: 'employee-price',
          time: 'employee-time',
        },
        user: {
          reviews: 'user-reviews',
          quests: 'user-quests',
          active: 'user-active',
          invited: 'user-invited',
          favorite: 'user-favorite',
        },
        quest: {
          goldPlus: 'quest-goldPlus',
          gold: 'quest-gold',
          silver: 'quest-silver',
          bronze: 'quest-bronze',
        },
      },
    };
  },
  computed: {
    navigation() {
      return Object.keys(this.$t('wiki.navigation'));
    },
  },
  mounted() {
    this.SetLoader(true);
    this.SetLoader(false);
  },
  methods: {
    selectTab(item) {
      this.currentTab = item;
    },
  },
};
</script>

<style lang="scss" scoped>
.wiki {
  background: $black0;
  &__header {
    background: $darkblue;
    height: 350px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 30px;
  }
  &__container {
    width: 1180px;
    margin: 0 auto;
  }
  &__title {
    @include text-simple;
    @include normal-font-size;
    margin-bottom: 20px;
    font-weight: 600;
    font-size: 34px;
    color:  $white;
  }
  &__search-field {
    background: $white;
    height: 83px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    border-radius: 6px;
  }
  &__input {
    width: 850px;
  }
  &__button-field {
    height: 100%;
    display: flex;
    align-items: center;
    border-left: $black0 1px solid;
  }
  &__search-button {
    width: 220px;
    margin-left: 20px;
  }
  &__navigation {
    width: 280px;
    background: $white;
    height: 477px;
    border-radius: 6px;
  }
  &__item {
    @include text-simple;
    @include normal-font-size;
    list-style-type: none;
    font-size: 18px;
    padding: 15px;
    cursor: pointer;
    &:hover {
      background: #E9EDF2;
      transition: 300ms;
    }
    &_bold {
      font-weight: 600;
    }
  }
}
.container {
  display: grid;
  grid-template-columns: 1fr 3fr;
  grid-gap: 20px;
}
@include _1199 {
  .wiki {
    &__container {
    width: 950px;
    }
  }
}
</style>
