import { Field, reduxForm } from 'redux-form';
import { Form } from 'lean-ui';
import i18n from 'utils/i18n';
import { renderField, required, isEmpty } from 'utils/v2/renderField';
import cs from './UpdateRule.less';
import NotifyTree from '../NotifyTree';
import { FormattedMessage } from 'react-intl';
import {
  NOTIFY_WAY_TASK_OPTION,
  NOTIFY_TASK_CONTENT,
  NOTIFY_RESULT_TASK_OPTION
} from '../../constant';
const ControlWrap = ({ children, error }) => (
  <Form.Control error={error}>{children}</Form.Control>
);
export const UPDATE_RULE_FORM = 'UPDATE_RULE_FORM';
const SubUsertree = ({
  placeholder,
  meta: { touched, error },
  input,
  scopes,
  data
}) => (
  <ControlWrap error={touched && error}>
    <NotifyTree
      data={data}
      onChange={input.onChange}
      selected={scopes && scopes}
    />
  </ControlWrap>
);
class UpdateRuleForm extends PureComponent {
  render() {
    const {
      initialValues,
      subUserTree,
      noticeWay,
      rightScope,
      showSubRange,
      showSubTree
    } = this.props;
    const typeList = [
      { label: i18n['settings.update_nofity.range_all'], value: 'SubAll' },
      { label: i18n['settings.update_nofity.range_part'], value: 'SubPart' }
    ];
    return (
      <div className={cs['form-body']}>
        <Form.Item required>
          <Form.Label className={cs['label']}>
            {i18n['settings.update_nofity.rule_label']}：
          </Form.Label>
          <Form.Control>
            <span className={cs['hidden-input']}>
              <FormattedMessage
                id="settings.notify_task.withdrawal"
                defaultMessage={NOTIFY_TASK_CONTENT[initialValues.type]}
                values={{
                  amount:
                    initialValues.type === 'TASK_HANDLE' ? (
                      <Field
                        label={i18n['settings.update_nofity.available_type']}
                        name="rule"
                        component={renderField}
                        type="multiSelectField"
                        options={NOTIFY_WAY_TASK_OPTION}
                        columns={4}
                        validate={required}
                        colClassName={cs['hidden-field']}
                      />
                    ) : (
                      <Field
                        name="rule"
                        component={renderField}
                        type="numberField"
                        validate={required}
                        defaultSelect={false}
                        columns={2}
                        colClassName={cs['hidden-field']}
                      />
                    ),
                  result:
                    initialValues.type === 'TASK_HANDLE' ? (
                      <Field
                        label={i18n['settings.update_nofity.available_result']}
                        name="taskHandleType"
                        component={renderField}
                        type="selectField"
                        defaultSelect="Success"
                        options={NOTIFY_RESULT_TASK_OPTION}
                        columns={4}
                        validate={required}
                        className={cs['result-field']}
                        colClassName={cs['hidden-field']}
                      />
                    ) : (
                      undefined
                    )
                }}
              />
            </span>
          </Form.Control>
        </Form.Item>
        {initialValues.type === 'TASK_HANDLE' ? (
          <div>
            <Form.Item required>
              <Form.Label className={cs['label']}>
                {i18n['settings.self_notify.depositThreshold']}：
              </Form.Label>
              <Form.Control>
                <Field
                  label={i18n['settings.update_nofity.available_role']}
                  name="depositThreshold"
                  component={renderField}
                  type="numberField"
                  step={1}
                  min={0}
                  precision={4}
                />
              </Form.Control>
            </Form.Item>
            <Form.Item required>
              <Form.Label className={cs['label']}>
                {i18n['settings.self_notify.withdrawalThreshold']}：
              </Form.Label>
              <Form.Control>
                <Field
                  label={i18n['settings.update_nofity.available_role']}
                  name="withdrawalThreshold"
                  component={renderField}
                  type="numberField"
                  step={1}
                  min={0}
                  precision={4}
                />
              </Form.Control>
            </Form.Item>
            <Form.Item required>
              <Form.Label className={cs['label']}>
                {i18n['settings.self_notify.transferThreshold']}：
              </Form.Label>
              <Form.Control>
                <Field
                  label={i18n['settings.update_nofity.available_role']}
                  name="transferThreshold"
                  component={renderField}
                  type="numberField"
                  step={1}
                  min={0}
                  precision={4}
                />
              </Form.Control>
            </Form.Item>
          </div>
        ) : (
          undefined
        )}
        <Form.Item required>
          <Form.Label className={cs['label']}>
            {i18n['settings.self_notify.data_report_customer_range']}：
          </Form.Label>
          <Form.Control>
            <Field
              label={i18n['settings.update_nofity.available_role']}
              name="scope"
              component={renderField}
              type="multiSelectField"
              columns={8}
              options={rightScope}
              validate={required}
            />
          </Form.Control>
        </Form.Item>
        {showSubRange ? (
          <Form.Item required>
            <Form.Label className={cs['label']}>
              {i18n['settings.update_nofity.sub_user_range']}：
            </Form.Label>
            <Form.Control>
              <Field
                label={i18n['settings.update_nofity.sub_user_range']}
                name="allSubUser"
                component={renderField}
                type="radioField"
                radioList={typeList}
                validate={required}
              />
            </Form.Control>
          </Form.Item>
        ) : (
          undefined
        )}
        {showSubRange && showSubTree ? (
          <Form.Item>
            <Form.Label className={cs['label']}>
              {i18n['settings.self_notify.data_report.belong_mine']}：
            </Form.Label>
            <Form.Control>
              <div className={cs['tree-field']}>
                <Field
                  label={i18n['settings.update_nofity.available_role']}
                  name="subUserScope"
                  component={SubUsertree}
                  scopes={initialValues.subUserScope}
                  data={subUserTree}
                />
              </div>
            </Form.Control>
          </Form.Item>
        ) : (
          undefined
        )}
        <Form.Item required>
          <Form.Label className={cs['label']}>
            {i18n['settings.update_nofity.notify_way']}：
          </Form.Label>
          <Form.Control>
            <Field
              name="noticeType"
              component={renderField}
              type="checkboxField"
              columns={8}
              checkboxList={noticeWay}
              validate={[required]}
              label={i18n['settings.self_notify.data_report.way_tips']}
            />
          </Form.Control>
        </Form.Item>
      </div>
    );
  }
}

export default reduxForm({
  form: UPDATE_RULE_FORM,
  enableReinitialize: true,
  onSubmitFail: errors => {
    setTimeout(() => {
      let errorDom = document
        .querySelectorAll('[class*=error]')[0]
        .querySelector('input');
      errorDom
        ? errorDom.focus()
        : document.querySelectorAll('[class*=error]')[0].focus();
    }, 0);
  },
  validate: (values = {}) => {
    const errors = {};
    if (values.type !== 'TASK_HANDLE' && required(values.rule)) {
      errors.rule = required(values.rule);
    }
    if (
      values.type === 'TASK_HANDLE' &&
      values.rule &&
      values.rule.length === 0
    ) {
      errors.rule = i18n['settings.self_notify.data_report.rule_tips'];
    }
    if (values.scope && values.scope.length === 0) {
      errors.scope = i18n['settings.self_notify.data_report.modal_range_tips'];
    }
    return errors;
  }
})(UpdateRuleForm);
