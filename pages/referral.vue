<template>
  <div class="referral-page">
    <div class="referral-page__container">
      <div class="referral-page__header">
        <div class="title">
          {{ $t('referral.inviteFriendsHead') }}
          <br>
          {{ $t('referral.earnCryptoTogether') }}
        </div>
        <div class="title_sub">
          {{ $t('referral.headerSubtitle') }}
        </div>
      </div>
      <div class="referral-page__content">
        <div class="info-block_couple">
          <div class="info-block">
            <div class="info-block__wrap">
              <div class="info-block__inner">
                <div class="info-block__name">
                  {{ $t('referral.referralReward') }}
                </div>
                <div class="info-block__tokens">
                  {{ $tc('meta.coins.count.USDCount', referralReward) }}
                </div>
              </div>
              <div class="info-block__btn-wrap">
                <base-btn
                  :disabled="Number(referralReward) === 0"
                  data-selector="CLAIM"
                  @click="handleClaimRewards"
                >
                  {{ $t('modals.claim') }}
                </base-btn>
              </div>
            </div>
            <div
              v-if="paidEventsList.length"
              class="info-block__name"
            >
              {{ $t('referral.lastRefReward') }}
            </div>
            <div
              v-if="paidEventsList.length"
              class="user_last-reward"
            >
              <div class="user__info">
                <img
                  class="ava"
                  :src="paidEventsList[0]['referralUser.avatar.url'] ? paidEventsList[0]['referralUser.avatar.url'] : $options.images.EMPTY_AVATAR"
                  alt="avatar"
                >
                <div class="user__name">
                  {{ paidEventsList[0]['referralUser.firstName'] }} {{ paidEventsList[0]['referralUser.lastName'] }}
                </div>
              </div>
              <div class="user__value_green">
                {{ $tc('meta.units.plusCount', $tc(`meta.coins.count.${currencyReward(paidEventsList[0]['referralUser.id'])}`, getStyledAmount(paidEventsList[0].amount))) }}
              </div>
            </div>
          </div>
          <div class="info-block">
            <div class="info-block__wrap">
              <div class="info-block__inner">
                <div class="info-block__name">
                  {{ $t('referral.yourRefers') }}
                </div>
              </div>
              <div class="info-block__btn-wrap info-block__btn-wrap_absolute">
                <base-btn
                  :disabled="!isNeedRegistration"
                  data-selector="REGISTRATION"
                  @click="handleRegistration"
                >
                  {{ $t('meta.btns.registration') }}
                </base-btn>
              </div>
            </div>
            <div class="info-block__refers">
              <div
                v-for="(item) in referralItems"
                :key="`${item.id}`"
                class="info-block__avatar"
                @click="showReferralsList"
              >
                <img
                  class="ava_list"
                  :class="{'ava_list--empty': !item.avatar}"
                  :src="(item.avatar && item.avatar.url) ? item.avatar.url : $options.images.EMPTY_AVATAR"
                  alt=""
                >
              </div>
              <div
                v-if="referralsListCount > referralCount"
                class="info-block__more"
                @click="showReferralsList"
              >
                {{ $tc('meta.units.plusCount', referralsListCount - referralCount) }}
              </div>
            </div>
            <div
              v-if="userReferralId.length"
              class="info-block__name"
            >
              {{ $t('referral.yourReferralLink') }}
            </div>
            <div
              v-if="userReferralId.length"
              class="info-block__link"
            >
              <div class="address">
                {{ referLink }}{{ userReferralId }}
              </div>
              <button-copy
                :copy-value="referLink + userReferralId"
              />
            </div>
          </div>
        </div>
        <div class="info-block">
          <div class="info-block__name_bold">
            {{ $t('referral.howToInviteYourFriends') }}
          </div>
          <div class="info-block__steps">
            <div class="step">
              <div class="step__name">
                {{ $t('referral.getLink') }}
              </div>
              <div class="step__about">
                {{ $t('referral.registerAndGenerate') }}
              </div>
            </div>
            <div class="step">
              <div class="step__name">
                {{ $t('referral.inviteFriends') }}
              </div>
              <div class="step__about">
                {{ $t('referral.inviteYourFriends') }}
              </div>
            </div>
            <div class="step">
              <div class="step__name">
                {{ $t('referral.earnCrypto') }}
              </div>
              <div class="step__about">
                {{ $t('referral.everyTimeYourFriends') }}
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="paidEventsList.length"
          class="info-block"
        >
          <div class="info-block__name">
            {{ $t('referral.historyOfRewards') }}
          </div>
          <div class="referral-page__table">
            <b-table
              :items="paidEventsList"
              :fields="tableFields"
              borderless
              caption-top
              thead-class="table__header"
              tbody-tr-class="table__row"
            >
              <template #cell(userInfo)="el">
                <div class="user__name">
                  <nuxt-link
                    class="user__link"
                    :to="`profile/${el.item['referralUser.id']}`"
                  >
                    <img
                      class="ava"
                      :src="el.item['referralUser.avatar.url'] ? el.item['referralUser.avatar.url'] : $options.images.EMPTY_AVATAR"
                      alt=""
                    >
                    <span>
                      {{ el.item['referralUser.firstName'] }} {{ el.item['referralUser.lastName'] }}
                    </span>
                  </nuxt-link>
                </div>
              </template>
              <template #cell(userID)="el">
                <div class="user__value_gray">
                  {{ CutTxn(el.item.referral ? el.item.referral : el.item.affiliate, 6, 6) }}
                  <button-copy
                    :copy-value="el.item.referral ? el.item.referral : el.item.affiliate"
                    mode="reward"
                  />
                </div>
              </template>
              <template #cell(txHash)="el">
                <a
                  :href="`${$options.ExplorerUrl}/tx/${el.item.transactionHash}`"
                  target="_blank"
                  class="user__value_gray"
                >
                  {{ CutTxn(el.item.transactionHash, 6, 6) }}
                </a>
              </template>
              <template #cell(time)="el">
                <div class="user__value_gray">
                  {{ GetFormTimestamp(Number(el.item.timestamp) * 1000, 'll') }}
                </div>
              </template>
              <template #cell(amount)="el">
                <div class="user__value_gray">
                  {{ $tc(`meta.coins.count.${currencyReward(el.item['referralUser.id'])}`, getStyledAmount(el.value)) }}
                </div>
              </template>
              <template #cell(event)="el">
                <div class="user__value_green">
                  {{ el.value }}
                </div>
              </template>
            </b-table>
          </div>
        </div>
        <div
          v-if="paidEventsList.length"
          class="referral-page__pager"
        >
          <base-pager
            v-if="totalPages > 1"
            v-model="page"
            :total-pages="totalPages"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import BigNumber from 'bignumber.js';
