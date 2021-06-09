<template>
  <div>
    <div class="pc" />
    <div class="mobile">
      <div>
        <div class="mobile-header">
          <div @click="back()">
            <span class="icon-chevron_big_left" />
          </div>
        </div>
        <div v-if="phoneEnter === false">
          <div class="mobile-header__title">
            <div>{{ $t('mobile.smsVerification') }}</div>
          </div>
          <div class="input__container">
            <div>
              <label for="phone">{{ $t('mobile.phone') }}</label>
              <base-field
                id="phone"
                v-model="phone"
                placeholder="+7 *** *** ** **"
              />
            </div>
          </div>
        </div>
        <div v-else>
          <div class="mobile-header__title">
            <div>{{ $t('mobile.smsVerification') }}</div>
          </div>
          <div class="input__container">
            <div>
              <label for="phone">{{ $t('mobile.code') }}</label>
              <base-field
                id="code"
                v-model="code"
                placeholder="HRT23ID"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="btn__container" v-if="phoneEnter === false">
        <base-btn @click="toSmsCode()">
          {{ $t('mobile.submit') }}
        </base-btn>
      </div>
      <div class="btn__container" v-if="phoneEnter === true">
        <base-btn @click="toSettings()">
          {{ $t('mobile.submit') }}
        </base-btn>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SmsVerification',
  data() {
    return {
      phone: '',
      code: '',
      phoneEnter: false,
      codeEnter: false,
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
    toSmsCode() {
      this.phoneEnter = this.phone.length === 11;
    },
    toSettings() {
      if (this.code.length === 7) {
        this.$router.push('/settings');
      }
    },
  },
};
</script>

<style lang="scss" scoped>

.btn {
  &__container {
    margin: 0 20px 0 20px;
    background-color: $white;
  }
}

.input {
  &__container {
    margin: 20px 20px 390px 20px;
    z-index: 1;
    background-color: $white;
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
    z-index: 1;
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

@include _380 {}
</style>
