import { Field, reduxForm } from 'redux-form';
// import Form from 'components/v2/Form';
import { renderField, required } from 'utils/v2/renderField';
import cs from './UpdateNotification.less';
import i18n from 'utils/i18n';
import { Form } from 'lean-ui';

export const UPDATE_NOTIFICATION_FORM = 'UPDATE_NOTIFICATION_FORM';

class UpdateNotificationForm extends PureComponent {
  render() {
    const { roleOptions, type, ruleType, notifyWay } = this.props;
    return (
      <Form>
        <Form.Item col={2}>
          <Form.Label required>
            {i18n['settings.update_nofity.rule_label']}：
          </Form.Label>
          <Form.Control>
            <Field
              name="type"
              component={renderField}
              options={ruleType}
              type="selectField"
              validate={required}
              defaultSelect={false}
              onChange={this.getCopy}
              disabled={type === 'Edit'}
            />
          </Form.Control>
        </Form.Item>
        <Form.Item col={2}>
          <Form.Label required>
            {i18n['settings.update_nofity.available_role']}：
          </Form.Label>
          <Form.Control>
            <Field
              label={i18n['settings.update_nofity.available_role']}
              name="roles"
              component={renderField}
              type="multiSelectField"
              options={roleOptions}
              className={cs['drop-down']}
              validate={[required]}
            />
          </Form.Control>
        </Form.Item>
        <Form.Item>
          <Form.Label required>
            {i18n['settings.update_nofity.notify_way']}：
          </Form.Label>
          <Form.Control className={cs['controlCenter']}>
            <Field
              name="noticeType"
              component={renderField}
              type="checkboxField"
              checkboxList={notifyWay}
              validate={[required]}
            />
          </Form.Control>
        </Form.Item>
      </Form>
    );
  }
}

export default reduxForm({
  form: UPDATE_NOTIFICATION_FORM,
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
  enableReinitialize: true,
  validate: (values = {}) => {
    const errors = {};

    if (values.noticeType && values.noticeType.length === 0) {
      errors.noticeType = i18n['settings.self_notify.data_report.way_tips'];
    }

    return errors;
  }
})(UpdateNotificationForm);
