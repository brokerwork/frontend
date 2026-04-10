import i18n from 'utils/i18n';
import CardPanel from 'components/v2/CardPanel';
import {
  Checkbox,
  Button,
  Collapse,
  Form,
  Input,
  Tooltip,
  Icon
} from 'lean-ui';
import { FormattedMessage } from 'react-intl';
import cs from './TaskDetails.less';
import TaskInfo from './TaskInfo';
import EditTask from './EditTask';
import TaskLogAndComment from './TaskLogAndComment';
import _ from 'lodash';
import OpenAccountTemplate from './OpenAccountTemplate';
import iframeView from 'utils/iframeView';
import html2canvas from 'utils/html2canvas';
import jsPDF from 'jspdf';
import { findDOMNode } from 'react-dom';
import moment from 'moment';

import Account, {
  ACCOUNT_FORM_BASIC_INFO,
  ACCOUNT_FORM_ID_INFO,
  ACCOUNT_FORM_ACCOUNT_INFO,
  ACCOUNT_FORM_FINACIAL_INFO
} from './taskTypesComponents/Account';

import Leverage from './taskTypesComponents/Leverage';
import Deposit from './taskTypesComponents/Deposit';
import Transfer from './taskTypesComponents/Transfer';
import Withdraw from './taskTypesComponents/Withdraw';
import Bind from './taskTypesComponents/Bind';
import UpdateOwner from './taskTypesComponents/UpdateOwner';
import AgencyRegister from './taskTypesComponents/AgencyRegister';
import AgencyWithdraw from './taskTypesComponents/AgencyWithdraw';
import ResetTrade from './taskTypesComponents/ResetTrade';

import { TASK_TYPES, TELEGRAPHIC_DEPOSIT_KEY } from '../../contants';
import { RistWarning as RistWarningWithdraw } from './taskTypesComponents/Withdraw';
import { RistWarning as RistWarningTrans } from './taskTypesComponents/Transfer';

import { RistWarning as RistWarningAgency } from './taskTypesComponents/AgencyWithdraw';
import { VIEW_TYPE } from '../../contants';

import {
  USER_FORM_USER_INFO,
  USER_FORM_REAK_RULE,
  USER_FORM_AGENCT_INFO,
  USER_FORM_ACCOUNT_INFO
} from '../../../Usermgmt/components/UpdateUserCard/MainPanel';

import { DEPOSIT_FORM } from './taskTypesComponents/Deposit';
import { JOB_TYPES_NEED_VERIFY } from '../TaskVerify';
import VAInfo, { VA_INFO_FORM } from './taskTypesComponents/VAInfo';
import { getType } from 'utils/language';

const Panel = Collapse.Item;

export default class TaskDetails extends PureComponent {
  _accountSubmitData = {};

