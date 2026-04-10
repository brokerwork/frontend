import { NavLink as Link } from 'react-router-dom';
import { FormGroup, FormControl, Checkbox } from 'react-bootstrap';
import i18n from 'utils/i18n';
import cs from '../ObjectDetails.less';
import moment from 'moment';
import { dateTimeFormatStyle } from 'utils/config';
import { FormattedMessage } from 'react-intl';
import {
  TASK_STATE_SUBMITED,
  TASK_BOARD_CLOSED,
  TASK_BOARD_COMPLETED,
  VIEW_TYPE,
  TELEGRAPHIC_DEPOSIT_KEY
} from '../../../contants';
import EllipsisContent from 'components/EllipsisContent';
import SortToggle from 'components/v2/SortToggle';
import TextButton from 'components/v2/TextButton';
import columns from '../columns';

import { Table, Button } from 'lean-ui';
const { Td, Th } = Table;
const sortFieldtoSortByMap = {
  ModifyTime: true,
  CreateTime: true
};
export class ExtrasTotalInfoComponent extends PureComponent {
  render() {
    const { jobType, total, showCheckBox } = this.props;
    const leftSpan = jobType === 'JOB_TYPE_AGENCY_WITHDRAW' ? 7 : 9;

    return ![
      'JOB_TYPE_TA_DEPOSIT',
      'JOB_TYPE_TA_TELEGRAPHIC_DEPOSIT',
      'JOB_TYPE_TA_WITHDRAW',
      'JOB_TYPE_AGENCY_WITHDRAW'
    ].includes(jobType) ? (
      <tr style={{ display: 'none' }} />
    ) : (
      <tr data-test="extras-tr">
        {[1, 2, 3, 4, 5, 6, 7].map(() => (
          <Td />
        ))}
        {jobType === 'JOB_TYPE_TA_DEPOSIT' && showCheckBox ? <Td /> : undefined}
        <Td>
          {i18n[`task.object_setting.task_setting.total.${jobType}`]}
          {total}
        </Td>
        {[1, 2, 3].map(() => (
          <Td />
        ))}
      </tr>
    );
  }
}
export default class DefaultTable extends PureComponent {
  state = {
    showClaimeBtn: false,
    showRefuseBtn: false
  };
  getColumns = () => {
    const { searchParams } = this.props;
    const isDealed = [TASK_BOARD_CLOSED, TASK_BOARD_COMPLETED].includes(
      searchParams.taskBoard
    );
    return isDealed
      ? columns
      : columns.filter(item => item.key !== 'ModifyTime');
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

  renderCell = ({ key, index, rowData: v, listData }) => {
    const {
      location: { pathname },
      searchParams,
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
              <EllipsisContent
                className={`${cs['td-content']} ${cs['pay_status_pending']}`}
              >
                <FormattedMessage
                  id={
                    v.verify
                      ? 'task.taks_details.list.task_faild_manual'
                      : 'task.taks_details.list.task_faild'
                  }
                  defaultMessage={
                    v.verify
                      ? i18n['task.taks_details.list.task_faild_manual']
                      : i18n['task.taks_details.list.task_faild']
                  }
                  values={{
                    reason: i18n.mcode(v.messageCode)
                  }}
                />
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
        let currentProcessorName;
        const participantInfoSet = _.get(v, 'participantInfoSet', []);
        currentProcessorName = participantInfoSet.map(item => item.name || '');
        content = currentProcessorName.join(', ');
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
  onSelect = ({ item, selectedKeys, event }) => {
    const { selectTask, taskGroupTasks, selectedTasks } = this.props;
    const selectedAll =
      taskGroupTasks && taskGroupTasks.every(task => selectedTasks[task.jobId]);
    let promise;
    if (item === null) {
      promise = selectTask(taskGroupTasks, !selectedAll);
    } else {
      promise = selectTask(item, false);
    }
    Promise.resolve(promise).then(this.onSelectedChange);
  };

  onSelectedChange = () => {
    const { selectedTasks, depositCategoryId } = this.props;
    const selectedCount = Object.keys(selectedTasks).length;
    const claimedDeposits = [];
    const unclaimed = [];
    let showClaimeBtn = false;
    let showRefuseBtn = false;
    for (let i in selectedTasks) {
      const task = selectedTasks[i];
      // 仅入金任务有批量功能
      if ('JOB_TYPE_TA_DEPOSIT' === task.jobType) {
        if (task.viewType === VIEW_TYPE.CLAIM) {
          // 批量认领仅认领状态的任务会显示
          unclaimed.push(task);
        } else if (task.viewType === VIEW_TYPE.PROCESS) {
          // 批量拒绝仅处理状态的任务会显示
          claimedDeposits.push(task);
        }
      }
    }
    if (unclaimed.length === selectedCount) {
      showClaimeBtn = true;
    } else if (claimedDeposits.length === selectedCount) {
      showRefuseBtn = true;
    }
    this.setState({
      showClaimeBtn,
      showRefuseBtn
    });
  };

  selectedView = () => {
    const { cleanTasks } = this.props;
    const { showClaimeBtn, showRefuseBtn } = this.state;
    return (
      <div>
        <TextButton onClick={cleanTasks}>{i18n['general.cancel']}</TextButton>
        {showClaimeBtn ? (
          <TextButton onClick={this.batchClaim}>
            {i18n['task.batch_action.button_claime']}
          </TextButton>
        ) : (
          undefined
        )}
        {showRefuseBtn ? (
          <TextButton onClick={this.batchRefuse}>
            {i18n['task.batch_action.button_refuse']}
          </TextButton>
        ) : (
          undefined
        )}
      </div>
    );
  };

  batchClaim = () => {
    const {
      batchClaimTask,
      selectedTasks,
      refreshTasks,
      showTipsModal
    } = this.props;
    batchClaimTask(selectedTasks).then(({ result, data }) => {
      if (result) {
        if (refreshTasks) {
          refreshTasks();
        }
        const content = (
          <FormattedMessage
            id="task.batch_action.claim_tips"
            defaultMessage={i18n['task.batch_action.claim_tips']}
            values={{
              success: (
                <span className={cs['tips-content-primary']}>
                  {data.successNum}
                </span>
              ),
              fail: (
                <span className={cs['tips-content-danger']}>
                  {data.failNum}
                </span>
              )
            }}
          />
        );
        showTipsModal({
          content
        });
      }
    });
  };
  batchRefuse = () => {
    const { showTipsModal, selectedTasks } = this.props;
    const isIncludesPayed = Object.keys(selectedTasks).some(
      key => selectedTasks[key]['payState'] === 'Finished'
    );
    if (isIncludesPayed) {
      const content = (
        <FormattedMessage
          id="task.batch_action.comfirm_payed"
          defaultMessage={i18n['task.batch_action.comfirm_payed']}
          values={{
            state: (
              <span className={cs['tips-content-danger']}>
                {i18n['task.form.pay_status.Finished']}
              </span>
            )
          }}
        />
      );
      showTipsModal({
        content,
        onConfirm: this.batchDoRefuse.bind(this)
      });
    } else {
      this.batchDoRefuse();
    }
  };
  batchDoRefuse = cb => {
    const { showTipsModal } = this.props;
    const data = {
      sendEmail: false,
      reason: ''
    };
    const maxLength = 300;
    const updateData = (name, e) => {
      const key = name === 'sendEmail' ? 'checked' : 'value';
      const value = e.target[key];
      data[name] = value;
    };
    const content = (
      <form>
        <FormGroup>
          {`${i18n['task.taks_details.reject_reson']}: `}
          <FormattedMessage
            id="task.taks_details.reject_length"
            defaultMessage={i18n['task.taks_details.reject_length']}
            values={{ number: maxLength }}
          />
        </FormGroup>
        <FormGroup>
          <FormControl
            onChange={updateData.bind(this, 'reason')}
            componentClass="textarea"
            maxLength={maxLength}
          />
        </FormGroup>
        <FormGroup>
          <Checkbox onChange={updateData.bind(this, 'sendEmail')}>
            {i18n['task.taks_details.reject_send_message_to_tw']}
          </Checkbox>
        </FormGroup>
      </form>
    );
    const categoryName =
      i18n[
        'task.object_setting.task_setting.task_group_type.JOB_TYPE_TA_DEPOSIT'
      ];
    const header = (
      <FormattedMessage
        id="task.taks_details.reject_task_title"
        defaultMessage={i18n['task.taks_details.reject_task_title']}
        values={{ value: categoryName }}
      />
    );
    showTipsModal({
      content,
      header,
      confirmBtnStyle: 'danger',
      confirmBtnText: i18n['general.reject'],
      onConfirm: this.submitReject.bind(this, data)
    });
  };
  submitReject = (submitData, callback) => {
    const {
      selectedTasks,
      batchRejectTask,
      refreshTasks,
      showTipsModal
    } = this.props;
    batchRejectTask({
      ...submitData,
      selectedTasks
    }).then(({ result, data }) => {
      if (!result) return;
      const paid = !!parseInt(data.paidNum) ? (
        <span className={cs['tips-content-note']}>
          <FormattedMessage
            id="task.batch_action.reject_tips_paid"
            defaultMessage={i18n['task.batch_action.reject_tips_paid']}
            values={{ paidNum: data.paidNum }}
          />
        </span>
      ) : (
        undefined
      );
      const claimed = !!parseInt(data.closedNum) ? (
        <span className={cs['tips-content-note']}>
          <FormattedMessage
            id="task.batch_action.reject_tips_claimed"
            defaultMessage={i18n['task.batch_action.reject_tips_claimed']}
            values={{ claimed: data.closedNum }}
          />
        </span>
      ) : (
        undefined
      );
      const content = (
        <FormattedMessage
          id="task.batch_action.reject_tips"
          defaultMessage={i18n['task.batch_action.reject_tips']}
          values={{
            success: (
              <span className={cs['tips-content-primary']}>
                {data.successNum}
              </span>
            ),
            fail: (
              <span className={cs['tips-content-danger']}>{data.failNum}</span>
            ),
            claimed,
            paid
          }}
        />
      );
      showTipsModal({
        content
      });
      if (refreshTasks) {
        refreshTasks();
      }
    });
  };

  render() {
    let {
      taskGroupTasks,
      selectedTasks,
      isShowCheck,
      extrasTotalInfo,
      jobType,
      pager
    } = this.props;
    const showCheckBox = isShowCheck();
    const rowSelectOptions = showCheckBox
      ? {
          onChange: this.onSelect,
          selectFieldKey: 'jobId',
          selectedKeys: Object.keys(selectedTasks),
          selectedHeader: this.selectedView()
        }
      : undefined;

    return (
      <Table
        data={taskGroupTasks}
        columns={this.getColumns()}
        fixedHeader
        rowSelectOptions={rowSelectOptions}
        renderCell={this.renderCell}
        renderHeadCell={this.renderHeadCell}
        pager={pager}
        lastRow={
          jobType && (
            <ExtrasTotalInfoComponent
              total={extrasTotalInfo}
              jobType={jobType}
              showCheckBox={showCheckBox}
            />
          )
        }
      />
    );
  }
}
