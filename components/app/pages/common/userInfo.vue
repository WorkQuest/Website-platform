<template>
  <div class="information-grid">
    <div class="col info-grid__col_left">
      <div class="info-grid__avatar">
        <img
          class="info-grid__avatar"
          :src="userAvatar"
          alt=""
          loading="lazy"
        >
      </div>
      <div class="rating">
        <div
          v-for="(star,idx) in 5"
          :key="idx"
          class="star"
          :class="initStarClass(star)"
        />
      </div>
      <div class="reviews-amount">
        {{ `${userStatistics.reviewCount} ${$t('quests.reviews')}` }}
      </div>
    </div>
    <div class="col info-grid__col">
      <div
        v-if="userInfo.firstName && userInfo.lastName"
        class="title"
      >
        {{ `${userInfo.firstName} ${userInfo.lastName}` }}
      </div>
      <div
        v-if="userInfo.role === 'employer' && userInfo.company"
        class="subtitle"
      >
        {{ userInfo.company }}
      </div>
      <div
        v-if="userAdditionalInfo.description"
        class="description"
      >
        {{ userAdditionalInfo.description }}
      </div>
      <div v-if="userInfo.role === 'worker' ">
        <div v-if="userEducations && userEducations.length > 0">
          <div class="knowledge__text">
            {{ $t('profile.educations') }}
          </div>
          <div
            v-if="userEducations"
            class="work-exp__container"
          >
            <div
              v-for="(item, i) in userEducations"
              :key="i"
              class="work-exp__item"
            >
              <span class="work-exp__company">{{ item.place }}</span>
              <span class="work-exp__term">{{ `${item.from} - ${item.to}` }}</span>
            </div>
          </div>
        </div>
        <div v-if="userWorkExperiences && userWorkExperiences.length > 0">
          <div class="work-exp__text">
            {{ $t('profile.prevWorkExp') }}
          </div>
          <div class="work-exp__container">
            <div
              v-for="(item, i) in userWorkExperiences"
              :key="i"
              class="work-exp__item"
            >
              <span class="work-exp__company">{{ item.place }}</span>
              <span class="work-exp__term">{{ `${item.from} - ${item.to}` }}</span>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="hasSocialNetworks"
        class="socials"
      >
        <socialPanel :social="userSocialNetwork" />
      </div>
      <div class="contacts__grid">
        <div class="contacts">
          <contactPanel
            :contacts="{
              email: userInfo.email,
              phone: userInfo.phone,
              address: userAdditionalInfo.address,
              company: userAdditionalInfo.company,
              role: userInfo.role,
            }"
          />
          <div class="btn__container">
            <base-btn
              v-if="userRole === 'worker'"
              @click="toRaisedViews()"
            >
              {{ $t('profile.raiseViews') }}
            </base-btn>
            <!--            <span-->
            <!--              v-if="userRole === 'employer'"-->
            <!--              class="right"-->
            <!--            >-->
            <!--              <span-->
            <!--                v-if="selected === 1"-->
            <!--                class="message__container-btn"-->
            <!--              >-->
            <!--                <base-btn-->
            <!--                  mode="goToMessages"-->
            <!--                  class="message__btn"-->
            <!--                  @click="showMessages()"-->
            <!--                >-->
            <!--                  <template v-slot:right>-->
            <!--                    <span class="icon-chat" />-->
            <!--                  </template>-->
            <!--                  {{ $t('profile.writeAMessage') }}-->
            <!--                </base-btn>-->
            <!--              </span>-->
            <!--            </span>-->
          </div>
        </div>
      </div>
    </div>
    <base-btn
      mode="share-btn"
      @click="shareModal()"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import contactPanel from '~/components/app/panels/contact';
import socialPanel from '~/components/app/panels/social';
import modals from '~/store/modals/modals';

