<template>
  <div>
    <div
      class="main-section main-section_white"
    >
      <div class="main-container">
        <userInfo :selected="selected" />

        <button
          class="tab__btn"
          :class="{tab__btn_active: selected === 1}"
          @click="selected = 1"
        >
          {{ $t('profile.quests') }}
        </button>
        <button
          class="tab__btn"
          :class="{tab__btn_active: selected === 2}"
          @click="selected = 2"
        >
          {{ $t('profile.reviews') }}
        </button>
        <button
          v-if="userRole === 'worker'"
          class="tab__btn"
          :class="{tab__btn_active: selected === 3}"
          @click="selected = 3"
        >
          {{ $t('profile.portfolio') }}
        </button>
      </div>
    </div>

    <div class="information-section">
      <div class="main-container">
        <div
          v-if="selected === 1"
          class="tab__container"
        >
          <quests
            v-if="questsObjects.count !== 0"
            :limit="questLimits"
            :object="questsObjects"
            :page="'quests'"
          />
          <emptyData
            v-else
            :description="$t(`errors.emptyData.${userRole}.allQuests.desc`)"
            :btn-text="$t(`errors.emptyData.${userRole}.allQuests.btnText`)"
            :link="userRole === 'employer' ? '/create-quest' : '/quests'"
          />
        </div>

        <div
          v-if="selected === 2"
          class="tab__container"
        >
          <reviewsTab />
        </div>

        <div
          v-if="selected === 3"
          class="tab__container"
        >
          <div class="add-btn__container">
            <base-btn
              @click="showAddCaseModal()"
            >
              {{ $t('ui.profile.addCase') }}
              <template v-slot:right>
                <span class="icon-plus" />
              </template>
            </base-btn>
          </div>
          <portfolioTab />
        </div>
        <div
          v-if="userData.role === 'worker'"
          class="button"
        >
          <nuxt-link
            v-if="selected === 2"
            class="button__more"
            to="/profile"
          >
            {{ $t('meta.showAllReviews') }}
          </nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import portfolioTab from '~/components/app/pages/profile/tabs/portfolio';
import reviewsTab from '~/components/app/pages/profile/tabs/reviews';
import quests from '~/components/app/pages/common/quests';
import userInfo from '~/components/app/pages/common/userInfo';
import modals from '~/store/modals/modals';
import emptyData from '~/components/app/info/emptyData';

export default {
  name: 'Index',
  components: {
    reviewsTab,
    portfolioTab,
    quests,
    userInfo,
    emptyData,
  },
  data() {
    return {
      selected: 1,
      questLimits: 100,
      questsObjects: {},
    };
  },
  computed: {
    ...mapGetters({
      tags: 'ui/getTags',
      userRole: 'user/getUserRole',
      userData: 'user/getUserData',
    }),
    cardLevelClass(idx) {
      const { cards } = this;
      return [
        { card__level_reliable: cards[idx].level.code === 2 },
        { card__level_checked: cards[idx].level.code === 3 },
      ];
    },
  },
  async mounted() {
    this.SetLoader(true);
    this.questsObjects = await this.$store.dispatch('quests/getUserQuests', { userId: this.userData.id });
    this.SetLoader(false);
  },
  methods: {
    isRating(type) {
      return (type === 3);
    },
    showAddCaseModal() {
      this.ShowModal({
        key: modals.addCase,
      });
    },
  },
};
</script>

<style lang="scss" scoped>

.add-btn {
  &__container {
    width: 154px;
    margin: 20px 0 20px 0;
  }
}

.tab {
  &__container {
    margin: 20px 0 20px 0;
  }
  &__btn {
    color: $black500;
    font-size: 16px;
    padding: 10px;
    &_active {
      color: $black800;
      font-size: 16px;
      border-bottom: 1px solid $blue;
      padding: 10px;
    }
  }
}
.contacts {
  &__grid {
    height: 100%;
    max-height: 43px;
    display: grid;
    grid-template-columns: 5fr 2fr;
    margin: 0 0 15px 0;
    padding: 10px 0;
  }
}
.message {
  &__container-btn {
    @extend .styles__full;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 100%;
  }
  &__btn {
    max-width: 250px;
    cursor: pointer;
  }
}
.container {
  &__title {
    font-weight: 400;
    font-size: 12px;
    color: $black500;
  }
}

