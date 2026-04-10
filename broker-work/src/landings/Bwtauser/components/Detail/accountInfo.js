import i18n from 'utils/i18n';
import cs from './index.less';
import { Table as UiTable, Card, Button, Dialog } from 'lean-ui';
import moment from 'moment';
import { dateTimeFormatStyle } from 'utils/config';
import { TW_USER_ACCOUNT_DETAIL } from '../../constants';
import { NavLink as Link } from 'react-router-dom';
import LoginSearch from './LoginSearch';
import BindAccountForm, { BIND_ACCOUNT_FORM } from './bindAccountForm';
import { simAccountBind } from '../../controls/actions';
const { Td, Th } = UiTable;
export default class AccountInfo extends Component {
  state = {
    showBindModal: false
  };
  componentDidMount() {
    const { getServerList } = this.props;
    getServerList();
  }
  renderCell = ({ rowData, listData }) => {
    const { userRights } = this.props;
    const key = listData.value;
    let clickHandler = null;
    let content = null;
    let title;
    switch (key) {
      case 'bindTime':
        title = content =
          rowData.bindTime &&
          moment(rowData.bindTime).format(dateTimeFormatStyle);
        break;
      case 'state':
        title = content =
          i18n[`tausermgmt.detail.account.state_${rowData.isActive}`];
        break;
      case 'account':
        title = rowData.account;
        content =
          rowData.accountType === 'Demo' && userRights['VIEW_DEMO_ACCOUNT'] ? (
            <Link
              to={`/accountmgmt/${rowData.account}?vendor=${
                rowData.vendor
              }&serverId=${rowData.serverId}&isSimAccount=true`}
            >
              {rowData.account}
            </Link>
          ) : (
            rowData.account
          );
        break;
      default:
        title = content = rowData[key];
        break;
    }
    return (
      <Td
        key={key}
        className={'active-actions'}
        onClick={clickHandler}
        title={title}
      >
        {content}
      </Td>
    );
  };
  renderHeadCell = ({ item, index, fixed }) => {
    return (
      <Th key={index} fixed={fixed}>
        {item.label}
      </Th>
    );
  };
  bindSimaccount = () => {
    const { submitForm } = this.props;
    submitForm(BIND_ACCOUNT_FORM);
  };
  showSimModal = () => {
    this.setState({
      showBindModal: true
    });
  };
  closeSimModal = () => {
    this.setState({
      showBindModal: false
    });
  };
  submitSimAccount = vals => {
    const {
      simAccountBind,
      simAccountCheckBind,
      userInfo,
      showTipsModal,
      refresh
    } = this.props;
    const { userNo, name, customerId } = userInfo;
    const { login, serverId: server } = vals;
    let submitData = {
      userNo,
      name,
      customerId,
      accountId: login.value,
      accountName: login.label,
      serverId: server.serverId,
      vendor: server.vendor,
      serverName: server.serverName
    };
    simAccountCheckBind(submitData).then(({ result, data }) => {
      if (result) {
        if (data) {
          showTipsModal({
            content: i18n['tausermgmt.detail.account.bind_sim_account.warn'],
            onConfirm: cb => {
              simAccountBind(submitData).then(() => {
                cb();
                this.closeSimModal();
                refresh();
              });
            }
          });
        } else {
          simAccountBind(submitData).then(() => {
            refresh();
            this.closeSimModal();
          });
        }
      }
    });
  };
  render() {
    const { demoServerList, userInfo, userRights } = this.props;
    const { tradeAccounts = [] } = userInfo;
    const { showBindModal } = this.state;
    return (
      <Card className={cs['card-style']}>
        <h3 className={cs['form-title']}>
          {i18n['tausermgmt.detail.account.title']}
          {userRights['BIND_DEMO_ACCOUNT'] ? (
            <Button type="primary" onClick={this.showSimModal}>
              {i18n['tausermgmt.detail.account.bind_sim_account']}
            </Button>
          ) : null}
        </h3>
        <UiTable
          data={tradeAccounts}
          columns={TW_USER_ACCOUNT_DETAIL}
          renderCell={this.renderCell}
          renderHeadCell={this.renderHeadCell}
        />
        {showBindModal ? (
          <Dialog
            visible
            title={i18n['tausermgmt.detail.account.bind_sim_account.title']}
            onCancel={this.closeSimModal}
            onOk={this.bindSimaccount}
            okText={i18n['tausermgmt.detail.account.bind_sim_account.ok']}
            cancelText={i18n['general.cancel']}
          >
            <BindAccountForm
              demoServerList={demoServerList}
              onSubmit={this.submitSimAccount}
            />
          </Dialog>
        ) : null}
      </Card>
    );
  }
}
