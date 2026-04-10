import { Button } from 'react-bootstrap';
import CustomField, { validate } from 'components/v2/CustomField';
import { reduxForm } from 'redux-form';
import Modal from 'components/Modal';
import Dropdown from 'components/v2/Dropdown';
import { post } from 'utils/ajax';
import i18n from 'utils/i18n';
import { setTrimString } from 'utils/trim';
import cs from './ContactsEditModal.less';
import Tips from 'components/Tips';

export const COANTACT_INFO_FORM = 'CREATE_CONTACT_INFO_FORM';

const MyForm = ({ fields, fieldGenerator, initialValues, disabled }) => {
  const setDefaultValue = !Boolean(initialValues);
  return (
    <CustomField
      fields={fields}
      setDefaultValue={setDefaultValue}
      fieldGenerator={fieldGenerator}
      disabled={disabled}
      verticalForm={true}
    />
  );
};

const ContactForm = reduxForm({
  form: COANTACT_INFO_FORM,
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
  validate
})(MyForm);

export default class ContactsEditModal extends PureComponent {
  state = {
    selectedCustomer: null,
    selectedOwe: null
  };

  convertOweIdToOweName = () => {
    const { uniqueContacts } = this.props;
    return uniqueContacts['customName'];
  };
  //处理客户归属
  FieldGenerator = () => {
    return {
      key: 'searchInput',
      factory: (input, disabled) => {
        const { selectedCustomer } = this.state;
        const defaultSelect = {
          label: i18n['general.default_select'],
          value: ''
        };
        let v = selectedCustomer;
        if (!v) {
          const name = this.convertOweIdToOweName();
          if (name) {
            v = { label: name, value: input.value };
          } else {
            v = defaultSelect;
          }
        }
        return (
          <Dropdown
            {...input}
            defaultSelect={defaultSelect}
            disabled={disabled}
            className={cs['dropdown']}
            value={v}
            searchable
            onSelect={selected => {
              this.onCustomerOweDropdownSelect(selected);
              input.onChange(selected.value);
            }}
            pipe={this.searchCustomer}
            handleData={this.handleData}
          />
        );
      }
    };
  };

  searchCustomer = text => {
    if (!text) {
      return Promise.resolve({
        result: true,
        data: {
          list: []
        }
      });
    }
    const fuzzyVal = text || 0;

    return post({
      url: '/v2/custom/profiles/list',
      data: {
        fuzzyItem: 'CustomerName',
        fuzzyVal
      }
    });
  };

  handleData = res => {
    if (!res.result) return Promise.reject(false);

    const data = res.data.list.map(customer => {
      return {
        label: `${customer.customNo}：${customer.customName}`,
        value: customer.customerId
      };
    });

    return Promise.resolve(data);
  };

  onCustomerOweDropdownSelect = item => {
    this.setState({ selectedCustomer: item });
  };

  getFieldEnabled = ownerType => {
    const { userRights } = this.props;
    let isDisabled = false;
    switch (ownerType) {
      case 'sub': //我的
        isDisabled =
          userRights['CUSTOMER_CONTACTS_SELECT_DIRECTLY_SENSITIVE'] === true;
        break;
      case 'subBelong': // 下级
        isDisabled =
          userRights['CUSTOMER_CONTACTS_SELECT_SUBORDINATE_SENSITIVE'] === true;
        break;
      case 'all': // 受所有控制
        isDisabled =
          userRights['CUSTOMER_CONTACTS_SELECT_ALL_SENSITIVE'] === true;
        break;
      case 'noParent': // 无归属
        isDisabled =
          userRights['CUSTOMER_CONTACTS_SELECT_WILD_SENSITIVE'] === true;
        break;
    }
    return isDisabled;
  };

  /*
    敏感信息字段预处理，如果没有查看敏感信息的权限则将该字段置为disabled
   */
  pretreatmentSensitiveField = () => {
    const { uniqueContacts, duplicateFieldsMap = {}, type } = this.props;
    let initValues = uniqueContacts || {};
    let fieldEnabled = this.getFieldEnabled(initValues['ownerType'] || 'all');
    let originFields = this.formatterField();
    let pretreatmentField = [];
    originFields.forEach(v => {
      let newField = v;
      if (v.sensitive && type === 'edit') {
        if (v.fieldType === 'image') {
          newField = Object.assign({}, newField, {
            fieldType: 'text',
            readonly: !fieldEnabled
          });
        } else {
          newField = Object.assign({}, newField, { readonly: !fieldEnabled });
        }
      }
      if (v.key === 'customName') {
        newField = Object.assign({}, newField, {
          readonly: true
        });
      }
      if (
        duplicateFieldsMap[newField.key] &&
        duplicateFieldsMap[newField.key].length
      ) {
        newField = Object.assign({}, newField, {
          tip: (
            <Tips
              icon="fa fa-exclamation-circle"
              hover
              className={cs['label-tips']}
            >
              <div className={cs['tip-conent']}>
                {newField.label}
                信息重复
              </div>
            </Tips>
          )
        });
      }
      pretreatmentField.push(newField);
    });
    return pretreatmentField;
  };

