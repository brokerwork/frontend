import * as React from 'react';
import {
  Col, FormControl, FormGroup, FileUpload,
  ControlLabel, CountryPicker, DatePicker, NewSelect
} from 'fooui';
import {ValidationUtils} from "../validateUtils";
import * as moment from 'moment';
import FileUploadHelper from '../ossHelper';

export default class CustomField extends React.Component<any, any>{
  state = {
    data: {},
    error: {},
    validateType: {} 
  }

  componentWillReceiveProps(nextProps) {
    const {data, fields, initialData, onChange} = nextProps;
    const error = {};
    const stateValidateType = {};
    // const stateData = Object.assign({}, data);
    const stateData = {};
    const __fields = {};
    fields.forEach((item, index) => {
      const {key, validateType, optionList} = item;
      // 初始化错误信息
      error[key] = false;
      // 取得验证规则
      stateValidateType[key] = validateType || [];
      stateData[key] = data[key] || item.defaultValue || null;
      __fields[key] = item;
    });
    this.__fields = __fields;
    onChange(stateData, {initialError: true});
    this.state = {
      error,
      validateType: stateValidateType,
      data: stateData
    };
  }
  
  onChange(field, e, province, city) {
    const {data, error} = this.state;
    let stateData:Object;
    let value:any;
    const fieldType = this.__fields[field].fieldType;
    
    if (fieldType === 'city') {
      stateData = Object.assign({}, data, {
        [field]: {
          country: e,
          province: province,
          city: city
        }
      });
    } else {
      value = e.target ? e.target.value : e;
      stateData = Object.assign({}, data, {[field]: value});
    }

    this.setState({
      data: stateData,
    }, () => {
      const {onChange} = this.props;
      onChange(stateData);
    });
  }

  onBlur(fields, e) {
    const {onChange} = this.props;
    const {error, data} = this.state;
    let value = e.target.value;
    const errorMsg = this.validate(fields, value);
    const __error = Object.assign({}, error, {
      [fields]: errorMsg
    });

    onChange(data, __error);
    this.setState(Object.assign({}, this.state, {error: __error}));
  }

  validate = (field, value) => {
    let {validateType} = this.state;
    const {i18n} = this.props;
    let str:boolean|string = false;

    validateType = validateType[field];

    if (validateType['email']) {
      return !ValidationUtils.isEmail(value) ? "请输入正确的邮箱!" : false;
    }
    if (validateType['phone']) {
      return ValidationUtils.isPhoneNumber(value) ? "请输入正确的电话号码！" : false;
    }
    if (validateType['regular']) {
      let reg = eval(validateType['regular']);
      return !value.match(reg) ? '请输入正确的字符串！' : false;
    }
    if (validateType['required']) {
      return ValidationUtils.isEmptyString(value) ? "这是一个必须填项！" : false;
    }
    return str;

  }
  render() {
    let {i18n, fields, externalData} = this.props;
    const {data, error} = this.state;
    return (
      <FormGroup className={`custom-field`}>
        {fields.map((item, index) => {
          let {label, key, columns, fieldType, validateType, optionList, readonly} = item;
          const colNumber = Number(columns);
          validateType = validateType || [];
          return (
            <div
              className={`custom-field--item custom-field--item__width-${colNumber * 50}`}
              key={index}
            >
              <div
                className={`custom-field--label`}
              >
                {validateType["required"]
                ? <span className="important-info">* </span>
                : undefined}
                {`${label}:`}
              </div>
              <div
                className={`custom-field--element`}
              >
                <FieldSet 
                  fieldType={fieldType}
                  name={key}
                  data={data}
                  placeholder={label}
                  readOnly={readonly}
                  error={!!error[key]}
                  options={externalData[key] || optionList || []}
                  onChange={this.onChange.bind(this, key)}
                  onBlur={this.onBlur.bind(this, key)}
                />
                {error[`${key}`]
                ? <p className="help-block">{error[`${key}`]}</p>
                : undefined }
              </div>
            </div>
          );
        })}
      </FormGroup>
    );
  }
}

