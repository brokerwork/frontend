import { Button, Icon } from 'lean-ui';
import SearchCustomer from '../SearchCustomer';
import {
  BaseInfoForm,
  FinancialInfoForm,
  CertificatesInfoForm,
  ClassificationInfoForm,
  TestInfoForm,
  BASE_INFO_FORM,
  FINANCIAL_INFO_FORM,
  CERTIFICATES_INFO_FORM,
  CLASSIFICATION_INFO_FORM,
  TEST_INFO_FORM
} from './Form';
import cs from './OwnerInfo.less';
import i18n from 'utils/i18n';
import { FormattedMessage } from 'react-intl';
import { saveAccountPdf } from 'utils/PdfData';
import iframeView from 'utils/iframeView';
import ReduxFormWraper from 'components/v2/ReduxFormWraper';
import VerifyIdButton from 'components/v2/VerifyIdButton';
import { Menu } from 'lean-ui';
const typeMap = {
  1: [
    'firstNameGbg',
    'surNameGbg',
    'dobGbg',
    'buildingGbg',
    'streetGbg',
    'cityGbg',
    'stateGbg',
    'postcodeGbg',
    'drivingLicenceNumberGbg',
    'drivingLicenceStateGbg'
  ], //驾照
  2: [
    'firstNameGbg',
    'surNameGbg',
    'dobGbg',
    'buildingGbg',
    'streetGbg',
    'cityGbg',
    'stateGbg',
    'postcodeGbg',
    'shortPassportNumberGbg',
    'passportCountryGbg'
  ], //澳洲护照
  3: [
    'firstNameGbg',
    'surNameGbg',
    'dobGbg',
    'buildingGbg',
    'streetGbg',
    'cityGbg',
    'stateGbg',
    'postcodeGbg',
    'passportMrzNumberFullGbg',
    'genderGbg',
    'countryOfOriginGbg',
    'passportDateOfExpiryGbg'
  ], //国际护照
  4: [
    'firstNameGbg',
    'surNameGbg',
    'dobGbg',
    'buildingGbg',
    'streetGbg',
    'cityGbg',
    'stateGbg',
    'postcodeGbg',
    'drivingLicenceNumberGbg',
    'drivingLicenceStateGbg',
    'medicareNumberGbg',
    'medicareReferenceNumberGbg',
    'dateOfExpiryGbg',
    'cardColourGbg'
  ], //医保卡
  5: ['residentIdentityNumberGbg', 'foreNameGbg', 'surNameZhGbg', 'countryGbg'] //中国验证
};
export default class OwnerInfo extends PureComponent {
  constructor(props) {
    super();
    this.state = {
      tabs: [],
      activeTab: 'baseInfo',
      formColumns: props.formColumns
    };
  }
  componentDidMount() {
    console.log('this.onChange(initialValues.step1);', this.props);
    this.onChange(this.props.ownerInfo.baseInfo);
    const tabs = this.filterTabs();
    const activeTab = tabs[0].eventKey;
    this.setState({
      tabs,
      activeTab
    });
  }

  filterTabs = () => {
    const {
      filteredRights,
      ownerInfoModule,
      appropriatenessTestStatus
    } = this.props;

    return ownerInfoModule.filter(item => {
      return item.right === 'appropriatenessTestInfo'
        ? filteredRights.show[item.right] && appropriatenessTestStatus
        : filteredRights.show[item.right];
    });
  };

  changeTab = ({ key: activeTab }) => {
    this.setState(
      {
        activeTab
      },
      () => {
        if (activeTab === 'appropriatenessTestInfo') {
          this.disableEdit();
        }
      }
    );
  };

