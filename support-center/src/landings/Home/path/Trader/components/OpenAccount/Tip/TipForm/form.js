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
  render() {
    const { image } = this.state;
    let { brandInfo: { languages = [] } = {}, plat } = this.props;
    return (
      <div>
        <Form>
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
                      <Tab.Panel title={el.label} eventKey={el.value} className={cs['tab']}>
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
