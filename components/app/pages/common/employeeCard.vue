<template>
  <div
    class="card"
    @click="$emit('click')"
  >
    <div class="card__header">
      <div class="card__header_left">
        <img
          class="card__img"
          :src="user.avatar ? user.avatar.url: EmptyAvatar()"
          :alt="userName"
        >
      </div>
      <div class="card__header_right">
        <span class="card__name">{{ userName }}</span>
      </div>
    </div>
    <div class="card__title">
      {{ $t('workers.specializations') }}
    </div>
    <div class="card__specializations specializations">
      <div
        v-if="user.userSpecializations.length"
        class="specializations__list"
      >
        <div class="specializations__item">
          {{ getSkills(user.userSpecializations) }}
        </div>
        <span
          v-if="user.userSpecializations.length - 1 > 0"
          class="specializations__counter"
        >
          (+{{ user.userSpecializations.length - 1 }})
        </span>
      </div>
      <span
        v-else
        class="specializations__item"
      >
        {{ $t('quests.dontHaveSpec') }}
      </span>
    </div>
    <div class="card__title">
      {{ $t('workers.aboutMe') }}
    </div>
    <div class="card__about">
      {{ user.additionalInfo.description ? user.additionalInfo.description : $t('quests.nothingAboutMe') }}
    </div>
    <div class="card__address">
      {{ user.additionalInfo.address ? user.additionalInfo.address : $t('quests.unknownAddress') }}
    </div>
    <div class="card__cost cost">
      <div class="cost__title">
        {{ $t('workers.costTitle') }}
      </div>
      <div class="cost__value">
        {{ user.wagePerHour ? user.wagePerHour : $t('worker.cost.notIndicated') }}
        {{ user.wagePerHour ? $t('quests.wusd') : '' }}
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
  computed: {
    userName() {
      const { firstName, lastName } = this.user;
      return firstName && lastName ? `${firstName} ${lastName}` : this.$t('quests.namelessWorker');
    },
  },
  methods: {
    getSkills(specializations) {
      let string = '';
      specializations.forEach((item, i) => {
        const [spec, skill] = item.path.split('.');
        const name = this.$t(`filters.items.${spec}.sub.${skill}`);
        string += `${i ? ', ' : ''}${name}`;
      });
      return string;
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
      grid-template-rows: auto auto;
      grid-gap: 7px;
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
    margin-top: 15px;
    font-size: 14px;
  }

  &__about {
    //height: 20%;

    margin-top: 5px;
    font-size: 14px;
    line-height: 18px;
    color: $black300;

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: initial;

    display: -webkit-box;
    line-clamp: 3;
    -webkit-line-clamp: 3;
    box-orient: vertical;
    -webkit-box-orient: vertical;
  }

  &__address {
    margin-top: auto;
    font-weight: 500;
    font-size: 12px;
    color: $black500;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.specializations {
  margin-top: 5px;
  font-size: 14px;
  color: $blue;

  &__list {
    display: flex;
    width: 100%;
  }

  &__item {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__counter {
    margin-left: 2px;
  }
}

.cost {
  margin-top: 15px;
  font-weight: 500;

  &__title {
    font-size: 14px;
    line-height: 18px;
  }

  &__value {
    margin-top: 5px;
    font-size: 18px;
    line-height: 23px;
    color: $green;
  }
}

</style>
