import Dropdown from 'components/v2/Dropdown';
import Phone from 'components/v2/Phone';
import UploadFile from 'components/v2/UploadFile';
import EditorForHtml from 'components/EditorForHtml';
import NumberInput from 'components/v2/NumberInput';
import CountrySelector from 'components/CountrySelector';
import { FormattedMessage } from 'react-intl';
import i18n from './../i18n';
import PasswordInput from 'components/v2/PasswordInput';
import Textarea, { getStringLength } from 'components/v2/Textarea';
import {
  Radio,
  Checkbox,
  DatePicker,
  InputNumber,
  Switch,
  Input
} from 'lean-ui';
import DropdownForCode from 'components/v2/DropdownForCode';
// import DatePicker from 'components/v2/DatePicker';
import moment from 'moment';

export const required = value => {
  if (Array.isArray(value)) {
    return value.length === 0 ? label => label : false;
  }
  return !!value
    ? undefined
    : label => (
        <FormattedMessage
          id="custom_field.required"
          defaultMessage={i18n['custom_field.required']}
          values={{ value: label }}
        />
      );
};

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
  onFieldBlur,
  max,
  min,
  precision,
  step,
  isHead,
  suffix,
  edit
}) => {
  const isError = touched && error;
  let temp;
  const field = {
    ...input,
    value:
      type === 'dateField' && input.value ? moment(input.value) : input.value,
    onChange: (...args) => {
      if (onFieldChange) {
        onFieldChange(...args);
      }
      if (type === 'numberField') {
        temp = args[0];
        return;
      }
      input.onChange(...args);
    },
    onBlur: evt => {
      if (onFieldBlur) {
        onFieldBlur(evt);
      }
      if (type === 'numberField') {
        input.onChange(temp);
        return;
      }
      input.onBlur(evt);
    },
    onSelect: data => {
      input.onChange(data);
    }
  };
  return (
    <div className={`${colClassName || ''} ${isError ? 'has-error' : ''}`}>
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
      {type === 'radioField' && !!suffix ? suffix : undefined}
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
        <Input
          className={className}
          placeholder={placeholder}
          maxLength={maxLength}
          type="text"
          disabled={disabled}
          suffix={suffix}
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
        <Textarea
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
          {...input}
          onSelect={field.onChange}
          searchable={searchable}
          autoWidth={autoWidth}
          placeholder={placeholder}
          disabled={disabled}
          icon={dropdownIcon}
          data={options}
          className={className}
          renderMenuItem={renderMenuItem}
          type={edit}
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
          maxLength={uploadMultiple ? 10 : 1}
          showDefaultImage={showDefaultImage}
          isHead={isHead}
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
        <InputNumber
          {...field}
          placeholder={placeholder}
          disabled={disabled}
          className={className}
          step={step}
          max={max}
          min={min}
          precision={precision}
        />
      ) : (
        undefined
      )}
      {/* 这个数字输入框是用的component，和lean-ui不一样 */}
      {type === 'numField' ? (
        <NumberInput
          {...field}
          placeholder={placeholder}
          disabled={disabled}
          className={className}
          maxLength={maxLength}
          integer={integer}
          suffix={suffix}
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
      {type === 'switchField' ? (
        <Switch
          {...field}
          checked={field.value == 1}
          disabled={disabled}
          className={className}
          onChange={checked => {
            const result = checked ? 1 : 0;
            field.onChange(result);
          }}
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
        <div style={{ color: '#df3031' }} className="validate-error-msg">
          {typeof error === 'function' ? error(label) : error}
        </div>
      ) : (
        undefined
      )}
    </div>
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
      {item.title ? <span title={item.title}>{item.label}</span> : item.label}
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
