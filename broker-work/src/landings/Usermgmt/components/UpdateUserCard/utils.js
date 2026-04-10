/*判断基本资料和返佣规则的查看权限
    如果有relationUserInfo对应的查看权限
    则忽略平台所有用户，
    反之则判断平台所有用户的权限
  */

export const getRights = function(relation, userRights, isTask) {
  const types = {
    sub: 'USER_SELECT_DIRECTLY',
    subBelong: 'USER_SELECT_SUBORDINATE',
    noParent: 'USER_SELECT_WILD',
    all: 'USER_SELECT_ALL'
  };
  const type =
    relation === undefined
      ? types.all
      : userRights[types[relation]] ? types[relation] : types.all;
  const rights = {
    showBasicInfo: isTask || userRights[`${type}_BASIC`],
    showCommissionInfo: isTask || userRights[`${type}_COMMISSION`],
    addBasicInfo: isTask || userRights['USER_ADD_BASIC'],
    addCommissionInfo: isTask || userRights['USER_ADD_COMMISSION'],
    editBasicInfo: isTask || userRights['USER_MODIFY_BASIC'],
    editCommissionInfo: isTask || userRights['USER_MODIFY_COMMISSION'],
    enabledSensitiveEditing: isTask
      ? userRights['TASK_SENSITIVE']
      : userRights[`${type}_SENSITIVE`] && userRights['USER_MODIFY_BASIC']
  };

  return rights;
};

export const getVendorServer = userInfo => {
  // [vendor, server]
  return (userInfo.vendorServerId && userInfo.vendorServerId.split('_')) || [];
};
