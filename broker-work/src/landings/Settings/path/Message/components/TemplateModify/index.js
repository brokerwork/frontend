import { Button, Dialog } from 'lean-ui';

import i18n from 'utils/i18n';
import cs from './add.less';
import TemplateForm, { TEMPLATE_FORM } from './TemplateForm';
import {
  MESSAGE_TYPE_SMS,
  AUDIT_STATES_SUCCESS,
  AUDIT_STATES_FAILD
} from '../../../../constant';
import { FormattedMessage } from 'react-intl';

const TEMPLATE_USER_LEVEL = 'USER';
const TEMPLATE_DEFAULT_STATE = 'Draft';

export default class Add extends PureComponent {
  state = {
    readySubmitAudit: false
  };
  onSave = () => {
    const { submitForm } = this.props;
    submitForm(TEMPLATE_FORM);
  };
  onSubmitAudit = () => {
    this.setState(
      {
        readySubmitAudit: true
      },
      () => {
        this.onSave();
      }
    );
  };
  onSubmit = data => {
    let params = {
      id: data.id,
      content: data.content,
      title: data.title,
      name: data.name,
      type: this.props.currentFormInfo.type,
      level: data.level || TEMPLATE_USER_LEVEL
    };
    if (data.type === MESSAGE_TYPE_SMS) {
      params.auditState = data.auditState || TEMPLATE_DEFAULT_STATE;
    }
    return params;
  };
  onSubmitSuccess = data => {
    const { readySubmitAudit } = this.state;
    const {
      createMessageTemplate,
      updateMessageTemplate,
      getTemplates,
      type,
      showTopAlert,
      onHide,
      submitMessageTemplate
    } = this.props;

    const submitAudit = (id, callback) => {
      this.setState({
        readySubmitAudit: false
      });
      submitMessageTemplate(id).then(res => {
        callback(res);
      });
    };

    if (type === 'add') {
      const done = res => {
        onHide();
        if (res.result) {
          showTopAlert({
            bsStyle: 'success',
            content: i18n['general.create_success']
          });
        }
        getTemplates();
      };
      createMessageTemplate(data).then(res => {
        if (readySubmitAudit) {
          submitAudit(res.data, done);
          return;
        }
        done(res);
      });
    } else if (type === 'edit') {
      const done = res => {
        onHide();
        if (res.result) {
          showTopAlert({
            bsStyle: 'success',
            content: i18n['general.modify_success']
          });
        }
        getTemplates();
      };
      updateMessageTemplate(data).then(res => {
        if (readySubmitAudit) {
          submitAudit(res.data, done);
          return;
        }
        done(res);
      });
    }
  };
  render() {
    const {
      messageType,
      onHide,
      show,
      currentTemplate,
      userRights,
      currentFormInfo,
      type,
      title
    } = this.props;
    const isAudited =
      currentTemplate &&
      [AUDIT_STATES_SUCCESS, AUDIT_STATES_FAILD].includes(
        currentTemplate.auditState
      );
    return (
      <Dialog
        {...this.props}
        visible
        onCancel={onHide}
        width={700}
        title={
          <FormattedMessage
            id="settings.role_setting.add_template.format"
            values={{ title }}
            defaultMessage={
              i18n[`settings.role_setting.${type}_template.format`]
            }
          />
        }
        footer={
          <div>
            <Button onClick={onHide}>{i18n['general.cancel']}</Button>
            {!isAudited && (
              <Button type="primary" onClick={this.onSave}>
                {i18n['general.save']}
              </Button>
            )}
            {currentFormInfo &&
              currentFormInfo.type === MESSAGE_TYPE_SMS && (
                <Button type="primary" onClick={this.onSubmitAudit}>
                  {i18n['settings.message_template.save_and_submit']}
                </Button>
              )}
          </div>
        }
      >
        {/* 编辑表单 */}
        <TemplateForm
          userRights={userRights}
          initialValues={currentTemplate}
          onSubmit={this.onSubmit}
          onSubmitSuccess={this.onSubmitSuccess}
          messageType={messageType}
          currentFormInfo={currentFormInfo}
          type={type}
        />
        {/* 温馨提示 */}
        {currentFormInfo &&
          currentFormInfo.type === MESSAGE_TYPE_SMS && (
            <div className={cs['notice']}>
              <div className={cs['notice_label']}>
                {`${i18n['settings.message_template.sms_notice.label']}:`}
              </div>
              <div className={cs['notice_content']}>
                <p>{i18n['settings.message_template.sms_notice.maxlen']}</p>
                <p>{i18n['settings.message_template.sms_notice.audit']}</p>
                <p>{i18n['settings.message_template.sms_notice.time']}</p>
              </div>
            </div>
          )}
      </Dialog>
    );
  }
}
