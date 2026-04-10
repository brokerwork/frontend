import { Input, Tooltip } from 'lean-ui';
import { reduxForm, Field } from 'redux-form';
import CustomField, { validate } from 'components/v2/CustomField';
import i18n from 'utils/i18n';
import { setTrimString } from 'utils/trim';
import cs from './CustomerDetailModal.less';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import UserSelector from 'components/UserSelector';
const formatStyle = 'YYYY-MM-DD HH:mm:ss';

const MyForm = ({
  fields,
  fieldGenerator,
  initialValues,
  newFormField,
  disabled,
  onFocus
}) => {
  const setDefaultValue = !Boolean(initialValues);
  return (
    <CustomField
      setDefaultValue={setDefaultValue}
      fields={fields}
      disabled={disabled}
      newFormField={newFormField}
      pure={true}
      fieldGenerator={fieldGenerator}
      onFocus={onFocus}
    />
  );
};

export const CUSTOMER_FORM = 'CUSTOMER_DETAIL_MODAL_CUSTOMER_FORM';
const CustomerForm = reduxForm({
  form: CUSTOMER_FORM,
  validate,
  enableReinitialize: true,
  shouldValidate: () => {
    return true;
  },
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
})(MyForm);

export default class CustomerDetailModal extends PureComponent {
  state = {
    selectedCustomerOwe: null,
    participate: [],
    changeParticipate: false,
    commendName: {},
    changeCommendName: false
  };

  onCustomerOweDropdownSelect = item => {
    this.setState({ selectedCustomerOwe: item });
  };

  convertOweIdToOweName = oweId => {
    const { customerDetailInfo } = this.props;
    return customerDetailInfo['oweName'];
  };

  plainDateTimeFieldGenerator = () => {
    return {
      key: 'followTime',
      factory: (input, disabled) => {
        const value = input.value
          ? moment(input.value).format(formatStyle)
          : '';
        return <Input value={value} disabled={disabled} />;
      }
    };
  };
  getOweFieldGenerator = () => {
    return {
      key: 'searchInput',
      factory: (input, disabled) => {
        const { selectedCustomerOwe } = this.state;
        const defaultSelect = {
          label: i18n['general.default_select'],
          value: undefined
        };
        let v = selectedCustomerOwe;
        if (!v) {
          const name = this.convertOweIdToOweName();
          if (name) {
            v = { label: name, value: input.value };
          } else {
            v = null;
          }
        }
        return (
          <UserSelector
            value={v}
            className={cs['control-width']}
            disabled={disabled}
            searchByField
            onSelect={(item, value, _originData) => {
              this.onCustomerOweDropdownSelect({
                ...item,
                ...item._originData
              });
              input.onChange(item.value);
            }}
          />
        );
      }
    };
  };

  getSourceType = key => {
    const { customerLinkSource } = this.props;
    for (let i = 0; i < customerLinkSource.length; i++) {
      if (`${customerLinkSource[i]['value']}` === `${key}`) {
        return customerLinkSource[i].label;
      }
    }
  };

  onSubmit = values => {
    //还原 values中的 客户归属字段
    const { customerDetailInfo } = this.props;
    const {
      selectedCustomerOwe,
      participate,
      changeParticipate,
      commendName,
      changeCommendName
    } = this.state;
    const selectedOweId = selectedCustomerOwe
      ? selectedCustomerOwe.id
        ? selectedCustomerOwe.id
        : ''
      : customerDetailInfo.oweId;
    const selectedOweName = selectedCustomerOwe
      ? selectedCustomerOwe.id
        ? selectedCustomerOwe.name
        : ''
      : customerDetailInfo.oweName;
    let saveParticipant = [];
    let saveParticipantName = [];
    if (changeParticipate) {
      participate.map(item => {
        saveParticipant.push(item.value);
        saveParticipantName.push(item.label);
      });
    } else {
      saveParticipant = customerDetailInfo.participant;
      saveParticipantName = customerDetailInfo.participantName;
    }
    let saveCommendId = [];
    let saveCommendName = [];
    if (changeCommendName) {
      debugger;
      saveCommendId = commendName.value;
      saveCommendName = commendName.customName;
    } else {
      saveCommendId = customerDetailInfo.commendId;
      saveCommendName = customerDetailInfo.commendName;
    }
    let newValues = Object.assign({}, values, {
      oweId: selectedOweId,
      oweName: selectedOweName,
      participant: saveParticipant,
      participantName: saveParticipantName,
      commendId: saveCommendId,
      commendName: saveCommendName
    });
    // 怎么接受数据
    this.setState({
      selectedCustomerOwe: null,
      participant: [],
      changeParticipate: false,
      changeCommendName: false
    }); //clean selected customer owe
    for (let name in newValues) {
      if (
        ['phones', 'standbyTelephone'].includes(name) &&
        newValues[name]['phone']
      ) {
        newValues[name]['phone'] = setTrimString(newValues[name]['phone']);
      }
      if (name === 'email' && newValues[name]) {
        newValues[name] = setTrimString(newValues[name]);
      }
    }
    this.props.onOk(newValues);
  };

