<template>
  <div class="template">
    <div class="template__container">
      <div class="template__left">
        <div class="template__logo">
          <img
            src="~assets/img/app/logo.svg"
            alt="WorkQuest"
          >
          <span>WorkQuest</span>
        </div>
        <div class="template__content">
          <nuxt />
        </div>
      </div>
      <div class="template__right">
        <div class="template__slogan">
          <span>Making
            money is fast.
            When your
            work is quest.</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AuthLayout',
};
</script>

<style lang="scss" scoped>
.template {
  &__container {
    min-height: 100vh;
    width: 100%;
    background: #FFFFFF;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }
  &__left {
    display: grid;
    grid-template-rows: 40px 1fr;
    max-width: 470px;
    width: 100%;
    justify-self: flex-end;
    margin-right: 130px;
    padding-top: 21px;
  }
  &__logo {
    display: grid;
    align-items: center;
    grid-template-columns: 40px 1fr;
    grid-gap: 5px;
    span {
      font-family: 'Inter', sans-serif;
      font-style: normal;
      font-weight: bold;
      font-size: 23px;
      line-height: 130%;
      color: $black700;
    }
  }
  &__content {
    display: grid;
    align-items: center;
  }
  &__right {
    background-color: rgba(#391290, 1);
    background-image:  url("~assets/img/app/auth_bg.svg"), url("~assets/img/app/logo_long.svg");
    background-position: center center, right calc(50% + 70px);
    background-repeat: no-repeat no-repeat;
    background-size: cover, 90%;
    grid-template-rows: 200px auto;
  }
  &__slogan {
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: bold;
    font-size: 55px;
    line-height: 130%;
    color: #FFFFFF;
    padding: 100px 0 0 100px;
    white-space: pre-line;
  }
}

@include _1300 {
  .template {
    &__slogan {
      padding: 50px 0 0 50px;
    }
  }
}
</style>
