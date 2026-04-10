import { reduxForm, Field } from 'redux-form';
import { renderField, required } from 'utils/v2/renderField';
import i18n from 'utils/i18n';
import { post, get } from 'utils/ajax';
import cs from './CreateLinkModal.less';
import Dropdown from 'components/v2/Dropdown';
import UserSelector from 'components/v2/UserSelector';
import { Form, Tooltip, Icon, Picklist } from 'lean-ui';
import {
  // 其他推广类型的显示类型
  BW_USER_SHOWOPTIONS,
  // 直客推直客的显示类型
  BW_DIRECT_USER_SHOW_OPTIONS,
  // 直客推直客的归属类型选择
  CUSTOMER_BELONGS_TYPES
} from '../../constant';
const FormItem = Form.Item;
const FormLabel = Form.Label;

export const WEB_FORM = 'LINK_SETTING_WEB_FORM';
let customerValue = null;
let showUserValue = [];
let notShowUserValue = [];

const spreadTypeOptions = [
  {
    label: i18n['settings.link_setting.straight_guest'],
    value: 'StraightGuest'
  },
  { label: i18n['settings.link_setting.agent'], value: 'Agent' },
  {
    label: i18n['settings.link_setting.direct_recommend'],
    value: 'DirectRecommendation'
  }
];

const searchCheckField = ({
  input,
  columns,
  disabled,
  className,
  colClassName,
  onSelect,
  defaultValue,
  tipsContent,
  tipsContentClass,
  receiverType,
  meta: { touched, error }
}) => {
  if (disabled) {
    input.onChange = fn;
  }
  if (!customerValue && input.value && !touched) {
    customerValue = defaultValue;
  }
  const isError = touched && error;
  return (
    <div>
      <div
        sm={columns || 4}
        className={`${colClassName || ''} ${isError ? 'has-error' : ''}`}
      >
        <Dropdown
          searchable={true}
          className={className}
          value={customerValue}
          pipe={value => searchUserInputAjax(value, receiverType)}
          handleData={handleUserData}
          error={isError}
          disabled={disabled}
          onSelect={d => {
            customerValue = d;
            onSelect(input.onChange, d.value, d);
          }}
        />
        {isError && (
          <div className="validate-error-msg">
            {typeof error === 'function' ? error(label) : error}
          </div>
        )}
      </div>
      {!!tipsContent && <div className={tipsContentClass}>{tipsContent}</div>}
    </div>
  );
};

// 默认归属 即时搜索组件 ajax 函数
function searchUserInputAjax(v, receiverType = 'BwUser') {
  if (!v) {
    return Promise.resolve({
      result: true,
      data: []
    });
  }
  return post({
    url: '/v1/message/msgReceiversQuery',
    data: {
      receiverType,
      fuzzyVal: v,
      type: 'WEB'
    }
  });
}

// user 即时搜索组件 ajax 数据处理
function handleUserData(res) {
  if (!res.result) return Promise.reject(false);
  let end = [];
  end = res.data.map(item => {
    const levelName =
      !!item.levelName && item.levelName.length > 0 ? `/${item.levelName}` : '';
    const labelSub = `${item.roleName || ''}${levelName || ''}`;
    const label =
      item.idType !== 'RoleId'
        ? `${item.entityNo || ''} ${item.name}${
            labelSub ? '(' + labelSub + ')' : ''
          }`
        : item.name;
    return {
      label: label,
      value: item.id,
      type: item.idType,
      isGroup: item.idType === 'RoleId',
      color: item.idType === 'RoleId'
    };
  });

  return Promise.resolve(end);
}

// 直客推荐直客链接 即时搜索组件 ajax 函数
function searchDirectUserInputAjax(v) {
  if (!v) {
    return Promise.resolve({
      result: true,
      data: []
    });
  }
  return get({
    url: '/v2/custom/profiles/findByName',
    data: {
      name: v
    }
  });
}
// 直客推荐直客链接 即时搜索组件 ajax 数据处理
function handleShowDirectUserData(res) {
  if (!res.result) return Promise.reject(false);
  let end = [];
  end = res.data.map(item => {
    return {
      label: `${item.entityNo || ''} ${item.label}`,
      value: item.value
    };
  });
  return Promise.resolve(end);
}

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
  meta: { touched, error },
  isDirectRecommendation
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
          pipe={value =>
            isDirectRecommendation
              ? searchDirectUserInputAjax(value)
              : searchShowInputAjax(value)
          }
          handleData={res =>
            isDirectRecommendation
              ? handleShowDirectUserData(res)
              : handleShowUserData(res)
          }
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
  meta: { touched, error },
  isDirectRecommendation
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
          pipe={value =>
            isDirectRecommendation
              ? searchDirectUserInputAjax(value)
              : searchShowInputAjax(value)
          }
          handleData={res =>
            isDirectRecommendation
              ? handleShowDirectUserData(res)
              : handleShowUserData(res)
          }
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

