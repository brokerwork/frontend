import Form from 'components/Form';
import { Field } from 'redux-form';
import { default as FormField } from 'components/FormField';
import Button from 'components/Button';
import Tab from 'components/Tab';
import i18n from 'utils/i18n';
import { RiskDisclosureOption } from '../../constant';
import UploadFile from 'components/UploadFile';
import CopyToClipboard from 'components/CopyToClipboard';
import cs from './index.less';
export default class RiskDisclosure extends PureComponent {
  state = {
    image: '',
    activeKey: 'zh-CN'
  };
  componentWillReceiveProps(nextProps) {
    if (nextProps.activeKey !== this.props.activeKey) {
      this.setState({
        activeKey: 'zh-CN'
      });
    }
  }
  onChangeTab = key => {
    this.riskDescEditor = this.editors[key];
    this.setState({
      activeKey: key
    });
  };
  editors = {};
  riskDescEditor = null;
  addWithdrawCheckbox = () => {
    const { change } = this.props;
    const msg = i18n['platform.tab.open.account.risk.setting.agreement'];
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
    let { brandInfo: { languages = [] } = {}, plat } = this.props;
    return (
      <div style={{ marginTop: '10px' }}>
        <Form>
          <Form.Item>
            <Form.Control>
              <Field name="riskTipMode" fieldType="radio" options={RiskDisclosureOption} component={FormField} />
            </Form.Control>
          </Form.Item>
          <div>
            <Button style="primary" onClick={this.addWithdrawCheckbox}>
              {i18n['platform.tab.open.account.risk.setting.add.checkbox']}
            </Button>
            <div style={{ margin: '15px 0' }}>
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
                  {languages.map(el => {
                    return (
                      <Tab.Panel key={el.value} title={el.label} eventKey={el.value} className={cs['tab']}>
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
        </Form>
      </div>
    );
  }
}
