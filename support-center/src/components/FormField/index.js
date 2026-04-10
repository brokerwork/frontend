import Select from 'components/Select';
import CKEditor from 'components/Ckeditor';
import UploadFile from 'components/UploadFile';
import Checkbox from 'components/Checkbox';
import Radio from 'components/Radio';
import NumberInput from 'components/NumberInput';
import FormControl from 'components/FormControl';
import DatePicker from 'components/DatePicker';
import TimeRangePicker from 'components/TimeRangePicker';
import HourRangePicker from 'components/HourRangePicker';
import MultiSelect from 'components/MultiSelect';
import Editor from 'components/EditorForHtml';
import StepNumberInput from 'components/StepNumberInput';
import SearchSelect from 'components/SearchSelect';
import AuthTree from 'components/AuthTree';
import { Switch } from 'lean-ui';
import _ from 'lodash';

const RadioListContainer = ({ type, disabled, field, value, label, checked, checkedKey }) => {
  const props = {
    value,
    checked,
    disabled
  };

  // radio
  if (type === 'radio') {
    props['onChange'] = v => {
      field.onChange(value);
    };

    props['checked'] = value == field.value;

    return (
      <Radio {...props} inline>
        {label}
      </Radio>
    );
  }
};
// checkbox列表
export class CheckboxListContainer extends PureComponent {
  state = {
    checklist: []
  };
  componentDidMount() {
    this.setCheckList();
  }
  // 接收异步传入的数据
  componentWillReceiveProps(props) {
    this.setCheckList(props);
  }
  setCheckList(props) {
    const { value = [] } = props || this.props;
    if (value instanceof Array) {
      this.setState({
        checklist: value
      });
    }
  }

  onChange = (idx, evt) => {
    const { onChange, value, checkedKey = 'checked' } = this.props;
    value[idx][checkedKey] = evt.target.checked;
    this.setState({
      checklist: [].concat(value)
    });
    onChange(value);
  };

  render() {
    const { disabled = [], checked = [], checkedKey = 'checked', ...props } = this.props;
    const { checklist } = this.state;
    return (
      <div>
        {checklist.map((item, index) => {
          return (
            <Checkbox
              key={item.value}
              {...props}
              disabled={disabled.indexOf(item.value) !== -1}
              checked={item[checkedKey]}
              onChange={this.onChange.bind(this, index)}
              value={item.value}
              inline
            >
              {item.label}
            </Checkbox>
          );
        })}
      </div>
    );
  }
}

// 新chekcklist
export class NewCheckboxListContainer extends PureComponent {
  state = {
    checklist: []
  };
  componentDidMount() {
    this.setCheckList();
  }
  // 接收异步传入的数据
  componentWillReceiveProps(props) {
    this.setCheckList(props);
  }
  setCheckList(props) {
    const { value = [] } = props || this.props;
    if (value instanceof Array) {
      this.setState({
        checklist: value
      });
    }
  }

  onChange = (val, evt) => {
    const { onChange, value } = this.props;
    const currentVal = _.cloneDeep(value);
    if (evt.target.checked) {
      currentVal.push(val);
    } else {
      _.remove(currentVal, function(v) {
        return v === val;
      });
    }
    this.setState({
      checklist: [].concat(currentVal)
    });
    onChange(currentVal);
  };

  render() {
    const { disabled = [], checked = [], options = [], value = [], ...props } = this.props;
    const { checklist } = this.state;
    return (
      <div>
        {options.map((item, index) => {
          return (
            <Checkbox
              key={item.value}
              {...props}
              disabled={disabled.indexOf(item.value) !== -1}
              checked={checklist.includes(item.value)}
              onChange={this.onChange.bind(this, item.value)}
              value={item.value}
              inline
            >
              {item.label}
            </Checkbox>
          );
        })}
      </div>
    );
  }
}

const CheckboxContainer = ({ field, label, disabled }) => {
  const onChange = evt => {
    field.onChange(evt.target.checked);
  };

  return (
    <Checkbox {...field} onChange={onChange} checked={field.value} inline disabled={disabled}>
      {label}
    </Checkbox>
  );
};

const SwitchContainer = field => {
  return <Switch {...field} checked={field.value} />;
};

