import i18n from 'utils/i18n';

const columns = [
  { label: i18n['task.object_detail.taskid'], key: 'taskId' },
  { label: i18n['task.object_detail.username'], key: 'applyName' },
  { label: i18n['task.object_detail.userid'], key: 'accountId' },
  { label: i18n['task.object_detail.remark'], key: 'remark' },
  { label: i18n['task.object_detail.task_group'], key: 'taskGroup' },
  { label: i18n['task.object_detail.processor'], key: 'processor' },
  { label: i18n['task.object_detail.create_time'], key: 'CreateTime' }, //这里用大写因为sort的接口接受的是大写的参数， 就不转换了
  { label: i18n['task.object_detail.modify_time'], key: 'ModifyTime' },
  { label: i18n['task.object_detail.addition'], key: 'addition' },
  { label: i18n['task.object_detail.last_comment'], key: 'lastComment' },
  { label: i18n['task.object_detail.status'], key: 'status' },
  { label: i18n['task.object_detail.operation'], key: 'operation' }
];

export default columns;