  //对字段进行特殊处理
  formatterField = () => {
    const { formColumns } = this.props;
    const copyData = formColumns.concat();
    const customNameIdx = copyData.findIndex(col => col.key === 'customName');
    const oweNameIdx = copyData.findIndex(item => item.key === 'oweName');

    if (customNameIdx !== -1) {
      copyData[customNameIdx] = {
        ...copyData[customNameIdx],
        fieldType: 'searchInput'
      };
    }

    if (oweNameIdx !== -1) {
      copyData[oweNameIdx] = {
        ...copyData[oweNameIdx],
        fieldType: 'oweNameSelect',
        component: this.getOweNameField()
      };
    }

    return copyData;
  };

  onOweDropdownSelect = item => {
    this.setState({ selectedOwe: item });
  };

  getOweOptions = () => {
    const { customerParticipant } = this.props;
    let contactsOweOption = [];
    if (customerParticipant['participant']) {
      customerParticipant['participant'].map((item, index) => {
        if (customerParticipant.oweId && customerParticipant.oweId !== item) {
          contactsOweOption.push({
            label: customerParticipant['participantName'][index],
            value: item
          });
        }
        if (!customerParticipant.oweId) {
          contactsOweOption.push({
            label: customerParticipant['participantName'][index],
            value: item
          });
        }
      });
    }
    if (customerParticipant.oweName) {
      contactsOweOption.push({
        label: customerParticipant.oweName,
        value: customerParticipant.oweId
      });
    }
    return contactsOweOption;
  };

  //联系人归属的特殊处理
  getOweNameField = () => {
    const { uniqueContacts } = this.props;
    let contactsOweOption = this.getOweOptions();
    return {
      key: 'oweNameSelect',
      factory: input => {
        const { selectedOwe } = this.state;
        const defaultSelect = {
          label: i18n['general.default_select'],
          value: 'select'
        };
        let v = selectedOwe;
        if (!v)
          v = uniqueContacts.oweId
            ? { label: uniqueContacts.oweName, value: uniqueContacts.oweId }
            : '';
        return (
          <Dropdown
            className={cs['control-width']}
            value={v}
            defaultSelect={defaultSelect}
            data={contactsOweOption}
            onSelect={item => {
              this.onOweDropdownSelect(item);
              input.onChange(item);
            }}
          />
        );
      }
    };
  };

  onSubmitSuccess = data => {
    const { onSave, uniqueContacts } = this.props;
    const { selectedCustomer, selectedOwe } = this.state;
    const selectedCustomerId =
      selectedCustomer !== null
        ? selectedCustomer.value
        : uniqueContacts.customerId;
    const selectedCustomName =
      selectedCustomer !== null
        ? selectedCustomer.label
        : uniqueContacts.customName;
    const selectedOweId =
      selectedOwe !== null
        ? selectedOwe.value === 'select'
          ? ''
          : selectedOwe.value
        : uniqueContacts.oweId;
    const selectedOweName =
      selectedOwe !== null
        ? selectedOwe.value === 'select'
          ? ''
          : selectedOwe.label
        : uniqueContacts.oweName;
    let newData = Object.assign({}, data, {
      customerId: selectedCustomerId,
      customName: selectedCustomName,
      oweId: selectedOweId,
      oweName: selectedOweName
    });
    this.setState({ selectedCustomer: null, selectedOwe: null }); //clean selected customer owe
    for (let name in newData) {
      if (['phones', 'telephone'].includes(name) && newData[name]['phone']) {
        newData[name]['phone'] = setTrimString(newData[name]['phone']);
      }
      if (['email', 'secondMail'].includes(name) && newData[name]) {
        newData[name] = setTrimString(newData[name]);
      }
    }
    if (onSave) onSave(newData, 'contactsInfo');
  };

  onSubmitFail = data => {
    const { onFail } = this.props;

    if (onFail) onFail(data, 'contactsInfo');
    setTimeout(() => {
      let errorDom = document
        .querySelectorAll('[class*=error]')[0]
        .querySelector('input');
      errorDom
        ? errorDom.focus()
        : document.querySelectorAll('[class*=error]')[0].focus();
    }, 0);
  };

  onSubmit = data => {
    return data;
  };

  formatterInfo = () => {
    const { uniqueContacts } = this.props;
    const copyData = JSON.parse(JSON.stringify(uniqueContacts));
    if (copyData.oweId) {
      copyData.oweName = copyData.oweId;
    }
    return copyData;
  };

  render() {
    const { show, onHide, userRights, disabled } = this.props;
    const FieldGenerator = this.FieldGenerator();
    const updatedFields = this.pretreatmentSensitiveField();
    const initValues = this.formatterInfo();

    return (
      <ContactForm
        fields={updatedFields}
        onSubmitFail={this.onSubmitFail}
        onSubmitSuccess={this.onSubmitSuccess}
        onSubmit={this.onSubmit}
        fieldGenerator={FieldGenerator}
        initialValues={initValues}
        disabled={disabled}
      />
    );
  }
}
