import { reduxForm, Field } from 'redux-form';
import { Form, FormGroup, Col, ControlLabel } from 'react-bootstrap';
import { renderField, required } from 'utils/renderField';
import i18n from 'utils/i18n';
import cs from './Group.less';

export const GROUP_FORM = 'ACCOUNT_LIST_GROUP_FORM';
export const EMPTY_VALUE = -1;
class GroupForm extends PureComponent {
  render() {
    const {
      change,
      disabled,
      resources: { mtGroup, accountGroup },
      currentServer: { vendor },
      filteredRights
    } = this.props;
    return (
      <Form horizontal>
        {filteredRights.group ? (
          <FormGroup>
            <Col componentClass={ControlLabel} sm={4} className={cs['label']}>
              {vendor === 'CTRADER'
                ? i18n['account.cbroker.label.group']
                : i18n['account.modify_mt_group.label.mt_group']}
            </Col>
            <Field
              name="group"
              defaultSelect
              searchable
              component={renderField}
              className={cs['dropdown']}
              disabled={disabled}
              type="selectField"
              options={mtGroup}
            />
          </FormGroup>
        ) : (
          undefined
        )}
        {filteredRights.accountGroup ? (
          <FormGroup>
            <Col componentClass={ControlLabel} sm={4} className={cs['label']}>
              {i18n['account.modify_group.label.user_group']}
            </Col>
            <Field
              name="userGroup"
              searchable
              component={renderField}
              className={cs['dropdown']}
              disabled={disabled}
              type="selectField"
              defaultSelect={false}
              options={[
                {
                  label: i18n['account.modify_group.label.user_group.empty'],
                  value: EMPTY_VALUE
                },
                ...accountGroup
              ]}
            />
          </FormGroup>
        ) : (
          undefined
        )}
      </Form>
    );
  }
}

export default reduxForm({
  form: GROUP_FORM,
  onSubmitFail: errors => {
    setTimeout(() => {
      let errorDom = document
        .querySelectorAll('[class*=error]')[0]
        .querySelector('input');
      errorDom
        ? errorDom.focus()
        : document.querySelectorAll('[class*=error]')[0].focus();
    }, 0);
  }
})(GroupForm);
