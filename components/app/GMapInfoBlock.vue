<template>
  <g-map-info-window
    :options="{maxWidth: 280}"
    :position="windowPosition"
    :opened="isOpened"
    :closeclick="true"
    @closeclick="$emit('onCloseClick', $event)"
  >
    <div v-if="isCluster">
      {{ 1 }}
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
          <div class="info-window__name">
            {{ content.userName }}
          </div>
        </div>
        <item-rating
          v-if="content.status"
          :rating="content.status"
        />
        <div
          v-else
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
import { mapGetters } from 'vuex';
import { UserRole, TokenSymbols, Path } from '~/utils/enums';

export default {
  name: 'GMapInfoBlock',
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
      default: () => {},
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
    }),
    content() {
      // if (!Object.keys(this.item).length) return {};
      if (this.userRole === UserRole.WORKER) {
        return {
          avatar: this.item.user.avatar ? this.item.user.avatar.url : this.EmptyAvatar(),
          alt: this.UserName(this.item.user.firstName, this.item.user.lastName),
          userName: this.UserName(this.item.user.firstName, this.item.user.lastName),
          label: this.getPriority(this.item.priority),
          labelClass: this.getPriorityClass(this.item.priority),
          title: this.item.title,
          priceTitle: this.$t('quests.price'),
          price: `${this.item.price} ${TokenSymbols.WUSD}`,
        };
      }
      return {
        avatar: this.item.avatar ? this.item.avatar.url : this.EmptyAvatar(),
        alt: this.UserName(this.item.firstName, this.item.lastName),
        userName: this.UserName(this.item.firstName, this.item.lastName),
        status: this.item.ratingStatistic.status || 'noStatus',
        title: this.item.email,
        priceTitle: this.$t('settings.costPerHour'),
        price: `${this.item.wagePerHour} ${TokenSymbols.WUSD}`,
      };
    },
  },
  methods: {
    showDetails(id) {
      const path = this.userRole === UserRole.WORKER ? Path.QUESTS : Path.PROFILE;
      this.$router.push(`${path}/${id}`);
    },
    getPriority(index) {
      const priority = {
        0: '',
        1: this.$t('priority.low'),
        2: this.$t('priority.normal'),
        3: this.$t('priority.urgent'),
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
  &__block {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  &__content {
    max-width: 280px;
    min-width: 200px;
    display: flex;
    grid-gap: 10px;
    flex-direction: column;
  }
  &__name {
    max-width: 115px;
    font-weight: 600;
    font-size: 14px;
    line-height: 130%;
    color: #1D2127;
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

</style>
