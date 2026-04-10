import i18n from 'utils/i18n';

const reduceOptions = (options = []) => {
  return options.reduce((target, { label, value }) => {
    target[value] = label;
    return target;
  }, {});
};

export const TRADER_TYPE_OPTIONS = [
  {
    value: 'TRADER_MARGIN_LEVEL',
    label: i18n['settings.notify_task_type.margin_level']
  },
  {
    value: 'TRADER_OPEN_DEMO',
    label: i18n['settings.notify_task_type.open_demo']
  },
  {
    value: 'TRADER_OPEN_REAL',
    label: i18n['settings.notify_task_type.open_real']
  },
  {
    value: 'TRADER_OPEN_REAL_FORM',
    label: i18n['settings.notify_task_type.open_real_form']
  },
  {
    value: 'TRADER_SILENT_CLIENT',
    label: i18n['settings.notify_task_type.silent_client']
  }
];

export const TRADER_TYPE_MAP = reduceOptions(TRADER_TYPE_OPTIONS);

export const RULE_LOGIC_OPTIONS = [
  {
    value: 'AND',
    label: i18n['settings.update_notify.rule.logic.AND']
  },
  {
    value: 'OR',
    label: i18n['settings.update_notify.rule.logic.OR']
  }
];

export const RULE_LOGIC_SILENT = [
  {
    value: 'LT',
    label: '<'
  },
  {
    value: 'LTE',
    label: '≤'
  },
  {
    value: 'EQ',
    label: '='
  }
];

export const LOGIC_SILENT_MAP = reduceOptions(RULE_LOGIC_SILENT);

export const NOTIFY_FREQUENCY = [
  {
    value: 'Once',
    label: i18n['settings.update_notify.rate.only_once.label']
  },
  {
    value: 'FixedInterval',
    label: i18n['settings.update_notify.rate.FixedInterval.label']
  }
];
