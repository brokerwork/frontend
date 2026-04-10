import cs from './TaskDetails.less';
import i18n from 'utils/i18n';
import { Button, Checkbox } from 'lean-ui';
import TaskInfo from '../TaskInfo';
import cls from 'utils/class';
import VerifyTask from '../TaskVerify';
import { VIEW_TYPE, TASK_TYPES } from '../../contants';
const allowsSetting = (userRights, taskType) => {
  if (taskType === TASK_TYPES.TA) {
    return !!userRights['TASK_TRADER_ASSIGN'];
  }
  if (taskType === TASK_TYPES.AGENCY) {
    return !!userRights['TASK_IB_ ASSIGN'];
  }
  return false;
};
export default ({
  data,
  getTheTask,
  editTask,
  taskType,
  taskInitialValues,
  getExternalFormData,
  verifyIdentity,
  userRights,
  taskFields,
  exportPdf
}) => {
  console.log('daaaaa', data);
  const closed =
    [VIEW_TYPE.REFUSE, VIEW_TYPE.VIEW, VIEW_TYPE.FINISH].indexOf(
      data.viewType
    ) !== -1;
  return (
    <div className={cls`${cs['edit-task-container']}`}>
      <div className={cs['taskInfo-div']}>
        <Checkbox inline checked={closed} />
      </div>
      <TaskInfo
        closed={closed}
        data={data}
        taskType={taskType}
        tagsClassName={cs['tags']}
        className={cs['edit-task-info']}
      />
      <div
        style={{
          display: 'flex',
          alignItems: 'center'
        }}
      >
        {(data.jobType === 'JOB_TYPE_TA_OPEN' ||
          data.jobType === 'JOB_TYPE_TA_SAME_OPEN') &&
          userRights['TASK_TRADER_DOWNLOAD'] && (
            <a
              style={{ marginRight: 5, cursor: 'pointer' }}
              onClick={exportPdf}
            >
              {i18n['task.export.tips.download.account']}
            </a>
          )}
        {data.viewType === VIEW_TYPE.CLAIM && (
          <Button onClick={getTheTask} type="primary">
            {i18n['task.taks_details.get_the_task']}
          </Button>
        )}
        {data.viewType === VIEW_TYPE.PROCESS && (
          <div>
            {userRights['TASK_VERIFICATION'] && (
              <VerifyTask
                taskInitialValues={taskInitialValues}
                getExternalFormData={getExternalFormData}
                verifyIdentity={verifyIdentity}
                taskData={data}
                userRights={userRights}
                taskFields={taskFields}
              />
            )}

            {(allowsSetting(userRights, taskType) || data.isSuperAdmin) && (
              <Button type="primary" onClick={editTask}>
                <i className="fa fa-pencil" />
                {i18n['general.edit']}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
