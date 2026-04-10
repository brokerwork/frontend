import cs from './index.less';
import { dateTimeFormatStyle } from 'utils/config';
import moment, { defaultFormat } from 'moment';
import { Button, Tooltip, Icon } from 'lean-ui';
import defaultAvata from './avatar-default.png';
import i18n from 'utils/i18n';
import { FormattedMessage } from 'react-intl';
import ContentCard from '../../../../../components/ContentCard';
import Dropdown, { DropdownForCode } from 'components/v2/Dropdown';
import UserSelector from 'components/UserSelector';
import {
  DELETE_REASONS,
  LOST_CUSTOMER_STATE,
  LOST_REASONS
} from '../../../constant';
import ToggleInput from 'components/v2/ToggleInput';
import { isRequired } from 'utils/validate';
import Breadcrumb from 'components/v2/Breadcrumb';

const routes = [
  {
    path: '/custommgmt/customers',
    breadcrumbName: i18n['navigation.customer.module_name']
  },
  {
    path: '',
    breadcrumbName: i18n['customer.detail.title']
  }
];

export default class HeaderInfoView extends PureComponent {
  openModCustomerModal = () => {
    const {
      history: { replace },
      match: { url },
      location: { state }
    } = this.props;
    replace({ pathname: `${url}/modify`, state: { ...state } });
  };
  doMarkFollow = () => {
    const {
      markFollow,
      customerDetailInfo,
      updateCustomerDetail,
      getCustomerList
    } = this.props;
    let isFollowed = !customerDetailInfo.isfollow;
    let cloneInfo = { ...customerDetailInfo, isfollow: isFollowed };
    markFollow(customerDetailInfo.customerId, isFollowed).then(res => {
      if (res.result) {
        updateCustomerDetail(cloneInfo);
        getCustomerList();
      }
    });
  };
  resetCustomer = () => {
    const {
      selectedItemsMap,
      resetCustomer,
      getCustomerList,
      showTopAlert,
      customerDetailInfo,
      updateCustomerDetail,
      backToRoot
    } = this.props;
    const { showTipsModal } = this.props;
    showTipsModal({
      content: i18n['customer.remove_modal.reset_confirmation'],
      onConfirm: cb => {
        resetCustomer({
          ids: [customerDetailInfo.customerId]
        }).then(res => {
          if (res.result) {
            cb();
            backToRoot();
            showTopAlert({
              bsStyle: 'success',
              content: i18n['customer.trash.reset_success']
            });
            return Promise.resolve();
          }
        });
      }
    });
  };
  deepDeleteCustomer = () => {
    const {
      closeCustomerCard,
      destroyCustomer,
      getCustomerList,
      showTopAlert,
      showTipsModal,
      customerDetailInfo
    } = this.props;
    showTipsModal({
      content: i18n['customer.remove_modal.completely_delete_confirmation'],
      onConfirm: cb => {
        destroyCustomer({
          ids: [customerDetailInfo.customerId]
        }).then(res => {
          if (res.result) {
            cb();
            getCustomerList();
            closeCustomerCard();
            showTopAlert({
              bsStyle: 'success',
              content: i18n['general.remove_success']
            });
            return Promise.resolve();
          }
        });
      }
    });
  };
  onFormChange = (key, value) => {
    const {
      addCustomer,
      showTopAlert,
      getCustomerList,
      customerDetailInfo,
      updateCustomerDetail,
      getCustomerActivitiesAll,
      getCustomerActivitiesOperate,
      customerFormFields,
      history,
      setLostCustomer,
      match: { url },
      getCustomerDetail
    } = this.props;
    if (key === 'customerState') {
      if (customerDetailInfo.isLost) {
        //已流失 忽略或 设置非流失
        if (value === 'Lost') return;
        else {
          setLostCustomer(false, customerDetailInfo.customerId).then(res => {
            if (res.result) {
              showTopAlert({
                content: i18n['customer.edit_customer.modify_success'],
                bsStyle: 'success'
              });
              getCustomerDetail();
            }
          });
          return;
        }
      } else if (value === 'Lost') {
        //非已流失 执行流失操作
        history.push(`${url}/lost`);
        updateCustomerDetail(customerDetailInfo);
        return;
      }
    }
    // if (
    //   customerDetailInfo[key] &&
    //   value === (customerDetailInfo && customerDetailInfo[key])
    // )
    //   return;
    const { customerId } = customerDetailInfo;
    const submitData = typeof key === 'object' ? key : { [key]: value };
    for (let i in submitData) {
      if (!isRequired(submitData[i])) {
        const filedItem = customerFormFields.find(item => item.key === i);
        if (
          filedItem &&
          filedItem.validateType &&
          filedItem.validateType.required
        ) {
          showTopAlert({
            content: (
              <FormattedMessage
                id="custom_field.required"
                defaultMessage={i18n['custom_field.required']}
                values={{ value: filedItem.label }}
              />
            )
          });
          updateCustomerDetail(customerDetailInfo);
          return;
        }
      }
    }
    addCustomer({ customerId, ...submitData }, 'edit').then(res => {
      if (!res.result) return;
      showTopAlert({
        content: i18n['customer.edit_customer.modify_success'],
        bsStyle: 'success'
      });
      updateCustomerDetail({
        ...customerDetailInfo,
        ...res.data,
        isfollow: customerDetailInfo.isfollow
      });
      getCustomerActivitiesAll({ customerId });
      getCustomerActivitiesOperate({ customerId });
      getCustomerList();
    });
  };
  getIsCustomerNameSensitive = () => {
    const { customerFormFields, customerDetailInfo } = this.props;
    const customerNameField = customerFormFields.find(
      item => item.key == 'customName'
    );
    if (customerNameField && customerNameField.sensitive) {
      return !this.getFieldEnabled();
    }
    return false;
  };
  getFieldEnabled = () => {
    const { userRights, customerDetailInfo } = this.props;
    const ownerType = customerDetailInfo.ownerType || ['all'];
    return ownerType.some(item => {
      switch (item) {
        case 'sub': //我的
          return !!userRights['CUSTOMER_SELECT_DIRECTLY_SENSITIVE'];

        case 'subBelong': // 下级
          return !!userRights['CUSTOMER_SELECT_SUBORDINATE_SENSITIVE'];

        case 'all': // 受所有控制
          return !!userRights['CUSTOMER_SELECT_ALL_SENSITIVE'];

        case 'noParent': // 无归属
          return !!userRights['CUSTOMER_SELECT_WILD_SENSITIVE'];

        case 'participant ': //参与人
          return !!userRights['CUSTOMER_SELECT_JOIN_SENSITIVE'];
      }
    });
  };
  recombineParticipant = () => {
    const { customerDetailInfo } = this.props;
    let combineParticipant = [];
    if (
      customerDetailInfo['participant'] &&
      customerDetailInfo['participantName']
    ) {
      for (let k = 0; k < customerDetailInfo['participant'].length; k++) {
        combineParticipant.push({
          label: customerDetailInfo['participantName'][k],
          value: customerDetailInfo['participant'][k]
        });
      }
    }
    return combineParticipant;
  };
  render() {
    const {
      customerDetailInfo: {
        avata = defaultAvata,
        customName: customerName,
        isfollow: isFollowed,
        enabled,
        lost,
        customerState,
        virtualState,
        openState,
        dealState
      },
      customerDetailInfo,
      userRights,
      customerStates,
      selectableCustomerStateKeys,
      tenantType,
      customerFormFields
    } = this.props;
    const genderIcon = [
      `fa fa-male-i ${cs['gender-male']}`,
      `fa fa-female-i ${cs['gender-female']}`
    ][customerDetailInfo.gender];
    let followIcon = isFollowed ? 'fa-star' : 'fa-star-o';
    const currentState =
      customerStates.find(item => item.value === customerState) || {};
    const showCurrentState =
      customerStates.find(
        item => item.value === (lost ? virtualState : customerState)
      ) || {};

    const extraLabels = [];
    openState !== undefined &&
      extraLabels.push(i18n[`customer.state_type.openState${openState}`]);
    dealState !== undefined &&
      extraLabels.push(i18n[`customer.state_type.user.dealState${dealState}`]);

    const stateSelectable =
      selectableCustomerStateKeys.length > 1 &&
      selectableCustomerStateKeys.includes(customerDetailInfo.customerState);
    const selectedOwn = customerDetailInfo.oweId
      ? {
          label: customerDetailInfo.oweName,
          value: customerDetailInfo.oweId
        }
      : undefined;
    const selectedCustomer = customerDetailInfo.commendId
      ? {
          label: customerDetailInfo.commendName,
          value: customerDetailInfo.commendId
        }
      : undefined;
    const selectedParticipant = this.recombineParticipant();
    const isCustomerNameSensitive = this.getIsCustomerNameSensitive();
    return (
      <ContentCard className={cs['header-root']}>
        <ContentCard.Body>
          <div className={`${cs['header-info']} customer-header-info`}>
            <div className={cs['left']}>
              <Icon
                fontType="bw"
                icon="customer-color"
                className={`${cs['lw-customer']} main-color`}
              />
            </div>
            <div className={cs['middle']}>
              <div className={cs['top']}>
                <Breadcrumb routes={routes} />
                <div className={cs['name']}>
                  {!(userRights['CUSTOMER_MODIFY'] && enabled) ||
                  isCustomerNameSensitive ? (
                    <span>{customerName}</span>
                  ) : (
                    <div>
                      <ToggleInput
                        value={customerName}
                        inputClassName={cs['username-input']}
                        className={cs['toggle-input']}
                        onChange={value => {
                          this.onFormChange({ customName: value });
                        }}
                        confirmButton
                      />
                    </div>
                  )}
                  {genderIcon && (
                    <span className={cs['user-gender']}>
                      <i className={genderIcon} />
                    </span>
                  )}
                </div>
                {!enabled ? (
                  <div className={cs['create-time']}>
                    <span>
                      {i18n['customer.trash.delete_reason']}：
                      {(
                        DELETE_REASONS.find(
                          item => item.value === customerDetailInfo.removeReason
                        ) || {}
                      ).label || customerDetailInfo.removeReason}
                    </span>
                    <span>
                      {i18n['customer.trash.delete_time']}
                      {moment(customerDetailInfo.modifyTime).format(
                        dateTimeFormatStyle
                      )}
                    </span>
                  </div>
                ) : (
                  undefined
                )}
                {!enabled ? (
                  <div className={cs['customer-buttons']}>
                    <Button onClick={this.resetCustomer} type="success">
                      {i18n['customer.trash.reset']}
                    </Button>
                    <Button onClick={this.deepDeleteCustomer} type="danger">
                      {i18n['customer.trash.completely_remove']}
                    </Button>
                  </div>
                ) : (
                  undefined
                )}
              </div>
              <div className={cs['bottom']}>
                {customerFormFields.find(el => {
                  return el.key === 'oweId';
                }) ? (
                  <div>
                    {i18n['customer.fields.own_name']}
                    <div>
                      <UserSelector
                        size="small"
                        value={selectedOwn}
                        className={`${cs['customer-own']} ${
                          cs['green']
                        } main-color`}
                        icon={`fa fa-pencil ${cs['edit-icon']}`}
                        disabled={!(userRights['CUSTOMER_MODIFY'] && enabled)}
                        searchByField
                        onSelect={({ label, value, _originData }) => {
                          this.onFormChange({
                            oweName: (_originData && _originData.name) || '',
                            oweId: value
                          });
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  undefined
                )}
                {customerFormFields.find(el => {
                  return el.key === 'participant';
                }) ? (
                  <div>
                    {i18n['customer.fields.participant']}
                    <div>
                      <UserSelector
                        size="small"
                        value={selectedParticipant}
                        checkbox
                        defaultSelect={false}
                        className={`${cs['customer-own']} ${
                          cs['green']
                        } main-color`}
                        icon={`fa fa-pencil ${cs['edit-icon']}`}
                        disabled={!(userRights['CUSTOMER_MODIFY'] && enabled)}
                        searchByField
                        onSelect={selected => {
                          this.onFormChange({
                            participantName: selected.map(item => item.label),
                            participant: selected.map(item => item.value)
                          });
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  undefined
                )}
                {customerFormFields.find(el => {
                  return el.key === 'commendName';
                }) ? (
                  <div>
                    {i18n['customer.fields.commendName']}
                    <div>
                      <UserSelector
                        size="small"
                        value={selectedCustomer}
                        className={`${cs['customer-own']} ${
                          cs['green']
                        } main-color`}
                        icon={`fa fa-pencil ${cs['edit-icon']}`}
                        disabled={!(userRights['CUSTOMER_MODIFY'] && enabled)}
                        searchCustomer
                        onSelect={({ label, value, _originData }) => {
                          this.onFormChange({
                            commendName:
                              (_originData && _originData.customName) || '',
                            commendId: value
                          });
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  undefined
                )}
                <div>
                  {i18n['customer.fields.customerState']}
                  <p>
                    {stateSelectable ? (
                      <DropdownForCode
                        className={`${cs['customer-state']} ${
                          cs['green']
                        } main-color`}
                        disabled={!(userRights['CUSTOMER_MODIFY'] && enabled)}
                        icon={`fa fa-pencil ${cs['edit-icon']}`}
                        data={customerStates.filter(
                          item =>
                            item.value &&
                            selectableCustomerStateKeys.includes(item.value)
                        )}
                        value={customerDetailInfo.virtualState}
                        onChange={this.onFormChange.bind(this, 'customerState')}
                      />
                    ) : currentState.value === 'Payed' ? ( //逻辑过于复杂，这里默认Payed是不属于selectableCustomerStateKeys的， 若需求有修改请注意。
                      <DropdownForCode
                        className={`${cs['customer-state']} ${
                          cs['green']
                        } main-color`}
                        disabled={!(userRights['CUSTOMER_MODIFY'] && enabled)}
                        icon={`fa fa-pencil ${cs['edit-icon']}`}
                        data={[currentState, LOST_CUSTOMER_STATE]}
                        value={customerDetailInfo.virtualState}
                        onChange={this.onFormChange.bind(this, 'customerState')}
                      />
                    ) : (
                      currentState.label
                    )}
                  </p>
                </div>
                <div>
                  {i18n['customer.detail.create_time_label']}
                  <p>
                    {moment(customerDetailInfo.createTime).format(
                      dateTimeFormatStyle
                    )}
                  </p>
                </div>
              </div>
            </div>
            <div className={cs['right']}>
              <span className={`${cs['sale']} main-color right-sale`}>
                <Tooltip
                  className={cs['state-icon']}
                  trigger="hover"
                  placement="top"
                  title={
                    <div className={cs['ques-content']}>
                      {tenantType === 'inner'
                        ? i18n['customer.detail.state_tips.inner']
                        : i18n['customer.detail.state_tips']}
                    </div>
                  }
                >
                  <i className="fa fa-exclamation-circle" />
                </Tooltip>
                {extraLabels.length
                  ? `${showCurrentState.label} ${extraLabels.join(' ')}`
                  : showCurrentState.label}
              </span>
              <span
                className={cs['star']}
                style={{ cursor: enabled ? 'cursor' : 'default' }}
                onClick={enabled && this.doMarkFollow}
              >
                <i className={`fa ${followIcon} ${cs['title-icon']}`} />
                {isFollowed
                  ? i18n['customer.detail.cancel_follow']
                  : i18n['customer.detail.follow']}
              </span>
            </div>
          </div>
          {customerDetailInfo.isLost ? (
            <div className={cs['head-info-lost-bar']}>
              <div>
                <span className={cs['head-info-lost-item']}>
                  {i18n['customer.lost_customer.lost_label']}
                </span>
                <span className={cs['head-info-lost-item']}>
                  {i18n['customer.lost_customer.lost_time']}:{' '}
                  {customerDetailInfo.lostTime &&
                    moment(customerDetailInfo.lostTime).format(
                      dateTimeFormatStyle
                    )}
                </span>
              </div>
              <div>
                <span className={cs['head-info-lost-item']}>
                  {i18n['customer.lost_customer.lost_reason']}:{' '}
                  {
                    (
                      LOST_REASONS.find(
                        item => item.value === customerDetailInfo.lostType
                      ) || {}
                    ).label
                  }
                </span>
                <span className={cs['head-info-lost-item']}>
                  {customerDetailInfo.lostReason}
                </span>
              </div>
            </div>
          ) : (
            undefined
          )}
        </ContentCard.Body>
      </ContentCard>
    );
  }
}
