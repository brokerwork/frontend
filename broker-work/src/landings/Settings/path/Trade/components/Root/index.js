import { Button } from 'react-bootstrap';
import NoDataView from 'components/v2/NoDataView';
import UpdateAccountModal from '../../containers/UpdateAccountModal';
import PagePanel from 'components/PagePanel';
import Dropdown from 'components/Dropdown';
import Checkbox from 'components/Checkbox';
import Radio from 'components/Radio';
import Table from 'components/Table';
import i18n from 'utils/i18n';
import { FormattedMessage } from 'react-intl';
import cs from './AccountTradeSetting.less';

const parseDropdownDataList = data => {
  const copyData = data.concat();
  let result = {};

  copyData.forEach(_data => {
    result[_data.serverId] =
      parseInt(_data.groups[0]) === -1
        ? -1
        : _data.groups.map(group => {
            return {
              label: group,
              value: group
            };
          });
  });

  return result;
};
export default class AccountTradeSetting extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: this.formatterData(props),
      mt4GroupsError: false,
      showUpdateAccountModal: false,
      type: 'add',
      accountInfo: {}
    };
  }
  componentDidMount() {
    const { getServerByVendor, getBasicInfo } = this.props;
    Promise.resolve(getServerByVendor('MT4')).then(() => {
      getBasicInfo();
    });
  }
  componentWillReceiveProps(props) {
    this.setState({
      data: this.formatterData(props),
      mt4GroupsError: false
    });
  }
  formatterData = props => {
    const { tradeSetting, serverGroupList } = props;
    const copyData = JSON.parse(JSON.stringify(tradeSetting));
    const isEditing = copyData.id !== undefined;
    serverGroupList.forEach(server => {
      if (
        !copyData.mt4Groups ||
        !copyData.mt4Groups.find(
          group => parseInt(group.serverId) === parseInt(server.serverId)
        )
      ) {
        copyData.mt4Groups.push({
          serverId: server.serverId,
          serverName: server.serverName,
          groups: isEditing ? ['-1'] : []
        });
      }
    });
    copyData.mt4Groups.forEach((item, index) => {
      if (item.groups.length === 0) {
        copyData.mt4Groups[index].groups = ['-1'];
      }
    });

    return copyData;
  };
  parseData = data => {
    const copyData = JSON.parse(JSON.stringify(data));
    copyData.mt4Groups =
      copyData.mt4Groups && parseDropdownDataList(copyData.mt4Groups);
    return copyData;
  };
  setEmail = e => {
    const v = e.target.value;
    const copyData = JSON.parse(JSON.stringify(this.state.data));
    copyData.notifyEmail = v;
    this.setState({
      data: copyData
    });
  };
  setIsSupport = support => {
    const { data } = this.state;
    const copyData = JSON.parse(JSON.stringify(data));
    copyData.enabled = support ? 1 : 0;
    this.setState({
      data: copyData
    });
  };
  selectMt4Groups = (server, selected) => {
    const { data } = this.state;
    const copyData = JSON.parse(JSON.stringify(data));
    const idx = copyData.mt4Groups.findIndex(
      group => parseInt(group.serverId) === parseInt(server.serverId)
    );

    copyData.mt4Groups[idx].groups = selected.map(item => item.value);

    this.setState({
      data: copyData
    });
  };
  saveBasicInfo = () => {
    const { data } = this.state;
    const {
      serverGroupList,
      saveBasicInfo,
      getBasicInfo,
      showTopAlert
    } = this.props;
    const copyData = JSON.parse(JSON.stringify(data));
    copyData.mt4Groups = copyData.mt4Groups.map(item => {
      const currentServer = serverGroupList.find(
        server => server.serverId === item.serverId
      );
      return {
        ...item,
        groups: item.groups.filter(group => {
          return currentServer
            ? currentServer.groups.includes(group) || group === []
            : [];
        })
      };
    });
    Promise.resolve(saveBasicInfo(copyData)).then(res => {
      if (res.result) {
        showTopAlert({
          bsStyle: 'success',
          content: i18n['general.save_success']
        });
        getBasicInfo();
      }
    });
  };
  toggleMt4Groups = (serverId, evt) => {
    const { data } = this.state;
    const copyData = JSON.parse(JSON.stringify(data));
    const checked = evt.target.checked;

    copyData.mt4Groups.find(
      group => parseInt(group.serverId) === parseInt(serverId)
    ).groups = checked ? [] : ['-1'];

    this.setState({
      data: copyData
    });
  };
  _renderTableRow = (item, idx) => {
    return (
      <tr key={idx}>
        <td>{item.name}</td>
        <td>{`${item.serverName}:${item.login}`}</td>
        <td>
          {item.warnMode === 'PERCENT'
            ? `${item.marginWarnPercent}％`
            : item.marginWarn}
        </td>
        <td>{item.accountNum}</td>
        <td>
          {item.commissionEnable === 1 ? (
            <i className={`fa fa-check ${cs['active-check']}`} />
          ) : (
            <i className={'fa fa-times'} />
          )}
        </td>
        <td>
          {item.swapsEnable === 1 ? (
            <i className={`fa fa-check ${cs['active-check']}`} />
          ) : (
            <i className={'fa fa-times'} />
          )}
        </td>
        <td>
          <Button
            title={i18n['general.edit']}
            className={'icon btn-primary'}
            onClick={this.toggleEdit.bind(this, item)}
          >
            <i className="fa fa-pencil" />
          </Button>
          <Button
            title={i18n['general.delete']}
            className="icon"
            onClick={this.onDelete.bind(this, item)}
          >
            <i className="fa fa-times" />
          </Button>
        </td>
      </tr>
    );
  };
  toggleUpdateModal = (type, toggle) => {
    const { getAccountList } = this.props;
    if (toggle) {
      this.setState({
        type: type
      });
    }

    if (!toggle) {
      this.setState({
        showUpdateAccountModal: toggle
      });
      return;
    }

    Promise.resolve(getAccountList()).then(res => {
      if (res.result) {
        this.setState({
          showUpdateAccountModal: toggle
        });
      }
    });
  };
  toggleEdit = item => {
    const copyData = JSON.parse(JSON.stringify(item));
    const commissionEnable = [item.commissionEnable];
    const swapsEnable = [item.swapsEnable];
    copyData.commissionEnable =
      item.commissionEnable === 0 ? [] : commissionEnable;
    copyData.swapsEnable = item.swapsEnable === 0 ? [] : swapsEnable;
    this.setState({ accountInfo: copyData });
    this.toggleUpdateModal('edit', true);
  };
  saveAccount = data => {
    const {
      updateAccount,
      addAccount,
      getBasicInfo,
      showTopAlert
    } = this.props;
    const { type } = this.state;
    Promise.resolve(
      type === 'edit' ? updateAccount(data) : addAccount(data)
    ).then(res => {
      if (res.result) {
        this.toggleUpdateModal(undefined, false);
        showTopAlert({
          bsStyle: 'success',
          content:
            type === 'add'
              ? i18n['general.save_success']
              : i18n['general.modify_success']
        });
        getBasicInfo();
      }
    });
  };
  onDelete = item => {
    const {
      delAccount,
      showTopAlert,
      getBasicInfo,
      showTipsModal
    } = this.props;
    showTipsModal({
      content: (
        <FormattedMessage
          id="settings.trade.delete_tips"
          defaultMessage={i18n['settings.trade.delete_tips']}
          values={{
            name: item.name
          }}
        />
      ),
      onConfirm: cb => {
        delAccount(item.id).then(res => {
          if (res.result) {
            showTopAlert({
              bsStyle: 'success',
              content: i18n['general.remove_success']
            });
            getBasicInfo();
          }
          cb();
        });
      }
    });
  };
  render() {
    const { data, type, showUpdateAccountModal, accountInfo } = this.state;
    const { serverGroupList, tradeSetting } = this.props;
    const copyData = this.parseData(data);
    const serverGroupListDropdownData = parseDropdownDataList(serverGroupList);
    return (
      <PagePanel>
        <PagePanel.Header>
          {i18n['settings.left_menu.account_trade_setting']}
        </PagePanel.Header>
        <PagePanel.Body className="panel-body">
          <div className="form-horizontal">
            <div className="form-group">
              <label className={`col-sm-3 control-label ${cs['label']}`}>
                {i18n['settings.trade.agent_count_label']}:
              </label>
              <div className="col-sm-8">
                <Radio
                  name={'enabled'}
                  inline
                  checked={copyData.enabled === 1}
                  onChange={this.setIsSupport.bind(this, true)}
                >
                  {i18n['settings.trade.support']}
                </Radio>
                <Radio
                  name={'enabled'}
                  inline
                  checked={copyData.enabled !== 1}
                  onChange={this.setIsSupport.bind(this, false)}
                >
                  {i18n['settings.trade.nonsupport']}
                </Radio>
              </div>
            </div>
            <div className="form-group">
              <label className={`col-sm-3 control-label ${cs['label']}`}>
                {i18n['settings.trade.agent_count_group_label']}:
              </label>
              <div className="col-sm-8">
                <table className={cs['dropdown-group']}>
                  <tbody>
                    {serverGroupList.map((server, idx) => {
                      const isEnabled =
                        parseInt(copyData.mt4Groups[server.serverId]) !== -1;
                      const placeholder = isEnabled
                        ? i18n['general.default_select']
                        : i18n['settings.rebate_setting.null'];
                      return (
                        <tr key={idx}>
                          <td>
                            <Checkbox
                              checked={isEnabled}
                              onChange={this.toggleMt4Groups.bind(
                                this,
                                server.serverId
                              )}
                            >
                              {server.serverName}:{' '}
                            </Checkbox>
                          </td>
                          <td>
                            <Dropdown
                              className={cs['dropdown']}
                              data={
                                serverGroupListDropdownData[server.serverId]
                              }
                              value={
                                !isEnabled
                                  ? []
                                  : copyData.mt4Groups[server.serverId]
                              }
                              disabled={!isEnabled}
                              checkbox
                              searchable
                              placeholder={placeholder}
                              onSelect={this.selectMt4Groups.bind(this, server)}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="form-group">
              <label className={`col-sm-3 control-label ${cs['label']}`}>
                {i18n['settings.trade.remind_email']}:
              </label>
              <div className="col-sm-4">
                <input
                  type="text"
                  className="form-control"
                  maxLength="40"
                  value={data.notifyEmail}
                  onChange={this.setEmail}
                />
              </div>
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-3" />
            <Button
              className={`btn btn-primary ${cs['save-button']}`}
              onClick={this.saveBasicInfo}
            >
              {i18n['general.save']}
            </Button>
          </div>
          <Table className={cs['table']} data-test="agent-table">
            <Table.Header>
              <th>{i18n['settings.trade.table_name']}</th>
              <th>{i18n['settings.trade.table_login']}</th>
              <th>{i18n['settings.trade.margin_warn']}</th>
              <th>{i18n['settings.trade.table_releative_account']}</th>
              <th>{i18n['settings.trade.table_fee']}</th>
              <th>{i18n['settings.trade.table_commission']}</th>
              <th>{i18n['settings.trade.table_action']}</th>
            </Table.Header>
            <Table.Body>
              {tradeSetting.users &&
                tradeSetting.users.map(this._renderTableRow.bind(this))}
            </Table.Body>
          </Table>
          <Button
            className="btn btn-primary pull-right"
            onClick={this.toggleUpdateModal.bind(this, 'add', true)}
          >
            {i18n['settings.trade.add_agent_btn']}
          </Button>
          {showUpdateAccountModal ? (
            <UpdateAccountModal
              type={type}
              onSave={this.saveAccount}
              data={type === 'edit' ? accountInfo : undefined}
              onHide={this.toggleUpdateModal.bind(this, undefined, false)}
            />
          ) : (
            undefined
          )}
        </PagePanel.Body>
      </PagePanel>
    );
  }
}
