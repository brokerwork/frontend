import moment from 'moment';
import PaginationBar from 'components/v2/PaginationBar';
import { CardPanelWrapper } from 'components/v2/CardPanel';
import getFieldValue from 'utils/fieldValue';
import cs from './OpportunityList.less';
import { Link } from 'react-router-dom';
import NoDataView from 'components/v2/NoDataView';
import TextButton from 'components/v2/TextButton';
import OptionItem from '../OptionItem';
import {
  Table as UiTable,
  Icon,
  Dropdown,
  Popover,
  Menu,
  Message
} from 'lean-ui';
import { Content, Layout } from 'components/v2/PageWraper';
import i18n from 'utils/i18n';

const { Td, Th } = UiTable;

const formatStyle = 'YYYY-MM-DD HH:mm:ss';
const linkColumns = ['opportunityName'];

export default class OpportunityList extends PureComponent {
  state = {
    showDetail: false
  };

  componentDidMount() {
    const {
      getListColumns,
      getFormColumns,
      getOpportunityTypeList,
      getLoseCauseList,
      getFollowWayList
    } = this.props;

    getListColumns();
    getFormColumns();
    getOpportunityTypeList();
    getLoseCauseList();
    getFollowWayList();
  }

  onPageChange = ({ pageNo, pageSize }) => {
    const { updateCurrentPagination } = this.props;

    Promise.resolve(updateCurrentPagination({ pageNo, pageSize })).then(() => {
      this.getList();
    });
  };

  getList = () => {
    const {
      getOpportunityList,
      currentPagination,
      searchFieldConditions,
      searchText
    } = this.props;
    const { pageNo, pageSize } = currentPagination;

    getOpportunityList({
      currentPage: pageNo,
      pageSize,
      fuzzyVal: searchText,
      advanceConditions: searchFieldConditions
    });
  };

  select = (item, evt) => {
    const { updateSelecteds, selecteds } = this.props;
    const checked = evt.target.checked;
    const copy = selecteds.concat();

    if (checked) {
      copy.push(item);
    } else {
      const idx = copy.findIndex(
        _item => _item.opportunityId === item.opportunityId
      );
      copy.splice(idx, 1);
    }

    updateSelecteds(copy);
  };

  toggleSelectAll = evt => {
    const { updateSelecteds, selecteds, opportunityList } = this.props;
    const checked = evt.target.checked;
    const items = checked
      ? [].concat(
          selecteds.filter(
            _item =>
              !opportunityList.list.some(
                item => item.opportunityId === _item.opportunityId
              )
          ),
          opportunityList.list
        )
      : selecteds.filter(
          _item =>
            !opportunityList.list.some(
              item => item.opportunityId === _item.opportunityId
            )
        );

    updateSelecteds(items);
  };

  showDetail = item => {
    const { getDetail, getCustomerParticipant } = this.props;

    this.setState(
      {
        showDetail: true
      }
      // () => {
      //   Promise.resolve(getDetail(item.opportunityId)).then(res => {
      //     if (res.result) {
      //       getCustomerParticipant(res.data.customerId);
      //     }
      //   });
      // }
    );
  };

  closeDetail = () => {
    this.setState(
      {
        showDetail: false
      },
      () => {
        this.getList();
      }
    );
  };

  onActionsSelect = (opportunity, { key }) => {
    const { updateSelecteds } = this.props;
    Promise.resolve(updateSelecteds([opportunity])).then(res => {
      if (key === 'delete') {
        this.onRemoveOppor();
      }
    });
  };

  _renderTableHeader = ({ item, index, fixed }) => {
    return (
      <Th fixed={fixed} key={index}>
        {item.label}
      </Th>
    );
  };

