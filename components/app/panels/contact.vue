<template>
  <div class="contacts">
    <span
      class="contact"
    >
      <span
        v-if="contacts.address"
        class="contact__container"
      >
        <span
          class="icon-location"
        />
        <a
          :href="'https://maps.google.com/?q=' + contacts.address"
          target="_blank"
        ><span class="contact__link">{{ contacts.address }}</span></a>
      </span>
      <span
        v-if="contacts.phone"
        class="contact__container"
      >
        <span
          class="icon-phone"
        />
        <a
          :href="'tel:' + contacts.phone"
          target="_blank"
        ><span class="contact__link">{{ contacts.phone }}</span></a>
      </span>
      <span
        v-if="contacts.email"
        class="contact__container"
      >
        <span
          class="icon-mail"
        />
        <a
          :href="'mailto:' + contacts.email"
          target="_blank"
        ><span class="contact__link">{{ contacts.email }}</span></a>
      </span>
      <span
        v-if="contacts.role === 'employer' && contacts.company"
        class="contact__container"
      >
        <span class="icon-Earth" />
        <a
          :href="'https://' + contacts.company"
          target="_blank"
        ><span class="contact__link">{{ contacts.company }}</span></a>
      </span>
    </span>
  </div>
</template>

<script>

export default {
  name: 'ContactPanel',
  props: {
    contacts: {
      type: Object,
      default: () => {},
    },
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
