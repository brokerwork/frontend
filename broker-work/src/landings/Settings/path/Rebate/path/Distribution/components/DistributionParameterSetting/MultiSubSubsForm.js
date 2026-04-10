import { reduxForm, Field, SubmissionError } from 'redux-form';
import { Form, Button } from 'react-bootstrap';
import { renderField, required } from 'utils/renderField';
import i18n from 'utils/i18n';
import cs from './DistributionParameterSetting.less';
import Tips from 'components/Tips';
import math from 'utils/math';

export const MULTI_SUB_SUBS_FORM = 'DISTRIBUTION_MULTI_SUB_SUBS_FORM';

const defaultSelect = {
  label: i18n['general.default_select'],
  value: ''
};

const lessEqualThan = number => (value, previousValue) => {
  return value === ''
    ? value
    : parseFloat(value) <= parseFloat(number) && parseFloat(value) > 0
      ? value
      : previousValue;
};

const sumbit = (multiSubsList, values) => {
  const errors = {};

  if (required(values.parentSubType)) {
    errors.parentSubType = required(values.parentSubType);
  }

  if (required(values.commissionType)) {
    errors.commissionType = required(values.commissionType);
  }

  if (
    values.commissionType != 0 &&
    values.commissionType != 4 &&
    required(values.value)
  ) {
    errors.value = required(values.value);
  }

  if (values.commissionType == 3 && values.value) {
    let total = values.value;

    multiSubsList.filter(item => item.commissionType == 3).forEach(item => {
      total = math.add(item.value, total);
    });

    if (total > 100) {
      errors.value = i18n['setting.rebate_setting.distribution.precent_error'];
    }
  }

  if (
    values.parentSubType == 0 &&
    values.levelEqualEnable == 1 &&
    required(values.levels)
  ) {
    errors.levels = required(values.levels);
  }

  if (Object.keys(errors).length) {
    throw new SubmissionError(errors);
  }

  return values;
};

class MultiSubsForm extends PureComponent {
  render() {
    const {
      handleSubmit,
      relationList,
      commissionTypeList,
      initialValues,
      multiSubsList,
      cycleLevel
    } = this.props;

    return (
      <Form
        onSubmit={handleSubmit(sumbit.bind(this, multiSubsList))}
        className={cs['logic-form']}
      >
        <span className={cs['placeholder']}>
          {i18n['settings.rebate_setting.if']}
        </span>
        <Field
          colClassName={cs['col-inline']}
          className={cs['dropdown']}
          name="parentSubType"
          autoWidth={true}
          defaultSelect={defaultSelect}
          component={renderField}
          type="selectField"
          options={relationList}
        />
        {i18n['settings.rebate_setting.then']}
        <Field
          colClassName={cs['col-inline']}
          className={cs['dropdown']}
          name="commissionType"
          autoWidth={true}
          defaultSelect={defaultSelect}
          component={renderField}
          type="selectField"
          renderMenuItem={item => {
            return (
              <div className={cs['dropdown-tips']}>
                <span>{item.label}</span>
                {item.value == '2' || item.value == '3' ? (
                  <Tips className={cs['tips']}>
                    <p className={cs['text']}>
                      {i18n['setting.rebate_setting.distribution.tips.title']}
                    </p>
                    <p className={cs['text']}>
                      {item.value == '2'
                        ? i18n[
                            'setting.rebate_setting.distribution.incremental.tips'
                          ]
                        : i18n[
                            'setting.rebate_setting.distribution.divided.tips'
                          ]}
                    </p>
                  </Tips>
                ) : (
                  undefined
                )}
              </div>
            );
          }}
          options={commissionTypeList}
        />
        {initialValues.commissionType == '1' ? (
          <span className={cs['hidden-input']}>
            <Field
              colClassName={cs['col-inline']}
              name="value"
              component={renderField}
              type="numberField"
            />
            {i18n['settings.rebate_setting.distribution.volume']}
          </span>
        ) : (
          undefined
        )}
        {initialValues.commissionType == '2' ||
        initialValues.commissionType == '3' ? (
          <span className={cs['hidden-input']}>
            <Field
              colClassName={cs['col-inline']}
              name="value"
              component={renderField}
              type="numberField"
            />
            %
          </span>
        ) : (
          undefined
        )}
        {initialValues.parentSubType === '0' ? (
          <span className={cs['hidden-input']}>
            <Field
              colClassName={cs['col-inline']}
              name="levelEqualEnable"
              component={renderField}
              type="singleCheckboxField"
            />
            {i18n['setting.rebate_setting.distribution.level_limit']}
          </span>
        ) : (
          undefined
        )}
        {initialValues.parentSubType === '0' ? (
          <span className={cs['hidden-input']}>
            <Field
              colClassName={cs['col-inline']}
              name="levels"
              component={renderField}
              type="numberField"
              normalize={lessEqualThan(cycleLevel)}
            />
            {i18n['setting.rebate_setting.distribution.level_label']}
          </span>
        ) : (
          undefined
        )}
        <Button bsStyle="primary" type="submit" className={cs['add-btn']}>
          <i className="fa fa-plus" />
          {i18n['settings.rebate_setting.add_logic']}
        </Button>
      </Form>
    );
  }
}

export default reduxForm({
  form: MULTI_SUB_SUBS_FORM,
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
})(MultiSubsForm);
