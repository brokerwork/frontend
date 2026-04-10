import { reduxForm, Field, FieldArray } from 'redux-form';
import FormField from 'components/FormField';
import { numberRequired, required } from 'components/FormField/validate';
import Form from 'components/Form';
import { FIELD_COLUMN, FIELD_OPTIONS, OPTIONS_FIELD, SENSITIVE_FIELD_TYPE } from '../../constant';
import { languages } from 'utils/config';
import Panel from 'components/Panel';
import Table from 'components/Table';
import Button from 'components/Button';
import i18n from 'utils/i18n';

export const QUESTION_FORM = 'BROKER_FIELD_SETTING_QUESTION_FORM';

const scoreNormalize = (value, previousValue) => {
  return value ? (Number(value) > 100 || Number(value) < 0 ? previousValue : Number(value)) : value;
};

const renderOptions = ({ fields, meta: { submitFailed, error = {} } }) => {
  return (
    <Panel header={i18n['field.setting.field.option.title']}>
      <Table>
        <Table.Header>
          <th />
          {languages.map((lang, idx) => {
            return <th key={idx}>{lang.label}</th>;
          })}
          <th>{i18n['broker.question.score']}</th>
        </Table.Header>
        <Table.Body>
          {fields.map((option, idx) => {
            const isError = submitFailed && error[idx];
            console.log(option, 'debug s');
            return [
              <tr key={idx}>
                <td>
                  {fields.length > 2 ? (
                    <Button icon onClick={() => fields.remove(idx)}>
                      <i className="fa fa-times" />
                    </Button>
                  ) : (
                    undefined
                  )}
                </td>
                {languages.map((lang, _idx) => {
                  return (
                    <td key={_idx} className={isError ? 'has-error' : ''}>
                      <Field name={`${option}.items.${lang.value}`} fieldType="text" component={FormField} />
                    </td>
                  );
                })}
                <td style={{ width: '66px' }}>
                  <Field
                    label={i18n['broker.question.score']}
                    name={`${option}.score`}
                    fieldType="number"
                    decimal="{0,0}"
                    component={FormField}
                    normalize={scoreNormalize}
                    validate={numberRequired}
                  />
                </td>
              </tr>,
              isError ? (
                <tr>
                  <td />
                  <td colSpan={languages.length} className="text-danger text-left">
                    {error[idx]}
                  </td>
                  <td />
                </tr>
              ) : (
                undefined
              )
            ];
          })}
        </Table.Body>
      </Table>
      {fields.length >= 6 ? (
        undefined
      ) : (
        <div className="text-right">
          <Button style="primary" onClick={() => fields.push({})}>
            <i className="fa fa-plus" />
            {i18n['field.setting.field.option.add_btn']}
          </Button>
        </div>
      )}
    </Panel>
  );
};

class QuestionForm extends PureComponent {
  render() {
    const { notEnabledQuestionList, onSelectQuestion, type } = this.props;

    return (
      <div>
        <Form>
          {type === 'create' ? (
            <Form.Item>
              <Form.Label>
                <span className="required" />
                {i18n['broker.question.select_question']}
              </Form.Label>
              <Form.Control>
                <Field
                  name="question"
                  label={i18n['broker.question.select_question']}
                  fieldType="select"
                  origin
                  disabled={type === 'update'}
                  onFieldChange={onSelectQuestion}
                  options={notEnabledQuestionList}
                  component={FormField}
                  validate={required}
                />
              </Form.Control>
            </Form.Item>
          ) : (
            undefined
          )}
          {languages.map((lang, idx) => {
            return (
              <Form.Item key={idx}>
                <Form.Label>
                  {i18n['broker.question.question_name']}（{lang.label}）：
                </Form.Label>
                <Form.Control>
                  <Field name={`subject.${lang.value}`} fieldType="text" component={FormField} />
                </Form.Control>
              </Form.Item>
            );
          })}
          <Form.Item>
            <Form.Label />
            <Form.Control>
              <Field name="subject" component={FormField} />
            </Form.Control>
          </Form.Item>
        </Form>
        <FieldArray name="options" component={renderOptions} />
      </div>
    );
  }
}

export default reduxForm({
  form: QUESTION_FORM,
  enableReinitialize: true,
  validate: values => {
    let errors = {};
    const optionsError = {};

    if (values.question && languages.every(lang => !(values.subject || {})[lang.value])) {
      optionsError.subject = i18n['broker.question.question_title_error'];
    }

    (values.options || []).forEach((option, idx) => {
      if (languages.every(lang => !(option.items || {})[lang.value])) {
        optionsError[idx] = i18n['broker.question.question_option_error'];
      }
    });

    if (Object.keys(optionsError).length) {
      errors = {
        ...optionsError,
        options: { _error: optionsError }
      };
    }

    return errors;
  }
})(QuestionForm);
