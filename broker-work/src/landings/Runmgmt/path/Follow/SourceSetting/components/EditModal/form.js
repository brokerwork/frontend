import { reduxForm, Field } from 'redux-form';
import i18n from 'utils/i18n';
import cs from './style.less';
import { Form, Input } from 'lean-ui';

export const EDIT_SOURCE_FORM = 'RUNMGMT_EDIT_SOURCE_FORM';

const MAX_STRATEGY_SIZE = 50;
const StrategyComp = ({
  data,
  placeholder,
  meta: { touched, error },
  input
}) => (
  <Form.Control error={touched && error} className={cs['strategy-control']}>
    <div className={cs['strategy']}>
      <Input.TextArea
        {...input}
        maxLength={MAX_STRATEGY_SIZE}
        className={`form-control ${cs['strategyInput']}`}
        placeholder={i18n['runmgmt.source_setting.table.strategy.placeholder']}
        rows={3}
      />
      <div className={cs['strategySizeBox']}>{`${
        input.value.length
      }/${MAX_STRATEGY_SIZE}`}</div>
    </div>
  </Form.Control>
);

class EditForm extends Component {
  render() {
    const { onSubmit } = this.props;
    return (
      <Form horizontal onSubmit={onSubmit}>
        <Form.Item col={1}>
          <Form.Label>
            {i18n['runmgmt.source_setting.table.strategy']}
          </Form.Label>
          <Field component={StrategyComp} name="investmentStrategy" />
        </Form.Item>
      </Form>
    );
  }
}
export default reduxForm({
  form: EDIT_SOURCE_FORM,
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
    if (
      !!values.investmentStrategy &&
      values.investmentStrategy.length > MAX_STRATEGY_SIZE
    ) {
      //输入法中文撤销操作下可能会出现超出限制的情况
      errors.investmentStrategy =
        i18n['runmgmt.source_setting.table.strategy.placeholder'];
    }
    return errors;
  }
})(EditForm);
