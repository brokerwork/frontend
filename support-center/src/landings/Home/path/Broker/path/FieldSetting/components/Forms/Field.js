import { reduxForm, Field, FieldArray } from 'redux-form';
import FormField from 'components/FormField';
import { required } from 'components/FormField/validate';
import Form from 'components/Form';
import {
  FIELD_COLUMN,
  FIELD_OPTIONS,
  OPTIONS_FIELD,
  SENSITIVE_FIELD_TYPE,
  overuseNoTypes,
  showCustomEditList,
  hintTypes
} from '../../constant';
import language from 'utils/language';
import Panel from 'components/Panel';
import Table from 'components/Table';
import Button from 'components/Button';
import i18n from 'utils/i18n';
import cs from './Forms.less';
import Tips from 'components/Tips';
import { relationOptions } from '../../controls/process';
import ToggleAngle from './ToggleAngle';

export const FIELD_FORM = 'BROKER_FIELD_SETTING_FIELD_FORM';

const currentLang = language.getLang();

const canRelateType = ['select', 'radio'];

class RenderOptions extends PureComponent {
  state = {
    showMore: {},
    sortLanguages: []
  };

  toggleShowMore = idx => {
    const keys = Object.keys(this.state.showMore);
    let end = {};
    keys.forEach(k => {
      end[k] = false;
    });
    this.setState({
      showMore: {
        ...end,
        [idx]: !this.state.showMore[idx]
      }
    });
  };

  parseOptions = () => {
    const { fieldOptions = [] } = this.props;

    return [
      { label: i18n['general.default_select'], value: -1 },
      ...fieldOptions.map((item, idx) => {
        return {
          label: `${i18n['general.options']} ${idx + 1}`,
          value: idx
        };
      })
    ];
  };

