<template>
  <div class="contacts">
    <span
      class="contact"
    >
      <span
        v-if="userData.additionalInfo.address"
        class="contact__container"
      >
        <span
          class="icon-location"
        />
        <span v-if="this.$route.path === '/profile'">
          <span class="contact__link">{{ userData.additionalInfo.address }}</span>
        </span>
        <span v-else>
          <span class="contact__link">{{ userInfo.location }}</span>
        </span>
      </span>
      <span
        v-if="userData.additionalInfo.firstMobileNumber"
        class="contact__container"
      >
        <span
          class="icon-phone"
        />
        <span v-if="this.$route.path === '/profile'">
          <span class="contact__link">{{ userData.additionalInfo.firstMobileNumber }}</span>
        </span>
        <span v-else>
          <span class="contact__link">{{ userInfo.tel }}</span>
        </span>
      </span>
      <span
        v-if="userData.email"
        class="contact__container"
      >
        <span
          class="icon-mail"
        />
        <span v-if="this.$route.path === '/profile'">
          <span class="contact__link">{{ userData.email }}</span>
        </span>
        <span v-else>
          <span class="contact__link">{{ userInfo.email }}</span>
        </span>
      </span>
      <span
        v-if="userRole === 'employer' && userData.additionalInfo.company"
        class="contact__container"
      >
        <span class="icon-Earth" />
        <span v-if="this.$route.path === '/profile'">
          <span class="contact__link">{{ userData.additionalInfo.company }}</span>
        </span>
        <span v-else>
          <span class="contact__link">{{ userInfo.company }}</span>
        </span>
      </span>
    </span>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'ContactPanel',
  computed: {
    ...mapGetters({
      tags: 'ui/getTags',
      userRole: 'user/getUserRole',
      userData: 'user/getUserData',
      userInfo: 'data/getUserInfo',
      quest: 'data/getQuest',
    }),
  },
};
</script>

<style lang="scss" scoped>

.icon {
  color: #7C838D;
  font-size: 16px;
  cursor: pointer;
  padding-right: 5px;
  &-phone:before {
    @extend .icon;
    content: "\ea2d";
  }
  &-location:before {
    @extend .icon;
    content: "\ea23";
  }
  &-mail:before {
    @extend .icon;
    content: "\ea27";
  }
  &-Earth:before {
    @extend .icon;
    content: "\ea11";
  }
}

.contacts {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.contact {
  display: flex;
  &__container {
    display: flex;
    align-items: center;
  }
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

@include _1199 {
  .contact {
    display: flex;
    flex-direction: column;
  }
}

</style>
