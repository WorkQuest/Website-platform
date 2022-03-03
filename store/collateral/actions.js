import BigNumber from 'bignumber.js';
import {
  approveRouter, buyWUSD, getAllowance, getGasPrice, getWalletAddress, setTokenPrice,
} from '~/utils/wallet';
import modals from '~/store/modals/modals';
import * as abi from '~/abi/abi';
import { TokenSymbols } from '~/utils/enums';

export default {
  async setTokenPrice({ dispatch, rootGetters }, { payload, setTokenPriceData }) {
    try {
      await setTokenPrice(payload, setTokenPriceData);
    } catch (e) {
      console.log('can not refresh prices');
    }
    const tokenMap = {
      BNB: process.env.BNB_TOKEN,
      ETH: process.env.ETH_TOKEN,
      WQT: process.env.WQT_TOKEN,
    };
    const allowance = await getAllowance(rootGetters['user/getUserWalletAddress'], process.env.WQ_ROUTER, payload.currency);
    const isNeedApprove = new BigNumber(payload.amount).shiftedBy(18).isGreaterThan(allowance);

    if (isNeedApprove) {
      const resultGasApprove = await getGasPrice(abi.ERC20, tokenMap[payload.currency], 'approve', [process.env.WQ_ROUTER, payload.amountBN]);
      const approveData = {
        gasPrice: resultGasApprove.gasPrice,
        gas: resultGasApprove.gas,
      };
      dispatch('modals/show', {
        key: modals.transactionReceipt,
        fields: {
          from: { name: this.app.i18n.t('modals.fromAddress'), value: getWalletAddress() },
          fee: { name: this.app.i18n.t('wallet.table.trxFee'), value: new BigNumber(approveData.gasPrice).shiftedBy(-18).toFixed(), symbol: TokenSymbols.WUSD },
        },
        submitMethod: async () => {
          await dispatch('approveRouter', { payload, approveData });
        },
      }, { root: true });
    } else {
      const resultGasBuyWUSD = await getGasPrice(abi.WQRouter, process.env.WQ_ROUTER, 'produceWUSD', [payload.amountBN, payload.percentBN, payload.currency]);
      const buyWUSDData = {
        gasPrice: resultGasBuyWUSD.gasPrice,
        gas: resultGasBuyWUSD.gas,
      };
      dispatch('modals/show', {
        key: modals.transactionReceipt,
        fields: {
          from: { name: this.app.i18n.t('modals.fromAddress'), value: getWalletAddress() },
          to: { name: this.app.i18n.t('modals.toAddress'), value: process.env.WQ_ROUTER },
          amount: {
            name: this.app.i18n.t('modals.amount'),
            value: payload.collateral,
            symbol: payload.currency,
          },
          fee: { name: this.app.i18n.t('wallet.table.trxFee'), value: new BigNumber(resultGasBuyWUSD.gasPrice).shiftedBy(-18).toFixed(), symbol: TokenSymbols.WUSD },
        },
        submitMethod: async () => {
          await dispatch('buyWUSD', { payload, buyWUSDData });
        },
      }, { root: true });
    }
  },
  async approveRouter({ dispatch, rootGetters }, { payload, approveData }) {
    try {
      await approveRouter(payload, approveData);
    } catch (e) {
      console.log('can not approve');
    }
    const resultGasBuyWUSD = await getGasPrice(abi.WQRouter, process.env.WQ_ROUTER, 'produceWUSD', [payload.amountBN, payload.percentBN, payload.currency]);
    const buyWUSDData = {
      gasPrice: resultGasBuyWUSD.gasPrice,
      gas: resultGasBuyWUSD.gas,
    };
    dispatch('modals/show', {
      key: modals.transactionReceipt,
      fields: {
        from: { name: this.app.i18n.t('modals.fromAddress'), value: getWalletAddress() },
        to: { name: this.app.i18n.t('modals.toAddress'), value: process.env.WQ_ROUTER },
        amount: {
          name: this.app.i18n.t('modals.amount'),
          value: payload.collateral,
          symbol: payload.currency,
        },
        fee: { name: this.app.i18n.t('wallet.table.trxFee'), value: new BigNumber(resultGasBuyWUSD.gasPrice).shiftedBy(-18).toFixed(), symbol: TokenSymbols.WUSD },
      },
      submitMethod: async () => {
        await dispatch('buyWUSD', { payload, buyWUSDData });
      },
    }, { root: true });
  },
  async buyWUSD(ctx, { payload, buyWUSDData }) {
    try {
      await buyWUSD(payload, buyWUSDData);
    } catch (e) {
      console.log('can not buy WUSD');
    }
  },
};
