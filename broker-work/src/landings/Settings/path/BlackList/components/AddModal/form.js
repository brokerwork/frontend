import { reduxForm, Field, SubmissionError, getFormValues } from 'redux-form';
import { required, renderField, maxLength } from 'utils/v2/renderField';
import { Form, Button } from 'lean-ui';
import i18n from 'utils/i18n';
import MngUser from './MngUser';
import cs from './style.less';
import { connect } from 'react-redux';
export const BLACK_LIST_ADD_FORM = 'BLACK_LIST_ADD_FORM';

const FormItem = Form.Item;
const FormLabel = Form.Label;
const FormControl = Form.Control;
const typeList = [
  { label: i18n['settings.black_list.isTaUser.true'], value: true },
  { label: i18n['settings.black_list.isTaUser.false'], value: false }
];
const reasonsList = [
  {
    label: i18n['settings.black_list.reasons.UNFAIR_PROFIT'],
    value: 'UNFAIR_PROFIT'
  },
  {
    label: i18n['settings.black_list.reasons.VICIOUS_APPEAL'],
    value: 'VICIOUS_APPEAL'
  },
  { label: i18n['settings.black_list.reasons.OTHER'], value: 'OTHER' }
];
const restrictionsList = [
  {
    label: (
      <span>
        {i18n['settings.black_list.restrictions.LOGIN']}
        <span className={cs.wrp}>
          {i18n['settings.black_list.restrictions.LOGIN.warn']}
        </span>
      </span>
    ),
    value: 'LOGIN'
  },
  {
    label: (
      <span>
        {i18n['settings.black_list.restrictions.TRADE']}
        <span className={cs.wrp}>
          {i18n['settings.black_list.restrictions.TRADE.warn']}
        </span>
      </span>
    ),
    value: 'TRADE'
  },
  {
    label: (
      <span>
        {i18n['settings.black_list.restrictions.REGISTER']}
        <span className={cs.wrp}>
          {i18n['settings.black_list.restrictions.REGISTER.warn']}
        </span>
      </span>
    ),
    value: 'REGISTER'
  }
];

class AddFrom extends PureComponent {
  onTypeChange = isTaUser => {
    const { change } = this.props;
    change('restrictions', []);
    change('reasons', []);
  };
  mngUserGen = ({ meta: { touched, error }, input, disabled }) => {
    const haveErr = touched && error;
    return (
      <Form.Control error={haveErr}>
        <MngUser
          searchPlaceHolder={i18n['settings.black_list.search.placeholder']}
          {...input}
        />
        {haveErr ? (
          <div style={{ color: '#df3031' }} className="validate-error-msg">
            {error}
          </div>
        ) : null}
      </Form.Control>
    );
  };
  render() {
    const { onSubmit, formVals, idTypes, errors, isEdit, addFromValues = {} } = this.props;
    const { isTaUser = true } = addFromValues;
    return (
      <Form>
        {!isEdit ? (
          <FormItem required col="1">
            <FormLabel>{i18n['settings.black_list.isTaUser']}</FormLabel>
            <FormControl>
              <Field
                name="isTaUser"
                component={renderField}
                type="radioField"
                radioList={typeList}
                onFieldChange={this.onTypeChange.bind(this)}
              />
            </FormControl>
          </FormItem>
        ) : null}
        {!isEdit ? (
          isTaUser ? (
            <FormItem required col="1">
              <FormLabel>{i18n['settings.black_list.isTaUser']}</FormLabel>
              <FormControl>
                <Field
                  name="pubUserId"
                  component={this.mngUserGen}
                  type="input"
                />
              </FormControl>
            </FormItem>
          ) : (
            <FormItem required col="1">
              <FormLabel>{i18n['settings.black_list.user_info']}</FormLabel>
              <FormControl>
                <div className={cs['add-form-item']}>
                  <label>{i18n['settings.black_list.user_info.phone']}</label>
                  <Field
                    name="phone"
                    component={renderField}
                    type="phoneField"
                  />
                </div>
                <div className={cs['add-form-item']}>
                  <label>{i18n['settings.black_list.user_info.email']}</label>
                  <Field
                    name="email"
                    component={renderField}
                    type="textField"
                  />
                </div>
                <div className={cs['add-form-item']}>
                  <label>{i18n['settings.black_list.user_info.id']}</label>
                  <div className={cs['add-form-item-half']}>
                    <Field
                      colClassName={cs['id-type']}
                      name="idType"
                      component={renderField}
                      type="selectField"
                      options={idTypes}
                    />
                    <Field
                      colClassName={cs['id-num']}
                      name="idNum"
                      component={renderField}
                      type="textField"
                    />
                  </div>
                </div>
                <div className={cs['add-form-item']}>
                  <label>
                    {i18n['settings.black_list.user_info.realname']}
                  </label>
                  <Field
                    name="realname"
                    component={renderField}
                    type="textField"
                  />
                </div>
              </FormControl>
            </FormItem>
          )
        ) : null}
        <FormItem required col="1">
          <FormLabel>{i18n['settings.black_list.reasons']}</FormLabel>
          <FormControl>
            <Field
              name="reasons"
              component={renderField}
              type="checkboxField"
              checkboxList={reasonsList}
            />
          </FormControl>
        </FormItem>
        <FormItem required col="1">
          <FormLabel>{i18n['settings.black_list.restrictions']}</FormLabel>
          <FormControl className={cs['restric-list']}>
            <Field
              name="restrictions"
              component={renderField}
              type="checkboxField"
              checkboxList={
                isTaUser
                  ? restrictionsList
                  : [
                      {
                        label: (
                          <span>
                            {i18n['settings.black_list.restrictions.REGISTER']}
                            <span className={cs.wrp}>
                              {
                                i18n[
                                  'settings.black_list.restrictions.REGISTER.warn'
                                ]
                              }
                            </span>
                          </span>
                        ),
                        value: 'REGISTER'
                      }
                    ]
              }
            />
          </FormControl>
        </FormItem>
      </Form>
    );
  }
}

export default connect(state => ({
  addFromValues: getFormValues(BLACK_LIST_ADD_FORM)(state)
}))(
  reduxForm({
    form: BLACK_LIST_ADD_FORM
  })(AddFrom)
);
