<template>
  <div class="wiki">
    <div class="wiki__header">
      <div class="wiki__container">
        <h3 class="wiki__title">
          {{ $t('wiki.title') }}
        </h3>
        <div class="wiki__search-field">
          <BaseInput
            class="wiki__input"
            :is-search="true"
            :is-hide-error="true"
            :placeholder="$t('wiki.searchPlaceholder')"
          />
          <BaseButton
            class="wiki__search-button"
            :text="$t('wiki.search')"
          />
        </div>
      </div>
    </div>
    <main class="wiki__container content">
      <nav class="wiki__navigation">
        <ul
          v-for="(item, index) in navigation"
          :key="index"
          class="wiki__ul"
          @click="selectTab(item)"
        >
          <li class="wiki__item">
            {{ $t(`wiki.navigation.${item.name}.${item.name}`) }}
          </li>
        </ul>
      </nav>
      <Main
        v-if="currentTab !== ''"
        :current-tab="currentTab"
      />
    </main>
  </div>
</template>

<script>
import Main from '~/components/wiki/main.vue';

export default {
  name: 'Wiki',
  components: {
    Main,
  },
  data() {
    return {
      currentTab: '',
      navigation: {
        header: {
          name: 'header',
          subtitle: 'twoTypes',
          cards: {
            employer: {
              title: 'employer',
              image: 'header-employer',
            },
            employee: {
              title: 'employee',
              image: 'header-employee',
            },
            quests: {
              title: 'quests',
              subtitle: 'general',
              image: 'header-quests',
            },
            employees: {
              title: 'employees',
              subtitle: 'general',
              image: 'header-employees',
            },
            myQuests: {
              title: 'myQuests',
              subtitle: 'offers',
              image: 'header-my-quests',
            },
            wallet: {
              title: 'wallet',
              subtitle: 'walletFunc',
              image: 'header-wallet',
            },
            instruments: {
              title: 'instruments',
              subtitle: 'DeFi',
              image: 'header-instruments',
            },
            language: {
              title: 'language',
              subtitle: 'choose',
              image: 'header-language',
            },
          },
        },
        profile: {
          name: 'profile',
          cards: {
            profile: {
              title: 'profile',
              subtitle: 'access',
              image: 'profile-profile',
            },
            settings: {
              title: 'settings',
              subtitle: 'change',
              image: 'profile-settings',
            },
            disputes: {
              title: 'disputes',
              subtitle: 'disputesOn',
              image: 'profile-disputes',
            },
            logout: {
              title: 'logout',
              subtitle: 'logoutFrom',
              image: 'profile-logout',
            },
          },
        },
        instruments: {
          name: 'instruments',
          cards: {
            retirement: {
              title: 'retirement',
              subtitle: 'annual',
              image: 'instruments-retirement',
            },
            referral: {
              title: 'referral',
              subtitle: 'inviting',
              image: 'instruments-referral',
            },
            P2P: {
              title: 'P2P',
              subtitle: 'insurance',
              image: 'instruments-P2P',
            },
            savings: {
              title: 'savings',
              subtitle: 'income',
              image: 'instruments-savings',
            },
            lending: {
              title: 'lending',
              subtitle: 'loan',
              image: 'instruments-lending',
            },
            liquidity: {
              title: 'liquidity',
              subtitle: 'providing',
              image: 'instruments-liquidity',
            },
            crosschain: {
              title: 'crosschain',
              subtitle: 'way',
              image: 'instruments-crosschain',
            },
            staking: {
              title: 'staking',
              subtitle: 'description',
              image: 'instruments-staking',
            },
          },
        },
        statuses: {
          name: 'statuses',
          cards: {
            delivery: {
              title: 'delivery',
              subtitle: 'agreement',
              image: 'statuses-delivery',
            },
            short: {
              title: 'short',
              subtitle: 'quest',
              image: 'statuses-short',
            },
            urgent: {
              title: 'urgent',
              subtitle: 'quest',
              image: 'statuses-urgent',
            },
            top: {
              title: 'top',
              subtitle: 'ranked',
              image: 'statuses-top',
            },
            reliable: {
              title: 'reliable',
              subtitle: 'number',
              image: 'statuses-reliable',
            },
            verified: {
              title: 'verified',
              subtitle: 'validated',
              image: 'statuses-verified',
            },
          },
        },
        buttons: {
          name: 'buttons',
          cards: {
            create: {
              title: 'create',
              subtitle: 'work',
              image: 'buttons-create',
            },
            results: {
              title: 'results',
              subtitle: 'offer',
              image: 'buttons-results',
            },
            workers: {
              title: 'workers',
              subtitle: 'search',
              image: 'buttons-workers',
            },
            details: {
              title: 'details',
              subtitle: 'information',
              image: 'buttons-details',
            },
            map: {
              title: 'map',
              subtitle: 'enable',
              image: 'buttons-map',
            },
            button: {
              title: 'button',
              subtitle: 'profile',
              image: 'buttons-button',
            },
            raise: {
              title: 'raise',
              subtitle: 'promoting',
              image: 'buttons-raise',
            },
          },
        },
        // 'employee',
        // 'employer',
        // 'user',
        // 'quest'
      },
    };
  },
  mounted() {
    this.currentTab = this.navigation.header;
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
  }
  &__input {
    width: 850px;
  }
  &__search-button {
    width: 220px;
  }
  &__navigation {
    width: 280px;
    background: $white;
  }
  &__item {
    @include text-simple;
    @include normal-font-size;
    list-style-type: none;
    font-size: 18px;
    padding: 15px;
    cursor: pointer;
  }
}
.content {
  display: grid;
  grid-template-columns: 1fr 3fr;
}
</style>
