import { NavLink as Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import DropdownForCode from 'components/v2/DropdownForCode';
import {
  Radio,
  Checkbox,
  Tooltip,
  Icon,
  Table,
  Button,
  Collapse,
  Tag,
  Input,
  Picklist
} from 'lean-ui';
import i18n from 'utils/i18n';
import Dropdown from 'components/v2/Dropdown';
import PagePanel from 'components/PagePanel';
import { CardPanelWrapper } from 'components/v2/CardPanel';
import ObjectSettingEdit from '../ObjectSettingEdit';
import cls from 'utils/class';
import { TASK_TYPES } from '../../contants';
import ObjectSettingCtraderForm from '../../containers/ObjectSettingCtraderForm';
import cs from './ObjectSetting.less';
import NumberInput from 'components/v2/NumberInput';
import history from 'history';

const { Th, Td } = Table;

export default class ObjectSetting extends PureComponent {
  state = {
    editCardData: null,
    pageTitle: '',
    readyToSubmitForms: []
  };
  componentDidMount() {
    const {
      getDetails,
      match: {
        params: { objectId }
      },
      initialServerList,
      initialLeverageList,
      getAccountFields
    } = this.props;
    initialServerList();
    initialLeverageList();
    getAccountFields().then(() => {
      //确保先获取字段
      getDetails(objectId).then(() => {
        this.initialTaskGroupMember();
        const {
          details: { itemName }
        } = this.props;
        this.setState({
          pageTitle: itemName
        });
      });
    });
  }
  onGroupSync = () => {
    const {
      taskSyncGroup,
      match: {
        params: { objectId }
      },
      showTopAlert
    } = this.props;
    if (taskSyncGroup) {
      taskSyncGroup(objectId).then(res => {
        if (res.result) {
          showTopAlert({
            content: i18n['task.object_setting.sync.success'],
            bsStyle: 'success'
          });
        }
      });
    }
  };
  render() {
    const {
      details,
      details: { itemName, categorys, modifyTaskInfo },
      stepData,
      objectMembers,
      match: {
        params: { objectId },
        url
      },
      serverList,
      taskGroupMembers,
      getStepData,
      saveStepData,
      getObjectMembers,
      showTopAlert,
      leverageList,
      taskType,
      cTraderFormFields,
      accountFields
    } = this.props;
    const parentUrl = url.replace('/setting', '');
    const { editCardData, pageTitle } = this.state;
    const cTraderFieldsLoaded =
      !serverList.ct.length || cTraderFormFields.length;
    const userObjectRight = 'SUPER'; // TODO 审批流程 需要根据权限替换下面所有的userObjectRight
    return (
      <PagePanel className={cs['container']}>
        <PagePanel.Header>
          <div className={cs['breadcrumb']}>
            <Link className="main-color main-color-hover" to={parentUrl}>
              {pageTitle}
            </Link>
            <i className={`fa fa-angle-right ${cs['icon']}`} />
            {i18n['task.object_setting']}
          </div>
        </PagePanel.Header>
        <PagePanel.Body className={cs['body']}>
          <Collapse forceActiveAll>
            <Collapse.Item
              className={cs['collapse-item']}
              title={i18n['task.object_setting.basic_setup']}
            >
              <div className={cs['grid']}>
                <div className={cs['grid-item']}>
                  <div className={cs['grid-label']}>
                    <span className={cs['required']} />
                    {i18n['task.object_setting.basic_setup.object_name']}
                  </div>
                  <div>
                    <Input
                      disabled={userObjectRight === 'COMMON'}
                      onChange={this.modifyItemName}
                      value={itemName}
                    />
                  </div>
                </div>
              </div>
            </Collapse.Item>
            <Collapse.Item
              className={cs['collapse-item']}
              title={
                <div className={cs['panel-title']}>
                  {i18n['task.object_setting.sms_setting']}{' '}
                  <Tooltip
                    inline
                    align="bottom-right"
                    data-test="sms-tips"
                    title={
                      <div className={cs['tips-content']}>
                        {i18n['task.object_setting.sms_setting.sms.title.tips']}
                      </div>
                    }
                  >
                    <span>
                      <Icon className={cs['tips-container']} icon="question" />
                    </span>
                  </Tooltip>
                </div>
              }
            >
              <SendSMSSet
                edit={this.editSMSSetting}
                disabled={userObjectRight === 'COMMON'}
                data={details}
              />
            </Collapse.Item>
            <Collapse.Item
              className={cs['collapse-item']}
              title={
                <div className={cs['panel-sub-header']}>
                  <span className={cs['panel-sub-title']}>
                    {i18n['task.object_setting.task_setting']}
                  </span>
                  {/* <Button
                    className={`${
                      cs['sync-btn']
                    } main-color main-color-border main-color-bg-hover`}
                    onClick={this.onGroupSync}
                  >
                    {i18n['task.object_setting.sync.button']}
                  </Button>
                  <Tooltip
                    inline
                    placement="left"
                    data-test="sms-tips"
                    title={
                      <div className={cs['tips-content']}>
                        {i18n['task.object_setting.sync.title.tips']}
                      </div>
                    }
                  >
                    <span>
                      <Icon className={cs['tips-container']} icon="question" />
                    </span>
                  </Tooltip> */}
                </div>
              }
            >
              <TaskSet
                edit={this.editTaskGroup}
                disabled={userObjectRight === 'COMMON'}
                data={categorys}
              />
            </Collapse.Item>

            <Collapse.Item
              className={cs['collapse-item']}
              title={i18n['task.object_setting.review']}
            >
              <TaskVerfiySet
                leverageList={leverageList}
                serverList={serverList}
                onChange={this.modifyCategorysData}
                disabled={userObjectRight === 'COMMON' || !cTraderFieldsLoaded}
                onSubmit={this.handleCtraderSuccess}
                onError={this.handleCtraderError}
                cTraderFieldsLoaded={cTraderFieldsLoaded}
                data={categorys}
                modifyTaskInfo={modifyTaskInfo}
                taskType={taskType}
                accountFields={accountFields}
              />
            </Collapse.Item>
            <Collapse.Item
              className={cs['collapse-item']}
              title={i18n['task.object_setting.reminder']}
            >
              <TaskReminderSet
                onChange={this.modifyCategorysData}
                disabled={userObjectRight === 'COMMON'}
                value={categorys}
                data={taskGroupMembers}
              />
            </Collapse.Item>
          </Collapse>
        </PagePanel.Body>
        <div className={cs['save-btn']}>
          <Button type="primary" onClick={this.submitData}>
            {i18n['general.save']}
          </Button>
        </div>
        <CardPanelWrapper>
          {editCardData ? (
            <ObjectSettingEdit
              showTopAlert={showTopAlert}
              onSave={this.closeEditCard}
              data={editCardData}
              objectId={objectId}
              getStepData={getStepData}
              saveStepData={saveStepData}
              stepData={stepData}
              serverList={serverList}
              objectMembers={objectMembers}
              getObjectMembers={getObjectMembers}
              taskType={taskType}
            />
          ) : (
            undefined
          )}
        </CardPanelWrapper>
      </PagePanel>
    );
  }
  modifyItemName = e => {
    const v = e.target.value;
    const { modifyObjectName } = this.props;
    modifyObjectName(v);
  };
  submitData = () => {
    const {
      details: { categorys },
      submitForm,
      serverList
    } = this.props;
    let readyToSubmitForms = [];
    if (serverList.ct && serverList.ct.length) {
      if (categorys.find(item => item.jobType === 'JOB_TYPE_TA_OPEN')) {
        readyToSubmitForms.push('JOB_TYPE_TA_OPEN_CTRADER_FORM');
      }
      if (categorys.find(item => item.jobType === 'JOB_TYPE_TA_SAME_OPEN')) {
        readyToSubmitForms.push('JOB_TYPE_TA_SAME_OPEN_CTRADER_FORM');
      }
      if (categorys.find(item => item.jobType === 'JOB_TYPE_AGENCY_REGISTER')) {
        readyToSubmitForms.push('JOB_TYPE_AGENCY_REGISTER_CTRADER_FORM');
      }
    }
    this.setState(
      {
        readyToSubmitForms
      },
      () => {
        if (!readyToSubmitForms.length) {
          this.saveDataToServer();
        } else {
          this.handleCtraderSuccess();
        }
      }
    );
  };
  handleCtraderSuccess = (formName, data) => {
    const { readyToSubmitForms } = this.state;
    const copyData = readyToSubmitForms.concat();
    const {
      details: { categorys },
      submitForm
    } = this.props;
    if (!formName) {
      const nextForm = copyData.pop();
      this.setState(
        {
          readyToSubmitForms: copyData
        },
        () => {
          submitForm(nextForm);
        }
      );
    } else {
      const indexOfFromName = categorys.findIndex(item =>
        formName.includes(item.jobType)
      );
      Promise.resolve(
        this.modifyCategorysData('cbroker', indexOfFromName, data)
      ).then(() => {
        if (!copyData.length) {
          this.saveDataToServer();
        } else {
          const nextForm = copyData.pop();
          this.setState(
            {
              readyToSubmitForms: copyData
            },
            () => {
              submitForm(nextForm);
            }
          );
        }
      });
    }
  };
  handleCtraderError = errors => {
    this.saveDataToServer(errors);
  };
  saveDataToServer = errors => {
    const {
      saveDataToServer,
      details,
      match: {
        params: { objectId }
      },
      showTopAlert,
      serverList
    } = this.props;
    const copyData = JSON.parse(JSON.stringify(details));
    const { categorys, itemName } = copyData;
    let errorMsg = [];
    for (let item of categorys) {
      if (
        (item.jobType === 'JOB_TYPE_TA_OPEN' ||
          item.jobType === 'JOB_TYPE_TA_SAME_OPEN') &&
        item.verify === false
      ) {
        //mt4账户组必填验证
        if (serverList.mt4 && serverList.mt4.length > 0) {
          if (item.serverId) {
            const __g = serverList.mt4.find(v => {
              return v.value === item.serverId;
            });
            if (__g && __g.groups.length && !item.groupId)
              errorMsg.push(i18n['task.object_setting.save.server_required']);
          } else {
            errorMsg.push(i18n['task.object_setting.save.server_required']);
          }
        }
        // mt5账户组必填验证
        if (serverList.mt5 && serverList.mt5.length > 0) {
          if (item.serverId5) {
            const __g = serverList.mt5.find(v => {
              return v.value === item.serverId5;
            });
            if (__g && __g.groups.length && !item.groupId5)
              errorMsg.push(i18n['task.object_setting.save.server_required']);
          } else {
            errorMsg.push(i18n['task.object_setting.save.server_required']);
          }
        }
        //杠杆必填验证
        if (!item.leverage || !item.leverage5) {
          errorMsg.push(i18n['task.object_setting.save.leverage_required']);
        }
      }
      //整理verify特殊情况
      if (
        ['JOB_TYPE_TA_DEPOSIT', 'JOB_TYPE_TA_TRANSFER'].includes(item.jobType)
      ) {
        if (item.verify === '' && !Number(item.threshold)) {
          errorMsg.push(
            <FormattedMessage
              id="custom_field.required"
              defaultMessage={`${i18n['custom_field.required']}:`}
              values={{
                value: i18n['task.object_setting.review.threshold']
              }}
            />
          );
        } else if (item.verify === '') {
          item.verify = false;
        } else {
          item.threshold = '';
        }
        // item.threshold = Number(item.threshold);
      }

      if (item.jobType === 'JOB_TYPE_TA_UPDATE_OWNER' && item.verify === '') {
        item.verify = false;
      }
    }

    if (!itemName)
      errorMsg.push(
        i18n['task.object_setting.task_setting.object_name_required']
      );

    //外部error
    if (errors) {
      errorMsg = errorMsg.concat(errors);
    }
    if (errorMsg.length > 0) {
      showTopAlert({
        content: (
          <ul>
            {errorMsg.map((item, index) => {
              return <li key={index}>{item}</li>;
            })}
          </ul>
        ),
        bsStyle: 'danger'
      });
      return;
    }

    saveDataToServer(objectId, copyData).then(({ result, mcode }) => {
      if (result) {
        showTopAlert({
          content: i18n['general.save_success'],
          bsStyle: 'success'
        });
      } else {
        showTopAlert({
          content: i18n.mcode(mcode)
        });
      }
    });
  };
  modifyCategorysData = (type, index, e) => {
    const { modifyCategorysData } = this.props;
    let v = e;
    if (e.target) v = e.target.value;
    modifyCategorysData(type, v, index);
  };
  initialTaskGroupMember() {
    const {
      details: { categorys },
      match: {
        params: { objectId }
      },
      initialTaskGroupMember
    } = this.props;
    const taskGroupIds = categorys.map(item => {
      return item.categoryId;
    });
    initialTaskGroupMember(objectId, taskGroupIds);
  }
  editTaskGroup = item => {
    const {
      match: { url },
      history: { push }
    } = this.props;
    const { categoryId } = item;
    const linkUrl = `${url}/category/${categoryId}`;

    push({ pathname: linkUrl, state: { categoryItem: item } });
  };
  editSMSSetting = bool => {
    const { modifySendSMS } = this.props;
    if (modifySendSMS) {
      modifySendSMS(bool);
    }
  };
  closeEditCard = () => {
    this.setState({
      editCardData: null
    });
    this.initialTaskGroupMember();
  };
}

// 短信通知设置
export const SendSMSSet = ({ data, edit, disabled }) => {
  return (
    <div className={cs['grid']}>
      <div className={cs['grid-item']}>
        <div className={cs['grid-label']}>
          <span className={cs['required']} />
          {i18n['task.object_setting.sms_setting.notice_way']}
        </div>
        <div className={cs['grid-control']}>
          <Checkbox
            disabled={true}
            checked={true}
            inline
            data-test="email-checkbox"
            className={cs['radio']}
          >
            {i18n['task.object_setting.sms_setting.notice_way.email']}
          </Checkbox>
          <Checkbox
            inline
            disabled={disabled || !data.isSMSPay}
            checked={!!data.sendSMS}
            onChange={edit.bind(this, !data.sendSMS)}
            className={cs['radio']}
            data-test="sms-checkbox"
          >
            {i18n['task.object_setting.sms_setting.notice_way.sms']}
          </Checkbox>
          <Tooltip
            inline
            title={
              <div className={cs['tips-content']}>
                {i18n['task.object_setting.sms_setting.sms.tips']}
              </div>
            }
          >
            <span>
              <Icon className={cs['tips-container']} icon="question" />
            </span>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

// 任务组设置
class TaskSet extends PureComponent {
  getColumns = () => {
    const { disabled } = this.props;

    let columns = [
      {
        key: 'taskGroupName',
        name: i18n['task.object_setting.task_setting.task_group_name']
      },
      {
        key: 'handleStep',
        name: i18n['task.object_setting.task_setting.handle_step']
      }
    ];
    if (!disabled) {
      columns.push({
        key: 'edit',
        name: i18n['task.object_setting.task_setting.edit']
      });
    }

    return columns;
  };

  renderCell = ({ key, data, index, rowData, listData }) => {
    const { edit } = this.props;

    switch (key) {
      case 'taskGroupName':
        return (
          <Td>
            {
              i18n[
                `task.object_setting.task_setting.task_group_type.${
                  rowData.jobType
                }`
              ]
            }
          </Td>
        );
      case 'taskGroupType':
        return (
          <Td>
            {
              i18n[
                `task.object_setting.task_setting.task_group_type.${
                  rowData.jobType === 'JOB_TYPE_COMMON'
                    ? 'JOB_TYPE_COMMON'
                    : 'CUSTOM_PROCESS'
                }`
              ]
            }
          </Td>
        );
      case 'handleStep':
        return <Td>{rowData.allStep}</Td>;
      case 'edit':
        return (
          <Td>
            <Button
              type="primary"
              className="icon"
              onClick={edit.bind(this, rowData)}
            >
              <i className="fa fa-pencil" />
            </Button>
          </Td>
        );
    }
  };

  render() {
    const { data, edit, disabled } = this.props;

    const columns = this.getColumns();

    return (
      <Table
        columns={columns}
        renderCell={this.renderCell}
        data={data}
        bsTableStyle="table-bordered"
        className="ellipsis"
      />
    );
  }
}

// 任务组审核设置
export const TaskVerfiySet = ({
  data,
  modifyTaskInfo,
  serverList,
  leverageList,
  onChange,
  disabled,
  cTraderFieldsLoaded,
  onSubmit,
  onError,
  taskType,
  accountFields = []
}) => {
  // const fastTypes = []; //隐藏快速开户设置入口
  const fastTypes = ['JOB_TYPE_TA_OPEN', 'JOB_TYPE_TA_SAME_OPEN'];
  const fasterIndexs = fastTypes.reduce((arr, type) => {
    const index = data.findIndex(item => item.jobType === type);
    if (index > -1) {
      arr.push(index);
    }
    return arr;
  }, []);
  return (
    <div>
      {/** 手机端快速开户（已部署手机版本前提）*/}
      {fasterIndexs.length !== 0 && (
        <div className={cs['grid']}>
          <div
            className={`${cs['grid-item']} ${cs['task-verify-set-item']} ${
              cs['verify-border']
            }`}
          >
            <div className={cs['grid-label']}>
              {i18n['task.object_setting.review.label.fast_open']}:
            </div>
            <div className={cs['grid-control']}>
              <Radio
                onChange={() => {
                  fasterIndexs.forEach(fastIndex => {
                    onChange('faster', fastIndex, true);
                  });
                }} //-1代表快速开户特殊处理
                className={cs['radio']}
                checked={data[fasterIndexs[0]].faster}
                disabled={disabled}
                inline
              >
                {i18n['task.object_setting.review.option_yes']}
              </Radio>
              <Radio
                onChange={() => {
                  fasterIndexs.forEach(fastIndex => {
                    onChange('faster', fastIndex, false);
                  });
                }}
                className={cs['radio']}
                checked={!data[fasterIndexs[0]].faster}
                disabled={disabled}
                inline
              >
                {i18n['task.object_setting.review.option_no']}
              </Radio>
            </div>
          </div>
        </div>
      )}
      {data.map((item, index) => {
        //出金、电汇入金不审核
        if (
          item.jobType === 'JOB_TYPE_TA_WITHDRAW' ||
          item.jobType == 'JOB_TYPE_AGENCY_WITHDRAW'
          // item.jobType == 'JOB_TYPE_TA_TELEGRAPHIC_DEPOSIT'
        )
          return;
        let groups4, groups5, cbrokerGroup;
        //账户开户,同名账户开户 显示账户组,杠杆选项
        if (
          item.jobType === 'JOB_TYPE_TA_OPEN' ||
          item.jobType === 'JOB_TYPE_TA_SAME_OPEN' ||
          item.jobType === 'JOB_TYPE_AGENCY_REGISTER'
        ) {
          serverList.mt5.forEach(s => {
            if (groups5) return;
            if (!groups5 && s.value == item.serverId5) {
              groups5 = s.groups;
            }
          });
          serverList.mt4.forEach(s => {
            if (groups4) return;
            if (!groups4 && s.value == item.serverId) {
              groups4 = s.groups;
            }
          });
        }
        return (
          <div key={index} className={cs['grid']}>
            {/* 电汇入金不审核, 但是有其他的状态, 所以必须在这里加判断 */}
            {item.jobType !== 'JOB_TYPE_TA_TELEGRAPHIC_DEPOSIT' && (
              <div
                className={cls`${cs['grid-item']}
                          ${
                            [
                              'JOB_TYPE_TA_OPEN',
                              'JOB_TYPE_TA_SAME_OPEN',
                              'JOB_TYPE_AGENCY_REGISTER',
                              'JOB_TYPE_TA_TELEGRAPHIC_DEPOSIT'
                            ].includes(item.jobType)
                              ? ''
                              : cs['verify-border']
                          }
                          ${cs['task-verify-set-item']}`}
              >
                <div className={cs['grid-label']}>
                  {item.jobType === 'JOB_TYPE_AGENCY_REGISTER' ? (
                    <span className={cs.agency_task_register_disable}>
                      {i18n['task.object_setting.review.agency']}
                    </span>
                  ) : (
                    <FormattedMessage
                      id="task.object_setting.review.label"
                      defaultMessage={`${
                        i18n['task.object_setting.review.label']
                      }:`}
                      values={{
                        name:
                          i18n[
                            `task.object_setting.task_setting.task_group_type.${
                              item.jobType
                            }`
                          ]
                      }}
                    />
                  )}
                </div>
                <div
                  className={
                    'JOB_TYPE_TA_UPDATE_OWNER' === item.jobType
                      ? cs['grid-control-flex']
                      : cs['grid-control']
                  }
                >
                  {/* // 代理注册任务处理/ */}
                  {item.jobType !== 'JOB_TYPE_AGENCY_REGISTER' && [
                    <Radio
                      onChange={onChange.bind(this, 'verify', index, true)}
                      className={cs['radio']}
                      checked={item.verify}
                      disabled={disabled || taskType !== TASK_TYPES.TA}
                      inline
                    >
                      {i18n['task.object_setting.review.option_review']}
                    </Radio>,
                    <Radio
                      onChange={onChange.bind(this, 'verify', index, false)}
                      className={cs['radio']}
                      checked={item.verify === false}
                      disabled={disabled || taskType !== TASK_TYPES.TA}
                      inline
                    >
                      {i18n['task.object_setting.review.option_without_review']}
                    </Radio>
                  ]}
                  {'JOB_TYPE_TA_UPDATE_OWNER' === item.jobType && [
                    <Radio
                      key="verify"
                      onChange={onChange.bind(this, 'verify', index, '')}
                      className={cs['radio']}
                      checked={item.verify === ''}
                      disabled={disabled}
                      inline
                    >
                      {i18n['task.object_setting.review.option_partial_review']}
                    </Radio>,
                    item.verify === '' ? (
                      <Picklist
                        key="selectFields"
                        disabled={item.verify !== ''}
                        onChange={onChange.bind(this, 'verifyFields', index)}
                        data={accountFields}
                        defaultSelectedKeys={item.verifyFields || []}
                        searchable
                        placeholder={
                          i18n['task.object_setting.task_setting.selectFields']
                        }
                      />
                    ) : null
                  ]}
                  {['JOB_TYPE_TA_DEPOSIT', 'JOB_TYPE_TA_TRANSFER'].includes(
                    item.jobType
                  )
                    ? [
                        <Radio
                          key="verify"
                          onChange={onChange.bind(this, 'verify', index, '')}
                          className={cs['radio']}
                          checked={item.verify === ''}
                          disabled={disabled}
                          inline
                        >
                          {
                            i18n[
                              'task.object_setting.review.option_partial_review'
                            ]
                          }
                        </Radio>,
                        <span className={cs['inline-item']} key="theshold">
                          <span>
                            {i18n['task.object_setting.review.threshold']}:
                          </span>
                          <NumberInput
                            className={cs['inline-input']}
                            data-test="threshold-input"
                            nonDecimal={'{1,8}'}
                            disabled={disabled || item.verify !== ''}
                            onChange={onChange.bind(this, 'threshold', index)}
                            value={item.threshold || ''}
                          />
                        </span>
                      ]
                    : undefined}
                </div>
              </div>
            )}
            {/** 仅 <真实账户开户, 电汇入金> 可设置 [是否允许修改任务信息] */}
            {(item.jobType === 'JOB_TYPE_TA_OPEN' ||
              item.jobType === 'JOB_TYPE_TA_TELEGRAPHIC_DEPOSIT') && (
              <div
                className={`${cs['grid-item']} ${cs['task-verify-set-item']} ${
                  item.jobType === 'JOB_TYPE_TA_TELEGRAPHIC_DEPOSIT'
                    ? cs['verify-border']
                    : ''
                }`}
              >
                <div className={cs['grid-label']}>
                  <FormattedMessage
                    id="task.object_setting.review.label.edit"
                    defaultMessage={`${
                      i18n['task.object_setting.review.label.edit']
                    }:`}
                    values={{
                      name:
                        i18n[
                          `task.object_setting.task_setting.task_group_type.${
                            item.jobType
                          }`
                        ]
                    }}
                  />
                </div>
                <div className={cs['grid-control']}>
                  <Radio
                    onChange={onChange.bind(this, 'isEdit', index, true)}
                    className={cs['radio']}
                    checked={item.isEdit}
                    disabled={disabled}
                    inline
                  >
                    {i18n['general.yes']}
                  </Radio>
                  <Radio
                    onChange={onChange.bind(this, 'isEdit', index, false)}
                    className={cs['radio']}
                    checked={!item.isEdit}
                    disabled={disabled}
                    inline
                  >
                    {i18n['general.no']}
                  </Radio>
                </div>
              </div>
            )}
            {/** 显示mt默认账户组设置 */}
            {item.jobType === 'JOB_TYPE_TA_OPEN' ||
            item.jobType === 'JOB_TYPE_TA_SAME_OPEN' ||
            item.jobType === 'JOB_TYPE_AGENCY_REGISTER' ? (
              <div
                className={`${cs['grid-item']} ${cs['task-verify-set-item']} ${
                  cs['verify-border']
                }`}
              >
                {serverList.mt4 && serverList.mt4.length > 0 ? (
                  <div className={`${cs['dropdown-box']}`}>
                    <div className={cs['grid-label']}>
                      {!item.verify ? <span className="required" /> : undefined}
                      {`MT4 ${
                        i18n['task.object_setting.review.account_group']
                      }:`}
                    </div>
                    <div className={cs['grid-control']}>
                      <div className={cs['server-select-box']}>
                        <DropdownForCode
                          defaultSelect
                          onChange={onChange.bind(this, 'serverId', index)}
                          value={item.serverId}
                          disabled={disabled}
                          data={serverList.mt4}
                        />
                        {groups4 ? (
                          <DropdownForCode
                            defaultSelect
                            onChange={onChange.bind(this, 'groupId', index)}
                            value={item.groupId}
                            disabled={disabled}
                            data={groups4}
                          />
                        ) : (
                          undefined
                        )}
                      </div>
                      <div className={cs['default-group']}>
                        {!item.verify ? (
                          <span className="required" />
                        ) : (
                          undefined
                        )}
                        {`MT4 ${
                          i18n['task.object_setting.review.default_leverage']
                        }: `}
                        <div className={cs['server-select-box']}>
                          <DropdownForCode
                            defaultSelect
                            onChange={onChange.bind(this, 'leverage', index)}
                            value={item.leverage}
                            disabled={disabled}
                            data={leverageList.mt4}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  undefined
                )}
                {serverList.mt5 && serverList.mt5.length > 0 ? (
                  <div className={`${cs['dropdown-box']}`}>
                    <div className={cs['grid-label']}>
                      {!item.verify ? <span className="required" /> : undefined}
                      {`MT5 ${
                        i18n['task.object_setting.review.account_group']
                      }:`}
                    </div>
                    <div className={cs['grid-control']}>
                      <div className={cs['server-select-box']}>
                        <DropdownForCode
                          onChange={onChange.bind(this, 'serverId5', index)}
                          value={item.serverId5}
                          disabled={disabled}
                          data={serverList.mt5}
                          defaultSelect
                        />
                        {groups5 ? (
                          <DropdownForCode
                            onChange={onChange.bind(this, 'groupId5', index)}
                            value={item.groupId5}
                            disabled={disabled}
                            data={groups5}
                            defaultSelect
                          />
                        ) : (
                          undefined
                        )}
                      </div>
                      <div className={cs['default-group']}>
                        {!item.verify ? (
                          <span className="required" />
                        ) : (
                          undefined
                        )}
                        {`MT5 ${
                          i18n['task.object_setting.review.default_leverage']
                        }: `}
                        <div className={cs['server-select-box']}>
                          <DropdownForCode
                            defaultSelect
                            onChange={onChange.bind(this, 'leverage5', index)}
                            value={item.leverage5}
                            disabled={disabled}
                            data={leverageList.mt5}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  undefined
                )}
                {serverList.ct && serverList.ct.length > 0 ? (
                  <div
                    className={`${cs['dropdown-box']} ${cs['dropdown-top']}`}
                  >
                    <div className={cs['grid-label']}>
                      {!item.verify ? <span className="required" /> : undefined}
                      {i18n['task.object_setting.review.cbrocker_default']}:
                    </div>
                    <div className={cs['grid-control']}>
                      <div className={cs['grid-warp']}>
                        <ObjectSettingCtraderForm
                          formName={`${item.jobType}_CTRADER_FORM`}
                          initialValues={item.cbroker || {}}
                          disabled={disabled}
                          onSubmit={onSubmit}
                          verify={item.verify}
                          onError={onError}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  undefined
                )}
              </div>
            ) : (
              undefined
            )}
          </div>
        );
      })}
    </div>
  );
};

const dropdownItem = item => {
  return (
    <span>
      {item.label}
      {item.isRole && (
        <Tag className={cs.dropdownTag} color="yellow">
          {i18n['task.object_member.table_header.role']}
        </Tag>
      )}
    </span>
  );
};

// 任务组提醒设置
const TaskReminderSet = ({ data, value, onChange, disabled }) => (
  <div className={cs['grid']}>
    {data.map((v, index) => {
      const item = value[index];
      return (
        <div key={index} className={cs['grid-item']}>
          <div className={cs['grid-label']}>
            <FormattedMessage
              id="task.object_setting.review.label"
              defaultMessage={`${i18n['task.object_setting.reminder.label']}:`}
              values={{
                name:
                  i18n[
                    `task.object_setting.task_setting.task_group_type.${
                      item.jobType
                    }`
                  ]
              }}
            />
          </div>
          <div className={cs['grid-control']}>
            <Dropdown
              className={cs['remainder-dropdown']}
              onSelect={onChange.bind(this, 'reminder', index)}
              data={v}
              checkbox
              searchable
              renderMenuItem={dropdownItem}
              disabled={disabled}
              value={item.reminder}
            />
          </div>
        </div>
      );
    })}
  </div>
);
