import { Table, Dropdown, Icon, Menu } from 'lean-ui';
import { Content, Layout } from 'components/v2/PageWraper';
import cs from './style.less';
import i18n from 'utils/i18n';
import SortToggle from 'components/v2/SortToggle';
import RenameModal from './RenameModal';
import moment from 'moment';
const { Td, Th } = Table;
const fakeData = [
  {
    id: 1,
    login: '123',
    ticket: '1111',
    name: 'alex',
    group: 'ASD/QWE',
    accountGroup: 'aaa',
    userId: 'bbb',
    leverage: '1:1',
    customerSource: 'fromabc',
    createTime: moment('2019-06-18 08:00').unix(),
    firstDepositTime: moment('2019-06-18 10:00').unix(),
    openTime: moment('2019-06-18 11:00').unix(),
    balance: 10,
    equity: 11,
    credit: 12,
    deposit: 100,
    withdraw: 200,
    netDeposit: 300,
    closeVolume: 5,
    cmd: 'sell',
    sl: 100,
    tp: 1000,
    swap: 10,
    profit: 20,
    levelName: '一级代理',
    newCommissionAmount: 1000,
    newDealAmount: 10,
    newDepositAmount: 10,
    newDirectAccountCount: 100,
    newWithdrawalAmount: 10,
    remainAccountCount: 11,
    newDirectCustomCount: 12,
    newNetDepositAmount: 122,
    remainCustomerCount: 3,
    remainSubUserCount: 2,
    marginRatio: 10,
    userName: 'ADC',
    closeCommission: 100,
    closeProfit: 10,
    closeSwap: 110,
    directRebate: 200,
    endBalance: 32,
    margin: 100,
    marginFree: 210,
    orderQuantity: 12,
    rebate: 21,
    settleEquity: 123,
    settlePositionProfit: 345,
    settlePositionSwap: 11,
    settleProfit: 12,
    startBalance: 32,
    settleSwap: 43,
    startCredit: 34,
    cmd: 'sell',
    comment: 'comment1',
    closePrice: 199,
    commission: 30,
    openPrice: 10,
    symbol: 'A',
    volume: 120,
    direction: '开仓',
    marginRate: '10:1'
  },
  {
    id: 2,
    login: '456',
    ticket: '2222',
    name: 'bob',
    group: 'ASD/QWE',
    accountGroup: 'aaa',
    userId: 'bbb',
    leverage: '1:1',
    customerSource: 'fromabc',
    createTime: moment('2019-06-17 08:00').unix(),
    firstDepositTime: moment('2019-06-17 10:00').unix(),
    openTime: moment('2019-06-17 11:00').unix(),
    balance: 11230,
    equity: 11231,
    credit: 1122,
    deposit: 112300,
    withdraw: 212300,
    netDeposit: 312300,
    closeVolume: 50,
    cmd: 'sell',
    sl: 200,
    tp: 2000,
    swap: 2110,
    profit: 220,
    levelName: '二级代理',
    newCommissionAmount: 1000,
    newDealAmount: 10,
    newDepositAmount: 10,
    newDirectAccountCount: 100,
    newWithdrawalAmount: 120,
    remainAccountCount: 141,
    newDirectCustomCount: 132,
    newNetDepositAmount: 142,
    remainCustomerCount: 31,
    remainSubUserCount: 10,
    marginRatio: 110,
    userName: 'ADCasd',
    closeCommission: 1200,
    closeProfit: 130,
    closeSwap: 120,
    directRebate: 210,
    endBalance: 321,
    margin: 120,
    marginFree: 260,
    orderQuantity: 120,
    rebate: 21,
    settleEquity: 123,
    settlePositionProfit: 3245,
    settlePositionSwap: 112,
    settleProfit: 122,
    startBalance: 322,
    settleSwap: 432,
    startCredit: 342,
    cmd: 'buy',
    comment: 'comment2',
    closePrice: 20,
    commission: 20,
    openPrice: 10,
    symbol: 'b',
    volume: 180,
    direction: '开仓',
    marginRate: '10:1'
  },
  {
    id: 3,
    login: '789',
    ticket: '3333',
    name: 'eden',
    group: 'ASD/QWE',
    accountGroup: 'aaa',
    userId: 'bbb',
    leverage: '1:1',
    customerSource: 'fromabc',
    createTime: moment('2019-06-16 08:00').unix(),
    firstDepositTime: moment('2019-06-16 10:00').unix(),
    openTime: moment('2019-06-16 11:00').unix(),
    balance: 1110,
    equity: 1221,
    credit: 1332,
    deposit: 14400,
    withdraw: 25500,
    netDeposit: 66300,
    closeVolume: 125,
    cmd: 'buy',
    sl: 300,
    tp: 3000,
    swap: 30,
    profit: 120,
    levelName: 'IB2',
    newCommissionAmount: 1001,
    newDealAmount: 15,
    newDepositAmount: 11,
    newDirectAccountCount: 120,
    newWithdrawalAmount: 30,
    remainAccountCount: 21,
    newDirectCustomCount: 32,
    newNetDepositAmount: 152,
    remainCustomerCount: 13,
    remainSubUserCount: 130,
    marginRatio: 130,
    userName: 'ADCasd',
    closeCommission: 130,
    closeProfit: 150,
    closeSwap: 150,
    directRebate: 250,
    endBalance: 351,
    margin: 150,
    marginFree: 250,
    orderQuantity: 150,
    rebate: 25,
    settleEquity: 15,
    settlePositionProfit: 3255,
    settlePositionSwap: 152,
    settleProfit: 152,
    startBalance: 352,
    settleSwap: 452,
    startCredit: 352,
    cmd: 'sell',
    comment: 'comment1123123',
    closePrice: 120,
    commission: 10,
    openPrice: 20,
    symbol: 'A/B',
    volume: 100,
    direction: '平仓',
    marginRate: '20:1'
  }
];
export default class FieldEditList extends PureComponent {
  state = {
    renameModal: false,
    currentField: {}
  };
  onFieldRename = field => {
    this.setState({
      renameModal: true,
      currentField: field
    });
  };
  onSelect = (item, { key }) => {
    const { onFieldRemove } = this.props;
    if (key === 'rename') {
      this.onFieldRename(item);
    }
    if (key === 'remove') {
      onFieldRemove(item);
    }
  };
  renderHeadCell = ({ item }) => {
    const { sortData, onSortChange } = this.props;
    const { sortingColumn, sortingDirection } = sortData;
    return (
      <Th key={item.fieldId}>
        {item.sortable ? (
          <SortToggle
            activeSort={sortingColumn}
            sortKey={item.fieldId}
            activeOrder={sortingDirection}
            onChange={onSortChange}
          >
            {item.fieldName || item.message}
          </SortToggle>
        ) : (
          item.fieldName || item.message
        )}
        <Dropdown
          overlay={
            <Menu onSelect={this.onSelect.bind(this, item)} selectable selectedKeys={[]}>
              <Menu.Item key="rename">{i18n['general.rename']}</Menu.Item>
              {item.required ? (
                <Menu.Item key="remove">{i18n['general.delete']}</Menu.Item>
              ) : null}
            </Menu>
          }
          trigger="click"
          className={`main-color ${cs['view-dropdown']}`}
        >
          <span className={cs['field-menu']}>
            <Icon icon="caret-bottom" />
          </span>
        </Dropdown>
      </Th>
    );
  };
  renderCell = ({ rowData, listData }) => {
    return this._renderCell(rowData, listData || {});
  };
  _renderCell = (source, field) => {
    const key = field.fieldId;
    let content = null;
    let title;
    if (field.fieldType === 'date') {
      title = content = moment(source[key]).format('YYYY-MM-DD HH:mm');
    } else {
      title = content = source[key];
    }
    return (
      <Td key={key} className={'active-actions'} title={title}>
        {content}
      </Td>
    );
  };
  render() {
    const {
      typeFieldsSelected = [],
      onFieldNameChange,
      submitForm,
      sortData: { sortingColumn, sortingDirection },
      showTopAlert
    } = this.props;
    const { renameModal, currentField } = this.state;
    let sortedData = [];
    if (sortingColumn) {
      sortedData = fakeData.sort((a, b) => {
        if (sortingDirection === 'DESC') {
          return b[sortingColumn] - a[sortingColumn];
        } else {
          return a[sortingColumn] - b[sortingColumn];
        }
      });
    } else {
      sortedData = fakeData;
    }
    return (
      <Layout footer>
        <Content table>
          <Table
            className={cs.table}
            columns={typeFieldsSelected}
            renderHeadCell={this.renderHeadCell}
            data={sortedData}
            renderCell={this.renderCell}
          />
          {renameModal ? (
            <RenameModal
              columns={typeFieldsSelected}
              submitForm={submitForm}
              onFieldNameChange={onFieldNameChange}
              currentField={currentField}
              showTopAlert={showTopAlert}
              closeModal={() =>
                this.setState({
                  renameModal: false
                })
              }
            />
          ) : null}
        </Content>
      </Layout>
    );
  }
}
