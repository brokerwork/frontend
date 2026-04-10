import Editor from 'components/Editor';
import CKEditor from 'components/CKEditor';
import DropdownForCode from 'components/v2/DropdownForCode';
import cs from './AddForm.less';
import i18n from 'utils/i18n';
import { Button, Input, Tooltip, Icon } from 'lean-ui';
import SendObjects from '../SendObject';
import TimingSendModal from '../TimingSendModal';
import queryString from 'utils/queryString';
import {
  getMessageObjects,
  clearMessageObjects
} from 'utils/sendMessageObject';
import { MESSAGE_TYPES_MAP } from '../../../../constant';

const LAST_SENDER_KEY = 'LAST_SENDER_KEY';
const checkBalanceTypes = ['MAIL', 'SMS'];

export default class AddForm extends PureComponent {
  state = {
    showTimingSendModal: false
  };
  modifyMessageParams(field, v) {
    const { messageParams, modifyParams, warningCheck } = this.props;
    const value = v.target ? v.target.value : v;
    const params = {
      ...messageParams,
      [field]: value
    };
    if (['configId', 'toAll'].includes(field)) {
      warningCheck(params);
    }
    modifyParams(params);
  }
  componentWillUnmount() {
    // 清空表单
    const { loginUserName, messageParams } = this.props;
    this.props.resetForm(messageParams.fromName || loginUserName);
  }
  componentDidMount() {
    const {
      location: { search },
      getMessageDetails,
      setPageTitle,
      modifyParams,
      messageParams
    } = this.props;

    const defaultMessage = getMessageObjects();
    const query = queryString(search);
    setPageTitle(i18n['message.add']);
    let type = query.get('type');
    if (query.get('draftId')) {
      getMessageDetails(query.get('draftId')).then(res => {
        if (!res.result) return Promise.resolve(res);
        this.initialFormState();
      });
      return;
    }

    if (defaultMessage) {
      modifyParams({
        ...messageParams,
        ...defaultMessage
      });
      clearMessageObjects();
    }
    setTimeout(this.initialFormState.bind(this, type), 700); //尽量保证在获取权限后调用，因为它会修改type（详情见reducers）
  }

  initialFormState = type => {
    const {
      messageParams,
      getTemplates,
      modifyParams,
      userRights,
      getAvaliableEmails,
      loginUserName,
      modifySendObjectOptions
    } = this.props;
    let { fromName } = messageParams;
    if (type) {
      messageParams.type = type;
    }
    getTemplates(messageParams.type);
    modifySendObjectOptions(messageParams.type, userRights);
    getAvaliableEmails();
    // 默认发件人名称为上次发送消息的人名
    const lastSender = localStorage.getItem(LAST_SENDER_KEY);
    if (lastSender) {
      fromName = lastSender;
    } else if (!fromName) {
      fromName = loginUserName;
    }
    modifyParams({
      ...messageParams,
      fromName
    });
    this.__TemplateDefaultSelect__['name'] = loginUserName;
  };

  onTemplateChange = (id, item) => {
    const {
      modifyTemplate,
      loginUserName,
      messageParams: { type },
      templates
    } = this.props;

    const template = templates.find(t => t.value === item.value);

    const obj = {
      ...template,
      name: item.name || loginUserName
    };
    if (type === 'SMS') {
      obj['configId'] = item.configId;
    }

    modifyTemplate(obj);
  };
  __TemplateDefaultSelect__ = {
    label: i18n['general.default_select'],
    value: 0,
    id: 0,
    title: '',
    content: '',
    name: ''
  };

  onSendObjectChange = v => {
    const { modifyParams, messageParams } = this.props;
    modifyParams({
      ...messageParams,
      ...v
    });
  };