  getTaUserMessage = () => {
    const { taUserInfo } = this.props;

    return taUserInfo.name ? (
      <FormattedMessage
        id="account.account_customer_binding.ta_user"
        defaultMessage={i18n['account.account_customer_binding.ta_user']}
        values={{ name: taUserInfo.name }}
      />
    ) : (
      ''
    );
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

  enableEdit = () => {
    const {
      ownerRelatedInfo: { customer, accountId },
      showTipsModal
    } = this.props;

    if (customer.value && accountId.length > 1) {
      const content = () => {
        const tip = this.getTaUserMessage();

        return (
          <span>
            <FormattedMessage
              id="account.edit_account_owner_info_tips"
              defaultMessage={i18n['account.edit_account_owner_info_tips']}
              values={{ name: customer.label, tip, number: accountId.length }}
            />
          </span>
        );
      };

      showTipsModal({
        content: content(),
        onConfirm: cb => {
          this.setState({
            editable: true
          });
          cb();
        }
      });
    } else {
      this.setState({
        editable: true
      });
    }
  };

  disableEdit = () => {
    const { resetForm } = this.props;

    this.setState({
      editable: false
    });
    // resetForm(OWNER_FORM);
  };

  onSubmit = (formName, tabKey, values) => {
    const {
      accountId,
      currentServer,
      showTopAlert,
      ownerRelatedInfo: { customer },
      onSingleFormSubmit,
      ownerInfo,
      showTipsModal
    } = this.props;
    const info = Object.keys(values).reduce((value, currentValue) => {
      const form = tabKey;
      const key = currentValue;

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
      [tabKey]: info[tabKey] || {}
    };
    // 不更新 customerInfo 了，单独做了一个form来提交
    data.customerInfo = null;
    // 如果修改了账户姓名
    if (formName === 'BASE_INFO_FORM') {
      const accountName1 = _.get(ownerInfo, 'baseInfo.accountName', 1);
      const accountName2 = _.get(data, 'baseInfo.accountName', 1);
      data.isSyncName2Customer = false;
      if (accountName1 !== accountName2) {
        showTipsModal({
          title: i18n['account.edit_account_owner_info.accoutName'],
          content: i18n['account.edit_account_owner_info.accoutName.warn'],
          maskClosable: false,
          onConfirm: cb => {
            data.isSyncName2Customer = true;
            this.submitData({
              formName,
              tabKey,
              accountId,
              data,
              currentServer
            });
            cb();
          },
          onCancel: cb => {
            this.submitData({
              formName,
              tabKey,
              accountId,
              data,
              currentServer
            });
            cb();
          },
          confirmBtnText: i18n['account.edit_account_owner_info.confirm'],
          cancelBtnText: i18n['account.edit_account_owner_info.cancel']
        });
      } else {
        this.submitData({ formName, tabKey, accountId, data, currentServer });
      }
    } else {
      this.submitData({ formName, tabKey, accountId, data, currentServer });
    }
  };
  submitData = ({ formName, tabKey, accountId, data, currentServer }) => {
    const { onSingleFormSubmit, updateOwnerInfo } = this.props;
    onSingleFormSubmit(
      formName,
      updateOwnerInfo(tabKey, accountId, data, currentServer)
    );
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

  filterColumns = () => {
    const { filteredRights } = this.props;
    const { formColumns } = this.state;
    const result = {};
    for (let form in formColumns) {
      result[form] = formColumns[form].map(item => ({
        ...item,
        type: item.key === 'bankAccount' ? 'edit' : undefined,
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
          : item.key === 'bankAccount'
            ? i18n['withdraw.add_bank.tip']
            : item.placeHolder
      }));
    }

    return result;
  };

  onVerify = data => {
    const { verifyIdentity, currentServer, accountId } = this.props;
    verifyIdentity(accountId, currentServer, data);
  };

  onFormChange = formName => {
    const { globalFormChange, changedFormArray } = this.props;
    if (!changedFormArray.includes(formName)) {
      globalFormChange(formName);
    }
  };

  onFormSubmitFailed = formName => {
    const { globalFormFailed } = this.props;
    globalFormFailed(formName);
    setTimeout(() => {
      let errorDom = document
        .querySelectorAll('[class*=error]')[0]
        .querySelector('input');
      errorDom
        ? errorDom.focus()
        : document.querySelectorAll('[class*=error]')[0].focus();
    }, 0);
  };
  onChange = (newData, dispatch, props) => {
    let basicInfoFields = [...this.props.formColumns.baseInfo];
    //澳洲验证判断
    const hasType = basicInfoFields.find(el => {
      return el.key === 'certificateTypeGbg';
    });
    basicInfoFields = basicInfoFields.filter(el => {
      if (el.key.indexOf('Gbg') !== -1 && el.key !== 'certificateTypeGbg') {
        return newData.certificateTypeGbg
          ? typeMap[newData.certificateTypeGbg].includes(el.key)
          : !hasType
            ? true
            : false;
      } else {
        return true;
      }
    });
    this.setState({
      formColumns: {
        ...this.state.formColumns,
        baseInfo: basicInfoFields
      }
    });
  };
  render() {
    const {
      tabs,
      activeTab,
      formColumns,
      showMergeModal,
      selectedCustomer
    } = this.state;
    const {
      ownerRelatedInfo,
      accountId,
      filteredRights,
      ownerInfo: { appropriatenessTestInfo },
      currentServer: { serverId, vendor },
      ownerInfo,
      globalFormChange,
      failedFormArray
    } = this.props;
    let editable = true;
    if (
      filteredRights &&
      filteredRights.update &&
      filteredRights.update.ownerInfo
    ) {
      if (activeTab === 'appropriatenessTestInfo') {
        editable = false;
      }
    } else {
      editable = false;
    }
    const columns = this.filterColumns();
    console.log('columns1', columns);
    const fields = [...columns[activeTab]];
    const taUser = this.getTaUserMessage();
    return (
      <div className={cs['owner-info']}>
        <div className={cs['header']}>
          <Icon fontType="bw" icon="profile" className={cs['icon']} />
          {i18n['account.edit_account.account_owner_info']}{' '}
          {ownerRelatedInfo.accountId.length > 1 ? (
            <span className={cs['relate-account']}>
              <FormattedMessage
                id="account.edit_account_owner_info.related_account"
                defaultMessage={
                  i18n['account.edit_account_owner_info.related_account']
                }
                values={{
                  list: (
                    <span>
                      {ownerRelatedInfo.accountId
                        .filter(id => id != accountId)
                        .join(i18n['general.dot'])}
                    </span>
                  )
                }}
              />
            </span>
          ) : (
            undefined
          )}
          <div className={cs['more']}>
            {filteredRights.verify && !globalFormChange.length ? (
              <VerifyIdButton
                data={ownerInfo}
                buttonClassName={cs['verify-btn']}
                fields={formColumns}
                fieldKeys={['baseInfo', 'financialInfo', 'certificatesInfo']}
                onSubmit={this.onVerify}
              />
            ) : (
              undefined
            )}
          </div>
        </div>
        <div className={cs['content']}>
          <Menu
            selectedKeys={[activeTab]}
            mode="horizontal"
            onSelect={this.changeTab}
          >
            {tabs.map(tab => {
              return (
                <Menu.Item
                  key={tab.eventKey}
                  className={
                    failedFormArray.includes(tab.eventKey) ? cs['red'] : ''
                  }
                >
                  {tab.label}
                </Menu.Item>
              );
            })}
          </Menu>
          <div className={cs['line']} />
          <div className={activeTab === 'baseInfo' ? cs['show'] : cs['hidden']}>
            <ReduxFormWraper
              reduxForm={BaseInfoForm}
              fields={columns.baseInfo}
              activeTab="baseInfo"
              initialValues={ownerInfo.baseInfo}
              disabled={!editable}
              onChange={this.onChange}
              onSubmit={this.onSubmit.bind(this, BASE_INFO_FORM, 'baseInfo')}
              onFocus={this.onFormChange.bind(this, BASE_INFO_FORM)}
              onSubmitFail={this.onFormSubmitFailed.bind(this, 'baseInfo')}
              newFormField
              pure
            />
          </div>
          <div
            className={
              activeTab === 'financialInfo' ? cs['show'] : cs['hidden']
            }
          >
            <ReduxFormWraper
              reduxForm={FinancialInfoForm}
              fields={columns.financialInfo}
              initialValues={ownerInfo.financialInfo}
              disabled={!editable}
              onSubmit={this.onSubmit.bind(
                this,
                FINANCIAL_INFO_FORM,
                'financialInfo'
              )}
              onFocus={this.onFormChange.bind(this, FINANCIAL_INFO_FORM)}
              onSubmitFail={this.onFormSubmitFailed.bind(this, 'financialInfo')}
              newFormField
              pure
            />
          </div>
          <div
            className={
              activeTab === 'certificatesInfo' ? cs['show'] : cs['hidden']
            }
          >
            <ReduxFormWraper
              reduxForm={CertificatesInfoForm}
              fields={columns.certificatesInfo}
              initialValues={ownerInfo.certificatesInfo}
              disabled={!editable}
              onSubmit={this.onSubmit.bind(
                this,
                CERTIFICATES_INFO_FORM,
                'certificatesInfo'
              )}
              onFocus={this.onFormChange.bind(this, CERTIFICATES_INFO_FORM)}
              onSubmitFail={this.onFormSubmitFailed.bind(
                this,
                'certificatesInfo'
              )}
              newFormField
              pure
            />
          </div>
          <div
            className={
              activeTab === 'classificationInfo' ? cs['show'] : cs['hidden']
            }
          >
            <ReduxFormWraper
              reduxForm={ClassificationInfoForm}
              fields={columns.classificationInfo}
              initialValues={ownerInfo.classificationInfo}
              disabled={!editable}
              onSubmit={this.onSubmit.bind(
                this,
                CLASSIFICATION_INFO_FORM,
                'classificationInfo'
              )}
              onFocus={this.onFormChange.bind(this, CLASSIFICATION_INFO_FORM)}
              onSubmitFail={this.onFormSubmitFailed.bind(
                this,
                'classificationInfo'
              )}
              newFormField
              pure
            />
          </div>
          <div
            className={
              activeTab === 'appropriatenessTestInfo'
                ? cs['show']
                : cs['hidden']
            }
          >
            <ReduxFormWraper
              reduxForm={TestInfoForm}
              fields={columns.appropriatenessTestInfo}
              initialValues={ownerInfo.appropriatenessTestInfo}
              disabled={!editable}
              onSubmit={this.onSubmit.bind(
                this,
                TEST_INFO_FORM,
                'appropriatenessTestInfo'
              )}
              onFocus={this.onFormChange.bind(this, TEST_INFO_FORM)}
              onSubmitFail={this.onFormSubmitFailed.bind(
                this,
                'appropriatenessTestInfo'
              )}
              newFormField
              pure
            />
          </div>
        </div>
        {editable || activeTab === 'classificationInfo' ? (
          <div className={cs['actions']}>
            {activeTab === 'classificationInfo' ? (
              <Button type="primary" onClick={this.onExport}>
                {i18n['general.export']}
              </Button>
            ) : (
              undefined
            )}
          </div>
        ) : (
          undefined
        )}
        {activeTab === 'appropriatenessTestInfo' &&
        appropriatenessTestInfo.detail ? (
          <div className={cs['actions']}>
            <a
              href={`/adaptiveTest/${accountId}?serverId=${serverId}&vendor=${vendor}`}
              target="_blank"
              className="btn btn-primary main-color-bg"
            >
              {i18n['appropriateness.view_detail']}
            </a>
          </div>
        ) : (
          undefined
        )}
      </div>
    );
  }
}
