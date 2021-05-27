<template>
  <div class="template">
    <div class="template__container">
      <div class="template__body">
        <div class="body__header">
          <div class="header__title">
            Invite friends.
            <br />
            Earn crypto together
          </div>
          <div class="header__title_sub">
            Earn up to 35$ in WQT every time your friends register and make first Quest on Work Quest platform.
          </div>
        </div>
        <div class="body__content">
          <div class="info-block_couple">
            <div class="info-block">
              <div class="info-block__name">Referral reward</div>
              <div class="info-block__tokens">0 WQT</div>
              <div class="info-block__name">Last ref reward</div>
              <div class="user_last-reward">
                <div class="user__info">
                  <img />
                  <div>Edward Cooper Edward Cooper Edward CooperEdward Cooper Edward CooperEdward CooperEdward CooperEdward Cooper</div>
                </div>
                <div class="user__value_green">+ 12WQT</div>

              </div>
            </div>
            <div class="info-block">
              <div class="info-block__name">Your refers</div>
              <div class="info-block__refers">
                <div class="info-block__avatar">
                  <img src="~/assets/img/social/FACEBOOK.png"/>
                </div>
                <div class="info-block__avatar">
                  <img src="~/assets/img/social/TWITTER.png"/>
                </div>
                <div class="info-block__avatar">
                  <img src="~/assets/img/social/GOOGLE_+_.png"/>
                </div>
                <div class="info-block__avatar">
                  <div class="info-block__more">+ 17</div>
                </div>
              </div>
              <div class="info-block__name">Your referral link</div>
              <a href="#" class="info-block__link">
                <div>https://www.workquest.com/ref?v=44T7iUSo1vU</div>
                <svg viewBox="0 0 21 22" fill="none">
                  <path d="M12.9992 20.9999H2.99922C2.46329 21.0186 1.94369 20.8138 1.5645 20.4347C1.18532 20.0555 0.980591 19.5359 0.999215 18.9999V8.99995C0.980591 8.46402 1.18532 7.94442 1.5645 7.56524C1.94369 7.18605 2.46329 6.98132 2.99922 6.99995H6.99922V2.99995C6.98059 2.46402 7.18532 1.94442 7.5645 1.56524C7.94369 1.18605 8.46329 0.981324 8.99922 0.999948H18.9992C19.5351 0.981324 20.0547 1.18605 20.4339 1.56524C20.8131 1.94442 21.0178 2.46402 20.9992 2.99995V12.9999C21.0175 13.5358 20.8127 14.0552 20.4336 14.4343C20.0545 14.8134 19.5351 15.0183 18.9992 14.9999H14.9992V18.9999C15.0175 19.5358 14.8127 20.0552 14.4336 20.4343C14.0545 20.8134 13.5351 21.0183 12.9992 20.9999ZM2.99922 8.99995V18.9999H12.9992V14.9999H8.99922C8.46337 15.0183 7.94395 14.8134 7.56483 14.4343C7.18572 14.0552 6.98089 13.5358 6.99922 12.9999V8.99995H2.99922ZM8.99922 2.99995V12.9999H18.9992V2.99995H8.99922Z"/>
                </svg>

              </a>
            </div>
          </div>
          <div class="info-block">
            <div class="info-block__name_bold">How to invite your friends?</div>
            <div class="info-block__steps">
              <div class="step">
                <div>Get Link</div>
                <div>Register and generate referral links with a commission kickback rate.</div>
              </div>
              <div class="step">
                <div>Invite Friends</div>
                <div>Invite your friends to register through the referral link and get rewards when they complete first Quest.</div>
              </div>
              <div class="step">
                <div>Earn Crypto</div>
                <div>Every time your friends make a first Quest, you'll get up to $35 in WQT commission in real time!</div>
              </div>
            </div>
          </div>
          <div class="info-block">
            <div class="info-block__name">History of rewards</div>
            <div class="info-block__table">
              <div class="table__head">
                <div>Name</div>
                <div>User ID</div>
                <div>Tx hash</div>
                <div>Time</div>
                <div>Amount</div>
                <div>Status</div>
              </div>
              <div class="table__rows">
                <div class="user">
                  <div class="user__info">
                    <img />
                    <div>Edward Cooper</div>
                  </div>
                  <div class="user__value_gray">455dad66544ss</div>
                  <div class="user__value_gray">sf998s...ss877d</div>
                  <div class="user__value_gray">Feb 1, 2021</div>
                  <div class="user__value">12 WQT</div>
                  <div class="user__value_green">Success</div>
                </div>
                <div class="user">
                  <div class="user__info">
                    <img />
                    <div>Edward Cooper</div>
                  </div>
                  <div class="user__value_gray">455dad66544ss</div>
                  <div class="user__value_gray">sf998s...ss877d</div>
                  <div class="user__value_gray">Feb 1, 2021</div>
                  <div class="user__value">12 WQT</div>
                  <div class="user__value_green">Success</div>
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
export default {
  name: 'Referral',
};
</script>

