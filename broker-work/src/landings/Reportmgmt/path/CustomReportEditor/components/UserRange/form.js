import { Form } from 'lean-ui';
import { renderField, required } from 'utils/v2/renderField';
import i18n from 'utils/i18n';
import { reduxForm, Field } from 'redux-form';
import cs from './form.less';
import Dropdown from 'components/v2/Dropdown';
import { post, get } from 'utils/ajax';

export const USER_RANGE_FORM = 'CUSTOM_REPORT_USER_RANGE_FORM';
const FormItem = Form.Item;
const FormLabel = Form.Label;
const currentUserShowOptions = [
  {
    label: i18n['report.custom_report.user_self_see'],
    value: 'UserMySelfVisible'
  },
  {
    label: i18n['report.custom_report.user_all_see'],
    value: 'UserAllVisible'
  },
  {
    label: i18n['report.custom_report.user_part_see'],
    value: 'UserPartVisible'
  },
  {
    label: i18n['report.custom_report.user_all_not_see'],
    value: 'UserNotVisible'
  },
  {
    label: i18n['report.custom_report.user_part_not_see'],
    value: 'UserInVisible'
  }
];
let showUserValue = [];
let notShowUserValue = [];

// 部分可见
const bwUserField = ({
  input,
  columns,
  disabled,
  className,
  colClassName,
  receiverType,
  placeholder,
  onSelect,
  meta: { touched, error }
}) => {
  if (disabled) {
    input.onChange = fn;
  }
  if (!showUserValue && input.value && !touched) {
    showUserValue = [];
  }
  return (
    <div>
      <div
        sm={columns || 4}
        className={`${colClassName || ''} ${
          touched && error ? 'has-error' : ''
        }`}
      >
        <Dropdown
          searchable
          className={className}
          value={showUserValue}
          data={showUserValue}
          placeholder={placeholder}
          pipe={searchShowInputAjax}
          handleData={handleShowUserData}
          error={touched && error}
          disabled={disabled}
          selectAllButton={receiverType === 'BwCustomer'}
          checkbox
          onSelect={d => {
            showUserValue = d;
            onSelect(input.onChange, d);
          }}
        />
        {touched && error ? (
          <div className="validate-error-msg">
            {typeof error === 'function' ? error(label) : error}
          </div>
        ) : (
          undefined
        )}
      </div>
    </div>
  );
};
// 部分不可见
const bwNotUserField = ({
  input,
  columns,
  disabled,
  className,
  colClassName,
  onSelect,
  receiverType,
  meta: { touched, error }
}) => {
  if (disabled) {
    input.onChange = fn;
  }
  if (!notShowUserValue && input.value && !touched) {
    notShowUserValue = [];
  }
  return (
    <div>
      <div
        sm={columns || 4}
        className={`${colClassName || ''} ${
          touched && error ? 'has-error' : ''
        }`}
      >
        <Dropdown
          searchable
          className={className}
          value={notShowUserValue}
          data={notShowUserValue}
          pipe={searchShowInputAjax}
          handleData={handleShowUserData}
          error={touched && error}
          disabled={disabled}
          selectAllButton={receiverType === 'BwCustomer'}
          checkbox
          onSelect={d => {
            notShowUserValue = d;
            onSelect(input.onChange, d);
          }}
        />
        {touched && error ? (
          <div className="validate-error-msg">
            {typeof error === 'function' ? error(label) : error}
          </div>
        ) : (
          undefined
        )}
      </div>
    </div>
  );
};

// 可见用户范围 即时搜索组件 ajax 函数
function searchShowInputAjax(v) {
  if (!v) {
    return Promise.resolve({
      result: true,
      data: []
    });
  }
  return post({
    url: '/v1/user/findLikeRoleLevelUser',
    data: {
      fuzzyValue: v,
      searchLevel: true,
      searchRole: true,
      searchUser: true
    }
  });
}

// 可见范围多选 即时搜索组件 ajax 数据处理
function handleShowUserData(res) {
  if (!res.result) return Promise.reject(false);
  const data = res.data.map(item => {
    let labelSub = `(${item.roleName || ''}/${item.levelName || ''})`;
    let end = {};
    if (item.idType === undefined) {
      end = {
        label: `${item.entityNo || ''} ${item.name}${
          labelSub.length > 3 ? labelSub : ''
        }`,
        value: item.id
      };
      return end;
    }
    if (item.idType) {
      const idTypeLabel =
        item.idType !== 'Id'
          ? `(${i18n[`settings.link_setting.role_label.${item.idType}`]})`
          : '';
      end = {
        label: `${item.entityNo || ''} ${item.name}${
          labelSub.length > 3 ? `${labelSub} ${idTypeLabel}` : idTypeLabel
        }`,
        value: `${item.id}-${item.idType}`
      };
      return end;
    }
  });

  return Promise.resolve(data);
}

class UserRangeForm extends PureComponent {
  state = {
    // 选择的用户显示类型
    selectedUserShowOption: ''
  };
  constructor(props) {
    super(props);
    let { initialValues = {} } = this.props;
    showUserValue = initialValues.visibleUser || [];
    notShowUserValue = initialValues.inVisibleUser || [];
  }
  changeShowUser = (onChange, item) => {
    const v = item;
    onChange(v);
  };
  changeNotShowUser = (onChange, item) => {
    const v = item;
    onChange(v);
  };
  onSelectShowType = selectedUserShowOption => {
    this.setState({
      selectedUserShowOption
    });
  };
  render() {
    const { selectedUserShowOption } = this.state;
    return (
      <Form>
        {/* 可见范围 */}
        <FormItem col={1} required>
          <FormLabel>{i18n['report.custom_report.user_can_see']}：</FormLabel>
          <Field
            name="visibleScope"
            columns={6}
            className={cs['dropdown']}
            component={renderField}
            type="selectField"
            defaultSelect={false}
            onFieldChange={this.onSelectShowType}
            placeholder={i18n['general.default.select']}
            value={
              (
                currentUserShowOptions.find(
                  item => item.value === selectedUserShowOption
                ) || {}
              ).value
            }
            options={currentUserShowOptions}
            label={i18n['settings.link_setting.is_show_bw_user']}
          />
        </FormItem>
        {/* 请设置可见范围 */}
        {selectedUserShowOption === 'UserPartVisible' && (
          <FormItem col={1} required>
            <FormLabel>
              {i18n['settings.link_setting.user_see_tips']}：
            </FormLabel>
            <Field
              name="scopeUser"
              columns={6}
              className={cs['dropdown']}
              component={bwUserField}
              onSelect={this.changeShowUser}
              placeholder={
                i18n['settings.link_setting.custom_see_tips_placeholder']
              }
              receiverType={
                selectedUserShowOption === 'UserPartVisible'
                  ? 'BwCustomer'
                  : undefined
              }
              type="selectField"
            />
          </FormItem>
        )}
        {/* 请设置不可见范围 */}
        {selectedUserShowOption === 'UserInVisible' && (
          <FormItem col={1} required>
            <FormLabel>
              {i18n['settings.link_setting.user_not_see_tips']}
            </FormLabel>
            <Field
              name="scopeUser"
              columns={6}
              className={cs['dropdown']}
              component={bwNotUserField}
              onSelect={this.changeNotShowUser}
              placeholder={i18n['general.default.select']}
              receiverType={
                selectedUserShowOption === 'UserInVisible'
                  ? 'BwCustomer'
                  : undefined
              }
              type="selectField"
            />
          </FormItem>
        )}
      </Form>
    );
  }
}

export default reduxForm({
  form: USER_RANGE_FORM,
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
})(UserRangeForm);
