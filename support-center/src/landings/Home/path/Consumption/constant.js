import i18n from 'utils/i18n';

export const ORDER_TYPE = [
  { label: i18n['consumption.order.type.chg'], value: 'CHG' },
  { label: i18n['consumption.order.type.buy'], value: 'BUY' },
  { label: i18n['consumption.order.type.con'], value: 'CON' },
  { label: i18n['consumption.order.type.exp'], value: 'EXP' },
  { label: i18n['consumption.order.type.gift'], value: 'GIFT' },
];

export const ORDER_STATUS = [
  { label: i18n['consumption.status.new'], value: 'NEW', color: 'danger' },
  { label: i18n['consumption.status.pid'], value: 'PID', color: 'success' },
  { label: i18n['consumption.status.can'], value: 'CAN', color: 'disabled' },
];		

export const PERIOD_TYPE = [
  { label: i18n['consumption.period.month'], value: 2 },
  { label: i18n['consumption.period.day'], value: 3 }
];

export const RECHARGE_TYPE = [
  { label: i18n['consumption.recharge.type.recharge'], value: 'RECHARGE' },
  { label: i18n['consumption.recharge.type.receipt'], value: 'RECEIPT' },
  { label: i18n['consumption.recharge.type.pay'], value: 'PAY' },
  { label: i18n['consumption.recharge.type.remitting'], value: 'REMITTING' }
];

export const RECHARGE_TYPE_RECHARGE_STATUS = [
  { label: i18n['consumption.status.new'], value: 'NEW', color: 'danger' },
  { label: i18n['consumption.status.pid'], value: 'PID', color: 'success' },
  { label: i18n['consumption.status.can'], value: 'CAN', color: 'disabled' }
];

export const RECHARGE_TYPE_REMITTING_STATUS = [
  { label: i18n['consumption.recharge.remitting.status.approval_pending'], value: 'APPROVAL_PENDING', color: 'warning' },
  { label: i18n['consumption.recharge.remitting.status.not_approved'], value: 'NOT_APPROVED', color: 'danger' },
  { label: i18n['consumption.recharge.remitting.status.approved'], value: 'APPROVED', color: 'success' }
];