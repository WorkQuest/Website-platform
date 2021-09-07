<template>
  <div>
    <div class="portfolio portfolio__items">
      <div
        v-for="(item, i) in portfolios"
        :key="i"
        class="portfolio__item"
      >
        <div class="portfolio__card">
          <div class="portfolio__body">
            <div
              v-for="(img, j) in item.medias"
              :key="j"
              class="portfolio__img"
            >
              <div class="portfolio__btns">
                <button
                  class="portfolio__close"
                  @click="deletePortfolio(item.id)"
                >
                  <span
                    class="icon-close_big"
                  />
                </button>
                <button
                  class="portfolio__edit"
                  @click="showEditCaseModal(item.id)"
                >
                  <span
                    class="icon-edit"
                  />
                </button>
              </div>
              <img
                class="portfolio__image"
                :src="img.url"
                :alt="item.title"
                loading="lazy"
                @click="openImage(img.url, item.title, item.description)"
              >
            </div>
          </div>
          <div class="portfolio__footer">
            <div class="portfolio__name">
              {{ item.title }}
            </div>
            <div class="portfolio__description">
              {{ item.description }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import modals from '~/store/modals/modals';

export default {
  name: 'PortfolioTab',
  computed: {
    ...mapGetters({
      portfolios: 'user/getUserPortfolios',
      userData: 'user/getUserData',
    }),
  },
  async mounted() {
    await this.getAllPortfolios();
  },
  methods: {
    openImage(src, name, desc) {
      if (window.innerWidth >= 761) {
        this.ShowModal({
          key: modals.showImage,
          imageSrc: src,
          title: name,
          desc,
        });
      }
    },
    async getAllPortfolios() {
      try {
        this.SetLoader(true);
        const response = await this.$store.dispatch('user/getUserPortfolios', this.userData.id);
        this.SetLoader(false);
        if (response?.ok) {
          this.hide();
          this.SetLoader(false);
        }
      } catch (e) {
        console.log(e);
      }
    },
    showEditCaseModal(id) {
      this.ShowModal({
        key: modals.editCase,
        id,
      });
    },
    async deletePortfolio(id) {
      try {
        this.SetLoader(true);
        const response = await this.$store.dispatch('user/deletePortfolio', id);
        if (response?.ok) {
          this.hide();
          this.SetLoader(false);
        }
      } catch (e) {
        console.log(e);
      }
      this.SetLoader(true);
      await this.$store.dispatch('user/getUserPortfolios', this.userData.id);
      this.SetLoader(false);
    },
  },
};
</script>

<style lang="scss" scoped>

.portfolio {
  &__btns {
    position: absolute;
    left: 0;
    top: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 25px;
    width: 60px;
    border-radius: 6px;
    padding: 2px;
  }
  &__edit {
    position: absolute;
    left: 25px;
    top: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 20px;
    width: 20px;
    border-radius: 6px;
    padding: 2px;
    transition: 0.5s;
    &:hover {
      background: $yellow;
    }
  }
  &__close {
    position: absolute;
    left: 5px;
    top: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 20px;
    width: 20px;
    border-radius: 6px;
    padding: 2px;
    transition: 0.5s;
    &:hover {
      background: $red;
    }
  }
  &__card {
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    transition: 0.3s;
    &:hover {
      box-shadow: 0 0 10px 2px rgba(34, 60, 80, 0.3);
    }
  }
  &__items {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 20px;
  }
  &__image {
    height: 350px;
    width: 100%;
    border-radius: 6px;
  }
  &__name {
    @include text-simple;
    text-align: left;
    color: $white;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 18px;
    font-weight: 500;
  }
  &__description {
    @include text-simple;
    font-size: 18px;
    font-weight: 500;
    margin-left: 10px;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  &__footer {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: $black700;
    height: 71px;
    display: flex;
    align-items: center;
    padding-left: 20px;
    border-radius: 0 0 6px 6px;
  }
}

@include _575 {
  .portfolio__items {
    grid-template-columns: auto;
    margin: 0 20px 0 0;
  }
}

</style>
