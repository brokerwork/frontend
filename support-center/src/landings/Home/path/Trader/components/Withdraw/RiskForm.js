import { reduxForm, Field } from 'redux-form';
import FormField from 'components/FormField';
import Form from 'components/Form';
import i18n from 'utils/i18n';
import Button from 'components/Button';
import Tab from 'components/Tab';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import UploadFile from 'components/UploadFile';
import CopyToClipboard from 'components/CopyToClipboard';
import cs from './style.less';

export const RISK_FORM = 'WITHRRAW_RISK_FORM';
class RiskForm extends PureComponent {
  editors = {};
  riskDescEditor = null;
  onChangeTab = key => {
    this.riskDescEditor = this.editors[key];
    this.setState({
      activeKey: key
    });
  };
  state = {
    image: '',
    activeKey: 'zh-CN'
  };
  onRiskChange = () => {
    const { change, submit, enableRiskTip } = this.props;
    change('enableRiskTip', !enableRiskTip);
    setTimeout(() => {
      submit(RISK_FORM);
    }, 500);
  };
  addWithdrawCheckbox = () => {
    const { change } = this.props;
    const msg = i18n['platform.tab.open.account.wdrisk.setting.agreement'];
    const html = `<p><label><input class="sc_interactive_checkbox" type="checkbox" value="" />${msg}</label></p></br>`;
    if (!this.riskDescEditor) {
      this.riskDescEditor = this.editors[this.state.activeKey];
    }
    this.riskDescEditor.instance.insertHtml(html);
    const end = this.riskDescEditor.instance.getData();

    change('riskDesc', end);
  };
  onChange = url => {
    this.setState({
      image: url
    });
  };
  render() {
    const { image } = this.state;
    const { enableRiskTip } = this.props;
    let { brandInfo: { languages = [] } = {}, plat } = this.props;
    return (
      <Form>
        <Form.Item>
          <Form.Label>{i18n['platform.tab.withdraw.risk.setting.panel']}：</Form.Label>
          <Form.Control>
            <Field
              name="enableRiskTip"
              fieldType="radio"
              options={[
                { value: true, label: i18n['common.tips.enable'] },
                { value: false, label: i18n['common.tips.disable'] }
              ]}
              component={FormField}
              onChange={this.onRiskChange}
            />
          </Form.Control>
        </Form.Item>
        {enableRiskTip ? (
          <div>
            <Form.Item>
              <Form.Control>
                <Field
                  name="riskTipMode"
                  fieldType="radio"
                  options={[
                    { value: 'CLICK_POP', label: i18n['platform.tab.open.account.risk.setting.mode.click'] },
                    { value: 'AUTO_POP', label: i18n['platform.tab.open.account.risk.setting.mode.auto'] },
                    { value: 'DEFAULT_SHOW', label: i18n['platform.tab.open.account.risk.setting.mode.default'] }
                  ]}
                  component={FormField}
                />
              </Form.Control>
            </Form.Item>
            <div>
              <Button style="primary" onClick={this.addWithdrawCheckbox}>
                {i18n['platform.tab.open.account.risk.setting.add.checkbox']}
              </Button>
              <UploadFile className="upload" onChange={this.onChange}>
                {i18n['platform.tab.open.account.risk.setting.upload.file']}
              </UploadFile>
              {i18n['upload_file.image_tip']}
              <br />
              {i18n['upload_file.pdf_tip']}
              {image ? (
                <div>
                  <span style={{ color: 'darkgreen', marignRight: '10px' }}>{image}</span>
                  <CopyToClipboard text={image} />
                </div>
              ) : null}
            </div>
            <Form.Item>
              <Form.Control>
                {plat === 'CTRADER' && (
                  <Field
                    name="agreement"
                    fieldType="editor"
                    component={FormField}
                    getInstance={instance => {
                      this.riskDescEditor = instance;
                    }}
                  />
                )}
                {plat !== 'CTRADER' && (
                  <Tab activeKey={this.state.activeKey} onChange={this.onChangeTab}>
                    {languages.map((el, index) => {
                      return (
                        <Tab.Panel key={index} title={el.label} eventKey={el.value} className={cs['tab']}>
                          <Field
                            name={`agreement_${el.value}`}
                            fieldType="editor"
                            component={FormField}
                            getInstance={instance => {
                              this.editors[el.value] = instance;
                            }}
                          />
                        </Tab.Panel>
                      );
                    })}
                  </Tab>
                )}
              </Form.Control>
            </Form.Item>
            <Button style="primary" onClick={this.props.submit}>
              {i18n['app.btn.save']}
            </Button>
            <Button onClick={this.props.reset}>{i18n['app.btn.reset']}</Button>
          </div>
        ) : null}
      </Form>
    );
  }
}

const RiskFormRedux = reduxForm({
  form: RISK_FORM,
  enableReinitialize: true
})(RiskForm);

const selector = formValueSelector(RISK_FORM);
export default connect(
  state => {
    return {
      enableRiskTip: selector(state, 'enableRiskTip')
    };
  },
  {}
)(RiskFormRedux);