<style lang="scss" scoped>
.template {
  &__container {
    height: 100vh;
    overflow: auto;
    position: relative;
    background: linear-gradient(to bottom, #103D7C 370px, #dcdcdc 370px);
  }
  &__body {
    display: grid;
    grid-template-rows: 225px max-content;
    min-width: 600px;
    max-width: 1200px;
    text-align: left;
    grid-row-gap: 30px;
    position: absolute;
    margin: auto;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    .body {
      &__header {
        align-self: center;
        .header {
          width: 450px;
          font-weight: 500;
          color: #FFF;
          &__title {
            @extend .header;
            font-size: 45px;
            line-height: 110%;
            margin: 0 0 16px;
            &_sub {
              @extend .header;
              font-size: 16px;
              line-height: 100%;
              opacity: 0.5;
            }
          }
        }
      }
      &__content {
        display: grid;
        grid-row-gap: 30px;
        grid-template-rows: 225px max-content max-content;
        .info-block {
          background-color: #fff;
          border-radius: 6px;
          &__tokens {
            font-weight: bold;
            font-size: 25px;
            color: #0083C7;
            padding: 0 20px;
          }
          &__name {
            font-size: 16px;
            color: #1D2127;
            padding: 20px 20px 10px 20px;
            font-weight: 400;
            &_bold {
              font-weight: 500;
              font-size: 25px;
              color: #103D7C;
              line-height: 1;
              padding: 20px;
            }
          }
          .user {
            display: grid;
            grid-template-columns: repeat(6, 1fr);
            gap: 10px;
            width: calc(100% - 40px);
            margin: 0 0 0 20px;
            line-height: 33px;
            &__info {
              display: grid;
              grid-template-columns: 33px 1fr;
              align-items: center;
              gap: 10px;
              div {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                font-size: 16px;
              }
              img {
                height: 33px;
                width: 33px;
                border-radius: 50%;
                background-color: #fff;
                flex: none;
              }
            }
            &__value {
              font-size: 16px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              font-weight: 500;
              &_green {
                color: #00AA5B;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
              &_gray {
                color: #7C838D;
                font-weight: 400;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
            }
            &_last-reward {
              display: grid;
              background-color: #F7F8FA;
              border-radius: 5px;
              height: 50px;
              line-height: 50px;
              width: calc(100% - 40px);
              margin-left: 20px;
              padding: 0 10px;
              flex-wrap: wrap;
              gap: 10px;
              grid-template-columns: 5fr auto;
            }
          }
          &__refers {
            display: flex;
            flex-wrap: wrap;
            margin-bottom: 4px;
            width: calc(100% - 40px);
            margin-left: 20px;
            height: 33px;
            position: relative;
          }
          &__avatar {
            width: 25px;
            img {
              position: absolute;
              height: 33px;
              width: 33px;
              border-radius: 50%;
            }
          }
          &__more {
            position: absolute;
            height: 33px;
            width: 53px;
            border-radius: 39px;
            background-color: #F7F8FA;
            text-align: center;
            line-height: 33px;
          }
          &__link {
            height: 46px;
            border: 1px solid #F7F8FA;
            border-radius: 6px;
            width: calc(100% - 40px);
            margin-left: 20px;
            display: flex;
            align-items: center;
            div {
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              font-size: 16px;
              color: #1D2127;
              flex-basis: calc(100% - 60px);
              margin-left: 20px;
            }
            svg {
              display: inline-block;
              vertical-align: top;
              width: 20px;
              fill: #0083C7;
            }
          }
          &__steps {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            grid-gap: 60px;
            position: relative;
            width: calc(100% - 40px);
            margin: 0 0 20px 20px;
            .step {
              position: relative;
              background-color: #F7F8FA;
              border-radius: 6px;
              z-index: 2;
              div {
                &:first-child {
                  font-weight: 500;
                  font-size: 18px;
                  color: #0083C7;
                  padding: 10px;
                }
                &:last-child {
                  font-size: 16px;
                  color: #7C838D;
                  padding: 0 10px 10px;
                }
              }
              &:not(:last-child) {
                &:after {
                  content: "";
                  height: 12px;
                  width: 12px;
                  border-radius: 50%;
                  z-index: 3;
                  background-color: #D8DFE3;
                  position: absolute;
                  right: -5px;
                  top: calc(50% - 5px);
                }
              }
              &:not(:first-child) {
                &:before {
                  content: "";
                  height: 12px;
                  width: 12px;
                  border-radius: 50%;
                  z-index: 3;
                  background-color: #D8DFE3;
                  position: absolute;
                  left: -5px;
                  top: calc(50% - 5px);
                }
              }
            }
            &:after {
              content: "";
              position: absolute;
              height: 2px;
              width: 100%;
              top: 50%;
              background-color: #D8DFE3;
            }
          }
          &__table {
            .table {
              &__head {
                height: 27px;
                align-items: center;
                background-color: rgba(0, 131, 199, 0.1);
                display: grid;
                grid-template-columns: repeat(6, 1fr);
                padding: 0 20px;
                margin-bottom: 10px;
                grid-gap: 10px;
                font-size: 12px;
                color: #0083C7;
              }
              &__rows {
                display: grid;
                grid-auto-rows: 33px;
                grid-row-gap: 20px;
                padding-bottom: 20px;
              }
            }
          }
          &_couple {
            display: grid;
            grid-template-columns: repeat(2, calc(50% - 10px));
            grid-column-gap: 20px;
          }
        }
      }
    }
  }
}
</style>
