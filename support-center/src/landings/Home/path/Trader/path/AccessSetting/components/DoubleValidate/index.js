import { Field } from 'redux-form';
import Form from 'components/Form';
import cs from './index.less';
import i18n from 'utils/i18n';
import FormField from 'components/FormField';
import _ from 'lodash';
import { required } from 'components/FormField/validate';

const DOUBLE_VALIDATE_OPTIONS = [
  { label: i18n['general.start'], value: true },
  { label: i18n['general.disable'], value: false }
];
const defaultTypes = ['SMS', 'GoogleAuthenticator'];
const configCheckList = defaultOptions => {
  return (
    defaultOptions &&
    defaultOptions.length &&
    defaultOptions.map(item => ({
      value: item,
      label: i18n[`broker.access_setting.double_validate.${item}`]
    }))
  );
};
export const defaultOperation = [
  'LOGIN',
  'CHANGE_PASSWORD',
  'CHANGE_EMAIL',
  'CHANGE_PHONE',
  'ACCOUNT_CHANGE_INFO',
  'ACCOUNT_TRANSFER',
  'ACCOUNT_WITHDRAWAL',
  'ACCOUNT_CHANGE_PASSWORD'
];
const validateTypes = value => {
  if (_.isEmpty(value)) {
    return i18n['broker.access_setting.double_validate.methods.errormsg'];
  } else {
    return undefined;
  }
};
const validateOperations = value => {
  if (_.isEmpty(value)) {
    return i18n['broker.access_setting.double_validate.operate.errormsg'];
  } else {
    return undefined;
  }
};
export default class DoubleValidate extends Component {
  render() {
    const { twoFAConfig } = this.props;
    return (
      <div className={cs.container}>
        <div className={cs.double_validate_radio}>
          <Field name="enable" fieldType="radio" options={DOUBLE_VALIDATE_OPTIONS} component={FormField} />
        </div>
        {/* <div className={cs.container_form} style={{ display: twoFAConfig.enable ? 'block' : 'none' }}> */}
        {twoFAConfig && twoFAConfig.enable && (
          <div className={cs.container_form}>
            <span className={cs.triangle} />
            <div>
              <div>
                <label>{i18n['broker.access_setting.double_validate.methods']}：</label>
                <div>
                  <div className={cs.display_flex}>
                    <Field
                      name="types"
                      fieldType="newCheckboxList"
                      component={FormField}
                      options={configCheckList(defaultTypes)}
                      validate={validateTypes}
                    />
                  </div>
                  <p className={cs.tips}>{i18n['broker.access_setting.double_validate.methods.tips']}</p>
                </div>
              </div>
              <div>
                <label>{i18n['broker.access_setting.double_validate.operate']}：</label>
                <div>
                  <div className={cs.display_flex}>
                    <Field
                      name="operation"
                      fieldType="newCheckboxList"
                      component={FormField}
                      options={configCheckList(defaultOperation)}
                      validate={validateOperations}
                    />
                  </div>
                </div>
              </div>
              <div>
                <label>{i18n['broker.access_setting.double_validate.default_status']}：</label>
                <div>
                  <div className={cs.display_flex}>
                    <Field
                      name="mandatoryVerification"
                      fieldType="checkbox"
                      component={FormField}
                      label={i18n['broker.access_setting.double_validate.default_status.force_validate']}
                    />
                  </div>
                  <p className={cs.tips}>{i18n['broker.access_setting.double_validate.default_status.tips']}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
