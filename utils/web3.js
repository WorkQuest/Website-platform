import Web3 from 'web3';
import Web4 from '@cryptonteam/web4';

let web3 = null;
let web4 = null;

let pingTimer = null;
let account = {};

export const success = (res) => ({
  ok: true,
  result: res,
});

export const error = (code = 90000, msg = '', data = null) => ({
  ok: false,
  code,
  msg,
  data,
});

const getChainTypeById = (chainId) => {
  if (+chainId === 1 || +chainId === 4) {
    return 0;
  }
  if (+chainId === 56 || +chainId === 97) {
    return 1;
  }
  if (+chainId === 80001 || +chainId === 137) {
    return 2;
  }
  return -1;
};

export const startPingingMetamask = async (callback) => {
  try {
    if (web3) {
      clearInterval(pingTimer);
      const referenceAddress = await web3.eth.getCoinbase();
      const referenceChainId = await web3.eth.net.getId();
      pingTimer = setInterval(async () => {
        const address = await web3.eth.getCoinbase();
        const chainId = await web3.eth.net.getId();
        const isChangedAddress = address !== referenceAddress;
        const isChangedNetId = chainId !== referenceChainId;
        if (isChangedAddress || isChangedNetId) {
          callback();
          clearInterval(pingTimer);
        }
      }, 2000);
    }
    return success();
  } catch (err) {
    return error(500, 'pingingMetamask err', err);
  }
};

export const initWeb3Contract = async (abi, address) => {
  try {
    const contract = await new web3.eth.Contract(abi, address, { from: account.address });
    return contract;
  } catch (e) {
    return error(500, '', e.message);
  }
};

export const initWeb3 = async () => {
  try {
    if (window.ethereum) {
      web3 = new Web3(window.ethereum);
      if ((await web3.eth.getCoinbase()) === null) {
        await window.ethereum.enable();
      }
      const [userAddress, chainId] = await Promise.all([
        web3.eth.getCoinbase(),
        web3.eth.net.getId(),
      ]);

      if (process.env.PROD === 'true' && (+chainId !== 1)) {
        return error(500, 'Wrong blockchain in metamask', 'Current site work on mainnet. Please change network.');
      }

      if (process.env.PROD === 'false' && (+chainId !== 4)) {
        return error(500, 'Wrong blockchain in metamask', 'Current site work on testnet. Please change network.');
      }

      account = {
        address: userAddress,
        netId: chainId,
        netType: getChainTypeById(chainId),
      };

      web4 = new Web4();
      await web4.setProvider(window.ethereum, userAddress);
      return success(account);
    }
    return 'ok';
  } catch (err) {
    return error(500, '', err.message);
  }
};

export const disconnectWeb3 = () => {
  web3 = null;
  web4 = null;
  account = {};
};

export const createInstance = async (abi, address) => {
  const abs = web4.getContractAbstraction(abi);
  return await abs.getInstance(address);
};

export const getAccount = () => account;

export const stake = async (_stakeType, _amount) => {
  try {
    await preInitStake();
    const stakeInstanse = getStakeInstance(_stakeType);
    const tokenInstance = getStakeTokenInstanse(_stakeType);
    const recipient = stakeInstanse.address;
    const decimals = getStakeTokenDecimals(_stakeType);
    const form = 10 ** decimals;
    let amount = Math.floor(_amount * form) / form;
    amount = new BigNumber(amount.toString()).shiftedBy(+decimals).toString();
    console.log('amount with precision', amount);
    const allowance = new BigNumber(await tokenInstance.allowance(userAddress, recipient)).toString();
    console.log('Allowance: ', allowance);
    if (+allowance < +amount) {
      store.dispatch('main/setStatusText', 'Approving');
      console.log('Approving...');
      await tokenInstance.approve(recipient, new BigNumber('1000000').shiftedBy(+decimals).toString());
    }
    console.log('Staking...');
    store.dispatch('main/setStatusText', 'Staking');
    const response = await stakeInstanse.stake(amount);
    console.log('Staking done');
    return output(response);
  } catch (err) {
    return error(500, 'stake error', err);
  }
};
