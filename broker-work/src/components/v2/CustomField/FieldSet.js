import DatePicker from 'components/v2/DatePicker';
import DropdownForCode from 'components/v2/DropdownForCode';
import Phone from 'components/v2/Phone';
import UploadFile from 'components/v2/UploadFile';
import cs from './CustomField.less';
import i18n from 'utils/i18n';
import CountrySelector from 'components/v2/CountrySelector';
import NationalitySelector from 'components/v2/NationalitySelector';
import Tax from 'components/v2/Tax';
import moment from 'moment';
import NumberInput from 'components/v2/NumberInput';
import classnames from 'classnames';
import { Checkbox, Form, Input, Picklist, Radio } from 'lean-ui';
import PasswordInput from 'components/v2/PasswordInput';
const { TextArea } = Input;
const __Default_Select__ = {
  value: '',
  label: i18n['general.default_select']
};
const defaultValueMap = {
  city: 'defaultCity',
  checkbox: 'defaultCheckbox'
};
export default class FieldSet extends Component {
  componentDidMount() {
    const {
      fieldConfig,
      input: { onChange },
      setDefaultValue
    } = this.props;
    const { defaultValue, fieldType } = fieldConfig;
    if (setDefaultValue) {
      setTimeout(() => {
        const keys = Object.keys(defaultValueMap);
        const value = keys.includes(fieldType)
          ? fieldConfig[defaultValueMap[fieldType]]
          : defaultValue;

        if (value) {
          onChange(value);
        }
      }, 100);
    }
  }
  render() {
    const {
      fieldConfig,
      fieldGenerator,
      input,
      disabled,
      meta: { touched, error }
    } = this.props;
    const isError = touched && error;
    if (fieldGenerator && fieldConfig.fieldType === fieldGenerator.key) {
      const factory = fieldGenerator.factory;
      const dynamicUI = factory(input, disabled, fieldConfig);
      return (
        <Form.Control errorMsg={isError ? error : null}>
          <div disabled={disabled}>{dynamicUI}</div>
        </Form.Control>
      );
    }
    const placeholder = fieldConfig.placeHolder
      ? i18n[fieldConfig.placeHolder] || fieldConfig.placeHolder
      : fieldConfig.hint
        ? fieldConfig.hint
        : '';
    const maxLength = fieldConfig.size;
    const options = fieldConfig.optionList || [];
    const selectOptions = [__Default_Select__, ...options];
    const searchable = fieldConfig.searchable;
    const errorClassName = isError ? cs['error'] : '';
    const defaultSelect =
      fieldConfig.defaultSelect !== undefined
        ? fieldConfig.defaultSelect
        : true;
    const multiple = fieldConfig.multiple;
    if (disabled) {
      input.onChange = fn;
    }
    let renderComponent;
    let additionProps = {};
    switch (fieldConfig.fieldType) {
      case 'datestring':
        if (input.value && !moment.isMoment(input.value))
          input.value = moment(input.value);
        renderComponent = (
          <DatePicker
            {...input}
            maxDate={
              fieldConfig.key.includes('birthday') ? moment() : undefined
            }
            className={classnames(input.className, cs['select'])}
            placeholder={placeholder}
            error={isError}
            disabled={disabled}
          />
        );
        break;

      case 'city':
        renderComponent = (
          <CountrySelector
            placeholder={placeholder}
            itemClassName={errorClassName}
            {...input}
            disabled={disabled}
          />
        );
        break;

      case 'password':
        renderComponent = (
          <PasswordInput
            {...input}
            disabled={disabled}
            maxLength={maxLength}
            autoComplete="new-password"
            className={errorClassName}
            placeholder={placeholder}
          />
        );
        break;

      case 'select':
        renderComponent = (
          <DropdownForCode
            {...input}
            type={fieldConfig.type}
            data={selectOptions}
            disabled={disabled}
            defaultValue={defaultSelect && !multiple}
            searchable={searchable}
            className={`${cs['select']} ${errorClassName}`}
            placeholder={placeholder || i18n['general.default_select']}
          />
        );
        break;
      case 'multiSelect':
        const { value: defaultSelectedKeys } = input;
        renderComponent = (
          <Picklist
            {...input}
            data={options}
            disabled={disabled}
            defaultSelect={false}
            defaultSelectedKeys={defaultSelectedKeys}
            searchable={searchable}
            className={`${cs['select']} ${errorClassName}`}
          />
        );
        break;

      case 'country':
        renderComponent = (
          <NationalitySelector
            {...input}
            disabled={disabled}
            className={`${cs['select']} ${errorClassName}`}
          />
        );
        break;

      case 'radio':
        additionProps.checkbox = true;
        renderComponent = options.map((item, index) => {
          return (
            <CheckboxContainer
              key={index}
              type="radio"
              field={input}
              value={item.value}
              label={item.label}
              disabled={disabled}
              className={`${cs['radio']} ${errorClassName}`}
            />
          );
        });
        break;

      case 'checkbox':
        additionProps.checkbox = true;
        renderComponent = options.map((item, index) => {
          return (
            <CheckboxContainer
              key={index}
              type="checkbox"
              field={input}
              value={item.value}
              label={item.label}
              disabled={disabled}
              className={errorClassName}
            />
          );
        });
        break;

      case 'singleCheckbox':
        additionProps.checkbox = true;
        renderComponent = (
          <SingleCheckboxContainer
            field={input}
            disabled={disabled}
            className={errorClassName}
          />
        );
        break;

      case 'phone':
        renderComponent = (
          <Phone
            {...input}
            disabled={disabled}
            maxLength={maxLength}
            error={isError}
          />
        );
        break;

      case 'image':
        renderComponent = (
          <UploadFile
            {...input}
            initOssSignature={fieldConfig.initOssSignature}
            disabled={disabled}
            error={isError}
            multiple={multiple}
            className={cs['upload-custom-field']}
          />
        );
        break;
      case 'multiFile':
        renderComponent = (
          <UploadFile
            {...input}
            fileExtensions={fieldConfig.fileExtensions}
            uploadSizeLimit={fieldConfig.uploadSizeLimit}
            disabled={disabled}
            error={isError}
            className={cs['upload-custom-field']}
            multiple={true}
            maxLength="10"
          />
        );
        break;

      case 'textarea':
        renderComponent = (
          <TextArea
            {...input}
            disabled={disabled}
            // componentClass="textarea"
            className={errorClassName}
            placeholder={placeholder}
            maxLength={maxLength}
            rows="3"
          />
        );
        break;

      case 'number':
        renderComponent = (
          <NumberInput
            {...input}
            disabled={disabled}
            className={errorClassName}
            placeholder={placeholder}
            maxLength={maxLength}
          />
        );
        break;

      case 'tin':
        // additionProps.error = undefined;
        renderComponent = (
          <TaxContainer
            {...input}
            size={fieldConfig.size}
            field={input}
            disabled={disabled}
            error={error}
          />
        );
        break;

      default:
        renderComponent = (
          <Input
            {...input}
            disabled={disabled}
            className={errorClassName}
            placeholder={placeholder}
            maxLength={maxLength}
            type="text"
            title={disabled ? input.value : ''}
          />
        );
    }
    return (
      <Form.Control {...additionProps} errorMsg={isError ? error : null}>
        {renderComponent}
        {fieldConfig.reminder ? (
          <div className={cs['field-reminder']}>
            {typeof fieldConfig.reminder === 'function'
              ? fieldConfig.reminder(fieldConfig, input)
              : fieldConfig.reminder}
          </div>
        ) : (
          undefined
        )}
      </Form.Control>
    );
  }
}

