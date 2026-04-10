import getFieldValue from 'utils/fieldValue';
import NoDataView from 'components/NoDataView';
import PaginationBar from 'components/v2/PaginationBar';
import { Layout, Content } from 'components/v2/PageWraper';
import SortToggle from 'components/v2/SortToggle';
import FieldSort from 'components/v2/FieldSort';
import { Table, Icon, Dropdown, Popover, Menu, Message, Button } from 'lean-ui';
import cs from './List.less';
import i18n from 'utils/i18n';
import { FIELD_TABLE_NAME } from '../../../../constant';
import BatchActions from '../../containers/BatchActions';
import BatchActionsItem from '../../containers/BatchActionsItem';
import OptionItem from '../OptionItem';
import { mt4Filter } from 'utils/mtFilter';
import {
  sortColumns,
  statusColumns,
  assetsColumns,
  mtColums,
  otherAccountColums,
  grpColums,
  leverageColums
} from '../../constant';
import { getType } from 'utils/language';
const { Td, Th } = Table;
const lang = getType();
export default class List extends PureComponent {
  state = {
    showFieldSortModal: false
  };
  changeOrderBy = order => {
    const { orderBy, updateOrderBy, onChange } = this.props;
    const desc = orderBy.type === order.type ? !orderBy.desc : true;

    Promise.resolve(updateOrderBy({ ...order, desc })).then(() => {
      onChange();
    });
  };

  onPageChange = pagination => {
    const { updatePagination, onChange } = this.props;

    Promise.resolve(updatePagination(pagination)).then(() => {
      onChange();
    });
  };

  getFlatKey = key => {
    const [key0, key1] = key.split('.');
    return key1 || key0;
  };

  _renderStatusText = (source, key) => {
    const val = this.getListItemValue(source, key);
    if (!val && val !== 0) {
      return null;
    }
    const parsed = val * 1;
    const enable = key === 'readOnly' ? !parsed : !!parsed;
    return (
      <span>
        {enable
          ? i18n['usermgmt.table_header.cell_actived']
          : i18n['usermgmt.table_header.cell_disabled']}
      </span>
    );
  };

