import { Table } from 'lean-ui';
import PaginationBar from 'components/v2/PaginationBar';
import i18n from 'utils/i18n';
import { injectIntl } from 'react-intl';
import cs from './index.less';
const TTd = Table.Td;

const columns = [
  { key: 'key1', name: i18n['setting.log.operator'] },
  { key: 'key2', name: i18n['setting.log.time'] },
  { key: 'key3', name: i18n['setting.log.ip'] },
  { key: 'key4', name: i18n['setting.log.opType'] },
  { key: 'key5', name: i18n['setting.log.opObj'] },
  { key: 'key6', name: i18n['setting.log.objId'] },
  { key: 'key7', name: i18n['setting.log.opName'] }
];

export default class Logs extends PureComponent {
  modifyPagination = ({ pageNo, pageSize }) => {
    const { modifyParams, params } = this.props;
    const __obj = {
      pageSize,
      page: pageSize === params.pageSize ? pageNo : 1
    };
    modifyParams({
      ...params,
      ...__obj
    });
  };

  renderCell = ({ key, data, index }) => {
    return <TTd key={index}>{data}</TTd>;
  };

  render = () => {
    const { paginationInfo } = this.props;
    let data = [];
    this.props.data &&
      this.props.data.forEach((item, index) => {
        data.push({
          key1: item.userName,
          key2: item.operationTime,
          key3: item.clientIp,
          key4: i18n['setting.operation.log.' + item.event],
          key5: i18n['setting.operation.log.' + item.type],
          key6: item.objectId,
          key7: item.objectName
        });
      });
    return (
      <div className={cs.wrapper}>
        <div className={cs.r1}>
          <div className={cs.r2}>
            <Table
              data={data}
              fixedHeader
              columns={columns}
              renderCell={this.renderCell}
            />
          </div>
        </div>
        <PaginationBar
          {...paginationInfo}
          onPageChange={this.modifyPagination}
        />
      </div>
    );
  };
}

const Content = injectIntl(({ data, intl }) => {
  if (!data) return <td />;
  const t = intl.formatMessage(
    {
      id: 'setting.task.log',
      defaultMessage: data
    },
    {
      log_job_type_JOB_TYPE_TA_OPEN:
        i18n[
          'task.object_setting.task_setting.task_group_type.JOB_TYPE_TA_OPEN'
        ],
      log_job_type_JOB_TYPE_TA_SAME_OPEN:
        i18n[
          'task.object_setting.task_setting.task_group_type.JOB_TYPE_TA_SAME_OPEN'
        ],
      log_job_type_JOB_TYPE_TA_LEVERAGE:
        i18n[
          'task.object_setting.task_setting.task_group_type.JOB_TYPE_TA_LEVERAGE'
        ],
      log_job_type_JOB_TYPE_TA_DEPOSIT:
        i18n[
          'task.object_setting.task_setting.task_group_type.JOB_TYPE_TA_DEPOSIT'
        ],
      log_job_type_JOB_TYPE_TA_WITHDRAW:
        i18n[
          'task.object_setting.task_setting.task_group_type.JOB_TYPE_TA_WITHDRAW'
        ],
      log_job_type_JOB_TYPE_TA_TRANSFER:
        i18n[
          'task.object_setting.task_setting.task_group_type.JOB_TYPE_TA_TRANSFER'
        ],
      log_job_type_JOB_TYPE_TA_BIND:
        i18n[
          'task.object_setting.task_setting.task_group_type.JOB_TYPE_TA_BIND'
        ],
      log_job_type_JOB_TYPE_TA_UPDATE_OWNER:
        i18n[
          'task.object_setting.task_setting.task_group_type.JOB_TYPE_TA_UPDATE_OWNER'
        ],
      log_job_type_JOB_TYPE_AGENCY_REGISTER:
        i18n[
          'task.object_setting.task_setting.task_group_type.JOB_TYPE_AGENCY_REGISTER'
        ],
      log_job_type_JOB_TYPE_AGENCY_WITHDRAW:
        i18n[
          'task.object_setting.task_setting.task_group_type.JOB_TYPE_AGENCY_WITHDRAW'
        ],
      log_job_type_CUSTOM_PROCESS:
        i18n['task.object_setting.task_setting.task_group_type.CUSTOM_PROCESS'],
      log_job_finish: i18n['setting.log.task.finish'],
      log_job_reject: i18n['setting.log.task.reject'],
      log_job_assign: i18n['setting.log.task.assign'],
      log_task_add: i18n['setting.log.task.object.add'],
      log_task_remove: i18n['setting.log.task.object.remove'],
      log_task_addAdmin: i18n['setting.log.task.object.addAdmin'],
      log_task_removeAdmin: i18n['setting.log.task.object.removeAdmin'],
      log_task_addSuper: i18n['setting.log.task.object.addSuper'],
      log_task_removeSuper: i18n['setting.log.task.object.removeSuper'],
      log_task_itemName: i18n['task.object_setting.basic_setup.object_name'],
      log_task_verify: i18n['setting.log.task.object.verify'],
      log_job_verify_true: i18n['task.object_setting.review.option_review'],
      log_job_verify_false:
        i18n['task.object_setting.review.option_without_review'],
      log_step_add: i18n['setting.log.task.step.add'],
      log_step_remove: i18n['setting.log.task.step.remove'],
      ta_user: i18n['task.details.task_name.ta_user'],
      account: i18n['task.details.task_name.account'],
      transfer_out: i18n['task.details.task_name.transfer_out'],
      transfer_in: i18n['task.details.task_name.transfer_in']
    }
  );
  return <td title={t}>{t}</td>;
});