  _renderTableBodyRow = ({
    key,
    data,
    index: _idx,
    rowData: item,
    listData: col
  }) => {
    return (
      <Td key={_idx}>
        {col.key === 'createTime' ? (
          item[col.key] ? (
            moment(item[col.key]).format(formatStyle)
          ) : (
            ''
          )
        ) : col.key === 'salesStage' ? (
          getFieldValue(col, item.isLose ? 6 : item[col.key])
        ) : linkColumns.includes(col.key) ? (
          <Link
            target="_black"
            to={`${this.props.match.url}/${item.opportunityId}`}
          >
            {item[col.key]}
          </Link>
        ) : col.key === 'oweName' ? (
          item.oweName || ''
        ) : col.key === 'customName' ? (
          <Link
            target="_black"
            to={`/custommgmt/customers/detail/${item.customerId}`}
          >
            {getFieldValue(col, item[col.key])}
          </Link>
        ) : col.key === 'actions' ? (
          <OptionItem
            ref={this.getOptionItemRefs}
            onRemoveRef={this.onRemoveOptionRef}
            onActionsSelect={this.onActionsSelect.bind(this, item)}
          />
        ) : (
          getFieldValue(col, item[col.key])
        )}
      </Td>
    );
  };

  onSelect = ({ item, selectedKeys, event }) => {
    if (item === null) {
      this.toggleSelectAll(event);
    } else {
      this.select(item, event);
    }
  };
  onRemoveOppor = () => {
    const {
      selecteds,
      showTipsModal,
      showTopAlert,
      updateSelecteds,
      remove
    } = this.props;

    showTipsModal({
      content: i18n['customer.sales_opportunity.actions_bar.remove_tips'],
      onConfirm: cb => {
        const ids = selecteds.map(item => item.opportunityId);
        remove(ids).then(({ result, data }) => {
          if (result) {
            if (data && data.length) {
              showTipsModal({
                content: (
                  <FormattedMessage
                    id="customer.sales_opportunity.detail.delete_reject_batch"
                    defaultMessage={
                      i18n[
                        'customer.sales_opportunity.detail.delete_reject_batch'
                      ]
                    }
                    values={{
                      successNum: (
                        <span className={cs['success-text']}>
                          {ids.length - data.length}
                        </span>
                      ),
                      failNum: (
                        <span className={cs['fail-text']}>{data.length}</span>
                      )
                    }}
                  />
                ),
                noCancel: true
              });
            } else {
              Message.success(i18n['general.remove_success']);
              cb();
            }
            updateSelecteds([]);
            this.getList();
          } else {
            cb();
          }
        });
      }
    });
  };
  renderBatchActions = () => {
    const { userRights } = this.props;
    return (
      <div style={{ 'margin-left': '10px' }}>
        <TextButton
          text={i18n['customer.cancel']}
          onClick={this.toggleSelectAll.bind(this, {
            target: { checked: false }
          })}
        />
        {userRights['CUSTOMER_SALEOPP_DELETE'] ? (
          <TextButton
            text={i18n['customer.remove']}
            icon="delete-outline"
            onClick={this.onRemoveOppor}
          />
        ) : (
          undefined
        )}
      </div>
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

  render() {
    let {
      opportunityList,
      selecteds,
      detailsComponent,
      listColumns
    } = this.props;

    if (detailsComponent) {
      detailsComponent = React.cloneElement(detailsComponent, {
        onClose: this.closeDetail
      });
    }

    const selectedKeys = selecteds.map(item => item.opportunityId);
    const rowSelectOptions = {
      onChange: this.onSelect,
      selectFieldKey: 'opportunityId',
      selectedKeys,
      selectedHeader: this.renderBatchActions()
    };

    return (
      <Layout footer>
        <Content table={opportunityList.list.length}>
          <UiTable
            data={opportunityList.list}
            columns={[{ key: 'actions' }].concat(listColumns)}
            fixedHeader
            rowSelectOptions={rowSelectOptions}
            renderCell={this._renderTableBodyRow}
            renderHeadCell={this._renderTableHeader}
            onTableScroll={this.onTableScroll}
            pager={
              <PaginationBar
                total={opportunityList.total}
                pageSize={opportunityList.size}
                pageNo={opportunityList.pager}
                onPageChange={this.onPageChange}
              />
            }
          />
          {opportunityList.list && opportunityList.list.length === 0 ? (
            <NoDataView />
          ) : (
            undefined
          )}
        </Content>
        <CardPanelWrapper appear>{detailsComponent}</CardPanelWrapper>
      </Layout>
    );
  }
}
