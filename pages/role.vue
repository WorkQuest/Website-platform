<template>
  <div class="role">
    <div class="role__container">
      <div class="role_return return">
        <div class="return__container">
          <div
            class="back"
            @click="backToMain()"
          />
        </div>
      </div>
      <div class="role__content">
        <div class="role__top">
          <div class="role__banner">
            <img
              src="~assets/img/app/WORK_QUEST_logo_horizontal.png"
              alt=""
            >
          </div>
          <div class="role__title">
            <span>{{ $t('role.title') }}</span>
          </div>
        </div>
        <div class="role__widget">
          <div class="role__left">
            <div class="role__title role__title_widget">
              {{ $t('role.employer') }}
            </div>
            <div class="role__action">
              <base-btn :mode="'green'">
                {{ $t('role.enter') }}
              </base-btn>
            </div>
          </div>
          <div class="role__right">
            <div class="role__title role__title_widget">
              {{ $t('role.worker') }}
            </div>
            <div class="role__action">
              <base-btn>
                {{ $t('role.enter') }}
              </base-btn>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Role',
  methods: {
    backToMain() {
      this.$router.push('/');
    },
  },
};
</script>

<style lang="scss" scoped>
.role {
  &__container {
    min-height: 100vh;
    background: #20253b;
    display: grid;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  &__content {
    max-width: 1000px;
    margin: 0 auto;
  }
  &__top {
    display: grid;
    align-items: flex-end;
    grid-template-columns: repeat(2, 1fr);
  }
  &__title {
    padding-left: 100px;
    color: #ffffff;
    font-family: 'GothamProBlack', sans-serif;
    font-size: 38px;
    font-weight: 400;
    font-style: normal;
    line-height: 37.5px;
    text-align: left;
    text-transform: uppercase;
    letter-spacing: normal;
    white-space: pre-line;
    &_widget {
      line-height: 47.92px;
      padding: 0;
    }
  }
  &__widget {
    margin-top: 50px;
    display: grid;
    grid-template-columns: repeat(2, 450px);
    min-height: 300px;
    justify-content: center;
  }
  &__left {
    background: rgba(#107c43, .73) url('~assets/img/app/widget_left.png') center center no-repeat;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    grid-gap: 32px;
    background-size: 100%;
    transition: .5s ease-in-out;
    &:hover {
      cursor: pointer;
      background-size: 140%;
    }
  }
  &__right {
    background: rgba(#283f79, .63) url('~assets/img/app/widget_right.png') center center no-repeat;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    grid-gap: 32px;
    background-size: 100%;
    transition: .5s ease-in-out;
    &:hover {
      cursor: pointer;
      background-size: 140%;
    }
  }
  &__action {
    width: 275px;
  }
}

.return {
  position: absolute;
  top: 0;
  right: 0;
  width: 150px;
  height: 150px;
  background: #d0d0d0;
  background: linear-gradient(to top, #b3b1b1 50%, #d0d0d0 50%);
  background-size: 100% 200%;
  background-position: top;
  transition: .5s ease-out;
  &:hover {
    background-position: bottom;
  }
  &__container {
    position: relative;
    display: flex;
    align-items: flex-end;
    width: 100%;
    height: 100%;
    padding: 30px;
  }
}

.back {
  position: absolute;
  width: 32px;
  height: 32px;
  cursor: pointer;
  &:before {
    position: absolute;
    left: 15px;
    content: ' ';
    height: 33px;
    width: 2px;
    background-color: #FFFFFF;
    transform: rotate(45deg);
  }
  &:after {
    position: absolute;
    left: 15px;
    content: ' ';
    height: 33px;
    width: 2px;
    background-color: #FFFFFF;
    transform: rotate(-45deg);
  }
}
</style>
