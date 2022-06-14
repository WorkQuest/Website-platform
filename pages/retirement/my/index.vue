<template>
  <div class="pension-page">
    <div
      class="pension-page__container"
      :class="{'pension-page__container_expired' : isDeadline}"
    >
      <div class="pension-page__header">
        <div class="title">
          {{ $t('pension.retirementProgram') }}
        </div>
        <div class="title_sub">
          {{ $t('ui.menu.pension.desc') }}
        </div>
      </div>
      <div
        class="pension-page__content"
        :class="{'pension-page__content_expired' : isDeadline}"
      >
        <template v-if="!isDeadline">
          <div class="info-block__triple">
            <div class="info-block__third">
              <div class="info-block__name">
                {{ $t('pension.pensionBalance') }}
              </div>
              <div class="info-block__tokens">
                {{ $t('meta.coins.count.WUSDCount', { count: pensionBalance }) }}
              </div>
              <base-btn
                class="btn_bl"
                data-selector="MAKE-DEPOSIT"
                @click="openMakeDepositModal()"
              >
                {{ $t('pension.makeADeposit') }}
              </base-btn>
            </div>
            <div class="info-block__third">
              <div class="info-block__name">
                {{ $t('pension.currentPercentFromAQuest') }}
              </div>
              <div class="info-block__tokens">
                {{ $t('meta.units.percentsCount', {count: getFeePercent(pensionFee)}) }}
              </div>
              <base-btn
                class="btn_bl"
                data-selector="CHANGE-PERCENT"
                @click="openChangePercentModal()"
              >
                {{ $t('pension.changePercent') }}
              </base-btn>
            </div>
            <div class="info-block__third_rate">
              <div class="info-block__small">
                <div class="info-block__perc">
                  + {{ $tc('meta.units.percentsCount', 6) }}
                </div>
                <div class="info-block__period">
                  {{ $t('pension.year') }}
                </div>
              </div>
              <div>
                <div class="info-block__title_gray">
                  {{ $t('pension.timeRemainsUntilTheEndOfThePeriod') }}
                </div>
                <div class="info-block__subtitle_black">
                  {{ unlockDate }}
                </div>
              </div>
            </div>
          </div>
        </template>
        <template v-if="isDeadline">
          <div class="info-block__grid">
            <div>
              <div class="info-block__name">
                {{ $t('pension.pensionSavingsBalance') }}
              </div>
              <div class="info-block__tokens">
                {{ $t('meta.coins.count.WUSDCount', { count: pensionBalance }) }}
              </div>
            </div>
            <div class="info-block__small_right">
              <div class="info-block__perc">
                + {{ $tc('meta.units.percentsCount', 6) }}
              </div>
              <div class="info-block__period">
                {{ $t('pension.year') }}
              </div>
            </div>
            <div class="text-cont">
              <div class="info-block__title_gray">
                {{ $t('pension.timeRemainsUntilTheEndOfThePeriod') }}
              </div>
              <div
                class="info-block__subtitle_red"
              >
                {{ $tc('meta.units.days', 0) }}
              </div>
            </div>
            <div class="btn-group">
              <base-btn
                class="btn_bl"
                data-selector="WITHDRAW"
                @click="showWithdrawModal"
              >
                {{ $t('meta.withdraw') }}
              </base-btn>
              <base-btn
                class="btn_bl"
                data-selector="PROLONG"
                @click="handleProlong"
              >
                {{ $t('pension.prolong') }}
              </base-btn>
            </div>
          </div>
        </template>
        <div class="pension-page__info-block">
          <div class="info-block">
            <div class="info-block__table-title">
              {{ $t('pension.transactionHistory') }}
            </div>
            <div class="info-block__select-table">
              <base-btn
                :is-submit="false"
                data-selector="DEPOSIT-BTN"
                :mode="selectedTable === $options.PensionHistoryMethods.Receive ? '' : 'outline'"
                @click="selectedTable=$options.PensionHistoryMethods.Receive"
              >
                {{ $t('meta.deposit') }}
              </base-btn>
              <base-btn
                :is-submit="false"
                data-selector="WITHDRAW-BTN"
                :mode="selectedTable === $options.PensionHistoryMethods.Withdraw ? '' : 'outline'"
                @click="selectedTable=$options.PensionHistoryMethods.Withdraw"
              >
                {{ $t('meta.withdraw') }}
              </base-btn>
              <base-btn
                :is-submit="false"
                data-selector="CHANGE-PERCENT-BTN"
                :mode="selectedTable === $options.PensionHistoryMethods.Update ? '' : 'outline'"
                @click="selectedTable=$options.PensionHistoryMethods.Update"
              >
                {{ $t('pension.changePercent') }}
              </base-btn>
            </div>
            <div class="pension-page__table">
              <base-table
                class="table"
                :items="historyByPage"
                :fields="historyFields"
              />
            </div>
            <div
              v-if="!historyByPage.length"
              class="empty-info"
            >
              <empty-data :description="$t('meta.listIsEmpty')" />
            </div>
          </div>
          <base-pager
            v-if="totalPages > 1"
            v-model="page"
            class="info-block__pager"
            :total-pages="totalPages"
          />
        </div>
        <div
          v-if="FAQs.length"
          class="info-block"
        >
          <div class="info-block__name_bold">
            {{ $t("meta.faq") }}
          </div>
          <div class="info-block__faqs">
            <button
              v-for="(item, i) in FAQs"
              :key="i"
              class="info-block__faq"
              @click="handleClickFAQ(item)"
            >
              <div class="text__faq">
                {{ item.name }}
              </div>
              <img
                class="select-img"
                :class="{'select-img_rotate' : item.isOpen}"
                src="~/assets/img/ui/arrow-down.svg"
                alt=""
              >
              <div
                class="text__faq_gray"
                :class="{'text__faq_opened' : item.isOpen}"
              >
                {{ item.about }}
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import BigNumber from 'bignumber.js';
import { ERC20, WQPensionFund } from '~/abi/index';
import modals from '~/store/modals/modals';
import { getStyledAmount } from '~/utils/wallet';
import {
  PensionHistoryMethods, TokenSymbols, ExplorerUrl, Path, TokenMap,
} from '~/utils/enums';
import { error, success } from '~/utils/web3';

