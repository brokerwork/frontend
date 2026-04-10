import i18n from 'utils/i18n';

export const OPERATOR_OPTIONS = [
  {
    label: i18n['settings.account_group_manager.operator.GTE'],
    value: 'GTE'
  },
  {
    label: i18n['settings.account_group_manager.operator.GT'],
    value: 'GT'
  },
  {
    label: i18n['settings.account_group_manager.operator.LE'],
    value: 'LE'
  },
  {
    label: i18n['settings.account_group_manager.operator.LTE'],
    value: 'LTE'
  },
  {
    label: i18n['settings.account_group_manager.operator.ET'],
    value: 'ET'
  }
];

export const OPERATOR_FLAGS_OPTIONS = [
  {
    label: '≥',
    value: 'GTE'
  },
  {
    label: '>',
    value: 'GT'
  },
  {
    label: '<',
    value: 'LE'
  },
  {
    label: '≤',
    value: 'LTE'
  },
  {
    label: '=',
    value: 'ET'
  }
];

export const ACCOUNT_GROUP_DEFAULT_RULE = {
  conditionA: 1,
  conditionB: 50,
  operator: 'LE',
  ruleType: 'DEAL_TIME'
};

export const createAccountGroupDefault = tenantId => ({
  classifyName: '账户分群',
  tenantId
});