// 非直客推荐直客，可见范围多选 即时搜索组件 ajax 数据处理
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

class WebForm extends PureComponent {
  state = {
    showExtraInfo:
      this.props.type === 'Edit' && this.props.initialValues.serverId,
    // 选择的用户显示类型
    selectedUserShowOption: '',
    // 默认的链接类型
    linkType: spreadTypeOptions[0].value,
    // 归属类型
    ownerType: null
  };

  constructor(props) {
    super(props);
    let { initialValues, serverList, type, selectedOwner } = this.props;
    customerValue = selectedOwner;
    showUserValue = initialValues.visibleUser || [];
    notShowUserValue = initialValues.inVisibleUser || [];
    initialValues.serverId =
      type === 'Edit' && initialValues.serverId
        ? serverList.find(ob => ob.serverId === initialValues['serverId'])
            .serverId
        : null;
    initialValues.type = type === 'Add' ? 'StraightGuest' : initialValues.type;
    // 如果是创建链接，则置空此字段，避免提交时提示没填写
    initialValues.bwUserShow = type === 'Add' ? '' : initialValues.bwUserShow;
    if (type == 'Edit') {
      // 初始化编辑的归属类型显示
      // this.state.ownerType = initialValues.ownerType = props.selectedOwnerType;
      this.state.ownerType = initialValues.ownerType =
        initialValues.type === 'DirectRecommendation' &&
        !CUSTOMER_BELONGS_TYPES.some(
          type => type.value === initialValues.ownerType
        )
          ? 'OtherOwner'
          : initialValues.ownerType;
      if (
        initialValues.bwUserShow === 'UserAllVisible' ||
        initialValues.bwUserShow === 'UserNotVisible' ||
        initialValues.bwUserShow === 'DirectNotVisible' ||
        initialValues.bwUserShow === 'DirectAllVisible'
      ) {
        delete initialValues.visibleUser;
        delete initialValues.inVisibleUser;
      }
      // 账户组初始化时转为number，编辑时回显
      initialValues.accountGroup =
        initialValues.accountGroup && Number(initialValues.accountGroup);
      // 杠杆初始化时转为string，编辑时回显
      initialValues.leverage =
        initialValues.leverage && initialValues.leverage.toString();
    }
    // 初始化选中的可见范围
    this.state.selectedUserShowOption = initialValues.bwUserShow;
    // 初始化链接类型
    this.state.linkType = initialValues.type;

    const serverListOptions = serverList.map(item => ({
      label: item.desc,
      value: item.serverId
    }));

    this.state.serverListOptions = serverListOptions;
  }

  onSelectLinkOwnerType = ownerType => {
    const {
      changeSelectedOwnerType,
      changeSelectedOwner,
      changeFormField
    } = this.props;
    this.setState({
      ownerType
    });
    changeSelectedOwnerType(ownerType);
    if (ownerType !== 'OtherOwner') {
      changeFormField(WEB_FORM, 'ownerId', '');
      changeSelectedOwner(null);
    }
  };

  onSelectShowType = selectedUserShowOption => {
    this.setState({
      selectedUserShowOption
    });
  };

  changeSearchUser = (onChange, e, item) => {
    const v = e;
    const { changeSelectedOwner } = this.props;
    onChange(v);
    changeSelectedOwner(item);
  };

  changeShowUser = (onChange, item) => {
    const { changeVisibleUser } = this.props;
    const v = item;
    onChange(v);
    changeVisibleUser(item, true);
  };
  changeNotShowUser = (onChange, item) => {
    const { changeVisibleUser } = this.props;
    const v = item;
    onChange(v);
    changeVisibleUser(item, false);
  };

