import BigNumber from 'bignumber.js';

import {
  stake,
  transfer,
  disconnect,
  getBalance,
  connectWallet,
  getStyledAmount,
  getWalletAddress,
  GetWalletProvider,
  getTransferFeeData,
  getContractFeeData,
  getIsWalletConnected,
  sendWalletTransaction,
  connectWalletToProvider,
} from '~/utils/wallet';

import {
  error,
  success,
  showToast,
  getEstimateGas,
  fetchContractData,
} from '~/utils/web3';

import {
  BuyWQT,
  ERC20,
  WQStaking,
  WQStakingNative,
} from '~/abi/index';

import {
  Chains,
  TokenMap,
  StakingTypes,
  TokenSymbols,
  WalletTokensData,
  ProviderTypesByChain,
  TokenSymbolByContract,
} from '~/utils/enums';

import ENV from '~/utils/addresses/index';
import { LocalNotificationAction } from '~/utils/notifications';

let connectionWS = null;
let callbackWS = null;

export default {
  async getTransactions({ commit }, params) {
    try {
      const { data } = await this.$axios({
        url: `/account/${getWalletAddress()}/transactions`,
        baseURL: ENV.WQ_EXPLORER,
        params,
      });
      commit('setTransactions', data.result.transactions);
      commit('setTransactionsCount', data.result.count);
    } catch (e) {
      commit('setTransactions', []);
      commit('setTransactionsCount', 0);
    }
  },
  async checkPassword({ commit }, password) {
    try {
      const res = await this.$axios.$post('/v1/auth/validate-password', { password });
      return res?.result?.isValid;
    } catch (e) {
      return false;
    }
  },
  confirmPassword({ commit, getters }, { nuxt, callbackLayout }) {
    if (callbackLayout) commit('setCallbackLayout', callbackLayout);
    commit('setIsOnlyConfirm', true);
    nuxt.setLayout('confirm');
  },
  /**
   * Check wallet is connected
   * @returns boolean
   */
  checkWalletConnected({ commit, getters }, { nuxt, callbackLayout }) {
    const connected = getIsWalletConnected();
    commit('setIsOnlyConfirm', false);
    if (!connected) {
      if (callbackLayout) commit('setCallbackLayout', callbackLayout);
      nuxt.setLayout('confirm');
    } else {
      commit('setIsWalletConnected', true);
    }
  },
  /**
   * Connect wallet with password
   * Use when checkWalletConnected from confirmPassword modal
   * @param commit
   * @param getters
   * @param userAddress
   * @param userPassword
   */
  connectWallet({ commit }, { userWalletAddress, userPassword }) {
    const res = connectWallet(userWalletAddress, userPassword);
    if (res?.ok) commit('setIsWalletConnected', true);
    return res;
  },
  disconnect() {
    disconnect();
  },
  setSelectedToken({ commit }, token) {
    commit('setSelectedToken', token);
  },
  async getBalance({ commit, getters }) {
    const chain = getters.getSelectedNetwork;
    const token = WalletTokensData[chain].tokenList[0];
    const res = await getBalance();
    commit('setBalance', {
      symbol: token,
      balance: res.ok ? res.result.balance : 0,
      fullBalance: res.ok ? res.result.fullBalance : 0,
    });
  },
  async fetchCommonTokenInfo({ commit, getters }) {
    try {
      const chain = getters.getSelectedNetwork;
      const tokens = await Promise.all(WalletTokensData[chain].tokenAddresses.map(async (address) => await Promise.all([
        fetchContractData('symbol', ERC20, address, [], GetWalletProvider()),
        fetchContractData('decimals', ERC20, address, [], GetWalletProvider()),
      ])));
      tokens.forEach((item) => commit('setCommonTokenData', item));
    } catch (e) {
      console.error('wallet/fetchCommonTokenInfo');
    }
  },
  async updateFrozenBalance({ commit, rootGetters }) {
    try {
      const res = await fetchContractData(
        'frozed',
        ERC20,
        ENV.WORKNET_VOTING,
        [rootGetters['user/getUserWalletAddress']],
        GetWalletProvider(),
      );
      commit('wallet/setFrozenBalance', res
        ? new BigNumber(res).shiftedBy(-18).toString()
        : '0', { root: true });
      return success(res);
    } catch (e) {
      return error(-1, e.message, e);
    }
  },
  async fetchWalletData({ commit, getters }, {
    method, address, abi, token, symbol,
  }) {
    try {
      const res = await fetchContractData(
        method,
        abi,
        token,
        [address],
        GetWalletProvider(),
      );
      const { decimals } = getters.getBalanceData[symbol];
      commit('setBalance', {
        symbol,
        balance: res ? getStyledAmount(res, false, decimals) : 0,
        fullBalance: res ? getStyledAmount(res, true, decimals) : 0,
      });
      return success(res);
    } catch (e) {
      return error(e.message, e);
    }
  },
  /**
   * Send transfer of native token
   * @param _
   * @param recipient
   * @param value
   */
  async transfer(_, { recipient, value }) {
    return await transfer(recipient, value);
  },
  async getTransferFeeData({ commit }, { recipient, value }) {
    return await getTransferFeeData(recipient, value);
  },
  /**
   * Send transfer for WQT token
   * @param payload
   * @param recipient
   */
  async transferToken({ _ }, payload) {
    const res = await sendWalletTransaction('transfer', payload);
    if (res.ok === false) return error(res);
    return success(res);
  },
  /**
   * Get Fee Data from contract method
   * @param commit
   * @param method
   * @param abi
   * @param contractAddress
   * @param data - Array []
   * @param recipient
   * @param amount - decimal value
   * @returns {Promise<{result: *, ok: boolean}|{msg: string, code: number, data: null, ok: boolean}|undefined>}
   */
  async getContractFeeData({ commit }, {
    method, abi, contractAddress, data, recipient, amount,
  }) {
    return await getContractFeeData(method, abi, contractAddress, data, recipient, amount);
  },

  async approve({ commit }, { tokenAddress, spenderAddress, amount }) {
    try {
      amount = new BigNumber(amount).shiftedBy(18).toFixed(0).toString();
      return await sendWalletTransaction(
        'approve',
        {
          abi: ERC20,
          address: tokenAddress,
          data: [spenderAddress, amount],
        },
      );
    } catch (e) {
      console.error('Approve error', e.message);
      return false;
    }
  },
  async getAllowance({ commit }, { tokenAddress, spenderAddress }) {
    const res = await fetchContractData('allowance', ERC20, tokenAddress, [getWalletAddress(), spenderAddress], GetWalletProvider());
    if (!res) return false;
    return new BigNumber(res.toString()).shiftedBy(-18).toString();
  },

  /** Staking */
  async getStakingPoolsData({ commit }, pool) {
    let abi = null;
    let contractAddress = null;
    if (pool === StakingTypes.WQT) {
      abi = WQStaking;
      contractAddress = ENV.WORKNET_STAKING_WQT;
    } else if (pool === StakingTypes.WUSD) {
      abi = WQStakingNative;
      contractAddress = ENV.WORKNET_STAKING_WUSD;
    } else {
      console.error(`Wrong pool: ${pool}`);
      return;
    }
    const stakingInfo = await fetchContractData('getStakingInfo', abi, contractAddress, null, GetWalletProvider());
    if (!stakingInfo) {
      commit('setStakingPoolData', { pool });
      return;
    }

    let {
      // eslint-disable-next-line prefer-const
      rewardTokenAddress, totalStaked, totalDistributed, rewardTotal, maxStake, minStake,
    } = stakingInfo;

    let decimals = 18;
    let tokenSymbol = TokenSymbols.WUSD;
    if (pool !== StakingTypes.WUSD) {
      [decimals, tokenSymbol] = await Promise.all([
        fetchContractData('decimals', ERC20, rewardTokenAddress, null, GetWalletProvider()),
        fetchContractData('symbol', ERC20, rewardTokenAddress, null, GetWalletProvider()),
      ]);
    }

    commit('setStakingPoolData', {
      pool,
      data: {
        ...stakingInfo,
        link: pool,
        poolAddress: contractAddress,
        decimals,
        tokenSymbol,
        isNative: tokenSymbol === StakingTypes.WUSD,
        stakeTokenSymbol: tokenSymbol,
        claimPeriod: new BigNumber(stakingInfo.claimPeriod / 60).decimalPlaces(3).toString(),
        stakePeriod: new BigNumber(stakingInfo.stakePeriod / 60).decimalPlaces(3).toString(),
        distributionTime: new BigNumber(stakingInfo.distributionTime / 60).decimalPlaces(3).toString(),
        totalStaked: getStyledAmount(totalStaked, false, decimals),
        totalDistributed: getStyledAmount(totalDistributed, false, decimals),
        rewardTotal: getStyledAmount(rewardTotal, false, decimals),
        maxStake: getStyledAmount(maxStake, false, decimals),
        fullMaxStake: getStyledAmount(maxStake, true, decimals),
        minStake: getStyledAmount(minStake, false, decimals),
        fullMinStake: getStyledAmount(minStake, true, decimals),
      },
    });
  },
  async getStakingUserInfo({ commit }, pool) {
    const decimals = 18;
    const abi = pool === StakingTypes.WUSD ? WQStakingNative : WQStaking;
    const contractAddress = pool === StakingTypes.WUSD ? ENV.WORKNET_STAKING_WUSD : ENV.WORKNET_STAKING_WQT;
    const [userInfo, stakes] = await Promise.all([
      fetchContractData('getInfoByAddress', abi, contractAddress, [getWalletAddress()], GetWalletProvider()),
      fetchContractData('stakes', abi, contractAddress, [getWalletAddress()], GetWalletProvider()),
    ]);
    const { _balance, claim_, staked_ } = userInfo;
    const { unstakeTime } = stakes;
    commit('setStakingUserData', {
      pool,
      data: {
        ...userInfo,
        isStakingStarted: pool === StakingTypes.WUSD || +stakes.stakedAt !== 0,
        date: unstakeTime ? new Date(unstakeTime * 1000) : false,
        claim: getStyledAmount(claim_, false, decimals),
        fullClaim: getStyledAmount(claim_, true, decimals),
        staked: getStyledAmount(staked_, false, decimals),
        fullStaked: getStyledAmount(staked_, true, decimals),
        balance: getStyledAmount(_balance, false, decimals),
        fullBalance: getStyledAmount(_balance, true, decimals),
      },
    });
  },
  async stake({ commit }, {
    stakingType, amount, poolAddress, duration,
  }) {
    return await stake(stakingType, amount, poolAddress, duration);
  },
  async getStakingUnstakeFeeData({ dispatch }, { stakingType, poolAddress, amount }) {
    return await dispatch('getContractFeeData', {
      method: 'unstake',
      abi: stakingType === StakingTypes.WUSD ? WQStakingNative : WQStaking,
      contractAddress: poolAddress,
      data: [amount ? new BigNumber(amount).shiftedBy(18).toString() : '1'],
    });
  },
  async getStakingRenewalFeeData({ dispatch }, { stakingType, poolAddress }) {
    return await dispatch('getContractFeeData', {
      method: 'autoRenewal',
      abi: stakingType === StakingTypes.WUSD ? WQStakingNative : WQStaking,
      contractAddress: poolAddress,
    });
  },
  async getStakingClaimFeeData({ dispatch }, { stakingType, poolAddress }) {
    return await dispatch('getContractFeeData', {
      method: 'claim',
      abi: stakingType === StakingTypes.WUSD ? WQStakingNative : WQStaking,
      contractAddress: poolAddress,
    });
  },
  async getStakeFeeForAmount({ dispatch }, {
    amount, stakingType, poolAddress, days,
  }) {
    const isNative = stakingType === StakingTypes.WUSD;
    return await dispatch('getContractFeeData', {
      abi: isNative ? WQStakingNative : WQStaking,
      contractAddress: poolAddress,
      method: 'stake',
      amount: isNative ? amount : null,
      data: isNative ? null : [new BigNumber(amount).shiftedBy(18).toString(), days.toString()],
    });
  },
  async getStakingApproveFeeData({ dispatch }, { stakeTokenAddress, poolAddress, fullMaxStake }) {
    fullMaxStake = new BigNumber(fullMaxStake).shiftedBy(18).toString();
    return await dispatch('getContractFeeData', {
      abi: ERC20,
      method: 'approve',
      contractAddress: stakeTokenAddress,
      data: [poolAddress, fullMaxStake],
    });
  },
  async stakingUnstake({ commit }, { amount, stakingType, poolAddress }) {
    try {
      amount = new BigNumber(amount).shiftedBy(18).toString();
      const abi = stakingType === StakingTypes.WUSD ? WQStakingNative : WQStaking;
      const res = await sendWalletTransaction(
        'unstake',
        {
          abi,
          address: poolAddress,
          data: [amount],
        },
      );
      return success(res);
    } catch (e) {
      console.error('Unstake error', e.message);
      return error(9000, e.message);
    }
  },
  async stakingClaimRewards({ commit }, { stakingType, poolAddress }) {
    try {
      const abi = stakingType === StakingTypes.WUSD ? WQStakingNative : WQStaking;
      await sendWalletTransaction('claim', { abi, address: poolAddress });
      return success();
    } catch (e) {
      console.error('Claim error', e.message);
      return error();
    }
  },
  async stakingRenewal({ commit }, { stakingType, poolAddress }) {
    try {
      const abi = stakingType === StakingTypes.WUSD ? WQStakingNative : WQStaking;
      return success(await sendWalletTransaction('autoRenewal', { abi, address: poolAddress }));
    } catch (e) {
      console.error('Renewal error', e.message);
      return error();
    }
  },
  async approveRouter({ commit, dispatch }, { symbol, spenderAddress, value }) {
    const tokenAddress = TokenMap[symbol];
    try {
      const allowance = await dispatch('getAllowance', { tokenAddress, spenderAddress });
      if (new BigNumber(allowance).isLessThanOrEqualTo(value)) {
        return await dispatch('approve', {
          tokenAddress,
          spenderAddress,
          amount: value,
        });
      }
      return true;
    } catch (e) {
      console.error('approveRouter error', e.message);
      return error();
    }
  },
  async subscribeWS({
    commit, dispatch, rootGetters, getters,
  }, { hexAddress, timestamp }) {
    try {
      const network = getters.getSelectedNetwork;
      const { WSProvider } = WalletTokensData[network];

      if (!WSProvider) {
        console.error('WSProvider not found for:', network);
        return error();
      }

      const requestByNetwork = {
        [Chains.ETHEREUM]: {
          jsonrpc: '2.0',
          method: 'eth_subscribe',
          id: 1,
          params: ['logs', { /* address: [hexAddress] */ }],
        },
        [Chains.BINANCE]: {
          jsonrpc: '2.0',
          method: 'eth_subscribe',
          id: 1,
          params: ['logs'],
        },
        [Chains.POLYGON]: {
          jsonrpc: '2.0',
          method: 'eth_subscribe',
          id: 1,
          params: ['logs'],
        },
        [Chains.WORKNET]: {
          jsonrpc: '2.0',
          method: 'subscribe',
          id: 0,
          params: {
            query: "tm.event='Tx'",
            // When the backend adds a new websocket you need to switch to this query to find the specific user's tx correctly.
            // Also need to find out what address type you need to enter Hex or convert to bech 32
            // query: `tm.event='Tx' AND ethereum_tx.recipient='${hexAddress}'`,
          },
        },
      };

      connectionWS = new WebSocket(WSProvider);
      connectionWS.onopen = () => {
        connectionWS.send(JSON.stringify(requestByNetwork[network]));
      };
      connectionWS.onmessage = async (ev) => {
        const events = JSON.parse(ev.data)?.result?.events;
        const recipient = events ? events['ethereum_tx.recipient'][0] : null;

        const sender = events && events['message.sender'] ? events['message.sender'][3]?.toLowerCase() : null;
        if (recipient && sender !== hexAddress) {
          await dispatch('notifications/createLocalNotification', {
            message: $nuxt.$t('ui.notifications.balanceUpdated', {
              token: TokenSymbolByContract[recipient?.toLowerCase()] || TokenSymbols.WQT,
            }),
            actionBtn: $nuxt.$t('meta.btns.view'),
            action: LocalNotificationAction.WALLET_UPDATE,
          }, { root: true });
        }

        if (recipient?.toLowerCase() === hexAddress) {
          if (callbackWS) await callbackWS();
          if (network !== Chains.WORKNET) return;
          const transactions = JSON.parse(JSON.stringify(getters.getTransactions));
          if (transactions.length === 10) transactions.splice(9, 1);
          transactions.unshift({
            hash: events['tx.hash'][0].toLowerCase(),
            block_number: events['tx.height'][0],
            block: { timestamp },
            status: true,
            value: events['ethereum_tx.amount'][0],
            transaction_fee: +(events['tx.fee'][0].split('a')[0]),
            from_address_hash: { hex: sender },
            to_address_hash: { hex: recipient },
          });
          commit('setTransactions', transactions);
          commit('setTransactionsCount', getters.getTransactionsCount + 1);
        }
      };
      return success();
    } catch (err) {
      console.error(err);
      return error();
    }
  },
  async unsubscribeWS({ _ }) {
    connectionWS?.close();
    connectionWS = null;
  },
  async setCallbackWS({ _ }, callback) {
    callbackWS = callback;
  },

  /** BuyWQT */
  async swap({ commit, dispatch, rootGetters }, {
    amount, bridgeAddress, isNative, symbol, toChainIndex, decimals,
  }) {
    try {
      const provider = GetWalletProvider();

      const userId = rootGetters['user/getUserData'].id;
      const accountAddress = getWalletAddress();
      const nonce = await provider.eth.getTransactionCount(accountAddress);
      const bridgeInstance = await new provider.eth.Contract(BuyWQT, bridgeAddress);
      const value = new BigNumber(amount).shiftedBy(Number(decimals)).toString();
      const data = [nonce, toChainIndex, value, accountAddress, userId, symbol];

      if (isNative) {
        showToast('Swapping', 'Swapping...', 'success');
        const [gasPrice, gas] = await Promise.all([
          provider.eth.getGasPrice(),
          getEstimateGas(null, null, bridgeInstance, 'swap', data, value),
        ]);
        const swapRes = await bridgeInstance.methods.swap(...data).send({
          from: accountAddress,
          value,
          gasPrice,
          gas,
        });
        showToast('Swapping', 'Swapping done', 'success');
        return success(swapRes);
      }

      showToast('Swapping', 'Swapping...', 'success');
      const [gasPrice, gas] = await Promise.all([
        provider.eth.getGasPrice(),
        getEstimateGas(null, null, bridgeInstance, 'swap', data),
      ]);
      const swapRes = await bridgeInstance.methods.swap(...data).send({
        from: accountAddress,
        gasPrice,
        gas,
      });
      showToast('Swapping', 'Swapping done', 'success');

      return success(swapRes);
    } catch (e) {
      console.error('Error in swap:', e);
      showToast('Swapping error', e.message, 'danger');
      return error(e.code, 'Error in swap action', e.data);
    }
  },

  /** SWITCH NETWORK */
  async connectToProvider({ commit, dispatch, rootGetters }, chain) {
    const res = await connectWalletToProvider(ProviderTypesByChain[chain]);
    if (res.ok) {
      commit('setSelectedNetwork', chain);
      commit('setSelectedToken', WalletTokensData[chain].tokenList[0]);

      await Promise.all([
        dispatch('fetchCommonTokenInfo'),
        dispatch('unsubscribeWS'),
      ]);

      const userWalletAddress = rootGetters['user/getUserWalletAddress'];
      // subscribe to WS wallet txs
      await dispatch('subscribeWS', {
        hexAddress: userWalletAddress,
        timestamp: $nuxt.$moment(),
      });

      $nuxt.ShowToast(`Current: ${chain}`, 'Network switched');
    } else {
      $nuxt.ShowToast(res.msg, 'Error on switch network');
    }
    return res;
  },
};
