<template>
  <div
    class="card"
    :data-selector="`COMPONENT-EMPLOYEE-CARD-${user.id}`"
    :class="raiseViewStatus"
    @click="$emit('click')"
  >
    <div class="card__header">
      <div class="card__avatar">
        <img
          class="card__img"
          :src="user.avatar ? user.avatar.url: $options.images.EMPTY_AVATAR"
          :alt="userName"
        >
      </div>
      <div class="card__user">
        <span class="user__name">{{ userName }}</span>
        <item-rating
          v-if="user.ratingStatistic && user.ratingStatistic.status >= 0"
          class="user__rating"
          :rating="user.ratingStatistic.status"
          :raise-view="user.raiseView"
        />
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
          {{ skills }}
        </div>
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
        {{ $t('meta.costPerHour') }}
      </div>
      <div class="cost__value">
        {{ user.costPerHour ? `${user.costPerHour} ${$t('meta.coins.wusd')}` : $t('meta.worker.cost.notIndicated') }}
      </div>
    </div>
  </div>
</template>
<script>
import { RaiseViewStatus } from '~/utils/enums';
import { images } from '~/utils/images';

export default {
  name: 'EmployeeCard',
  RaiseViewStatus,
  images,
  props: {
    user: {
      type: Object,
      default: () => {
      },
    },
  },
  computed: {
    userName() {
      const { firstName, lastName } = this.user;
      if ((firstName && !lastName) || (!firstName && lastName)) return `${firstName || lastName}`;
      return firstName && lastName ? `${firstName} ${lastName}` : this.$t('quests.namelessWorker');
    },
    skills() {
      let string = '';
      this.user.userSpecializations.forEach((item, i) => {
        const [spec, skill] = item.path.split('.');
        const name = this.$t(`filters.skills.${spec}.sub.${skill}`);
        string += `${i ? ', ' : ''}${name}`;
      });
      return string;
    },
    raiseViews() {
      return {
        0: 'card_plus',
        1: 'card_gold',
        2: 'card_silver',
        3: 'card_bronze',
      };
    },
    raiseViewStatus() {
      return this.raiseViews[this.user.raiseView && RaiseViewStatus[this.user.raiseView.status] && this.user.raiseView.type];
    },
  },
  methods: {
    ratingStatistic(ratingStatistic) {
      return ratingStatistic?.status || 'noStatus';
    },
  },
};
</script>

<style lang="scss" scoped>

.card {
  @include text-simple;

  width: 100%;
  height: 360px;
  border: none;

  padding: 20px;

  border-radius: 6px;

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
  }

  &__img {
    width: 61px;
    height: 61px;
    border-radius: 100%;
    object-fit: cover;
  }

  &__user {
    display: grid;
    grid-template-rows: auto auto;
    grid-gap: 7px;
  }

  &__title {
    margin-top: 15px;
    font-size: 14px;
  }

  &__about {
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

  &_plus {
    border: 1px solid $yellow100;

    &:hover {
      box-shadow: -1px 1px 8px 0px rgba(246, 207, 0, 0.2);
    }
  }

  &_gold {
    border: 1px solid $yellow100;

    &:hover {
      box-shadow: -1px 1px 8px 0px rgba(246, 207, 0, 0.2);
    }
  }

  &_silver {
    border: 1px solid $grey200;

    &:hover {
      box-shadow: -1px 1px 8px 0px rgba(187, 192, 199, 0.2);
    }
  }

  &_bronze {
    border: 1px solid $brown;

    &:hover {
      box-shadow: -1px 1px 8px 0px rgba(183, 151, 104, 0.2);
    }
  }
}

.user {
  &__name {
    font-size: 18px;
    font-weight: 500;

    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
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