class FieldSet extends React.Component<any, any>{
  render() {
    let {fieldType, data, onChange, placeholder, options, name, onBlur, error, readOnly} = this.props;
    let value = data[name];

    switch (fieldType) {
      case 'image': 
        return (
          <div>
            {value
            ? <img src={value} style={{
                width: '80px',
                height: '80px',
                marginBottom: '3px',
                border: '1px solid black'
              }}/>
            : undefined}
            <FileUpload className="btn-test"
              onUploadComplete={(uploader) => {
                onChange(FileUploadHelper.getFileUrlPrefix() + '/' + uploader.fileName);
              }}
              uploadFileExtensions={['png', 'jpeg', 'jpg', 'PNG', 'JPEG', 'JPG']}
            />
          </div>
        );

      case 'file': 
        return (
          <FileUpload className="btn-test"
            onUploadComplete={(uploader) => {
              onChange(FileUploadHelper.getFileUrlPrefix() + '/' + uploader.fileName);
            }}
            uploadFileExtensions={['(.*)']}
          />
        );

      case "select":
        return (
          <select
            name={name}
            className="form-control"
            value={value || ""}
            placeholder={placeholder || ""}
            onChange={onChange}
            disabled={readOnly}
          >
            <option>请选择</option>
          {options.map((item, index) => {
            return <option key={index} value={item.value}>{item.label}</option>
          })}
          </select>
        );
      
      case "checkbox":
        value = Array.isArray(value) ? value : [];
        return (
          <div className={`custom-field--checkbox`}>
            {options.map((item, index) => {
              const v = item.value;
              const checked = value.indexOf(v) !== -1;
              return (
                <label key={index}>
                  <input
                    type="checkbox"
                    name={name}
                    checked={checked}
                    value={v}
                    disabled={readOnly}
                    onChange={() => {
                        const _v = value.concat();
                        if (!checked) {
                          if (_v.indexOf(v) === -1) {
                            _v.push(v);
                          }
                        } else if (_v.indexOf(v) !== -1) {
                          _v = _v.filter(item => {
                            return item !== v;
                          });
                        }
                        onChange(_v);
                      }
                    }
                  />
                  {item.label}
                </label>
              )
            })}
          </div>
        );
      
      case "radio":
        return (
          <div className={`custom-field--checkbox`}>
            {options.map((item, index) => {
              return (
                <label key={index}>
                  <input
                    type="radio"
                    name={name}
                    checked={value === item.value}
                    value={item.value}
                    disabled={readOnly}
                    onChange={onChange}
                  />
                  {item.label}
                </label>
              )
            })}
          </div>
        );

      case "phone":
        value = value || {};
        return (
          <div className="custom-field--phone">
            <FormControl
              componentClass="select"
              className="custom-field--phone--country-code"
              disabled={readOnly}
              value={value.countryCode || ""}
              onChange={(e)=>{
                onChange(Object.assign({}, value, {
                  countryCode: e.target.value
                }));
              }}
            >
            {options.map((item, index) => {
              return <option key={index} value={item.value}>{item.label}</option>
            })}
            </FormControl>
            <FormControl
              type="text"
              className="custom-field--phone--number"
              name={name}
              disabled={readOnly}
              value={value.phone || ""}
              placeholder={placeholder || ""}
              onChange={(e)=>{
                onChange(Object.assign({}, value, {
                  phone: e.target.value
                }));
              }}
              onBlur={onBlur}
            />
          </div>
        );
      
      case "city":
        value = value || {};
        return (
          <CountryPicker
            country={value['country'] || -1}
            province={value['province'] || -1}
            disabled={readOnly}
            county={value['city'] || -1}
            countryseletstyle={{display: 'block'}}
            countryseletstylefirst={{width: '77px', display: 'inline-block'}}
            callbackparent={onChange}
          />
        );

      case "date": 
        const formatStyle = "YYYY-MM-DD h:mm:ss";
        value = value ? value : undefined;
        return (
          <DatePicker
            dateFormat={formatStyle}
            selected={moment(value)}
            style={{ width: '100%' }}
            disabled={readOnly}
            showYearDropdown
            className="form-control"
            validationState={error ? "error" : ""}
            onChange={onChange}
          />
        );

      case "datestring":
        const formatStyle = "YYYY-MM-DD";
        value = value ? value : undefined;
        return (
          <DatePicker
            dateFormat={formatStyle}
            selected={moment(value)}
            style={{ width: '100%' }}
            disabled={readOnly}
            showYearDropdown
            className="form-control"
            validationState={error ? "error" : ""}
            onChange={(v)=>{
              onChange(v.format(formatStyle));
            }}
          />
        );

      default:
        return <FormControl
          type="text"
          name={name}
          disabled={readOnly}
          value={value || ""}
          placeholder={placeholder || ""}
          onChange={onChange}
          onBlur={onBlur}
        />
    }
  }
}