  _renderTableTotal = columns => {
    const {
      accountTotal,
      listColumns,
      rights: { privilege }
    } = this.props;
    return privilege.balance ? (
      <tr>
        <Td>{i18n['account.total']}</Td>
        <Td />
        {columns.map((col, idx) => {
          return col.key === 'actions' ? null : (
            <Td key={idx}>
              {assetsColumns.includes(col.key)
                ? `${accountTotal[col.key]}`
                : undefined}
            </Td>
          );
        })}
      </tr>
    ) : null;
  };
  cellContent = (source, key, field) => {
    const {
      match: { url },
      userRights,
      currentServer,
      onChange,
      accountTypes
    } = this.props;
    const { vendor, serverId } = currentServer;
    if (key === 'login') {
      const login = this.getListItemValue(source, 'accountInfo.login');
      return (
        <a
          href={`/accountmgmt/${login}?vendor=${vendor}&serverId=${serverId}`}
          target="_blank"
        >
          {login}
        </a>
      );
    }
    if (key === 'actions') {
      const login = this.getListItemValue(source, 'accountInfo.login');
      return (
        <OptionItem
          {...this.props}
          ref={this.getOptionItemRefs}
          onRemoveRef={this.onRemoveOptionRef}
          content={<BatchActionsItem onChange={onChange} sourceId={login} />}
        />
      );
    }
    if (statusColumns.includes(key)) {
      return this._renderStatusText(source, key);
    }
    if (key === 'marginLevel' && getFieldValue(field, source[key])) {
      return `${getFieldValue(field, source[key])}%`;
    }
    if (key === 'customAccountType') {
      const val = _.get(source, `accountInfo.customAccountType`, '');
      if (val) {
        const item = _.find(accountTypes['all'], {
          value: val
        });
        if (item) {
          return item.label;
        }
      }
      return '';
    }
    return getFieldValue(field, this.getListItemValue(source, key));
  };
  //临时方案和兼容老数据方案，对于得到的key未告知对应表的field数据，通过遍历在每个表中查找对应的值
  getListItemValue = (item, key) => {
    const [key0, key1] = key.split('.');
    //如果是新key 直接取值
    if (key1) {
      return item[key0] && item[key0][key1];
    } else {
      // 如果是老key 遍历取值
      let value = undefined;
      for (let i in item) {
        const obj = item[i];
        if (typeof obj === 'object') {
          if (key0 in obj) {
            value = obj[key0];
            break;
          }
        } else if (key0 === obj) {
          value = obj;
          break;
        }
      }
      return value;
    }
  };
  _renderCellback = (source, key, field) => {
    const { rights } = this.props;
    let content = this.cellContent(source, key, field);
    // "readOnly" "enable"
    if ((key === 'readOnly' || key === 'enable') && content) {
      const {
        currentServer: { vendor, serverId }
      } = this.props;
      return (
        <Td className={cs['edit-cell']} key={key}>
          <div
            className={
              rights.update[key]
                ? `${cs['popver-td']} main-color-inset-shadow-hover`
                : ''
            }
          >
            {content}
            {rights.update[key] ? (
              <div className={cs['edit-container']}>
                <Button
                  size="small"
                  className={cs['actions-active-btn']}
                  onClick={this.onStatusChange.bind(
                    this,
                    source,
                    key,
                    vendor,
                    serverId
                  )}
                >
                  {key === 'readOnly'
                    ? source.accountInfo[key] === 1
                      ? i18n['general.start']
                      : i18n['general.close']
                    : undefined}
                  {key === 'enable'
                    ? source.accountInfo[key] === 0
                      ? i18n['general.start']
                      : i18n['general.close']
                    : undefined}
                </Button>
              </div>
            ) : (
              undefined
            )}
          </div>
        </Td>
      );
    }
    return <Td key={key}>{content}</Td>;
  };
  onStatusChange = (source, key, vendor, serverId) => {
    const { updateCellStatus, onChange } = this.props;
    const status =
      key === 'readOnly' ? source.accountInfo[key] : !source.accountInfo[key];
    updateCellStatus(
      key,
      source.accountInfo.login,
      status,
      vendor,
      serverId
    ).then(({ result }) => {
      if (result) onChange();
    });
  };
  _renderCell = ({ key, data, index, rowData, listData }) => {
    return this._renderCellback(rowData, key, listData || {});
  };
  onSelect = ({ selectedKeys, item }) => {
    const { updateSelectedAccountIds, accountList } = this.props;
    updateSelectedAccountIds(selectedKeys);
  };
  renderBatchActions() {
    const { onChange } = this.props;
    return <BatchActions onChange={onChange} />;
  }
  toggleModal = () => {
    const { showFieldSortModal } = this.state;
    this.setState({
      showFieldSortModal: !showFieldSortModal
    });
  };
  onSort = data => {
    const {
      saveFormSortColumns,
      showTopAlert,
      currentServer: { vendor },
      reload
    } = this.props;

    saveFormSortColumns(
      data,
      FIELD_TABLE_NAME[vendor === 'CTRADER' ? 'cbroker' : 'account']
    ).then(({ result }) => {
      if (result) {
        showTopAlert({
          content: i18n['general.save_success'],
          bsStyle: 'success'
        });

        this.setState({
          showFieldSortModal: false
        });

        reload();
      }
    });
  };
  /**
   * 根据权限显示
   */
  showColumsByAuthority = listColumns => {
    let {
      rights: { privilege },
      accountColumns,
      versionRights,
      bwAccountShow,
      brandInfo
    } = this.props;
    const isProVersion = brandInfo.topVersionId === 'TV003';
    if (!isProVersion) {
      bwAccountShow = false;
    }
    if (bwAccountShow === 'show') {
      bwAccountShow = true;
    }
    let resetColums = listColumns;
    // 若没有权限 则表头不显示
    if (!privilege.balance) {
      resetColums = resetColums.filter(col => !assetsColumns.includes(col.key));
    }
    if (!privilege.group) {
      resetColums = resetColums.filter(col => !mtColums.includes(col.key));
    }
    if (!privilege.accountInfo) {
      // 账户信息需要隐藏字段
      let accountBox = accountColumns
        .filter(v => !v.sysDefault)
        .map(item => item.key);
      accountBox = [...accountBox, ...otherAccountColums];
      resetColums = resetColums.filter(
        col => !accountBox.includes(col.key) && col.key !== 'userId' // 账户归属 sc返回字段为userId，此处做过特殊处理为userName，因此需要加上这个条件
      );
    }
    // 账户组
    if (!privilege.accountGroup) {
      resetColums = resetColums.filter(
        col => !grpColums.includes(col.key) && col.key !== 'userGroupName'
      );
    }
    // 杠杆
    if (!privilege.leverage) {
      resetColums = resetColums.filter(
        col => !leverageColums.includes(col.key)
      );
    }
    if (
      versionRights['SC_CUSTOM_ACCOUNT_TYPE'] &&
      !_.find(resetColums, { key: 'customAccountType' }) &&
      bwAccountShow
    ) {
      resetColums.splice(1, 0, {
        key: 'customAccountType',
        label: i18n['account.list.field.custom_account_type']
      });
    }
    return resetColums;
  };
  columnsGenerator = listColumns => {
    const resetColums = this.showColumsByAuthority(listColumns);
    const end = resetColums.map(c => ({
      key: c.key,
      name: c.label,
      ...c
    }));
    return [
      {
        key: 'actions',
        name: (
          <Icon
            className={cs['pop-btn']}
            icon="set-table-soild"
            onClick={this.toggleModal.bind(this)}
          />
        )
      },
      ...end
    ];
  };
  renderHeadCell = ({ item, index, fixed }) => {
    const { orderBy } = this.props;
    const flatColKey = this.getFlatKey(item.key);
    const activeOrder = orderBy.desc ? 'DESC' : 'ASC';
    return (
      <Th key={index} fixed={fixed}>
        {sortColumns.includes(flatColKey) ? (
          <SortToggle
            activeSort={orderBy.type}
            sortKey={flatColKey}
            activeOrder={activeOrder}
            onChange={this.changeOrderBy.bind(this, {
              type: flatColKey,
              name: item.name
            })}
          >
            {item.name}
          </SortToggle>
        ) : (
          item.name
        )}
      </Th>
    );
  };

