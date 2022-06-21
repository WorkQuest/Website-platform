<template>
  <g-map-info-window
    class="info"
    :options="{maxWidth: isCluster ? 320 : 280, padding: 0}"
    :position="windowPosition"
    :opened="isOpened"
    :closeclick="true"
    @closeclick="$emit('onCloseClick', $event)"
  >
    <div
      v-if="isCluster"
      class="info-window__content"
      :class="{'info-window__content_multi' : isCluster}"
    >
      <div
        v-for="row in items"
        :key="row.id"
        class="info-window__row"
        @click="showDetails(row.id)"
      >
        <span class="row__user">
          <template v-if="$options.UserRole.WORKER === userRole">
            {{ `${$t('meta.fromBig')} ${UserName(row.user.firstName, row.user.lastName)}` }}
          </template>
          <template v-else>
            {{ UserName(row.firstName, row.lastName) }}
          </template>
        </span>
        <span class="row__price">
          <template v-if="$options.UserRole.WORKER === userRole">
            {{ getPrice(row.price, $options.TokenSymbols.WUSD) }}
          </template>
          <template v-else>
            {{
              row.wagePerHour ? `${row.wagePerHour} ${$options.TokenSymbols.WUSD}` : $t('meta.worker.cost.notIndicated')
            }}
          </template>
        </span>
      </div>
    </div>
    <div
      v-else
      class="info-window__content"
    >
      <div class="info-window__block">
        <div class="info-window__user">
          <div class="info-window__avatar avatar">
            <img
              class="avatar__image"
              :src="content.avatar"
              :alt="content.alt"
            >
          </div>
          <div
            class="info-window__name"
            :class="{'info-window__name_long': content.status === $options.Ratings.NO_STATUS && !content.label}"
          >
            {{ content.userName }}
          </div>
        </div>
        <item-rating
          v-if="$options.UserRating[content.status] !== $options.Ratings.NO_STATUS"
          :rating="content.status"
        />
        <div
          v-if="content.label"
          class="info-window__status"
          :class="content.labelClass"
        >
          {{ content.label }}
        </div>
      </div>
      <div class="info-window__block">
        {{ content.title }}
      </div>
      <div class="info-window__block">
        <div class="info-window__cost">
          <p
            v-if="item.wagePerHour || item.price"
            class="info-window__text"
          >
            {{ content.priceTitle }}
          </p>
          <p
            v-if="item.wagePerHour || item.price"
            class="info-window__value"
          >
            {{ content.price }}
          </p>
        </div>
        <base-btn
          class="info-window__switch"
          mode="grey"
          @click="showDetails(item.id)"
        >
          <template>
            <span class="info-window__icon icon-caret_right" />
          </template>
        </base-btn>
      </div>
    </div>
  </g-map-info-window>
</template>

<script>
import BigNumber from 'bignumber.js';
import { mapGetters } from 'vuex';
import {
  UserRole, TokenSymbols, Path, UserRating, Ratings,
} from '~/utils/enums';
import { images } from '~/utils/images';

