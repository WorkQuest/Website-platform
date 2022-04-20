<template>
  <div class="insuring-page">
    <div class="insuring-page__container">
      <div class="insuring-page__header">
        <div class="title">
          {{ $t('insuring.peerToPeerInsuring') }}
        </div>
        <div class="title_sub">
          {{ $t('ui.menu.p2p.desc') }}
        </div>
      </div>
      <div class="insuring-page__content">
        <div
          v-for="(item, i) in cards"
          :key="i"
          class="info-block_pad"
        >
          <div class="info-block__name_blue">
            {{ item.name }}
          </div>
          <div class="info-block__couple">
            <div class="info-block__couple info-block_gray">
              <div class="info-block__flex">
                <div class="title">
                  {{ $t('insuring.yourFundBalance') }}
                </div>
                <div class="title_blue">
                  {{ $tc('meta.coins.count.WUSDCount', 0) }}
                </div>
                <div class="title_gray">
                  {{ $tc('meta.coins.count.dollarsCount', 0) }}
                </div>
              </div>
              <base-btn
                class="btn_bl"
                @click="openWithdrawModule()"
              >
                {{ $t('meta.withdrawal') }}
              </base-btn>
            </div>
            <div class="info-block__points info-block_gray">
              <div
                v-for="(point, idn) in item.points"
                :key="idn"
                class="info-block__point"
              >
                {{ point }}
              </div>
            </div>
          </div>
          <div class="btn-group__fifths">
            <base-btn class="btn_bl">
              {{ $t('insuring.changePlan') }}
            </base-btn>
            <base-btn class="btn_red">
              {{ $t('insuring.leaveFund') }}
            </base-btn>
          </div>
        </div>
        <div class="info-block__couple info-block_30gap">
          <div class="info-block__couple info-block_vertical">
            <div class="info-block__users">
              <div class="info-block__name">
                {{ $t('insuring.fundParticipants') }}
              </div>
              <div
                v-if="users"
                class="info-block__list"
              >
                <div
                  v-for="(user, i) in users"
                  :key="i"
                  class="user"
                >
                  <img
                    class="ava"
                    :src="user.url"
                    alt=""
                  >
                  <div class="name">
                    {{ user.name }}
                  </div>
                </div>
              </div>
            </div>
            <div class="info-block__voting">
              <div class="info-block__name">
                {{ $t('insuring.voting') }}
                <div
                  v-if="isStartVoting"
                  class="vote-stat"
                >
                  {{ $t('insuring.activeVoting') }}
                </div>
              </div>
              <button
                v-if="!isStartVoting"
                class="vot-btn"
                @click="startVoting()"
              >
                <img
                  src="~/assets/img/ui/gramophone.svg"
                  alt=""
                >
                <div class="title">
                  {{ $t('insuring.noVoteAtTheMoment') }}
                </div>
              </button>
              <template v-if="isStartVoting">
                <div class="user_gray">
                  <img
                    class="ava"
                    src="~/assets/img/temp/avatar-small.jpg"
                    alt=""
                  >
                  <div class="name">
                    {{ $tc('insuring.paymentOfInsurance', 'Cody Fisher' ) }}
                  </div>
                </div>
                <template v-if="!isVotingDone">
                  <div class="vote-quests">
                    <div class="quest-title">
                      {{ $t('insuring.youWillCertifyTheInsuredEvent') }}
                    </div>
                    <div class="quest-subtitle">
                      {{ $t('insuring.studyTheInsuredEventThoroughly') }}
                    </div>
                  </div>
                  <div class="btn-group">
                    <base-btn
                      v-for="(btn, i) in btns"
                      :key="i"
                      :data-selector="btn.name"
                      :class="btn.class"
                      @click="handleEndVoting(i)"
                    >
                      {{ btn.name }}
                    </base-btn>
                  </div>
                </template>
                <div
                  v-if="isVotingDone"
                  class="vote-results"
                >
                  <div
                    v-for="(res, i) in results"
                    :key="i"
                    class="result"
                  >
                    <div class="name">
                      {{ res.name }}
                      <div class="percs">
                        {{ $tc('meta.units.percentsCount', res.percents) }}
                      </div>
                    </div>
                    <progress
                      :class="res.class"
                      :value="res.percents"
                      max="100"
                    />
                    <div class="count">
                      {{ res.count }}
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>
          <div
            class="info-block"
            :class="{'info-block_chat' : isMobileChatOpened}"
          >
            <div class="info-block__chat-header">
              <div class="avas-cont">
                <div
                  v-for="(url, i) in user_avas"
                  :key="i"
                  class="ava-cont"
                >
                  <img
                    class="ava"
                    :src="url"
                    alt=""
                  >
                </div>
              </div>
              <div class="title">
                {{ $tc('insuring.countPeoplesInChat', users.length) }}
              </div>
              <button
                v-if="isMobileChatOpened"
                class="close-btn"
                @click="changeMobChatVisible()"
              >
                +
              </button>
            </div>
            <div
              v-if="users.length > 0"
              class="info-block__chat-cont"
            >
              <div
                v-for="(msg, i) in messages"
                :key="i"
                class="message"
              >
                <div class="message__about">
                  <div class="user">
                    <img
                      class="ava"
                      :src="msg.sender.url"
                      alt=""
                    >
                    <div class="name">
                      {{ msg.sender.name }}
                    </div>
                  </div>
                  <div class="message__time">
                    {{ msg.time }}
                  </div>
                </div>
                <div class="message__content">
                  {{ msg.text }}
                </div>
              </div>
            </div>
            <div class="btn-cont">
              <base-btn
                class="btn_bl"
                data-selector="OPEN-CHAT"
                @click="changeMobChatVisible()"
              >
                Open chat
              </base-btn>
            </div>
            <div class="info-block__chat-footer">
              <div class="info-block__footer-bar">
                <button class="icon-link" />
                <input
                  type="text"
                  class="message-inp"
                  :placeholder="$t('insuring.writeSomething')"
                >
                <button class="icon-send" />
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