.subtitle {
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 130%;
  color: $black500;
  margin: -20px 0 -5px 0;
}

.button {
  @extend .styles__flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  &__more {
    @extend .button;
    display: inline-block;
    text-decoration: none;
    font-size: 16px;
    line-height: 130%;
    color: #0083C7;
    border: 1px solid rgba(0, 131, 199, 0.1);
    border-radius: 6px;
    padding: 13px 67px 13px 28px;
    background-image: url("data:image/svg+xml,%3Csvg width='11' height='6' viewBox='0 0 11 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E\a           %3Cpath d='M5.5 5.5L10.5 0.5L0.5 0.5L5.5 5.5Z' fill='%230083C7'/%3E\a           %3C/svg%3E                                                          \a           ");
    background-position: 82% 21px;
    background-repeat: no-repeat;
  }
}

.quest {
  &__spec {
    @include text-simple;
    font-style: normal;
    font-weight: 500;
    font-size: 25px;
    color: $black800;
    margin: 0 0 0 0;
  }
  &__title {
    @include text-simple;
    font-style: normal;
    font-weight: 500;
    font-size: 30px;
    color: $black800;
    margin: 0 0 10px 0;
  }
  &__description {
    @include text-simple;
    font-style: normal;
    color: $black700;
    font-weight: 400;
    font-size: 16px;
    line-height: 130%;
    /* or 21px */
  }
  &__location {
    @include text-simple;
    color: $black700;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    display: flex;
    align-items: center;
    flex-direction: row;
  }
  &__count {
    @include text-simple;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    color: $black400;
  }
  &__group {
    color:$black800;
    display: flex;
    flex-direction: row;
  }
  &__card {
    color:$black800;
  }
}

.contact {
  &__link {
    text-decoration: none;
    font-size: 14px;
    line-height: 130%;
    color: #7C838D;
    margin-right: 30px;
    justify-content: center;
    align-items: center;
  }
}

.icon {
  font-size: 20px;
  cursor: pointer;
  &-plus:before {
    @extend .icon;
    content: "\e9a8";
    color: $white;
    font-size: 16px;
  }
  &-chat:before {
    @extend .icon;
    content: "\e9ba";
    color: $green;
    font-size: 25px;
  }
  &-Earth::before {
    @extend .icon;
    color: #7C838D;
    font-size: 16px;
    padding-right: 5px;
  }
  &-location::before {
    @extend .icon;
    color: #7C838D;
    font-size: 16px;
    padding-right: 5px;
  }
  &-phone::before {
    @extend .icon;
    color: #7C838D;
    font-size: 16px;
    padding-right: 5px;
  }
  &-mail::before {
    @extend .icon;
    color: #7C838D;
    font-size: 16px;
    padding-right: 5px;
  }
}

.main-section {
  &_white {
    background-color: $white;
  }
}
.main-container {
  width: 1180px;
  margin: 0 auto;
}

.rating {
  padding: 0 15px 0 0;
}

.col {
  &__header {
    @extend .styles__flex;
    @extend .styles__center;
  }
  &__main-header {
    @extend .styles__flex;
    @extend .styles__center;
  }
}

.styles {
  &__full {
    width: 100%;
    height: 100%;
  }
  &__between {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  &__flex {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
  }
  &__center {
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
  }
}
.background {
  &__common {
    background-repeat: no-repeat;
    background-position: 0 -1px;
    padding-left: 25px;
  }
}

.title {
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 130%;
  color: #1D2127;
  margin: 0 0 20px 0;
}

@include _1199 {
  .template {
    &__main {
      padding-left: 20px;
      padding-right: 20px;
    }
  }
  .main-container {
    width: 100%;
    padding-left: 20px;
    padding-right: 20px;
  }
  .box__skills {
    grid-template-columns: repeat(4, auto);
    grid-gap: 20px;
  }
}
@include _991 {
  .box {
    grid-template-columns: 1fr;
  }
}

@include _575 {
  .footer {
    &__quest {
      display: grid !important;
      grid-template-columns: 1fr;
      grid-gap: 10px;
    }
  }
  .simple-button {
    padding: 0;
  }
  .box__profile {
    flex-direction: column;
    align-items: center;
  }
}
</style>
