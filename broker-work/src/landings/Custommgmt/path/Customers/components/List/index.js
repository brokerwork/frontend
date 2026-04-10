import moment from 'moment';
import Table from 'components/Table';
import Checkbox from 'components/Checkbox';
import PaginationBar from 'components/v2/PaginationBar';
import PhoneLink from 'components/v2/PhoneLink';
import getFieldValue from 'utils/fieldValue';
import fieldToEditConfig from 'utils/fieldToEditConfig';
import { dateFormatStyle } from 'utils/config';
import cs from './List.less';
import i18n from 'utils/i18n';
import { Link } from 'react-router-dom';
import NoDataView from 'components/v2/NoDataView';
import AccountItem from './AccountItem';
import OptionItem from './OptionItem';
const DATE_FORMAT = `${dateFormatStyle} HH:mm:ss`;
import SortToggle from 'components/v2/SortToggle';
import { Content, Layout } from 'components/v2/PageWraper';
import TextButton from 'components/v2/TextButton';
import FieldSort from 'components/v2/FieldSort';

import {
  Table as UiTable,
  Icon,
  Dropdown,
  Popover,
  Menu,
  Message
} from 'lean-ui';

const { Td, Th } = UiTable;

import { LOST_CUSTOMER_STATE, EDITABLE_FIELDS } from '../../constant';

const sortFieldtoSortByMap = {
  revisitTime: 'RevisitTime',
  createTime: 'CreateTime',
  followTime: 'FollowTime'
};
import BatchActionsBar from '../../containers/BatchActionsBar';

export default class List extends PureComponent {
  state = {
    showCard: false,
    showFieldSortModal: false
  };
  componentDidMount() {
    const {
      getListColumns,
      getCustomerFormFields,
      match: { params: { customerId } = {} },
      getFollowWayOptions,
      tenantType
    } = this.props;
    getFollowWayOptions();
    getCustomerFormFields(tenantType);
    getListColumns();
  }
  toggleSelectAll = evt => {
    let isSelected = evt;
    if (evt && evt.target) {
      isSelected = evt.target.checked;
    }
    const { updateSelectedItems, customersList } = this.props;
    let map = {};
    if (isSelected) {
      customersList.forEach(o => {
        let customerId = o.customerId;
        map[customerId] = o;
      });
    }
    updateSelectedItems(map);
  };
  toggleSelect = (customer, isSelected) => {
    let { customerId } = customer;
    const { updateSelectedItems, selectedItemsMap } = this.props;
    let map = Object.assign({}, selectedItemsMap);
    if (!isSelected) {
      map[customerId] = customer;
    } else {
      delete map[customerId];
    }
    updateSelectedItems(map);
  };
  onPageChange = ({ pageNo, pageSize }) => {
    const { updatePagination, getCustomerList } = this.props;
    Promise.resolve(
      updatePagination({
        currentPage: pageNo,
        pageSize
      })
    ).then(() => {
      getCustomerList();
    });
  };

  // 改变排序
  modifySort = parseSortBy => {
    const {
      currentSortParam,
      updateCurrentSortParam,
      getCustomerList
    } = this.props;

    const lastSortby = currentSortParam.sortBy;
    const currentOrderDesc =
      lastSortby === parseSortBy ? !currentSortParam.orderDesc : true;
    Promise.resolve(
      updateCurrentSortParam({
        sortBy: parseSortBy,
        orderDesc: currentOrderDesc
      })
    ).then(() => {
      getCustomerList();
    });
  };

  getSourceType = key => {
    const { customerLinkSource } = this.props;
    for (let i = 0; i < customerLinkSource.length; i++) {
      if (`${customerLinkSource[i]['value']}` === `${key}`) {
        return customerLinkSource[i].label;
      }
    }
  };

  doMarkFollow = (customerId, isFollowed) => {
    const { markFollow, getCustomerList } = this.props;
    markFollow(customerId, !isFollowed).then(res => {
      getCustomerList();
    });
  };

