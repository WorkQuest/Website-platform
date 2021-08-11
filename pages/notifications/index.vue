<template>
  <div class="main">
    <div class="main-white">
      <div class="main__body">
        <div class="page__container">
          <div class="page__title">
            {{ $t('ui.notifications.title') }}
          </div>
          <span
            v-for="(item, i) in notifications"
            :key="i"
            class="notifications"
          >
            <div class="notification">
              <div class="img__container">
                <img
                  class="notification__img"
                  src="../../assets/img/temp/avatar.jpg"
                  alt=""
                >
              </div>
              <div class="notification__content">
                <div class="content__title">
                  <div class="content__name">{{ item.firstName }} {{ item.lastName }}</div>
                  <div class="content__company">{{ item.company }}</div>
                </div>
                <div class="content__body">
                  <div class="notification__title">
                    {{ $t('ui.notifications.invite') }}:
                  </div>
                  <div class="quest__title">
                    {{ item.questTitle }}
                  </div>
                </div>
                <div class="content__footer">
                  <div class="notification__date">{{ item.date }}</div>
                </div>
              </div>
              <div class="btn__container">
                <base-btn
                  :mode="'outline'"
                  @click="questDetail()"
                >{{ $t('btn.view') }}</base-btn>
              </div>
            </div>
          </span>
          <div class="pagination">
            <button
              class="pagination__arrow"
            >
              <span class="icon-caret_left" />
            </button>
            <button
              v-for="(item, i) in pages"
              :key="i"
              class="pagination__btn"
              :class="[{'pagination__btn_active' :page === item}]"
              @click="page = item"
            >
              {{ item }}
            </button>
            <button
              class="pagination__arrow"
            >
              <span class="icon-caret_right" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Notifications',
  data() {
    return {
      notifications: [
        {
          firstName: 'Edward',
          lastName: 'Cooper',
          company: 'from Amazon',
          questTitle: 'Paint the garage quickly',
          date: '14 January 2021, 14:54',
        },
        {
          firstName: 'Edward',
          lastName: 'Cooper',
          company: 'from Amazon',
          questTitle: 'Paint the garage quickly',
          date: '14 January 2021, 14:54',
        },
        {
          firstName: 'Edward',
          lastName: 'Cooper',
          company: 'from Amazon',
          questTitle: 'Paint the garage quickly',
          date: '14 January 2021, 14:54',
        },
        {
          firstName: 'Edward',
          lastName: 'Cooper',
          company: 'from Amazon',
          questTitle: 'Paint the garage quickly',
          date: '14 January 2021, 14:54',
        },
        {
          firstName: 'Edward',
          lastName: 'Cooper',
          company: 'from Amazon',
          questTitle: 'Paint the garage quickly',
          date: '14 January 2021, 14:54',
        },
        {
          firstName: 'Edward',
          lastName: 'Cooper',
          company: 'from Amazon',
          questTitle: 'Paint the garage quickly',
          date: '14 January 2021, 14:54',
        },
        {
          firstName: 'Edward',
          lastName: 'Cooper',
          company: 'from Amazon',
          questTitle: 'Paint the garage quickly',
          date: '14 January 2021, 14:54',
        },
      ],
      page: 1,
      pages: [1, 2, 3, 4, 5],
    };
  },
  async mounted() {
    this.SetLoader(true);
    this.SetLoader(false);
  },
  methods: {
    questDetail() {
      this.$router.push('/quests/1');
    },
  },
};
</script>

<style lang="scss" scoped>

.main {
  @include main;
  &-white {
    @include main;
    background: $white;
    background: #FFFFFF;
    margin: 30px 0 20px 0;
    border-radius: 6px;
    justify-content: center;
  }
  &__body {
    max-width: 1180px;
    height: 100%;
  }
}

.icon {
  &-caret_left:before {
    content: "\ea49";
    color: $black400;
    font-size: 25px;
  }
  &-caret_right:before {
    font-size: 25px;
    color: $black600;
    content: "\ea4a";
  }
}

.pagination {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin: 0 20px 0 0;
  &__btn {
    width: 43px;
    height: 43px;
    border-right: 1px solid $black0;
    color: $black600;
    font-size: 16px;
    transition: .5s;
    &:first-child {
      color: $black400;
    }
    &:last-child {
      border: none;
    }
    &:hover {
      background-color: rgb(123, 201, 246);
      color: $blue;
    }
    &_active {
      background-color: #E6F3F9;
      color: #0083c7;
    }
  }
  &__arrow {
    @extend .pagination__btn;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.img {
  &__container {
    display: flex;
    margin: 15px 0 10px 0;
  }
}

.btn {
  &__container {
    display: flex;
    align-items: center;
  }
}

.quest {
  &__title {
    @include text-simple;
    font-weight: 500;
    font-size: 16px;
    color: $blue;
    margin: 10px 10px 10px 0;
  }
}

.content {
  &__name {
    @include text-simple;
    font-weight: 500;
    font-size: 16px;
    color: $black800;
    margin: 0 10px 0 0;
  }
  &__company {
    @include text-simple;
    font-weight: 400;
    font-size: 16px;
    color: $black500;
  }
  &__body {
    display: flex;
    flex-direction: row;
  }
  &__footer {}
  &__title {
    display: flex;
    flex-direction: row;
  }
}

.notifications {
  margin: 20px 20px 0 20px;
}

.notification {
  display: grid;
  grid-template-columns: 1fr 8fr 2fr;
  border-bottom: 1px solid $black100;
  grid-gap: 10px;
  &:last-child {
    border: none;
  }
  &__img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }
  &__content {
    margin: 10px 0 10px 0;
  }
  &__title {
    @include text-simple;
    font-weight: 400;
    font-size: 16px;
    color: $black800;
    margin: 10px 10px 10px 0;
  }
  &__date {
    @include text-simple;
    font-weight: 400;
    font-size: 12px;
    color: $black500;
  }
}

.page {
  &__container {
    margin: 20px 0 20px 0;
    display: flex;
    flex-direction: column;
    justify-items: flex-start;
  }
  &__title {
    @include text-simple;
    font-weight: 500;
    font-size: 18px;
    color: $black800;
    margin: 0 0 0 20px;
  }
}

</style>