export default class FormField extends PureComponent {
  renderFieldType = (fieldType, props, field) => {
    const {
      name,
      // 用作checkbox 和 checkboxlist
      disabled,
      checked,
      placeholder,
      maxLength,
      options,
      className = '',
      // 标识checked的自定义字段
      checkedKey,
      label,
      origin,
      decimal,
      multiple,
      showItem,
      onlyImage,
      right,
      step,
      maxVal,
      minVal,
      rows = 10,
      isError,
      getInstance,
      integer,
      negative
    } = props;
    switch (fieldType) {
      case 'password':
        return (
          <FormControl
            type="password"
            className={className}
            {...field}
            name={name}
            disabled={disabled}
            placeholder={placeholder}
            maxLength={maxLength}
          />
        );
      case 'textarea':
        return (
          <textarea
            className={`form-control ${className}`}
            {...field}
            placeholder={placeholder}
            disabled={disabled}
            rows={rows}
            maxLength={maxLength}
          />
        );
      case 'select':
        return (
          <Select
            {...field}
            disabled={disabled}
            placeholder={placeholder}
            className={className}
            options={options}
            origin={origin}
            right={right}
          />
        );
      case 'searchSelect':
        return (
          <SearchSelect
            {...field}
            disabled={disabled}
            placeholder={placeholder}
            className={className}
            options={options}
            onSelect={field.onChange}
            multiple={multiple}
          />
        );
      case 'editor':
        return <CKEditor {...field} getInstance={getInstance} />;
      case 'file':
        return (
          <UploadFile
            {...field}
            multiple={multiple}
            showItem={showItem}
            disabled={disabled}
            error={isError}
            onlyImage={onlyImage}
          />
        );
      case 'radio':
        return options.map((item, idx) => (
          <RadioListContainer
            key={idx}
            type="radio"
            field={field}
            value={item.value}
            label={item.label}
            disabled={disabled ? disabled : item.disabled}
          />
        ));
      case 'checkboxList':
        return <CheckboxListContainer {...field} checkedKey={checkedKey} checked={checked} disabled={disabled} />;
      case 'newCheckboxList':
        return (
          <NewCheckboxListContainer
            {...field}
            checkedKey={checkedKey}
            checked={checked}
            disabled={disabled}
            options={options}
          />
        );
      case 'checkbox':
        return <CheckboxContainer field={field} label={label} disabled={disabled} />;
      case 'number':
        return (
          <NumberInput
            className={className}
            {...field}
            name={name}
            decimal={decimal}
            negative={negative}
            disabled={disabled}
            placeholder={placeholder}
            maxLength={maxLength}
            integer={integer}
          />
        );
      case 'multiSelect':
        return <MultiSelect {...field} options={options} inline={true} checked={field.value} disabled={disabled} />;
      case 'date':
        return <TimeRangePicker {...field} options={options} inline={true} checked={field.value} disabled={disabled} />;
      case 'calendar':
        return <DatePicker className={className} {...field} name={name} disabled={disabled} />;
      case 'hour':
        return <HourRangePicker className={className} {...field} name={name} disabled={disabled} />;
      case 'editorForHtml':
        return <Editor {...field} disabled={disabled} />;
      case 'stepNumber':
        return <StepNumberInput {...field} step={step} maxVal={maxVal} minVal={minVal} disabled={disabled} />;
      case 'text':
        return (
          <FormControl
            className={className}
            {...field}
            name={name}
            disabled={disabled}
            placeholder={placeholder}
            maxLength={maxLength}
          />
        );
      case 'authTree':
        return <AuthTree {...field} disabled={disabled}></AuthTree>;
      case 'switch':
        return <SwitchContainer {...field} />;
      default:
        return null;
    }
  };
  render() {
    const {
      fieldType,
      input,
      name,
      // 用作checkbox 和 checkboxlist
      disabled,
      placeholder,
      maxLength,
      className = '',
      // 标识checked的自定义字段
      label,
      fieldClassName = '',
      meta: { touched, error },
      onFieldChange,
      onSearchChange,
      leftAddon
    } = this.props;
    const isError = touched && error;
    const field = {
      ...input,
      onChange: evt => {
        input.onChange(evt);
        if (onFieldChange) {
          onFieldChange(evt);
        }
      },
      onSearchChange
    };

    return (
      <div className={`${fieldClassName} ${isError ? 'has-error' : ''}`}>
        <div className={`${leftAddon ? 'form-addon' : ''}`}>
          {leftAddon ? <div className="left-addon">{leftAddon}</div> : undefined}
          {this.renderFieldType(fieldType, this.props, field)}
        </div>
        {isError ? (
          <div className="error-msg">{typeof error === 'function' ? error(label, fieldType) : error}</div>
        ) : (
          undefined
        )}
      </div>
    );
  }
}
