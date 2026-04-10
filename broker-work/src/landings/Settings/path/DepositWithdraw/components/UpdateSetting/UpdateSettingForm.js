import { Field, reduxForm } from 'redux-form';
import i18n from 'utils/i18n';
import { renderField } from 'utils/v2/renderField';
import { Form } from 'lean-ui';
import cs from './UpdateSetting.less';
import { FormattedMessage } from 'react-intl';

export const UPDATE_SETTING_FORM = 'UPDATE_SETTING_FORM';

class UpdateSettingForm extends PureComponent {
  render() {
    const { data } = this.props;

    return (
      <Form className={cs.form}>
        {data.map((item, idx) => {
          return (
            <Form.Item key={idx} className={cs['info']}>
              <Form.Label className={cs['info-header']}>
                <FormattedMessage
                  id="settings.deposit_withdraw.setting.type_title"
                  defaultMessage={
                    i18n['settings.deposit_withdraw.setting.type_title']
                  }
                  values={{ type: item.label }}
                />
              </Form.Label>
              <Form.Control>
                <Field
                  colClassName={cs['info-content']}
                  name={item.value}
                  type="checkboxField"
                  component={renderField}
                  checkboxList={item.options}
                />
              </Form.Control>
            </Form.Item>
          );
        })}
      </Form>
    );
  }
}

export default reduxForm({
  form: UPDATE_SETTING_FORM,
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
  enableReinitialize: true
})(UpdateSettingForm);
