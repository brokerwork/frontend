import i18n from 'utils/i18n';

export const TYPE_OPTIONS = [
  {
    label: i18n['trader.account.profile.setting.type.ALL_PERMIT'],
    value: 'ALL_PERMIT'
  },
  {
    label: i18n['trader.account.profile.setting.type.SECTION_PERMIT'],
    value: 'SECTION_PERMIT'
  },
  {
    label: i18n['trader.account.profile.setting.type.SECTION_NOT_PERMIT'],
    value: 'SECTION_NOT_PERMIT'
  }
];

export const INDICATOR_OPTIONS = [
  {
    label: i18n['trader.account.profile.setting.indicator.NOT_NONE'],
    value: 'NOT_NONE'
  },
  {
    label: i18n['trader.account.profile.setting.indicator.NONE'],
    value: 'NONE'
  },
  {
    label: i18n['trader.account.profile.setting.indicator.CONDITION'],
    value: 'CONDITION'
  }
];