const CheckboxContainer = ({
  type,
  disabled,
  field,
  value,
  label,
  className
}) => {
  const attr = {
    value: value,
    inline: true
  };
  // radio
  if (type === 'radio') {
    attr['onChange'] = v => {
      field.onFocus();
      field.onChange(value);
    };
    attr['checked'] = value == field.value;
    return (
      <Radio {...attr} className={className} disabled={disabled}>
        {label}
      </Radio>
    );
  }

  // checkbox
  attr['onChange'] = v => {
    field.onFocus();
    let values = field.value.concat() || [];
    if (values.includes(value)) {
      values = values.filter(item => item != value);
    } else {
      values.push(value);
    }
    field.onChange(values);
  };
  attr['checked'] = field.value.includes(value);
  return (
    <Checkbox {...attr} disabled={disabled}>
      {label}
    </Checkbox>
  );
};

const SingleCheckboxContainer = ({ disabled, field, className }) => {
  const { value } = field;
  const attr = {
    className: `${className} glo-single-checkbox`,
    value,
    checked: value == 1,
    onChange: evt => {
      const result = evt.target.checked ? 1 : 0;
      field.onFocus();
      field.onChange(result);
    }
  };

  return <Checkbox {...attr} disabled={disabled} />;
};

const TaxContainer = ({ onFocus, disabled, field, size, error = {} }) => {
  return (
    <div className={cs['tax-container']}>
      <div className={cs['tax-field']}>
        <Tax
          value={field.value}
          disabled={disabled}
          onChange={field.onChange}
          onFocus={onFocus}
        />
      </div>
    </div>
  );
};

function fn() {}
