import { reduxForm, Field } from "redux-form";
import FormField from "components/FormField";
import { required } from "components/FormField/validate";
import Form from "components/Form";
import i18n from "utils/i18n";
import math from "utils/math";

export const SYMBOL_FORM = "BROKER_EMAIL_SETTING_SYMBOL_FORM";

class SymbolForm extends PureComponent {
  render() {
    const { initialValues, tenantSymbol } = this.props;

    return (
      <Form>
        <Form.Item>
          <Form.Label>
            <span className="required" />
            {`${i18n['followOrder.symbolSetting.table.minVolume']}：`}
          </Form.Label>
          <Form.Control>
            <Field
              minVal={tenantSymbol.minVolume}
              maxVal={tenantSymbol.maxVolume}
              name="minVolume"
              fieldType="stepNumber"
              step={tenantSymbol.stepVolume}
              component={FormField}
            />
          </Form.Control>
        </Form.Item>
        <Form.Item>
          <Form.Label>
            <span className="required" />
            {`${i18n['followOrder.symbolSetting.table.spread']}：`}
          </Form.Label>
          <Form.Control>
            <Field name="spread" fieldType="number" component={FormField} />
          </Form.Control>
        </Form.Item>
      </Form>
    );
  }
}

export default reduxForm({
  form: SYMBOL_FORM,
  enableReinitialize: true,
  validate: (values, props) => {
    const { tenantSymbol } = props;
    const minVolume = Math.max(tenantSymbol.stepVolume, tenantSymbol.minVolume);
    const { maxVolume, stepVolume } = tenantSymbol;
    const errors = {};

    if (Number(values.minVolume) < minVolume) {
      errors.minVolume = `${i18n['followOrder.symbolSetting.warning.minVolume.pre']}${minVolume}${i18n['followOrder.symbolSetting.warning.after']}`;
    } else if (Number(values.minVolume) > maxVolume) {
      errors.minVolume = `${i18n['followOrder.symbolSetting.warning.maxVolume.pre']}${maxVolume}${i18n['followOrder.symbolSetting.warning.after']}`;
    } else if (math.mod(math.sub(values.minVolume, minVolume), stepVolume) / 100 !== 0) {
      errors.minVolume = `${i18n['followOrder.symbolSetting.warning.stepVolume.pre']}${stepVolume}${i18n['followOrder.symbolSetting.warning.stepVolume.after']}`;
    }
    const spread = Number(values.spread);
    if (spread < 0 || !Number.isInteger(spread)) {
      errors.spread = i18n['followOrder.symbolSetting.spread'];
    }

    return errors;
  }
})(SymbolForm);
