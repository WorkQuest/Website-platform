<template>
  <div class="contacts">
    <span
      class="contact"
    >
      <span
        v-if="userInfo.location"
        class="contact__container"
      >
        <span
          class="icon-location"
        />
        <span class="contact__link">{{ location }}</span>
      </span>
      <span
        v-if="userInfo.tel"
        class="contact__container"
      >
        <span
          class="icon-phone"
        />
        <span class="contact__link">{{ phone }}</span>
      </span>
      <span
        v-if="userData.email"
        class="contact__container"
      >
        <span
          class="icon-mail"
        />
        <span class="contact__link">{{ email }}</span>
      </span>
      <span
        v-if="userRole === 'employer' && userInfo.company"
        class="contact__container"
      >
        <span class="icon-Earth" />
        <span class="contact__link">{{ company }}</span>
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
      location: 'data/getLocation',
      phone: 'data/getPhone',
      email: 'data/getEmail',
      company: 'data/getCompany',
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
