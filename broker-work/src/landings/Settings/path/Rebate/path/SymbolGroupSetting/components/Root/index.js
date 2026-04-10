import PagePanel from 'components/PagePanel';
import OperateGroup from '../OperateGroup';
import DetailModal from '../DetailModal';
import NoDataView from 'components/v2/NoDataView';
import i18n from 'utils/i18n';
import { Table as UiTable, Button, Icon } from 'lean-ui';
const { Td, Th } = UiTable;
import SortableTable from 'components/v2/SortableTable';
import cs from './SymbolGroupSetting.less';
import { SYMBOL_GROUP_HEADER, SYMBOL_GROUP_SORT_HEADER } from '../../constant';
import _ from 'lodash';
import CommonHeader from 'components/v2/CommonHeader';
import moment from 'moment';

export default class SymbolGroupSetting extends PureComponent {
  state = {
    showDetailModal: false,
    showOperateModal: false,
    updateTime: ''
  };
  componentDidMount() {
    const { getGroupList, getServerSymbols, getMt5Symbols } = this.props;

    getGroupList().then(res => {
      if (res.result) {
        this.setState({
          updateTime: res.time
        });
      }
    });

    getServerSymbols().then(({ data }) => {
      const mt5 = _.find(data, { vendor: 'MT5' });
      if (mt5) {
        getMt5Symbols(mt5.vendor, mt5.serverId);
      }
    });
  }

  toggleModal = (type, toggle, selected = { name: '', symbols: [] }) => {
    const { selectGroup } = this.props;

    selectGroup(selected);
    this.setState({
      [`show${type}Modal`]: toggle
    });
  };

  operateGroup = savingGroup => {
    const {
      createGroup,
      updateGroup,
      getGroupList,
      showTipsModal
    } = this.props;
    const action = !!savingGroup.id ? updateGroup : createGroup;

    const mt5 = _.find(savingGroup.symbols, { vendor: 'MT5' });
    this.submitGroup(action, savingGroup);
  };

  submitGroup = (action, savingGroup) => {
    const { getGroupList } = this.props;
    action(savingGroup).then(res => {
      if (res.result) {
        getGroupList();
      }
      this.toggleModal('Operate', false);
    });
  };

  showConfirmModal = selected => {
    const { showTipsModal, removeGroup, getGroupList } = this.props;

    showTipsModal({
      content: i18n['general.confirm_remove'],
      onConfirm: cb => {
        removeGroup(selected.id).then(res => {
          if (res.result) {
            getGroupList();
          }
          cb();
        });
      }
    });
  };

  parseServerSymbols = (groupList, serverSymbols, selected) => {
    let copyData = JSON.parse(JSON.stringify(serverSymbols));
    const copyGroupSymbols = JSON.parse(JSON.stringify(groupList))
      .filter(group => parseInt(group.id) !== parseInt(selected.id))
      .map(group => group.symbols);

    copyData = copyData.map(server => {
      copyGroupSymbols.forEach(groupSymbols => {
        const existSymbols = groupSymbols.find(
          group => parseInt(group.serverId) === parseInt(server.serverId)
        );

        if (existSymbols) {
          server.symbols = server.symbols.filter(
            symbol => !existSymbols.symbols.some(_symbol => _symbol === symbol)
          );
        }
      });

      return server;
    });
    return copyData;
  };

  moveRow = (dragIndex, hoverIndex) => {
    const { groupList, getGroupList, sortGroup } = this.props;
    const { data } = this.state;
    let copyData = _.cloneDeep(groupList);
    const dragRow = groupList[dragIndex];
    copyData.splice(dragIndex, 1);
    copyData.splice(hoverIndex, 0, dragRow);
    const sortedData = copyData.map((item, index) => item.id);
    // 进行排序数据请求
    sortGroup(sortedData).then(({ result }) => {
      if (result) {
        getGroupList();
      }
    });
  };

  configColumns = () => {
    const { serverSymbols } = this.props;
    return [
      {
        title: i18n['settings.rebate_setting.sort'],
        key: 'sort',
        render: () => {
          return <Icon fontType="bw" icon="drag" />;
        }
      },
      {
        title: i18n['settings.rebate_setting.symbol_group_name'],
        key: 'name',
        className: cs['td-minwidth'],
        render: (value, row) => {
          return row['name'];
        }
      },
      {
        title: i18n['settings.rebate_setting.transaction_symbol'],
        key: 'symbols',
        className: cs['td-maxwidth'],
        render: (value, row, index) => {
          return serverSymbols.length === 1 ? (
            <a onClick={this.toggleModal.bind(this, 'Detail', true, row)}>
              {row.symbols[0] ? row.symbols[0].symbols.join(', ') : ''}
            </a>
          ) : (
            <a onClick={this.toggleModal.bind(this, 'Detail', true, row)}>
              {row.symbols.map((symbol, _idx) => {
                return (
                  <span key={_idx}>
                    {_idx !== 0 ? ',  ' : ''}
                    <strong>{symbol.serverName}</strong>:{' '}
                    {symbol.symbols.join(', ')}
                  </span>
                );
              })}
            </a>
          );
        }
      },
      {
        title: i18n['settings.rebate_setting.action'],
        key: 'actions',
        render: (value, row, index) => (
          <div>
            <Icon
              className={`${cs['operationIcon']} main-color`}
              icon="edit-outline"
              onClick={this.toggleModal.bind(this, 'Operate', true, row)}
            />
            <Icon
              icon="delete-outline"
              className={`${cs['operationIcon']} main-color`}
              onClick={this.showConfirmModal.bind(this, row)}
            />
          </div>
        )
      }
    ];
  };

  render() {
    const {
      groupList,
      serverSymbols,
      selectedGroup,
      updateSelectedGroup,
      mt5Symbols
    } = this.props;
    const { showDetailModal, showOperateModal, updateTime } = this.state;
    const selected = selectedGroup;
    const parsedServerSymbols = this.parseServerSymbols(
      groupList,
      serverSymbols,
      selected
    );
    const columns = this.configColumns();

    return (
      <div className={cs.container}>
        <CommonHeader
          total={groupList.length}
          time={moment(updateTime).format('YYYY-MM-DD HH:mm')}
          menus={[
            { value: i18n['page.title.settings'] },
            { value: i18n['settings.left_menu.rebate_setting'] }
          ]}
          title={
            i18n[
              'settings.left_menu.rebate_setting.sub_menu.symbol_group_setting'
            ]
          }
        >
          {groupList.length >= 100 ? (
            undefined
          ) : (
            <Button
              type="primary"
              className={`pull-right`}
              onClick={this.toggleModal.bind(this, 'Operate', true, undefined)}
            >
              <Icon icon="add-outline" />
              {i18n['settings.rebate_setting.add_symbol_group']}
            </Button>
          )}
        </CommonHeader>
        <SortableTable
          columns={columns}
          data={groupList}
          moveRow={this.moveRow}
        />
        {groupList.length === 0 ? <NoDataView /> : undefined}
        {showDetailModal ? (
          <DetailModal
            data={selected}
            show={showDetailModal}
            serverSymbols={parsedServerSymbols}
            onHide={this.toggleModal.bind(this, 'Detail', false, undefined)}
          />
        ) : (
          undefined
        )}
        {showOperateModal ? (
          <OperateGroup
            data={selected}
            mt5Symbols={mt5Symbols}
            serverSymbols={parsedServerSymbols}
            groupList={groupList}
            show={showOperateModal}
            onSave={this.operateGroup}
            onHide={this.toggleModal.bind(this, 'Operate', false, undefined)}
          />
        ) : (
          undefined
        )}
      </div>
    );
  }
}
