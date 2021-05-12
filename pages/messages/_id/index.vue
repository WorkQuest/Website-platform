<template>
  <div class="main">
    <div class="main__body">
      <h2 class="page__title">
        Messages
      </h2>
      <div class="chat__body">
        <div class="chat__header">
          <div class="chat__title">
            <span
              class="icon-short_left"
              @click="showDetails()"
            />
            Chat
          </div>
        </div>
        Messages
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Messages',
  data() {
    return {};
  },
  async mounted() {
    this.SetLoader(true);
    this.SetLoader(false);
  },
  methods: {
    showDetails() {
      this.$router.push('/messages');
    },
  },
};
</script>

<style lang="scss" scoped>

.icon-short_left::before {
  content: "\ea6d";
  color: $black800;
  font-size: 20px;
  cursor: pointer;
}

.params {

}

.you {
  margin: 0 0 20px 0;
  &__row {
    display: flex;
    flex-direction: row;
    margin: 14.5px 0 0 30px;
  }
  &__message {
    font-weight: 400;
    font-size: 16px;
    color: $black500;
  }
}

.quest {
  &__row {
    display: flex;
    flex-direction: row;
    margin: 14.5px 0 0 30px;
  }
  &__title {
    color: $blue;
    font-size: 16px;
    font-weight: 500;
  }
}

.profile {
  &__img {
    width: 100%;
    height: 100%;
    max-height: 30px;
    max-width: 30px;
    border-radius: 84px;
  }
  &__name {
    color: $black800;
    font-size:16px;
    font-weight: 500;
    margin: 0 10px 0 10px;
  }
  &__company {
    color: $black500;
    font-size: 16px;
    font-weight: 400;
  }
}
.avatar {
  &__row {
    display: flex;
    flex-direction: row;
    margin: 20px 0 0 30px;
  }
}
.main {
  @include main;
  &-white {
    @include main-white;
    justify-content: start;
    border-radius: 6px;
  }
}
.chat {
  &__header {
    border: 1px solid #E9EDF2;
    border-radius: 6px 0 0 0;
  }
  &__title {
    background-color: $white;
    margin: 15px 0 15px 15px;
    align-items: center;
    justify-content: center;
  }
  &__body {
    background-color: $white;
    border: 1px solid #E9EDF2;
    border-radius: 6px;
    width: 100%;
    max-width: 1180px;
    height: 100%;
    max-height: 852px;
  }
  &__cards {}
  &__card {
    border: 1px solid #E9EDF2;
    cursor: pointer;
  }
}
.page {
  &__title {
    margin: 20px 0 20px 0;
  }
}
</style>
