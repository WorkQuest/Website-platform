export default () => ({
  pensionWallet: null,
  pensionHistory: {
    Update: { txs: [], count: 0 },
    Receive: { txs: [], count: 0 },
    Withdraw: { txs: [], count: 0 },
  },
});
