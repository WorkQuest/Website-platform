<template>
  <div>
    <span
      v-for="(mode, i) in mods"
      :key="i"
    >
      <div
        v-if="mode.invited"
        class="info info_yellow"
      >
        <div class="info__body">
          <div class="info__left">
            <div
              class="info__text info__text_white"
            >
              {{ $t('invite.invite_text') }}
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="mode.active === true"
        class="info info_green"
      >
        <div class="info__body">
          <div class="info__left">
            <div
              class="info__text info__text_white"
            >
              {{ $t('quests.activeQuest') }}
            </div>
          </div>
          <div class="info__right">
            <div
              class="info__text info__text_white"
            >
              <span class="info__text_normal">
                {{ $t('quests.runtime') }}
              </span>
              <span class="info__text_bold">
                {{ payload.runtime }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="mode.response === true"
        class="info info_grey"
      >
        <div class="info__body">
          <div class="info__menu">
            <div
              class="info__text info__text_black"
            >
              <div class="info__left">
                {{ $t('response.response_text') }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="mode.performed === true"
        class="info info_blue"
      >
        <div class="info__body">
          <span
            class="info__text info__text_white"
          >
            <div class="info__left">
              {{ $t('performed.performed_text') }}
            </div>
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
.info {
  &_green {
    background-color:$green;
  }
  &_yellow {
    background-color:$yellow;
  }
  &_grey {
    background-color:$grey;
  }
  &_blue {
    background-color:$blue;
  }
  min-height: 54px;
  box-shadow: 0 1px 0 #e6e9ec;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  &__body {
    max-width: 1180px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  &__left {
    display: grid;
    align-items: center;
    grid-template-columns: auto 1fr;
    grid-gap: 35px;
  }
  &__right {
    display: grid;
    grid-template-columns: repeat(1, auto);
    grid-gap: 10px;
    align-items: center;
  }
  &__text{
    @include text-simple;
    font-size: 16px;
    font-weight: 400;
    z-index: 11;
    justify-content: space-between;
    &_white{
      color: $white;
    }
    &_black{
      color: $black600;
    }
    &_bold {
      font-weight: 500;
    }
    &_normal {
      font-weight: 300;
    }
  }
}
</style>