  renderHeader = idx => {
    const { fields, fieldInfo } = this.props;

    return (
      <div className={cs['panel-header']}>
        {`${i18n['general.options']} ${idx + 1}`}
        <div className={cs['more']}>
          <a onClick={() => fields.remove(idx)} disabled={fieldInfo.sysDefault}>
            <i className="fa fa-times close" />
          </a>
        </div>
      </div>
    );
  };
  relationOptions = () => {
    const { relationFieldList, selectedField } = this.props;
    return relationOptions(relationFieldList, selectedField);
  };
  render() {
    const { fields, canAdd, fieldInfo, relationFunc, formId, sortLanguages } = this.props;
    const { showMore } = this.state;

    return (
      <Panel header={i18n['field.setting.field.option.title']}>
        <div className={cs['actions']}>
          {canRelateType.includes(fieldInfo.fieldType) &&
          !fieldInfo.sysDefault &&
          showCustomEditList.includes(formId) ? (
            <div className={cs['actions-left']}>
              <Field
                name="relationFunc"
                label={i18n['broker.field_setting.relationFunc']}
                fieldType="checkbox"
                fieldClassName="field-inline"
                component={FormField}
              />
              <Tips align="right">{i18n['broker.field_setting.relationFunc.tip']}</Tips>
            </div>
          ) : (
            undefined
          )}
          <div className={cs['actions-right']}>
            <span className={cs['label']}>{i18n['broker.field_setting.choose.default']}：</span>
            <Field
              label={i18n['broker.field_setting.choose.default']}
              name="defaultSelect"
              fieldClassName={cs['field-setting']}
              fieldType="select"
              options={this.parseOptions()}
              right
              component={FormField}
            />
          </div>
        </div>
        {fields.map((option, idx) => {
          return (
            <Panel header={this.renderHeader(idx)} key={idx}>
              <table className={cs['option-table']}>
                <tbody>
                  {sortLanguages.slice(0, showMore[idx] ? sortLanguages.length : 1).map((lang, _idx) => {
                    return (
                      <tr key={lang.value}>
                        <td>
                          <span className="required" />
                          {i18n['broker.field_setting.options_content']}（{lang.label}）：
                        </td>
                        <td>
                          <Field
                            name={`${option}.message.${lang.value}`}
                            fieldType="text"
                            disabled={fieldInfo.sysDefault}
                            component={FormField}
                          />
                        </td>
                        <td>
                          {_idx === 0 ? (
                            <a onClick={this.toggleShowMore.bind(this, idx)}>
                              {i18n['broker.field_setting.more_language']} <ToggleAngle show={showMore[idx]} />
                            </a>
                          ) : (
                            undefined
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {relationFunc && showCustomEditList.includes(formId) ? (
                    <tr>
                      <td>{i18n['broker.field_setting.link_field']}：</td>
                      <td>
                        <Field
                          name={`${option}.relationField`}
                          fieldType="select"
                          options={this.relationOptions()}
                          component={FormField}
                        />
                      </td>
                      <td />
                    </tr>
                  ) : (
                    undefined
                  )}
                </tbody>
              </table>
            </Panel>
          );
        })}
        {canAdd && !fieldInfo.sysDefault ? (
          <div className={cs['panel-footer']}>
            <Button style="primary" onClick={() => fields.push({ isDefault: false, message: {} })}>
              <i className="fa fa-plus" />
              {i18n['field.setting.field.option.add_btn']}
            </Button>
          </div>
        ) : (
          undefined
        )}
      </Panel>
    );
  }
}

class FieldForm extends PureComponent {
  state = {
    showMore: {
      message: false,
      hint: false,
      remark: false
    },
    show: this.props.fieldInfo.placeHolderShow,
    sortLanguages: []
  };

  componentDidMount() {
    const { languages } = this.props;
    this.setState({
      sortLanguages: languages.sort((a, b) => (b.value === currentLang ? 1 : 0))
    });
  }

  toggleShowMore = key => {
    this.setState({
      showMore: {
        ...this.state.showMore,
        [key]: !this.state.showMore[key]
      }
    });
  };
  changeStyle = value => {
    this.setState({
      show: value
    });
  };
  render() {
    const {
      fieldType,
      notEnabledField,
      onSelectField,
      onOptionsDefaultCheck,
      fieldInfo,
      type,
      formId,
      fieldOptions,
      relationFunc,
      relationFieldList,
      selectedField,
      onlyLetters,
      onlyNumbers,
      onChangeField
    } = this.props;
    const { showMore, sortLanguages, show } = this.state;
    // 自定义字段
    const isCustomeKey = !fieldInfo.sysDefault && fieldInfo.userCustom;
    return (
      <div className={cs['field']}>
        <Form>
          {type === 'create' ? (
            <Form.Item>
              <Form.Label>
                <span className="required" />
                {i18n['field.setting.field.update.select']}：
              </Form.Label>
              <Form.Control>
                <Field
                  name="field"
                  label={i18n['field.setting.field.update.select']}
                  fieldType="select"
                  origin={true}
                  disabled={fieldInfo.sysDefault}
                  onFieldChange={onSelectField}
                  options={notEnabledField}
                  component={FormField}
                  validate={required}
                />
              </Form.Control>
              <Form.HelpText className={cs['help-text']} />
            </Form.Item>
          ) : (
            undefined
          )}
          <Form.Item>
            <Form.Label>
              <span className="required" />
              {i18n['field.setting.field.type']}：
            </Form.Label>
            <Form.Control>
              <Field
                name="fieldType"
                label={i18n['field.setting.field.type']}
                fieldType="select"
                disabled={true}
                options={fieldType}
                component={FormField}
                validate={required}
              />
            </Form.Control>
            <Form.HelpText className={cs['help-text']} />
          </Form.Item>
          <Form.Item>
            <Form.Label>
              <span className="required" />
              {i18n['field.setting.field.columns']}：
            </Form.Label>
            <Form.Control>
              <Field
                name="columns"
                label={i18n['field.setting.field.columns']}
                fieldType="select"
                // disabled={fieldInfo.sysDefault}//屏蔽系统字段不能设置所占列数
                options={FIELD_COLUMN}
                component={FormField}
                validate={required}
              />
            </Form.Control>
            <Form.HelpText className={cs['help-text']} />
          </Form.Item>
          {sortLanguages.slice(0, showMore.message ? sortLanguages.length : 1).map((lang, idx) => {
            console.log('aaa', lang);
            return (
              <Form.Item key={idx}>
                <Form.Label>
                  {i18n['field.setting.field.name']}（{lang.label}）：
                </Form.Label>
                <Form.Control>
                  <Field
                    name={`message.${lang.value}`}
                    fieldType="text"
                    disabled={fieldInfo.sysDefault && lang.value === 'zh-CN'}
                    component={FormField}
                  />
                </Form.Control>
                <Form.HelpText className={cs['help-text']}>
                  {idx === 0 ? (
                    <a onClick={this.toggleShowMore.bind(this, 'message')}>
                      {i18n['broker.field_setting.more_language']}
                      <ToggleAngle show={showMore.message} />
                    </a>
                  ) : (
                    undefined
                  )}
                </Form.HelpText>
              </Form.Item>
            );
          })}
          {isCustomeKey ? (
            hintTypes.includes(fieldInfo.fieldType) ? (
              sortLanguages.slice(0, showMore.hint ? sortLanguages.length : 1).map((lang, idx) => {
                return (
                  <Form.Item key={idx}>
                    <Form.Label>
                      {i18n['field.setting.field.placeholder']}（{lang.label}）：
                    </Form.Label>
                    <Form.Control>
                      <Field name={`hint.${lang.value}`} fieldType="text" component={FormField} maxLength={100} />
                    </Form.Control>
                    <Form.HelpText className={cs['help-text']}>
                      {idx === 0 ? (
                        <a onClick={this.toggleShowMore.bind(this, 'hint')}>
                          {i18n['broker.field_setting.more_language']} <ToggleAngle show={showMore.hint} />
                        </a>
                      ) : (
                        undefined
                      )}
                    </Form.HelpText>
                  </Form.Item>
                );
              })
            ) : (
              undefined
            )
          ) : (
            <Form.Item>
              <Form.Label>{i18n['field.setting.field.placeholder']}：</Form.Label>
              <Form.Control>
                <Field name="placeHolder" fieldType="text" component={FormField} />
              </Form.Control>
              <Form.HelpText className={cs['help-text']} />
            </Form.Item>
          )}
          {isCustomeKey
            ? sortLanguages.slice(0, showMore.remark ? sortLanguages.length : 1).map((lang, idx) => {
                return (
                  <Form.Item key={idx}>
                    <Form.Label>
                      {i18n['broker.field_setting.field_explain']}（{lang.label}）：
                    </Form.Label>
                    <Form.Control>
                      <Field
                        name={`remark.${lang.value}`}
                        fieldType="textarea"
                        component={FormField}
                        maxLength={2000}
                      />
                    </Form.Control>
                    <Form.HelpText className={cs['help-text']}>
                      {idx === 0 ? (
                        <a onClick={this.toggleShowMore.bind(this, 'remark')}>
                          {i18n['broker.field_setting.more_language']} <ToggleAngle show={showMore.remark} />
                        </a>
                      ) : (
                        undefined
                      )}
                    </Form.HelpText>
                  </Form.Item>
                );
              })
            : undefined}
          <Form.Item>
            <Form.Label>{i18n['field.setting.field.placeholder.style']}：</Form.Label>
            <Form.Control>
              <Field
                name="placeHolderShow"
                onFieldChange={this.changeStyle}
                fieldType="radio"
                options={[
                  { label: i18n['field.setting.field.placeholder.notShow'], value: false },
                  { label: i18n['field.setting.field.placeholder.show'], value: true }
                ]}
                component={FormField}
              />
              {show
                ? [
                    i18n['field.setting.field.placeholder.style.tip'],
                    <input style={{ margin: '0 5px' }} disabled value="12345678QIO"></input>,
                    i18n['field.setting.field.placeholder.style.tipContent']
                  ]
                : [
                    i18n['field.setting.field.placeholder.style.tip'],
                    <Tips align="top">{i18n['field.setting.field.placeholder.style.tipContent']}</Tips>,
                    <input style={{ margin: '0 5px' }} disabled value="12345678QIO"></input>
                  ]}
            </Form.Control>
            <Form.HelpText className={cs['help-text']} />
          </Form.Item>
          <Form.Item>
            <Form.Label />
            <Form.Control>
              {FIELD_OPTIONS.filter(
                option =>
                  (option.value === 'sensitive' ? !SENSITIVE_FIELD_TYPE.includes(fieldInfo.fieldType) : true) &&
                  (option.value === 'overuse' ? fieldInfo.fieldType !== 'tin' : true) &&
                  (option.value === 'addMulti'
                    ? fieldInfo.userCustom
                      ? ['tin', 'text', 'textarea'].includes(fieldInfo.fieldType)
                      : fieldInfo.fieldType === 'tin'
                    : true)
              ).map((option, idx) => {
                let disabled = false;
                if (option.default && fieldInfo.sysDefault) {
                  disabled = true;
                }
                if (fieldInfo.fieldType === 'image' && option.value === 'overuse') {
                  disabled = true;
                }
                if ((option.disabledFields[formId] || []).includes(fieldInfo.fieldId)) {
                  disabled = true;
                }
                if (
                  (relationFunc || fieldInfo.relation) &&
                  option.value === 'overuse' &&
                  overuseNoTypes.includes(fieldInfo.fieldType)
                ) {
                  disabled = true;
                }
                // 积分字段不展示”必填“和”长字段“
                if (
                  ['points1', 'points2', 'points3', 'points4', 'points5'].includes(fieldInfo.fieldId) &&
                  (option.value === 'required' || option.value === 'longField')
                ) {
                  return null;
                }
                // 只能勾选“只能输入数字”或者""只能输入字母"
                if (
                  (option.value === 'numeric' && fieldInfo['alphabet']) ||
                  (option.value === 'alphabet' && fieldInfo['numeric'])
                ) {
                  disabled = true;
                }
                if (fieldInfo.fieldType === 'image' && option.value === 'addMulti') {
                  return null;
                }
                if (
                  fieldInfo.fieldType === 'image' &&
                  option.value === 'sensitive' &&
                  !fieldInfo.sysDefault &&
                  fieldInfo.userCustom
                ) {
                  return null;
                }
                if (
                  (fieldInfo.fieldType !== 'text' &&
                    fieldInfo.fieldType !== 'textarea' &&
                    option.value === 'alphabet') ||
                  ((fieldInfo.fieldType === 'text' || fieldInfo.fieldType === 'textarea') &&
                    option.value === 'alphabet' &&
                    !onlyLetters)
                ) {
                  return null;
                }
                if (
                  (fieldInfo.fieldType !== 'text' &&
                    fieldInfo.fieldType !== 'textarea' &&
                    option.value === 'numeric') ||
                  ((fieldInfo.fieldType === 'text' || fieldInfo.fieldType === 'textarea') &&
                    option.value === 'numeric' &&
                    !onlyNumbers)
                ) {
                  return null;
                }
                return (
                  <Field
                    key={idx}
                    label={option.label}
                    name={option.value}
                    onFieldChange={onChangeField.bind(this, option.value)}
                    disabled={disabled}
                    fieldType="checkbox"
                    fieldClassName="field-inline"
                    component={FormField}
                  />
                );
              })}
            </Form.Control>
            <Form.HelpText className={cs['help-text']} />
          </Form.Item>
        </Form>
        {OPTIONS_FIELD.includes(fieldInfo.fieldType) &&
        !fieldInfo.businessSelected &&
        fieldOptions &&
        fieldOptions.length ? (
          <FieldArray
            name="options"
            component={RenderOptions}
            sortLanguages={sortLanguages}
            fieldInfo={fieldInfo}
            fieldOptions={fieldOptions}
            onOptionsDefaultCheck={onOptionsDefaultCheck}
            canAdd={fieldInfo.fieldId !== 'saleStage'}
            relationFunc={relationFunc}
            relationFieldList={relationFieldList}
            formId={formId}
            selectedField={selectedField}
          />
        ) : (
          undefined
        )}
      </div>
    );
  }
}

export default reduxForm({
  form: FIELD_FORM,
  enableReinitialize: true
})(FieldForm);
