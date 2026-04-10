import moment from 'moment';
// import Table from 'components/Table';
import Checkbox from 'components/Checkbox';
import PaginationBar from 'components/PaginationBar';
import PhoneLink from 'components/PhoneLink';
import getFieldValue from 'utils/fieldValue';
import { dateFormatStyle } from 'utils/config';
import cs from './List.less';
import i18n from 'utils/i18n';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { Button, Table, Icon, Dialog, Select, Radio } from 'lean-ui';
import { Layout, Sider, Content, Summary } from 'components/v2/PageWraper';

const DATE_FORMAT = `${dateFormatStyle} HH:mm:ss`;
const sortField = ['revisitTime', 'createTime', 'followTime'];
// class DuplicateItem extends Component {
//   state = {
//     open: true
//   };
//   toggleOpen = toggle => {
//     this.setState({
//       open: toggle
//     });
//   };
//   render() {
//     const { data, keyIndex } = this.props;
//     const { open } = this.state;
//     const showData = open ? data : (data[0] && [data[0]]) || [];
//     return (
//       <Table.Body className={cs['t-body']}>
//         {showData.map((item, i) => {
//           return (
//             <tr key={i}>
//               <td>
//                 {i === 0 ? (
//                   <span
//                     onClick={this.toggleOpen.bind(this, !open)}
//                     className={cs['toggle-btn']}
//                   >
//                     {open ? '-' : '+'}
//                   </span>
//                 ) : (
//                   undefined
//                 )}
//               </td>
//               <td>
//                 <a
//                   target="_blank"
//                   href={`/custommgmt/customers/detail/${item.customerId}`}
//                 >
//                   {item.customName}
//                 </a>
//               </td>
//               <td>{item.phones && item.phones.phoneStr}</td>
//               <td>{item.email}</td>
//               <td>{item.im}</td>
//               <td>{moment(item.createTime).format(dateFormatStyle)}</td>
//               <td>{item.oweName}</td>
//             </tr>
//           );
//         })}
//       </Table.Body>
//     );
//   }
// }
const COLUMNS = [
  { key: 'toggle', label: '' },
  { key: 'customName', label: i18n['customer.fields.customer_name'] },
  { key: 'phones', label: i18n['customer.fields.phones'] },
  { key: 'email', label: i18n['customer.fields.email'] },
  { key: 'im', label: i18n['customer.fields.im'] },
  { key: 'createTime', label: i18n['customer.fields.create_time'] },
  { key: 'ownName', label: i18n['customer.fields.own_name'] }
];
export default class List extends PureComponent {
  state = {
    showCard: false,
    hideKeyMap: {},
    selectedKeys: [],
    showCustomerModal: false,
    customer: ''
  };
  componentDidMount() {
    const { getDuplicateList, getFields } = this.props;
    getDuplicateList();
    getFields().then(rs => {
      if (rs.result) {
        rs.data.t_customer_profiles.forEach(el => {
          this.setState({
            [el.key]: 0
          });
        });
        rs.data.t_account_profiles.forEach(el => {
          this.setState({
            [el.key]: 0
          });
        });
        rs.data.t_account_id_info.forEach(el => {
          this.setState({
            [el.key]: 0
          });
        });
        rs.data.t_account_finacial.forEach(el => {
          this.setState({
            [el.key]: 0
          });
        });
      }
    });
  }

