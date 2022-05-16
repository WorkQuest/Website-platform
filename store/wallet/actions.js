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
} from '~/utils/wallet';

import {
  error,
  success,
  fetchContractData,
} from '~/utils/web3';

import {
  ERC20,
  WQStaking,
  WQStakingNative,
} from '~/abi/index';

import {
  TokenMap,
  TokenSymbols,
  StakingTypes,
  PensionHistoryMethods, WorknetTokenAddresses,
} from '~/utils/enums';
import {
  getPensionWallet,
  pensionsWithdraw,
  pensionUpdateFee,
  pensionContribute,
  pensionExtendLockTime,
  getPensionDefaultData,
} from '~/utils/wallet.js';

let connectionWS = null;

export default {
  async getPensionTransactions({ commit, getters }, { method, limit, offset }) {
    try {
      const path = method === PensionHistoryMethods.Update ? 'wallet-update' : method.toLowerCase();
      const res = await this.$axios.get(`/v1/pension-fund/${path}`, {
        params: {
          userAddress: getWalletAddress(),
          limit,
          offset,
        },
      });
      commit('setPensionHistoryData', { method, txs: res.data.result.events, count: res.data.result.count });
    } catch (e) {
      console.error('wallet/getPensionTransactions');
    }
  },
  async getTransactions({ commit }, params) {
    try {
      const { data } = await this.$axios({
        url: `/account/${getWalletAddress()}/transactions`,
        baseURL: process.env.WQ_EXPLORER,
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
    nuxt.setLayout('confirmPassword');
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
      nuxt.setLayout('confirmPassword');
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
  async getBalance({ commit }) {
    const res = await getBalance();
    commit('setBalance', {
      symbol: TokenSymbols.WQT,
      balance: res.ok ? res.result.balance : 0,
      fullBalance: res.ok ? res.result.fullBalance : 0,
    });
  },
  async fetchCommonTokenInfo({ commit }) {
    try {
      const tokens = await Promise.all(WorknetTokenAddresses.map(async (address) => await Promise.all([
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
        process.env.WORKNET_VOTING,
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
   * @param recipient
   * @param value
   */
  async transfer({ _ }, { recipient, value }) {
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
    // TODO fix it, sendWalletTransaction should return object with keys ok and result
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
      amount = new BigNumber(amount).shiftedBy(18).toString();
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

  /** PENSION PROGRAM */
  /** Get default lockTime & fee */
  async pensionGetDefaultData() {
    return await getPensionDefaultData();
  },
  async pensionGetWalletInfo({ commit }) {
    const res = await getPensionWallet();
    if (res.ok === false) {
      commit('setPensionWallet', null);
      return;
    }
    commit('setPensionWallet', res.result);
  },
  async pensionUpdateFee({ commit }, fee) {
    return await pensionUpdateFee(fee);
  },
  async pensionContribute({ commit }, amount) {
    return await pensionContribute(amount);
  },
  async pensionWithdraw({ commit }, amount) {
    return await pensionsWithdraw(amount);
  },
  async pensionStartProgram({ commit }, payload) {
    const { firstDeposit, fee, defaultFee } = payload;
    let feeOk = true;
    let depositOk = false;
    const equalsFee = new BigNumber(defaultFee).shiftedBy(-18).isEqualTo(new BigNumber(fee).shiftedBy(-18));
    if (!firstDeposit || !equalsFee) {
      feeOk = await pensionUpdateFee(fee);
    }
    if (firstDeposit) depositOk = await pensionContribute(firstDeposit);
    else return feeOk;
    return depositOk && feeOk;
  },
  async pensionExtendLockTime() {
    return await pensionExtendLockTime();
  },

  /** Staking */
  async getStakingPoolsData({ commit }, pool) {
    let abi = null;
    let contractAddress = null;
    if (pool === StakingTypes.WQT) {
      abi = WQStaking;
      contractAddress = process.env.WORKNET_STAKING_WQT;
    } else if (pool === StakingTypes.WUSD) {
      abi = WQStakingNative;
      contractAddress = process.env.WORKNET_STAKING_WUSD;
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
    const contractAddress = pool === StakingTypes.WUSD ? process.env.WORKNET_STAKING_WUSD : process.env.WORKNET_STAKING_WQT;
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
  }, { hexAddress, timestamp, updateWalletData }) {
    try {
      connectionWS = new WebSocket(process.env.WS_WQ_PROVIDER);
      connectionWS.onopen = () => {
        const request = {
          jsonrpc: '2.0',
          method: 'subscribe',
          id: 0,
          params: {
            query: "tm.event='Tx'",
            // When the backend adds a new websocket you need to switch to this query to find the specific user's tx correctly.
            // Also need to find out what address type you need to enter Hex or convert to bech 32
            // query: `tm.event='Tx' AND ethereum_tx.recipient='${hexAddress}'`,
          },
        };
        console.log('Successfully connected to the echo websocket server...');
        connectionWS.send(JSON.stringify(request));
      };
      connectionWS.onmessage = async (ev) => {
        const { events } = JSON.parse(ev.data).result;
        const recipient = events ? events['ethereum_tx.recipient'][0].toLowerCase() : null;
        if (recipient === hexAddress) {
          const transactions = JSON.parse(JSON.stringify(getters.getTransactions));
          if (transactions.length === 10) transactions.splice(9, 1);
          transactions.unshift({
            hash: events['tx.hash'][0].toLowerCase(),
            block_number: events['tx.height'][0],
            block: { timestamp },
            status: true,
            value: events['ethereum_tx.amount'][0],
            transaction_fee: +(events['tx.fee'][0].split('a')[0]),
            from_address_hash: { hex: events['message.sender'][3] },
            to_address_hash: { hex: recipient },
          });
          await updateWalletData();
          commit('setTransactions', transactions);
          commit('setTransactionsCount', getters.getTransactionsCount + 1);
        }
      };
      return true;
    } catch (err) {
      console.error(err);
      return error();
    }
  },
  async unsubscribeWS({ _ }) {
    connectionWS = null;
  },
};
