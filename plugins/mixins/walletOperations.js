import BigNumber from 'bignumber.js';
import { QuestMethods, QuestStatuses } from '~/utils/сonstants/quests';
import { ERC20, WorkQuest } from '~/abi';
import modals from '~/store/modals/modals';
import { TokenSymbols } from '~/utils/enums';

export default {
  methods: {
    async DeleteQuest(questData) {
      const { status, contractAddress } = questData;
      if (contractAddress && [QuestStatuses.Closed, QuestStatuses.Created].includes(status)) {
        this.SetLoader(true);
        const [feeRes] = await Promise.all([
          this.$store.dispatch('quests/getFeeDataJobMethod', {
            abi: WorkQuest,
            method: QuestMethods.CancelJob,
            contractAddress,
          }),
          this.$store.dispatch('wallet/getBalance'),
        ]);
        this.SetLoader(false);
        if (!feeRes.ok) {
          this.ShowToast(feeRes.msg);
          return;
        }
        this.ShowModal({
          key: modals.transactionReceipt,
          title: this.$t('meta.btns.closeQuest'),
          fields: {
            from: { name: this.$t('meta.fromBig'), value: this.$store.getters['user/getUserWalletAddress'] },
            to: { name: this.$t('meta.toBig'), value: contractAddress },
            fee: { name: this.$t('wallet.table.trxFee'), value: feeRes.result.fee.toString(), symbol: TokenSymbols.WUSD },
          },
          submitMethod: async () => {
            this.SetLoader(true);
            const trxRes = await this.$store.dispatch('quests/cancelJob', contractAddress);
            this.SetLoader(false);
            if (!trxRes.ok) {
              this.ShowToast(trxRes.msg);
              return;
            }
            const routeName = this.$route.name;
            if (routeName === 'quests-id') {
              await this.$router.replace('/my');
            } else if (routeName === 'my' || routeName === 'profile-id') {
              const payload = JSON.parse(sessionStorage.getItem('questsListFilter'));
              await this.$store.dispatch('quests/getUserQuests', payload);
            }
            this.ShowToast(this.$t('toasts.questDeleted'), this.$t('toasts.questDeleted'));
          },
        });
      } else {
        await this.$store.dispatch('main/showToast', {
          title: this.$t('meta.questInfo'),
          variant: 'warning',
          text: this.$t('toasts.questCantDelete'),
        });
      }
    },

    /**
     * Check allowance and making approve
     * @param tokenAddress - token
     * @param contractAddress - recipient
     * @param amount - token amount
     * @param approveTitle - title for modal
     * @param decimals - approve token decimals
     * @param symbol - approve token symbol
     * @param nativeTokenSymbol - true -> WQT/ETH etc.
     * @param isHexUserWalletAddress - display from address as hex address
     * @returns {Promise<unknown>}
     * @constructor
     */
    async MakeApprove({
      tokenAddress, contractAddress, amount,
      approveTitle = this.$t('meta.approve'),
      decimals = 18,
      symbol = TokenSymbols.WUSD,
      nativeTokenSymbol = TokenSymbols.WQT,
      isHexUserWalletAddress,
    }) {
      return new Promise(async (resolve, reject) => {
        const allowance = await this.$store.dispatch('wallet/getAllowance', {
          tokenAddress,
          spenderAddress: contractAddress,
          decimals: +decimals,
        });

        if (new BigNumber(allowance).isLessThan(amount)) {
          const needApprove = new BigNumber(allowance).isZero(); // or need increaseAllowance
          const [txFee] = await Promise.all([
            this.$store.dispatch('wallet/getContractFeeData', {
              method: needApprove ? 'approve' : 'increaseAllowance',
              abi: ERC20,
              contractAddress: tokenAddress,
              data: [contractAddress, new BigNumber(amount).shiftedBy(Number(decimals)).toFixed(0).toString()],
            }),
            this.$store.dispatch('wallet/getBalance'),
          ]);

          this.SetLoader(false);
          if (!txFee.ok) {
            this.ShowToast(needApprove);
            reject();
            return;
          }

          this.ShowModal({
            key: modals.transactionReceipt,
            title: approveTitle,
            fields: {
              from: {
                name: this.$t('meta.fromBig'),
                value: isHexUserWalletAddress ? this.userWalletAddress : this.convertToBech32('wq', this.userWalletAddress),
              },
              to: { name: this.$t('meta.toBig'), value: contractAddress },
              amount: { name: this.$t('modals.amount'), value: amount, symbol },
              fee: { name: this.$t('wallet.table.trxFee'), value: txFee.result.fee, symbol: nativeTokenSymbol },
            },
            submitMethod: async () => {
              this.ShowToast('Approving...', 'Approve');
              const approveOk = await this.$store.dispatch('wallet/approve', {
                tokenAddress,
                spenderAddress: contractAddress,
                amount,
                decimals: +decimals,
              });
              if (!approveOk) {
                this.ShowToast('Approve error');
                reject();
                return;
              }
              this.ShowToast('Approving done', 'Approve');
              await resolve(amount);
            },
            cancel: async () => await reject(new Error('Cancel')),
          });
        } else await resolve(amount);
      });
    },
  },
};