  onMessageTypeChange = v => {
    const {
      getTemplates,
      modifyMessageType,
      loginUserName,
      userRights
    } = this.props;
    // 获取当前消息类型的模板列表
    getTemplates(v);
    modifyMessageType(
      {
        type: v,
        fromName: loginUserName,
        templateId: 0
      },
      userRights
    );
  };
  onSave = async (type, v) => {
    const {
      saveMsg,
      messageParams,
      showTopAlert,
      resetForm,
      loginUserName,
      location: { search },
      checkBalance,
      avaliableEmails
    } = this.props;
    if (type === 'TimingSend') {
      messageParams['clockTime'] = v;
      if (this.messageValidate(messageParams)) return;
      // console.log(avaliableEmails.some(item => item.configId === messageParams.configId), 'debug');
      // checkBalance 会在选择短信，或者选择邮箱，并且发件箱为有增值服务的邮箱的审核 执行检查

      if (
        messageParams.type === 'SMS' ||
        (messageParams.type === 'MAIL' &&
          avaliableEmails.some(
            item =>
              item.value === messageParams.configId &&
              item.level === 'TENANT_PAY'
          ))
      ) {
        const { result, data } = await checkBalance(messageParams.type);
        if (result && data) {
          showTopAlert({
            content: i18n['message.balance_error'],
            bsStyle: 'error'
          });
          return;
        }
      }
    }
    const query = queryString(search);
    if (query.get('draftId')) {
      messageParams.messageId = query.get('draftId');
    }
    saveMsg(messageParams).then(res => {
      if (!res.result) return Promise.resolve(res);
      showTopAlert({
        content: i18n['message.save_success'],
        bsStyle: 'success'
      });
      if (type === 'TimingSend') {
        this.onTimingModalToggle(false);
        resetForm(messageParams.fromName);
        localStorage.setItem(LAST_SENDER_KEY, messageParams.fromName);
      }
    });
  };
  messageValidate = messageParams => {
    const { showTopAlert, checkResponse } = this.props;
    // 必填字段验证
    const validate = [
      { field: 'type', errorMsg: i18n['message.errors.type.require'] },
      { field: 'title', errorMsg: i18n['message.errors.title.require'] },
      { field: 'fromName', errorMsg: i18n['message.errors.fromName.require'] },
      { field: 'content', errorMsg: i18n['message.errors.content.require'] }
    ];
    const errorMsgs = [];
    if (messageParams.type === 'MAIL') {
      validate.push({
        field: 'configId',
        errorMsg: i18n['message.errors.configId.require']
      });
    }
    // 已发邮件不能超过100封
    if (checkResponse.todayNum > 250) {
      errorMsgs.push(i18n['message.errors.mail_warning']);
    }
    // 普通必填字段
    validate.forEach(item => {
      if (!messageParams[item.field]) {
        errorMsgs.push(item.errorMsg);
      }
    });

    // 标题长度验证
    if (messageParams.title && messageParams.title.length > 100) {
      errorMsgs.push(i18n['message.errors.title.size']);
    }

    // 发件人名称长度验证
    if (messageParams.fromName && messageParams.fromName.length > 40) {
      errorMsgs.push(i18n['message.errors.fromName.size']);
    }

    // 发件人列表
    const { toAll, toUserId, toRoleId } = messageParams;
    if (!toAll && !toUserId.length && !toRoleId.length) {
      errorMsgs.push(i18n['message.errors.sender.require']);
    }
    if (errorMsgs.length > 0) {
      showTopAlert({
        content: (
          <ul>
            {errorMsgs.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        )
      });
      return true;
    }
    return false;
  };
  onSend = async () => {
    const {
      sendMsg,
      messageParams,
      showTopAlert,
      resetForm,
      loginUserName,
      history: { push },
      checkBalance,
      avaliableEmails
    } = this.props;
    if (this.messageValidate(messageParams)) return;
    if (
      messageParams.type === 'SMS' ||
      (messageParams.type === 'MAIL' &&
        avaliableEmails.some(
          item =>
            item.value === messageParams.configId && item.level === 'TENANT_PAY'
        ))
    ) {
      const { result, data } = await checkBalance(messageParams.type);
      if (result && data) {
        showTopAlert({
          content: i18n['message.balance_error'],
          bsStyle: 'error'
        });
        return;
      }
    }
    sendMsg(messageParams).then(res => {
      if (!res.result) return Promise.resolve(res);
      showTopAlert({
        content: i18n['message.send_success'],
        bsStyle: 'success'
      });
      resetForm(messageParams.fromName);
      localStorage.setItem(LAST_SENDER_KEY, messageParams.fromName);
      push(`/msgmgmt/sendSuccess/${res.data}`);
    });
  };
  onTimingModalToggle = v => {
    this.setState({
      showTimingSendModal: v
    });
  };
  onBack = () => {
    this.props.history.goBack();
  };
  // 通过权限确定'去选择收件人群'按钮跳转的页面
  getSendGroupByRight = () => {
    if (this.__getSendGroupUrl__) {
      window.open(this.__getSendGroupUrl__, '__blank');
    }

    const { userRights: r, showTopAlert } = this.props;
    let url;
    if (r.CUSTOMER_SELECT) {
      url = '/custommgmt/customers';
    } else if (r.BW_USER) {
      url = '/usermgmt';
    } else if (r.TAUSER_ENABLE) {
      url = '/bwtauser';
    }
    if (url) {
      this.__getSendGroupUrl__ = url;
    } else {
      showTopAlert({
        content: i18n['message.errors.sender.no_permission']
      });
      return;
    }
    window.open(this.__getSendGroupUrl__, '__blank');
  };
  toMessageSettingPage = () => {
    const {
      userRights,
      history: { push },
      showTopAlert
    } = this.props;
    if (userRights['SYSTEM_MESSAGE']) {
      push('/settings/message/template');
    } else {
      showTopAlert({
        content: i18n['message.errors.sender.no_permission']
      });
    }
  };
  render() {
    const {
      templates,
      avaliableEmails,
      messageParams,
      sendObjectOptions,
      typesOptions,
      userRights,
      warningCheck,
      checkResponse
    } = this.props;
    const {
      type,
      content = '',
      title,
      configId,
      fromName,
      templateId,
      clockTime,
      toUserType
    } = messageParams;
    console.log('content', content);
    const { showTimingSendModal } = this.state;
    const right = MESSAGE_TYPES_MAP[type] && MESSAGE_TYPES_MAP[type]['right'];
    return (
      <div style={{ overflow: 'auto' }}>
        <div className={cs['tools']}>
          {userRights[right]
            ? [
                <Button
                  key={0}
                  type="primary"
                  onClick={this.onSend}
                  className={cs['tool-item']}
                >
                  {i18n['message.send']}
                </Button>,
                <Button
                  key={1}
                  onClick={this.onTimingModalToggle.bind(this, true)}
                  className={cs['tool-item']}
                >
                  {i18n['message.timing_send']}
                </Button>,
                <Button
                  key={2}
                  type="primary"
                  onClick={this.onSave}
                  className={cs['tool-item']}
                >
                  {i18n['general.save']}
                </Button>
              ]
            : undefined}
          <Button onClick={this.onBack} className={cs['tool-item']}>
            {i18n['message.back']}
          </Button>
        </div>
        {checkResponse.hint ? (
          <div className={cs['warning-text']}>
            {i18n['message.warning_tips']}
          </div>
        ) : (
          undefined
        )}
        <div className={cs['form']}>
          <div className={cs['form-item']}>
            <div className={cs['form-label']}>{`${
              i18n['message.send_message_type']
            }:`}</div>
            <div className={cs['form-control']}>
              <DropdownForCode
                data={typesOptions}
                value={type}
                onChange={this.onMessageTypeChange}
              />
            </div>
          </div>
          {type === 'MAIL' ? (
            <div className={`${cs['form-item']}`}>
              <div className={cs['form-label']}>{`${
                i18n['message.select_outbox']
              }:`}</div>
              <div className={cs['form-control']}>
                <DropdownForCode
                  defaultSelect
                  autoWidth
                  data={avaliableEmails}
                  value={configId}
                  onChange={this.modifyMessageParams.bind(this, 'configId')}
                />
                <span className={cs['email-tips']}>{`(${
                  i18n['message.email.tips']
                })`}</span>
              </div>
            </div>
          ) : (
            undefined
          )}
          <div className={cs['form-item']}>
            <div className={cs['form-label']}>{`${
              i18n['message.send_group']
            }:`}</div>
            <div className={`${cs['form-control']} ${cs['send-object']}`}>
              <SendObjects
                onChange={this.onSendObjectChange}
                data={messageParams}
                warningCheck={warningCheck}
                options={sendObjectOptions}
              />
              {/* <div className={cs['contorl-right']}>
                <Button bsStyle="primary" onClick={this.getSendGroupByRight}>
                  {i18n['message.errors.sender.select_group']}
                </Button>
              </div>
              <Tips className={cs['tipsBox']} align="left">
                <div className={cs['tipsContent']}>
                  {i18n['message.errors.sender.select_group.tips']}
                </div>
              </Tips> */}
            </div>
          </div>
          <div className={cs['form-item']}>
            <div className={cs['form-label']}>{`${
              i18n['message.select_templete']
            }:`}</div>
            <div className={`${cs['form-control-auto']} ${cs['send-object']}`}>
              <DropdownForCode
                data={templates}
                value={templateId}
                onChange={this.onTemplateChange}
                defaultSelect={this.__TemplateDefaultSelect__}
                autoWidth
              />
              <div className={cs['contorl-right']}>
                <Button type="primary" onClick={this.toMessageSettingPage}>
                  {i18n['message.errors.sender.new_template']}
                </Button>
              </div>
              <Tooltip
                autoAdjustOverflow={false}
                placement="right"
                trigger="click"
                title={
                  <div>{i18n['message.errors.sender.new_template.tips']}</div>
                }
              >
                <span className={cs['tipsBox']}>
                  <Icon icon="question" />
                </span>
              </Tooltip>
            </div>
          </div>
          <div className={cs['form-item']}>
            <div className={cs['form-label']}>{`${
              i18n['message.sender_name']
            }:`}</div>
            <div className={`${cs['form-control']} ${cs['send-object']}`}>
              <Input
                type="text"
                onChange={this.modifyMessageParams.bind(this, 'fromName')}
                value={fromName}
                className={'form-control'}
              />
              <div className={cs['chart-length']}>{`${
                fromName ? fromName.length : 0
              }/40`}</div>
            </div>
          </div>
          <div className={cs['form-item']}>
            <div className={cs['form-label']}>{`${
              i18n['message.subject']
            }:`}</div>
            <div className={`${cs['form-control']} ${cs['send-object']}`}>
              <Input
                type="text"
                className="form-control"
                value={title}
                disabled={type === 'SMS'}
                onChange={this.modifyMessageParams.bind(this, 'title')}
              />
              <div className={cs['chart-length']}>{`${
                title ? title.length : 0
              }/100`}</div>
            </div>
          </div>
          <div className={cs['form-item']}>
            <div className={cs['form-label']}>{`${
              i18n['message.content']
            }:`}</div>
            <div className={cs['form-control']}>
              {type === 'WEB_ALERT' || type === 'SMS' ? (
                <textarea
                  value={typeof content === 'object' ? '' : content}
                  disabled={type === 'SMS'}
                  onChange={this.modifyMessageParams.bind(this, 'content')}
                  className={`form-control ${cs['content-textarea']}`}
                />
              ) : (
                <CKEditor
                  value={content}
                  onChange={this.modifyMessageParams.bind(this, 'content')}
                />
              )}
            </div>
          </div>
        </div>
        {showTimingSendModal ? (
          <TimingSendModal
            defaultValue={clockTime}
            onSubmit={this.onSave.bind(this, 'TimingSend')}
            onHide={this.onTimingModalToggle.bind(this, false)}
          />
        ) : (
          undefined
        )}
      </div>
    );
  }
}