export default {
  data() {
    return {
      isMobileChatOpened: false,
      points: [
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luctus venenatis, lectus magna fringilla urna, porttitor',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luctus venenatis, lectus magna fringilla urna, porttitor',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luctus venenatis, lectus magna fringilla urna, porttitor',
      ],
      cards: [
        {
          name: this.$t('insuring.minimalProtectionPlan'),
          points: [
            this.$tc('insuring.planPoints.point1', 1000),
            this.$tc('insuring.planPoints.point2', 833.333333),
            this.$tc('insuring.planPoints.point3', 1),
            this.$tc('insuring.planPoints.point4', 10),
          ],
        },
        {
          name: this.$t('insuring.standardProtectionPlan'),
          points: [
            this.$tc('insuring.planPoints.point1', 2000),
            this.$tc('insuring.planPoints.point2', 1666.6667),
            this.$tc('insuring.planPoints.point3', 1),
            this.$tc('insuring.planPoints.point4', 10),
          ],
        },
        {
          name: this.$t('insuring.maximumProtectionPlan'),
          points: [
            this.$tc('insuring.planPoints.point1', 3000),
            this.$tc('insuring.planPoints.point2', 2500),
            this.$tc('insuring.planPoints.point3', 1),
            this.$tc('insuring.planPoints.point4', 10),
          ],
        },
      ],
      users: [],
      messages: [
        {
          sender: {
            name: 'Cody Fisher',
            url: require('~/assets/img/temp/avatar-small.jpg'),
          },
          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luctus venenatis, lectus magna fringilla urna, porttitor',
          time: '12.23',
        },
        {
          sender: {
            name: 'Cody Fisher',
            url: require('~/assets/img/temp/avatar-small.jpg'),
          },
          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luctus venenatis, lectus magna fringilla urna, porttitor',
          time: '12.23',
        },
        {
          sender: {
            name: 'Cody Fisher',
            url: require('~/assets/img/temp/avatar-small.jpg'),
          },
          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luctus venenatis, lectus magna fringilla urna, porttitor',
          time: '12.23',
        },
        {
          sender: {
            name: 'Cody Fisher',
            url: require('~/assets/img/temp/avatar-small.jpg'),
          },
          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luctus venenatis, lectus magna fringilla urna, porttitor',
          time: '12.23',
        },
        {
          sender: {
            name: 'Cody Fisher',
            url: require('~/assets/img/temp/avatar-small.jpg'),
          },
          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luctus venenatis, lectus magna fringilla urna, porttitor',
          time: '12.23',
        },
        {
          sender: {
            name: 'Cody Fisher',
            url: require('~/assets/img/temp/avatar-small.jpg'),
          },
          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luctus venenatis, lectus magna fringilla urna, porttitor',
          time: '12.23',
        },
      ],
      isStartVoting: false,
      isVotingDone: false,
      btns: [
        {
          name: this.$t('meta.btns.disagree'),
          class: 'btn_red',
        },
        {
          name: this.$t('insuring.insuredEvent'),
          class: 'btn',
        },
        {
          name: this.$t('meta.btns.agree'),
          class: 'btn_bl',
        },
      ],
      results: [
        {
          name: this.$t('meta.btns.agree'),
          percents: 75,
          count: this.$tc('meta.units.votesCount', 10),
          class: 'progress-green',
        },
        {
          name: this.$t('meta.btns.disagree'),
          percents: 20,
          count: this.$tc('meta.units.votesCount', 10),
          class: 'progress-red',
        },
      ],
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
    }),
    user_avas() {
      return this.users.map((user) => user.url).splice(0, 5);
    },
  },
  async mounted() {
    this.SetLoader(true);
    this.SetLoader(false);
  },
  methods: {
    openWithdrawModule() {
      this.ShowModal({
        key: modals.withdraw,
      });
    },
    startVoting() {
      this.isStartVoting = true;
    },
    handleEndVoting(i) {
      if (i === 1) {
        this.ShowModal({
          key: modals.insureCase,
        });
        return;
      }
      this.isVotingDone = true;
    },
    changeMobChatVisible() {
      this.isMobileChatOpened = !this.isMobileChatOpened;

      document.body.style.overflow = this.isMobileChatOpened ? 'hidden' : 'auto';
    },
  },
};
</script>

