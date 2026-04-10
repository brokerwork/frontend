import { reduxForm, Field } from 'redux-form';
import { Form, Col } from 'lean-ui';
import { renderField } from 'utils/v2/renderField';
import i18n from 'utils/i18n';

import cs from './index.less';

export const LOSE_FORM = 'CUSTOMER_OPPORTUNITY_LOSE_FORM';

class LoseForm extends PureComponent {
  render() {
    const { loseCauseList } = this.props;

    return (
      <Form>
        <Form.Item>
          <Form.Label className={cs['label']}>
            {i18n['customer.sales_opportunity.detail.lose_cause_label']}
          </Form.Label>
          <Form.Control>
            <Field
              name="loseCause"
              component={renderField}
              className={cs['dropdown']}
              columns={6}
              type="selectField"
              options={loseCauseList}
              label={i18n['customer.sales_opportunity.detail.lose_cause']}
            />
          </Form.Control>
        </Form.Item>
      </Form>
    );
  }
}

export default reduxForm({
  form: LOSE_FORM,
  onSubmitFail: errors => {
    setTimeout(() => {
      let errorDom = document
        .querySelectorAll('[class*=error]')[0]
        .querySelector('input');
      errorDom
        ? errorDom.focus()
        : document.querySelectorAll('[class*=error]')[0].focus();
    }, 0);
  }
})(LoseForm);