  state = {
    edit: false,
    rejectReason: '',
    sendRejectEmail: false,
    deleteCustomer: false,
    formDataReady: false,
    formFieldsArray: [],
    activeKey: 1,
    sendEmail: true,
    updateInfoName: false,
    taskEnabled: true,
    comfirmContentAddition: '',
    isReplaceDefaultComfirmContent: false,
    customerId: '',
    accountInfoReady: false
  };
  render() {
    const {
      edit,
      formFieldsArray,
      formDataReady,
      activeKey,
      taskEnabled,
      accountInfoReady
    } = this.state;
    const {
      data,
      priorityOptions,
      accountDropdownData,
      userInfo,
      taskMembers,
      formFields,
      showFormFields,
      formData,
      getExternalFormData,
      match: {
        params: { taskId }
      },
      location: { state },
      log,
      approvalProcess,
      getLog,
      getApprovalProcess,
      addComment,
      showTopAlert,
      passwordRegular,
      getServerPasswordRegular,
      getSameAccount,
      sameAccounts,
      userAgentColumns,
      taskType,
      getWithdrawFormField,
      withdrawFormField,
      getCtraderCurrencyByServerId,
      changeFormField,
      touchFromField,
      submitAccountForm,
      isAdaptOn,
      validateIdNum,
      verifyIdentity,
      userRights,
      withdrawCustomType,
      withdrawTypes,
      accountTypes,
      versionRights,
      getCurrentRate,
      currentRate,
      accountInfo,
      accountInfoPosition,
      changeAccountForm
    } = this.props;
    const infoTitle = (
      <FormattedMessage
        id="task.taks_details.task_info"
        defaultMessage={i18n['task.taks_details.task_info']}
        values={{
          value:
            i18n[
              `task.object_setting.task_setting.task_group_type.${data.jobType}`
            ]
        }}
      />
    );
    // 任务是否可以编辑
    // const couldEdit = data.isEdit && data.viewType === VIEW_TYPE.PROCESS;
    const couldEdit = data.viewType === VIEW_TYPE.PROCESS;
    let F;
    let btnText =
      i18n[`task.object_setting.task_setting.task_group_type.${data.jobType}`];
    let subTitle = '';
    switch (data.jobType) {
      // 开户
      case 'JOB_TYPE_TA_OPEN':
        F = (
          <Account
            initialValues={formData}
            onSubmit={this.getAccountFormData}
            fields={formFieldsArray}
            originData={formFields}
            data={showFormFields}
            activeKey={activeKey}
            getExternalFormData={getExternalFormData}
            accountDropdownData={accountDropdownData}
            disabled={!couldEdit}
            taskId={taskId}
            taskState={data.viewType}
            showTopAlert={showTopAlert}
            passwordRegular={passwordRegular}
            getCtraderCurrencyByServerId={getCtraderCurrencyByServerId}
            getServerPasswordRegular={getServerPasswordRegular}
            changeFormField={changeFormField}
            touchFromField={touchFromField}
            validateIdNum={validateIdNum}
            jobType={data.jobType}
            taskData={data}
            isAdaptOn={isAdaptOn}
            userRights={userRights}
            accountTypes={accountTypes}
            changeAccountForm={changeAccountForm}
          />
        );
        break;
      // 同名账户开户
      case 'JOB_TYPE_TA_SAME_OPEN':
        F = (
          <Account
            initialValues={formData}
            onSubmit={this.getAccountFormData}
            fields={formFieldsArray}
            originData={formFields}
            data={showFormFields}
            activeKey={activeKey}
            getExternalFormData={getExternalFormData}
            accountDropdownData={accountDropdownData}
            disabled={!couldEdit}
            taskId={taskId}
            taskState={data.viewType}
            disabledData={true}
            showTopAlert={showTopAlert}
            passwordRegular={passwordRegular}
            getServerPasswordRegular={getServerPasswordRegular}
            getSameAccount={getSameAccount}
            getCtraderCurrencyByServerId={getCtraderCurrencyByServerId}
            sameAccounts={sameAccounts}
            changeFormField={changeFormField}
            touchFromField={touchFromField}
            validateIdNum={validateIdNum}
            jobType={data.jobType}
            taskData={data}
            isAdaptOn={isAdaptOn}
            userRights={userRights}
            accountTypes={accountTypes}
            changeAccountForm={changeAccountForm}
          />
        );
        break;
      // 调整杠杆
      case 'JOB_TYPE_TA_LEVERAGE':
        F = (
          <Leverage
            getExternalFormData={getExternalFormData}
            initialValues={formData}
          />
        );
        break;
      // 入金
      case 'JOB_TYPE_TA_DEPOSIT':
        F = (
          <Deposit
            getExternalFormData={getExternalFormData}
            initialValues={formData}
            showTopAlert={showTopAlert}
            disabled={!couldEdit}
            onSubmit={this.getAccountFormData}
          />
        );
      // 电汇入金申请
      case 'JOB_TYPE_TA_TELEGRAPHIC_DEPOSIT':
        F = (
          <Deposit
            getExternalFormData={getExternalFormData}
            initialValues={formData}
            data={data}
            showTopAlert={showTopAlert}
            disabled={!couldEdit}
            onSubmit={this.getAccountFormData}
            getCurrentRate={getCurrentRate}
            currentRate={currentRate}
          />
        );
        const isTelegraphic =
          formData &&
          formData.applicationData &&
          formData.applicationData.payPlatform === TELEGRAPHIC_DEPOSIT_KEY;
        subTitle = isTelegraphic
          ? i18n['task.taks_details.task_info.deposit_title.telegraphic']
          : i18n['task.taks_details.task_info.deposit_title.online'];
        btnText =
          i18n['task.object_setting.task_setting.btn_text.JOB_TYPE_TA_DEPOSIT'];
        break;
      // 代理出金申请
      case 'JOB_TYPE_AGENCY_WITHDRAW':
        F = (
          <AgencyWithdraw
            ref="JOB_TYPE_AGENCY_WITHDRAW"
            getExternalFormData={getExternalFormData}
            initialValues={formData}
            withdrawTypes={withdrawTypes}
            setComfirmContent={this.setComfirmContent}
            withdrawCustomType={withdrawCustomType}
          />
        );
        btnText =
          i18n[
            'task.object_setting.task_setting.btn_text.JOB_TYPE_TA_WITHDRAW'
          ];
        break;
      // 出金申请
      case 'JOB_TYPE_TA_WITHDRAW':
        F = (
          <Withdraw
            ref="JOB_TYPE_TA_WITHDRAW"
            getWithdrawFormField={getWithdrawFormField}
            withdrawFormField={withdrawFormField}
            getExternalFormData={getExternalFormData}
            setComfirmContent={this.setComfirmContent}
            initialValues={formData}
            withdrawTypes={withdrawTypes}
            withdrawCustomType={withdrawCustomType}
          />
        );
        btnText =
          i18n[
            'task.object_setting.task_setting.btn_text.JOB_TYPE_TA_WITHDRAW'
          ];
        break;
      // 内部出金申请
      case 'JOB_TYPE_BW_WITHDRAW':
        F = (
          <Withdraw
            ref="JOB_TYPE_BW_WITHDRAW"
            getWithdrawFormField={getWithdrawFormField}
            withdrawFormField={withdrawFormField}
            getExternalFormData={getExternalFormData}
            setComfirmContent={this.setComfirmContent}
            initialValues={formData}
          />
        );
        btnText =
          i18n[
            'task.object_setting.task_setting.btn_text.JOB_TYPE_TA_WITHDRAW'
          ];
        break;
      // 内部转账
      case 'JOB_TYPE_TA_TRANSFER':
        F = (
          <Transfer
            ref="JOB_TYPE_TA_TRANSFER"
            getExternalFormData={getExternalFormData}
            initialValues={formData}
          />
        );
        btnText =
          i18n[
            'task.object_setting.task_setting.btn_text.JOB_TYPE_TA_TRANSFER'
          ];
        break;
      // 内部转账
      case 'JOB_TYPE_BW_TRANSFER':
        F = (
          <Transfer
            ref="JOB_TYPE_BW_TRANSFER"
            getExternalFormData={getExternalFormData}
            initialValues={formData}
          />
        );
        btnText =
          i18n[
            'task.object_setting.task_setting.btn_text.JOB_TYPE_TA_TRANSFER'
          ];
        break;
      // 绑定账户
      case 'JOB_TYPE_TA_BIND':
        F = (
          <Bind
            getExternalFormData={getExternalFormData}
            initialValues={formData}
          />
        );
        break;
      // 修改账户所有人资料
      case 'JOB_TYPE_TA_UPDATE_OWNER':
        F = (
          <UpdateOwner
            taskState={data.viewType}
            getExternalFormData={getExternalFormData}
            initialValues={formData}
          />
        );
        break;
      // 代理申请注册
      case 'JOB_TYPE_AGENCY_REGISTER':
        F = (
          <AgencyRegister
            fields={userAgentColumns}
            onSubmit={this.getAccountFormData}
            disabled={!couldEdit}
            initialValues={formData}
            toggleTaskEnabled={this.toggleTaskEnabled}
            {...this.props}
          />
        );
        btnText =
          i18n[
            'task.object_setting.task_setting.btn_text.JOB_TYPE_AGENCY_REGISTER'
          ];
        break;
      // 重置密码
      case 'JOB_TYPE_TA_RESET_TRADE':
        F = (
          <ResetTrade
            getExternalFormData={getExternalFormData}
            initialValues={formData}
          />
        );
        break;
    }
    let customAccountTypeLabel = '';
    if (['JOB_TYPE_TA_OPEN', 'JOB_TYPE_TA_SAME_OPEN'].includes(data.jobType)) {
      const customAccountTypeValue = _.get(formData, 'customAccountType', '');
      if (customAccountTypeValue) {
        const cur = _.find(accountTypes['all'], {
          value: customAccountTypeValue
        });
        if (cur && accountTypes['all'].length > 1) {
          customAccountTypeLabel = _.get(cur, 'label', '');
        }
      }
    }
    // 杠杆-账户-持仓单

    const ticketList = _.get(accountInfoPosition, 'trade.list', []);
    console.log('formData', formData);
    return (
      <div className={cs['task-detail-container']}>
        <OpenAccountTemplate
          ref="accountTemplate"
          fields={formFields}
          data={{
            ...formData,
            creator: data.creator && data.creator.name,
            createTime: data.createTime,
            categoryName: data.categoryName
          }}
        />
        <CardPanel
          onClose={this.onClose}
          show={true}
          title={<span>{i18n['task.details.title']}</span>}
        >
          {!edit ? (
            <Collapse forceActiveAll={true}>
              <div className={cs['basic-info']}>
                <TaskInfo
                  exportPdf={this.exportPdf}
                  taskType={taskType}
                  data={data}
                  editTask={this.editTask}
                  getTheTask={this.getTheTask}
                  taskInitialValues={formData}
                  getExternalFormData={getExternalFormData}
                  verifyIdentity={verifyIdentity}
                  userRights={userRights}
                  taskFields={formFields}
                />
              </div>
              <Panel
                key={'info'}
                title={
                  <span>
                    {infoTitle}
                    {subTitle ? `(${subTitle})` : ''}
                    {customAccountTypeLabel &&
                    versionRights['SC_CUSTOM_ACCOUNT_TYPE'] ? (
                      <span style={{ color: '#aaa' }}>
                        {'       '}
                        {i18n['task.details.field.customAccountType']}
                        {':'}
                        {customAccountTypeLabel}
                      </span>
                    ) : null}
                    {(data.jobType === 'JOB_TYPE_TA_OPEN' ||
                      data.jobType === 'JOB_TYPE_TA_SAME_OPEN') && [
                      <span style={{ margin: '0 5px' }}>
                        {i18n['customer.fuzzy_search_type.customer_name']}：
                        {_.get(formData, 'externalData.customer.name')}
                      </span>,
                      <span style={{ margin: '0 5px' }}>
                        {i18n['customer.number']}：
                        {_.get(formData, 'externalData.customer.entityNo')}
                      </span>
                    ]}
                  </span>
                }
              >
                {formDataReady ? F : undefined}
                {formData.comment &&
                data.jobType !== 'JOB_TYPE_AGENCY_REGISTER' ? ( //JOB_TYPE_AGENCY_REGISTER的表单中重复显示了comment字段
                  <Form>
                    <Form.Item col={2}>
                      <Form.Label>{i18n['general.remarks']}：</Form.Label>
                      <Form.Control className={cs['form-text']}>
                        <div className={cs['comment']}>{formData.comment}</div>
                      </Form.Control>
                    </Form.Item>
                  </Form>
                ) : (
                  undefined
                )}
              </Panel>
              {/* 调整杠杆相关的账户信息 */}
              {data.jobType === 'JOB_TYPE_TA_LEVERAGE' && accountInfoReady ? (
                <Panel
                  key="account_info"
                  title={i18n['task.details.account_info.title']}
                >
                  <Form.Item>
                    <Form.Label>
                      {i18n['task.details.account_info.marginLevel']}
                    </Form.Label>
                    <Form.Control className={cs['form-text']}>{`${
                      accountInfo[0].marginLevel
                    }%`}</Form.Control>
                  </Form.Item>
                  <Form.Item>
                    <Form.Label>
                      {i18n['task.details.account_info.ticket']}
                      {`(${_.get(accountInfoPosition, 'trade.total', 0)})`}
                    </Form.Label>
                    <Form.Control className={cs['form-text']}>
                      <ul>
                        {ticketList.map(t => (
                          <li key={t.ticket}>
                            {i18n['task.details.account_info.ticket.no']}:
                            {t.ticket}
                          </li>
                        ))}
                      </ul>
                    </Form.Control>
                  </Form.Item>
                </Panel>
              ) : null}
              {formDataReady &&
              (data.jobType === 'JOB_TYPE_TA_WITHDRAW' ||
                data.jobType === 'JOB_TYPE_BW_WITHDRAW') ? (
                <RistWarningWithdraw
                  getExternalFormData={getExternalFormData}
                  taskId={taskId}
                  initialValues={formData}
                />
              ) : (
                undefined
              )}

              {formDataReady &&
              (data.jobType === 'JOB_TYPE_TA_TRANSFER' ||
                data.jobType === 'JOB_TYPE_BW_TRANSFER') ? (
                <RistWarningTrans
                  getExternalFormData={getExternalFormData}
                  taskId={taskId}
                  initialValues={formData}
                />
              ) : (
                undefined
              )}

              {formDataReady && data.jobType === 'JOB_TYPE_AGENCY_WITHDRAW' ? (
                <RistWarningAgency
                  getExternalFormData={getExternalFormData}
                  taskId={taskId}
                  initialValues={formData}
                />
              ) : (
                undefined
              )}

              {formDataReady &&
              data.jobType === 'JOB_TYPE_TA_OPEN' &&
              !!formData.virtualAccountInfo ? (
                <Panel key="vaInfo" title={i18n['task.details.title.vainfo']}>
                  <VAInfo
                    initialValues={formData.virtualAccountInfo}
                    onSubmitSuccess={this.getAccountFormData}
                    disabled={!this.needVAInfo()}
                  />
                </Panel>
              ) : (
                undefined
              )}

              <Panel
                title={i18n['task.taks_details.comment_and_flow']}
                key={'comment'}
              >
                <TaskLogAndComment
                  taskId={taskId}
                  taskType={taskType}
                  log={log}
                  userInfo={userInfo}
                  getLog={getLog}
                  addComment={addComment}
                  getApprovalProcess={getApprovalProcess}
                  approvalProcess={approvalProcess}
                />
              </Panel>
              {// 未认领, 认领未处理的任务才需要显示下方的处理按钮
              [VIEW_TYPE.CLAIM, VIEW_TYPE.PROCESS].includes(data.viewType) && (
                <CardPanel.Footer>
                  {/**任务领取按钮**/}
                  {data.viewType === VIEW_TYPE.CLAIM && (
                    <Button onClick={this.getTheTask} type="primary">
                      {i18n['task.taks_details.get_the_task']}
                    </Button>
                  )}
                  {/**转账, 出金成功, 出金失败, 显示重新入金按钮**/}
                  {data.jobType === 'JOB_TYPE_TA_TRANSFER' &&
                  data.viewType === VIEW_TYPE.PROCESS &&
                  formData.status == '3' ? (
                    <Button onClick={this.submitTask} type="primary">
                      {i18n['task.taks_details.deposit_again']}
                    </Button>
                  ) : (
                    // 领取任务后,显示执行任务及拒绝任务按钮
                    data.viewType === VIEW_TYPE.PROCESS && (
                      <div>
                        {/** 移交下一级审批 */}
                        <Button
                          onClick={this.submitTask}
                          type="primary"
                          disabled={!taskEnabled}
                        >
                          {!data.isLastAudit
                            ? i18n['task.taks_details.reject_to_next']
                            : btnText}
                        </Button>
                        {/** 交回上一级审批 第一步任务不能驳回至上一级 */}
                        {data.auditStep !== 1 && (
                          <Button onClick={this.refuseToPrevStep}>
                            {i18n['task.taks_details.reject_to_prev']}
                          </Button>
                        )}
                        {/** 直接拒绝 */}
                        <Button onClick={this.rejectDirectly}>
                          {i18n['task.taks_details.reject']}
                        </Button>
                      </div>
                    )
                  )}
                </CardPanel.Footer>
              )}
            </Collapse>
          ) : (
            <EditTask
              options={{
                priorityOptions,
                taskMembers
              }}
              onSubmit={this.editFinish}
              onCancel={this.editFinish.bind(this, false)}
              data={data}
            />
          )}
        </CardPanel>
      </div>
    );
  }
  exportPdf = () => {
    this.props.showTopAlert({
      bsStyle: 'success',
      content: i18n['task.export.tips.creating']
    });
    html2canvas(findDOMNode(this.refs.accountTemplate), {
      scale: 2,
      allowTaint: false,
      height: 2000,
      onrendered: canvas => {
        const width = 595;
        const height = canvas.height * (width / canvas.width);
        var pageData = canvas.toDataURL('image/jpeg', 1);
        const img = new Image();
        img.src = pageData;
        var pdf = new jsPDF('', 'pt', 'a4');
        pdf.addImage(pageData, 'JPEG', 0, 0, width, height);
        pdf.save(`${moment().unix()}.pdf`);
      }
    });
  };
  getAccountFormData = _.throttle(
    data => {
      const {
        submitAccountForm,
        data: { isLastAudit, jobType },
        match: {
          params: { taskId }
        },
        getFormData
      } = this.props;
      this._accountSubmitData = _.merge(this._accountSubmitData, data);

      if (this.needVAInfo()) {
        if (
          !this._accountSubmitData.account ||
          !this._accountSubmitData.virtualAccountInfo
        ) {
          //判断除了普通账户的表单数据是否获取到了虚拟银行账户信息表单的数据
          return;
        }
        this._accountSubmitData.openVirtualAccount = true;
      }
      let submitData = _.cloneDeep(this._accountSubmitData);
      submitAccountForm(taskId, submitData).then(res => {
        const { result } = res;
        if (result) {
          // 是最后一步不弹窗
          if (!isLastAudit) {
            this.approvalTask();
          } else {
            this.submitHandle(submitData);
          }
        }
      });
      this._accountSubmitData = {};
    },
    500,
    {
      leading: true
    }
  );

