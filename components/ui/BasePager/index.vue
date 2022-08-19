<template>
  <div
    class="pager"
    data-selector="COMPONENT-BASE-PAGER"
  >
    <button
      class="pager__icon"
      :class="{'pager__icon_disabled': value === 1}"
      :disabled="value === 1"
      data-selector="ACTION-BTN-PREV-PAGE"
      @click="prevPage"
    >
      <img
        v-if="value === 1"
        src="~/assets/img/ui/pagerNext_disabled.svg"
        class="pager__img"
        alt="<"
      >
      <img
        v-else
        src="~/assets/img/ui/pagerNext.svg"
        class="pager__img pager__img_prev"
        alt="<"
      >
    </button>
    <div class="pager__items">
      <div
        v-for="(item, i) in formedPages"
        :key="`page-${i}`"
        :data-selector="`BASE-PAGER-PAGE-${i}`"
        class="pager__item"
        :class="{'pager__item_active': value === item}"
      >
        <div
          v-if="item === -1"
          class="pager__dots"
        >
          ...
        </div>
        <button
          v-else
          class="pager__cloud"
          :data-selector="`ACTION-BTN-SET-PAGE-${i}`"
          :class="{'pager__cloud_active': value === item}"
          @click="setPage(item)"
        >
          {{ item }}
        </button>
      </div>
    </div>
    <button
      class="pager__icon"
      :class="{'pager__icon_disabled': value === totalPages}"
      :disabled="value === totalPages"
      data-selector="ACTION-BTN-NEXT-PAGE"
      @click="nextPage"
    >
      <img
        v-if="value === totalPages"
        src="~/assets/img/ui/pagerNext_disabled.svg"
        class="pager__img pager__img_prev"
        alt=">"
      >
      <img
        v-else
        src="~/assets/img/ui/pagerNext.svg"
        class="pager__img"
        alt=">"
      >
    </button>
  </div>
</template>

<script>
export default {
  props: {
    totalPages: {
      type: Number,
      default: 0,
    },
    value: {
      type: Number,
      default: 1,
    },
  },
  computed: {
    formedPages() {
      const { totalPages, value } = this;
      if (totalPages >= 7) {
        const array = [];
        for (let i = 1; i <= totalPages; i += 1) {
          array.push(i);
        }
        let medium = [];
        if (value >= totalPages - 2) {
          medium = array.splice(totalPages - 5, 4) || [];
          medium = [-1, ...medium];
        } else if (value > 4) {
          medium = array.splice(value - 2, 3) || [];
          medium = [-1, ...medium, -1];
        } else {
          medium = array.splice(1, 4) || [];
          medium = [...medium, -1];
        }
        return [1, ...medium, totalPages];
      }
      return totalPages;
    },
  },
  methods: {
    setPage(value) {
      if (this.value !== value) {
        this.$emit('input', value);
      }
    },
    firstPage() {
      if (this.value !== 1) {
        this.setPage(1);
      }
    },
    prevPage() {
      if (this.value > 1) {
        this.setPage(this.value - 1);
      }
    },
    nextPage() {
      if (this.value < this.totalPages) {
        this.setPage(this.value + 1);
      }
    },
    lastPage() {
      if (this.value !== this.totalPages) {
        this.setPage(this.totalPages);
      }
    },
  },
};
</script>

<style scoped lang="scss">

.pager {
  border-radius: 6px;
  margin-left: auto;
  display: flex;
  background-color: $white;
  align-items: center;
  justify-content: flex-end;
  max-width: max-content;

  &__dots {
    @include text-simple;
    font-weight: 600;
    font-size: 13px;
    line-height: 18px;
    letter-spacing: 0.04em;
    color: $black600;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__item {
    display: flex;
    align-items: center;
    justify-content: center;
    border-left: 1px solid $black0;

    &_active {
      background-color: $blue100;
    }
  }

  &__cloud {
    @include btn-filter;
    @include text-simple;
    padding: 0 4px;
    min-width: 43px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 130%;
    letter-spacing: 0.04em;
    color: $black600;

    &_active {
      color: $blue;
      cursor: default;
    }
  }

  &__items {
    display: flex;
    border-top: 1px solid $black0;
    border-bottom: 1px solid $black0;
    max-height: 40px;
  }

  &__icon {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
    border-top: 1px solid $black0;
    border-bottom: 1px solid $black0;
    &:first-child {
      border-left: 1px solid $black0;
      border-top-left-radius: 6px;
      border-bottom-left-radius: 6px;
    }
    &:last-child {
      border-left: 1px solid $black0;
      border-right: 1px solid $black0;
      border-top-right-radius: 6px;
      border-bottom-right-radius: 6px;
    }

    &_disabled {
      cursor: default;
    }
  }

  &__img {
    object-fit: cover;

    &_prev {
      transform: rotate(180deg);
    }
  }
}

@include _480 {
  .pager {
    margin: 0 auto;
    width: auto;
    &_icon {
      width: 20px;
      height: 20px;
    }
  }
}

@include _380 {
  .pager {
    &__cloud {
      min-width: 30px;
      font-size: 14px;
    }
  }
}
</style>