export default {
  name: 'UserInfo',
  components: { contactPanel, socialPanel },
  props: {
    selected: {
      type: Number,
      required: true,
    },
    userInfo: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      userAvatar: '',
      userAdditionalInfo: {
        company: '',
        address: '',
        description: '',
      },
      userSocialNetwork: {},
      userWorkExperiences: {
        length: 0,
      },
      userSkills: {},
      userEducations: {
        length: 0,
      },
      userStatistics: {},
      userStars: [],
    };
  },
  computed: {
    ...mapGetters({
      tags: 'ui/getTags',
      userRole: 'user/getUserRole',
    }),
    hasSocialNetworks() {
      const { userSocialNetwork } = this;

      return userSocialNetwork.length && Object.values(userSocialNetwork).some((val) => val !== null);
    },
  },
  watch: {
    userInfo() {
      if (this.userWorkExperiences.length === 0) {
        this.initData();
      }
    },
  },
  created() {
    this.initData();
  },
  methods: {
    async initData() {
      this.userAvatar = await this.userInfo?.avatar?.url || require('~/assets/img/app/avatar_empty.png');
      if (this.userInfo.additionalInfo) {
        this.userAdditionalInfo = this.userInfo.additionalInfo;
        this.userSocialNetwork = this.userAdditionalInfo.socialNetwork;
        this.userWorkExperiences = this.userAdditionalInfo.workExperiences;
        this.userSkills = this.userAdditionalInfo.skills;
        this.userEducations = this.userAdditionalInfo.educations;
      }
      this.userStatistics = this.userInfo.ratingStatistic ? this.userInfo.ratingStatistic : { reviewCount: 0, averageMark: 0 };
    },
    initStarClass(star) {
      const reviewMark = this.userStatistics.averageMark;
      const a = this.Floor(star - reviewMark, 2);
      return [
        { star__full: star <= reviewMark },
        { star__half: (a >= 0.3 && a <= 0.7) },
      ];
    },
    shareModal() {
      this.ShowModal({
        key: modals.sharingQuest,
      });
    },
    showMessages() {
      this.$router.push('/messages/1');
    },
    toRaisedViews() {
      this.$router.push('/rised-views');
    },
  },
};
</script>

<style lang="scss" scoped>

.right {
  display: flex;
  width: 100%;
  justify-content: flex-end;
}
.btn {
  &__container {
    width: 100%;
    display: flex;
    align-items: flex-end;
    height: 43px;
  }
}

.icon {
  &-chat:before {
    content: "\e9ba";
    font-size: 14px;
    color: $green;
  }
  &-btn {
    &_right {
      margin: 0 5px 0 0;
    }
  }
}

.contacts {
  display: grid;
  grid-template-columns: 7fr 1fr;
}

.knowledge {
  &__text {
    @extend .work-exp__text;
  }
  &__term {
    @include text-simple;
    font-weight: 400;
    font-size: 14px;
    color: $black500;
  }
}

.work-exp {
  &__text {
    @include text-simple;
    font-weight: 500;
    font-size: 16px;
    color: $black700;
    margin: 15px 0 0 0;
  }
  &__container {
    display: flex;
    flex-direction: column;
    margin: 0 0 20px 0;
  }
  &__company {
    @extend .knowledge__term;
  }
  &__term {
    @extend .knowledge__term;
    color: $black300;
  }
}

.title {
  @include text-simple;
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  color: $black800;
}

.styles {
  &__flex {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
  }
}

.information-grid {
  @extend .styles__flex;
  padding: 25px 0 0 0;
  position: relative;

  .col {
    @extend .styles__flex;
    align-self: flex-start;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
  }

  .avatar {
    border-radius: 89px;
  }

  .rating {
    height: 20px;
    display: flex;
    margin-top: 20px;
    width: 142px;
  }
  .star {
    width: inherit;
    background-image: url('~assets/img/ui/star-empty.svg');
    background-repeat: no-repeat;
    background-position: center;
    &__half {
      background-image: url('~assets/img/ui/star-half.svg');
    }
    &__full {
      background-image: url('~assets/img/ui/star-small.svg');
    }
  }

  .reviews-amount {
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 130%;
    text-decoration: none;
    color: #7C838D;
    text-align: center;
    margin-top: 5px;
  }

  .description {
    margin: 15px 0 0 0;
    font-weight: 400;
    font-size: 16px;
    color: $black600;
  }

  .socials {
    margin: 15px 0;
  }

  .socials a {
    display: inline-block;
  }

  .col .socials .icon {
    height: 24px;
    width: 24px;
    background-position: center;
    background-repeat: no-repeat;
    margin-right: 5px;
  }
}

.info-grid {
  &__avatar {
    width: 142px;
    height: 142px;
    border-radius: 50%;
    object-fit: cover;
  }
  &__col {
    padding-right: 0;
    &_left {
      max-width: 142px;
      padding: 0 15px 0 0;
    }
  }
}

@include _1199 {
  .contacts {
    grid-template-columns: 4fr 1fr;
    margin: 0 0 20px 0;
  }
}
@include _575 {
  .contacts {
    grid-template-columns: 1fr;
  }
  .information-grid {
    flex-direction: column;
    align-items: center;
    .col {
      margin-bottom: 10px;
      margin-left: auto;
      margin-right: auto;
    }
  }
}

</style>