  showExtraInfo = () => {
    this.setState({
      showExtraInfo: !this.state.showExtraInfo
    });
  };

  onSelectLinkType = linkType => {
    const { changeFormField } = this.props;
    const { linkType: prevLinkType } = this.state;
    // 当type类型变化会导致选项类型变化时，置空可见范围字段
    if (prevLinkType !== linkType) {
      if (
        (prevLinkType === 'DirectRecommendation' &&
          linkType !== 'DirectRecommendation') ||
        (prevLinkType !== 'DirectRecommendation' &&
          linkType === 'DirectRecommendation')
      ) {
        changeFormField(WEB_FORM, 'bwUserShow', ''); //坑 把null改成''才行
        changeFormField(WEB_FORM, 'ownerId', '');
        customerValue = null;
      }
    }
    this.setState({
      linkType
    });
  };

  render() {
    let {
      serverList,
      mtGroupList,
      typeList,
      initialValues,
      leverageList,
      userGroupList,
      type,
      brandInfo
    } = this.props;
    const {
      showExtraInfo,
      linkType,
      ownerType,
      selectedUserShowOption,
      serverListOptions
    } = this.state;
    const isDirectRecommendation = linkType === 'DirectRecommendation';
    const isAgent = linkType === 'Agent';
    const isStraightGuest = linkType === 'StraightGuest';
    const currentUserShowOptions = isDirectRecommendation
      ? BW_DIRECT_USER_SHOW_OPTIONS
      : BW_USER_SHOWOPTIONS;
    const disabled = type === 'Edit';
    initialValues.cyr = initialValues.cyr || initialValues.participants;
    return (
      <Form className={cs.form}>
        {brandInfo.tenantId === 'T000004' && (
          <FormItem col={1}>
            <FormLabel>iid：</FormLabel>
            <Field
              name="entityNo"
              columns={6}
              component={renderField}
              type="textField"
              disabled={disabled}
              tipsContent={i18n['settings.link_setting.pm_special_feat']}
            />
          </FormItem>
        )}
        {/* 推广类型 */}
        <FormItem col={2} required>
          <FormLabel>{i18n['settings.link_setting.customer_type']}：</FormLabel>
          <Field
            name="type"
            columns={6}
            className={cs['dropdown']}
            component={renderField}
            onFieldChange={this.onSelectLinkType}
            type="selectField"
            defaultSelect={false}
            disabled={disabled}
            options={spreadTypeOptions}
          />
        </FormItem>
        {/* 推广名称 */}
        <FormItem col={2} required>
          <FormLabel>{i18n['settings.link_setting.link_name_label']}</FormLabel>
          <Field
            name="name"
            columns={6}
            component={renderField}
            type="textField"
            disabled={disabled}
            label={i18n['settings.link_setting.link_name']}
            tipsContent={i18n['settings.link_setting.link_name_web_tips']}
          />
        </FormItem>
        {/* 目标链接 */}
        {initialValues.type !== 'Agent' && (
          <FormItem col={2} required>
            <FormLabel>
              {i18n['settings.link_setting.target_url_label']}
            </FormLabel>
            <Field
              name="url"
              columns={6}
              disabled={disabled}
              component={renderField}
              type="textField"
              label={i18n['settings.link_setting.target_url']}
              tipsContent={i18n['settings.link_setting.target_url_tips']}
            />
          </FormItem>
        )}
        {/* 可见范围 */}
        <FormItem col={2} required>
          <FormLabel>{i18n['settings.link_setting.user_can_see']}：</FormLabel>
          <Field
            name="bwUserShow"
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
        {/* 请设置可见范围(直客推荐直客) */}
        {(initialValues.bwUserShow === 'UserPartVisible' ||
          initialValues.bwUserShow === 'DirectPartVisible') && (
          <FormItem col={2} required={isDirectRecommendation}>
            <FormLabel>
              {i18n['settings.link_setting.user_see_tips']}：
            </FormLabel>
            <Field
              name="visibleUser"
              columns={6}
              className={cs['dropdown']}
              component={bwUserField}
              onSelect={this.changeShowUser}
              placeholder={
                i18n['settings.link_setting.user_see_tips_placeholder']
              }
              receiverType={
                initialValues.bwUserShow === 'UserPartVisible' ||
                initialValues.bwUserShow === 'DirectPartVisible'
                  ? 'BwCustomer'
                  : undefined
              }
              type="selectField"
              isDirectRecommendation={isDirectRecommendation}
            />
          </FormItem>
        )}
        {/* 请设置不可见范围(直客推荐直客) */}
        {(initialValues.bwUserShow === 'UserInVisible' ||
          initialValues.bwUserShow === 'DirectPartInvisible') && (
          <FormItem col={2} required>
            <FormLabel>
              {i18n['settings.link_setting.user_not_see_tips']}
            </FormLabel>
            <Field
              name="inVisibleUser"
              columns={6}
              className={cs['dropdown']}
              component={bwNotUserField}
              onSelect={this.changeNotShowUser}
              placeholder={i18n['general.default.select']}
              receiverType={
                initialValues.bwUserShow === 'UserInVisible' ||
                initialValues.bwUserShow === 'DirectPartInvisible'
                  ? 'BwCustomer'
                  : undefined
              }
              type="selectField"
              isDirectRecommendation={isDirectRecommendation}
            />
          </FormItem>
        )}
        {/* 备用客户归属/备用上级用户/默认客户归属 */}
        <FormItem col={2} required={isDirectRecommendation}>
          <FormLabel>
            {isDirectRecommendation
              ? i18n['settings.link_setting.default_customer_belong_label']
              : isStraightGuest
                ? i18n['settings.link_setting.backup_customer_belong_label']
                : i18n['settings.link_setting.backup_superior_belong_label']}
            <Tooltip
              trigger="click"
              placement="top"
              overlayClassName={cs.overlayLimit}
              title={
                isDirectRecommendation
                  ? i18n['settings.link_setting.directCustomerBelong_tips']
                  : i18n['settings.link_setting.customerBelong_tips']
              }
            >
              <Icon icon="question" className={cs.icon} />
            </Tooltip>
          </FormLabel>
          {isDirectRecommendation ? (
            <div className={cs['controlRelative']}>
              <Field
                name="ownerType"
                columns={6}
                className={cs['dropdown']}
                component={renderField}
                type="selectField"
                defaultSelect={false}
                placeholder={i18n['general.default.select']}
                onFieldChange={this.onSelectLinkOwnerType}
                value={ownerType}
                options={CUSTOMER_BELONGS_TYPES}
                label={
                  i18n['settings.link_setting.default_customer_belong_label']
                }
                // tipsContentClass={`${cs['customer-right-side-tip']} main-color`}
                // tipsContent={
                //   <Tooltip
                //     trigger="click"
                //     placement="top"
                //     title={
                //       i18n['settings.link_setting.directCustomerBelong_tips']
                //     }
                //   >
                //     <Icon icon="question" />
                //   </Tooltip>
                // }
              />
            </div>
          ) : (
            <div className={cs['controlRelative']}>
              <Field
                name="ownerId"
                columns={6}
                className={cs['dropdown']}
                component={searchCheckField}
                onSelect={this.changeSearchUser}
                type="selectField"
                label={i18n['settings.link_setting.is_show_bw_user']}
                placeholder={i18n['general.default.select']}
                // tipsContentClass={`${cs['customer-right-side-tip']} main-color`}
                // tipsContent={
                //   <Tooltip
                //     trigger="click"
                //     placement="top"
                //     title={i18n['settings.link_setting.customerBelong_tips']}
                //   >
                //     <Icon icon="question" />
                //   </Tooltip>
                // }
              />
            </div>
          )}
        </FormItem>
        {/* 仅在「直客推直客」和「其他归属」的类型时，可搜索选择归属人或归属用户组 */}
        {isDirectRecommendation &&
          ownerType === 'OtherOwner' && (
            <FormItem col={2}>
              <FormLabel className={cs.hidden_label}>label</FormLabel>
              <Field
                name="ownerId"
                columns={6}
                className={cs['dropdown']}
                component={searchCheckField}
                onSelect={this.changeSearchUser}
                placeholder={i18n['general.default.select']}
                type="selectField"
                label={
                  i18n['settings.link_setting.default_customer_belong_label']
                }
              />
            </FormItem>
          )}
        {/* 设置账户信息 */}
        {/* {showExtraInfo ? (
          undefined
        ) : initialValues.type === 'Agent' ? (
          undefined
        ) : (
          <div className={cs['showExtraInfo']}>
            <a onClick={this.showExtraInfo}>
              {i18n['settings.link_setting.set_info']}
            </a>
          </div>
        )} */}
        {initialValues.type !== 'Agent'
          ? [
              <FormItem col={2}>
                <FormLabel>
                  {i18n['settings.link_setting.server_label']}
                </FormLabel>
                <Field
                  name="serverId"
                  columns={6}
                  className={cs['dropdown']}
                  component={renderField}
                  type="selectField"
                  placeholder={i18n['general.default.select']}
                  options={serverListOptions}
                />
              </FormItem>,
              <FormItem col={2}>
                <FormLabel>
                  {i18n['settings.link_setting.mt_group_label']}
                </FormLabel>
                <Field
                  name="mtGroup"
                  columns={6}
                  className={cs['dropdown']}
                  component={renderField}
                  type="selectField"
                  searchable={true}
                  placeholder={i18n['general.default.select']}
                  options={mtGroupList}
                />
              </FormItem>,
              <FormItem col={2}>
                <FormLabel>
                  {i18n['settings.link_setting.account_group']}：
                </FormLabel>
                <Field
                  name="accountGroup"
                  columns={6}
                  className={cs['dropdown']}
                  component={renderField}
                  type="selectField"
                  searchable={true}
                  placeholder={i18n['general.default.select']}
                  options={userGroupList}
                />
              </FormItem>,
              <FormItem col={2}>
                <FormLabel>{i18n['settings.link_setting.leverge']}：</FormLabel>
                <Field
                  name="leverage"
                  columns={6}
                  className={cs['dropdown']}
                  component={renderField}
                  type="selectField"
                  placeholder={i18n['general.default.select']}
                  options={leverageList}
                />
              </FormItem>,
              <FormItem col={2}>
                <FormLabel>{i18n['customer.fields.participant']}：</FormLabel>
                <Field
                  name="cyr"
                  columns={6}
                  className={cs['dropdown']}
                  checkbox
                  getPopupContainer={trigger => document.body}
                  component={UserSelector}
                  originValue={
                    initialValues.participants
                      ? initialValues.participants.map((el, index) => {
                          return {
                            value: el,
                            label:
                              initialValues.participantNames &&
                              initialValues.participantNames[index]
                          };
                        })
                      : []
                  }
                  placeholder={i18n['general.default.select']}
                />
              </FormItem>
            ]
          : undefined}
      </Form>
    );
  }
}