export default {
  name: 'MyPension',
  PensionHistoryMethods,
  data() {
    return {
      selectedTable: PensionHistoryMethods.Receive,
      page: 1,
      itemsPerPage: 10,
      isDeadline: false,
      timeOut: null,
      intervalForHours: null,
      intervalForMinutes: null,
      unlockDate: null,
      FAQs: [
        {
          name: this.$t('pension.faq1.question'),
          about: this.$t('pension.faq1.answer'),
          isOpen: false,
        },
        {
          name: this.$t('pension.faq2.question'),
          about: this.$t('pension.faq2.answer'),
          isOpen: false,
        },
        {
          name: this.$t('pension.faq3.question'),
          about: this.$t('pension.faq3.answer'),
          isOpen: false,
        },
        {
          name: this.$t('pension.faq4.question'),
          about: this.$t('pension.faq4.answer'),
          isOpen: false,
        },
        {
          name: this.$t('pension.faq5.question'),
          about: this.$t('pension.faq5.answer'),
          isOpen: false,
        },
        {
          name: this.$t('pension.faq6.question'),
          about: this.$t('pension.faq6.answer'),
          isOpen: false,
        },
        {
          name: this.$t('pension.faq7.question'),
          about: this.$t('pension.faq7.answer'),
          isOpen: false,
        },
        {
          name: this.$t('pension.faq8.question'),
          about: this.$t('pension.faq8.answer'),
          isOpen: false,
        },
        {
          name: this.$t('pension.faq9.question'),
          about: this.$t('pension.faq9.answer'),
          isOpen: false,
        },
        {
          name: this.$t('pension.faq10.question'),
          about: this.$t('pension.faq10.answer'),
          isOpen: false,
        },
      ],
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',

      isWalletConnected: 'wallet/getIsWalletConnected',
      balanceData: 'wallet/getBalanceData',

      pensionWallet: 'retirement/getPensionWallet',
      pensionHistory: 'retirement/getPensionHistory',

      walletAddress: 'user/getUserWalletAddress',
    }),
    historyFields() {
      return [
        {
          key: 'operation',
          label: this.$t('meta.operation'),
          thStyle: {
            padding: '0 0 0 23px',
            height: '27px',
            lineHeight: '27px',
          },
          tdAttr: { style: 'padding: 0 0 0 23px; height: 64px; line-height: 64px; width: 250px' },
        },
        {
          key: 'tx_hash',
          label: this.$t('referral.tableHead.txHash'),
          thStyle: {
            padding: '0',
            height: '27px',
            lineHeight: '27px',
          },
          tdAttr: { style: 'padding: 0; height: 64px; line-height: 64px' },
        },
        {
          key: 'date',
          label: this.$t('referral.tableHead.time'),
          thStyle: {
            padding: '0',
            height: '27px',
            lineHeight: '27px',
          },
          tdAttr: { style: 'padding: 0; height: 64px; line-height: 64px' },
        },
        {
          key: 'value',
          label: this.$t('modals.value'),
          thStyle: {
            padding: '0',
            height: '27px',
            lineHeight: '27px',
          },
          tdAttr: { style: 'padding: 0; height: 64px; line-height: 64px; width: 300px' },
        },
      ];
    },
    pensionBalance() {
      return this.pensionWallet?.amount || 0;
    },
    pensionFee() {
      return this.pensionWallet?.fee || 0;
    },
    totalPages() {
      const len = this.pensionHistory[this.selectedTable]?.count;
      if (!len) return len;
      return Math.ceil(len / this.itemsPerPage);
    },
    historyByPage() {
      this.$moment.locale(this.$i18n.locale);
      if (!this.pensionHistory[this.selectedTable]?.txs) return [];
      return this.pensionHistory[this.selectedTable].txs.map((item) => ({
        operation: item.event,
        tx_hash: item.transactionHash,
        date: this.$moment(item.createdAt),
        value: this.selectedTable === PensionHistoryMethods.Update ? `${getStyledAmount(this.getFeePercent(item.newFee))}%` : `${getStyledAmount(item.amount)} ${TokenSymbols.WUSD}`,
      }));
    },
  },
  watch: {
    page(newVal) {
      this.loadTablePage(newVal);
    },
    selectedTable() {
      this.loadTablePage(1);
    },
    async isWalletConnected(newValue) {
      if (!newValue) return;
      await this.getWallet();
    },
  },
  async mounted() {
    this.SetLoader(true);
    await this.getWallet();
    if (!this.pensionWallet.isCreated) {
      await this.$router.push(Path.RETIREMENT);
      this.SetLoader(false);
      return;
    }
    this.endOfPeriod();
    await this.subscribe(this.walletAddress);
    this.SetLoader(false);
  },
  async beforeDestroy() {
    clearTimeout(this.timeOut);
    clearTimeout(this.intervalForMinutes);
    clearTimeout(this.intervalForHours);
    await this.unsubscribe(this.walletAddress);
  },
  methods: {
    ...mapActions({
      subscribe: 'retirement/subscribeWS',
      unsubscribe: 'retirement/unsubscribeWS',
      getPensionTransactions: 'retirement/getPensionTransactions',
      pensionGetWalletInfo: 'retirement/pensionGetWalletInfo',
      pensionExtendLockTime: 'retirement/pensionExtendLockTime',
      pensionContribute: 'retirement/pensionContribute',
      pensionWithdraw: 'retirement/pensionWithdraw',

      getContractFeeData: 'wallet/getContractFeeData',
      getBalanceWQT: 'wallet/getBalance',
      fetchWalletData: 'wallet/fetchWalletData',
    }),
    getOperationLocale(operation) {
      if (operation === 'WalletUpdated') return this.$t('pension.changePercent');
      if (operation === 'Received') return this.$t('meta.deposit');
      if (operation === 'Withdrew') return this.$t('wallet.withdraw');
      return '';
    },
    getExplorerRef(hash) {
      return `${ExplorerUrl}/tx/${hash ? hash.toLowerCase() : ''}`;
    },
    checkIsDeadLine() {
      if (!this.pensionWallet) {
        this.isDeadline = false;
        return;
      }
      const now = this.$moment.now();
      const ends = this.$moment(this.pensionWallet.unlockDate);
      this.isDeadline = ends.diff(now, 'milliseconds') <= 0;
    },
    endOfPeriod() {
      if (!this.pensionWallet) return;
      const now = this.$moment.now();
      const ends = this.$moment(this.pensionWallet.unlockDate);

      const seconds = ends.diff(now, 'seconds');
      const milliseconds = ends.diff(now, 'milliseconds');
      if (seconds <= 60) {
        clearInterval(this.intervalForMinutes);
        this.timeOut = setTimeout(() => {
          this.isDeadline = true;
        }, milliseconds);
        this.unlockDate = this.$tc('meta.units.seconds', this.DeclOfNum(seconds), { count: seconds });
        return;
      }

      const minutes = ends.diff(now, 'minutes');
      if (minutes <= 60) {
        clearInterval(this.intervalForHours);
        this.intervalForMinutes = setInterval(this.endOfPeriod, 60000);
        this.unlockDate = this.$tc('meta.units.minutes', this.DeclOfNum(minutes), { count: minutes });
        return;
      }

      const hours = ends.diff(now, 'hours');
      if (hours <= 24) {
        this.intervalForHours = setInterval(this.endOfPeriod, 3.6e+6);
        this.unlockDate = this.$tc('meta.units.hours', this.DeclOfNum(hours), { count: hours });
        return;
      }

      const years = ends.diff(now, 'years');
      const days = ends.diff(now, 'days') - years * 365;
      const y = years > 0 ? `${this.$tc('meta.units.years', this.DeclOfNum(years), { count: years })} ` : '';
      const d = days >= 0 ? this.$tc('meta.units.days', this.DeclOfNum(days), { count: days }) : this.$tc('meta.units.days', this.DeclOfNum(0), { count: 0 });
      this.unlockDate = `${y}${d}`;
    },
    getFeePercent(fee) {
      const amount = fee * 100;
      return new BigNumber(amount).toString() || '';
    },
    async loadTablePage(page) {
      this.page = page;
      await this.getPensionTransactions({
        method: this.selectedTable,
        limit: this.itemsPerPage,
        offset: (this.page - 1) * this.itemsPerPage,
      });
    },
    async getWallet() {
      await Promise.all([
        this.getBalanceWQT(),
        this.pensionGetWalletInfo(),
        this.loadTablePage(this.page),
      ]);
      await this.fetchWalletData({
        method: 'balanceOf', address: this.walletAddress, abi: ERC20, token: TokenMap[TokenSymbols.WUSD], symbol: TokenSymbols.WUSD,
      });
      this.checkIsDeadLine();
    },
    showWithdrawModal() {
      this.ShowModal({
        key: modals.takeWithdraw,
        walletAddress: this.convertToBech32('wq', this.walletAddress),
        maxValue: this.pensionWallet.fullAmount,
        withdrawType: 'pension',
        submit: async (amount) => {
          this.selectedTable = PensionHistoryMethods.Withdraw;
          const { balance } = this.balanceData.WUSD;
          this.CloseModal();
          this.SetLoader(true);
          const [txFee] = await Promise.all([
            this.$store.dispatch('wallet/getContractFeeData', {
              abi: WQPensionFund,
              contractAddress: this.ENV.WORKNET_PENSION_FUND,
              method: 'withdraw',
              data: [new BigNumber(amount).shiftedBy(18).toString()],
            }),
            this.getBalanceWQT(),
          ]);
          if (!txFee?.ok || +balance === 0) {
            await this.$store.dispatch('main/showToast', { text: this.$t('errors.transaction.notEnoughFunds') });
            this.SetLoader(false);
            return;
          }
          this.ShowModal({
            key: modals.transactionReceipt,
            title: this.$t('modals.info.withdrawInfo'),
            fields: {
              to: { name: this.$t('meta.toBig'), value: this.convertToBech32('wq', this.walletAddress) },
              amount: { name: this.$t('modals.amount'), value: amount, symbol: TokenSymbols.WUSD },
              fee: { name: this.$t('wallet.table.trxFee'), value: txFee.result.fee, symbol: TokenSymbols.WQT },
            },
            submitMethod: async () => {
              this.SetLoader(true);
              const res = await this.pensionWithdraw(amount);
              if (res.ok) return success();
              await this.$store.dispatch('main/showToast', { text: this.$t('modals.transactionFail') });
              return error();
            },
            callback: () => {
              Promise.all([
                this.getWallet(),
                this.$store.dispatch('wallet/getBalance'),
              ]);
            },
          });
        },
      });
    },
    handleProlong() {
      this.ShowModal({
        key: modals.areYouSureNotification,
        text: this.$t('pension.prolongText'),
        callback: async () => {
          const { balanceData: { WUSD: { balance } } } = this;
          this.CloseModal();
          this.SetLoader(true);
          const [txFee] = await Promise.all([
            this.getContractFeeData({
              abi: WQPensionFund,
              contractAddress: this.ENV.WORKNET_PENSION_FUND,
              method: 'extendLockTime',
            }),
            this.getBalanceWQT(),
          ]);
          if (!txFee.ok || +balance === 0) {
            await this.$store.dispatch('main/showToast', {
              text: this.$t('errors.transaction.notEnoughFunds'),
            });
            this.SetLoader(false);
            return;
          }
          this.ShowModal({
            key: modals.transactionReceipt,
            fields: {
              from: { name: this.$t('meta.fromBig'), value: this.convertToBech32('wq', this.walletAddress) },
              to: { name: this.$t('meta.toBig'), value: this.convertToBech32('wq', this.ENV.WORKNET_PENSION_FUND) },
              fee: { name: this.$t('wallet.table.trxFee'), value: txFee.result.fee, symbol: TokenSymbols.WQT },
            },
            isDontOffLoader: true,
            submitMethod: async () => {
              const res = await this.pensionExtendLockTime();
              if (res.ok) {
                await this.getWallet();
                this.endOfPeriod();
              }
              this.SetLoader(false);
            },
          });
        },
      });
    },
    openMakeDepositModal() {
      this.ShowModal({
        key: modals.valueSend,
        title: this.$t('pension.makeADeposit'),
        maxValue: this.balanceData.WUSD.balance,
        submit: async (amount) => {
          const { balanceData } = this;
          this.selectedTable = PensionHistoryMethods.Receive;
          const newAmount = new BigNumber(amount).shiftedBy(18).toString();
          this.CloseModal();
          this.SetLoader(true);
          const allowance = await this.$store.dispatch('wallet/getAllowance', {
            tokenAddress: TokenMap[TokenSymbols.WUSD],
            spenderAddress: this.ENV.WORKNET_PENSION_FUND,
          });
          if (new BigNumber(allowance).isLessThan(newAmount)) {
            await this.$store.dispatch('wallet/approve', {
              tokenAddress: TokenMap[TokenSymbols.WUSD],
              spenderAddress: this.ENV.WORKNET_PENSION_FUND,
              amount: newAmount,
            });
          }
          const [txFee] = await Promise.all([
            this.$store.dispatch('wallet/getContractFeeData', {
              method: 'contribute',
              abi: WQPensionFund,
              contractAddress: this.ENV.WORKNET_PENSION_FUND,
              data: [this.walletAddress, newAmount],
              recipient: this.ENV.WORKNET_PENSION_FUND,
            }),
            this.getWallet(),
          ]);
          this.SetLoader(false);
          if (!txFee?.ok || +balanceData.WUSD.balance === 0) {
            await this.$store.dispatch('main/showToast', {
              text: this.$t('errors.transaction.notEnoughFunds'),
            });
            return;
          }

          const fields = {
            from: { name: this.$t('meta.fromBig'), value: this.convertToBech32('wq', this.walletAddress) },
            to: { name: this.$t('meta.toBig'), value: this.convertToBech32('wq', this.ENV.WORKNET_PENSION_FUND) },
            fee: { name: this.$t('wallet.table.trxFee'), value: txFee.result.fee, symbol: TokenSymbols.WQT },
            amount: { name: this.$t('modals.amount'), value: amount, symbol: TokenSymbols.WUSD },
          };
          this.ShowModal({
            key: modals.transactionReceipt,
            fields,
            isDontOffLoader: true,
            submitMethod: async () => {
              await this.pensionContribute(amount);
            },
          });
        },
      });
    },
    openChangePercentModal() {
      this.ShowModal({
        key: modals.changePercent,
        submit: async (amount) => {
          const { balanceData } = this;
          this.selectedTable = PensionHistoryMethods.Update;
          this.CloseModal();
          this.SetLoader(true);
          const newAmount = new BigNumber(amount.substr(0, amount.length - 1) / 100).shiftedBy(18).toString();
          const [txFee] = await Promise.all([
            this.$store.dispatch('wallet/getContractFeeData', {
              method: 'updateFee',
              abi: WQPensionFund,
              contractAddress: this.ENV.WORKNET_PENSION_FUND,
              data: [newAmount],
            }),
            this.getWallet(),
          ]);
          this.SetLoader(false);

          if (!txFee?.ok || +balanceData.WUSD.balance === 0) {
            await this.$store.dispatch('main/showToast', {
              text: this.$t('errors.transaction.notEnoughFunds'),
            });
            return;
          }

          const fields = {
            from: { name: this.$t('meta.fromBig'), value: this.convertToBech32('wq', this.walletAddress) },
            to: { name: this.$t('meta.toBig'), value: this.convertToBech32('wq', this.ENV.WORKNET_PENSION_FUND) },
            fee: { name: this.$t('wallet.table.trxFee'), value: txFee.result.fee, symbol: TokenSymbols.WQT },
          };
          this.ShowModal({
            key: modals.transactionReceipt,
            fields,
            isDontOffLoader: true,
            submitMethod: async () => await this.$store.dispatch('retirement/pensionUpdateFee', newAmount),
          });
        },
      });
    },
    handleClickFAQ(FAQ) {
      FAQ.isOpen = !FAQ.isOpen;
    },
  },
};
</script>

