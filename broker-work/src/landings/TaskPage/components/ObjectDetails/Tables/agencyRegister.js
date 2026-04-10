import { NavLink as Link } from 'react-router-dom';
import i18n from 'utils/i18n';
import cs from '../ObjectDetails.less';
import moment from 'moment';
import { dateTimeFormatStyle } from 'utils/config';
import { FormattedMessage } from 'react-intl';
import getFieldValue from 'utils/fieldValue';
import {
  TASK_BOARD_CLOSED,
  TASK_BOARD_COMPLETED,
  VIEW_TYPE,
  TELEGRAPHIC_DEPOSIT_KEY
} from '../../../contants';
import EllipsisContent from 'components/EllipsisContent';
import SortToggle from 'components/v2/SortToggle';

import { Table, Button } from 'lean-ui';
const { Td, Th } = Table;

const sortFieldtoSortByMap = {
  ModifyTime: true,
  CreateTime: true
};

export default class AgencyRegisterTable extends PureComponent {
  componentDidMount() {
    const { getUserAgentFormColumns, userAgentColumns } = this.props;
    if (!(userAgentColumns && userAgentColumns.length)) {
      getUserAgentFormColumns();
    }
  }
  _renderCustomHeader = () => {
    const { userAgentColumns } = this.props;
    return userAgentColumns.map((col, idx) => {
      return col.overuse ? <th key={idx}>{col.label}</th> : undefined;
    });
  };
  _renderCustomBody = item => {
    const { userAgentColumns } = this.props;
    return userAgentColumns.map((col, idx) => {
      const value =
        col.key === 'phones'
          ? item.phones
            ? item.phones['phoneStr']
            : undefined
          : col.fieldType === 'city'
            ? getFieldValue(col, item[col.key])
            : item[col.key];
      const title = typeof value === 'string' ? value : undefined;
      return col.overuse ? (
        <td key={idx} title={title}>
          {value}
        </td>
      ) : (
        undefined
      );
    });
  };
  renderHeadCell = ({ item, index, fixed }) => {
    const { searchParams, moidfyOrderDesc } = this.props;
    return (
      <Th key={index} fixed={fixed}>
        {sortFieldtoSortByMap[item.key] ? (
          <SortToggle
            activeSort={searchParams.sortby}
            orders={[true, false]}
            sortKey={item.key}
            activeOrder={searchParams.orderDesc}
            onChange={moidfyOrderDesc}
          >
            {item.label}
          </SortToggle>
        ) : (
          item.label
        )}
      </Th>
    );
  };
  renderCell = ({ key, rowData: v }) => {
    const {
      location: { pathname },
      searchParams,
      currentLoginUserInfo,
      getTheTask
    } = this.props;
    let content;
    switch (key) {
      case 'taskId':
        content = <Link to={`${pathname}/task/${v.jobId}`}>{v.jobNo}</Link>;
        break;
      case 'taskGroup':
        content =
          i18n[`task.object_setting.task_setting.task_group_type.${v.jobType}`];
        break;
      case 'name':
        content = v.name;
        break;
      case 'CreateTime':
        content = moment(v.createTime).format(dateTimeFormatStyle);
        break;
      case 'ModifyTime':
        content =
          [TASK_BOARD_CLOSED, TASK_BOARD_COMPLETED].includes(
            searchParams.taskBoard
          ) && moment(v.modifyTime).format(dateTimeFormatStyle);
        break;
      case 'addition':
        content = (
          <div>
            {!!v.addition ? (
              <EllipsisContent className={`${cs['td-content']}`}>
                <FormattedMessage
                  id="task.object_details.addition"
                  defaultMessage={v.addition}
                  values={{
                    Pending: (
                      <span className={cs['pay_status_pending']}>
                        {i18n['task.form.pay_status.Pending']}
                      </span>
                    ),
                    Finished: (
                      <span className={cs['pay_status_finished']}>
                        {i18n['task.form.pay_status.Finished']}
                      </span>
                    ),
                    [TELEGRAPHIC_DEPOSIT_KEY]: (
                      <span className={cs['pay_status_telegraphic']}>
                        {i18n['task.form.pay_status.Telegraphic']}
                      </span>
                    )
                  }}
                />
              </EllipsisContent>
            ) : (
              undefined
            )}
            {!!v.addition && !!v.messageCode ? <br /> : undefined}
            {!!v.messageCode ? (
              <EllipsisContent className={cs['td-content']}>
                <span>
                  {i18n['task.details.task_error']}
                  {i18n.mcode(v.messageCode)}
                </span>
              </EllipsisContent>
            ) : (
              undefined
            )}
          </div>
        );
        break;
      case 'lastComment':
        content = (
          <EllipsisContent className={cs['td-content']}>
            {v.lastComment}
          </EllipsisContent>
        );
        break;
      case 'processor':
        let currentProcessorName, currentProcessorId;
        if (
          Array.isArray(v.participantInfoSet) &&
          v.participantInfoSet.length > 0
        ) {
          currentProcessorName = v.participantInfoSet[0]['name'];
          currentProcessorId = v.participantInfoSet[0]['userId'];
        }
        content = currentProcessorName;
        break;
      case 'status':
        const stateMsg = i18n[`task.details.status.${v.state}`];
        content = stateMsg ? (
          <FormattedMessage
            id="task.details.status"
            defaultMessage={stateMsg}
            values={{ step: v.auditStep }}
          />
        ) : (
          ''
        );
        break;
      case 'operation':
        const { viewType } = v;
        // 根据后端返回的状态显示button
        // 显示只读任务只显示查看按钮
        if (VIEW_TYPE.VIEW === viewType) {
          content = (
            <Button
              size="small"
              type="primary"
              onClick={this.jumpTo.bind(this, `${pathname}/task/${v.jobId}`, {
                disabled: true
              })}
            >
              {i18n['general.view']}
            </Button>
          );
        } else if (VIEW_TYPE.CLAIM === viewType) {
          // 可领取显示领取按钮
          content = (
            <Button
              size="small"
              type="primary"
              onClick={getTheTask.bind(this, v)}
            >
              {i18n['task.taks_details.get_the_task']}
            </Button>
          );
        } else if (VIEW_TYPE.PROCESS === viewType) {
          // 处理中显示处理按钮
          content = (
            <Button
              size="small"
              type="primary"
              onClick={this.jumpTo.bind(this, `${pathname}/task/${v.jobId}`, {
                disabled: false
              })}
            >
              {i18n['task.taks_details.handle_the_task']}
            </Button>
          );
        }
        break;
      default:
        content = v[key];
    }
    return <Td>{content}</Td>;
  };
  jumpTo = (url, params) => {
    const {
      history: { push }
    } = this.props;
    push(url, params);
  };
  getColumns = () => {
    const { searchParams } = this.props;
    const columns = [
      { label: i18n['task.object_detail.taskid'], key: 'taskId' },
      { label: i18n['task.object_detail.task_group'], key: 'taskGroup' },
      { label: i18n['task.object_detail.name'], key: 'name' },
      { label: i18n['task.object_detail.processor'], key: 'processor' },
      { label: i18n['task.object_detail.create_time'], key: 'CreateTime' },
      { label: i18n['task.object_detail.modify_time'], key: 'ModifyTime' },
      { label: i18n['task.object_detail.last_comment'], key: 'lastComment' },
      { label: i18n['task.object_detail.addition'], key: 'addition' },
      { label: i18n['task.object_detail.status'], key: 'status' },
      { label: i18n['task.object_detail.operation'], key: 'operation' }
    ];
    const isDealed = [TASK_BOARD_CLOSED, TASK_BOARD_COMPLETED].includes(
      searchParams.taskBoard
    );
    return isDealed
      ? columns
      : columns.filter(item => item.key !== 'ModifyTime');
  };
  render() {
    let { taskGroupTasks, pager } = this.props;

    return (
      <Table
        data={taskGroupTasks}
        columns={this.getColumns()}
        fixedHeader
        renderCell={this.renderCell}
        renderHeadCell={this.renderHeadCell}
        pager={pager}
      />
    );
  }
}
