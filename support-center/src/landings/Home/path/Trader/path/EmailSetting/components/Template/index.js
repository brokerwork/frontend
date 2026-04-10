import Table from 'components/Table';
import cs from './Template.less';
import UpdateEmailLanguage from '../../containers/UpdateEmailLanguage';
import UpdateTemplateEmail from '../../containers/UpdateTemplateEmail';
import UpdateTemplate from '../../containers/UpdateTemplate';
import Checkbox from 'components/Checkbox';
import AnimationWrapper from 'components/AnimationWrapper';
import Button from 'components/Button';
import i18n from 'utils/i18n';
import { FormattedMessage } from 'react-intl';
import Tips from 'components/Tips';

export default class Template extends PureComponent {
  state = {
    showLanguageSettingModal: false,
    showBatchEmailSettingModal: false,
    showUpdateTemplateModal: false,
    template: {}
  };

  componentDidMount() {
    const { getTemplateList, getEmailDefaultLanguage } = this.props;

    getTemplateList();
    getEmailDefaultLanguage();
  }

  toggleModal = (type, status) => {
    this.setState({
      [`show${type}Modal`]: status
    });
  };

  preview = template => {
    const newTab = window.open('/src/assets/_blank.html');

    newTab.document.write(template.content);
  };

  onUpdateEmailDefalutLanguage = () => {
    const { getEmailDefaultLanguage } = this.props;

    getEmailDefaultLanguage().then(({ result }) => {
      if (result) {
        this.toggleModal('LanguageSetting', false);
      }
    });
  };

  selectTemplate = (id, evt) => {
    const { selectedTemplate, _storeSelectedTemplate } = this.props;
    const copyData = [].concat(selectedTemplate);
    const checked = evt.target.checked;

    if (checked) {
      copyData.push(id);
    } else {
      const idx = copyData.findIndex(data => data === id);

      copyData.splice(idx, 1);
    }

    _storeSelectedTemplate(copyData);
  };

  selectAll = evt => {
    const { templateList, _storeSelectedTemplate } = this.props;
    const copyData = [].concat(templateList);
    const checked = evt.target.checked;

    if (checked) {
      _storeSelectedTemplate(copyData.map(item => item.templateId));
    } else {
      _storeSelectedTemplate([]);
    }
  };

  cancel = () => {
    const { _storeSelectedTemplate } = this.props;

    _storeSelectedTemplate([]);
  };

  onUpdateTemplateEmail = () => {
    const { getTemplateList } = this.props;

    getTemplateList().then(({ result }) => {
      if (result) {
        this.toggleModal('BatchEmailSetting', false);
      }
    });
  };

  showUpdateTemplateModal = template => {
    this.setState({
      showUpdateTemplateModal: true,
      template
    });
  };

  batchResetEmailTemplates = () => {
    const { batchResetEmailTemplates, selectedTemplate, showTopAlert, getTemplateList } = this.props;
    batchResetEmailTemplates(selectedTemplate).then(({ result }) => {
      if (result) {
        showTopAlert({
          style: 'success',
          content: i18n['general.modify_success']
        });
        getTemplateList();
      } else {
        showTopAlert({
          style: 'danger',
          content: i18n['general.modify_failure']
        });
      }
    });
  };

  render() {
    const { templateList, emailList, emailDefaultLanguage, languages, selectedTemplate, toggleTempViewer } = this.props;
    const defaultLanguage = languages.find(item => item.value === emailDefaultLanguage);
    const { showLanguageSettingModal, showBatchEmailSettingModal, showUpdateTemplateModal, template } = this.state;
    const allSelected = selectedTemplate.length === templateList.length;

    return (
      <div>
        <div className="actions-bar">
          {selectedTemplate.length ? (
            <div>
              <span className="selected-count-text">
                <FormattedMessage
                  id="general.selected_count"
                  defaultMessage={i18n['general.selected_count']}
                  values={{
                    number: <span className="selected-number">{selectedTemplate.length}</span>
                  }}
                />
              </span>
              <Button style="primary" onClick={this.cancel}>
                {i18n['general.cancel']}
              </Button>
              <Button style="primary" onClick={this.toggleModal.bind(this, 'BatchEmailSetting', true)}>
                {i18n['email.setting.smtp.btn.modify']}
              </Button>
              <Button style="primary" onClick={this.batchResetEmailTemplates}>
                {i18n['email.setting.multi_update_to_new_temps']}
              </Button>
            </div>
          ) : (
            undefined
          )}
          <div className="text-right">
            <a onClick={toggleTempViewer} style={{ marginRight: '20px' }}>
              {i18n['email.setting.new_temp_view.view_open_btn']}
            </a>
            <span>
              {i18n['email.setting.template.language']}：{defaultLanguage.label}
            </span>
            <a className={cs['setting-btn']} onClick={this.toggleModal.bind(this, 'LanguageSetting', true)}>
              <i className="fa fa-cog" />
            </a>
          </div>
        </div>
        <Table className={cs.emailTable}>
          <Table.Header>
            <th>
              <Checkbox onChange={this.selectAll} checked={allSelected} />
            </th>
            <th>{i18n['email.setting.template.type']}</th>
            <th>{i18n['email.setting.template.subject']}</th>
            <th>{i18n['email.setting.template.updatetime']}</th>
            <th>{i18n['email.setting.smtp.send.email']}</th>
            <th>{i18n['table.header.operation']}</th>
          </Table.Header>
          <Table.Body>
            {templateList.map((item, idx) => {
              const email = emailList.find(_item => _item.configId === item.configId);
              const selected = selectedTemplate.includes(item.templateId);

              return (
                <tr key={idx}>
                  <td>
                    <Checkbox onChange={this.selectTemplate.bind(this, item.templateId)} checked={selected} />
                  </td>
                  <td>
                    <a onClick={this.showUpdateTemplateModal.bind(this, item)}>{item.name}</a>
                    <Tips className={cs.tips} align="top">
                      {item.desc}
                    </Tips>
                  </td>
                  <td>{item.title}</td>
                  <td>{item.modifyDate}</td>
                  <td>{email ? `${email.from} （${email.fromName}）` : ''}</td>
                  <td>
                    <Button style="primary" onClick={this.preview.bind(this, item)}>
                      {i18n['app.btn.preview']}
                    </Button>
                  </td>
                </tr>
              );
            })}
          </Table.Body>
        </Table>
        {showLanguageSettingModal ? (
          <UpdateEmailLanguage
            onSave={this.onUpdateEmailDefalutLanguage}
            onClose={this.toggleModal.bind(this, 'LanguageSetting', false)}
          />
        ) : (
          undefined
        )}
        {showBatchEmailSettingModal ? (
          <UpdateTemplateEmail
            onSave={this.onUpdateTemplateEmail}
            onClose={this.toggleModal.bind(this, 'BatchEmailSetting', false)}
          />
        ) : (
          undefined
        )}
        <AnimationWrapper>
          {showUpdateTemplateModal ? (
            <UpdateTemplate template={template} onClose={this.toggleModal.bind(this, 'UpdateTemplate', false)} />
          ) : (
            undefined
          )}
        </AnimationWrapper>
      </div>
    );
  }
}
