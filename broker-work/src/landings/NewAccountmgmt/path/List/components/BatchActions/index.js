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
import { Menu } from 'lean-ui';
import { filterRights } from './process';
import TextButton from 'components/v2/TextButton';
import SendMessage from '../../containers/SendMessage';
import LoginStatus from '../../containers/LoginStatus';
import ReadOnly from '../../containers/ReadOnly';

export default class BatchActions extends PureComponent {
  state = {
    ownership: false,
    leverage: false,
    group: false,
    balance: false,
    credit: false,
    sendMsg: false,
    enable: false,
    readOnly: false
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
  onSelect = key => {
    const {
      selectedAccountIds,
      currentServer,
      showTipsModal,
      cancel,
      showTopAlert,
      onChange,
      sourceId,
      updateSelectedAccountIds
    } = this.props;
    const state = Object.assign(
      {},
      {
        ownership: false,
        leverage: false,
        group: false,
        balance: false,
        credit: false,
        enable: false,
        readOnly: false
      },
      {
        [key]: true
      }
    );
    this.setState(state);
  };
  render() {
    const {
      selectedAccountIds,
      updateSelectedAccountIds,
      currentServer: { vendor }
    } = this.props;
    const filteredRights = this.filterRights();
    const props = {
      onChange: this.onChange,
      cancel: this.cancel,
      filteredRights,
      selectedKeys: [],
      closeModal: this.closeModal,
      onSelect: this.onSelect
    };
    const {
      ownership,
      leverage,
      group,
      balance,
      credit,
      sendMsg,
      enable,
      readOnly
    } = this.state;
    return (
      <div className={cs['batch-actions']}>
        <TextButton
          text={i18n['general.cancel']}
          onClick={() => updateSelectedAccountIds([])}
        />
        {filteredRights.ownership ? (
          <Ownership {...props} modalVisible={ownership} />
        ) : (
          undefined
        )}
        {filteredRights.leverage ? (
          <Leverage {...props} modalVisible={leverage} />
        ) : (
          undefined
        )}
        {filteredRights.group || filteredRights.accountGroup ? (
          <Group {...props} modalVisible={group} />
        ) : (
          undefined
        )}
        {filteredRights.remove ? <Remove {...props} /> : undefined}
        {filteredRights.balance ? (
          <Balance {...props} modalVisible={balance} />
        ) : (
          undefined
        )}
        {filteredRights.credit ? (
          <Credit {...props} modalVisible={credit} />
        ) : (
          undefined
        )}
        {filteredRights.export && selectedAccountIds.length === 1 ? (
          <Pdf {...props} />
        ) : (
          undefined
        )}
        {filteredRights.sendMsg ? (
          <SendMessage {...props} modalVisible={sendMsg} />
        ) : (
          undefined
        )}
        {filteredRights.enable && vendor !== 'CTRADER' ? (
          <LoginStatus {...props} modalVisible={enable} />
        ) : (
          undefined
        )}
        {filteredRights.readOnly && vendor !== 'CTRADER' ? (
          <ReadOnly {...props} modalVisible={readOnly} />
        ) : (
          undefined
        )}
      </div>
    );
  }
}