  /**
   * 是否需要虚拟银行账户信息的处理
   * @return {*}
   */
  needVAInfo = () => {
    const {
      formData: { openVirtualAccount }
    } = this.props;

    return openVirtualAccount;
  };

  submitHandle = submitData => {
    const {
      showTipsModal,
      data: { jobType, jobId, nowStep },
      checkEmailRepeat
    } = this.props;
    const { updateInfoName } = this.state;
    const categoryName =
      i18n[`task.object_setting.task_setting.task_group_type.${jobType}`];
    const { applicationData = {} } = this.props.formData;
    const {
      sendEmail,
      comfirmContentAddition,
      isReplaceDefaultComfirmContent
    } = this.state;
    const taskId = jobId;
    // 除了修改账户所有人资料表单以外，其他表单都要有 是否发送邮件的选项.
    const hasEmailField = ![
      'JOB_TYPE_TA_UPDATE_OWNER',
      'JOB_TYPE_TA_BIND',
      'JOB_TYPE_TA_RESET_TRADE'
    ].includes(jobType);
    const header = (
      <FormattedMessage
        id="task.taks_details.approval_title"
        defaultMessage={i18n['task.taks_details.approval_title']}
        values={{ value: categoryName }}
      />
    );
    let depositContent;
    if (
      jobType === 'JOB_TYPE_TA_DEPOSIT' &&
      applicationData.payStatus === 'Pending'
    ) {
      depositContent = i18n['task.taks_details.deposit_no_pay'];
    }
    if (JOB_TYPES_NEED_VERIFY.includes(jobType)) {
      this.setState(
        {
          formDataReady: false
        },
        () => {
          this.updateDetails();
        }
      );
    }
    const email = _.get(submitData, 'email', '');
    checkEmailRepeat(email).then(({ result, data }) => {
      if (result) {
        const repeatList = _.get(data, 'list', []);
        // customName
        // customerId
        const content = (
          <div>
            {comfirmContentAddition}
            {isReplaceDefaultComfirmContent ? (
              undefined
            ) : depositContent ? (
              <FormattedMessage
                id="task.taks_details.approval_content"
                defaultMessage={depositContent}
                values={{ value: categoryName }}
              />
            ) : (
              <FormattedMessage
                id="task.taks_details.approval_content"
                defaultMessage={i18n['task.taks_details.approval_content']}
                values={{ value: categoryName }}
              />
            )}
            <br />
            {hasEmailField ? (
              <Checkbox
                className={cs['sendEmail']}
                defaultChecked={sendEmail}
                onChange={() => this.onCheck('sendEmail')}
              >
                <FormattedMessage
                  id="task.taks_details.send_task_email"
                  defaultMessage={i18n['task.taks_details.send_task_email']}
                  values={{ value: categoryName }}
                />
              </Checkbox>
            ) : (
              undefined
            )}
            {/* 检测到邮箱相同的客户 */}
            {repeatList.length ? (
              <Checkbox
                className={cs['sendEmail']}
                defaultChecked={updateInfoName}
                onChange={() => this.onCheck('updateInfoName')}
              >
                <FormattedMessage
                  id="task.taks_details.update_name_email_repeat"
                  defaultMessage={
                    i18n['task.taks_details.update_name_email_repeat']
                  }
                  values={{
                    value: repeatList.map(item => item.customName).join('/')
                  }}
                />
              </Checkbox>
            ) : null}
          </div>
        );
        showTipsModal({
          header,
          content,
          onConfirm: _.throttle(
            cb => {
              // cb();
              const { sendEmail, updateInfoName } = this.state;
              let repeatCustomerIds = '';
              if (updateInfoName) {
                repeatCustomerIds = repeatList
                  .map(item => item.customerId)
                  .join(',');
              }
              this.approvalTask(
                true,
                cb,
                sendEmail,
                submitData,
                repeatCustomerIds
              );
            },
            500,
            {
              leading: true
            }
          )
        });
      }
    });
  };
  // 剥离发送逻辑, 跟提示弹窗分离, 移交下级审批时, 不需要弹窗
  approvalTask = (
    isLast,
    cb = _.noop,
    sendEmail,
    submitData,
    repeatCustomerIds
  ) => {
    const {
      data: { jobType, jobId, nowStep },
      approvalTask,
      getDetails,
      showTopAlert,
      showTipsModal,
      bindCtid
    } = this.props;

    const categoryName =
      i18n[`task.object_setting.task_setting.task_group_type.${jobType}`];
    const taskId = jobId;
    approvalTask(taskId, nowStep, sendEmail, repeatCustomerIds).then(res => {
      const { result, data } = res;
      if (result) {
        // ctid 绑定
        // 代理注册任务注释掉，万一以后又加上呢 - 注释得棒啊👍
        const ctid =
          _.get(submitData, 'account.ctid', '') ||
          _.get(submitData, 'accountInfo-ctid', '');
        const login = data ? data.login : _.get(submitData, 'login', '');
        if (!!submitData && ctid && login) {
          bindCtid(login, ctid, {
            vendor: this.vendor || submitData.vendor,
            serverId: submitData.account.serverId || submitData.serverId
          });
        }
        // 入金任务超时时提示用户
        if (!!data && data.remainTime) {
          const timer = Math.ceil(parseInt(data.remainTime) / 60);
          showTipsModal({
            content: (
              <FormattedMessage
                id="task.taks_details.task_time_out"
                defaultMessage={i18n['task.taks_details.task_time_out']}
                values={{
                  time: timer,
                  type:
                    i18n[
                      `task.object_setting.task_setting.task_group_type.${jobType}`
                    ]
                }}
              />
            ),
            onConfirm: c => c()
          });
          return;
        }
        cb();
        getDetails(taskId);
        this.onClose();
        showTopAlert({
          content: isLast ? (
            <FormattedMessage
              id="task.taks_details.task_handle_success"
              defaultMessage={i18n['task.taks_details.task_handle_success']}
              values={{ value: categoryName }}
            />
          ) : (
            i18n['task.taks_details.to_next_success']
          ),
          bsStyle: 'success'
        });
        // 出金任务在失败时, 通过组件内部函数,刷新
        // 余额，净值，可用保证金 3个字段
      } else {
        if (jobType === 'JOB_TYPE_TA_WITHDRAW') {
          cb();
          const withdrawComponent = this.refs['JOB_TYPE_TA_WITHDRAW'];
          if (withdrawComponent) withdrawComponent.getExternalData();
        } else if (jobType === 'JOB_TYPE_AGENCY_WITHDRAW') {
          cb();
          const withdrawComponent = this.refs['JOB_TYPE_AGENCY_WITHDRAW'];
          if (withdrawComponent) withdrawComponent.getExternalData();
        } else if (jobType === 'JOB_TYPE_AGENCY_REGISTER') {
          cb();
          this.setState(
            {
              formDataReady: false
            },
            () => {
              this.jobType_is_not_OPEN();
            }
          );
        }
        return Promise.resolve(res);
      }
    });
  };
  submitTask = _.throttle(
    () => {
      const {
        data: { jobType, isLastAudit },
        submitForm
      } = this.props;
      // 如果是账户开户，同名账户开户 则先提交表单，然后再提交开户申请
      if (
        jobType === 'JOB_TYPE_TA_OPEN' ||
        jobType === 'JOB_TYPE_TA_SAME_OPEN'
      ) {
        this._accountSubmitData = {};
        submitForm(ACCOUNT_FORM_BASIC_INFO);
        submitForm(ACCOUNT_FORM_ID_INFO);
        submitForm(ACCOUNT_FORM_ACCOUNT_INFO);
        submitForm(ACCOUNT_FORM_FINACIAL_INFO);

        if (this.needVAInfo()) {
          submitForm(VA_INFO_FORM);
        }
        return;
      } else if (jobType === 'JOB_TYPE_AGENCY_REGISTER') {
        // 代理注册
        submitForm(USER_FORM_USER_INFO);
        submitForm(USER_FORM_REAK_RULE);
        submitForm(USER_FORM_AGENCT_INFO);
        submitForm(USER_FORM_ACCOUNT_INFO);
        return;
      } else if (
        jobType === 'JOB_TYPE_TA_DEPOSIT' ||
        jobType === 'JOB_TYPE_TA_TELEGRAPHIC_DEPOSIT'
      ) {
        // 入金
        submitForm(DEPOSIT_FORM);
        return;
      }
      if (isLastAudit) {
        this.submitHandle();
      } else {
        this.approvalTask(false);
      }
    },
    500,
    {
      leading: true
    }
  );
  editFinish = data => {
    const {
      getDetails,
      updateTaskBasicData,
      match: {
        params: { taskId }
      },
      showTopAlert,
      data: { nowStep }
    } = this.props;
    if (data) {
      updateTaskBasicData(taskId, nowStep, data).then(({ result }) => {
        if (result) {
          getDetails(taskId);
          this.setState({
            edit: false
          });
          showTopAlert({
            content: i18n['general.modify_success'],
            bsStyle: 'success'
          });
        }
      });
    } else {
      this.setState({
        edit: false
      });
    }
  };
  editTask = () => {
    const {
      getTaskMembers,
      match: {
        params: { objectId }
      },
      data: { jobId, nowStep }
    } = this.props;
    getTaskMembers(jobId, nowStep);
    this.setState({
      edit: true
    });
  };
  // 直接拒绝
  rejectDirectly = () => {
    this.prepareRejectTask(true);
  };
  // 交回上一级审批
  refuseToPrevStep = () => {
    this.prepareRejectTask(false);
  };
  prepareRejectTask = isRejectDirectly => {
    const {
      checkRealState,
      showTipsModal,
      showTopAlert,
      data: { jobType, jobId },
      formData: { applicationData: { payStatus } = {}, messageCode } = {}
    } = this.props;
    if (jobType === 'JOB_TYPE_TA_DEPOSIT' && payStatus === 'Finished') {
      const content = (
        <FormattedMessage
          id="task.reject.comfirm_payed"
          defaultMessage={i18n['task.reject.comfirm_payed']}
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
        onConfirm: this.rejectTask.bind(this, isRejectDirectly)
      });
    } else if (jobType === 'JOB_TYPE_TA_TRANSFER' && messageCode) {
      checkRealState(jobId).then(rs => {
        const content = (
          <div>
            {i18n['task.details.transfer.tip1']}
            <br />
            {i18n['task.details.transfer.tip2']}
          </div>
        );

        if (rs.result) {
          if (rs.data === 'WITHDRAWAL_SUCCESS_DEPOSIT_FAIL') {
            showTipsModal({
              content,
              confirmBtnText: i18n['task.details.transfer.try'],
              onConfirm: () => {
                this.submitTask();
              }
            });
          } else if (rs.data === 'SUCCESS') {
            showTopAlert({
              bsStyle: 'success',
              content: i18n['task.details.transfer.success']
            });
            this.onClose();
          } else if (rs.data === 'FAIL') {
            this.rejectTask(isRejectDirectly);
          }
        }
      });
    } else {
      this.rejectTask(isRejectDirectly);
    }
  };
  rejectTask = async isRejectDirectly => {
    const {
      showTipsModal,
      data: { jobType, nowStep },
      rejectTask,
      match: {
        params: { taskId }
      },
      getDetails,
      showTopAlert,
      taskType,
      haveTwUser
    } = this.props;
    const { sendRejectEmail, deleteCustomer, customerId } = this.state;
    const maxLength = 300;
    const categoryName =
      i18n[`task.object_setting.task_setting.task_group_type.${jobType}`];
    const header = isRejectDirectly ? (
      <FormattedMessage
        id="task.taks_details.reject_task_title"
        defaultMessage={i18n['task.taks_details.reject_task_title']}
        values={{ value: categoryName }}
      />
    ) : (
      <FormattedMessage
        id="task.taks_details.refuse_task_title"
        defaultMessage={i18n['task.taks_details.refuse_task_title']}
        values={{ value: categoryName }}
      />
    );
    let haveTwUserData = {};
    if (customerId) {
      haveTwUserData = await haveTwUser(customerId);
    }

    const content = (
      <div className={cs['reject-content']}>
        <div className={cs['reject-reson']}>
          {`${
            isRejectDirectly
              ? i18n['task.taks_details.reject_reson']
              : i18n['task.taks_details.refuse_reson']
          }: `}
          <FormattedMessage
            id="task.taks_details.reject_length"
            defaultMessage={i18n['task.taks_details.reject_length']}
            values={{ number: maxLength }}
          />
          <Tooltip
            autoAdjustOverflow={false}
            placement="right"
            trigger="click"
            title={<div>{i18n['task.taks_details.reject_length.hint']}</div>}
          >
            <span className={cs['tipsBox']}>
              <Icon icon="question" />
            </span>
          </Tooltip>
        </div>
        <div className={cs['reject-reson']}>
          <Input.TextArea
            onChange={this.setRejectType.bind(this, 'rejectReason')}
            maxLength={maxLength}
          />
        </div>
        {isRejectDirectly &&
        (taskType === TASK_TYPES.TA ||
          jobType === 'JOB_TYPE_AGENCY_REGISTER' ||
          jobType === 'JOB_TYPE_AGENCY_WITHDRAW') ? (
          <Checkbox
            defaultChecked={sendRejectEmail}
            onChange={this.setRejectType.bind(this, 'sendRejectEmail')}
          >
            {taskType === TASK_TYPES.TA
              ? i18n['task.taks_details.reject_send_message_to_tw']
              : i18n['task.taks_details.reject_send_message_to_bw']}
          </Checkbox>
        ) : (
          undefined
        )}
        {isRejectDirectly &&
        (taskType === TASK_TYPES.TA ||
          jobType === 'JOB_TYPE_AGENCY_REGISTER') &&
        haveTwUserData.data === false ? (
          <Checkbox
            defaultChecked={deleteCustomer}
            onChange={this.setRejectType.bind(this, 'deleteCustomer')}
          >
            {i18n['task.taks_details.delete_customer']}
          </Checkbox>
        ) : null}
      </div>
    );
    const defaultCheckedCache = sendRejectEmail;
    showTipsModal({
      header,
      content,
      confirmBtnStyle: 'danger',
      confirmBtnText: isRejectDirectly
        ? i18n['general.reject']
        : i18n['general.refuse'],
      onConfirm: cb => {
        const { rejectReason, sendRejectEmail, deleteCustomer } = this.state;
        rejectTask(
          taskId,
          nowStep,
          isRejectDirectly,
          rejectReason,
          sendRejectEmail,
          deleteCustomer
        ).then(({ result }) => {
          cb();
          this.onClose();
          this.setState({
            rejectReason: '',
            sendRejectEmail: defaultCheckedCache,
            deleteCustomer: false
          });
          if (result) {
            getDetails(taskId);
            showTopAlert({
              content: isRejectDirectly
                ? i18n['task.taks_details.reject_success']
                : i18n['task.taks_details.reject_to_prev_success'],
              bsStyle: 'success'
            });
          }
        });
      }
    });
  };
  setComfirmContent = (comfirmContentAddition, isReplaceDefault) => {
    this.setState({
      comfirmContentAddition,
      isReplaceDefaultComfirmContent: isReplaceDefault
    });
  };
  setRejectType = (field, e) => {
    const ele = e.target;
    const v = field === 'rejectReason' ? ele.value : ele.checked;
    this.setState({
      [field]: v
    });
  };
  getTheTask = () => {
    const {
      getDetails,
      getTheTask,
      data: { nowStep, jobId },
      showTopAlert
    } = this.props;
    getTheTask(jobId, nowStep).then(({ result }) => {
      if (result) {
        getDetails(jobId);
        showTopAlert({
          content: i18n['task.object_detail.get_task_success'],
          bsStyle: 'success'
        });
      }
    });
  };
  onCheck = key => {
    this.setState({
      [key]: !this.state[key]
    });
  };

  toggleTaskEnabled = taskEnabled => {
    this.setState({
      taskEnabled
    });
  };
  componentDidMount() {
    this.updateDetails();
  }
  updateDetails() {
    const {
      getDetails,
      match: {
        params: { taskId }
      },
      getPriorityOptions
    } = this.props;
    getPriorityOptions(taskId);
    getDetails(taskId).then(({ result, data, mcode }) => {
      if (!result) return;
      // 不同的任务类型,执行不同的任务
      switch (data.jobType) {
        // 开户
        case 'JOB_TYPE_TA_OPEN':
        case 'JOB_TYPE_AGENCY_REGISTER':
          this.jobType_OPEN(1);
          break;
        // 同名账户开户
        case 'JOB_TYPE_TA_SAME_OPEN':
          this.jobType_OPEN(2);
          break;
        // 调整杠杆
        case 'JOB_TYPE_TA_LEVERAGE':
          this.jobType_is_not_OPEN();
          break;
        // 入金
        case 'JOB_TYPE_TA_DEPOSIT':
          this.jobType_is_not_OPEN();
        // 电汇入金
        case 'JOB_TYPE_TA_TELEGRAPHIC_DEPOSIT':
          this.jobType_is_not_OPEN();
          break;
        //代理出金申请
        case 'JOB_TYPE_AGENCY_WITHDRAW':
          this.jobType_is_not_OPEN();
          this.setState({ sendRejectEmail: true });
          break;
        // 出金申请
        case 'JOB_TYPE_TA_WITHDRAW':
        case 'JOB_TYPE_BW_WITHDRAW':
          this.jobType_is_not_OPEN();
          break;
        // 内部转账
        case 'JOB_TYPE_TA_TRANSFER':
        case 'JOB_TYPE_BW_TRANSFER':
          this.jobType_is_not_OPEN();
          break;
        // 绑定账户
        case 'JOB_TYPE_TA_BIND':
          this.setState({
            sendEmail: false
          });
          this.jobType_is_not_OPEN();
          break;
        // 修改账户所有人资料
        case 'JOB_TYPE_TA_UPDATE_OWNER':
          this.jobType_is_not_OPEN();
          break;
        // default:
        //   break;
        // 修改账户所有人资料
        case 'JOB_TYPE_AGENCY_REGISTER':
          this.jobType_is_not_OPEN();
          break;
        // 重置密码
        case 'JOB_TYPE_TA_RESET_TRADE':
          this.jobType_is_not_OPEN();
          break;
      }
    });
  }
  componentWillUnmount() {
    const { clearData } = this.props;
    clearData();
  }

  // 非开户类型相关信息
  jobType_is_not_OPEN = () => {
    const {
      getFormData,
      match: {
        params: { taskId }
      },
      getAccountInfo,
      getAccountInfoPosition
    } = this.props;
    getFormData(taskId).then(res => {
      const { data, formData, showTipsModal } = this.props;
      if (!res.result) return;
      let { sendRejectEmail, deleteCustomer } = this.state;
      //自动审核类的任务,执行失败时,弹出提示框
      let automaticTaskFaild =
        !data.verify && data.viewType === VIEW_TYPE.CLAIM;
      if (data.jobType === 'JOB_TYPE_TA_DEPOSIT' && formData.applicationData) {
        const inPending = formData.applicationData.payStatus === 'Pending';
        // sendMessageToTw = !inPending;
        automaticTaskFaild = automaticTaskFaild && !inPending;
      }
      if (data.jobType === 'JOB_TYPE_TA_UPDATE_OWNER') {
        //账户所有人资料
        if (data.partVerify) {
          automaticTaskFaild = false;
        }
      }
      if (automaticTaskFaild) {
        showTipsModal({
          content: (
            <FormattedMessage
              id="task.taks_details.automatic_task_faild"
              defaultMessage={i18n['task.taks_details.automatic_task_faild']}
              values={{
                name:
                  i18n[
                    `task.object_setting.task_setting.task_group_type.${
                      data.jobType
                    }`
                  ],
                reason: i18n.mcode(data.messageCode)
              }}
            />
          ),
          noCancel: true,
          onConfirm: cb => cb()
        });
      }
      //转账 入金成功 出金失败时,提示用户.
      if (
        data.jobType === 'JOB_TYPE_TA_TRANSFER' &&
        data.viewType === VIEW_TYPE.PROCESS &&
        formData.status == '3'
      ) {
        showTipsModal({
          header: i18n['task.taks_details.transfer_task_faild_title'],
          content: i18n['task.taks_details.transfer_task_faild'],
          noCancel: true,
          onConfirm: cb => cb()
        });
      }
      const customerId = _.get(res, 'data.customerId', '');
      if (customerId) {
        this.setState({
          customerId
        });
      }
      this.setState({
        formDataReady: true,
        sendRejectEmail
      });
      // 杠杆调整-账户信息
      if (data.jobType === 'JOB_TYPE_TA_LEVERAGE') {
        const accountId = _.get(formData, 'account.accountId');
        const vendor = _.get(formData, 'account.vendor');
        const serverId = _.get(formData, 'account.serverId');
        Promise.all([
          getAccountInfo(accountId, serverId),
          getAccountInfoPosition(accountId, vendor, serverId)
        ]).then(() => {
          this.setState({
            accountInfoReady: true
          });
        });
      }
    });
  };
  vendor = '';
  // 获取开户相关信息
  jobType_OPEN = activeKey => {
    const {
      match: {
        params: { taskId }
      },
      data: taskData,
      getFormData,
      getAccountForm,
      showTipsModal,
      getAccountDropdownData
    } = this.props;
    getFormData(taskId)
      .then(res => {
        const { result, data, mcode } = res;
        if (!result) return Promise.resolve(res);
        //自动审核类的任务,执行失败时,弹出提示框
        if (!taskData.verify && taskData.viewType === VIEW_TYPE.CLAIM) {
          showTipsModal({
            content: (
              <FormattedMessage
                id="task.taks_details.automatic_task_faild"
                defaultMessage={i18n['task.taks_details.automatic_task_faild']}
                values={{
                  name:
                    i18n[
                      `task.object_setting.task_setting.task_group_type.${
                        data.jobType
                      }`
                    ]
                }}
              />
            ),
            noCancel: true,
            onConfirm: cb => cb()
          });
        }
        const { formData } = this.props;
        const { itemId, categoryId, state } = this.props.data;
        const isFinished = taskData.viewType === VIEW_TYPE.FINISH;
        const promises = [
          getAccountForm(data.vendor || 'MT4', formData.customAccountType)
        ];
        this.vendor = data.vendor;
        if (!(isFinished && formData && formData.snapshot)) {
          //完成、关闭状态并且记录snapshot信息的 不需要请求杠杆、用户组、服务器组的列表数据
          promises.push(
            getAccountDropdownData(
              data.vendor || 'MT4',
              data.account && data.account.serverId,
              {
                itemId,
                categoryId,
                taskId,
                isJobParticipantUser: this.isJobParticipantUser()
              }
            )
          );
        }
        return Promise.all(promises);
      })
      .then(() => {
        const { formFields } = this.props;
        this.setState({
          formFieldsArray: [
            ...formFields.t_account_profiles,
            ...formFields.t_account_id_info,
            ...formFields.t_account_finacial,
            ...formFields.t_account_account
          ],
          formDataReady: true,
          activeKey: activeKey
        });
      });
  };

  // 判断当前用户是否有权限处理任务, 抄送人无权限,只能看
  isJobParticipantUser = () => {
    const pubUserId = _.get(this.props, 'userinfo.pubUserId', null);
    const participantInfoSet = _.get(this.props, 'data.participantInfoSet', []);
    const itemType = _.get(this.props, 'objectDetails.itemType', null);
    const userRights = _.get(this.props, 'userRights', {});

    // 判断是否是超级管理员
    const getAdminRight = {
      [TASK_TYPES.AGENCY]: !!userRights['TASK_IB_DEALALL'],
      [TASK_TYPES.TA]: !!userRights['TASK_TRADER_DEALALL']
    };
    if (getAdminRight[itemType]) {
      return true;
    }

    // 普通用户
    return !_.isEmpty(
      _.filter(participantInfoSet, _.matches({ userId: pubUserId }))
    );
  };
  onClose = () => {
    const {
      match: { path, params },
      refreshTasks,
      searchParams,
      history: { push }
    } = this.props;
    const __path = path.replace(':objectId/task/:taskId', params.objectId);
    push(__path);
    if (typeof refreshTasks === 'function') {
      refreshTasks(searchParams);
    }
  };
}
