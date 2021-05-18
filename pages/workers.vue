<template>
  <div>
    <div class="map__container">
      <transition name="fade-fast">
        <GMap
          v-if="isShowMap"
          ref="gMap"
          class="quests__map"
          language="en"
          :center="{lat: locations[0].lat, lng: locations[0].lng}"
          :zoom="6"
        />
      </transition>
      <div class="main__searchBar">
        <div
          id="searchBar"
          class="search-bar"
        >
          <div class="search-bar__body">
            <div class="checkbox__isShowMap">
              <input
                id="isShowMap"
                v-model="isShowMap"
                type="checkbox"
                class="checkbox-input"
              >
              <label
                class="checkbox__label"
                for="isShowMap"
              > Show map </label>
            </div>
            <input
              type="text"
              class="ctm-field_search search-bar__input"
              placeholder="City / Street / Place"
            >
            <!--              TODO: Style a button-->
            <button class="header__button header__button_locale search-bar__btn">
              <span class=""> +500m </span>
              <span class="icon-caret_down" />
            </button>
            <base-btn
              class="message__action search-bar__btn-search"
              @click="toggleMap()"
            >
              Search workers
            </base-btn>
          </div>
        </div>
      </div>
    </div>
    <div class="main">
      <div class="main__body">
        <h2 class="main__title">
          Top workers
        </h2>
        <div class="main__menu">
          <div class="main__menu main__menu_left">
            <base-btn
              class="btn_white"
            >
              Price
            </base-btn>
            <base-btn
              class="btn_white"
            >
              Added time
            </base-btn>
          </div>
          <div class="main__menu main__menu_right">
            <base-btn
              class="btn_white"
            >
              Quests
            </base-btn>
            <base-btn
              class="btn_white"
            >
              Urgent
            </base-btn>
            <base-btn
              class="btn_white"
            >
              Specialized
            </base-btn>
            <base-btn
              class="btn_white"
            >
              Type of job
            </base-btn>
          </div>
        </div>
        <div class="content">
          <div
            v-for="(card, i) in cards"
            :key="i"
            class="card card_higher"
          >
            <div
              class="card__content"
            >
              <div class="card__header">
                <div class="card__header_top">
                  <div class="card__header_left">
                    <img
                      class="card__img"
                      :src="card.img"
                    >
                  </div>
                  <div class="card__header_right">
                    <span class="card__name">
                      {{ card.name }}
                    </span>
                    <div class="card__level">
                      <span class="icon-circle_up icon_blue" />
                      <span class="card__level_higher">{{ card.level }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="card__spec_title">
                Specializations
              </div>
              <span
                v-for="(spec, j) in card.specialization"
                :key="j"
                class="card__spec"
              >
                {{ spec.name }}
              </span>
              <div class="card__about_title">
                About me
              </div>
              <div class="card__about">
                {{ card.about }}
              </div>
              <div class="card__address">
                {{ card.address }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CheckBox from '~/components/ui/BaseCheckbox';

export default {
  name: 'IndexVue',
  data() {
    return {
      cards: [
        {
          name: 'Rosalia Vans',
          img: require('~/assets/img/temp/fake-card.svg'),
          level: 'HIGHER LEVEL',
          specialization: [
            {
              name: 'Programming',
            },
            {
              name: 'design',
            },
          ],
          about: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam adipiscing elit ut elit ut elit utelit ut',
          address: 'Moscos, Lenina street, 3',
        },
        {
          name: 'Rosalia Vans',
          img: require('~/assets/img/temp/fake-card.svg'),
          level: 'HIGHER LEVEL',
          specialization: [
            {
              name: 'Programming',
            },
            {
              name: 'design',
            },
          ],
          about: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam adipiscing elit ut elit ut elit utelit ut',
          address: 'Moscos, Lenina street, 3',
        },
        {
          name: 'Rosalia Vans',
          img: require('~/assets/img/temp/fake-card.svg'),
          level: 'HIGHER LEVEL',
          specialization: [
            {
              name: 'Programming',
            },
            {
              name: 'design',
            },
          ],
          about: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam adipiscing elit ut elit ut elit utelit ut',
          address: 'Moscos, Lenina street, 3',
        },
        {
          name: 'Rosalia Vans',
          img: require('~/assets/img/temp/fake-card.svg'),
          level: 'HIGHER LEVEL',
          specialization: [
            {
              name: 'Programming',
            },
            {
              name: 'design',
            },
          ],
          about: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam adipiscing elit ut elit ut elit utelit ut',
          address: 'Moscos, Lenina street, 3',
        },
        {
          name: 'Rosalia Vans',
          img: require('~/assets/img/temp/fake-card.svg'),
          level: 'HIGHER LEVEL',
          specialization: [
            {
              name: 'Programming',
            },
            {
              name: 'design',
            },
          ],
          about: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam adipiscing elit ut elit ut elit utelit ut',
          address: 'Moscos, Lenina street, 3',
        },
        {
          name: 'Rosalia Vans',
          img: require('~/assets/img/temp/fake-card.svg'),
          level: 'HIGHER LEVEL',
          specialization: [
            {
              name: 'Programming',
            },
            {
              name: 'design',
            },
          ],
          about: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam adipiscing elit ut elit ut elit utelit ut',
          address: 'Moscos, Lenina street, 3',
        },
        {
          name: 'Rosalia Vans',
          img: require('~/assets/img/temp/fake-card.svg'),
          level: 'HIGHER LEVEL',
          specialization: [
            {
              name: 'Programming',
            },
            {
              name: 'design',
            },
          ],
          about: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam adipiscing elit ut elit ut elit utelit ut',
          address: 'Moscos, Lenina street, 3',
        },
        {
          name: 'Rosalia Vans',
          img: require('~/assets/img/temp/fake-card.svg'),
          level: 'HIGHER LEVEL',
          specialization: [
            {
              name: 'Programming',
            },
            {
              name: 'design',
            },
          ],
          about: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam adipiscing elit ut elit ut elit utelit ut',
          address: 'Moscos, Lenina street, 3',
        },
        {
          name: 'Rosalia Vans',
          img: require('~/assets/img/temp/fake-card.svg'),
          level: 'HIGHER LEVEL',
          specialization: [
            {
              name: 'Programming',
            },
            {
              name: 'design',
            },
          ],
          about: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam adipiscing elit ut elit ut elit utelit ut',
          address: 'Moscos, Lenina street, 3',
        },
        {
          name: 'Rosalia Vans',
          img: require('~/assets/img/temp/fake-card.svg'),
          level: 'HIGHER LEVEL',
          specialization: [
            {
              name: 'Programming',
            },
            {
              name: 'design',
            },
          ],
          about: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam adipiscing elit ut elit ut elit utelit ut',
          address: 'Moscos, Lenina street, 3',
        },
        {
          name: 'Rosalia Vans',
          img: require('~/assets/img/temp/fake-card.svg'),
          level: 'HIGHER LEVEL',
          specialization: [
            {
              name: 'Programming',
            },
            {
              name: 'design',
            },
          ],
          about: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam adipiscing elit ut elit ut elit utelit ut',
          address: 'Moscos, Lenina street, 3',
        },
        {
          name: 'Rosalia Vans',
          img: require('~/assets/img/temp/fake-card.svg'),
          level: 'HIGHER LEVEL',
          specialization: [
            {
              name: 'Programming',
            },
            {
              name: 'design',
            },
          ],
          about: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam adipiscing elit ut elit ut elit utelit ut',
          address: 'Moscos, Lenina street, 3',
        },
        {
          name: 'Rosalia Vans',
          img: require('~/assets/img/temp/fake-card.svg'),
          level: 'HIGHER LEVEL',
          specialization: [
            {
              name: 'Programming',
            },
            {
              name: 'design',
            },
          ],
          about: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam adipiscing elit ut elit ut elit utelit ut',
          address: 'Moscos, Lenina street, 3',
        },
        {
          name: 'Rosalia Vans',
          img: require('~/assets/img/temp/fake-card.svg'),
          level: 'HIGHER LEVEL',
          specialization: [
            {
              name: 'Programming',
            },
            {
              name: 'design',
            },
          ],
          about: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam adipiscing elit ut elit ut elit utelit ut',
          address: 'Moscos, Lenina street, 3',
        },
        {
          name: 'Rosalia Vans',
          img: require('~/assets/img/temp/fake-card.svg'),
          level: 'HIGHER LEVEL',
          specialization: [
            {
              name: 'Programming',
            },
            {
              name: 'design',
            },
          ],
          about: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam adipiscing elit ut elit ut elit utelit ut',
          address: 'Moscos, Lenina street, 3',
        },
        {
          name: 'Rosalia Vans',
          img: require('~/assets/img/temp/fake-card.svg'),
          level: 'HIGHER LEVEL',
          specialization: [
            {
              name: 'Programming',
            },
            {
              name: 'design',
            },
          ],
          about: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam adipiscing elit ut elit ut elit utelit ut',
          address: 'Moscos, Lenina street, 3',
        },
      ],
      isShowMap: true,
      locations: [
        {
          lat: 56.475565,
          lng: 84.967270,
        },
      ],
      distance: [
        '+ 100 m',
        '+ 500 m',
        '+ 1000 m',
      ],
      priorityIndex: 0,
      distanceIndex: 0,
      priceSort: 'desc',
      timeSort: 'desc',
      priority: [
        this.$t('quests.priority.all'),
        this.$t('quests.priority.low'),
        this.$t('quests.priority.normal'),
        this.$t('quests.priority.urgent'),
      ],
    };
  },
  computed: {},
  async mounted() {
    this.SetLoader(true);
    this.SetLoader(false);
  },
  methods: {
    toggleMap(newPosition) {
      this.isShowMap = !this.isShowMap;
    },
    getPriority(index) {
      const priority = {
        0: this.$t('priority.low'),
        1: this.$t('priority.normal'),
        2: this.$t('priority.urgent'),
      };
      return priority[index] || 'None';
    },
    getPriorityClass(index) {
      const priority = {
        0: 'block__priority_low',
        1: 'block__priority_normal',
        2: 'block__priority_urgent',
      };
      return priority[index] || '';
    },
  },
};
</script>

<style lang="scss" scoped>
.main {
  @include main;
  &__searchBar {
    justify-items: center;
    position: relative;
  }
  &-white {
    @include main-white;
  }
  &__title {
    padding: 30px 0 0 0;
  }
  &__menu {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    max-width: 1180px;
    width: 100%;
    &_left {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
    }
    &_right {}
  }
}
.map {
  &__container {
    position: relative;
  }
}
.content {
  display: grid;
  grid-template-columns: 25% 25% 25% 25%;
}
.btn_white {
  background-color: $white;
  color: $black800;
  padding: 11px 10px 11px 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: 6px;
  margin: 10px;
  flex-shrink: 0;
  max-width: 120px;
  width: 100%;
}
.btn_white:hover {
  background-color: $white;
  color: $black800;
  padding: 11px 10px 11px 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: 6px;
  margin: 10px;
  flex-shrink: 0;
  max-width: 120px;
  width: 100%;
}
.icon {
  &_blue::before {
    color: $blue;
    font-size: 24px;
    display: block;
  }
}
.card {
  margin: 20px 0 0 0;
  max-width: 280px;
  width: 100%;
  max-height: 300px;
  height: 100%;
  box-sizing: border-box;
  border-radius:6px;
  align-items: center;
  &_higher {
    border: 1px solid #F6CF00;
  }
  &__content {
    width: 100%;
    max-width: 240px;
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
  &__header {
    display: flex;
    flex-direction: column;
    margin: 20px 0 0 0;
    &_top {
      display: flex;
      flex-direction: row;
    }
    &_right {
      display: flex;
      flex-direction: column;
    }
    &_left {}
  }
  &__img {
    width: 61px;
    height: 61px;
    border-radius:73px;
  }
  &__name {
    margin: 0 0 0 7px;
    font-size: 18px;
    font-weight: 500;
  }
  &__level {
    margin: 0 0 0 15px;
    font-size: 12px;
    justify-content: center;
    align-items: center;
    display: flex;
    &_higher {
      display: block;
      margin: 0 0 0 7px;
      padding: 2px 4px 2px 4px;
      background-color: #F6CF00;
      border-radius: 3px;
      color: $white;
    }
  }
  &__about {
    margin: 0 0 15px 0;
    font-weight: 400;
    font-size: 14px;
    color: $black300;
    &_title {
      margin: 15px 0 0 0;
      font-weight: 400;
      font-size: 14px;
    }
  }
  &__address {
    margin: 0 0 15px 0;
    font-weight: 500;
    font-size: 12px;
    color: $black500;
  }
}
.checkbox {
  &__isShowMap {
    margin: 30px 50px 0 10px;
    display: flex;
    flex-direction: row;
    height: 25px;
    align-items: center;
  }
  &-input {
    width: 24px;
    height: 24px;
  }
  &__label {
    display: flex;
    flex-direction: row;
    flex-shrink: 0;
    margin: 0 0 0 5px;
    font-size: 16px;
  }
}
.search-bar {
  left: 18%;
  bottom: 30px;
  margin: 10px 0 0 0;
  position: absolute;
  max-width: 1180px;
  width: 100%;
  height: 84px;
  display: flex;
  flex-direction: column;
  border-radius: 6px;
  background-color: $white;
  z-index: 10;
  box-shadow: 0px 17px 17px rgba(0, 0, 0, 0.05), 0px 5.125px 5.125px rgba(0, 0, 0, 0.0325794), 0px 2.12866px 2.12866px rgba(0, 0, 0, 0.025), 0px 0.769896px 0.769896px rgba(0, 0, 0, 0.0174206);
  &__body {
    display: flex;
    flex-direction: row;
    flex-shrink: 0;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    height: 40px;
  }
  &__input {
    margin: 30px 10px 0 0;
    height: 25px;
    width: 510px;
  }
  &__btn {
    margin: 30px 10px 0 0;
    flex-shrink: 0;
  }
  &__btn-search {
    margin: 30px 10px 0 0;
    width: 220px;
  }
}
</style>