export default {
  name: 'GMapInfoBlock',
  TokenSymbols,
  UserRole,
  UserRating,
  Ratings,
  props: {
    options: {
      type: Object,
      default: () => ({ maxWidth: 280 }),
    },
    windowPosition: {
      type: Object,
      required: true,
      default: () => ({ lat: 0, lng: 0 }),
    },
    isOpened: {
      type: Boolean,
      default: false,
    },
    item: {
      type: Object,
      default: () => {
      },
    },
    items: {
      type: Array,
      default: () => [],
    },
    isCluster: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters({
      userRole: 'user/getUserRole',
      tokenInfo: 'wallet/getBalanceData',
    }),
    content() {
      if (!Object.keys(this.item).length) return {};
      if (this.userRole === UserRole.WORKER) {
        return {
          avatar: this.item.user.avatar ? this.item.user.avatar.url : images.EMPTY_AVATAR,
          alt: this.UserName(this.item.user.firstName, this.item.user.lastName),
          userName: this.UserName(this.item.user.firstName, this.item.user.lastName),
          label: this.getPriority(this.item.priority),
          labelClass: this.getPriorityClass(this.item.priority),
          title: this.item.title,
          priceTitle: this.$t('meta.price'),
          price: this.getPrice(this.item.price, TokenSymbols.WUSD),
        };
      }
      return {
        avatar: this.item.avatar ? this.item.avatar.url : images.EMPTY_AVATAR,
        alt: this.UserName(this.item.firstName, this.item.lastName),
        userName: this.UserName(this.item.firstName, this.item.lastName),
        status: this.item?.ratingStatistic?.status || null,
        title: this.item.email,
        priceTitle: this.$t('meta.costPerHour'),
        price: `${this.item.wagePerHour} ${TokenSymbols.WUSD}`,
      };
    },
  },
  methods: {
    getPrice(val, symbol) {
      const decimals = this.tokenInfo[symbol]?.decimals || 18;
      const price = val ? +(new BigNumber(val).shiftedBy(-decimals).toFixed(4)) : 0;
      return `${price} ${TokenSymbols.WUSD}`;
    },
    showDetails(id) {
      const path = this.userRole === UserRole.WORKER ? Path.QUESTS : Path.PROFILE;
      this.$router.push(`${path}/${id}`);
    },
    getPriority(index) {
      const priority = {
        0: '',
        1: this.$t('meta.priority.fixedDelivery'),
        2: this.$t('meta.priority.shortTerm'),
        3: this.$t('meta.priority.urgent'),
      };
      return priority[index] || '';
    },
    getPriorityClass(index) {
      const priority = {
        0: 'info-window__status_all',
        1: 'info-window__status_low',
        2: 'info-window__status_normal',
        3: 'info-window__status_urgent',
      };
      return priority[index] || '';
    },
  },
};
</script>

<style lang="scss" scoped>

.info-window {
  &__content {
    max-width: 280px;
    min-width: 200px;
    display: flex;
    grid-gap: 10px;
    flex-direction: column;

    &_multi {
      gap: 0;
      max-height: 200px;
      padding: 0;
      overflow: hidden auto;
      overscroll-behavior: contain;
    }
  }

  &__row {
    display: grid;
    grid-template-columns: 2fr 1fr;
    grid-gap: 5px;
    padding: 13px;
    cursor: pointer;

    &:hover {
      background: $black0;
      border-radius: 6px;
    }
  }

  &__block {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__name {
    max-width: 115px;
    font-weight: 600;
    font-size: 14px;
    line-height: 130%;
    color: #1D2127;

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: initial;

    &_long {
      max-width: 160px;
    }
  }

  &__status {
    @include text-simple;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 3px;
    font-size: 12px;
    line-height: 130%;
    height: 24px;
    padding: 0 5px;

    &_low {
      background: rgba(34, 204, 20, 0.1);
      color: #22CC14;
    }

    &_urgent {
      background: rgba(223, 51, 51, 0.1);
      color: #DF3333;
    }

    &_normal {
      background: rgba(232, 210, 13, 0.1);
      color: #E8D20D;
    }
  }

  &__user {
    display: flex;
    grid-gap: 5px;
    align-items: center;
  }

  &__text {
    font-style: normal;
    font-weight: 500;
    font-size: 12px;
    line-height: 130%;
    color: #353C47;
  }

  &__cost {
    display: flex;
    grid-gap: 5px;
    flex-direction: column;
  }

  &__value {
    font-weight: 500;
    font-size: 14px;
    line-height: 130%;
    color: #00AA5B;
  }

  &__switch {
    width: 30px !important;
    height: 30px !important;
  }

  &__icon {
    color: $black400;
  }
}

.avatar {
  width: 30px;
  height: 30px;
  border-radius: 100%;
  overflow: hidden;

  &__image {
    width: 100%;
    height: 100%;
    -o-object-fit: cover;
    object-fit: cover;
  }
}

.row {
  &__user {
    @extend .info-window__name;
    max-width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__price {
    @extend .info-window__value;
    text-align: right;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

</style>
