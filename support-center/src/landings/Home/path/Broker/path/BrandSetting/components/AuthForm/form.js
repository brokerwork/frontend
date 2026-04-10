import { Field } from 'redux-form';
import Form from 'components/Form';
import i18n from 'utils/i18n';
import { default as FormField } from 'components/FormField';
import { required } from 'components/FormField/validate';
import cs from './index.less';
// const roleList = [{ value: 'tst', label: 'admin' }, { value: 'tstss', label: 'admin22' }];
export default class AuthForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  configRoleList = roleList => {
    return (
      roleList &&
      roleList.length &&
      roleList.map(item => {
        return {
          value: item.id,
          label: item.name
        };
      })
    );
  };
  render() {
    const { formValues, roleList, roleTypeOptions } = this.props;
    if (!formValues) return null;
    const roleOptions = this.configRoleList(roleList);
    return (
      <div>
        <Form>
          <Form.Item>
            <Form.Label>
              <span className="required" />
              {i18n['broker.brand_setting.custom_nav.role.label']}：
            </Form.Label>
            <Form.Control>
              <Field name="roleType" fieldType="radio" component={FormField} options={roleTypeOptions} />
              {formValues.roleType === 'part' && (
                <div className={cs.margin_top}>
                  <Field
                    label={i18n['broker.brand_setting.custom_nav.role.placeholder']}
                    name="roleRight"
                    fieldType="searchSelect"
                    component={FormField}
                    options={roleOptions}
                    multiple
                    // validate={currencyValidate}
                    // onSearchChange={this.onSearchPCChange}
                    // onFieldChange={this.onPCChange}
                  />
                </div>
              )}
            </Form.Control>
          </Form.Item>
        </Form>
      </div>
    );
  }
}
