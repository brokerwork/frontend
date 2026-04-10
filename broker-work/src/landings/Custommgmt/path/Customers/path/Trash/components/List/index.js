import moment from 'moment';
import Checkbox from 'components/Checkbox';
import PaginationBar from 'components/v2/PaginationBar';
import PhoneLink from 'components/PhoneLink';
import getFieldValue from 'utils/fieldValue';
import { dateFormatStyle } from 'utils/config';
import cs from './List.less';
import i18n from 'utils/i18n';
import { Link } from 'react-router-dom';
import { DELETE_REASONS } from '../../../../constant';
import { Layout, Sider, Content, Summary } from 'components/v2/PageWraper';
import { Table, Message, Icon, Popover, Menu } from 'lean-ui';
import TextButton from 'components/v2/TextButton';
const DATE_FORMAT = `${dateFormatStyle} HH:mm:ss`;
const sortField = ['revisitTime', 'createTime', 'followTime'];

export default class List extends PureComponent {
  state = {
    showCard: false
  };
  componentDidMount() {
    const { getCustomerList } = this.props;
    getCustomerList();
  }
  toggleSelectAll = evt => {
    let isSelected = evt;
    if (evt && evt.target) {
      isSelected = evt.target.checked;
    }
    const { updateSelectedItems, customersList } = this.props;
    let map = {};
    customersList.forEach(o => {
      let customerId = o.customerId;
      if (isSelected) {
        map[customerId] = o;
      }
    });
    updateSelectedItems(map);
  };
  toggleSelect = (customer, isSelected) => {
    let { customerId } = customer;
    const { updateSelectedItems, selectedItemsMap } = this.props;
    let map = Object.assign({}, selectedItemsMap);
    if (isSelected) {
      map[customerId] = customer;
    } else {
      delete map[customerId];
    }
    let numKeys = Object.keys(map).length;

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
  modifySort = v => {
    const {
      currentSortParam,
      updateCurrentSortParam,
      getCustomerList
    } = this.props;
    let parseSortBy = '';
    switch (v) {
      case 'createTime':
        parseSortBy = 'CreateTime';
        break;
      case 'revisitTime':
        parseSortBy = 'RevisitTime';
        break;
      case 'followTime':
        parseSortBy = 'FollowTime';
        break;
    }
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

  renderHeadCell = ({ item, index, fixed }) => {
    return (
      <Table.Th key={index} fixed={fixed}>
        {item.label}
      </Table.Th>
    );
  };
  getSourceType = key => {};
  renderCell = ({ key, data, rowData: source, listData: field = {} }) => {
    const {
      match: { url },
      customerStates
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
        title = content = source[key] ? source[key].phoneStr : '';
        break;
      case 'customName':
        content = (
          <Link
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
      case 'modifyTime':
        title = content = source[key]
          ? moment(source[key]).format(DATE_FORMAT)
          : '';
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
      case 'customerState':
        title = content = source.isLost
          ? i18n['customer.state_type.lost']
          : (customerStates.find(item => item.value === source[key]) || {})
              .label;
        break;
      case 'removeReason':
        title = content =
          (DELETE_REASONS.find(item => item.value === source[key]) || {})
            .label || source[key];
        break;
      case 'actions':
        content = (
          <Popover
            placement="rightTop"
            trigger="click"
            getPopupContainer={triger => triger}
            overlayClassName={cs['menu-pop']}
            content={
              <Menu
                onSelect={this.onActionsSelect.bind(this, source)}
                selectedKeys={[]}
              >
                <Menu.Item key={'reset'}>
                  {i18n['customer.trash.reset']}
                </Menu.Item>
                <Menu.Divider key="divider" />
                <Menu.Item key={'delete'}>{i18n['customer.remove']}</Menu.Item>
              </Menu>
            }
          >
            <Icon className={cs['pop-btn']} icon={'hamburger-table'} />
          </Popover>
        );
        break;
      default:
        title = content = source[key];
        break;
    }

    if (field.fieldType === 'date') {
      title = content = source[key]
        ? moment(source[key]).format(DATE_FORMAT)
        : '';
    }

    return (
      <Table.Td key={key} onClick={clickHandler}>
        <span title={title}>{content}</span>
      </Table.Td>
    );
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
      switch (key) {
        case 'delete':
          this.onDeleteCustomer();
          break;
        case 'reset':
          this.onResetCustomer();
          break;
        default:
      }
    });
  };

  onSelect = ({ item, selectedKeys, event }) => {
    if (item === null) {
      this.toggleSelectAll(event);
    } else {
      this.toggleSelect(item, event.target.checked);
    }
  };

  doDeleteCustomer = () => {
    const {
      selectedItemsMap,
      destroyCustomer,
      getCustomerList,
      showTopAlert
    } = this.props;
    const ids = Object.keys(selectedItemsMap);
    return destroyCustomer({ ids }).then(res => {
      if (res.result) {
        getCustomerList();
        Message.success(i18n['general.remove_success']);
        return Promise.resolve();
      }
    });
  };

  onDeleteCustomer = () => {
    const { showTipsModal } = this.props;
    showTipsModal({
      content: i18n['customer.remove_modal.completely_delete_confirmation'],
      onConfirm: cb => {
        this.doDeleteCustomer().then(() => {
          cb();
        });
      }
    });
  };

  doResetCustomer = () => {
    const {
      selectedItemsMap,
      resetCustomer,
      getCustomerList,
      showTopAlert
    } = this.props;
    const ids = Object.keys(selectedItemsMap);
    return resetCustomer({ ids }).then(res => {
      if (res.result) {
        getCustomerList();
        Message.success(i18n['customer.trash.reset_success']);
        return Promise.resolve();
      }
    });
  };

  onResetCustomer = () => {
    const {
      match: { path },
      history: { push }
    } = this.props;
    const { showTipsModal } = this.props;
    showTipsModal({
      content: i18n['customer.remove_modal.reset_confirmation'],
      onConfirm: cb => {
        this.doResetCustomer().then(() => {
          cb();
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
          onClick={this.toggleSelectAll.bind(this, false)}
        />
        {userRights['CUSTOMER_DELETE'] ? (
          <TextButton
            text={i18n['customer.remove']}
            icon="delete-outline"
            onClick={this.onDeleteCustomer}
          />
        ) : (
          undefined
        )}
        {userRights['CUSTOMER_MODIFY'] ? (
          <TextButton
            text={i18n['customer.trash.reset']}
            icon="activation-outline"
            onClick={this.onResetCustomer}
          />
        ) : (
          undefined
        )}
      </div>
    );
  };
  _columnsGenerator(customerShowcolumns) {
    const end = customerShowcolumns.map(c => ({
      key: c.key,
      name: c.label,
      ...c
    }));
    return [
      {
        key: 'actions',
        name: ''
      },
      ...end
    ];
  }
  render() {
    const {
      selectedItemsMap,
      customersList,
      customerColumns,
      paginationInfo
    } = this.props;
    const selectedKeys = Object.keys(selectedItemsMap);
    const columns = this._columnsGenerator(customerColumns);
    return (
      <Layout footer>
        <Content table>
          <Table
            data={customersList}
            columns={columns}
            fixedHeader
            renderCell={this.renderCell}
            renderHeadCell={this.renderHeadCell}
            rowSelectOptions={{
              onChange: this.onSelect,
              selectFieldKey: 'customerId',
              selectedKeys,
              selectedHeader: this.renderBatchActions()
            }}
          >
            {/* <Table.Header>
              <th>
                <Checkbox
                  checked={isAllSelected}
                  onChange={this.toggleSelectAll}
                />
              </th>
              {this._renderTableHeaders()}
            </Table.Header>
            <Table.Body>{this._renderTableBody()}</Table.Body> */}
          </Table>
        </Content>

        <PaginationBar
          total={paginationInfo.total}
          pageSize={paginationInfo.pageSize}
          pageNo={paginationInfo.currentPage}
          onPageChange={this.onPageChange}
        />
      </Layout>
    );
  }
}
