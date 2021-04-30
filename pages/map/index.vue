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
    </div>
    <div class="main">
      <div class="main-body">
        <div class="search-bar">
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
        <h2>Top workers</h2>
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
    toggleMap() {
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
  &-white {
    @include main-white;
  }
  &__body {}
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
  position: fixed;
  top: 350px;
  right: 250px;
  margin: 10px 0 0 0;
  max-width: 1180px;
  width: 100%;
  height: 84px;
  border-radius: 6px;
  background-color: $white;
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
