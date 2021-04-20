<template>
  <!-- Quest page_User -->
  <div class="container">
    <div class="user__top">
      <div class="user__container">
        <img
          class="user__img"
          src="https://media.pn.am/media/issue/197/297/photo/197297.jpg"
        >
        <p class="user__username">
          Samantha Sparcs
        </p>
        <p class="user__date">
          12 January 2021,14:45
        </p>
        <p>share icon</p>
        <div class="location__container">
          <p class="quest__location">
            Moscow, Lenina street, 3
          </p>
          <a
            class="user__distance"
            href=""
          >
            200m from you
          </a>
          <div class="runtime__container">
            <p>Runtime</p>
            <a>
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
      <h2>Paint the garage quickly</h2>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luctus venenatis, lectus magna fringilla urna, porttitor rhoncus dolor purus non enim praesent elementum facilisis leo, vel fringilla est ullamcorper eget nulla facilisi etiam dignissim diam quis enim lobortis scelerisque fermentum dui faucibus in ornare quam viverra orci sagittis eu volutpat odio facilisis mauris sit amet massa vitae tortor condimentum lacinia quis vel eros donec ac odio tempor orci dapibus ultrices in iaculis nunc sed augue lacus, viverra vitae congue eu, consequat ac felis donec et odio pellentesque diam volutpat commodo sed egestas egestas fringilla phasellus faucibus Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luctus venenatis, lectus magna fringilla urna, porttitor rhoncus dolor purus non enim praesent elementum facilisis leo, vel fringilla est ullamcorper eget nulla facilisi etiam dignissim diam quis enim lobortis scelerisque fermentum dui faucibus in ornare quam viverra orci sagittis eu volutpat odio facilisis mauris sit amet massa vitae tortor condimentum lacinia quis vel eros donec ac odio tempor orci dapibus ultrices in iaculis nunc sed augue lacus, viverra vitae congue eu, consequat ac felis donec et odio pellentesque diam volutpat commodo sed egestas egestas fringilla phasellus faucibus</p>
    </div>
    <div class="quest_materials__container">
      <h2>Quest materials</h2>
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
      <b-btn>Send a request</b-btn>
      <p class="price__value">
        1500  WUSD
      </p>
      <span class="badge__green">Low priority</span>
    </div>
    <div class="map__container">
      <h2>Контейнер для карты</h2>
    </div>
    <div class="specialisation__container">
      <div class="quest__group">
        <h3>Other quests for the specialization</h3>
        <a>Painting Works</a>
      </div>
      <p class="quest__count">
        26 quests
      </p>
      <div class="quest__card">
        <!-- Карточки квестов -->
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

.user{
  &__top{
    border: 1px solid black;
    background-color: $bg-color;
  }
  &__container{
    border: 1px solid black;
    background-color: $bg-color;
  }
  &__date{
    color:$color;
  }
  &__img{
    width:30px;
    height: 30px;
    border-radius: 50%;
  }
  &__username{
    color:$color;
  }
  &__distance{
    color:$color;
  }
}

.quest{
  &__container{
    border: 1px solid black;
    background-color: $bg-color;
  }
  &__location{
    color:$color;
  }
  &__count{
    color:$color;
  }
  &__group{
    color:$color;
  }
  &__card{
    color:$color;
  }
}

.quest_materials{
  &__container{
    border: 1px solid black;
    background-color: $bg-color;
  }
}

.map{
  &__container{
    border: 1px solid black;
    background-color: $bg-color;
  }
}

.price{
  &__value{
    color: #00AA5B;
  }
}

.badge{
  &__container{
    border: 1px solid black;
    background-color: $bg-color;
  }
  &__green{
    background-color: rgba(34, 204, 20, 0.1);
    color:#22CC14;
    padding: 5px;
    border-radius: 5px;
  }
  &__blue{
    background-color: rgba(0, 131, 199, 0.1);
    color: #0083C7;
    padding: 5px;
    border-radius: 10px;
  }
}

.specialisation{
  &__container{
    border: 1px solid black;
    background-color: $bg-color;
  }
}

.location{
  &__container{
    border: 1px solid black;
    background-color: $bg-color;
  }
}
.img{
  &__container{
    display: flex;
    flex-direction: row;
  }
  &__item{
    border-radius: 6px;
    margin: 0 20px;
    width: 200px;
    height: 200px;
  }
}
</style>
