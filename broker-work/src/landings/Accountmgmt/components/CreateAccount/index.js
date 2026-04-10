import { Nav, NavItem, Button } from 'react-bootstrap';
import CardPanel from 'components/CardPanel';
import SearchCustomer from '../../containers/SearchCustomer';
import CreateAccountOwnerInfo from '../../containers/CreateAccountOwnerInfo';
import AccountInfo from '../CreateAccountInfo';
import { ACCOUNT_OWNER_INFO_FORM } from '../AccountOwnerInfoForm';
import { ACCOUNT_INFO_FORM } from '../CreateAccountInfo/AccountInfoForm';
import cs from './CreateAccount.less';
import { setTrimString } from 'utils/trim';
import i18n from 'utils/i18n';

const accountOwnerInfoDefaultKeys = {
  accountBaseInfo: {
    accountName: 'customName',
    phones: 'phones',
    email: 'email',
    birthday: 'birthday',
    gender: 'gender',
    address: 'address',
    im: 'im',
    standbyTelephone: 'standbyTelephone'
  },
  certificatesInfo: {},
  financialInfo: {}
};

export default class CreateAccount extends PureComponent {
  state = {
    activeTab: 'newCustomer',
    isEditing: true,
    hasBind: false,
    next: false
  };

  status = {
    accountInfo: false,
    accountOwnerInfo: false
  };

  saving = false;

  changeTab = activeTab => {
    this.resetStatus();
    this.setSelectedCustomer({});
    this.setState({
      activeTab
    });
  };

  onClose = () => {
    const { onClose } = this.props;

    this.resetStatus();
    this.setSelectedCustomer({});
    this.setState({
      activeTab: 'newCustomer',
      isEditing: true,
      hasBind: false,
      next: false
    });

    if (onClose) onClose();
  };

  setSelectedCustomer = selected => {
    const { setSelectedCustomer } = this.props;

    setSelectedCustomer(selected);
  };

  onSelectCustomer = selected => {
    const {
      getAccountOwnerInfo,
      setDefaultAccountOwner,
      setAccountOwnerInfo,
      currentServer
    } = this.props;

    this.setSelectedCustomer(selected);

    getAccountOwnerInfo(
      selected.value,
      'CUSTOMER',
      currentServer.value
    ).then(({ data }) => {
      const hasBind = Object.keys(data).length;
      let info = data;

      if (!hasBind) {
        info = {};
        for (let key in accountOwnerInfoDefaultKeys) {
          info[key] = {};

          for (let _key in accountOwnerInfoDefaultKeys[key]) {
            info[key][_key] =
              selected._originData[accountOwnerInfoDefaultKeys[key][_key]];
          }
        }
      }

      setAccountOwnerInfo(info);
      setDefaultAccountOwner(selected._originData);

      this.setState({
        hasBind,
        isEditing: !hasBind
      });
    });
  };

  next = () => {
    this.setState({
      next: true
    });
  };

  prev = () => {
    const {
      accountOwnerInfoFormValues,
      accountOwnerInfo,
      accountOwnerInfoColumns,
      setAccountOwnerInfo,
      accountInfoFormValues,
      accountInfo,
      accountInfoColumns,
      setAccountInfo
    } = this.props;

    if (accountOwnerInfoFormValues) {
      const copyData = JSON.parse(JSON.stringify(accountOwnerInfo));

      for (const key in accountOwnerInfoColumns) {
        if (!copyData[key]) copyData[key] = {};
        for (const col of accountOwnerInfoColumns[key]) {
          copyData[key][col.key] = accountOwnerInfoFormValues[col.key];
        }
      }

      setAccountOwnerInfo(copyData);
    }

    if (accountInfoFormValues) {
      const copyData = JSON.parse(JSON.stringify(accountInfo));

      for (let col of accountInfoColumns) {
        copyData[col.key] = accountInfoFormValues[col.key];
      }

      setAccountInfo(copyData);
    }

    this.setState({
      next: false
    });
  };

  newNext = () => {
    const { submitForm } = this.props;

    submitForm(CUSTOMER_INFO_FORM);
  };

  toggleEditingStatus = isEditing => {
    this.setState({
      isEditing
    });
  };

