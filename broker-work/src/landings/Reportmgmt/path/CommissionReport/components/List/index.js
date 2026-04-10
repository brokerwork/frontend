import PaginationBar from 'components/v2/PaginationBar';
import i18n from 'utils/i18n';
import NoDataView from 'components/NoDataView';
import moment from 'moment';
import { Table as UiTable, Message, Tooltip } from 'lean-ui';
const { Td, Th } = UiTable;
import { Content, Layout } from 'components/v2/PageWraper';
import SortToggle from 'components/v2/SortToggle';
import { TYPE_TRANSFER } from '../../constants';
import TextButton from 'components/v2/TextButton';
const dateFormat = 'YYYY-MM-DD H:mm';
import cs from './List.less';
const defaultSubColumn = [
  'vendor',
  'commission_user',
  'user_name',
  'deposit_user_name'
];
const noLastRowType = ['RealTime'];

/**
 * 需求：【新算法 BW后端】交易返佣报表展示开平仓间隔过短的不返佣的订单
 * begin
 */
const noReturnRules = ['SHORT'];
function getRule2NoReturnTip(rule, content) {
  return noReturnRules.includes(rule) ? (
    <Tooltip title={i18n[`report.lots_body.no_return.${rule}`]}>
      <a href="javascript:;">--</a>
    </Tooltip>
  ) : (
    content
  );
}
/**end */

export default class CommissionList extends PureComponent {
  componentWillMount() {
    const { updateNeedRefresh } = this.props;
    updateNeedRefresh(i18n['report.date_range_type.default_tints']);
  }

  modifyPagination = v => {
    const { params, modifyParams } = this.props;
    modifyParams({
      ...params,
      pageSize: v.pageSize,
      nowPage: v.pageNo
    });
  };

  //改变排序
  modifySort = v => {
    const {
      updateCurrentSortParam,
      currentSortParam,
      updatePagination
    } = this.props;
    const lastSortby = currentSortParam.sortby;
    const currentOrderDesc =
      lastSortby === v ? !currentSortParam.orderDesc : false;
    Promise.all([
      updateCurrentSortParam({ sortby: v, orderDesc: currentOrderDesc }),
      updatePagination({ pageNo: 1 })
    ]).then(() => {
      this.getReportList();
    });
  };

  componentWillReceiveProps(nextProps) {
    const {
      match: { path, params: { type } = {} },
      history: { push },
      updateCurrentCommissionReportType,
      updateFieldConditions
    } = this.props;
    const nextType = nextProps.match.params.type;
    if (nextType && type && nextType !== type) {
      Promise.resolve(updateCurrentCommissionReportType(nextType)).then(() => {
        const { modifyParams, params, objectType } = this.props;
        const currentObjectType = params.conditions.find(
          item => item.key === 'objectType'
        );
        const newConditions = [
          params.conditions.find(item => item.key === 'filterDate'),
          currentObjectType && currentObjectType.value.indexOf('@#') > -1
            ? currentObjectType
            : {
                key: 'objectType',
                type: 'equals',
                originValue: objectType[0],
                value: objectType[0].value
              }
        ];
        const newParams = {
          ...params,
          conditions: newConditions,
          pageNo: 1
        };
        Promise.resolve(updateFieldConditions(newConditions)).then(() => {
          setTimeout(() => {
            modifyParams(newParams);
          }, 0);
        });
      });
    }
  }

  // 判断实时返佣的flag＝121/131/106时才能出现重试按钮
  isShowRetry = key => {
    return [106, 131, 101, 142].includes(key);
  };

  getRTstatus = v => {
    switch (v) {
      case 200:
        return i18n['report.commission_table_type.success'];
      case 1:
        return i18n['report.commission_table_type.processing'];
      default:
        return `${i18n['report.commission_table_type.fail']}(${i18n.mcode(
          `BW_RCR_DEPOSIT_FLAG_${v}`
        )})`;
    }
  };

