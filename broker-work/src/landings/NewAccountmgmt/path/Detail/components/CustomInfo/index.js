import { Icon } from 'lean-ui';
import SearchCustomer from '../SearchCustomer';
import cs from './style.less';
import i18n from 'utils/i18n';
import { Form } from 'lean-ui';
import CustomInfoForm, { CUSTOM_INFO_FORM } from './Form';
import MergeOwnerInfo from '../../containers/MergeOwnerInfo';
import { FormattedMessage } from 'react-intl';

export default class CustomInfo extends PureComponent {
  state = {
    selectedCustomer: null,
    showMergeModal: false
  };
  getTaUserMessage = () => {
    const { taUserInfo } = this.props;

    return taUserInfo.name ? (
      <FormattedMessage
        id="account.account_customer_binding.ta_user"
        defaultMessage={i18n['account.account_customer_binding.ta_user.ui']}
        values={{ name: taUserInfo.name }}
      />
    ) : (
      ''
    );
  };
  filterColumns = () => {
    const { formColumns, filteredRights } = this.props;
    const result = {};

    for (let form in formColumns) {
      result[form] = formColumns[form].map(item => ({
        ...item,
        key: `${form}-${item.key}`,
        readonly: item.sensitive
          ? !filteredRights.update.sensitive
          : item.readonly,
        fieldType: item.sensitive
          ? !filteredRights.update.sensitive && item.fieldType === 'image'
            ? 'text'
            : item.fieldType
          : item.fieldType,
        placeHolder: item.sensitive
          ? !filteredRights.update.sensitive && item.fieldType === 'image'
            ? ''
            : item.placeHolder
          : item.placeHolder
      }));
    }

    return result;
  };
  prepareToMerge = () => {
    const {
      ownerRelatedInfo: { customer },
      showTipsModal
    } = this.props;
    const taUserMsg = this.getTaUserMessage();
    const content = customer.value ? (
      <FormattedMessage
        id="account.account_customer_binding.tips2"
        defaultMessage={i18n['account.account_customer_binding.tips2']}
        values={{ name: customer.label, tip: taUserMsg }}
      />
    ) : (
      i18n['account.account_customer_binding.tips3']
    );

    showTipsModal({
      content,
      confirmBtnText:
        i18n['account.account_customer_binding.buttons.go_to_merge'],
      onConfirm: cb => {
        this.setState({
          showMergeModal: true
        });
        cb();
      }
    });
  };
  prepareToBind = selected => {
    const {
      ownerRelatedInfo: { customer },
      showTipsModal
    } = this.props;
    const taUserMsg = this.getTaUserMessage();

    if (customer.value) {
      showTipsModal({
        content: (
          <FormattedMessage
            id="account.account_customer_binding.tips1"
            defaultMessage={i18n['account.account_customer_binding.tips1']}
            values={{ name: customer.label, tip: taUserMsg }}
          />
        ),
        confirmBtnText:
          i18n['account.account_customer_binding.buttons.continue'],
        onConfirm: cb => {
          this.bound(selected);
          cb();
        }
      });
    } else {
      this.bound(selected);
    }
  };
  bound = customer => {
    const {
      boundCustomer,
      currentServer,
      accountId,
      showTopAlert
    } = this.props;

    boundCustomer(customer.value, accountId, currentServer).then(
      ({ result }) => {
        if (result) {
          showTopAlert({
            bsStyle: 'success',
            content: i18n['account.account_customer_binding.bind_success']
          });
          this.getAccountDetail();
        }
      }
    );
  };
  onSelectCustomer = selected => {
    const {
      accountId,
      ownerRelatedInfo: { customer },
      currentServer,
      checkOwnerInfoDiff
    } = this.props;

    if (selected.value !== customer.value) {
      checkOwnerInfoDiff(accountId, selected.value, currentServer).then(
        ({ result, data }) => {
          if (result) {
            const {
              diffResult: {
                baseInfo,
                certificatesInfo,
                financialInfo,
                classificationInfo,
                appropriatenessTestInfo
              }
            } = data;

            if (
              !baseInfo.length &&
              !certificatesInfo.length &&
              !financialInfo.length &&
              !classificationInfo.length &&
              !appropriatenessTestInfo.length
            ) {
              this.prepareToBind(selected);
            } else {
              this.prepareToMerge();
            }
          }
        }
      );

      this.setState({
        selectedCustomer: selected
      });
    }
  };
  getAccountDetail = () => {
    const { accountId, currentServer, getAccountDetail } = this.props;

    return getAccountDetail(accountId, currentServer);
  };
  closeMergeModal = () => {
    this.setState({
      showMergeModal: false
    });
  };
  onMerge = () => {
    this.setState({
      showMergeModal: false,
      selectedCustomer: null
    });
    this.getAccountDetail();
  };
  onSubmit = values => {
    const {
      accountId,
      updateOwnerInfo,
      currentServer,
      showTopAlert,
      ownerRelatedInfo: { customer },
      updateCustomInfo,
      onSingleFormSubmit
    } = this.props;
    const { activeTab } = this.state;
    const info = Object.keys(values).reduce((value, currentValue) => {
      const strings = currentValue.split('-');
      const form = strings[0];
      const key = strings[1];

      if (!value[form]) {
        value[form] = {};
      }

      if (key === 'localTIN' || key === 'otherTIN') {
        value[form][key] = values[currentValue].filter(
          item => item && item.countryCode && item.tin
        );
      } else {
        value[form][key] = values[currentValue];
      }

      return value;
    }, {});
    const data = {
      [activeTab]: info[activeTab]
    };

    if (customer.value) {
      data.customerInfo = { customerId: customer.value, ...info.customerInfo };
    }

    onSingleFormSubmit(
      CUSTOM_INFO_FORM,
      updateCustomInfo(accountId, data, currentServer)
    );
    // updateCustomInfo(accountId, data, currentServer).then(({ result }) => {
    //   if (result) {
    //     this.getAccountDetail().then(res => {
    //       if (res.result) {
    //         showTopAlert({
    //           bsStyle: 'success',
    //           content: i18n['general.modify_success']
    //         });
    //       }
    //     });
    //   }
    // });
  };

