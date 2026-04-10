import i18n from 'utils/i18n';
import cs from './style.less';
import { FormattedMessage } from 'react-intl';
import Ownership from '../../containers/Ownership';
import Leverage from '../../containers/Leverage';
import Group from '../../containers/Group';
import Remove from '../../containers/Remove';
import Balance from '../../containers/Balance';
import Credit from '../../containers/Credit';
import Pdf from '../../containers/Pdf';
import SendMessage from '../../containers/SendMessage';
import { Menu } from 'lean-ui';
import { filterRights } from './process';
import { saveAccountPdf } from 'utils/PdfData';

export default class BatchActionsItem extends PureComponent {
  state = {
    ownership: false,
    leverage: false,
    group: false,
    balance: false,
    credit: false,
    sendMsg: false,
    loginstatus: false,
    readonly: false
  };
  cancel = () => {
    const { selectedAccountIds, updateSelectedAccountIds } = this.props;

    updateSelectedAccountIds(selectedAccountIds, false);
  };

  onChange = () => {
    const { onChange } = this.props;

    this.cancel();
    onChange();
  };

  filterRights = () => {
    const {
      rights,
      currentPrivilegeType,
      currentServer: { vendor }
    } = this.props;
    return filterRights(rights, currentPrivilegeType, vendor);
  };
  closeModal = key => {
    this.setState({
      [key]: false
    });
  };
  onSelect = ({ key }) => {
    const {
      getExportInfo,
      selectedAccountIds,
      currentServer,
      showTipsModal,
      cancel,
      showTopAlert,
      onChange,
      removeAccount,
      sourceId,
      updateSelectedAccountIds,
      checkAccountCusAndTA
    } = this.props;
    updateSelectedAccountIds([sourceId]);
    if (key === 'export') {
      getExportInfo(sourceId, currentServer).then(({ result, data }) => {
        if (result) {
          showTipsModal({
            content: i18n['account.export_tips_modal.jump_content'],
            header: i18n['account.export_tips_modal.jump_tips'],
            onConfirm: cb => {
              saveAccountPdf(data);
              window.open('/downloadpdf/ACCOUNT_INFO');
              cb();
            }
          });
        }
        cancel ? cancel() : null;
      });
    } else if (key === 'remove') {
      checkAccountCusAndTA(selectedAccountIds, currentServer).then(
        ({ result, data }) => {
          if (result) {
            const { hasCustomer, hasTaUser } = data;
            const content = () => {
              return (
                <div>
                  {hasCustomer ? (
                    <FormattedMessage
                      id="account.remove_account.text.customer"
                      defaultMessage={
                        i18n['account.remove_account.text.customer']
                      }
                      values={{
                        number: <span className={cs['num']}>{hasCustomer}</span>
                      }}
                    />
                  ) : (
                    ''
                  )}
                  {hasTaUser ? (
                    <FormattedMessage
                      id="account.remove_account.text.ta"
                      defaultMessage={i18n['account.remove_account.text.ta']}
                      values={{
                        number: <span className={cs['num']}>{hasTaUser}</span>
                      }}
                    />
                  ) : (
                    ''
                  )}
                  {hasCustomer || hasTaUser ? '；' : ''}
                  {i18n['account.remove_account.text.tips']}
                </div>
              );
            };
            showTipsModal({
              content: content(),
              onConfirm: cb => {
                removeAccount([sourceId], currentServer).then(({ result }) => {
                  if (result) {
                    showTopAlert({
                      bsStyle: 'success',
                      content: i18n['general.remove_success']
                    });
                    updateSelectedAccountIds([]);
                    onChange();
                    cb();
                  }
                });
              }
            });
          }
        }
      );
    } else if (key === 'showLevel') {
      window.open(
        `/showLevelRelation?account=${sourceId}&serverId=${
          currentServer.serverId
        }&vendor=${currentServer.vendor}`
      );
    } else {
      const state = Object.assign(
        {},
        {
          ownership: false,
          leverage: false,
          group: false,
          balance: false,
          credit: false,
          sendMsg: false,
          loginstatus: false,
          readonly: false
        },
        {
          [key]: true
        }
      );
      this.setState(state);
    }
  };
  render() {
    const { selectedAccountIds, rights, userRights } = this.props;
    const filteredRights = this.filterRights();
    const props = {
      isItem: true,
      onChange: this.onChange,
      cancel: this.cancel,
      filteredRights,
      selectedKeys: [],
      closeModal: this.closeModal
    };
    const { ownership, leverage, group, balance, credit, sendMsg } = this.state;
    return (
      <Menu selectedKeys={[]} onClick={this.onSelect}>
        {filteredRights.ownership ? (
          <Menu.Item key="ownership">
            <Ownership {...props} modalVisible={ownership} />
          </Menu.Item>
        ) : (
          undefined
        )}
        {filteredRights.leverage ? (
          <Menu.Item key="leverage">
            <Leverage {...props} modalVisible={leverage} />
          </Menu.Item>
        ) : (
          undefined
        )}
        {filteredRights.group || filteredRights.accountGroup ? (
          <Menu.Item key="group">
            <Group {...props} modalVisible={group} />
          </Menu.Item>
        ) : (
          undefined
        )}
        {filteredRights.balance ? (
          <Menu.Item key="balance">
            <Balance {...props} modalVisible={balance} />
          </Menu.Item>
        ) : (
          undefined
        )}
        {filteredRights.credit ? (
          <Menu.Item key="credit">
            <Credit {...props} modalVisible={credit} />
          </Menu.Item>
        ) : (
          undefined
        )}
        {filteredRights.export ? (
          <Menu.Item key="export">{i18n['account.button.exportPdf']}</Menu.Item>
        ) : (
          undefined
        )}
        {filteredRights.sendMsg ? (
          <Menu.Item key="sendMsg">
            <SendMessage {...props} modalVisible={sendMsg} />
          </Menu.Item>
        ) : (
          undefined
        )}
        {userRights['ACCOUNT_COMMISSIONLEVEL'] && (
          <Menu.Item key={'showLevel'}>
            {i18n['tausermgmt.list.level_relation']}
          </Menu.Item>
        )}
        <Menu.Divider key="divider" />
        {filteredRights.remove ? (
          <Menu.Item key="remove">
            {i18n['account.button.remove_account']}
          </Menu.Item>
        ) : (
          undefined
        )}
      </Menu>
    );
  }
}
