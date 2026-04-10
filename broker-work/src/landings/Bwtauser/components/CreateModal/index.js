import i18n from 'utils/i18n';
import CardPanel from 'components/v2/CardPanel';
import { Button, Dialog } from 'lean-ui';
import cs from './style.less';
import SearchCustomer from '../SearchCustomer';
import CreateTwUser, { CREATE_TW_USER_FORM } from './form';
import _ from 'lodash';
import { FormattedMessage } from 'react-intl';
import { toJsRegExpMap } from 'utils/validate';
export default class CreateModal extends PureComponent {
  state = {
    activeTab: 'newCustomer',
    searchCustomer: {},
    formInit: {
      realname: '',
      newPwd: '',
      email: '',
      sendMessage: ['yes']
    },
    searchCustomerError: '',
    showConfirm: false,
    showConfirmContent: '',
    checkTaUserData: null,
    submitVals: null,
    configReady: false
  };
  componentWillMount() {
    const { getPasswordStrength } = this.props;
    getPasswordStrength().then(() => {
      this.setState({
        configReady: true
      });
    });
  }
  onSearchCustomerChange = selected => {
    let data = {};
    if (selected._originData) {
      if (selected._originData.customName)
        data.realname = selected._originData.customName;
      if (selected._originData.email) data.email = selected._originData.email;
      if (selected._originData.phones) data.phone = selected._originData.phones;
    }
    this.setState({
      searchCustomer: selected,
      formInit: {
        ...this.state.formInit,
        ...data
      }
    });
  };
  changeTab = tab => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  };
  onSave = () => {
    const { submitForm } = this.props;
    const { activeTab, searchCustomer } = this.state;
    if (activeTab === 'hasCustomer' && !searchCustomer._originData) {
      this.setState({
        searchCustomerError: i18n['tausermgmt.create_user.bind_old.error']
      });
      return;
    }
    submitForm(CREATE_TW_USER_FORM);
  };
  onSubmit = vals => {
    const { addTaUser, checkTaUser, showTipsModal } = this.props;
    const { searchCustomer } = this.state;
    let data = _.cloneDeep(vals);
    if (vals.phone) {
      data.phone = vals.phone.phone;
      data.countryCode = vals.phone.countryCode;
    }
    if (searchCustomer && searchCustomer._originData) {
      data.customerId = searchCustomer._originData.customerId;
    }
    if (vals.sendMessage && vals.sendMessage.length) {
      data.sendMessage = true;
    } else {
      data.sendMessage = false;
    }
    if (!data.customerId) {
      checkTaUser(data).then(res => {
        if (!res.result) return;
        if (res.hasOwnProperty('data')) {
          this.setState({
            showConfirm: true,
            checkTaUserData: res.data,
            submitVals: data
          });
        } else {
          this.addTaUser(data);
        }
      });
    } else {
      this.addTaUser(data);
    }
  };
  onConfirmHide = () => {
    this.setState({
      showConfirm: false
    });
  };
  onConfirmOk = () => {
    const { addTaUser } = this.props;
    const { submitVals, checkTaUserData } = this.state;
    let copyData = _.cloneDeep(submitVals);
    copyData.customerId = checkTaUserData.customerId;
    this.addTaUser(copyData);
    this.setState({
      showConfirm: false
    });
  };
  onConfirmCancel = () => {
    const { submitVals } = this.state;
    this.addTaUser(submitVals);
    this.setState({
      showConfirm: false
    });
  };
  addTaUser = data => {
    const { addTaUser, onClose, getUsers, params, modifyParams } = this.props;
    addTaUser(data).then(({ result }) => {
      if (result) {
        onClose();
        const _params = {
          ...params,
          page: 1
        };
        modifyParams(_params);
        getUsers(_params);
      }
    });
  };
  render() {
    const { onClose, userRights, passwordStrength } = this.props;
    const {
      activeTab,
      formInit,
      searchCustomerError,
      checkTaUserData,
      showConfirm,
      configReady
    } = this.state;
    return (
      <CardPanel
        show={true}
        onClose={onClose}
        title={i18n['tausermgmt.create_user']}
      >
        <Button.Group className={cs['btg']}>
          <Button
            type={activeTab === 'newCustomer' ? 'primary' : 'default'}
            onClick={this.changeTab.bind(this, 'newCustomer')}
          >
            {i18n['tausermgmt.create_user.new']}
          </Button>
          <Button
            type={activeTab === 'hasCustomer' ? 'primary' : 'default'}
            onClick={this.changeTab.bind(this, 'hasCustomer')}
          >
            {i18n['tausermgmt.create_user.bind_old']}
          </Button>
        </Button.Group>
        {activeTab === 'hasCustomer' ? (
          <SearchCustomer
            onSelect={this.onSearchCustomerChange}
            error={searchCustomerError}
          />
        ) : null}
        <div className={cs['create-tw-user']}>
          {configReady ? (
            <CreateTwUser
              passwordStrength={passwordStrength}
              activeTab={activeTab}
              initialValues={formInit}
              onSubmit={this.onSubmit}
            />
          ) : null}
        </div>
        <CardPanel.Footer>
          <Button className={cs['button-cancel']} onClick={onClose}>
            {i18n['general.cancel']}
          </Button>
          <Button type="primary" onClick={this.onSave}>
            {i18n['general.save']}
          </Button>
        </CardPanel.Footer>
        {showConfirm ? (
          <Dialog
            visible
            onCancel={this.onConfirmHide}
            title={i18n['agent.apply.risk.confirm_title']}
            footer={[
              <Button type="primary" onClick={this.onConfirmOk}>
                {i18n['tausermgmt.create_user.repeat.ok']}
              </Button>,
              <Button onClick={this.onConfirmCancel}>
                {i18n['tausermgmt.create_user.repeat.cancel']}
              </Button>
            ]}
          >
            <FormattedMessage
              id="tausermgmt.create_user.repeat"
              defaultMessage={i18n['tausermgmt.create_user.repeat']}
              values={{
                customerName: `${checkTaUserData.customName}`
              }}
            />
          </Dialog>
        ) : null}
      </CardPanel>
    );
  }
}
