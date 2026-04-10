import { Col, FormControl } from 'react-bootstrap';
import Radio from 'components/Radio';
import Checkbox from 'components/Checkbox';
import { DropdownForCode } from 'components/Dropdown';
import DatePicker from 'components/DatePicker';
import { FormattedMessage } from 'react-intl';
import i18n from 'utils/i18n';

export const required = value =>
  value
    ? undefined
    : label => (
        <FormattedMessage
          id="custom_field.required"
          defaultMessage={i18n['custom_field.required']}
          values={{ value: label }}
        />
      );

export const number = value => {
  const regexp = /^\+?\d+(\.\d+)?$/;
  const isError = !regexp.test(value);

  return isError ? i18n['account.validate.positive_integer'] : undefined;
};

export const renderField = ({
  input,
  name,
  type,
  label,
  className,
  radioList,
  checkboxList,
  options,
  disabled,
  columns,
  maxLength,
  meta: { touched, error }
}) => {
  const isError = touched && error;

  return (
    <Col sm={columns || 4} className={isError ? 'has-error' : ''}>
      {type === 'radioField'
        ? radioList.map((item, idx) => {
            return (
              <RadioContainer
                className={className}
                name={name}
                key={idx}
                item={item}
                disabled={disabled}
                input={input}
              />
            );
          })
        : undefined}
      {type === 'checkboxField'
        ? checkboxList.map((item, idx) => {
            return (
              <CheckboxContainer
                className={className}
                key={idx}
                item={item}
                disabled={disabled}
                input={input}
              />
            );
          })
        : undefined}
      {type === 'dateField' ? (
        <DatePicker className={className} disabled={disabled} {...input} />
      ) : (
        undefined
      )}
      {type === 'textField' || type === 'passwordField' ? (
        <FormControl
          className={className}
          maxLength={maxLength}
          type={type === 'textField' ? 'text' : 'password'}
          disabled={disabled}
          {...input}
        />
      ) : (
        undefined
      )}
      {type === 'textareaField' ? (
        <textarea
          className={`form-control ${className}`}
          maxLength={maxLength}
          disabled={disabled}
          {...input}
        />
      ) : (
        undefined
      )}
      {type === 'selectField' ? (
        <DropdownForCode
          {...input}
          disabled={disabled}
          defaultSelect
          data={options}
          className={`${className}`}
        />
      ) : (
        undefined
      )}
      {isError ? (
        <div className="validate-error-msg">
          {typeof error === 'function' ? error(label) : error}
        </div>
      ) : (
        undefined
      )}
    </Col>
  );
};

const RadioContainer = ({ name, disabled, input, item, className }) => {
  const handleChange = () => {
    // 触发redux-form的asyncValidate
    input.onFocus(item.value);
    input.onChange(item.value);
    input.onBlur(item.value);
  };

  return (
    <Radio
      className={className}
      name={name}
      onChange={handleChange}
      inline
      disabled={disabled}
      value={item.value}
      checked={item.value == input.value}
    >
      {item.label}
    </Radio>
  );
};

const CheckboxContainer = ({ disabled, input, item, className }) => {
  const handleChange = () => {
    let values = input.value.concat() || [];

    if (values.includes(item.value)) {
      values = values.filter(value => value != item.value);
    } else {
      values.push(item.value);
    }
    input.onChange(values);
  };

  return (
    <Checkbox
      className={className}
      onChange={handleChange}
      inline
      disabled={disabled}
      value={item.value}
      checked={input.value.includes(item.value)}
    >
      {item.label}
    </Checkbox>
  );
};