  onActionsSelect = (customer, { key }) => {
    const {
      updateSelectedItems,
      match: { path },
      history: { push }
    } = this.props;
    Promise.resolve(
      updateSelectedItems({ [customer.customerId]: customer })
    ).then(res => {
      push(`${path}/${key}`);
    });
  };
  accounts = new Set([]);
  getAccountItemRefs = r => {
    if (!r) {
      return;
    }

    this.accounts.add(r);
  };

  options = new Set([]);
  getOptionItemRefs = r => {
    if (!r) {
      return;
    }

    this.options.add(r);
  };

  onRemoveAccountRef = ref => {
    this.accounts.delete(ref);
  };

  onRemoveOptionRef = ref => {
    this.options.delete(ref);
  };

  _renderCellback = (source, key, field) => {
    const {
      match: { url },
      customerStates,
      userRights
    } = this.props;
    let content = null;
    let clickHandler = null;
    let title;

    switch (key) {
      case 'country':
        title = content = source[key]
          ? `${getFieldValue(
              { fieldType: key },
              source[key].country
            )} ${getFieldValue(
              { fieldType: key },
              source[key].province
            )} ${getFieldValue({ fieldType: key }, source[key].city)}`
          : '';
        break;
      case 'phones':
        title = source[key] ? source[key].phoneStr : '';
        content = source[key] ? (
          <PhoneLink
            phone={source[key].phoneStr}
            id={source.customerId}
            name={source.customName}
            role="customer"
          />
        ) : (
          ''
        );
        break;
      case 'standbyTelephone':
        title = source[key] ? source[key].phoneStr : '';
        content = source[key] ? (
          <PhoneLink
            phone={source[key].phoneStr}
            id={source.customerId}
            name={source.customName}
            role="customer"
          />
        ) : (
          ''
        );
        break;
      case 'customName':
        content = (
          <Link
            target="_blank"
            to={{
              pathname: `${url}/detail/${source.customerId}`,
              state: { fromList: true }
            }}
          >
            {source[key]}
          </Link>
        );
        title = source[key];
        break;
      case 'participant':
        title = content = source['participantName'];
        break;
      case 'oweId':
        title = content = source['oweName'];
        break;
      case 'customSource':
        if (field.fieldType === 'select' && source['sourceType'] === 'LINK') {
          title = content = this.getSourceType(source[key]);
        } else {
          title = content = getFieldValue(field, source[key]);
        }
        break;
      case 'customerType':
        title = content = getFieldValue(field, source[key]);
        break;
      case 'followWay':
        title = content = getFieldValue(field, source[key]);
        break;
      case 'birthday':
        title = content = source[key]
          ? moment(source[key]).format(dateFormatStyle)
          : '';
      case 'customerState':
        const stateLabel = source.isLost
          ? LOST_CUSTOMER_STATE.label
          : (
              (customerStates &&
                customerStates.find(item => item.value === source[key])) ||
              {}
            ).label;
        title = content = stateLabel;
        break;
      case 'accounts':
        content = (
          <AccountItem
            {...this.props}
            ref={this.getAccountItemRefs}
            data={source[key]}
            disabled={!userRights.ACCOUNT}
            onRemoveRef={this.onRemoveAccountRef}
          />
        );
        break;
      case 'isfollow':
        content = (
          <Icon
            className={cs['follow-star']}
            onClick={this.doMarkFollow.bind(
              this,
              source.customerId,
              source.isfollow
            )}
            icon={source.isfollow ? 'collection-soild' : 'collection-outline'}
            title={
              source.isfollow
                ? i18n['customer.detail.cancel_follow']
                : i18n['customer.detail.follow']
            }
          />
        );
        break;
      case 'actions':
        content = (
          <OptionItem
            ref={this.getOptionItemRefs}
            userRights={userRights}
            onActionsSelect={this.onActionsSelect.bind(this, source)}
            onRemoveRef={this.onRemoveOptionRef}
          />
        );
        break;
      case 'dealState': //交易状态
        content =
          source[key] !== undefined ? (
            <span>{i18n[`customer.state_type.dealState${source[key]}`]}</span>
          ) : (
            undefined
          );
        break;
      case 'openState': //开户状态
        content =
          source[key] !== undefined ? (
            <span>{i18n[`customer.state_type.openState${source[key]}`]}</span>
          ) : (
            undefined
          );
        break;
      default:
        if (field.optionList && field.fieldType === 'select') {
          title = content = getFieldValue(field, source[key]);
        } else {
          title = content = source[key];
        }
        break;
    }

    if (field.fieldType === 'date') {
      title = content = source[key]
        ? moment(source[key]).format(DATE_FORMAT)
        : '';
    }
    // userRights
    const editConfig =
      userRights['CUSTOMER_MODIFY_CUSTOMER-INF'] && EDITABLE_FIELDS[key]
        ? fieldToEditConfig(
            field,
            source[key],
            this.onFieldEdit.bind(this, source.customerId, key)
          )
        : undefined;
    return (
      <Td
        key={key}
        editable={!!editConfig}
        fieldConfig={editConfig}
        className={key === 'accounts' ? cs['cancel-hidden'] : ''}
        onClick={clickHandler}
        title={title}
      >
        {content}
      </Td>
    );
  };
  onFieldEdit = (customerId, key, value, cb) => {
    const { addCustomer, getCustomerList } = this.props;
    addCustomer({ customerId, [key]: value }, 'edit').then(res => {
      if (res.result) {
        cb();
        Message.success(i18n['general.modify_success']);
        getCustomerList();
      }
    });
  };
  _renderCellNew = ({ key, data, index, rowData, listData }) => {
    return this._renderCellback(rowData, key, listData || {});
  };
  _columnsGenerator(customerShowcolumns) {
    const { userRights } = this.props;
    let end = customerShowcolumns.map(c => ({
      key: c.key,
      name: ['openState', 'dealState'].includes(c.key)
        ? i18n[`customer.fields.${c.key}`]
        : c.label,
      ...c
    }));
    //大版本权限控制
    if (!userRights['BW_CUSTOMER_GROUP']) {
      end = end.filter(el => el.key !== 'openState');
    }
    if (!userRights['BW_ACCOUNT_GROUP']) {
      end = end.filter(el => el.key !== 'dealState');
    }
    return [
      {
        key: 'actions',
        name: (
          <Icon
            className={cs['pop-btn']}
            icon="set-table-soild"
            onClick={this.toggleModal.bind(this, 'FieldSort', true)}
          />
        )
      },
      {
        key: 'isfollow',
        name: ' '
      },
      ...end
    ];
  }