<style lang="scss" scoped>
.insuring-page {
  background: linear-gradient(to bottom, #103D7C 376px, #f6f8fa 376px);
  display: flex;
  justify-content: center;

  &__container {
    display: grid;
    grid-template-rows: auto max-content;
    max-width: 1180px;
    grid-row-gap: 30px;
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
  }

  &__header {
    align-self: flex-end;

    .title {
      font-weight: 500;
      color: #FFF;
      max-width: 530px;
      font-size: 45px;
      line-height: 110%;
      margin: 0 0 24px;

      &_sub {
        @extend .title;
        font-size: 16px;
        line-height: 100%;
        opacity: 0.5;
      }
    }
  }

  &__content {
    display: grid;
    grid-row-gap: 30px;
    width: 100%;

    .btn-group {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;

      &__fifths {
        @extend .btn-group;
        grid-template-columns: repeat(5, 1fr);
        direction: rtl;
      }

      &_exp {
        @extend .btn-group;
        width: calc(100% - 20px);
      }
    }

    .btn {
      box-sizing: border-box;
      font-weight: 400;
      font-size: 16px;
      color: #0083C7;
      border: 1px solid #0083C71A;
      background-color: #fff;
      border-radius: 6px;
      transition: .3s;
      width: 100%;
      margin: 0;

      &:hover {
        background-color: #0083C71A;
        border: 0px;
      }

      &_bl {
        @extend .btn;
        background-color: #0083C7;
        border: unset;
        color: #fff;

        &:hover {
          background-color: #103d7c;
        }
      }

      &_red {
        @extend .btn;
        background-color: #DF3333;
        border: unset;
        color: #fff;

        &:hover {
          background-color: #103d7c;
        }
      }
    }

    .vote-results {
      margin-top: 10px;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      height: 176px;

      .result {

        .name {
          display: flex;
          color: #353C47;
          font-weight: 400;
          font-size: 16px;
          justify-content: space-between;

          .percs {
            color: #7C838D;
            font-weight: 500;
            font-size: 14px;
          }
        }

        .progress-green {
          width: 100%;
          height: 6px;
          border-radius: 4px;
          background-color: #00AA5B;
          margin: 7px 0;

          &::-moz-progress-bar,
          &::-webkit-progress-value {
            background: #00AA5B;
          }
        }

        .progress-red {
          width: 100%;
          height: 6px;
          border-radius: 4px;
          background-color: #DF3333;
          margin: 7px 0;

          &::-moz-progress-bar,
          &::-webkit-progress-value {
            background: #DF3333;
          }
        }

        .count {
          color: #AAB0B9;
          font-weight: 400;
          font-size: 14px;
        }
      }
    }

    .vote-quests {
      height: 123px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-evenly;
      margin: 10px 0;

      .quest-title {
        color: #000;
        font-weight: 400;
        font-size: 25px;
      }

      .quest-subtitle {
        color: #AAB0B9;
        font-weight: 400;
        font-size: 14px;
      }
    }

    .user {
      display: grid;
      grid-template-columns: 40px auto;
      gap: 15px;
      align-items: center;

      .ava {
        height: 40px;
        width: 40px;
        border-radius: 50%;
      }

      .name {
        font-weight: 400;
        font-size: 16px;
        color: #7C838D;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      &_gray {
        @extend .user;
        grid-template-columns: 25px auto;
        background-color: $black0;
        border-radius: 5px;
        height: 42px;
        width: 100%;
        padding: 0 10px;

        .ava {
          height: 25px;
          width:  25px;
        }
      }
    }

    .info-block {
      background-color: #fff;
      border-radius: 6px;

      &__chat-cont {
        max-height: 569px;
        height: calc(100% - 131px);
        padding: 10px 20px;
        overflow: auto;
        display: grid;
        grid-template-rows: auto;
        gap: 20px;

        .message {
          padding: 13px;
          background-color: $black0;
          border-radius: 5px;

          &__content {
            color: #353C47;
            font-size: 16px;
            font-weight: 400;
          }

          &__time {
            color: #AAB0B9;
            font-size: 12px;
            font-weight: 400;
            text-align: right;
          }

          &__about {
            display: grid;
            grid-template-columns: repeat(2, auto);
            gap: 10px;
            align-items: center;
            margin-bottom: 10px;

            .user {
              grid-template-columns: 25px auto;
              gap: 9px;

              .name {
                font-size: 14px;
                color: #4C5767;
              }

              .ava {
                width: 25px;
                height: 25px;
              }
            }
          }
        }

        .btn_bl {
          display: none;
        }
      }

      .btn-cont {
        display: none;
      }

      &__chat-footer {
        height: 66px;
        border-top: 1px solid #E9EDF2;
        padding: 10px 20px;
        box-sizing: border-box;
      }

      &__footer-bar {
        border-radius: 6px;
        background-color: $black0;
        height: 46px;
        padding: 11px 20px 11px 15px;
        display: grid;
        grid-template-columns: 24px auto 22px;
        align-items: center;
        gap: 12px;

        .message-inp {
          padding: 0;
          border: 0;
          background-color: $black0;
          width: 100%;
        }

        .icon-link {
          font-size: 24px;
          margin-top: 2px;

          &:before {
            color: #0083C7;
          }
        }

        .icon-send {
          font-size: 22px;

          &:before {
            color: #0083C7;
          }
        }
      }

      &__chat-header {
        height: 65px;
        border-bottom: 1px solid #E9EDF2;
        padding: 20px;
        box-sizing: border-box;
        display: grid;
        grid-template-columns: min-content auto;
        align-items: center;
        gap: 15px;

        .avas-cont {
          display: flex;
          position: relative;
          height: 25px;

          .ava-cont {
            width: 18px;

            .ava {
              width: 25px;
              height: 25px;
              border-radius: 50%;
              position: absolute;
            }
          }
        }
      }

      .title {
        color: #4C5767;
        font-weight: 400;
        font-size: 14px;

        &_blue {
          color: #0083C7;
          font-weight: 700;
          font-size: 25px;
        }

        &_gray {
          color: #AAB0B9;
          font-weight: 500;
          font-size: 16px;
        }
      }

      &__flex {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }

      &__couple {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;

        >.btn {
          align-self: flex-end;
          width: 80%;
          margin-left: 20%;
        }
      }

      &__users {
        @extend .info-block;
        padding: 20px 0 20px 20px;
      }

      &__list {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
        overflow-y: auto;
        max-height: 220px;
        padding-right: 20px;
      }

      &__voting {
        @extend .info-block;
        padding: 20px;

        .vot-btn {
          text-align: center;
          display: flex;
          flex-direction: column;
          width: 100%;
          align-items: center;
          height: 228px;
          justify-content: center;
          gap: 5px;
        }

        .title {
          font-weight: 400;
          font-size: 14px;
          color: #D8DFE3;
          max-width: 100px;
        }
      }

      &_30gap {
        gap: 30px;

        .info-block {
          max-height: 655px;
        }
      }

      &_vertical {
        grid-template-rows: repeat(2, 1fr);
        grid-template-columns: unset;
        gap: 30px;
      }

      &_gray {
        background-color: $black0;
        padding: 15px;
        border-radius: 5px;
      }

      &_pad {
        @extend .info-block;
        padding: 20px;
        display: grid;
        gap: 20px;
        grid-template-rows: repeat(3, auto);
      }

      &__point {
        font-weight: 400;
        font-size: 16px;
        color: #7C838D;
        position: relative;
        padding-left: 17px;
        line-height: 1;

        &:before {
          content: "";
          height: 7px;
          width: 7px;
          position: absolute;
          border-radius: 50%;
          left: 0;
          top: 5px;
          background-color: #0083C7;
        }
      }

      &__points {
        display: grid;
        grid-template-rows: auto;
        gap: 10px;
      }

      &__triple {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
      }

      &__third {
        @extend .info-block;
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 30px;
      }

      &__name {
        font-size: 16px;
        color: #1D2127;
        padding: 0 0 20px 0;
        font-weight: 400;
        position: relative;

        .vote-stat {
          color: #00AA5B;
          font-weight: 400;
          font-size: 14px;
          position: absolute;
          right: 20px;
          top: 2px;
        }

        &_bold {
          font-weight: 500;
          font-size: 25px;
          color: #103D7C;
          line-height: 1;
          padding: 20px;
        }

        &_blue {
          font-weight: 600;
          font-size: 25px;
          color: #0083C7;
          line-height: 1;
        }
      }
    }
  }

  @include _991 {
    &__content {
      .info-block {
        &_30gap {
            .info-block {
              max-height: 700px;
              &__couple {
                grid-template-rows: repeat(2, auto);
              }
            }
        }
        &__voting {
          .btn-group {
            grid-template-columns: repeat(2, 1fr);
            grid-template-rows: repeat(2, 1fr);

            .btn {
              grid-column-start: 1;
              grid-column-end: 3;
            }

            .btn_red {
              grid-row-start: 1;
              grid-row-end: 2;
              grid-column-start: 1;
              grid-column-end: 2;
            }

            .btn_bl {
              grid-row-start: 1;
              grid-row-end: 2;
              grid-column-start: 2;
              grid-column-end: 3;
            }
          }
          .quest-title {
            font-size: 20px;
          }
        }
      }
    }
  }

  @include _767 {
    &__container {
      grid-template-rows: auto auto;
      gap: 24px;
    }
    &__header {
      .title {
        font-size: 38px;
        margin-bottom: 15px;
        width: 100%;
        &_sub {
          font-size: 16px;
          max-width: 400px;
        }
      }
    }
    &__content {
      .info-block {
        &__couple {
            grid-template-rows: repeat(2, auto);
            grid-template-columns: unset;
          }
        &_pad {
          .info-block__couple {
            .info-block__couple {
              max-height: 209px;
              grid-template-columns: unset;
              grid-template-rows: 116px 43px;

              .btn_bl {
                width: 100%;
                margin: 0;
              }
            }
          }
        }
        &__points {
          height: fit-content;
        }
        &__list {
          grid-template-columns: repeat(3, 1fr);
        }
        &__voting {
          .quest-title {
            font-size: 25px;
          }
        }
        &__chat-cont {
          display: none;
        }
        .btn-cont {
          display: block;
          padding: 20px;
          background-color: #fff;
        }
        &__chat-footer {
          display: none;
        }
        &_chat {
          position: fixed;
          height: 100vh;
          max-height: unset;
          left: 0;
          top: 71px;

          .btn-cont {
            display: none;
          }

          .info-block__chat-header {
            position: relative;

            .close-btn {
              position: absolute;
              right: 20px;
              transform: rotate(45deg);
              font-size: 30px;
              color: #0083C7;
            }
          }

          .info-block__chat-cont {
            display: grid;
            height: calc(100% - 181px);
          }

          .info-block__chat-footer {
            display: block;
          }
        }
      }
      .btn-group__fifths {
        grid-template-columns: repeat(4, 1fr);
      }
    }
  }

  @include _575 {
    &__content {
      .info-block {
        &__couple {
          grid-template-rows: repeat(2, auto);
          grid-template-columns: unset;
        }
        &__list {
          grid-template-columns: repeat(2, 1fr);
          .user {
            grid-template-columns: 35px auto;
            .ava {
              height: 35px;
              width: 35px;
            }
            .name {
              font-size: 14px;
            }
          }
        }
        &__voting {
          .quest-title {
            font-size: 20px;
          }
        }
      }
      .btn-group__fifths {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  }
}
</style>
