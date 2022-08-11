<template>
  <div
    class="portfolio"
    data-selector="COMPONENT-PORTFOLIO-TAB"
  >
    <emptyData
      v-if="object.count === 0"
      :description="$t('errors.emptyData.emptyPortfolios')"
    />
    <div
      v-else
      class="portfolio__items"
      data-selector="PORTFOLIO-CASES"
    >
      <div
        v-for="(item, i) in object.cases"
        :key="item.id"
        :data-selector="`PORTFOLIO-CASE-${i}`"
        class="portfolio__item"
      >
        <div class="portfolio__card">
          <div class="portfolio__body">
            <div
              v-if="userId === mainUserData.id"
              class="portfolio__btns"
            >
              <base-btn
                class="portfolio__close"
                mode="portfolioClose"
                :data-selector="`DELETE-PORTFOLIO-CASE-${i}`"
                @click="showDeleteCaseModal(item.id)"
              >
                <span class="icon-close_big" />
              </base-btn>
              <base-btn
                class="portfolio__edit"
                mode="portfolioEdit"
                :data-selector="`EDIT-PORTFOLIO-CASE-${i}`"
                @click="showEditCaseModal(item)"
              >
                <span class="icon-edit" />
              </base-btn>
            </div>
            <div
              v-for="(img, j) in item.medias"
              :key="j"
              class="portfolio__img"
              @click="openImage(img.url, item)"
            >
              <img
                class="portfolio__image"
                :data-selector="`PORTFOLIO-CASE-IMAGE-${j}`"
                :src="img.url"
                :alt="item.title"
              >
              <div class="portfolio__footer footer">
                <div class="footer__name">
                  {{ item.title }}
                </div>
              </div>
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
import emptyData from '~/components/app/info/emptyData';

export default {
  name: 'PortfolioTab',
  components: {
    emptyData,
  },
  props: {
    object: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    ...mapGetters({
      mainUserData: 'user/getUserData',
    }),
    userId() {
      return this.$route.params.id;
    },
  },
  methods: {
    openImage(src, {
      title, description, id, medias,
    }) {
      if (window.innerWidth >= 761) {
        this.ShowModal({
          key: modals.showImage,
          portfolio: true,
          url: src,
          title,
          description,
          id,
          medias,
        });
      }
    },
    showDeleteCaseModal(id) {
      this.ShowModal({
        key: modals.deleteCase,
        id,
      });
    },
    showEditCaseModal(item) {
      this.ShowModal({
        key: modals.editCase,
        id: item.id,
        title: item.title,
        desc: item.description,
        media: item.medias,
      });
    },
  },
};
</script>

<style lang="scss" scoped>

.styles {
  &__flex {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
  }
}

.button {
  &__container {
    @extend .styles__flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
  }
  &__more {
    display: inline-block;
    cursor: pointer;
    text-decoration: none;
    font-size: 16px;
    line-height: 130%;
    color: #0083C7;
    border: 1px solid rgba(0, 131, 199, 0.1);
    border-radius: 6px;
    padding: 13px 67px 13px 28px;
    background-image: url("data:image/svg+xml,%3Csvg width='11' height='6' viewBox='0 0 11 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E\a           %3Cpath d='M5.5 5.5L10.5 0.5L0.5 0.5L5.5 5.5Z' fill='%230083C7'/%3E\a           %3C/svg%3E                                                          \a           ");
    background-position: 82% 21px;
    background-repeat: no-repeat;
  }
}

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
    z-index: 10000;
    transition: .5s ease-in-out;
    opacity: 0;
    visibility: hidden;
  }
  &__close {
    z-index: 10000;
    transition: .5s ease-in-out;
    opacity: 0;
    visibility: hidden;
  }
  &__card {
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    transition: .5s;
    border: 1px solid $white;
    &:hover {
      border: 1px solid $black100;
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
    border-radius: 8px;
    object-fit: cover;
  }
  &__footer {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: $white;
    height: 82px;
    display: flex;
    width: 100%;
  }
  &__pager {
    margin-top: 25px;
  }
}
.portfolio__item:hover .portfolio__edit,
.portfolio__item:hover .portfolio__close {
  transition: .5s ease-in-out;
  opacity: 1;
  visibility: visible;
}

.footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 5px 16px 16px;
  border-radius: 0 0 6px 6px;
  text-overflow: ellipsis;
  &__name {
    @include text-simple;
    margin-top: 16px;
    color: $black800;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 18px;
    font-weight: 500;
    width: 100%;
    text-align: center;
  }
}

@include _575 {
  .portfolio__items {
    grid-template-columns: auto;
    margin: 0;
  }
}

</style>
