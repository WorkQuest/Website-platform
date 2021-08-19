<template>
  <div class="main-white">
    <div class="main__body">
      <h2 class="page__title">
        {{ $t('quests.createAQuest') }}
      </h2>
      <div class="page__category">
        <div class="runtime">
          <div class="runtime__container">
            <base-field
              v-model="runtimeValue"
              :label="$t('quests.runtime.runtime')"
              :placeholder="0"
            />
            <base-dd
              v-model="runtimeIndex"
              class="runtime__dd"
              type="blue"
              :items="runtime"
              :placeholder="runtime[0]"
            />
          </div>
        </div>
        <base-field
          v-model="price"
          :label="$t('quests.price')"
          :placeholder="+0 + currency"
        />
        <div class="page__dd">
          <base-dd
            v-model="priorityIndex"
            :label="$t('quests.employment.employment')"
            type="gray"
            :items="employment"
          />
        </div>
        <div class="page__dd">
          <base-dd
            v-model="categoryIndex"
            :label="$t('quests.distantWork.distantWork')"
            type="gray"
            :items="distantWork"
          />
        </div>
      </div>
      <div class="page__address">
        <div>
          <base-field
            v-model="address"
            :label="$t('quests.address')"
            :placeholder="$t('quests.address')"
            mode="icon"
            :selector="true"
            @selector="getAddressInfo(address)"
          >
            <template v-slot:left>
              <span class="icon-map" />
            </template>
            <template v-slot:selector>
              <div
                v-if="addresses.length"
                class="selector"
              >
                <div class="selector__items">
                  <div
                    v-for="(item, i) in addresses"
                    :key="i"
                    class="selector__item"
                    @click="selectAddress(item)"
                  >
                    {{ item.formatted }}
                  </div>
                </div>
              </div>
            </template>
          </base-field>
        </div>
      </div>
      <div>
        <base-field
          v-model="questTitle"
          :placeholder="$t('quests.questTitle')"
        />
      </div>
      <div>
        <textarea
          id="textarea"
          v-model="textarea"
          class="page__textarea"
          :placeholder="$t('quests.questDesc')"
        />
      </div>
      <div class="upload__container">
        <div class="upload__title">
          {{ $t('quests.uploadMaterials') }}
        </div>
        <dropzone
          id="uploader"
          ref="el"
          :options="optionsModal"
          :include-styling="true"
        />
      </div>
      <div class="btn__container btn__container_right">
        <div class="btn">
          <base-btn @click="showQuestCreatedModal()">
            {{ $t('quests.createAQuest') }}
          </base-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Dropzone from 'nuxt-dropzone';
import 'nuxt-dropzone/dropzone.css';
import '~/assets/scss/vue2Dropzone.min.css';
import '~/assets/scss/dropzone.scss';
import modals from '~/store/modals/modals';

const { GeoCode } = require('geo-coder');

