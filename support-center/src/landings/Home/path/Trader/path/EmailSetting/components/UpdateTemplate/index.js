import CardPanel from 'components/CardPanel';
import Nav from 'components/Nav';
import TemplateForm, { TEMPLATE_FORM } from '../Forms/Template';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Button from 'components/Button';
import i18n from 'utils/i18n';
import cs from './UpdateTemplate.less';
import { templateRecoveryFields } from '../../controls/reducers';

export default class UpdateTemplate extends PureComponent {
  state = {
    activeKey: '',
    selectedTemplate: {}
  };

  componentDidMount() {
    const { template, getTemplateDetail, languages } = this.props;
    this.setState({
      activeKey: languages[0].value,
      selectedTemplate: template
    });
    getTemplateDetail(template.templateType);
  }

  onChange = activeKey => {
    const { templateDetail } = this.props;
    this.setState({
      activeKey,
      selectedTemplate: templateDetail[activeKey]
    });
  };

  onSave = () => {
    const { submitForm } = this.props;

    submitForm(TEMPLATE_FORM);
  };

  onSubmit = values => {
    const { updateTemplate, showTopAlert, getTemplateDetail, getTemplateList } = this.props;

    updateTemplate(values).then(({ result }) => {
      if (result) {
        showTopAlert({
          style: 'success',
          content: i18n['email.setting.tips13']
        });
        getTemplateDetail(values.templateType);
        getTemplateList();
      }
    });
  };

  reset = () => {
    const { changeFormField, getEmailDefaultTemplate } = this.props;
    const { activeKey, selectedTemplate } = this.state;

    getEmailDefaultTemplate(selectedTemplate.templateType, activeKey).then(({ result, data }) => {
      if (result) {
        let recovery = {};
        templateRecoveryFields.map(field => {
          recovery[field] = data[field];
          changeFormField(TEMPLATE_FORM, field, data[field]);
        });
        this.setState({
          selectedTemplate: {
            ...selectedTemplate,
            ...recovery
          }
        });
      }
    });
  };
  // 格式化字段字符串，仅新版的设置格式【支持中英符合不明感】
  // NEW：'产品名:${productName};激活地址:${url};公司名:${companyName};'
  formatParams(paramString) {
    if (!paramString) return [];
    // 重新格式化字符串；
    let _paramString = paramString
      .replace(/\ *：\ */g, ':')
      .replace(/\ *:\ */g, ':')
      .replace(/\ *;\ */g, ';')
      .replace(/\ *；\ */g, ';');
    let paramGroup = [];
    // 去掉为空的项；
    let pgroup = _paramString.split(';').filter(group => !!group);
    pgroup.map(group => {
      let [label, value] = group.split(':');
      paramGroup.push({
        label,
        value
      });
    });
    return paramGroup || [];
  }

  onCopy = () => {
    const { showTopAlert } = this.props;

    showTopAlert({
      style: 'success',
      content: i18n['general.clip_success']
    });
  };

  render() {
    const { activeKey, selectedTemplate } = this.state;
    const { onClose, templateEmailList, languages } = this.props;
    return (
      <CardPanel onClose={onClose}>
        <CardPanel.Header>{i18n['email.setting.template.modify']}</CardPanel.Header>
        <CardPanel.Body>
          <Nav activeKey={activeKey} onChange={this.onChange}>
            {languages.map((lang, idx) => {
              return (
                <Nav.Item key={idx} eventKey={lang.value}>
                  {lang.label}
                </Nav.Item>
              );
            })}
          </Nav>
          <div className={cs['form-wrapper']}>
            <TemplateForm
              emailList={templateEmailList}
              onSubmit={this.onSubmit}
              initialValues={selectedTemplate}
              viewNewTemp={this.reset}
            />
          </div>
          <div className={cs['tips']}>
            {i18n['email.setting.template.param.tips']}：
            <div className={cs['params']}>
              {this.formatParams((selectedTemplate || {}).params).map((param, idx) => {
                return (
                  <CopyToClipboard onCopy={this.onCopy} key={idx} text={param.value}>
                    <label className={cs['param-lable']}>
                      {param.label}
                      <span>{param.value}</span>
                    </label>
                  </CopyToClipboard>
                );
              })}
            </div>
          </div>
        </CardPanel.Body>
        <CardPanel.Footer>
          <Button style="primary" onClick={this.onSave}>
            {i18n['app.btn.save']}
          </Button>
          <Button style="primary" onClick={this.reset}>
            {i18n['app.btn.reset']}
          </Button>
          <Button onClick={onClose}>{i18n['app.btn.cancel']}</Button>
        </CardPanel.Footer>
      </CardPanel>
    );
  }
}
