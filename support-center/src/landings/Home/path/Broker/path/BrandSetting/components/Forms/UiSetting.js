import { Field } from 'redux-form';
import FormField from 'components/FormField';
import { required, isEmail } from 'components/FormField/validate';
import Form from 'components/Form';
import Button from 'components/Button';
import SendObjects from 'components/SendObjects';
import i18n from 'utils/i18n';
import cs from './Forms.less';

const UI_VERSION_SWITCHES = [
  { label: i18n['brand.setting.old_ui_name'], value: 'RELEASE' },
  { label: i18n['brand.setting.new_ui_name'], value: 'BETA' }
];
export class UiSetting extends PureComponent {
  state = {
    experUserSelectVisible: true,
    propsInited: false
  };
  componentWillReceiveProps({ initialValues: { uiVersion } }) {
    if (this.state.propsInited) return;
    if (typeof uiVersion !== 'string') return;
    this.setState({
      propsInited: true
    });
    this.showExperienceUserSelector(uiVersion);
  }

  uiVersionRadioChange = (e, value) => {
    this.showExperienceUserSelector(value);
  };

  showExperienceUserSelector = ver => {
    if (ver === undefined) return;
    let flag = false;
    if (ver === 'RELEASE') flag = true;
    this.setState({
      experUserSelectVisible: flag
    });
  };

  render() {
    const {
      getReceiverList,
      onUiUserChange,
      initialValues
    } = this.props;
    const { experUserSelectVisible } = this.state;
    return (
      <div className={cs['formSection']}>
        <div className={cs['formSectionTile']}>{i18n['brand.setting.ui_version_setting_label']}</div>
        <div className={cs['formSectionBody']}>
          <Form.Item>
            <Form.Label />
            <Form.Control staticControl>
              <Field
                name="uiVersion"
                fieldType="radio"
                component={FormField}
                onChange={this.uiVersionRadioChange}
                options={UI_VERSION_SWITCHES}
              />
            </Form.Control>
          </Form.Item>
          <div style={experUserSelectVisible ? {} : { display: 'none' }}>
            <Form.Item>
              <Form.Label>
                {i18n['brand.setting.new_ui_exper_account']}：
              </Form.Label>
              <Form.Control>
                <SendObjects
                  data={initialValues.experienceUsers}
                  onChange={onUiUserChange}
                  getReceiverList={getReceiverList}
                />
              </Form.Control>
              <Form.HelpText>
                {i18n['brand.setting.new_ui_switch_tip']}
              </Form.HelpText>
            </Form.Item>
          </div>
        </div>
      </div>
    );
  }
}