  onPageChange = ({ pageNo, pageSize }) => {
    const { updatePagination, getDuplicateList } = this.props;
    Promise.resolve(
      updatePagination({
        currentPage: pageNo,
        pageSize
      })
    ).then(() => {
      getDuplicateList();
    });
  };
  renderTableBody = () => {
    const { duplicatesList } = this.props;
    return duplicatesList.map((duplicates, i) => {
      return <DuplicateItem key={i} data={duplicates} />;
    });
  };
  toggleHide = (key, toggle) => {
    const { hideKeyMap } = this.state;
    this.setState({
      hideKeyMap: {
        ...hideKeyMap,
        [key]: toggle
      }
    });
  };
  renderCell = ({ key, data, rowData, listData }) => {
    const { hideKeyMap } = this.state;
    const hide = hideKeyMap[rowData.customerId];
    let content = '';
    switch (key) {
      case 'toggle':
        content = rowData.first ? (
          <Icon
            icon={hide ? 'add-rectangle' : 'minus-rectangle'}
            className={cs['toggle-btn']}
            onClick={this.toggleHide.bind(this, rowData.customerId, !hide)}
          />
        ) : (
          undefined
        );
        break;
      case 'createTime':
        content = rowData[key] && moment(rowData[key]).format(dateFormatStyle);
        break;
      case 'phones':
      case 'im':
        content = rowData.phones && rowData.phones.phoneStr;
        break;
      default:
        content = rowData[key];
    }
    return <Table.Td>{content}</Table.Td>;
  };
  renderHeadCell = ({ item, index, fixed }) => {
    return (
      <Table.Th key={index} fixed={fixed}>
        {item.label}
      </Table.Th>
    );
  };
  getShowList = () => {
    const { hideKeyMap } = this.state;
    const { duplicatesList } = this.props;
    return duplicatesList.reduce((arr, item, idx) => {
      const copyData = JSON.parse(JSON.stringify(item));
      copyData[0].first = true;
      if (!hideKeyMap[copyData[0].customerId]) {
        return arr.concat(copyData);
      } else {
        return arr.concat(copyData[0]);
      }
    }, []);
  };
  renderBatchActions = () => {
    const { selectedKeys } = this.state;
    let disabled = false;
    const { duplicatesList } = this.props;
    let groupKeys = [];
    selectedKeys.length &&
      duplicatesList
        .find(el => {
          return el.some(item => {
            return item.customerId === selectedKeys[0];
          });
        })
        .forEach(el => {
          groupKeys.push(el.customerId);
        });
    selectedKeys.forEach(el => {
      disabled = !groupKeys.includes(el);
    });
    return (
      <div style={{ marginLeft: 16 }}>
        <FormattedMessage
          id="customer.duplicate.hasChose"
          defaultMessage={i18n['customer.duplicate.hasChose']}
          values={{
            number: selectedKeys.length
          }}
        />
        <Button
          size="small"
          type="primary"
          disabled={selectedKeys.length === 1 || disabled}
          onClick={this.showCustomerModal.bind(this, selectedKeys)}
        >
          {i18n['customer.duplicate.merge']}
        </Button>
      </div>
    );
  };
  nameMap = {};
  unBindUsers = [];
  showCustomerModal = selectedKeys => {
    this.props.getHasBindUsersId(selectedKeys).then(rs => {
      this.setState(
        {
          showCustomerModal: true
        },
        () => {
          const { selectedKeys } = this.state;
          const { bindUsersId } = this.props;
          const unBindUsers = selectedKeys.filter(el => {
            return !bindUsersId.includes(el);
          });
          if (!unBindUsers.length) return;
          this.unBindUsers = unBindUsers;
          this.setState({
            customer: unBindUsers[0]
          });
          this.props.getUsersInfo(unBindUsers);
        }
      );
    });
  };
  onCancelCustomerModal = () => {
    this.setState({
      showCustomerModal: false
    });
  };
  confirmMerge = () => {
    const { selectedKeys, customer } = this.state;
    const { bindUsersId, showTopAlert, usersInfo } = this.props;
    if (selectedKeys.length === bindUsersId.length) {
      showTopAlert({
        content: i18n['customer.duplicate.cannot']
      });
      return;
    }
    let remainCustomer = usersInfo[customer];
    let chosenInfo = {
      customer: {},
      owner: {
        baseInfo: {},
        certificatesInfo: {},
        financialInfo: {}
      }
    };
    this.filterCustomerFields.forEach(el => {
      let chosenIndex = this.state[el.key];
      let id = this.unBindUsers[chosenIndex];
      chosenInfo.customer[el.key] = usersInfo[id].customer[el.key];
    });
    this.filterBaseFields.forEach(el => {
      let chosenIndex = this.state[el.key];
      let id = this.unBindUsers[chosenIndex];
      chosenInfo.owner.baseInfo[el.key] = usersInfo[id].owner.baseInfo[el.key];
    });
    this.filterIdFields.forEach(el => {
      let chosenIndex = this.state[el.key];
      let id = this.unBindUsers[chosenIndex];
      chosenInfo.owner.certificatesInfo[el.key] =
        usersInfo[id].owner.certificatesInfo[el.key];
    });
    this.filterFinanceFields.forEach(el => {
      let chosenIndex = this.state[el.key];
      let id = this.unBindUsers[chosenIndex];
      chosenInfo.owner.financialInfo[el.key] =
        usersInfo[id].owner.financialInfo[el.key];
    });
    const deleteCustomerIds = selectedKeys.filter(el => {
      return el !== customer;
    });
    const finalInfo = _.merge(remainCustomer, chosenInfo, {
      deleteCustomerIds
    });
    this.props.saveMergeInfo(finalInfo).then(rs => {
      if (rs.result) {
        this.props.showTopAlert({
          bsStyle: 'success',
          content: i18n['customer.duplicate.success']
        });
        this.setState({
          showCustomerModal: false
        });
      }
    });
  };
  onSelect = ({ item, selectedKeys, event }) => {
    if (item) {
      this.nameMap[item.customerId] = item.customName;
    }
    this.setState({
      selectedKeys
    });
  };
  onChangeCustomer = customerId => {
    this.setState({
      customer: customerId
    });
  };
  onChange = (key, value) => {
    this.setState({
      [key]: value
    });
  };
  render() {
    const { selectedKeys } = this.state;
    const rowSelectOptions = {
      onChange: this.onSelect,
      selectFieldKey: 'customerId',
      selectedKeys,
      selectedHeader: this.renderBatchActions()
    };
    const data = this.getShowList();
    const { bindUsersId, usersInfo, fields } = this.props;
    this.filterCustomerFields = fields.t_customer_profiles.filter(el => {
      return (
        usersInfo[this.unBindUsers[0]] &&
        Object.keys(usersInfo[this.unBindUsers[0]].customer).includes(el.key)
      );
    });
    this.filterBaseFields = fields.t_account_profiles.filter(el => {
      return (
        usersInfo[this.unBindUsers[0]] &&
        Object.keys(usersInfo[this.unBindUsers[0]].owner.baseInfo).includes(
          el.key
        )
      );
    });
    this.filterIdFields = fields.t_account_id_info.filter(el => {
      return (
        usersInfo[this.unBindUsers[0]] &&
        Object.keys(
          usersInfo[this.unBindUsers[0]].owner.certificatesInfo
        ).includes(el.key)
      );
    });
    this.filterFinanceFields = fields.t_account_finacial.filter(el => {
      return (
        usersInfo[this.unBindUsers[0]] &&
        Object.keys(
          usersInfo[this.unBindUsers[0]].owner.financialInfo
        ).includes(el.key)
      );
    });
    // data.length = 20;
    const isPro =
      this.props.brandInfo.topVersionId === 'TV002' ||
      this.props.brandInfo.topVersionId === 'TV003';
    return (
      <Layout>
        <Content table>
          <Table
            data={data}
            columns={COLUMNS}
            rowSelectOptions={isPro && rowSelectOptions}
            renderCell={this.renderCell}
            renderHeadCell={this.renderHeadCell}
            fixedHeader
          />
          <Dialog
            width={800}
            title={i18n['customer.duplicate.merge']}
            visible={this.state.showCustomerModal}
            closable={true}
            cancelText={i18n['general.cancel']}
            okText={i18n['general.apply']}
            onOk={this.confirmMerge}
            onCancel={this.onCancelCustomerModal}
          >
            <div className={cs.tip}>
              <span>*</span>
              {i18n['customer.duplicate.choose']}
            </div>
            <Select
              onSelect={this.onChangeCustomer}
              defaultValue={selectedKeys[0]}
            >
              {selectedKeys.map(el => {
                return (
                  <Select.Option value={el}>{this.nameMap[el]}</Select.Option>
                );
              })}
            </Select>
            {!!bindUsersId.length && (
              <p className={cs.tip1}>
                {i18n['customer.duplicate.customers']}
                <span>
                  {bindUsersId
                    .map(el => {
                      return this.nameMap[el];
                    })
                    .join(', ')}
                </span>
                {i18n['customer.duplicate.customers.bind']}
              </p>
            )}
            {this.unBindUsers.length && (
              <div>
                <p className={cs.tip2}>
                  {i18n['customer.duplicate.delete.other']}
                </p>
                <div className={cs.tip}>
                  <span>*</span>
                  {i18n['customer.duplicate.customer.merge']}
                </div>
                {this.filterCustomerFields.map(el => {
                  return (
                    <div className={cs.list}>
                      <span>{el.label}</span>
                      {this.unBindUsers.map((user, index) => {
                        let label = usersInfo[user].customer[el.key];
                        if (el.key === 'phones' && label) {
                          label = usersInfo[user].customer[el.key].phoneStr;
                        }
                        return (
                          <Radio
                            className={cs['row']}
                            key={user}
                            name={el.key}
                            onChange={this.onChange.bind(this, el.key, index)}
                            checked={this.state[el.key] === index}
                          >
                            <span title={label}>{label || '空'}</span>
                          </Radio>
                        );
                      })}
                    </div>
                  );
                })}
                {this.filterBaseFields.map(el => {
                  return (
                    <div className={cs.list}>
                      <span>{el.label}</span>
                      {this.unBindUsers.map((user, index) => {
                        let label = usersInfo[user].owner.baseInfo[el.key];
                        if (el.key === 'phones' && label) {
                          label =
                            usersInfo[user].owner.baseInfo[el.key].phoneStr;
                        }
                        return (
                          <Radio
                            className={cs['row']}
                            key={user}
                            name={el.key}
                            onChange={this.onChange.bind(this, el.key, index)}
                            checked={this.state[el.key] === index}
                          >
                            <span title={label}>{label || '空'}</span>
                          </Radio>
                        );
                      })}
                    </div>
                  );
                })}
                {this.filterIdFields.map(el => {
                  return (
                    <div className={cs.list}>
                      <span>{el.label}</span>
                      {this.unBindUsers.map((user, index) => {
                        let label =
                          usersInfo[user].owner.certificatesInfo[el.key];
                        if (el.key === 'phones' && label) {
                          label =
                            usersInfo[user].owner.certificatesInfo[el.key]
                              .phoneStr;
                        }
                        return (
                          <Radio
                            className={cs['row']}
                            key={user}
                            name={el.key}
                            onChange={this.onChange.bind(this, el.key, index)}
                            checked={this.state[el.key] === index}
                          >
                            <span title={label}>{label || '空'}</span>
                          </Radio>
                        );
                      })}
                    </div>
                  );
                })}
                {this.filterFinanceFields.map(el => {
                  return (
                    <div className={cs.list}>
                      <span>{el.label}</span>
                      {this.unBindUsers.map((user, index) => {
                        let label = usersInfo[user].owner.financialInfo[el.key];
                        if (el.key === 'phones' && label) {
                          label =
                            usersInfo[user].owner.financialInfo[el.key]
                              .phoneStr;
                        }
                        return (
                          <Radio
                            className={cs['row']}
                            key={user}
                            name={el.key}
                            onChange={this.onChange.bind(this, el.key, index)}
                            checked={this.state[el.key] === index}
                          >
                            <span title={label}>{label || '空'}</span>
                          </Radio>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            )}
          </Dialog>
          {/* <Table.Header fixed>
              <th />
              <th>{i18n['customer.fields.customer_name']}</th>
              <th>{i18n['customer.fields.phones']}</th>
              <th>{i18n['customer.fields.email']}</th>
              <th>{i18n['customer.fields.im']}</th>
              <th>{i18n['customer.fields.create_time']}</th>
              <th>{i18n['customer.fields.own_name']}</th>
            </Table.Header>
            {this.renderTableBody()} */}

          {/* <PaginationBar
          total={paginationInfo.total}
          pageSize={paginationInfo.pageSize}
          pageNo={paginationInfo.currentPage}
          onPageChange={this.onPageChange}
          className={cs['pagination-bar']}
        /> */}
        </Content>
      </Layout>
    );
  }
}