  resetStatus = () => {
    const { setAccountOwnerInfo, setAccountInfo } = this.props;

    setAccountOwnerInfo({});
    setAccountInfo({});
    this.status = {
      accountInfo: false,
      accountOwnerInfo: false
    };
    this.saving = false;
  };

  saveInfo = (info, type) => {
    const { setAccountOwnerInfo, setAccountInfo } = this.props;
    if (type === 'accountInfo') {
      Promise.resolve(setAccountInfo(info)).then(() => {
        this.status[type] = true;

        if (
          this.status.accountInfo &&
          this.status.accountOwnerInfo &&
          !this.saving
        ) {
          this.save();
        }
      });
    } else {
      const basicInfo = info['accountBaseInfo'];
      for (let name in basicInfo) {
        if (['phones', 'standbyTelephone'].includes(name) && basicInfo[name]) {
          basicInfo[name]['phone'] = setTrimString(basicInfo[name]['phone']);
        }
        if (['email', 'homeNumber'].includes(name) && basicInfo[name]) {
          basicInfo[name] = setTrimString(basicInfo[name]);
        }
      }
      const submitInfo = Object.assign({}, info, {
        accountBaseInfo: basicInfo
      });
      Promise.resolve(setAccountOwnerInfo(submitInfo)).then(() => {
        this.status[type] = true;

        if (
          this.status.accountInfo &&
          this.status.accountOwnerInfo &&
          !this.saving
        ) {
          this.save();
        }
      });
    }
  };

  saveInfoFail = (info, type) => {
    this.status[type] = false;
    this.saving = false;

    return info;
  };

  save = () => {
    const {
      accountInfo,
      accountOwnerInfo,
      selectedCustomer,
      createAccount,
      createAccountForNew,
      currentServer,
      showTopAlert
    } = this.props;
    const {
      accountBaseInfo,
      certificatesInfo,
      financialInfo
    } = accountOwnerInfo;
    const copyAccountInfo = JSON.parse(JSON.stringify(accountInfo));
    const copyBaseInfo = JSON.parse(JSON.stringify(accountBaseInfo));
    const copyFinacialInfo = JSON.parse(JSON.stringify(financialInfo));
    const copyCertificatesInfo = JSON.parse(JSON.stringify(certificatesInfo));
    const { activeTab } = this.state;

    this.saving = true;

    copyAccountInfo.readOnly = copyAccountInfo.readOnly == 1 ? 1 : 0;
    copyAccountInfo.enable = parseInt(copyAccountInfo.enable);

    if (copyAccountInfo.userId) {
      copyAccountInfo.userId = copyAccountInfo.userId.value;
    }

    delete copyBaseInfo.accounts;

    const info = {
      accountInfo: copyAccountInfo,
      accountBaseInfo: copyBaseInfo,
      financialInfo: copyFinacialInfo,
      certificatesInfo: copyCertificatesInfo
    };

    if (activeTab === 'hasCustomer') {
      createAccount(
        info,
        selectedCustomer.value,
        currentServer.value
      ).then(({ result }) => {
        if (result) {
          showTopAlert({
            bsStyle: 'success',
            content: i18n['account.create_account.create_success']
          });
          this.onSave();
          this.resetStatus();
        } else {
          this.status = {
            accountInfo: false,
            accountOwnerInfo: false
          };
          this.saving = false;
        }
      });

      return;
    }

    createAccountForNew(info, currentServer.value).then(({ result }) => {
      if (result) {
        showTopAlert({
          bsStyle: 'success',
          content: i18n['account.create_account.create_success']
        });
        this.onSave();
        this.resetStatus();
      } else {
        this.status = {
          accountInfo: false,
          accountOwnerInfo: false
        };
        this.saving = false;
      }
    });
  };

  onSave = () => {
    const { onSave, setDefaultAccountOwner } = this.props;

    setDefaultAccountOwner({});
    this.setSelectedCustomer({});
    this.setState({
      activeTab: 'hasCustomer',
      next: false
    });

    if (onSave) onSave();
  };

