import { Field, FieldArray } from 'redux-form';
import FieldSet from './FieldSet';
import validateFunction from './validate';
import cs from './CustomField.less';
import { getArrayFieldDefaultValue, isArrayField } from './utils';
import i18n from 'utils/i18n';
import { MULTI_FIELD_MAX_COUNT } from './contants';
import { Form, Button } from 'lean-ui';

/**
 * @fieldGenerator {key: 'originalFieldKey', factory: ()=>YourComponent}
 * 再不破坏原有代码的基础上，允许传入一个配置对象，当配置的字段 == key 的时候，使用factory函数构建出特定的Field控件。
 */

class CustomField extends PureComponent {
  render() {
    const {
      fields,
      disabled,
      children,
      setDefaultValue = false,
      fieldGenerator = { key: null, factory: null },
      size,
      newFormField,
      verticalForm,
      pure,
      onFocus,
      forceOneRow
    } = this.props;
    console.log('a1111', this.props);
    return (
      <Form
        size={size}
        className={`${newFormField ? cs['new-form-field'] : ''} 
        ${pure ? cs['pure'] : ''} ${disabled ? cs['disabled'] : ''} 
        ${verticalForm ? cs['vertical-form'] : ''}`}
      >
        {children}
        {fields.map((item, index) => {
          const itemClassName =
            item.fieldType === 'singleCheckbox' ? cs['same-row'] : '';
          if (item.component) {
            return (
              <Form.Item
                col={item.longField ? 1 : 2 / item.columns}
                key={index}
                required={item.validateType.required}
                className={itemClassName}
              >
                <Form.Label tips={item.remark} title={item.label}>
                  {`${item.label}${newFormField ? '' : ': '}`}
                  {/* {item.fieldType === 'image' && (
                    <span>（{i18n['upload.bw.support.tip']}）</span>
                  )} */}
                </Form.Label>
                <Form.Control>
                  <Field
                    fieldConfig={item}
                    disabled={item.readonly || disabled}
                    name={item.key}
                    setDefaultValue={setDefaultValue}
                    fieldGenerator={item.component}
                    component={FieldSet}
                    onChange={item.onChange}
                    onFocus={onFocus}
                  />
                </Form.Control>
              </Form.Item>
            );
          } else if (isArrayField(item)) {
            return (
              <FieldArray
                name={item.key}
                component={ArrayFields}
                className={itemClassName}
                key={index}
                field={item}
                setDefaultValue={setDefaultValue}
                disabled={disabled}
                // fieldGenerator={fieldGenerator}
                newFormField={newFormField}
                onFocus={onFocus}
              />
            );
          } else {
            return (
              <Item
                className={itemClassName}
                key={index}
                field={item}
                setDefaultValue={setDefaultValue}
                disabled={disabled}
                fieldGenerator={fieldGenerator}
                newFormField={newFormField}
                onFocus={onFocus}
                forceOneRow={forceOneRow}
              />
            );
          }
        })}
      </Form>
    );
  }
}

const Item = ({
  field,
  disabled,
  fieldGenerator,
  setDefaultValue,
  newFormField,
  className,
  onFocus,
  forceOneRow
}) => {
  return (
    <Form.Item
      col={field.longField || forceOneRow ? 1 : 2 / field.columns}
      className={className}
      required={field.validateType.required}
    >
      <Form.Label tips={field.remark} title={field.label}>
        {`${field.label}${newFormField ? '' : ': '}`}
        {field.fieldType === 'image' && (
          <span>（{i18n['upload.bw.support.tip']}）</span>
        )}
        {field.tip}
      </Form.Label>
      <Form.Control>
        <Field
          fieldConfig={field}
          disabled={field.readonly || disabled}
          name={field.key}
          setDefaultValue={setDefaultValue}
          fieldGenerator={fieldGenerator}
          component={FieldSet}
          onChange={field.onChange}
          onFocus={onFocus}
          validate={field.validate}
        />
      </Form.Control>
    </Form.Item>
  );
};

class ArrayFields extends PureComponent {
  componentDidMount() {
    const { fields, field } = this.props;
    if (!fields.length) {
      const defaultValue = getArrayFieldDefaultValue(field);
      fields.push(defaultValue);
    }
  }
  componentWillReceiveProps(nextProps) {
    const { fields, field } = nextProps;
    if (!fields.length) {
      const defaultValue = getArrayFieldDefaultValue(field);
      fields.push(defaultValue);
    }
  }
  render() {
    const {
      fields,
      field,
      disabled,
      fieldGenerator,
      setDefaultValue,
      newFormField,
      className,
      onFocus
    } = this.props;
    return (
      <Form.Item
        col={field.longField ? 1 : 2 / field.columns}
        className={className}
        required={field.validateType.required}
      >
        <Form.Label tips={field.remark} title={field.label}>
          {`${field.label}${newFormField ? '' : ': '}`}
          {/* {item.fieldType === 'image' && (
            <span>（{i18n['upload.bw.support.tip']}）</span>
          )} */}
          {field.tip}
        </Form.Label>
        <Form.Control>
          {fields.map((name, index, fields) => {
            return (
              <div className={cs['arrow-row']} key={index}>
                <div className={cs['array-row-field']}>
                  <Field
                    fieldConfig={field}
                    disabled={field.readonly || disabled}
                    name={name}
                    setDefaultValue={setDefaultValue}
                    fieldGenerator={fieldGenerator}
                    component={FieldSet}
                    onFocus={onFocus}
                  />
                </div>
                {!disabled && !field.readonly && fields.length > 1 ? (
                  <button
                    type="button"
                    className={cs['array-remove-btn']}
                    onClick={() => fields.remove(index)}
                  >
                    <span className="fa fa-minus-circle" />
                  </button>
                ) : (
                  undefined
                )}
              </div>
            );
          })}
          {!disabled &&
          !field.readonly &&
          field.addMulti &&
          fields.length < MULTI_FIELD_MAX_COUNT ? (
            <Button
              type="primary"
              className={`${
                cs['array-new-btn']
              } main-color main-color-border main-color-bg-hover main-color-bg-active`}
              onClick={() => fields.push(getArrayFieldDefaultValue(field))}
            >
              <i className="fa fa-plus" /> {i18n['general.add']}
            </Button>
          ) : (
            undefined
          )}
        </Form.Control>
      </Form.Item>
    );
  }
}

export const validate = validateFunction;

export default CustomField;
