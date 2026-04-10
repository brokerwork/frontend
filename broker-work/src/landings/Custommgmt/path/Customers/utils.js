import i18n from 'utils/i18n';

export const getApproveStageStr = (stage = 1) => {
  switch (stage) {
    default:
    case 1:
      return i18n['customer.contract.stage.uncommit'];
    case 2:
      return i18n['customer.contract.stage.approving'];
    case 4:
      return i18n['customer.contract.stage.reject'];
    case 5:
      return i18n['customer.contract.stage.pass'];
  }
};
