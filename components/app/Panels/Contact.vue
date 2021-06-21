<template>
  <div class="contacts">
    <span
      class="contact"
    >
      <span class="contact__container">
        <span
          v-if="contacts.address"
          class="icon-location"
        /><span class="contact__link">{{ contacts.address }}</span>
      </span>
      <span class="contact__container">
        <span
          v-if="contacts.phone"
          class="icon-phone"
        /><span class="contact__link">{{ contacts.phone }}</span>
      </span>
      <span class="contact__container">
        <span
          v-if="contacts.email"
          class="icon-mail"
        /><span class="contact__link">{{ contacts.email }}</span>
      </span>
      <span
        v-if="userRole === 'employer'"
        class="contact__container"
      >
        <span class="icon-Earth" /><span class="contact__link">{{ contacts.company }}</span>
      </span>
    </span>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'ContactPanel',
  data() {
    return {
      contacts: {
        address: 'Moscow, Lenina street, 3',
        phone: '+7 989 989 98 98',
        email: 'worker@gmail.com',
        company: 'amazon.com',
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