  toggleModal = (type, toggle) => {
    this.setState({
      [`show${type}Modal`]: toggle
    });
  };

  onSelect = ({ item, selectedKeys, event }) => {
    if (item === null) {
      this.toggleSelectAll(event);
    } else {
      this.toggleSelect(item, !event.target.checked);
    }
  };
  batchActions = type => {
    const {
      match: { path },
      history: { push }
    } = this.props;
    push(`${path}/${type}`);
  };
  renderBatchActions = () => {
    const { userRights } = this.props;
    return (
      <div>
        <TextButton
          className={cs['button-cancel']}
          text={i18n['customer.cancel']}
          onClick={this.toggleSelectAll.bind(this, false)}
        />
        {userRights['CUSTOMER_DELETE'] ? (
          <TextButton
            text={i18n['customer.remove']}
            icon="delete-outline"
            onClick={this.batchActions.bind(this, 'delete')}
          />
        ) : (
          undefined
        )}
        {userRights['CUSTOMER_MODIFY'] && userRights['CUSTOMER_TRANSFER'] ? (
          <TextButton
            text={i18n['customer.transfer']}
            icon="transfer-outline"
            onClick={this.batchActions.bind(this, 'transfer')}
          />
        ) : (
          undefined
        )}
        {userRights['MESSAGE_SEND_OBJECT_OWNC'] ? (
          <TextButton
            text={i18n['general.send_message']}
            icon="chatdots-outline"
            onClick={this.batchActions.bind(this, 'sendMessage')}
          />
        ) : (
          undefined
        )}
        <TextButton
          text={i18n['customer.send_invite_email']}
          onClick={this.batchActions.bind(this, 'sendInvitateEmail')}
          icon="email-outline"
        />
      </div>
    );
  };
  renderHeadCell = ({ item, index, fixed }) => {
    const {
      currentSortParam: { sortBy, orderDesc }
    } = this.props;
    return (
      <Th key={index} fixed={fixed}>
        {sortFieldtoSortByMap[item.key] ? (
          <SortToggle
            activeSort={sortBy}
            orders={[true, false]}
            sortKey={sortFieldtoSortByMap[item.key]}
            activeOrder={orderDesc}
            onChange={this.modifySort}
          >
            {item.name}
          </SortToggle>
        ) : ['accounts', 'customerState'].includes(item.key) ? (
          i18n[`customer.fields.${item.key}`]
        ) : (
          item.name
        )}
      </Th>
    );
  };