  onOkClick = () => {
    const { submitForm } = this.props;
    submitForm(CUSTOMER_FORM);
  };

  /*
    替换 客户归属为高级下拉，删除创建时间这个字段。
    替换 当客户来源为推广链接时，客户来源字段变成不可编辑的text格式，
   */
  replaceOweFieldTypeToAdvanceInput = () => {
    const {
      fields,
      customerDetailInfo,
      customerLinkSource,
      customerStates,
      tenantType,
      selectableCustomerStateKeys,
      type
    } = this.props;
    let oweIdField = fields.find(o => {
      return o.fieldType === 'select' && o.key === 'oweId';
    });
    let participantField = fields.find(o => {
      return o.fieldType === 'select' && o.key === 'participant';
    });
    let commendNameField = fields.find(o => {
      return o.fieldType === 'select' && o.key === 'commendName';
    });
    let newOweIdField = Object.assign({}, oweIdField, {
      fieldType: 'searchInput'
    });
    let newParticipantField = Object.assign({}, participantField, {
      fieldType: 'searchCheckInput',
      component: this.getParticipatSearchCheckField()
    });
    let newCommendNameField = Object.assign({}, commendNameField, {
      fieldType: 'searchCheckInput',
      component: this.getCommendNameSearchCheckField()
    });
    let customSourceField = fields.find(o => {
      return o.fieldType === 'select' && o.key === 'customSource';
    });
    let newcustomSourceField = Object.assign({}, customSourceField, {
      optionList: customerLinkSource,
      readonly: true
    });
    let updatedFields = [];
    for (let i = 0; i < fields.length; i++) {
      //动态替换客户归属下拉框为SearchInput
      let field = fields[i];
      if (field.key === 'createTime') {
        continue;
      }
      if (field.key === 'followTime') {
        if (type === 'edit') {
          const newField = {
            ...field,
            fieldType: 'followTime',
            component: this.plainDateTimeFieldGenerator(),
            readonly: true
          };
          updatedFields.push(newField);
        }
        continue;
      }
      //根据不同状态disable 用户状态字段
      if (
        field.key === 'customerState' &&
        (customerDetailInfo.customerState &&
          !selectableCustomerStateKeys.includes(
            customerDetailInfo.customerState
          ))
      ) {
        const newField = {
          ...field,
          optionList: customerStates,
          readonly: true
        };
        updatedFields.push(newField);
        continue;
      }
      //动态替换客户来源如果为推广链接的情况
      if (
        customerDetailInfo['customSource'] &&
        field.fieldType === 'select' &&
        field.key === 'customSource' &&
        customerDetailInfo['sourceType'] === 'LINK' &&
        customerDetailInfo['customSource'].length > 0
      ) {
        updatedFields.push(newcustomSourceField);
        continue;
      }

      //处理参与人字段
      if (field.fieldType === 'select' && field.key === 'participant') {
        updatedFields.push(newParticipantField);
        continue;
      }

      if (field.fieldType === 'select' && field.key === 'commendName') {
        updatedFields.push(newCommendNameField);
        continue;
      }

      if (field.fieldType === 'select' && field.key === 'oweId') {
        updatedFields.push(newOweIdField);
      } else {
        updatedFields.push(field);
      }
    }
    return updatedFields;
  };

