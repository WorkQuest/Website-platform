<template>
  <!-- Quest page_User -->
  <div class="container">
    <div class="user__top">
      <div class="user__container">
        <div class="user__wrapper">
          <img
            class="user__img"
            src="https://media.pn.am/media/issue/197/297/photo/197297.jpg"
            alt=""
          >
          <p class="user__username">
            Samantha Sparcs
          </p>
          <div class="date__wrapper">
            <p class="user__date">
              12 January 2021,14:45
            </p>
            <p>share icon</p>
          </div>
        </div>
        <div class="location__container">
          <div class="quest__location">
            <img
              class="location__icon"
              src="../../assets/img/ui/location.png"
            >
            <p>Moscow, Lenina street, 3</p>
          </div>
          <a
            class="user__distance"
            href="#"
          >
            200m from you
          </a>
          <div class="runtime__container">
            <span>Icon</span>
            <p>Runtime</p>
            <a
              class="runtime__link"
              href="#"
            >
              14:45:23
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="badge__container">
      <span class="badge__blue">Painting Works</span>
      <span class="badge__blue">Art</span>
    </div>
    <div class="quest__container">
      <h2 class="quest__title">
        Paint the garage quickly
      </h2>
      <p class="quest__body">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luctus venenatis, lectus magna fringilla urna, porttitor rhoncus dolor purus non enim praesent elementum facilisis leo, vel fringilla est ullamcorper eget nulla facilisi etiam dignissim diam quis enim lobortis scelerisque fermentum dui faucibus in ornare quam viverra orci sagittis eu volutpat odio facilisis mauris sit amet massa vitae tortor condimentum lacinia quis vel eros donec ac odio tempor orci dapibus ultrices in iaculis nunc sed augue lacus, viverra vitae congue eu, consequat ac felis donec et odio pellentesque diam volutpat commodo sed egestas egestas fringilla phasellus faucibus Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luctus venenatis, lectus magna fringilla urna, porttitor rhoncus dolor purus non enim praesent elementum facilisis leo, vel fringilla est ullamcorper eget nulla facilisi etiam dignissim diam quis enim lobortis scelerisque fermentum dui faucibus in ornare quam viverra orci sagittis eu volutpat odio facilisis mauris sit amet massa vitae tortor condimentum lacinia quis vel eros donec ac odio tempor orci dapibus ultrices in iaculis nunc sed augue lacus, viverra vitae congue eu, consequat ac felis donec et odio pellentesque diam volutpat commodo sed egestas egestas fringilla phasellus faucibus
      </p>
    </div>
    <hr class="hr__line">
    <div class="quest_materials__container">
      <h2 class="quest_materials__title">
        Quest materials
      </h2>
      <div class="img__container">
        <img
          class="img__item"
          src="https://3dnews.ru/assets/external/illustrations/2020/09/14/1020548/03.jpg"
          alt=""
        >
        <img
          class="img__item"
          src="https://3dnews.ru/assets/external/illustrations/2020/09/14/1020548/03.jpg"
          alt=""
        >
        <img
          class="img__item"
          src="https://3dnews.ru/assets/external/illustrations/2020/09/14/1020548/03.jpg"
          alt=""
        >
        <img
          class="img__item"
          src="https://3dnews.ru/assets/external/illustrations/2020/09/14/1020548/03.jpg"
          alt=""
        >
      </div>
      <hr>
      <div class="price__wrapper">
        <b-btn class="btn__request">
          Send a request
        </b-btn>
        <div class="price__wrapperValue">
          <p class="price__value">
            1500  WUSD
          </p>
          <div>
            <div class="badge__wrapper">
              <span class="badge__green">Low priority</span>
            </div>
          </div>
        </div>
      </div>
      <div class="map__container">
        <h2>Контейнер для карты</h2>
      </div>
      <div class="specialisation__container">
        <div class="quest__group">
          <h2 class="quest__spec">
            Other quests for the specialization
            <a
              class="spec__link"
              href="#"
            >"Painting Works"</a>
          </h2>
        </div>
        <p class="quest__count">
          26 quests
        </p>
        <div class="quest__card">
          Карточки квестов
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import modals from '~/store/modals/modals';

