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
          <div class="chat__messages">
            <div class="chat__message">
              <div>
                <div class="row__container">
                  <div class="chat__img-container">
                    <img
                      class="chat__img"
                      src="~/assets/img/temp/profile.svg"
                    >
                  </div>
                  <div class="chat__name-container">
                    <div class="chat__name">
                      Samantha Sparcs
                    </div>
                    <div class="chat__star">
                      Star
                    </div>
                  </div>
                </div>
                <div class="message__body_interlocutor">
                  <span class="message__body">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luctus venenatis, lectus magna fringilla urna, porttitor rhoncus dolor purus non enim praesent elementum facilisis leo, vel fringilla est ullamcorper eget nulla facilisi etiam dignissim Lorem ipsum dolor sit amet, consectetur adipiscing
                  </span>
                  <div class="message__time">
                    14:23
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="chat__panel">
          <button class="chat__btn">
            1
          </button>
          <base-field
            v-model="facebook_input"
            :placeholder="'Write you message'"
          />
          <button class="chat__btn">
            1
          </button>
        </div>
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

.row {
  &__container {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
}

.message {
  &__body {}
  &__time {
    margin: 15px 15px 0 15px;
    padding: 0 0 10px 0;
    text-align: right;
  }
  &__body_interlocutor {
    background-color:#0083C7;
    margin: 0 54px 0 60px;
    border-radius: 6px;
    color: $white;
    padding: 15px;
  }
  &__body_you {

  }
}

.icon-short_left::before {
  content: "\ea6d";
  color: $black800;
  font-size: 20px;
  cursor: pointer;
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
  &__btn {
    background-color: $black0;
    border-radius: 6px;
    width: 100%;
    height: 100%;
    max-width:40px;
    max-height: 40px;
  }
  &__panel {
    height: 100%;
    max-height: 70px;
    display: grid;
    grid-template-columns: 5% 90% 5%;
    align-items: center;
  }
  &__name-container {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
  }
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
  &__message {
    cursor: pointer;
    margin: 0 0 20px 0;
  }
  &__messages {
    overflow-y: scroll;
    height: 100%;
    width: 100%;
    max-height: 795px;
  }
  &__img-container {}
  &__img {
    width: 100%;
    height: 100%;
    max-height: 30px;
    max-width: 30px;
    border-radius: 84px;
    margin: 10px 10px 10px 20px;
  }
  &__name {}
  &__star {
    margin: 0 20px 0 0;
  }
}
.page {
  &__title {
    margin: 20px 0 20px 0;
  }
}
</style>
