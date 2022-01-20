<template>
  <div
    class="card"
    @click="$emit('click')"
  >
    <div class="card__header">
      <div class="card__header_left">
        <img
          class="card__img"
          :src="user.avatar !== null ? user.avatar.url: require('~/assets/img/app/avatar_empty.png')"
          :alt="user.firstName"
        >
      </div>
      <div class="card__header_right">
        <span class="card__name">
          {{ user.firstName ? user.firstName : $t('quests.namelessWorker') }}
          {{ user.lastName ? user.lastName : "" }}
        </span>
      </div>
    </div>
    <div class="card__spec_title">
      {{ $t('workers.specializations') }}
    </div>
    <div
      v-if="user.userSpecializations.length !== 0"
      class="badge__container"
    >
      <div class="badge-list">
        <div class="badge__item">
          {{ getSkillTitle(user.userSpecializations[0].path) }}
        </div>
        <span
          v-if="user.userSpecializations.length - 1 > 0"
          class="badge__item_counter"
        >
          (+{{ user.userSpecializations.length - 1 }})
        </span>
      </div>
    </div>
    <span
      v-if="user.userSpecializations.length === 0"
      class="card__spec"
    >
      {{ $t('quests.dontHaveSpec') }}
    </span>
    <div
      v-if="user.additionalInfo"
      class="card__title"
    >
      {{ $t('workers.aboutMe') }}
    </div>
    <div
      v-if="user.additionalInfo"
      class="card__about"
    >
      {{ user.additionalInfo.description ? user.additionalInfo.description : $t('quests.nothingAboutMe') }}
    </div>
    <div
      v-if="user.additionalInfo"
      class="card__address"
    >
      {{ user.additionalInfo.address ? user.additionalInfo.address : $t('quests.unknownAddress') }}
    </div>
    <div class="card__cost cost">
      <div class="cost__title">
        {{ $t('workers.costTitle') }}
      </div>
      <div class="cost__value">
        {{ user.wagePerHour !== null ? user.wagePerHour : $t('worker.cost.notIndicated') }}
        {{ user.wagePerHour !== null ? $t('quests.wusd') : '' }}
      </div>
    </div>
  </div>
</template>
<script>

export default {
  name: 'EmployeeCard',
  props: {
    id: {
      type: Number,
      default: null,
    },
    user: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      data: 1,
    };
  },
  methods: {
    getSkillTitle(path) {
      const [spec, skill] = path.split('.');
      return this.$t(`filters.items.${spec}.sub.${skill}`);
    },
  },
};
</script>

<style lang="scss" scoped>
.card {
  width: 100%;
  height: 360px;

  padding: 20px;

  border-radius: 6px;

  box-shadow: none;
  transition: box-shadow .25s ease-in-out;

  cursor: pointer;
  &:hover {
    box-shadow: -1px 1px 8px 0px rgba(34, 60, 80, 0.2);
  }

  &__header {
    display: grid;
    grid-template-columns: 61px 1fr;
    grid-gap: 15px;
    align-items: center;

    &_right {
      display: grid;
      grid-template-rows: 20px 1fr;
      grid-gap: 7px;
    }
  }

  &__spec {
    font-weight: 400;
    font-size: 14px;
    color: $blue;
    &_title {
      margin: 15px 0 0 0;
      font-size: 14px;
      font-weight: 400;
    }
  }

  &__img {
    width: 61px;
    height: 61px;
    border-radius: 100%;
    object-fit: cover;
  }

  &__name {
    @include text-simple;
    font-size: 18px;
    font-weight: 500;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  &__title {
    margin: 15px 0 0 0;
    font-weight: 400;
    font-size: 14px;
  }

  &__about {
    margin: 0 0 15px 0;
    font-weight: 400;
    font-size: 14px;
    color: $black300;
    max-height: 65px;

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: initial;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }

  &__address {
    margin: 0 0 15px 0;
    font-weight: 500;
    font-size: 12px;
    color: $black500;
  }
}
.badge {

  &-list {
    white-space: nowrap;
    width: 100%;
    overflow: hidden;
    display: flex;
  }

  &__container {
    padding: 0;
    width: 100%;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    color: $blue;
  }

  &__item {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 85%;
    &_counter {
      margin-left: 2px;
    }
  }
}
.cost {
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 500;

  &__title {
    font-size: 14px;
    line-height: 18px;
    margin-bottom: 5px;
  }

  &__value {
    font-size: 18px;
    line-height: 23px;
    color: $green;
  }
}
@include _1199 {
  .card {
    padding: 10px;
  }
}
@include _575 {

}
</style>