import modals from '~/store/modals/modals';
import { getStyledAmount } from '~/utils/wallet';
import { images } from '~/utils/images';
import { REFERRAL_EVENTS } from '~/utils/сonstants/referral';
import { ExplorerUrl, TokenSymbols } from '~/utils/enums';
import { WQReferral } from '~/abi';
import ENV from '~/utils/addresses';

export default {
  name: 'Referral',
  images,
  ExplorerUrl,
  async asyncData({ store }) {
    const userAddress = store.getters['user/getUserWalletAddress'];
    await Promise.all([
      store.dispatch('referral/fetchRewardBalance', userAddress),
      store.dispatch('referral/fetchPaidEventsList'),
      store.dispatch('referral/fetchReferralsList'),
      store.dispatch('referral/subscribeToReferralEvents', userAddress),
    ]);
  },
  data() {
    return {
      page: 1,
      perPage: 10,
      referralCount: 5,
    };
  },
  computed: {
    ...mapGetters({
      referralReward: 'referral/getReferralReward',
      paidEventsList: 'referral/getPaidEventsList',
      referralsList: 'referral/getReferralsList',
      referralsListCount: 'referral/getReferralsListCount',
      createdReferralList: 'referral/getCreatedReferralList',
      referralSignature: 'referral/getReferralSignature',
      userAddress: 'user/getUserWalletAddress',
      userReferralId: 'user/getUserReferralId',
      userData: 'user/getUserData',
      isNeedRegistration: 'referral/getIsNeedRegistration',
      createdReferralsList: 'referral/getCreatedReferralList',
    }),
    convertedAddress() {
      return this.convertToBech32('wq', this.userAddress);
    },
    referLink() {
      const url = window.location.origin;
      return `${url}/sign-up?ref=`;
    },
    totalPages() {
      return Math.ceil(this.paidEventsList.length / this.perPage);
    },
    filterCreatedReferralsList() {
      return this.referralsList.filter((item) => item.referralUser.referralStatus === 'created' && item.ratingStatistic);
    },
    tableFields() {
      return [
        {
          key: 'userInfo',
          label: this.$t('referral.tableHead.name'),
          thStyle: {
            padding: '0 0 0 23px',
            height: '27px',
            lineHeight: '27px',
          },
          tdAttr: {
            style: 'padding: 0 0 0 23px; height: 64px; line-height: 64px',
          },
        },
        {
          key: 'userID',
          label: this.$t('meta.wallet'),
          thStyle: {
            padding: '0',
            height: '27px',
            lineHeight: '27px',
          },
          tdAttr: {
            style: 'padding: 0; height: 64px; line-height: 64px',
          },
        },
        {
          key: 'txHash',
          label: this.$t('referral.tableHead.txHash'),
          thStyle: {
            padding: '0',
            height: '27px',
            lineHeight: '27px',
          },
          tdAttr: {
            style: 'padding: 0; height: 64px; line-height: 64px',
          },
        },
        {
          key: 'time',
          label: this.$t('referral.tableHead.time'),
          thStyle: {
            padding: '0',
            height: '27px',
            lineHeight: '27px',
          },
          tdAttr: {
            style: 'padding: 0; height: 64px; line-height: 64px',
          },
        },
        {
          key: 'amount',
          label: this.$t('referral.tableHead.amount'),
          thStyle: {
            padding: '0',
            height: '27px',
            lineHeight: '27px',
          },
          tdAttr: {
            style: 'padding: 0; height: 64px; line-height: 64px',
          },
        },
        {
          key: 'event',
          label: this.$t('referral.tableHead.event'),
          formatter: (value) => this.$t(`referral.event.${REFERRAL_EVENTS[value]}`),
          thStyle: {
            padding: '0',
            height: '27px',
            lineHeight: '27px',
          },
          tdAttr: {
            style: 'padding: 0; height: 64px; line-height: 64px',
          },
        },
      ];
    },
    referralItems() {
      const referralsList = [];
      const indexList = [];
      if (this.referralsList.length > this.referralCount) {
        while (referralsList.length < this.referralCount) {
          const index = Math.floor(Math.random() * this.referralsList.length);
          if (!indexList.includes(index)) {
            indexList.push(index);
            referralsList.push(this.referralsList[index]);
          }
        }
        return referralsList;
      }

      return this.referralsList;
    },
  },
  watch: {
    page: {
      async handler(newValue, oldValue) {
        if (newValue !== oldValue) {
          this.ScrollToTop();
          const payload = {
            params: {
              limit: 6,
              offset: (newValue - 1) * this.perPage,
            },
          };
          await this.$store.dispatch('referral/updateCurrentPage', newValue);
          await this.$store.dispatch('referral/fetchPaidEventsList', payload);
        }
      },
    },
    paidEventsList: {
      handler() {
        this.$store.dispatch('referral/fetchRewardBalance', this.userAddress);
      },
    },
  },
  beforeMount() {
    this.$store.dispatch('wallet/checkWalletConnected', { nuxt: this.$nuxt });
  },
  beforeDestroy() {
    this.$store.dispatch('referral/unsubscribeToReferralEvents', this.userAddress);
  },
  methods: {
    async handleClaimRewards() {
      const fetchFee = async () => await this.$store.dispatch('wallet/getContractFeeData', {
        method: 'claim',
        abi: WQReferral,
        contractAddress: ENV.WORKNET_REFERRAL,
      });

      // Claiming
      const claim = async (feeRes) => {
        if (!feeRes.ok) {
          this.SetLoader(false);
          this.ShowToast(feeRes.msg);
          return;
        }
        this.SetLoader(true);
        await this.$store.dispatch('wallet/getBalance');
        this.SetLoader(false);

        this.ShowModal({
          key: modals.transactionReceipt,
          title: this.$t('modals.claim'),
          description: this.$t('modals.claimConfirm'),
          fields: {
            from: { name: this.$t('meta.fromBig'), value: this.convertedAddress },
            to: { name: this.$t('meta.toBig'), value: ENV.WORKNET_REFERRAL },
            reward: { name: this.$t('referral.referralReward'), value: this.referralReward, symbol: 'USD' },
            fee: { name: this.$t('wallet.table.trxFee'), value: feeRes.result.fee, symbol: TokenSymbols.WQT },
          },
          submitMethod: async () => {
            const { ok, result } = await this.$store.dispatch('referral/claimReferralReward', this.userAddress);
            if (ok) {
              await this.$store.dispatch('referral/fetchPaidEventsList');
              this.ShowModal({
                key: modals.transactionSend,
                txUrl: `${ExplorerUrl}/tx/${result.transactionHash}`,
              });
            }
          },
        });
      };

      this.SetLoader(true);
      const feeRes = await fetchFee();
      // Check if dont need to update oracle prices
      if (!feeRes?.msg?.includes('Price is outdated')) {
        await claim(feeRes);
        return;
      }

      // Updating token price THEN claim
      const [pricesFeeRes] = await Promise.all([
        this.$store.dispatch('oracle/feeSetTokensPrices'),
        this.$store.dispatch('wallet/getBalance'),
      ]);
      this.SetLoader(false);

      if (!pricesFeeRes.ok) {
        this.ShowToast(pricesFeeRes.msg);
        return;
      }

      const { result: { gas, gasPrice } } = pricesFeeRes;
      const pricesFee = new BigNumber(gas).multipliedBy(gasPrice).shiftedBy(-18).toString();

      this.ShowModal({
        key: modals.transactionReceipt,
        title: this.$t('modals.setTokenPrice', { token: 'USD' }),
        fields: {
          from: { name: this.$t('meta.fromBig'), value: this.convertedAddress },
          to: { name: this.$t('meta.toBig'), value: ENV.WORKNET_ORACLE },
          fee: { name: this.$t('wallet.table.trxFee'), value: pricesFee, symbol: TokenSymbols.WQT },
        },
        submitMethod: async () => {
          const res = await this.$store.dispatch('oracle/setCurrentPriceTokens');
          if (res.ok) {
            const claimFee = await fetchFee();
            await claim(claimFee);
          }
        },
      });
    },

    async handleRegistration() {
      const registration = async () => {
        this.SetLoader(true);
        const signature = this.$store.getters['referral/getReferralSignature'];
        const addresses = this.$store.getters['referral/getCreatedReferralList'];
        const [feeRes] = await Promise.all([
          this.$store.dispatch('wallet/getContractFeeData', {
            method: 'addReferrals',
            abi: WQReferral,
            contractAddress: ENV.WORKNET_REFERRAL,
            data: [signature.v, signature.r, signature.s, addresses],
          }),
          this.$store.dispatch('wallet/getBalance'),
        ]);
        this.SetLoader(false);
        if (!feeRes.ok) {
          if (feeRes.msg.includes('Address is already registered')) {
            this.ShowToast(this.$t('referral.alreadyRegistered'));
          } else this.ShowToast(feeRes.msg);
          return;
        }
        this.ShowModal({
          key: modals.transactionReceipt,
          title: this.$t('meta.btns.registration'),
          isDontOffLoader: true,
          fields: {
            from: { name: this.$t('meta.fromBig'), value: this.convertedAddress },
            to: { name: this.$t('meta.toBig'), value: ENV.WORKNET_REFERRAL },
            fee: { name: this.$t('wallet.table.trxFee'), value: feeRes.result.fee, symbol: TokenSymbols.WQT },
          },
          submitMethod: async () => {
            const { ok, result } = await this.$store.dispatch('referral/addReferrals');
            if (ok) {
              this.ShowModal({
                key: modals.transactionSend,
                txUrl: `${ExplorerUrl}/tx/${result.transactionHash}`,
              });
              await this.$store.dispatch('referral/setIsNeedRegistration', false);
            }
          },
        });
      };

      this.SetLoader(true);
      const res = await this.$store.dispatch('referral/fetchCreatedReferralList');
      this.SetLoader(false);

      if (res.ok && this.createdReferralsList.length) {
        this.ShowModal({
          key: modals.referralRegistration,
          title: this.$t('meta.btns.registration'),
          subtitle: this.$t('modals.registration'),
          cancel: this.$t('meta.btns.cancel'),
          button: this.$t('meta.btns.submit'),
          itemList: this.filterCreatedReferralsList,
          submit: registration,
        });
      } else {
        this.ShowModal({
          key: modals.status,
          title: this.$t('modals.errors.error'),
          subtitle: this.$t('notifications.registrationError'),
        });
      }
    },

    showReferralsList() {
      this.ShowModal({
        key: modals.referralRegistration,
        title: this.$t('referral.yourRefers'),
        itemList: this.referralsList,
        status: true,
      });
    },
    getStyledAmount(value) {
      return getStyledAmount(value);
    },
    currencyReward(userId) {
      if (userId === this.userData.id) return 'WQTCount';
      return 'dollarsCount';
    },
  },
};
</script>

