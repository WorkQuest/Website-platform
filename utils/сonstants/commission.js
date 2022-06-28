// 1% комиссии за создание или редактирование (при повышении цены) квеста
export const CommissionForCreatingAQuest = Object.freeze(0.025);

// wallet page buy wqt
export const WQTBuyCommission = {
  master: 0,
  testnet: 0,
  develop: 0.01,
}[process.env.BRANCH]; // will calc final value us: 1 - WQTBuyCommission