  // 生成header的部分，排序和特殊处理的header
  renderHeadCell = ({ item, index, fixed }) => {
    const {
      currentSortParam: { sortby, orderDesc }
    } = this.props;
    return (
      <Th key={index} fixed={fixed}>
        {item.sort ? (
          <SortToggle
            activeSort={sortby}
            orders={[true, false]}
            sortKey={item.value}
            activeOrder={orderDesc}
            onChange={this.modifySort}
          >
            {item.label}
          </SortToggle>
        ) : (
          item.label
        )}
      </Th>
    );
  };
  _renderCellNew = ({ rowData, listData }) => {
    return this._renderCellback(rowData, listData || {});
  };
  // 具体表格内容不同类型内容展示和特殊处理
  _renderCellback = (source, field) => {
    const key = field.value;
    const {
      match: { url },
      userRights
    } = this.props;

    let content = null;
    let clickHandler = null;
    let title;
    switch (key) {
      case 'name':
        title = content = source[key];
        break;
      case 'rebateStatus':
        title = content = this.getRTstatus(source['flag']);
        break;
      case 'rebateType':
        title = content = TYPE_TRANSFER[`${source[key]}`];
        break;
      case 'rebate_type':
        title = content = source[`${key}_s`];
        break;
      /**
       * 需求：【新算法 BW后端】交易返佣报表展示开平仓间隔过短的不返佣的订单
       * begin
       */
      case 'rebate_money':
        content = getRule2NoReturnTip(source.rule_description2, source[key]);
        break;
      case 'rule_description2':
        content = getRule2NoReturnTip(source[key], source[key]);
        break;
      // 新版报表
      case 'rebateMoney':
        content = getRule2NoReturnTip(source.ruleDescription2, source[key]);
        break;
      case 'ruleDescription2':
        content = getRule2NoReturnTip(source[key], source[key]);
        break;
      case 'openTime':
        content = moment(source[key]).format(dateFormat);
        break;
      case 'closeTime':
        content = moment(source[key]).format(dateFormat);
        break;
      /**end */
      case 'status':
        title = content =
          source[key] === 0
            ? `${i18n['report.commission_table_type.fail']}(${i18n.mcode(
                source.code
              )})`
            : i18n['report.commission_table_type.success'];
        break;
      default:
        title = content = source[key];
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
  options = [];
  onTableScroll = () => {
    this.options.forEach(t => t.hidePopover());
  };
  onSelect = ({ item, selectedKeys, event }) => {
    if (item === null) {
      this.toggleSelectAll(event);
    } else {
      this.toggleSelect(item, !event.target.checked);
    }
  };
  //全选和全不选
  toggleSelectAll = evt => {
    const { selectItem, commissionReportList } = this.props;
    let isSelected = evt;
    if (evt && evt.target) {
      isSelected = evt.target.checked;
    }
    let map = {};
    if (isSelected) {
      commissionReportList.list.forEach(o => {
        let id = o.id;
        map[id] = o;
      });
    }
    selectItem(map);
  };
  toggleSelect = (item, isSelected) => {
    const { id } = item;
    const { selectedItems, selectItem } = this.props;
    const copySelectedItems = Object.assign({}, selectedItems);
    if (!isSelected) {
      copySelectedItems[id] = item;
    } else {
      delete copySelectedItems[id];
    }
    selectItem(copySelectedItems);
  };
  // 批量重试
  retry = () => {
    const {
      selectedDepositRetry,
      selectedItems,
      currentCommissionReportType,
      params,
      getReportList
    } = this.props;
    let copyData = [];
    let isDoRetry = true;
    if (currentCommissionReportType.value === 'RTCommission') {
      for (let k in selectedItems) {
        if (
          moment().diff(
            moment(selectedItems[k].update_time || selectedItems[k].rebateTime),
            'seconds'
          ) < 900
        ) {
          Message.error(i18n['report.retry_deposit.retry_failed']);
          isDoRetry = false;
          return;
        }
        copyData.push({
          deposit_deal_id:
            selectedItems[k].deposit_deal_id || selectedItems[k].did,
          ticket_deal_id:
            selectedItems[k].ticket_deal_id || selectedItems[k].tid,
          rebateLogin: selectedItems[k].rebateLogin,
          rebateMoney: selectedItems[k].rebateMoney
        });
      }
    } else {
      for (let k in selectedItems) {
        copyData.push({
          serverId: selectedItems[k].server_id,
          id: selectedItems[k].id
        });
      }
    }

    if (isDoRetry) {
      Promise.resolve(
        selectedDepositRetry(currentCommissionReportType.value, copyData)
      ).then(res => {
        if (res.result) {
          Message.success(i18n['report.retry_deposit.retry_success']);
          this.toggleSelectAll(false);
          getReportList(params);
        }
      });
    }
  };
  batchActions = type => {
    switch (type) {
      case 'delete':
        this.deleteUser();
        break;
      case 'retry':
        this.retry();
        break;
    }
  };
  renderBatchActions = () => {
    const { userRights } = this.props;
    return (
      <div style={{ 'margin-left': '10px' }}>
        <TextButton
          text={i18n['customer.cancel']}
          onClick={this.toggleSelectAll.bind(this, false)}
        />
        {userRights['STAT_VIEW_COMMISSION_OPERAT_RETRY'] ? (
          <TextButton
            text={i18n['report.commission_Report.restart']}
            icon="reload"
            onClick={this.batchActions.bind(this, 'retry')}
          />
        ) : (
          undefined
        )}
        <TextButton
          text={i18n['general.delete']}
          icon="delete-outline"
          onClick={this.batchActions.bind(this, 'delete')}
        />
      </div>
    );
  };
  //批量删除
  deleteUser = () => {
    const {
      selectedDepositDelete,
      showTipsModal,
      getReportList,
      params,
      selectedItems,
      currentCommissionReportType
    } = this.props;
    let copyData = [];
    if (currentCommissionReportType.value === 'RTCommission') {
      for (let k in selectedItems) {
        copyData.push({
          deposit_deal_id: selectedItems[k].deposit_deal_id,
          ticket_deal_id: selectedItems[k].ticket_deal_id
        });
      }
    } else {
      for (let k in selectedItems) {
        copyData.push({
          serverId: selectedItems[k].server_id,
          id: selectedItems[k].id
        });
      }
    }
    showTipsModal({
      content: i18n['report.retry_deposit.confirm_remove'],
      onConfirm: cb => {
        Promise.resolve(
          selectedDepositDelete(currentCommissionReportType.value, copyData)
        ).then(res => {
          if (res.result) {
            Message.success(i18n['general.remove_success']);
            this.toggleSelectAll(false);
            getReportList(params);
          }
          cb();
        });
      }
    });
  };
  getKey = selectedItems => {
    const selectedKeys = Object.keys(selectedItems);
    let parseKey = [];
    selectedKeys.forEach(item => {
      parseKey.push(Number(item));
    });
    return parseKey;
  };
  // 合计
  _renderTableTotal = sta => {
    const {
      commissionReportList,
      commissionListColumns,
      currentCommissionReportType
    } = this.props;
    if (
      sta &&
      commissionReportList.list &&
      commissionReportList.list.length &&
      !noLastRowType.includes(currentCommissionReportType.value)
    ) {
      return (
        <tr>
          {commissionListColumns.map((col, _idx) => {
            console.log(1, col);
            return (
              <Td key={_idx}>
                {defaultSubColumn.includes(col.value)
                  ? i18n['report.count']
                  : sta['sum_' + col.value] ||
                    sta['total_' + col.value] ||
                    sta[col.value]
                    ? sta['sum_' + col.value] ||
                      sta['total_' + col.value] ||
                      sta[col.value]
                    : undefined}
              </Td>
            );
          })}
        </tr>
      );
    }
  };
  resetColumns = () => {
    const {
      commissionListColumns,
      currentCommissionReportType,
      currentServer
    } = this.props;
    let copyColumns = _.cloneDeep(commissionListColumns);
    if (
      currentCommissionReportType.value === 'RTCommission' &&
      currentServer.vendor !== 'MT4'
    ) {
      copyColumns = copyColumns.filter(col => col.value !== 'openTime');
    }
    return copyColumns;
  };
  render() {
    const {
      commissionReportList,
      paginationInfo,
      searchFieldConditions,
      selectedItems
    } = this.props;
    const showAcitonTable = searchFieldConditions.find(
      item => item.value === 'failed' && item.key === 'status'
    );
    const selectedKeys = this.getKey(selectedItems);
    const rowSelectOptions = {
      onChange: this.onSelect,
      selectFieldKey: 'id',
      selectedKeys,
      selectedHeader: this.renderBatchActions()
    };
    const pager =
      commissionReportList.list && commissionReportList.list.length ? (
        <PaginationBar
          {...paginationInfo}
          onPageChange={this.modifyPagination}
        />
      ) : (
        undefined
      );
    const columns = this.resetColumns();
    const totalData = commissionReportList.sta || commissionReportList.stat;
    return (
      <Layout footer>
        <Content table={true}>
          {showAcitonTable ? (
            <UiTable
              data={
                (commissionReportList.list && commissionReportList.list) || []
              }
              columns={columns}
              fixedHeader
              rowSelectOptions={rowSelectOptions}
              renderCell={this._renderCellNew}
              renderHeadCell={this.renderHeadCell}
              onTableScroll={this.onTableScroll}
              lastRow={this._renderTableTotal(totalData)}
              pager={pager}
            />
          ) : (
            <UiTable
              data={
                (commissionReportList.list && commissionReportList.list) || []
              }
              columns={columns}
              fixedHeader
              renderCell={this._renderCellNew}
              renderHeadCell={this.renderHeadCell}
              lastRow={this._renderTableTotal(totalData)}
              pager={pager}
            />
          )}
          {commissionReportList.list && commissionReportList.list.length ? (
            undefined
          ) : (
            <NoDataView className={cs['nodata-div']} />
          )}
        </Content>
      </Layout>
    );
  }
}
