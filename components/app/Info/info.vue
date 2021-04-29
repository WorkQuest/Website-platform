<template>
  <div>
    <span
      v-for="(mode, i) in mods"
      :key="i"
    >
      <div
        v-if="mode.invited"
        class="info__container_yellow"
      >
        <div class="info__body">
          <div
            class="info__text_white"
          >
            {{ $t('invite.invite_text') }}
          </div>
        </div>
      </div>
      <div
        v-if="mode.active === true"
        class="info__container_green"
      >
        <div class="info__body">
          <div
            class="info__text_white"
          >
            <div class="info__active">
              <div class="info__wrapper">
                {{ $t('quests.activeQuest') }}
              </div>
              <div class="info__wrapper">
                <div class="info__text_left">
                  {{ $t('quests.runtime') }}
                </div>
                <div class="info__text_right">
                  {{ payload.runtime }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="mode.response === true"
        class="info__container_grey"
      >
        <div class="info__body">
          <div class="info__menu">
            <div
              class="info__text_black"
            >
              {{ $t('response.response_text') }}
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="mode.performed === true"
        class="info__container_blue"
      >
        <div class="info__body">
          <span
            class="info__text_white"
          >
            {{ $t('performed.performed_text') }}
          </span>
        </div>
      </div>
    </span>
  </div>
</template>

<script>

export default {
  name: 'InfoVue',
  props: {
    mods: {
      type: Array,
      default() {
        return {};
      },
    },
    payload: {
      type: Object,
      default() {
        return {};
      },
    },
  },
};

</script>

<style lang="scss" scoped>
.info{
  &__container{
    &_yellow{
      background-color:$yellow;
      height: 54px;
      width: 100%;
      box-shadow: 0 0 4px rgba(0, 7, 5, 0.3);
      top: 0;
      left: 0;
      z-index: 1000;
    }
    &_green{
      background-color:$green;
      height: 54px;
      width: 100%;
      box-shadow: 0 0 4px rgba(0, 7, 5, 0.3);
      top: 0;
      left: 0;
      z-index: 1000;
    }
    &_grey{
      background-color:$grey;
      height: 54px;
      width: 100%;
      box-shadow: 0 0 4px rgba(0, 7, 5, 0.3);
      top: 0;
      left: 0;
      z-index: 1000;
    }
    &_blue{
      background-color:$blue;
      height: 54px;
      width: 100%;
      box-shadow: 0 0 4px rgba(0, 7, 5, 0.3);
      top: 0;
      left: 0;
      z-index: 1000;
    }
  }
  &__body{
    width: 1180px;
    display: block;
    margin-left: auto;
    margin-right: auto;
    line-height: 3em;
  }
  &__active {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  &__text{
    @include text-simple;
    font-size: 16px;
    font-weight: 400;
    z-index: 11;
    justify-content: space-between;
    &_white{
      @include text-simple;
      color: $white;
    }
    &_black{
      @include text-simple;
      color: $black600;
    }
    &_right{
      margin: 0 0 0 10px;
    }
    &_left{
      font-weight: 300;
    }
  }
  &__wrapper {
    display: flex;
    flex-direction: row;
  }
  &__menu {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
  &__link {
    margin: 0 0 0 10px;
    color: $blue;
  }}
</style>
