import i18n from 'utils/i18n';

export const personApprovalColumns = [
  { name: i18n['task.object_setting.step.table.userId'], key: 'userId' },
  { name: i18n['task.object_setting.step.table.name'], key: 'name' },
  { name: i18n['task.object_setting.step.table.roleName'], key: 'roleName' },
  { name: i18n['task.object_setting.step.table.isAllMt'], key: 'isAllMt' },
  {
    name: i18n['task.object_setting.step.table.groupPermissions'],
    key: 'groupPermissions'
  },
  { name: i18n['task.object_setting.step.table.operation'], key: 'operation' }
];

export const roleApprovalColumns = [
  { name: i18n['task.object_setting.step.table.roleName'], key: 'roleName' },
  {
    name: i18n['task.object_setting.step.table.roleCategory'],
    key: 'roleCategory'
  },
  { name: i18n['task.object_setting.step.table.isAllMt'], key: 'isAllMt' },
  {
    name: i18n['task.object_setting.step.table.groupPermissions'],
    key: 'groupPermissions'
  },
  { name: i18n['task.object_setting.step.table.operation'], key: 'operation' }
];

export const personSendColumns = [
  { name: i18n['task.object_setting.step.table.userId'], key: 'userId' },
  { name: i18n['task.object_setting.step.table.name'], key: 'username' },
  { name: i18n['task.object_setting.step.table.roleName'], key: 'roleName' },
  { name: i18n['task.object_setting.step.table.operation'], key: 'operation' }
];

export const roleSendColumns = [
  { name: i18n['task.object_setting.step.table.roleName'], key: 'roleName' },
  {
    name: i18n['task.object_setting.step.table.roleCategory'],
    key: 'roleCategory'
  },
  { name: i18n['task.object_setting.step.table.operation'], key: 'operation' }
];
