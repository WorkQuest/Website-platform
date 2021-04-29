<template>
  <div>
    <div
      class="info"
      :class="infoClass"
    >
      <div class="info__body">
        <div class="info__left">
          <div
            class="info__text info__text_white"
            :class="[{'info__text_black': info.mode === 'response'}]"
          >
            {{ infoText(info.mode) }}
          </div>
        </div>
        <div class="info__right">
          <div
            v-if="info.date"
          >
            <span class="info__text info__text_white info__text_normal">
              {{ $t('quests.runtime') }}
            </span>
            <span class="info__text info__text_white info__text_bold">
              {{ info.date }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'InfoVue',
  props: {
    info: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    infoClass() {
      const { mode } = this.info;
      return [
        {
          'info_bg-yellow': mode === 'invited',
        },
        {
          'info_bg-green': mode === 'active',
        },
        {
          'info_bg-grey': mode === 'response',
        },
        {
          'info_bg-blue': mode === 'performed',
        },
      ];
    },
  },
  methods: {
    infoText(type) {
      const texts = {
        invited: this.$t('invite.title'),
        response: this.$t('response.title'),
        active: this.$t('quests.activeQuest'),
        performed: this.$t('performed.title'),
      };
      return texts[type] || '';
    },
    infoTextStyle() {
      const { mode } = this.info;
      return [
        {
          info_yellow: mode === 'invited',
        },
      ];
    },
  },
};

</script>

<style lang="scss" scoped>
.info {
  &_bg-green {
    background-color: $green;
  }
  &_bg-yellow {
    background-color: $yellow;
  }
  &_bg-grey {
    background-color: $grey;
  }
  &_bg-blue {
    background-color: $blue;
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