  finish = () => {
    const { submitForm } = this.props;
    const { hasBind, isEditing, activeTab } = this.state;

    if (
      (hasBind && isEditing) ||
      activeTab === 'newCustomer' ||
      (!hasBind && isEditing)
    ) {
      submitForm(ACCOUNT_OWNER_INFO_FORM);
    } else {
      this.status.accountOwnerInfo = true;
    }

    submitForm(ACCOUNT_INFO_FORM);
  };

  render() {
    const {
      show,
      selectedCustomer,
      defaultAccountOwner,
      accountInfo,
      userGroupList,
      mtGroupList,
      accountInfoColumns,
      updateAccountOwner,
      currentServer,
      leverageList,
      maxLeverageList,
      currencyList,
      passwordRegular,
      getAccountOwnerById,
      accountOwner,
      customerSourceList
    } = this.props;
    const { activeTab, next, isEditing, hasBind } = this.state;
    return (
      <CardPanel
        show={show}
        onClose={this.onClose}
        title={i18n['account.create_account.title']}
      >
        <div className={cs['status-bar']}>
          <div className={`${cs['status']} ${cs['active']}`}>
            <span>1</span>
            {i18n['account.create_account.status.first']}
          </div>
          <div
            className={`${cs['status']} ${next || activeTab === 'newCustomer'
              ? cs['active']
              : ''}`}
          >
            <span>2</span>
            {i18n['account.create_account.status.next']}
          </div>
        </div>
        {next ? (
          undefined
        ) : (
          <Nav bsStyle="tabs" activeKey={activeTab} onSelect={this.changeTab}>
            <NavItem eventKey="newCustomer">
              {i18n['account.create_account.tabs.new_customer']}
            </NavItem>
            <NavItem eventKey="hasCustomer">
              {i18n['account.create_account.tabs.has_customer']}
            </NavItem>
          </Nav>
        )}
        {next ? (
          undefined
        ) : (
          <div className={cs['tab-content']}>
            {activeTab === 'hasCustomer' ? (
              <div className={cs['search-bar']}>
                <span className="required" />
                {i18n['account.create_account.binding.customer_name']}
                <SearchCustomer
                  className={cs['search-dropdown']}
                  selectedCustomer={selectedCustomer}
                  onSelect={this.onSelectCustomer}
                />
              </div>
            ) : (
              undefined
            )}
          </div>
        )}
        {next || activeTab === 'newCustomer' ? (
          <div>
            <CreateAccountOwnerInfo
              isEditing={isEditing}
              showSaveBtn={hasBind}
              toggleEditingStatus={this.toggleEditingStatus}
              onSave={this.saveInfo}
              onFail={this.saveInfoFail}
            />
            <AccountInfo
              selectedCustomer={selectedCustomer}
              customerSourceList={customerSourceList}
              accountOwner={accountOwner}
              updateAccountOwner={updateAccountOwner}
              getAccountOwnerById={getAccountOwnerById}
              passwordRegular={passwordRegular}
              defaultAccountOwner={defaultAccountOwner}
              columns={accountInfoColumns}
              userGroupList={userGroupList}
              mtGroupList={mtGroupList}
              leverageList={leverageList}
              maxLeverageList={maxLeverageList}
              currencyList={currencyList}
              currentServer={currentServer}
              info={accountInfo}
              onFail={this.saveInfoFail}
              onSave={this.saveInfo}
            />
          </div>
        ) : (
          undefined
        )}
        <CardPanel.Footer>
          {!next && activeTab === 'hasCustomer' ? (
            <Button
              bsStyle="primary"
              onClick={this.next}
              disabled={!selectedCustomer.value}
            >
              {i18n['account.create_account.buttons.next']}
            </Button>
          ) : (
            undefined
          )}
          {next ? (
            <Button bsStyle="primary" onClick={this.prev}>
              {i18n['account.create_account.buttons.prev']}
            </Button>
          ) : (
            undefined
          )}
          {next || activeTab === 'newCustomer' ? (
            <Button bsStyle="primary" onClick={this.finish}>
              {i18n['account.create_account.buttons.finish']}
            </Button>
          ) : (
            undefined
          )}
          <Button onClick={this.onClose}>
            {i18n['account.create_account.buttons.cancel']}
          </Button>
        </CardPanel.Footer>
      </CardPanel>
    );
  }
}
