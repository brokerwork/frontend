import { reduxForm, Field } from "redux-form";
import FormField from "components/FormField";
import {
  required,
  isEmail,
  isPhone,
  maxLength
} from "components/FormField/validate";
import Form from "components/Form";
import i18n from "utils/i18n";

export const DAYOFF_EDIT_FORM = "DAYOFF_EDIT_FORM";

class DayoffEditForm extends PureComponent {
  render() {
    const { symbolList } = this.props;
    return (
      <Form>
        <Form.Item>
          <Form.Label>
            {i18n["twapp.dayoffsetting.dayoffedit.desc"]}：
          </Form.Label>
          <Form.Control>
            <Field
              name="name"
              label={i18n["twapp.dayoffsetting.dayoffedit.desc"]}
              fieldType="text"
              component={FormField}
              validate={maxLength(20)}
            />
          </Form.Control>
        </Form.Item>
        <Form.Item>
          <Form.Label>
            <span className="required" />
            {i18n["twapp.dayoffsetting.dayoffedit.date"]}：
          </Form.Label>
          <Form.Control>
            <Field
              name="date"
              label={i18n["twapp.dayoffsetting.dayoffedit.date"]}
              fieldType="calendar"
              component={FormField}
              validate={required}
            />
          </Form.Control>
        </Form.Item>
        <Form.Item>
          <Form.Label>
            {i18n["twapp.dayoffsetting.dayoffedit.yearRepeat"]}：
          </Form.Label>
          <Form.Control>
            <Field
              name="yearRepeat"
              label={i18n["twapp.dayoffsetting.dayoffedit.yearRepeat"]}
              fieldType="radio"
              options={[
                { value: true, label: i18n["general.yes"] },
                { value: false, label: i18n["general.no"] }
              ]}
              component={FormField}
            />
          </Form.Control>
        </Form.Item>
        <Form.Item>
          <Form.Label>
            <span className="required" />
            {i18n["twapp.dayoffsetting.dayoffedit.time"]}：
          </Form.Label>
          <Form.Control>
            <Field
              name="time"
              label={i18n["twapp.dayoffsetting.dayoffedit.time"]}
              fieldType="date"
              component={FormField}
              validate={required}
            />
          </Form.Control>
        </Form.Item>
        <Form.Item>
          <Form.Label>
            <span className="required" />
            {i18n["twapp.dayoffsetting.dayoffedit.symbol"]}：
          </Form.Label>
          <Form.Control>
            <Field
              name="symbols"
              label={i18n["twapp.dayoffsetting.dayoffedit.symbol"]}
              fieldType="multiSelect"
              component={FormField}
              options={symbolList}
              validate={required}
            />
          </Form.Control>
        </Form.Item>
        <Form.Item>
          <Form.Label>
            <span className="required" />
            {i18n["twapp.dayoffsetting.dayoffedit.enabled"]}：
          </Form.Label>
          <Form.Control>
            <Field
              name="enabled"
              label={i18n["twapp.dayoffsetting.dayoffedit.enabled"]}
              fieldType="radio"
              options={[
                {
                  value: true,
                  label: i18n["twapp.dayoffsetting.table.state.work"]
                },
                {
                  value: false,
                  label: i18n["twapp.dayoffsetting.table.state.freez"]
                }
              ]}
              component={FormField}
            />
          </Form.Control>
        </Form.Item>
      </Form>
    );
  }
}

export default reduxForm({
  form: DAYOFF_EDIT_FORM
})(DayoffEditForm);
