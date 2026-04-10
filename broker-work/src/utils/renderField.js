import { Col, FormControl } from 'react-bootstrap';
import Radio from 'components/Radio';
import Checkbox from 'components/Checkbox';
import Dropdown, { DropdownForCode } from 'components/Dropdown';
import DatePicker from 'components/DatePicker';
import NumberInput from 'components/NumberInput';
import Phone from 'components/Phone';
import UploadFile from 'components/UploadFile';
import EditorForHtml from 'components/EditorForHtml';
import CountrySelector from 'components/CountrySelector';
import { FormattedMessage } from 'react-intl';
import i18n from './i18n';
import PasswordInput from 'components/PasswordInput';
import Textarea, { getStringLength } from 'components/Textarea';

export const required = value =>
  !!value
    ? undefined
    : label => (
        <FormattedMessage
          id="custom_field.required"
          defaultMessage={i18n['custom_field.required']}
          values={{ value: label }}
        />
      );

export const isEmpty = value =>
  !!value.trim()
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

  return isError ? i18n['custom_field.greater_than_zero_number'] : undefined;
};

export const maxLength = len => value => {
  return value && getStringLength(value) > len
    ? i18n['general.validate.max_length']
    : undefined;
};

export const renderField = ({
  input,
  name,
  type,
  label,
  className,
  itemClassName,
  showDefaultImage,
  radioList,
  checkboxList,
  options,
  onlyImage = false,
  removabled,
  disabled,
  columns,
  maxLength,
  placeholder,
  defaultSelect = true,
  onFieldChange,
  colClassName,
  autoWidth,
  tipsContent,
  tipsContentClass = '',
  meta: { touched, error },
  rows,
  renderMenuItem,
  searchable,
  dropdownIcon,
  integer,
  decimal,
  unDeletable,
  fileExtensions,
  uploadSizeLimit,
  uploadMultiple,
  onFieldBlur
}) => {
  const isError = touched && error;
  const field = {
    ...input,
    onChange: (...args) => {
      if (onFieldChange) {
        onFieldChange(...args);
      }
      input.onChange(...args);
    },
    onBlur: evt => {
      if (onFieldBlur) {
        onFieldBlur(evt);
      }
      input.onBlur(evt);
    }
  };

  return (
    <Col
      sm={columns || 4}
      className={`${colClassName || ''} ${isError ? 'has-error' : ''}`}
    >
      {type === 'radioField'
        ? radioList.map((item, idx) => {
            return (
              <RadioContainer
                className={className}
                name={name}
                key={idx}
                item={item}
                disabled={disabled}
                input={field}
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
                input={field}
              />
            );
          })
        : undefined}
      {type === 'dateField' ? (
        <DatePicker
          className={className}
          disabled={disabled}
          {...field}
          unDeletable={unDeletable}
        />
      ) : (
        undefined
      )}
      {type === 'textField' ? (
        <FormControl
          className={className}
          placeholder={placeholder}
          maxLength={maxLength}
          type="text"
          disabled={disabled}
          {...field}
        />
      ) : (
        undefined
      )}
      {type === 'passwordField' ? (
        <PasswordInput
          className={className}
          placeholder={placeholder}
          maxLength={maxLength}
          disabled={disabled}
          {...field}
        />
      ) : (
        undefined
      )}
      {type === 'textareaField' ? (
        <textarea
          className={`form-control ${className}`}
          placeholder={placeholder}
          rows={rows}
          maxLength={maxLength}
          disabled={disabled}
          {...field}
        />
      ) : (
        undefined
      )}
      {type === 'maxLengthTextareaField' ? (
        <Textarea
          className={className}
          placeholder={placeholder}
          rows={rows}
          maxLength={maxLength}
          disabled={disabled}
          {...field}
        />
      ) : (
        undefined
      )}
      {type === 'selectField' ? (
        <DropdownForCode
          {...field}
          searchable={searchable}
          autoWidth={autoWidth}
          placeholder={placeholder}
          disabled={disabled}
          icon={dropdownIcon}
          defaultSelect={defaultSelect}
          data={options}
          className={className}
          renderMenuItem={renderMenuItem}
        />
      ) : (
        undefined
      )}
      {type === 'multiSelectField' ? (
        <Dropdown
          {...field}
          searchable={searchable}
          checkbox
          placeholder={placeholder}
          disabled={disabled}
          data={options}
          icon={dropdownIcon}
          className={className}
        />
      ) : (
        undefined
      )}
      {type === 'phoneField' ? (
        <Phone
          {...field}
          disabled={disabled}
          maxLength={maxLength}
          error={isError}
          className={className}
        />
      ) : (
        undefined
      )}
      {type === 'uploadField' ? (
        <UploadFile
          {...field}
          disabled={disabled}
          error={isError}
          removabled={removabled}
          onlyImage={onlyImage}
          className={className}
          itemClassName={itemClassName}
          fileExtensions={fileExtensions}
          uploadSizeLimit={uploadSizeLimit}
          multiple={uploadMultiple}
          showDefaultImage={showDefaultImage}
        />
      ) : (
        undefined
      )}
      {type === 'cityField' ? (
        <CountrySelector
          {...field}
          placeholder={placeholder}
          disabled={disabled}
        />
      ) : (
        undefined
      )}
      {type === 'numberField' ? (
        <NumberInput
          {...field}
          disabled={disabled}
          decimal={decimal}
          className={className}
          maxLength={maxLength}
          integer={integer}
          decimal={decimal}
        />
      ) : (
        undefined
      )}
      {type === 'richField' ? (
        <EditorForHtml {...field} onChange={input.onChange} />
      ) : (
        undefined
      )}
      {type === 'singleCheckboxField' ? (
        <SingleCheckboxContainer
          field={field}
          disabled={disabled}
          className={className}
        />
      ) : (
        undefined
      )}
      {tipsContent ? (
        <div className={'form-control-tips ' + tipsContentClass}>
          {tipsContent}
        </div>
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

const SingleCheckboxContainer = ({ disabled, field, className }) => {
  const { value } = field;
  const attr = {
    className,
    value,
    checked: value == 1,
    onChange: evt => {
      const result = evt.target.checked ? 1 : 0;

      field.onChange(result);
    }
  };

  return <Checkbox {...attr} disabled={disabled} inline />;
};
