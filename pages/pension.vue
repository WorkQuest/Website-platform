<template>
  <div className="referral-page">
    <div className="referral-page__container">
      <div className="referral-page__header">
        <div className="title">
          {{ $t('pension.pensionProgram') }}
        </div>
        <div className="title_sub">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luctus venenatis, lectus
          magna fringilla urna, porttitor rhoncus dolor purus non enim
        </div>
      </div>
      <div className="referral-page__content">
        <div className="info-block__square">
          <div className="info-block__quarter">
            <div className="info-block__title">6.5%</div>
            <div className="info-block__subtitle">annual percent</div>
          </div>
          <div className="info-block__quarter">
            <div className="info-block__title">Optional</div>
            <div className="info-block__subtitle">optional first deposit</div>
          </div>
          <div className="info-block__quarter">
            <div className="info-block__title">3 years</div>
            <div className="info-block__subtitle">term</div>
          </div>
          <div className="info-block__quarter">
            <div className="info-block__title">Castomizable</div>
            <div className="info-block__subtitle">deposits from quest</div>
          </div>
        </div>
        <div className="info-block">
          <div className="info-block__name_bold">How to take part in pension program?</div>
          <div className="info-block__about">
            <div className="info-block__subtitle">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean id
              nunc ac arcu viverra. Aliquet egestas suspendisse id pellentesque lacus. Ut accumsan posuere viverra
              hendrerit. Lacus volutpat id aliquam accumsan cras. Magna consectetur id sollicitudin sed eget nisl nunc.
              Quis sagittis sodales volutpat sed.
            </div>
            <img
              className="calendar-img"
              src="~/assets/img/ui/calendar.svg"
              alt=""
            />
            <div className="btn-group">
              <button className="btn_bl">Apply for a pension</button>
            </div>
          </div>
        </div>
        <div className="info-block">
          <div className="info-block__name_bold">Information</div>
          <div className="document">
            <img
              className="document__img"
              src="~/assets/img/ui/pdf.svg"
              alt=""
            />
            <div className="document__name">
              Some_documentSome_documentSome_documentSome_documentSome_documentSome_documentSome_documentSome_documentSome_documentSome_document.pdf
              <div className="document__size">1.2 MB</div>
            </div>
            <button className="btn__doc">
              Download
              <img
                className="download"
                src="~/assets/img/ui/download.svg"
                alt=""
              />
            </button>
          </div>
          <div className="document">
            <img
              className="document__img"
              src="~/assets/img/ui/pdf.svg"
              alt=""
            />
            <div className="document__name">
              Some_documentSome_documentSome_documentSome_documentSome_documentSome_documentSome_documentSome_documentSome_documentSome_document.pdf
              <div className="document__size">1.2 MB</div>
            </div>
            <button className="btn__doc">
              Download
              <img
                className="download"
                src="~/assets/img/ui/download.svg"
                alt=""
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      referLink: 'https://www.workquest.com/ref?v=44T7iUSo1vU',
      items: [
        {
          userName: 'Edward Cooper',
          avaUrl: '~/assets/img/social/GOOGLE_+_.png',
          userID: '455dad66544ss',
          txHash: 'sf998s...ss877d',
          time: 'Feb 1, 2021',
          amount: this.$tc('referral.wqtCount', 12),
          status: 'Success',
        },
        {
          userName: 'Edward Cooper',
          avaUrl: '~/assets/img/social/GOOGLE_+_.png',
          userID: '455dad66544ss',
          txHash: 'sf998s...ss877d',
          time: 'Feb 1, 2021',
          amount: this.$tc('referral.wqtCount', 12),
          status: 'Success',
        },
      ],
      testFields: [
        {
          key: 'userName',
          label: this.$t('referral.table.name'),
          sortable: false,
          thClass: 'cell_head',
        },
        {
          key: 'userID',
          label: this.$t('referral.table.userID'),
          sortable: false,
          thClass: 'cell_head',
        },
        {
          key: 'txHash',
          label: this.$t('referral.table.txHash'),
          sortable: false,
          thClass: 'cell_head',
        },
        {
          key: 'time',
          label: this.$t('referral.table.time'),
          sortable: false,
          thClass: 'cell_head',
        },
        {
          key: 'amount',
          label: this.$t('referral.table.amount'),
          sortable: false,
          thClass: 'cell_head',
        },
        {
          key: 'status',
          label: this.$t('referral.table.status'),
          sortable: false,
          thClass: 'cell_head',
        },
      ],
    };
  },
  // name: 'AuthLayout',
  methods: {
    doCopy(ev) {
      ev.stopPropagation();
      this.$copyText(this.referLink)
        .then(() => {
          alert('Copied');
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.referral-page {
  background: linear-gradient(to bottom, #103D7C 320px, #dcdcdc 320px);
  display: flex;
  justify-content: center;
  height: 100vh;

  &__container {
    display: grid;
    grid-template-rows: 225px max-content;
    max-width: 1280px;
    grid-row-gap: 20px;
    justify-content: center;
  }

  &__header {
    width: 530px;
    font-weight: 500;
    color: #FFF;
    align-self: center;

    .title {
      @extend .referral-page__header;
      font-size: 45px;
      line-height: 110%;
      margin: 0 0 24px;

      &_sub {
        @extend .referral-page__header;
        font-size: 16px;
        line-height: 100%;
        opacity: 0.5;
      }
    }
  }

  &__content {
    display: grid;
    grid-row-gap: 30px;
    grid-template-rows: 140px max-content max-content;

    .btn-group {
      display: grid;
      grid-template-columns: repeat(2, calc(50% - 10px));
      gap: 20px;
      padding-bottom: 20px;
    }

    .btn {
      box-sizing: border-box;
      font-weight: 400;
      font-size: 16px;
      color: #0083C7;
      border: 1px solid #0083C71A;
      border-radius: 6px;
      transition: .3s;

      &__doc {
        @extend .btn;
        width: 220px;
        height: 46px;

        .download {
          display: unset;
          vertical-align: unset;
          margin-left: 5px;
        }
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
    }

    .info-block {
      background-color: #fff;
      border-radius: 6px;

      &__square {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 20px;
      }

      &__quarter {
        @extend .info-block;
        text-align: center;
        display: grid;
        align-content: center;
        gap: 20px;
      }

      &__title {
        color: #0083C7;
        font-weight: 700;
        font-size: 25px;
      }

      &__subtitle {
        font-weight: 400;
        font-size: 16px;
        color: #7C838D;
      }

      &__about {
        width: calc(100% - 50px);
        grid-template-areas:
          "hd ."
          "ft sd";
        margin-left: 20px;
        display: grid;
        grid-template-columns: 60% auto;
        grid-template-rows: auto 63px;
        gap: 20px;
        position: relative;

        .info-block__subtitle {
          grid-area: hd;
        }

        .calendar-img {
          grid-area: sd;
          position: absolute;
          right: 0px;
          bottom: 0;
        }

        .btn-group {
          grid-area: ft;
        }
      }

      .document {
        border: 1px solid #E1E4ED;
        border-radius: 8px;
        height: 80px;
        margin: 0 0 20px 20px;
        width: calc(100% - 40px);
        padding: 0 20px;
        align-items: center;
        display: flex;
        justify-content: space-between;

        &__name {
          padding: 0 10px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        &__size {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }

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

      .ava {
        height: 33px;
        width: 33px;
        border-radius: 50%;
        background-color: #fff;
        flex: none;

        &_list {
          @extend .ava;
          position: absolute;
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
        }

        &__name {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 16px;
        }

        &__value {
          font-size: 16px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-weight: 500;

          &_green {
            @extend .user__value;
            color: #00AA5B;
          }

          &_gray {
            @extend .user__value;
            color: #7C838D;
            font-weight: 400;
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
        border: 1px solid #F7F8FA;
        border-radius: 6px;
        width: calc(100% - 40px);
        margin-left: 20px;
        padding: 0 20px;
        display: grid;
        grid-template-columns: 1fr 20px;
        gap: 10px;
        height: 46px;
        align-items: center;

        .address {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 16px;
          color: #1D2127;
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

          &__name {
            font-weight: 500;
            font-size: 18px;
            color: #0083C7;
            padding: 10px;
          }

          &__about {
            font-size: 16px;
            color: #7C838D;
            padding: 0 10px 10px;
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
          .cell {
            padding: 0;

            &_head {
              @extend .cell;
            }
          }

          &__header {
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
</style>
