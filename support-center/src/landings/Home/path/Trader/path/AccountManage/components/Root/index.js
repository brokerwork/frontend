import ContentWrapper from 'components/ContentWrapper';
import i18n from 'utils/i18n';
import List from '../List';
import Button from 'components/Button';
import { Message } from 'lean-ui';
import cs from './index.less';
import CreateModal from '../CreateModal';
import { COLUMNS } from '../../constant';
import { getTenantId } from 'utils/tenantInfo';
import { FormattedMessage } from 'react-intl';
export default class Root extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      eidtIndex: null // 编辑的index
    };
  }
  componentDidMount() {
    const tenantId = getTenantId();
    this.props.getAccountTypeConfig(tenantId);
    this.props.getBrandInfo();
  }
  isModalVisible = (name, visible) => {
    this.setState({
      [name]: visible
    });
  };
  createAdd = () => {
    const {
      accountTypeConfig: { accountTypeInfos }
    } = this.props;
    if (accountTypeInfos.length >= 10) {
      Message.info(i18n['trader.account.manage.add.tips']);
      return;
    }
    this.isModalVisible('modalVisible', true);
    this.setState({
      eidtIndex: null
    });
  };
  openEdit = index => {
    this.isModalVisible('modalVisible', true);
    this.setState({
      eidtIndex: index
    });
  };
  deleteAccount = customerAccountType => {
    const { deleteAccountTypeConfig } = this.props;
  };
  onSortAccount = accountTypeInfos => {
    const { updateAccountTypeConfig, accountTypeConfig, getAccountTypeConfig } = this.props;
    accountTypeConfig.accountTypeInfos = accountTypeInfos;
    updateAccountTypeConfig(accountTypeConfig).then(res => {
      if (res.result) {
        const tenantId = getTenantId();
        getAccountTypeConfig(tenantId);
      }
    });
  };
  enableAccountShow = type => {
    const copyPostData = _.cloneDeep(this.props.accountTypeConfig);
    copyPostData[type] = !copyPostData[type];

    this.props.showTipsModal({
      header: i18n['trader.account.title'],
      content: (
        <FormattedMessage
          id="trader.account.action"
          defaultMessage={i18n['trader.account.action']}
          values={{ action: `${copyPostData[type] ? i18n['trader.account.show'] : i18n['trader.account.hide']}` }}
        />
      ),
      onConfirm: cb => {
        this.props.updateAccountTypeConfig(copyPostData).then(rs => {
          if (rs.result) {
            const tenantId = getTenantId();
            this.props.getAccountTypeConfig(tenantId);
            cb();
          }
        });
      },
      onCancel: cb => {
        cb();
      }
    });
  };
  render() {
    const { modalVisible, eidtIndex } = this.state;
    const {
      brandInfo: { languages = [] } = {},
      submitForm,
      accountTypeConfig: { bwEnable, twEnable, accountTypeInfos },
      accountTypeConfig,
      updateAccountTypeConfig,
      getAccountTypeConfig,
      deleteAccountTypeConfig,
      showTipsModal,
      showTopAlert
    } = this.props;
    return (
      <ContentWrapper header={i18n['left.menu.account.manage']}>
        <div className={cs.add}>
          <Button style="primary" onClick={this.enableAccountShow.bind(this, 'bwEnable')}>
            BW{bwEnable ? i18n['trader.account.show'] : i18n['trader.account.hide']}
          </Button>
          <Button style="primary" onClick={this.enableAccountShow.bind(this, 'twEnable')}>
            TW{twEnable ? i18n['trader.account.show'] : i18n['trader.account.hide']}
          </Button>
          <Button
            style={accountTypeInfos && accountTypeInfos.length > 10 ? 'default' : 'primary'}
            onClick={this.createAdd}
          >
            {i18n['general.createnew']}
          </Button>
        </div>
        <List
          columns={COLUMNS}
          data={accountTypeInfos}
          openEdit={this.openEdit}
          deleteAccountTypeConfig={deleteAccountTypeConfig}
          getAccountTypeConfig={getAccountTypeConfig}
          showTipsModal={showTipsModal}
          showTopAlert={showTopAlert}
          onSortAccount={this.onSortAccount}
        />
        {modalVisible && (
          <CreateModal
            languages={languages}
            submitForm={submitForm}
            accountTypeConfig={accountTypeConfig}
            eidtIndex={eidtIndex}
            updateAccountTypeConfig={updateAccountTypeConfig}
            getAccountTypeConfig={getAccountTypeConfig}
            showTopAlert={showTopAlert}
            onClose={this.isModalVisible.bind(this, 'modalVisible', false)}
          />
        )}
      </ContentWrapper>
    );
  }
}