export default reduxForm({
  form: WEB_FORM,
  onSubmitFail: errors => {
    console.log('err', errors);
    setTimeout(() => {
      let errorDom =
        document.querySelectorAll('[class*=error]')[0] &&
        document.querySelectorAll('[class*=error]')[0].querySelector('input');
      errorDom
        ? errorDom.focus()
        : document.querySelectorAll('[class*=error]')[0] &&
          document.querySelectorAll('[class*=error]')[0].focus();
    }, 0);
  },
  validate: (values = {}) => {
    const errors = {};
    if (required(values.name)) {
      errors.name = required(values.name);
    }

    if (required(values.url)) {
      errors.url = required(values.url);
    }

    if (required(values.bwUserShow)) {
      errors.bwUserShow = required(values.bwUserShow);
    }

    if (
      (values.bwUserShow === 'UserPartVisible' ||
        values.bwUserShow === 'DirectPartVisible') &&
      required(values.visibleUser)
    ) {
      errors.visibleUser = i18n['settings.link_setting.user_see_tips'];
    }

    if (
      (values.bwUserShow === 'UserInVisible' ||
        values.bwUserShow === 'DirectPartInvisible') &&
      required(values.inVisibleUser)
    ) {
      errors.inVisibleUser = i18n['settings.link_setting.user_not_see_tips'];
    }

    if (values.type === 'DirectRecommendation') {
      if (required(values.ownerType)) {
        errors.ownerType = required(values.ownerType);
      }
      if (values.ownerType === 'OtherOwner' && required(values.ownerId)) {
        errors.ownerId =
          i18n['custom_field.required'] &&
          i18n['custom_field.required'].replace(
            '{value}',
            i18n['settings.link_setting.default_customer_belong_label']
          );
      }
    }
    return errors;
  }
})(WebForm);
