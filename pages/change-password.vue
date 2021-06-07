<template>
  <div>
    <div class="pc" />
    <div class="mobile">
      <div class="mobile-header">
        <div @click="back()">
          <span class="icon-chevron_big_left" />
        </div>
        <div class="mobile-header__title">
          <div>{{ $t('mobile.changePass') }}</div>
        </div>
      </div>
      <div class="input__container">
        <div>
          <label for="old_pass">{{ $t('mobile.oldPass') }}</label>
          <base-field
            id="old_pass"
            v-model="old_pass"
          />
        </div>
        <div>
          <label for="new_pass">{{ $t('mobile.newPass') }}</label>
          <base-field
            id="new_pass"
            v-model="new_pass"
          />
        </div>
        <div>
          <label for="conf_pass">{{ $t('mobile.confPass') }}</label>
          <base-field
            id="conf_pass"
            v-model="conf_pass"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChangePassword',
  data() {
    return {
      old_pass: '',
      new_pass: '',
      conf_pass: '',
    };
  },
  async mounted() {
    this.SetLoader(true);
    this.SetLoader(false);
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
  },
};
</script>

<style lang="scss" scoped>

.input {
  &__container {
    margin: 20px;
    z-index: 1;
  }
}

.icon {
  &-chevron_big_left:before {
    font-size: 25px;
    content: "\ea4d";
    color: $blue;
  }
}

.mobile-header {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  margin: 20px 20px 0 20px;
  background: $white;
  &__title {
    font-weight: 500;
    font-size: 17px;
    color: $black800;
    width: 100%;
    text-align: center;
  }
}

@include _2560 {
  .mobile {
    display: none;
  }

}

@include _1700 {
  .mobile {
    display: none;
  }

}
@include _1600 {
  .mobile {
    display: none;
  }

}
@include _1400 {
  .mobile {
    display: none;
  }

}
@include _1300 {
  .mobile {
    display: none;
  }

}
@include _1199 {

  .mobile {
    display: none;
  }
}
@include _991 {
  .pc {
    display: none;
  }
  .mobile {
    overflow-y: auto;
    display: grid;
    height: 100%;
    width: 100%;
    max-height: 775px;
    background: $white;
  }
}

@include _575 {}
</style>
