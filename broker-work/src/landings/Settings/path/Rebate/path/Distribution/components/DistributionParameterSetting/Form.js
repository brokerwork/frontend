import { reduxForm, Field } from 'redux-form';
import { Form, FormGroup, Col, ControlLabel } from 'react-bootstrap';
import { renderField } from 'utils/renderField';
import i18n from 'utils/i18n';
import cs from './DistributionParameterSetting.less';

export const PARAMETER_FORM = 'DISTRIBUTION_PARAMETER_FORM';

class ParameterForm extends PureComponent {
  render() {
    const { handleSubmit, levelList } = this.props;

    return (
      <Form horizontal onSubmit={handleSubmit}>
        {levelList.map((item, idx) => {
          return (
            <FormGroup key={idx}>
              <Col componentClass={ControlLabel} sm={2} className={cs['label']}>
                {item.name}: $
              </Col>
              <Field
                name={`levelId_${item.id}`}
                component={renderField}
                placeholder={
                  i18n[
                    'settings.rebate_setting.distribution.level_money_placeholder'
                  ]
                }
                columns={4}
                type="numberField"
                label={
                  i18n['settings.rebate_setting.distribution.level_money_label']
                }
              />
            </FormGroup>
          );
        })}
      </Form>
    );
  }
}

export default reduxForm({
  form: PARAMETER_FORM,
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
})(ParameterForm);