<style lang="scss" scoped>
.pension-page {
  background: linear-gradient(to bottom, #103D7C 320px, #f6f8fa 320px);
  display: flex;
  justify-content: center;

  &__container {
    display: grid;
    grid-template-rows: 195px max-content;
    max-width: 1180px;
    grid-row-gap: 50px;
    width: 100%;
    gap: 20px;
    padding: 10px;
    box-sizing: border-box;

    &_expired {
      @extend .pension-page__container;
      gap: 15px;
    }
  }

  &__header {
    align-self: flex-end;

    .title {
      font-weight: 500;
      color: #FFF;
      width: 530px;
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
    grid-template-rows: 196px max-content;

    .btn-group {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      padding-bottom: 20px;
      width: calc(100% - 20px);

      &_exp {
        @extend .btn-group;
        grid-template-columns: repeat(3, 1fr);
      }
    }

    .btn {
      box-sizing: border-box;
      font-weight: 400;
      font-size: 16px;
      color: #0083C7;
      border: 1px solid #0083C71A;
      border-radius: 6px;
      transition: .3s;

      &__time-machine {
        @extend .btn;
        position: fixed;
        top: 130px;
        right: 15px;
        width: 20px;
        color: #fff;
        font-size: 0;

        &:hover {
          width: 150px;
          font-size: 16px;
        }
      }

      &:hover {
        background-color: #0083C71A;
        border: 0;
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
        @extend .btn_bl;
        background-color: #DF3333;
      }
    }

    .text {
      font-size: 16px;
      font-weight: 400;
      color: #8D96A1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      &__faq {
        color: #4C5767;
        font-weight: 500;

        &_gray {
          font-size: 16px;
          font-weight: 400;
          color: #8D96A1;
          height: 0;
          transition: height 300ms;
          overflow: hidden;
        }

        &_opened {
          height: auto;
          font-size: 16px;
          font-weight: 400;
          color: #8D96A1;
          transition: height 300ms;
          margin-top: 20px;
        }
      }

      &_blue {
        @extend .text;
        font-weight: 500;
        font-size: 18px;
        color: #0083C7;
      }

      &_small {
        @extend .text;
        font-size: 14px;
      }
    }

    .select-img {
      height: 7px;
      position: absolute;
      width: 12px;
      right: 30px;
      top: 30px;
      transition: 300ms;

      &_rotate {
        @extend .select-img;
        transform: rotate(180deg);
      }
    }

    .info-block {
      background-color: #fff;
      border-radius: 6px;

      &__select-table {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-gap: 20px;
        margin: 0 20px 5px 20px;
      }

      &__faqs {
        margin: 0 20px 20px 20px;
        display: grid;
        gap: 20px;
      }

      &__faq {
        border-radius: 5px;
        padding: 20px 60px 20px 20px;
        background-color: $black0;
        text-align: left;
        position: relative;
        transition: 300ms;
      }

      &__grid {
        @extend .info-block;
        display: grid;
        grid-template-columns: 5fr 4fr;
        grid-template-rows: 3fr 1fr;
        position: relative;
      }

      &__small {
        background-color: $black0;
        display: grid;
        grid-template-rows: repeat(2, 1fr);
        width: 115px;
        height: 66px;
        box-sizing: border-box;
        border-radius: 6px;
        margin: 20px 0 0 20px;
        padding-left: 10px;
        align-self: baseline;

        &_right {
          @extend .info-block__small;
          text-align: right;
          padding: 0 10px 0;
          justify-self: flex-end;
          margin: 20px 20px 0 0;
        }
      }

      &__pager {
        width: auto;
        margin-top: 25px;
      }

      &__perc {
        font-weight: 700;
        font-size: 20px;
        color: #0083C7;
        align-self: flex-end;
      }

      &__period {
        font-weight: 400;
        font-size: 16px;
        color: #0083C7;
        align-self: flex-start;
      }

      &__triple {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
      }

      &__third {
        @extend .info-block;
        display: grid;
        grid-template-rows: min-content min-content auto;

        .btn {
          align-self: flex-end;
          margin: 0 0 20px 20px;
          width: calc(100% - 40px);
        }

        &_rate {
          @extend .info-block__third;
          grid-template-rows: repeat(2, 1fr);
          align-items: flex-end;
        }
      }

      &__title {
        color: #0083C7;
        font-weight: 700;
        font-size: 25px;

        &_gray {
          color: #7C838D;
          font-weight: 400;
          font-size: 16px;
          margin-left: 20px;
        }
      }

      &__subtitle {
        font-weight: 400;
        font-size: 16px;
        color: #7C838D;

        &_black {
          @extend .info-block__title_gray;
          margin-bottom: 20px;
          color: #1D2127;
        }

        &_red {
          @extend .info-block__subtitle_black;
          color: #DF3333;
        }
      }

      &__tokens {
        font-weight: 700;
        font-size: 25px;
        color: $blue;
        padding: 0 20px;
      }

      &__table-title {
        font-size: 16px;
        padding: 20px;
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
    }

    &_expired {
      @extend .pension-page__content;
      grid-template-rows: 208px max-content;
    }
  }

  .ava {
    height: 33px;
    width: 33px;
    border-radius: 50%;
    background-color: #fff;
    flex: none;
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
  }

  &__table {
    border-radius: 6px !important;
    overflow: hidden;

    .table {
      margin: 20px 0 0 0;

      &:first-child {
        border-radius: 0 !important;
      }
    }
  }

  @include _1199 {
    &__content {
      .info-block {
        &__grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }
    }
  }

  @include _991 {
    background: linear-gradient(to bottom, #103D7C 245px, #f6f8fa 245px);
    &__content {
      .info-block {
        &__grid {
          grid-template-columns: 3fr 4fr;
        }
      }
    }
    &__table {
      overflow: auto;
      width: calc(100vw - 20px);

      .table {
        width: 1024px;

        & > .table {
          border-radius: 0 !important;
        }
      }
    }
  }

  @include _767 {
    background: linear-gradient(to bottom, #103D7C 220px, #f6f8fa 220px);
    &__container {
      grid-template-rows: auto auto;
      gap: 15px;
    }
    &__table {
      &__empty {
        .absence {
          margin-left: 10px;
        }
      }
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
      grid-template-rows: max-content max-content max-content;

      .info-block {
        &__triple {
          grid-template-rows: repeat(2, 1fr);
          grid-template-columns: repeat(2, 1fr);

          .info-block__third_rate {
            grid-column-start: 1;
            grid-column-end: 3;
          }
        }

        &__grid {
          grid-template-rows: 1fr auto auto;
          grid-template-columns: repeat(2, 1fr);
          align-items: end;
          grid-row-gap: 10px;

          .btn-group {
            grid-row-start: 3;
            grid-column-start: 1;
            grid-column-end: 3;
            justify-self: center;
          }
        }
      }
    }
  }

  @include _575 {
    &__header {
      .title {
        font-size: 32px;

        &_sub {
          font-size: 16px;
        }
      }
    }
    &__content {
      .info-block {
        &__select-table {
          grid-template-columns: 1fr;
          grid-template-rows: repeat(3, 1fr);
        }

        &__triple {
          grid-template-rows: repeat(3, 1fr);
          grid-template-columns: unset;

          .info-block__third_rate {
            grid-column-start: unset;
            grid-column-end: unset;
          }
        }

        &__grid {
          grid-template-columns: repeat(2, auto);

          .text-cont {
            grid-column-start: 1;
            grid-column-end: 3;
          }

          .btn-group {
            &_exp {
              grid-template-rows: repeat(2, 1fr);
              grid-template-columns: repeat(2, 1fr);

              .btn {
                &:last-child {
                  grid-row-start: 1;
                  grid-column-start: 1;
                  grid-column-end: 3;
                }
              }
            }
          }
        }
      }
    }
  }
}

.empty-info {
  & .absence {
    padding-bottom: 10px !important;
    margin: 0 !important;
    background: transparent !important;
  }
}
</style>
