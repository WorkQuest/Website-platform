<template>
  <div class="contacts">
    <span
      class="contact"
    >
      <span
        v-if="address"
        class="contact__container"
      >
        <span
          class="icon-location"
        />
        <a
          :href="'https://maps.google.com/?q=' + address"
          target="_blank"
        ><span class="contact__link">{{ address }}</span></a>
      </span>
      <span
        v-if="firstMobileNumber"
        class="contact__container"
      >
        <span
          class="icon-phone"
        />
        <a
          :href="'tel:' + firstMobileNumber"
          target="_blank"
        ><span class="contact__link">{{ firstMobileNumber }}</span></a>
      </span>
      <span
        v-if="email"
        class="contact__container"
      >
        <span
          class="icon-mail"
        />
        <a
          :href="'mailto:' + email"
          target="_blank"
        ><span class="contact__link">{{ email }}</span></a>
      </span>
      <span
        v-if="userRole === 'employer' && company"
        class="contact__container"
      >
        <span class="icon-Earth" />
        <a
          :href="'https://' + company"
          target="_blank"
        ><span class="contact__link">{{ company }}</span></a>
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
      address: 'user/getUserAddress',
      firstMobileNumber: 'user/getUserFirstMobileNumber',
      company: 'user/getUserCompany',
      email: 'user/getUserEmail',
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
