import { reduxForm, Field, formValueSelector } from 'redux-form';
import FormField from 'components/FormField';
import Form from 'components/Form';
import Tab from 'components/Tab';
import i18n from 'utils/i18n';
import cs from './style.less';
import { connect } from 'react-redux';
export const EXPORT_FORM = 'WITHRRAW_EXPORT_DFTT_FORM';
const selector = formValueSelector(EXPORT_FORM); // <-- same as form name

class ExportDfttForm extends PureComponent {
  state = {
    activeKey: 'zh-CN'
  };
  onChangeTab = key => {
    this.setState({
      activeKey: key
    });
  };
  render() {
    let { brandInfo: { languages = [] } = {}, plat, enabled } = this.props;
    return (
      <Form>
        <Form.Item>
          <Form.Label />
          <Form.Control>
            <Field
              name="enabled"
              fieldType="checkbox"
              component={FormField}
              label={i18n['platform.tab.dftt.checkbox4']}
            />
            <Field
              name="option"
              fieldType="radio"
              component={FormField}
              disabled={!enabled}
              options={[
                {
                  value: 'DEST_NAME_INCORRECT_NOT_ALLOW_TRANS',
                  label: i18n['platform.setting.transfer.allowedTransferToOutside.options.forbidden']
                },
                {
                  value: 'DEST_NAME_INCORRECT_ALLOW_TRANS',
                  label: i18n['platform.setting.transfer.allowedTransferToOutside.options.allow']
                }
              ]}
            />
          </Form.Control>
        </Form.Item>
        <Form.Item>
          <Form.Label>{i18n['platform.tab.dftt.checkbox5']}：</Form.Label>
          <Form.Control>
            {plat === 'CTRADER' && <Field name="agreement" fieldType="editor" component={FormField} />}
            {plat !== 'CTRADER' && (
              <Tab activeKey={this.state.activeKey} onChange={this.onChangeTab}>
                {languages.map((el, index) => {
                  return (
                    <Tab.Panel key={index} title={el.label} eventKey={el.value} className={cs['tab']}>
                      <Field name={`agreement_${el.value}`} fieldType="editor" component={FormField} />
                    </Tab.Panel>
                  );
                })}
              </Tab>
            )}
          </Form.Control>
        </Form.Item>
      </Form>
    );
  }
}
let ExportForm = reduxForm({
  form: EXPORT_FORM,
  enableReinitialize: true
})(ExportDfttForm);

export default connect(state => {
  const enabled = selector(state, 'enabled');
  return {
    enabled
  };
})(ExportForm);