  filterInfo = () => {
    const { ownerInfo } = this.props;
    const result = {};

    for (let form in ownerInfo) {
      for (let key in ownerInfo[form]) {
        result[`${form}-${key}`] = ownerInfo[form][key];
      }
    }

    return result;
  };

  onExport = () => {
    const {
      exportClassificationInfo,
      accountId,
      currentServer,
      showTipsModal
    } = this.props;

    exportClassificationInfo(accountId, currentServer).then(
      ({ result, data }) => {
        if (result) {
          saveAccountPdf(data);
          iframeView('/downloadpdf/ACCOUNT_CLASSIFICATION_INFO');
        }
      }
    );
  };
  filterRequiredCheckbox = columnObj => {
    const columes = Object.values(columnObj);
    const checkboxs = [];
    columes.map(colume => {
      const fields = Object.values(colume) || [];
      let i = 0;
      const _len = fields.length;
      while (i < _len) {
        const field = fields[i];
        if (
          field.fieldType === 'singleCheckbox' &&
          field.validateType &&
          field.validateType.required
        )
          checkboxs.push(field.key);
        i++;
      }
    });
    return checkboxs;
  };
  render() {
    const {
      ownerRelatedInfo,
      filteredRights,
      globalFormChange,
      changedFormArray,
      taUserInfo,
      userRights
    } = this.props;
    const { showMergeModal, selectedCustomer } = this.state;
    const taUser = this.getTaUserMessage();
    const columns = this.filterColumns();
    const info = this.filterInfo();
    const checkboxList = this.filterRequiredCheckbox(columns);
    return (
      <div className={cs['custom-info']}>
        <header>
          <Icon className={cs['icon']} icon="profile-vertical" fontType="bw" />
          {i18n['account.create_account.customer_info.title']}
        </header>
        {filteredRights.update.ownerInfo ? (
          <Form.Item>
            <Form.Label>
              {i18n['account.detail.owner_info.related_customer']}
            </Form.Label>
            <Form.Control className={taUser ? cs['search-item'] : null}>
              <div className={taUser ? cs['search-customer'] : null}>
                <SearchCustomer
                  disabled={!userRights['ACCOUNT_MODIFY_OWNER_ALLO']}
                  value={ownerRelatedInfo.customer}
                  onSelect={this.onSelectCustomer}
                />
              </div>
              {taUser ? (
                <div className={cs['ta-user']} title={`${taUserInfo.name}`}>
                  {taUser}
                </div>
              ) : (
                undefined
              )}
            </Form.Control>
          </Form.Item>
        ) : null}
        <CustomInfoForm
          userRights={userRights}
          filteredRights={filteredRights}
          ownerRelatedInfo={ownerRelatedInfo}
          fields={columns.customerInfo}
          checkboxList={checkboxList}
          initialValues={info}
          onFocus={() => {
            if (!changedFormArray.includes(CUSTOM_INFO_FORM)) {
              globalFormChange(CUSTOM_INFO_FORM);
            }
          }}
          onSubmit={this.onSubmit}
        />
        {showMergeModal ? (
          <MergeOwnerInfo
            selectedCustomer={selectedCustomer}
            onHide={this.closeMergeModal}
            onMerge={this.onMerge}
            visible={showMergeModal}
          />
        ) : (
          undefined
        )}
      </div>
    );
  }
}
