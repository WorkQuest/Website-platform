<template>
  <div class="main">
    <div class="main__body">
      <h2>Settings</h2>
      <div class="page__info">
        <div class="page__grid">
          <div class="page__info">
            <h2 class="page__info page__info-title">
              Add information about you, profile photo and KYC and level up your raiting
            </h2>
            <div class="page__info page__info-subtitle">
              Also rating is depend on your profile data and reviews
            </div>
            <div class="page__checkbox">
              <div>1</div>
              <div>Don’t show again</div>
            </div>
          </div>
          <div>img</div>
        </div>
      </div>
      <div>Profile information</div>
      <div class="page__skills">
        <div class="main-white">
          <div class="page__badge-skills">
            Skills:
          </div>
          <span
            v-for="(item, i) in badges"
            :key="i"
          >
            <div class="page__badge">
              {{ item.name }}
            </div>
          </span>
        </div>
      </div>
      <div class="settings">
        <div class="settings__left">
          <div>Settings</div>
          <div>
            <div class="settings__subtitle">
              Who can see my profile?
            </div>
            <div class="settings__option">
              All registered users
            </div>
            <div class="settings__option">
              All people in internet
            </div>
            <div class="settings__option">
              Only when submited work proposal
            </div>
          </div>
          <div>
            <div class="settings__subtitle">
              Who can see my profile?
            </div>
            <div class="settings__option">
              Only urgent proposals
            </div>
            <div class="settings__option">
              Only implementation
            </div>
            <div class="settings__option">
              Only ready for execution
            </div>
            <div class="settings__option">
              All registered users
            </div>
          </div>
        </div>
        <div class="settings__right">
          <div>Settings</div>
          <div class="">
            <div class="settings_blue">
              <div>Change password</div>
              <div>
                <base-btn
                  class=""
                >
                  {{ $t('btn.goToChat') }}
                </base-btn>
              </div>
            </div>
            <div class="settings_blue">
              <div>Enable Two-Step authentication</div>
              <div>
                <base-btn
                  class=""
                >
                  {{ $t('btn.goToChat') }}
                </base-btn>
              </div>
            </div>
            <div class="settings_blue">
              <div>Profile SMS varification</div>
              <div>
                <base-btn
                  class=""
                >
                  {{ $t('btn.goToChat') }}
                </base-btn>
              </div>
            </div>
            <div class="settings_blue">
              <div>Change role</div>
              <div>
                <base-btn
                  class=""
                >
                  {{ $t('btn.goToChat') }}
                </base-btn>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Settings',
  data() {
    return {
      badges: [
        {
          name: 'Painting works',
        },
        {
          name: 'Painting works',
        },
        {
          name: 'Painting works',
        },
        {
          name: 'Painting works',
        },
      ],
    };
  },
  async mounted() {
    this.SetLoader(true);
    this.SetLoader(false);
  },
};
</script>

<style lang="scss" scoped>
.main {
  @include main;
  &-white {
    @include main-white;
    justify-content: start;
    border-radius: 6px;
  }
}
.settings {
  display: grid;
  grid-template-columns: 40% 60%;
  &_blue {
    padding: 10px 20px 10px 20px;
    margin: 20px 0 20px 0;
    background: rgba(0, 131, 199, 0.1);
    border-radius: 6px;
    display: grid;
    grid-template-columns: 60% 40%;
    align-items: center;
  }
  &__option {
    padding: 5px 0 5px 0;
  }
  &__subtitle {
    margin: 15px 0;
    color: $black500;
    font-size: 16px;
  }
  &__left {
    @include main-white;
    justify-content: start;
    border-radius: 6px;
    margin: 20px 0 0 0;
    padding: 20px;
    width: 97%;
    display: flex;
    flex-direction: column;
  }
  &__right {
    @include main-white;
    justify-content: start;
    border-radius: 6px;
    margin: 20px 0 0 0;
    padding: 20px;
    width: 100%;
    display: flex;
    flex-direction: column;
  }
}
.page {
  &__grid {
    display: grid;
    grid-template-columns: 50% 50%;
  }
  &__checkbox {
    margin: 50px 0 20px 20px;
    display: flex;
    flex-direction: row;
  }
  &__info {
    background-color: #0083C7;
    border-radius: 6px;
    color: $white;
    &-title {
      margin: 20px 0 0 20px;
      font-size: 25px;
      font-weight: 500;
    }
    &-subtitle {
      margin: 10px 0 0 20px;
      font-size: 16px;
      font-weight: 400;
    }
  }
  &__badge {
    background: rgba(0, 131, 199, 0.1);
    border-radius: 44px;
    height:34px;
    margin: 10px;
    padding: 5px;
    color: $blue;
    &-skills {
      padding: 15px;
    }
  }
  &__skills {
    height: 64px;
  }
}
</style>
