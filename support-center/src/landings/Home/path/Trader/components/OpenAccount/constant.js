import i18n from 'utils/i18n';
export const simulationColumns = [
  { key: 'typeName' },
  { key: 'leverage' },
  { key: 'accountGroup' },
  { key: 'initAmount' },
  { key: 'operation' }
];

export const realAccountColumns = [
  { key: 'sort' },
  { key: 'name' },
  { key: 'fieldType' },
  { key: 'relationFunc' },
  { key: 'required' },
  { key: 'overuse' },
  { key: 'sensitive' },
  { key: 'columns' },
  { key: 'attr', width: '110px' },
  { key: 'enable' },
  { key: 'operation' }
];

export const SENSITIVE_FIELD_TYPE = ['select', 'date', 'datestring', 'country', 'city', 'radio', 'checkbox'];

export const RiskDisclosureOption = [
  { value: 'CLICK_POP', label: i18n['platform.tab.open.account.risk.setting.mode.click'] },
  { value: 'AUTO_POP', label: i18n['platform.tab.open.account.risk.setting.mode.auto'] },
  { value: 'DEFAULT_SHOW', label: i18n['platform.tab.open.account.risk.setting.mode.default'] }
];

export const currencyList = [
  { value: 'USD', label: 'USD' },
  { value: 'CNY', label: 'CNY' },
  { value: 'EUR', label: 'EUR' }
];
