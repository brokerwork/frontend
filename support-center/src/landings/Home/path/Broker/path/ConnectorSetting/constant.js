import i18n from 'utils/i18n';

export const STATUS_TYPE = [
  // { label: i18n['connector.setting.server.status.connect'], value: 1, color: 'success', vendor: ['MT4', 'MT5', 'CTRADER'] },
  // { label: i18n['connector.setting.server.status.interrupt'], value: -1, color: 'danger', vendor: ['MT4', 'MT5', 'CTRADER'] },
  // { label: i18n['connector.setting.server.status.disconnect'], value: 0, color: 'disabled', vendor: ['MT4', 'MT5'] },
  // { label: i18n['connector.setting.server.status.wait'], value: 0, color: 'disabled', vendor: ['CTRADER'] }
  { label: i18n['connector.setting.server.status.connect'], value: 1, color: 'success', vendor: ['MT4', 'MT5'] },
  { label: i18n['connector.setting.server.status.interrupt'], value: -1, color: 'danger', vendor: ['MT4', 'MT5'] },
  { label: i18n['connector.setting.server.status.disconnect'], value: 0, color: 'disabled', vendor: ['MT4', 'MT5'] }
];

export const CONNECTOR_TYPE = [
  { label: i18n['connector.setting.server.real'], value: 'real' },
  { label: i18n['connector.setting.server.simulator'], value: 'simulator' }
];