  onTableScroll = () => {
    this.accounts.forEach(t => t.hidePopover());
    this.options.forEach(t => t.hidePopover());
  };

  onSort = data => {
    const {
      saveFormSortColumns,
      showTopAlert,
      getListColumns,
      getCustomerList
    } = this.props;
    saveFormSortColumns(data, 't_customer_profiles,t_customer_follow').then(
      ({ result }) => {
        if (result) {
          Message.success(i18n['general.save_success']);
          this.setState({
            showFieldSortModal: false
          });
        }
        getListColumns();
        // getCustomerList();
      }
    );
  };

  parseList = () => {
    const { customerColumns } = this.props;
    const copyData = JSON.parse(JSON.stringify(customerColumns));
    copyData.forEach(item => {
      if (
        [
          'accounts',
          'customerState',
          'recommendedCustomerNum',
          'openState',
          'dealState'
        ].includes(item.key)
      ) {
        item.label = i18n[`customer.fields.${item.key}`];
      }
    });
    return copyData;
  };

  render() {
    const {
      selectedItemsMap,
      customersList,
      paginationInfo,
      customerShowcolumns
    } = this.props;
    const { showFieldSortModal } = this.state;
    const selectedKeys = Object.keys(selectedItemsMap);
    const columns = this._columnsGenerator(customerShowcolumns);
    console.log('selectedKeys', selectedKeys)
    const rowSelectOptions = {
      onChange: this.onSelect,
      selectFieldKey: 'customerId',
      selectedKeys,
      selectedHeader: this.renderBatchActions()
    };
    const I18nLiseColumns = this.parseList();
    return (
      <Layout footer>
        <Content table={customersList.length}>
          <UiTable
            data={customersList}
            columns={columns}
            fixedHeader
            renderCell={this._renderCellNew}
            rowSelectOptions={rowSelectOptions}
            renderHeadCell={this.renderHeadCell}
            onTableScroll={this.onTableScroll}
            pager={
              customersList.length ? (
                <PaginationBar
                  total={paginationInfo.total}
                  pageSize={paginationInfo.pageSize}
                  pageNo={paginationInfo.currentPage}
                  onPageChange={this.onPageChange}
                />
              ) : (
                undefined
              )
            }
          />
          {customersList.length ? undefined : <NoDataView />}
        </Content>

        {showFieldSortModal ? (
          <FieldSort
            title={i18n['general.data.table_sort_title']}
            sortable
            data={I18nLiseColumns}
            onSubmit={this.onSort}
            onHide={this.toggleModal.bind(this, 'FieldSort', false)}
          />
        ) : (
          undefined
        )}
      </Layout>
    );
  }
}
