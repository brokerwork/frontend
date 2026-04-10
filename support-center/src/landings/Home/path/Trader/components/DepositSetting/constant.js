import i18n from 'utils/i18n';
export const exchangeModeType = [
  {
    label: i18n['platform.tab.deposit.exchange.manual'],
    value: 'Manual'
  },
  {
    label: i18n['platform.tab.deposit.exchange.auto'],
    value: 'Automatic'
  }
];
export const exchangeSourceType = [
  {
    label: i18n['platform.tab.exchange.source.cash.sale'],
    value: 'CashSalePrice'
  },
  {
    label: i18n['platform.tab.exchange.source.cash.purchase'],
    value: 'CashPurchasePrice'
  },
  {
    label: i18n['platform.tab.exchange.source.bank.discount'],
    value: 'BankDiscountPrice'
  }
];
export const payPlatType = [
  {
    label: i18n['platform.tab.deposit.plat.pay.pa.yes'],
    value: true
  },
  {
    label: i18n['platform.tab.deposit.plat.pay.pa.no'],
    value: false
  }
];
export const payPlatStyle = [
  {
    label: i18n['platform.tab.deposit.plat.pay.show.style.tile'],
    value: 'TILE'
  },
  {
    label: i18n['platform.tab.deposit.plat.pay.show.style.select'],
    value: 'SELECT'
  }
];
export const payPlatRoundRule = [
  {
    label: i18n['platform.tab.deposit.plat.round.rule.none'],
    value: 'NONE'
  },
  {
    label: i18n['platform.tab.deposit.plat.round.rule.rounding'],
    value: 'ROUNDING'
  }
];

export const telegraphicEnabledList = [
  {
    label: i18n['common.tips.enable'],
    value: true
  },
  {
    label: i18n['common.tips.disable'],
    value: false
  }
];

// export const EXCHANGE_SOURCE_UNION = ""

export const EXCHANGE_SOURCE_LIST = [
  {
    label: i18n['platform.tab.deposit.exchange.source.oofSale'],
    value: 'oofSale'
  },
  {
    label: i18n['platform.tab.deposit.exchange.source.oofBuy'],
    value: 'oofBuy'
  },
  {
    label: i18n['platform.tab.deposit.exchange.source.bocConversion'],
    value: 'bocConversion'
  }
];

export const rateSettingColumns = [
  { key: 'sort' },
  { key: 'transactionCurrency' },
  { key: 'payCurrency' },
  { key: 'exchange' },
  { key: 'exchangeMode' },
  { key: 'exchangeFloat' },
  { key: 'showExchange' },
  { key: 'exchangeSource' },
  { key: 'defaultCurrencyPair' },
  { key: 'status' },
  { key: 'operation' }
];

export const otherSettingColumns = [
  { key: 'sort' },
  { key: 'users', right: 'SC_DEPOSIT_FOR_GROUP' },
  { key: 'providerName', width: '150px' },
  { key: 'minDeposit' },
  { key: 'maxDeposit' },
  { key: 'charges' },
  { key: 'showCharge' },
  { key: 'notice' },
  { key: 'enable' },
  { key: 'operation' }
];
