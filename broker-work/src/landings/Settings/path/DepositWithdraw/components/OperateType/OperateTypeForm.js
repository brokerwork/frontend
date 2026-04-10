import { Field, reduxForm } from 'redux-form';
import i18n from 'utils/i18n';
import { renderField, required, isEmpty } from 'utils/v2/renderField';
import cs from './OperateType.less';
import { FormattedMessage } from 'react-intl';
import { Form } from 'lean-ui';

export const OPERATE_TYPE_FORM = 'OPERATE_TYPE_FORM';

class OperateTypeForm extends PureComponent {
  render() {
    return (
      <Form>
        <Form.Item col={1}>
          <Form.Label required className={cs['label']}>
            {i18n['settings.deposit_withdraw.type']}：
          </Form.Label>
          <Form.Control>
            <Field
              label={i18n['settings.deposit_withdraw.type']}
              name="typeName"
              component={renderField}
              type="textField"
              validate={[required, isEmpty]}
            />
          </Form.Control>
        </Form.Item>
        <Form.Item col={1}>
          <Form.Label required className={cs['label']}>
            {i18n['settings.deposit_withdraw.regular']}：
          </Form.Label>
          <Form.Control className={cs['regular-group']}>
            <FormattedMessage
              id="settings.deposit_withdraw.regular_group"
              defaultMessage={i18n['settings.deposit_withdraw.regular_group']}
              values={{
                regular: (
                  <Field
                    label={i18n['settings.deposit_withdraw.regular']}
                    name="regular"
                    className={cs['regularInput']}
                    component={renderField}
                    type="textField"
                    validate={[required, isEmpty]}
                  />
                )
              }}
            />
          </Form.Control>
        </Form.Item>
      </Form>
    );
  }
}

export default reduxForm({
  form: OPERATE_TYPE_FORM,
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
})(OperateTypeForm);
