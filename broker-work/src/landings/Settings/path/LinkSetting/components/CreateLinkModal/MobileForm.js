import { reduxForm, Field } from 'redux-form';
import { Form } from 'lean-ui'
import { renderField, required } from 'utils/v2/renderField';
import { FormattedMessage } from 'react-intl';
import i18n from 'utils/i18n';
import cs from './CreateLinkModal.less';

const FormItem = Form.Item
const FormLabel = Form.Label
export const MOBILE_FORM = 'LINK_SETTING_MOBILE_FORM';

const osOptions = [
  { label: 'Android', value: 'Android' },
  { label: 'iOS', value: 'iOS' }
];

class MobileForm extends PureComponent {
  render() {
    const { initialValues } = this.props;

    return (
      <Form>
        <FormItem col={1} required>
          <FormLabel>
            {i18n['settings.link_setting.link_name_label']}
          </FormLabel>
          <Field
            name="name"
            columns={6}
            component={renderField}
            type="textField"
            label={i18n['settings.link_setting.link_name']}
            tipsContent={i18n['settings.link_setting.link_name_mobile_tips']} />
        </FormItem>
        <FormItem col={1} required>
          <FormLabel>
            {i18n['settings.link_setting.os_label']}
          </FormLabel>
          <Field
            name="os"
            columns={6}
            className={cs['dropdown']}
            defaultSelect={false}
            component={renderField}
            type="selectField"
            options={osOptions}
            label={i18n['settings.link_setting.os']}
          />
        </FormItem>
        <FormItem col={1}>
          <FormLabel>
            {i18n['settings.link_setting.software_package_label']}
          </FormLabel>
          <Field
            name="softwarePackage"
            columns={6}
            component={renderField}
            type="textField"
            label={i18n['settings.link_setting.software_package']}
            tipsContent={
              <FormattedMessage
                id="settings.link_setting.software_package_tips"
                defaultMessage={
                  i18n['settings.link_setting.software_package_tips']
                }
                values={{
                  name:
                    initialValues.os === 'Android' ? 'Package Name' : 'BundleID'
                }}
              />
            }
          />
        </FormItem>
      </Form>
    );
  }
}

export default reduxForm({
  form: MOBILE_FORM,
  onSubmitFail: errors => {
    setTimeout(() => {
      let errorDom = document
        .querySelectorAll('[class*=error]')[0]
        .querySelector('input');
      errorDom
        ? errorDom.focus()
        : document.querySelectorAll('[class*=error]')[0].focus();
    }, 0);
  },
  validate: (values = {}) => {
    const errors = {};

    if (required(values.name)) {
      errors.name = required(values.name);
    }

    if (required(values.os)) {
      errors.os = required(values.os);
    }
    return errors;
  }
})(MobileForm);
