export const filterRights = (rights, currentPrivilegeType, vendor) => {
  const isCtrader = vendor === 'CTRADER';
  const result = {
    remove: rights.remove,
    export: rights.export
  };

  if (currentPrivilegeType === 'all') {
    result.ownership =
      rights.update.accountInfo && rights.privilege.accountInfo;
    result.leverage = rights.update.leverage && rights.privilege.leverage;
    result.group =
      rights.update.accountInfo &&
      rights.privilege.accountInfo &&
      rights.update.group &&
      rights.privilege.group;
    result.accountGroup =
      rights.update.accountInfo &&
      rights.privilege.accountInfo &&
      rights.update.accountGroup &&
      rights.privilege.accountGroup;
    result.balance = rights.update.balance && rights.privilege.balance;
    result.credit = rights.update.credit && rights.privilege.credit;
    result.enable = rights.update.enable;
    result.readOnly = rights.update.readOnly;
  } else {
    result.ownership =
      rights.update.accountInfo &&
      rights.privilege[currentPrivilegeType].accountInfo;
    result.leverage =
      rights.update.leverage && rights.privilege[currentPrivilegeType].leverage;
    result.group =
      rights.update.accountInfo &&
      rights.privilege[currentPrivilegeType].accountInfo &&
      rights.privilege.group &&
      rights.privilege[currentPrivilegeType].group;
    result.accountGroup =
      rights.update.accountInfo &&
      rights.privilege[currentPrivilegeType].accountInfo &&
      rights.privilege.accountGroup &&
      rights.privilege[currentPrivilegeType].accountGroup;
    result.balance =
      rights.update.balance && rights.privilege[currentPrivilegeType].balance;
    result.credit =
      rights.update.credit && rights.privilege[currentPrivilegeType].credit;
    result.enable = rights.enable;
    result.readOnly = rights.update.readOnly;
  }

  result.sendMsg = rights.sendMsg;
  result.sendSms = rights.sendSms;
  result.sendMail = rights.sendMail;
  result.batchWithdraw = rights.batchWithdraw;
  result.batchDeposit = rights.batchDeposit;
  // result.enable = rights.update.enable;

  if (isCtrader) {
    result.remove = false;
    result.credit = false;
  }

  return result;
};
