<template>
  <div
    class="information-grid"
  >
    <div class="col info-grid__col_left">
      <div class="info-grid__avatar">
        <img
          class="info-grid__avatar"
          src="~/assets/img/temp/avatar.jpg"
          alt=""
        >
      </div>
      <div class="rating" />
      <nuxt-link
        class="reviews-amount"
        to="/profile"
      >
        23 {{ $t('quests.reviews') }}
      </nuxt-link>
    </div>
    <div class="col info-grid__col">
      <div class="title">
        {{ payload.user.name }}
      </div>
      <div
        v-if="userRole === 'employer'"
        class="subtitle"
      >
        {{ payload.user.company }}
      </div>
      <div class="description">
        {{ payload.user.desc }}
      </div>
      <!-- socials links -->
      <div class="socials">
        <SocialPanel />
      </div>
      <!-- contacts -->
      <div class="contacts__grid">
        <div class="contacts">
          <ContactPanel />
        </div>
        <span v-if="userRole === 'employer'">
          <div
            v-if="selected === 1"
            class="message__container-btn"
          >
            <base-btn
              mode="goToMessages"
              class="message__btn"
              @click="showMessages()"
            >
              <template v-slot:right>
                <span class="icon-chat" />
              </template>
              {{ $t('profile.writeAMessage') }}
            </base-btn>
          </div>
        </span>
      </div>
    </div>

    <div class="share-btn" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ContactPanel from '~/components/app/Panels/Contact';
import SocialPanel from '~/components/app/Panels/Social';

export default {
  name: 'UserInfo',
  components: { ContactPanel, SocialPanel },
  data() {
    return {
      payload: {
        user: {
          name: 'Samantha Sparcs',
          desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luctus venenatis, lectus magna fringilla urna, porttitor rhoncus dolor purus non enim praesent elementum facilisis leo, vel',
          location: 'Moscow, Lenina street, 3',
          tel: '+7 989 989 98 98',
          email: 'worker@gmail.com',
          company: 'CEO from Amazon',
        },
        quests: {
          activeQuests: '12',
          completedQuestsOneTime: '12',
          completedQuestsFullTime: '2',
          averageRating: '4.5',
          reviewCount: '23',
        },
      },
    };
  },
  computed: {
    ...mapGetters({
      tags: 'ui/getTags',
      userRole: 'user/getUserRole',
      userData: 'user/getUserData',
    }),
  },
  methods: {
    showMessages() {
      this.$router.push('/messages/1');
    },
  },
};
</script>

<style lang="scss" scoped>

.title {
  @include text-simple;
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  color: $black800;
  margin-bottom: 20px;
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
  padding: 25px 0;
  position: relative;

  .share-btn {
    height: 24px;
    width: 24px;
    background-image: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E\a         %3Cpath d='M17.5 22C16.4179 22.0125 15.3923 21.5181 14.7282 20.6637C14.0641 19.8094 13.8379 18.6935 14.117 17.648L7.85697 14.07C6.77525 15.0611 5.18965 15.2708 3.88746 14.5951C2.58526 13.9194 1.84384 12.5023 2.03134 11.0472C2.21883 9.5922 3.2953 8.40926 4.72625 8.08577C6.15719 7.76227 7.63783 8.36714 8.43297 9.60002L14.116 6.35102C14.0424 6.07321 14.0035 5.78738 14 5.50002C13.9856 3.82674 15.1478 2.37316 16.7832 2.01884C18.4186 1.66452 20.0781 2.50676 20.7576 4.03594C21.4371 5.56511 20.95 7.36125 19.5909 8.33753C18.2319 9.31381 16.3742 9.20211 15.142 8.07002L8.99097 11.585C8.98488 11.8443 8.94863 12.1021 8.88297 12.353L15.142 15.93C16.2942 14.8726 18.0087 14.7093 19.3399 15.5303C20.671 16.3514 21.2946 17.9568 20.8668 19.461C20.439 20.9653 19.0639 22.0023 17.5 22ZM17.5 17C16.6715 17 16 17.6716 16 18.5C16 19.3284 16.6715 20 17.5 20C18.3284 20 19 19.3284 19 18.5C19 17.6716 18.3284 17 17.5 17ZM5.49997 10C4.67154 10 3.99997 10.6716 3.99997 11.5C3.99997 12.3284 4.67154 13 5.49997 13C6.3284 13 6.99997 12.3284 6.99997 11.5C6.99997 10.6716 6.3284 10 5.49997 10ZM17.5 4.00002C16.6715 4.00002 16 4.67159 16 5.50002C16 6.32845 16.6715 7.00002 17.5 7.00002C18.3284 7.00002 19 6.32845 19 5.50002C19 4.67159 18.3284 4.00002 17.5 4.00002Z' fill='%237C838D'/%3E\a         %3C/svg%3E                                                                   \a         ");
    background-repeat: no-repeat;
    background-position: center;
    position: absolute;
    right: 0;
    top: 28px;

    &:hover {
      cursor: pointer;
    }
  }

  .col {
    @extend .styles__flex;
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
    background-image: url("data:image/svg+xml,%3Csvg width='120' height='20' viewBox='0 0 120 20' fill='none' xmlns='http://www.w3.org/2000/svg'%3E\a           %3Cpath d='M10 0L12.9389 5.95492L19.5106 6.90983L14.7553 11.5451L15.8779 18.0902L10 15L4.12215 18.0902L5.24472 11.5451L0.489435 6.90983L7.06107 5.95492L10 0Z' fill='%23E8D20D'/%3E\a           %3Cpath d='M35 0L37.9389 5.95492L44.5106 6.90983L39.7553 11.5451L40.8779 18.0902L35 15L29.1221 18.0902L30.2447 11.5451L25.4894 6.90983L32.0611 5.95492L35 0Z' fill='%23E8D20D'/%3E\a           %3Cpath d='M60 0L62.9389 5.95492L69.5106 6.90983L64.7553 11.5451L65.8779 18.0902L60 15L54.1221 18.0902L55.2447 11.5451L50.4894 6.90983L57.0611 5.95492L60 0Z' fill='%23E8D20D'/%3E\a           %3Cpath d='M85 0L87.9389 5.95492L94.5106 6.90983L89.7553 11.5451L90.8779 18.0902L85 15L79.1221 18.0902L80.2447 11.5451L75.4894 6.90983L82.0611 5.95492L85 0Z' fill='%23E8D20D'/%3E\a           %3Cpath d='M110 0L112.939 5.95492L119.511 6.90983L114.755 11.5451L115.878 18.0902L110 15L104.122 18.0902L105.245 11.5451L100.489 6.90983L107.061 5.95492L110 0Z' fill='%23E9EDF2'/%3E\a           %3C/svg%3E                                                              \a           ");
    background-repeat: no-repeat;
    background-position: center;
    margin-top: 20px;
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
    margin: 15px 0;
  }

  .socials {
    margin-bottom: 15px;
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
    max-width: 142px;
    max-height: 142px;
    width: 100%;
    height: 100%;
  }
  &__col {
    &_left {
      max-width: 157px;
      width: 100%;
      padding: 0 15px 0 0;
    }
  }
}

@include _575 {
  .information-grid {
    flex-direction: column;
    align-items: center;
    .col {
      margin-bottom: 10px;
    }
  }
}

</style>