<style lang="scss" scoped>
.referral-page {
  background: linear-gradient(to bottom, $darkblue 370px, $white100 370px);
  display: flex;
  justify-content: center;

  &__container {
    display: grid;
    grid-template-rows: 225px max-content;
    max-width: 1180px;
    gap: 30px;
    justify-content: center;
    width: 100%;
    padding: 10px;
    box-sizing: content-box;
  }

  &__header {
    max-width: 450px;
    font-weight: 500;
    color: $white;
    align-self: center;
  }

  &__content {
    display: grid;
    grid-row-gap: 30px;
    grid-template-rows: 225px max-content max-content;
  }

  &__table {
    margin-bottom: 25px;

    table {
      margin: 0 !important;
      border-radius: 0 !important;
    }
  }
}

.title {
  @extend .referral-page__header;
  font-size: 45px;
  line-height: 110%;
  margin: 0 0 16px;

  &_sub {
    @extend .referral-page__header;
    font-size: 16px;
    line-height: 100%;
    opacity: 0.5;
  }
}

.info-block {
  background-color: $white;
  border-radius: 6px;
  position: relative;

  &__wrap {
    display: grid;
    grid-auto-flow: column;
    justify-content: space-between;
  }

  &__btn-wrap {
    padding: 34px 20px 0 0;
    width: 156px;
  }

  &__btn-wrap_absolute {
    position: absolute;
    right: 0;
    z-index: 3;
  }

  &__tokens {
    font-weight: 700;
    font-size: 25px;
    color: $blue;
    padding: 0 20px;
  }

  &__name {
    font-size: 16px;
    color: $black800;
    padding: 20px 20px 10px 20px;
    font-weight: 400;

    &_bold {
      font-weight: 500;
      font-size: 25px;
      color: $darkblue;
      line-height: 1;
      padding: 20px;
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
    cursor: pointer;
    width: 25px;
  }

  &__more {
    height: 33px;
    padding: 0 10px;
    min-width: 53px;
    border-radius: 39px;
    background-color: $black0;
    text-align: center;
    line-height: 33px;
    margin-left: -5px;
    z-index: 2;
    cursor: pointer;
  }

  &__link {
    border: 1px solid $black0;
    border-radius: 6px;
    width: calc(100% - 40px);
    margin-left: 20px;
    padding: 0 20px;
    display: grid;
    grid-template-columns: 1fr 23px;
    gap: 10px;
    height: 46px;
    align-items: center;

    button {
      margin-top: 3px;
    }

    .address {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 16px;
      color: $black800;

      &__icon {
        font-size: 24px;

        &::before {
          color: $blue;
        }
      }
    }
  }

  &__steps {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 60px;
    position: relative;
    width: calc(100% - 40px);
    margin: 0 0 20px 20px;

    &:after {
      content: "";
      position: absolute;
      height: 2px;
      width: 100%;
      top: 50%;
      background-color: $grey100;
    }
  }

  &_couple {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
}

.ava {
  height: 33px;
  width: 33px;
  border-radius: 50%;
  background-color: $white;
  flex: none;
  display: inline;
  margin-right: 10px;

  &_list {
    @extend .ava;
    position: absolute;
    &--empty{
      border: 1px solid $black100;
    }
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
    text-transform: capitalize;
  }
  &__name-table {
    max-width: 90px;
  }

  &__value {
    font-size: 16px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: 500;
    text-transform: capitalize;

    &_green {
      @extend .user__value;
      color: $green;
    }

    &_gray {
      @extend .user__value;
      color: $black500;
      font-weight: 400;
    }
  }

        &_last-reward {
          display: grid;
          background-color: $black0;
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

  &__link {
    display: flex;
    align-items: center;
    position: relative;
    text-decoration: none;
    color: $black500;

    &:hover,
    &:focus {
      text-decoration: underline;
    }
  }
}

.step {
  position: relative;
  background-color: $black0;
  border-radius: 6px;
  z-index: 2;

  &__name {
    font-weight: 500;
    font-size: 18px;
    color: $blue;
    padding: 10px;
  }

  &__about {
    font-size: 16px;
    color: $black500;
    padding: 0 10px 10px;
  }

  &:not(:last-child) {
    &:after {
      content: "";
      height: 12px;
      width: 12px;
      border-radius: 50%;
      z-index: 3;
      background-color: $grey100;
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
      background-color: $grey100;
      position: absolute;
      left: -5px;
      top: calc(50% - 5px);
    }
  }
}

@include _991 {
  .referral-page {
    background: linear-gradient(to bottom, $darkblue 245px, $white100 245px);

    &__container {
      gap: 15px;
      grid-template-rows: 150px auto;
    }

    &__table {
      overflow: auto;
      width: calc(100vw - 20px);

      .table {
        width: 1180px;
      }
    }
  }
}

@include _767 {
  .referral-page {
    background: linear-gradient(to bottom, $darkblue 220px, $white100 220px);

    &__container {
      grid-template-rows: repeat(2, auto);
      gap: 24px;
    }

    &__content {
      grid-template-rows: 450px max-content max-content;
    }
  }

  .title {
    font-size: 36px;
    margin-bottom: 15px;
    width: 100%;

    &_sub {
      font-size: 16px;
      max-width: 400px;
      width: 100%;
    }
  }

  .info-block {
      &_couple {
        grid-template-rows: repeat(2, 1fr);
        grid-template-columns: unset;
        gap: 20px;
      }

      &__steps {
        grid-template-rows: repeat(3, 1fr);
        grid-template-columns: unset;
        gap: 60px;

        .step {
          &:not(:last-child) {
            &:after {
              right: calc(50% - 7px);
              bottom: -5px;
              top: unset;
            }
          }

          &:not(:first-child) {
            &:before {
              right: calc(50% - 7px);
              left: unset;
              top: - 5px;
            }
          }
        }

        &:after {
          height: 100%;
          width: 2px;
          left: 50%;
          top: 0;
        }
      }
  }
}
</style>