export default {
  name: 'Quests',
  data() {
    return {
      isShowMap: true,
      search: '',
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
      priority: [
        this.$t('quests.priority.all'),
        this.$t('quests.priority.low'),
        this.$t('quests.priority.normal'),
        this.$t('quests.priority.urgent'),
      ],
      priorityIndex: 0,
      distanceIndex: 0,
      priceSort: 'desc',
      timeSort: 'desc',
      cards: [
        {
          title: 'Samantha Sparks',
          favourite: true,
          sub: '',
          background: require('~/assets/img/temp/fake-card.svg'),
          theme: 'Paint the garage quickly',
          desc: 'Hi, i’m urgently looking for a skilled man that can paint my Garage doors and a couple of walls around the garage and by the way...',
          priority: 0,
          amount: 1500,
          symbol: 'wusd',
        },
        {
          title: 'Samantha Sparks',
          sub: 'from Amazon',
          favourite: false,
          background: require('~/assets/img/temp/fake-card.svg'),
          theme: 'Paint the garage quickly',
          desc: 'Hi, i’m urgently looking for a skilled man that can paint my Garage doors and a couple of walls around the garage and by the way...',
          priority: 1,
          amount: 1100,
          symbol: 'wusd',
        },
        {
          title: 'Samantha Sparks',
          sub: 'from Amazon',
          favourite: false,
          background: require('~/assets/img/temp/fake-card.svg'),
          theme: 'Paint the garage quickly',
          desc: 'Hi, i’m urgently looking for a skilled man that can paint my Garage doors and a couple of walls around the garage and by the way...',
          priority: 2,
          amount: 1700,
          symbol: 'wusd',
        },
      ],
    };
  },
  computed: {
    ...mapGetters({
      tags: 'ui/getTags',
    }),
  },
  async mounted() {
    this.SetLoader(true);
    this.SetLoader(false);
  },
  methods: {
    toggleMap() {
      this.isShowMap = !this.isShowMap;
    },
    changeSorting(type) {
      if (type === 'price') {
        // eslint-disable-next-line no-unused-expressions
        this.priceSort === 'desc' ? this.priceSort = 'asc' : this.priceSort = 'desc';
      }
      if (type === 'time') {
        // eslint-disable-next-line no-unused-expressions
        this.timeSort === 'desc' ? this.timeSort = 'asc' : this.timeSort = 'desc';
      }
    },
    deleteTag(tag) {
      this.$store.dispatch('ui/deleteTags', tag);
    },
    showSkillsModal() {
      this.ShowModal({
        key: modals.skills,
      });
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

$color: black;
$bg-color: white;

.container{}

.location{
  &__icon{
    filter: invert(100%);
    margin: 0 9px 0 0;
    width:11px;
    height:15px;
  }
}

.user{
  &__top{}
  &__container{
    padding: 34.5px 0 25.5px 0;
  }
  &__wrapper{
    display: flex;
    flex-direction: row;
  }
  &__date{
    color:rgba(124, 131, 141, 1);
    font-family: Inter;
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
  }
  &__img{
    width:30px;
    height: 30px;
    border-radius: 50%;
  }
  &__username{
    color: #1D2127;
    font-family: Inter;
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    margin: 0 0 0 10px;
  }
  &__distance{
    margin: 0 0.5%;
    font-family: Inter;
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    display: flex;
    align-items: center;
    color: #0083C7;
  }
}
.spec{
  &__link{
    font-family: Inter;
    font-style: normal;
    font-weight: 500;
    font-size: 25px;
    color: #0083C7;
  }
}
.date{
  &__wrapper{
    margin-left: 60%;
    display: flex;
    flex-direction: row;
  }
}

.quest{
  &__container{}
  &__spec{
    font-family: Inter;
    font-style: normal;
    font-weight: 500;
    font-size: 25px;
    color: #1D2127;
    margin: 0 0 0 15px;
  }
  &__title{
    font-family: Inter;
    font-style: normal;
    font-weight: 500;
    font-size: 30px;
    color: #1D2127;
  }
  &__body{
    font-family: Inter;
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    color:rgba(53, 60, 71, 1);
  }
  &__location{
    color: #353C47;
    font-family: Inter;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    display: flex;
    flex-direction: row;
  }
  &__count{
    font-family: Inter;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    color: #8D96A2;
  }
  &__group{
    color:$color;
    display: flex;
    flex-direction: row;
  }
  &__card{
    color:$color;
  }
}

.quest_materials{
  &__container{}
  &__title{
    font-family: Inter;
    font-style: normal;
    font-weight: 500;
    font-size: 18px;
    color: #1D2127;
    padding: 20px 0 20px 0;
  }
}
.runtime{
  &__container{
    display: flex;
    flex-direction: row;
    margin: 0 1%;
    font-family: Inter;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 130%;
    align-items: center;
    color: #353C47;
  }
  &__link{
    margin: 0 3%;
    font-family: Inter;
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    display: flex;
    align-items: center;
    color: #0083C7;
  }
}
.map{
  &__container{
    border: 1px solid black;
    margin:30px 0 20px 0;
  }
}

.price{
  &__value{
    color: #00AA5B;
  }
  &__wrapperValue{
    position: relative;
    display: flex;
    flex-direction: row;
    margin-left: 70%;
  }
  &__wrapper{
    display: flex;
    flex-direction: row;
    margin:0 0 30px 0;
  }
}

.badge{
  &__container{
    padding: 0 0 20px 0;
  }
  &__green{
    background-color: rgba(34, 204, 20, 0.1);
    color:#22CC14;
    padding: 5px;
    margin: 0 0 0 15px;
    border-radius: 5px;
  }
  &__blue{
    background-color: rgba(0, 131, 199, 0.1);
    padding: 5px;
    border-radius: 10px;
    font-family: Inter;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    align-items: center;
    color: #0083C7;
  }
  &__wrapper{}
}

.specialisation{
  &__container{}
}

.location{
  &__container{
    display: flex;
    flex-direction: row;
    margin: 25.5px 0 0 0;
  }
}
.img{
  &__container{
    display: flex;
    flex-direction: row;
    margin: 1% 1%;
  }
  &__item{
    border-radius: 6px;
    margin: 0 20px;
    width: 20%;
    height: 25%;
  }
}
.hr{
  &__line{}
}
.btn{
  &__request{
    background: #0083C7;
    border-radius: 6px;
    font-family: Inter;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    text-align: center;
    color: #FFFFFF;
  }
}
</style>
