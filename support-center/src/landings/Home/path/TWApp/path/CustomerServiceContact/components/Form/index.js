import { reduxForm, Field } from 'redux-form';
import FormField from 'components/FormField';
import InputFields from './../InputFileds';
import {
  required,
  isEmail,
  isPhone,
  isMob,
  isQq,
  isLink,
  maxLength
} from 'components/FormField/validate';
import Form from 'components/Form';
import cs from './style.less';
import i18n from 'utils/i18n';

class CustomerServiceContactForm extends PureComponent {
  submitData(vals) {
    const { submitData, showTopAlert } = this.props;
    submitData(vals).then((res) => {
      if (res.result) {
        showTopAlert({
          style: 'success',
          content: i18n['general.save_success']
        });
      }
    });
  }
  render() {
    const { handleSubmit } = this.props;
    return (
      <div className={cs['csc-container']}>
        <Form onSubmit={handleSubmit(this.submitData.bind(this))}>
          <Form.Item>
            <Form.Label className={cs['csc-label']}>
              {i18n['twapp.customer_service_contact.work_time']}:
            </Form.Label>
            <Form.Control>
              <Field
                name="workTime"
                fieldType="text"
                component={FormField}
                maxLength="20"
                placeholder={i18n['twapp.customer_service_contact.work_time.tip']}
                validate={[required, maxLength(20)]}
              />
            </Form.Control>
          </Form.Item>
          <Form.Item>
            <Form.Label className={cs['csc-label']}>QQ：</Form.Label>
            <Field
              className={cs['csc-field']}
              name="qq"
              component={InputFields}
              fildValid={[required, isQq]}
            />
          </Form.Item>
          <Form.Item>
            <Form.Label className={cs['csc-label']}>
              {i18n['twapp.customer_service_contact.email']}:
            </Form.Label>
            <Field
              className={cs['csc-field']}
              name="email"
              component={InputFields}
              fildValid={[required, isEmail]}
            />
          </Form.Item>
          <Form.Item>
            <Form.Label className={cs['csc-label']}>
              {i18n['twapp.customer_service_contact.phone']}:
            </Form.Label>
            <Field
              className={cs['csc-field']}
              name="phone"
              component={InputFields}
              fildValid={[required, isPhone]}
            />
          </Form.Item>
          <Form.Item>
            <Form.Label className={cs['csc-label']}>{i18n['twapp.customer_service_contact.mob']}:</Form.Label>
            <Field
              className={cs['csc-field']}
              name="mob"
              component={InputFields}
              fildValid={[required, isMob]}
            />
          </Form.Item>
          <Form.Item>
            <Form.Label className={cs['csc-label']}>
              {i18n['twapp.customer_service_contact.online_service']}:
            </Form.Label>
            <Form.Control>
              <Field
                name="onlineService"
                fieldType="text"
                component={FormField}
                maxLength="512"
                validate={[isLink, maxLength(512)]}
                placeholder={i18n['twapp.customer_service_contact.online_service.tip']}
              />
            </Form.Control>
          </Form.Item>
          <Form.Item>
            <Form.Label />
            <button type="submit" className="btn btn-primary">
              {i18n['general.submit']}
            </button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default reduxForm({
  form: 'CustomerServiceContactForm'
})(CustomerServiceContactForm);