export default {
  name: 'CreateQuest',
  ...mapGetters({
    userData: 'user/getUserData',
  }),
  components: {
    Dropzone,
  },
  data() {
    return {
      priorityIndex: 0,
      categoryIndex: 0,
      runtimeIndex: 0,
      periodIndex: 0,
      runtimeValue: '',
      questTitle: '',
      address: '',
      textarea: '',
      price: '',
      priceOfClick: '',
      city: '',
      coordinates: {},
      currency: ' WUSD',
      addresses: [],
      optionsModal: {
        url: 'http://httpbin.org/anything',
        addRemoveLinks: true,
        dictRemoveFile: '<span class="icon-close_big"></span>',
        dictCancelUpload: '<span class="icon-close_big"></span>',
        dictCancelUploadConfirmation: '',
        maxFiles: '3',
        dictDefaultMessage:
          '<div class="uploader__message_container">'
          + '<div class="uploader__message">Upload a images or videos</div><'
          + "span class='icon-add_to_queue'></span>"
          + '</div>',
      },
      file1: null,
      file2: null,
    };
  },
  computed: {
    runtime() {
      return [
        this.$t('quests.runtime.days'),
        this.$t('quests.runtime.weeks'),
        this.$t('quests.runtime.months'),
        this.$t('quests.runtime.years'),
      ];
    },
    employment() {
      return [
        this.$t('quests.employment.fullTime'),
        this.$t('quests.employment.partTime'),
        this.$t('quests.employment.fixedTerm'),
      ];
    },
    distantWork() {
      return [
        this.$t('quests.distantWork.distantWork'),
        this.$t('quests.distantWork.workInOffice'),
        this.$t('quests.distantWork.bothVariant'),
      ];
    },
  },
  async mounted() {
    this.SetLoader(true);
    this.SetLoader(false);
  },
  methods: {
    selectAddress(address) {
      this.addresses = [];
      this.address = address.formatted;
    },
    async getAddressInfo(address) {
      let response = [];
      const geoCode = new GeoCode('google', { key: 'AIzaSyD32Aorm6CU9xUIrUznzYyw2d_0NTqt3Zw' });
      try {
        if (address.length) {
          response = await geoCode.geolookup(address);
          this.addresses = JSON.parse(JSON.stringify(response));
          this.coordinates = JSON.parse(JSON.stringify({ lng: response[0].lng, lat: response[0].lat }));
        }
      } catch (e) {
        console.log(e);
      }
    },
    setAd() {
      this.adMode1 = !this.adMode1;
      this.adMode2 = !this.adMode2;
    },
    showQuestCreatedModal() {
      const createQuestData = {
        priority: this.priorityIndex,
        category: this.categories[this.categoryIndex],
        title: this.questTitle,
        description: this.textarea,
        price: this.price,
        medias: [],
        adType: this.adMode1 ? 1 : 0,
        location: {
          longitude: this.coordinates.lng,
          latitude: this.coordinates.lat,
        },
      };
      try {
        const response = this.$store.dispatch('quests/questCreate', createQuestData);
        if (response) {
          this.ShowModal({
            key: modals.status,
            img: require('~/assets/img/ui/questAgreed.svg'),
            title: this.$t('modals.yourSkillsHaveBeenAdded'),
            subtitle: this.$t('modals.youCanUpdateThisInYourProfile'),
            path: '/settings',
          });
        }
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>

<style lang="scss" scoped>

.runtime {
  &__container {
    display: grid;
    grid-template-columns: 6fr 2fr;
    grid-gap: 10px;
    align-items: center;
  }
  &__dd {
    margin: 13px 0 0 0;
  }
}

.icon {
  &-map::before {
    content: "\ea28";
    color: $blue;
    font-size: 20px;
  }
}
.selector {
  @include box;
  width: 100%;
  z-index: 140;
  &__items {
    background: #FFFFFF;
    display: grid;
    grid-template-columns: 1fr;
    width: 100%;
  }
  &__item {
    @include text-simple;
    padding: 15px 20px;
    background: #FFFFFF;
    font-weight: 500;
    font-size: 16px;
    color: $black800;
    cursor: pointer;
    transition: .3s;
    &:hover {
      background: #F3F7FA;
    }
  }
}

.payment {
  &__container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
  }
  &__title {
    @include text-simple;
    color: $black500;
    font-weight:400;
    font-size: 16px;
  }
  &__cost {
    @include text-simple;
    color: $blue;
    font-weight: 500;
    font-size: 16px;
    padding: 0 0 0 5px;
  }
}

.base-btn {
  @include text-simple;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 43px;
  color: #ffffff;
  font-size: 16px;
  line-height: 130%;
  text-align: center;
  transition: .3s;
  background: #0083C7;
  border-radius: 6px;
  &:hover {
    background: #103D7C;
  }
  &__passive {
    border: 1px solid rgba(0, 131, 199, 0.1);
    background: #FFFFFF;
    color: $blue;
    &:hover {
      background: #F7F8FA;
      color: $blue;
    }
  }
}

.upload {
  &__container {
    margin: 20px 0 0 0;
    width: 100%;
  }
  &__title {
    @include text-simple;
    font-weight: 500;
    color: $black800;
    font-size: 18px;
    padding: 0 0 20px 0;
  }
}

.btn {
  width: 220px;
  &__container {
    width: 100%;
    align-items: center;
    display: flex;
    &_left {
      margin: 20px 0 0 0;
      justify-content: flex-start;
      width: 100%;
    }
    &_right {
      justify-content: flex-end;
      width: 100%;
      margin: 0 0 20px 0;
    }
  }
}

.page {
  &__title {
    @include text-simple;
    margin: 30px 0 0 0;
  }
  &__page {
    font-weight: 500;
    font-size: 25px;
    color: $black800;
  }
  &__dd {
    min-width: 160px;
  }
  &__category {
    align-items: flex-start;
    margin: 20px 0 0 0;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 20px;
  }
  &__address {
    margin: 20px 0 0 0;
    display: grid;
    grid-gap: 20px;
  }
  &__textarea {
    @include text-simple;
    border-radius: 6px;
    padding: 11px 20px 11px 15px;
    height: 214px;
    width: 100%;
    border: 0;
    background-color: $black0;
    resize: none;
    &::placeholder {
      color: $black200;
    }
  }
}

.main {
  @include main;
  &-white {
    border: 1px solid $black0;
    @include main-white;
  }
}

@include _1199 {
  .main__body {
    padding: 10px;
  }
  .page {
    &__address {
      grid-template-columns: 5fr 1fr;
    }
  }
}

@include _767 {
  .page {
    &__address {
      grid-template-columns: 1fr 1fr;
    }
  }
}

@include _575 {
  .page__category {
    grid-template-columns: auto;
  }
}
</style>