  options = new Set([]);

  getOptionItemRefs = r => {
    if (!r) {
      return;
    }

    this.options.add(r);
  };

  onRemoveOptionRef = ref => {
    this.options.delete(ref);
  };

  onTableScroll = () => {
    this.options.forEach(t => t.hidePopover());
  };
  filterConditionsGenerator = conditionList => {
    const {
      currentServer: { vendor }
    } = this.props;
    const resetColums = this.showColumsByAuthority(conditionList);
    return (vendor === 'MT4'
      ? resetColums.filter(s => !mt4Filter.includes(s.key))
      : resetColums
    ).filter(col => col.key !== 'customAccountType');
  };
  render() {
    const {
      accountList,
      listColumns,
      currentPagination: { total, pageNo, pageSize },
      sortListColumns,
      selectedAccountIds
    } = this.props;
    const { showFieldSortModal } = this.state;
    const columns = this.columnsGenerator(listColumns);
    const filterColumns = this.filterConditionsGenerator(sortListColumns);
    const rowSelectOptions = {
      onChange: this.onSelect,
      selectFieldKey: '_showId',
      selectedKeys: selectedAccountIds,
      selectedHeader: this.renderBatchActions()
    };
    // _showId 是因为 accountInfo.login 无法直接取值
    const showData = accountList.map(ac => {
      ac['_showId'] = ac.accountInfo.login;
      return ac;
    });
    return (
      <Layout footer>
        <Content table>
          <Table
            data={accountList}
            columns={columns}
            fixedHeader
            renderCell={this._renderCell}
            rowSelectOptions={rowSelectOptions}
            renderHeadCell={this.renderHeadCell}
            lastRow={this._renderTableTotal(columns)}
            onTableScroll={this.onTableScroll}
            pager={
              accountList.length ? (
                <PaginationBar
                  total={total}
                  pageSize={pageSize}
                  pageNo={pageNo}
                  onPageChange={this.onPageChange}
                />
              ) : (
                undefined
              )
            }
          />
          {accountList.length ? undefined : <NoDataView />}
        </Content>
        {showFieldSortModal ? (
          <FieldSort
            title={i18n['general.data.table_sort_title']}
            sortable
            data={filterColumns}
            onSubmit={this.onSort}
            onHide={this.toggleModal}
          />
        ) : null}
      </Layout>
    );
  }
}
