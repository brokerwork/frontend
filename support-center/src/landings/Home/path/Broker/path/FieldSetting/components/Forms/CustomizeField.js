import { reduxForm, Field, FieldArray } from 'redux-form';
import { required } from 'components/FormField/validate';
import FormField from 'components/FormField';
import Form from 'components/Form';
import Panel from 'components/Panel';
import Button from 'components/Button';
import Tips from 'components/Tips';
import i18n from 'utils/i18n';
import {
  CUSTOMIZE_FIELD_TYPE_LIST,
  FIELD_COLUMN,
  CUSTOMIZE_FIELD_OPTIONS,
  overuseNoTypes,
  showCustomEditList,
  hintTypes
} from '../../constant';
import cs from './Forms.less';
import language from 'utils/language';
import { relationOptions } from '../../controls/process';
import ToggleAngle from './ToggleAngle';

export const CUSTOMIZE_FIELD_FORM = 'BROKER_FIELD_SETTING_CUSTOMIZE_FIELD_FORM';

const currentLang = language.getLang();

class RenderOptions extends PureComponent {
  state = {
    showMore: {}
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
    const { fieldInfo } = this.props;

    return [
      { label: i18n['general.default_select'], value: -1 },
      ...fieldInfo.options.map((item, idx) => {
        return {
          label: `${i18n['general.options']} ${idx + 1}`,
          value: idx
        };
      })
    ];
  };

  renderHeader = idx => {
    const { fields } = this.props;

    return (
      <div className={cs['panel-header']}>
        {`${i18n['general.options']} ${idx + 1}`}
        {fields.length > 2 ? (
          <div className={cs['more']}>
            <a onClick={() => fields.remove(idx)}>
              <i className="fa fa-times close" />
            </a>
          </div>
        ) : (
          undefined
        )}
      </div>
    );
  };

  relationOptions = () => {
    const { fieldInfo, relationFieldList, selectedField } = this.props;
    return relationOptions(relationFieldList, selectedField).filter(item => item.fieldId !== fieldInfo.fieldId);
  };

  render() {
    const { fields, fieldInfo, formId, sortLanguages } = this.props;
    const { showMore } = this.state;
    return (
      <Panel header={i18n['field.setting.field.option.title']}>
        <div className={cs['actions']}>
          {fieldInfo.fieldType === 'checkbox' || !showCustomEditList.includes(formId) ? (
            undefined
          ) : (
            <div className={cs['actions-left']}>
              <Field
                name="relationFunc"
                label={i18n['broker.field_setting.relationFunc']}
                fieldType="checkbox"
                fieldClassName="field-inline"
                component={FormField}
              />
              <Tips align="right">{i18n['broker.field_setting.tips']}</Tips>
            </div>
          )}
          <div className={cs['actions-right']}>
            <span className={cs['label']}>{i18n['broker.field_setting.choose.default']}：</span>
            <Field
              label={i18n['broker.field_setting.choose.default']}
              name="defaultSelect"
              fieldType="select"
              fieldClassName={cs['field-setting']}
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
                          <Field name={`${option}.message.${lang.value}`} fieldType="text" component={FormField} />
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
                  {fieldInfo.relationFunc && showCustomEditList.includes(formId) ? (
                    <tr>
                      <td>{i18n['broker.field_setting.link_field']}</td>
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
        {fields.length < 100 ? (
          <div className={cs['panel-footer']}>
            <Button style="primary" onClick={() => fields.push({ isDefault: false, message: {} })}>
              {i18n['broker.field_setting.add_option']}
            </Button>
          </div>
        ) : (
          undefined
        )}
      </Panel>
    );
  }
}

class CustomizeFieldForm extends PureComponent {
  state = {
    showMore: {
      message: false,
      hint: false,
      remark: false,
      show: this.props.fieldInfo.placeHolderShow,
    },
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
    const { showMore, sortLanguages, show } = this.state;
    const { fieldInfo, relationFieldList, onFieldTypeChange, type, formId, selectedField } = this.props;
    return (
      <div className={cs['custom-field']}>
        <Form>
          <Form.Item>
            <Form.Label>
              <span className="required" />
              {i18n['field.setting.field.type']}：
            </Form.Label>
            <Form.Control>
              <Field
                disabled={type !== 'create'}
                name="fieldType"
                label={i18n['field.setting.field.type']}
                fieldType="select"
                options={CUSTOMIZE_FIELD_TYPE_LIST}
                component={FormField}
                onFieldChange={onFieldTypeChange}
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
                options={FIELD_COLUMN}
                component={FormField}
                validate={required}
              />
            </Form.Control>
            <Form.HelpText className={cs['help-text']} />
          </Form.Item>
          {sortLanguages.slice(0, showMore.message ? sortLanguages.length : 1).map((lang, idx) => {
            return (
              <Form.Item key={idx}>
                <Form.Label>
                  {i18n['field.setting.field.name']}（{lang.label}）：
                </Form.Label>
                <Form.Control>
                  <Field name={`message.${lang.value}`} fieldType="text" component={FormField} maxLength={200} />
                </Form.Control>
                <Form.HelpText className={cs['help-text']}>
                  {idx === 0 ? (
                    <a onClick={this.toggleShowMore.bind(this, 'message')}>
                      {i18n['broker.field_setting.more_language']} <ToggleAngle show={showMore.message} />
                    </a>
                  ) : (
                    undefined
                  )}
                </Form.HelpText>
              </Form.Item>
            );
          })}
          {hintTypes.includes(fieldInfo.fieldType)
            ? sortLanguages.slice(0, showMore.hint ? sortLanguages.length : 1).map((lang, idx) => {
                return (
                  <Form.Item key={idx+idx}>
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
            : undefined}
          {sortLanguages.slice(0, showMore.remark ? sortLanguages.length : 1).map((lang, idx) => {
            return (
              <Form.Item key={idx+idx+idx}>
                <Form.Label>
                  {i18n['broker.field_setting.field_explain']}（{lang.label}）：
                </Form.Label>
                <Form.Control>
                  <Field name={`remark.${lang.value}`} fieldType="textarea" component={FormField} maxLength={2000} />
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
          })}
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
              {CUSTOMIZE_FIELD_OPTIONS.filter(item => !item.disabledFieldTypes.includes(fieldInfo.fieldType)).map(
                (option, idx) => {
                  let disabled = false;
                  if (
                    (fieldInfo.relationFunc || fieldInfo.relation) &&
                    option.value === 'overuse' &&
                    overuseNoTypes.includes(fieldInfo.fieldType)
                  ) {
                    disabled = true;
                  }
                  if (fieldInfo.fieldType === 'image' && option.value === 'overuse') {
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
                  if (fieldInfo.fieldType === 'image' && type === 'create' && option.value === 'sensitive') {
                    return null;
                  }
                  return (
                    <Field
                      key={idx}
                      label={option.label}
                      name={option.value}
                      fieldType="checkbox"
                      fieldClassName="field-inline"
                      component={FormField}
                      disabled={disabled}
                    />
                  );
                }
              )}
            </Form.Control>
            <Form.HelpText className={cs['help-text']} />
          </Form.Item>
        </Form>
        {fieldInfo.options && fieldInfo.options.length ? (
          <FieldArray
            name="options"
            sortLanguages={sortLanguages}
            component={RenderOptions}
            relationFieldList={relationFieldList}
            fieldInfo={fieldInfo}
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
  form: CUSTOMIZE_FIELD_FORM,
  enableReinitialize: true
})(CustomizeFieldForm);