  getFieldEnabled = ownerType => {
    const { userRights, type } = this.props;
    if (type === 'add') {
      return true;
    }
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

  /*
    敏感信息字段预处理，如果没有查看敏感信息的权限则将该字段置为disabled
   */
  pretreatmentSensitiveField = () => {
    const {
      customerDetailInfo,
      duplicateFieldsMap = {},
      twUserOfCustomer = {}
    } = this.props;
    const fieldEnabled = this.getFieldEnabled(
      customerDetailInfo['ownerType'] || ['all']
    );
    const originFields = this.replaceOweFieldTypeToAdvanceInput();
    const pretreatmentField = [];
    originFields.forEach(v => {
      let newField = v;
      let tipContent = '';
      if (v.sensitive) {
        if (v.fieldType === 'image' && !fieldEnabled) {
          newField = Object.assign({}, newField, {
            fieldType: 'text',
            readonly: !fieldEnabled
          });
        } else {
          newField = Object.assign({}, newField, { readonly: !fieldEnabled });
        }
      }

      if (duplicateFieldsMap[v.key] && duplicateFieldsMap[v.key].length) {
        tipContent = (
          <FormattedMessage
            id="customer.detail.duplicate_tip"
            defaultMessage={i18n['customer.detail.duplicate_tip']}
            values={{
              label: newField.label
            }}
          />
        );
      }
      if (
        v.key === 'phones' &&
        (twUserOfCustomer.phone &&
          customerDetailInfo.phones &&
          fieldEnabled &&
          customerDetailInfo.phones.phone !== twUserOfCustomer.phone)
      ) {
        tipContent = (
          <div>
            <FormattedMessage
              id="customer.detail.tw_mismatching_title"
              defaultMessage={i18n['customer.detail.tw_mismatching_title']}
              values={{
                type: newField.label,
                value: (
                  <div>
                    <b className="main-color">{twUserOfCustomer.phone}</b>
                  </div>
                )
              }}
            />
            <hr />
            {tipContent}
          </div>
        );
      }
      if (
        v.key === 'email' &&
        (twUserOfCustomer.email &&
          customerDetailInfo.email &&
          fieldEnabled &&
          customerDetailInfo.email !== twUserOfCustomer.email)
      ) {
        tipContent = (
          <div>
            <FormattedMessage
              id="customer.detail.tw_mismatching_title"
              defaultMessage={i18n['customer.detail.tw_mismatching_title']}
              values={{
                type: newField.label,
                value: (
                  <div>
                    <b>{twUserOfCustomer.email}</b>
                  </div>
                )
              }}
            />
            {tipContent ? <hr /> : undefined}
            {tipContent}
          </div>
        );
      }
      if (tipContent) {
        newField = Object.assign({}, newField, {
          tip: (
            <Tooltip
              key="tw"
              className={cs['label-tips']}
              trigger="hover"
              placement="top"
              title={<div className={cs['tip-conent']}>{tipContent}</div>}
            >
              <i className="fa fa-exclamation-circle" />
            </Tooltip>
          )
        });
      }
      pretreatmentField.push(newField);
    });
    return pretreatmentField;
  };

  onCancel = () => {
    const { onCancel } = this.props;
    this.setState({
      selectedCustomerOwe: null
    });
    if (onCancel) onCancel();
  };
  //重新生成参与人字段
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

  recombineCommendName = () => {
    const { customerDetailInfo } = this.props;
    let combineCommendName = {};
    if (customerDetailInfo['commendId'] && customerDetailInfo['commendName']) {
      combineCommendName = {
        label: customerDetailInfo['commendName'],
        value: customerDetailInfo['commendId']
      };
    }
    return combineCommendName;
  };

  onpSelectParticipant = selected => {
    this.setState({
      participate: selected,
      changeParticipate: true
    });
  };

  onSelectCommendName = selected => {
    this.setState({
      commendName: selected,
      changeCommendName: true
    });
  };

  //参与人字段的特殊处理
  getParticipatSearchCheckField = () => {
    return {
      key: 'searchCheckInput',
      factory: (input, disabled) => {
        const { participate, changeParticipate } = this.state;
        let v = participate;
        if (v.length === 0 && !changeParticipate) {
          const participantename = this.recombineParticipant();
          if (participantename) {
            v = participantename;
          } else {
            v = [];
          }
        }

        return (
          <UserSelector
            value={v}
            data={v}
            className={cs['control-width']}
            disabled={disabled}
            searchByField
            checkbox
            defaultSelect={false}
            onSelect={selected => {
              const result = selected.map(item => ({
                ...item,
                ...item._originData
              }));
              this.onpSelectParticipant(result);
              input.onChange(result);
            }}
          />
        );
      }
    };
  };

  getCommendNameSearchCheckField = () => {
    return {
      key: 'searchCheckInput',
      factory: (input, disabled) => {
        const { commendName, changeCommendName } = this.state;
        let v = commendName;
        if (v.length === 0 && !changeCommendName) {
          const commendNames = this.recombineCommendName();
          if (commendNames) {
            v = commendNames;
          } else {
            v = [];
          }
        }
        return (
          <UserSelector
            value={v}
            data={v}
            className={cs['control-width']}
            disabled={disabled}
            searchCustomer
            defaultSelect={false}
            onSelect={selected => {
              const result = {
                ...selected,
                ...selected._originData
              };
              this.onSelectCommendName(result);
              input.onChange(result);
            }}
          />
        );
      }
    };
  };
  render() {
    const {
      show,
      title,
      newFormField,
      disabled,
      duplicateFieldsMap,
      customerDetailInfo,
      onFocus,
      onSubmitSuccess
    } = this.props;
    let updatedFields = this.pretreatmentSensitiveField();
    let myFieldGenerator = this.getOweFieldGenerator();
    return (
      <div className={cs['customer-details-form']}>
        {show ? (
          <CustomerForm
            initialValues={{
              customerState: 'Clue',
              ...customerDetailInfo
            }}
            ref="myform"
            newFormField={newFormField}
            fields={updatedFields}
            onSubmit={this.onSubmit}
            disabled={disabled}
            fieldGenerator={myFieldGenerator}
            onFocus={onFocus}
            onSubmitSuccess={onSubmitSuccess}
          />
        ) : (
          undefined
        )}
      </div>
    );
  }
}
