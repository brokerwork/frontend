import moment from 'moment';
import Table from 'components/Table';
import Checkbox from 'components/Checkbox';
import PaginationBar from 'components/PaginationBar';
import ContactsEditModal from '../../containers/ContactsEditModal';
import i18n from 'utils/i18n';
import getFieldValue from 'utils/fieldValue';
import cs from './ContactsList.less';
import { Link } from 'react-router-dom';
import PhoneLink from 'components/PhoneLink';
import NoDataView from 'components/NoDataView';

const formatStyle = 'YYYY-MM-DD HH:mm:ss';
const linkColumns = ['contactsName'];
const dateColumns = ['birthday', 'createTime'];
const phoneColumns = ['phones', 'telephone'];
const countryColumns = ['country'];

export default class ContactsList extends PureComponent {
  state = {
    showCreateContactsModal: false
  };

  status = {
    contactsInfo: false
  };

  componentWillMount() {
    const {
      getListColumns,
      getFormColumns,
      match: { params: { contactId } = {} }
    } = this.props;
    getListColumns();
    getFormColumns();
    if (contactId) {
      this.toggleModal({ contactId }, true);
    }
  }

  componentWillReceiveProps(nextProps) {
    const currentContactId =
      this.props.match.params && this.props.match.params.contactId;
    const nextContactrId =
      nextProps.match.params && nextProps.match.params.contactId;
    if (nextContactrId && nextContactrId !== currentContactId) {
      this.toggleModal({ contactId: nextContactrId }, true);
    }
  }
  getContactsList = () => {
    const {
      getContactsList,
      fuzzyItem,
      fuzzyVal,
      currentPrivilegeType,
      currentPage
    } = this.props;
    getContactsList({
      filterType: currentPrivilegeType.value,
      fuzzyItem: fuzzyItem.value,
      fuzzyVal: fuzzyVal,
      currentPage: currentPage.pageNo,
      pageSize: currentPage.pageSize
    });
  };

  toggleSelectAll = evt => {
    const {
      updateSelectedContacts,
      selectedContacts,
      contactsList
    } = this.props;
    const checked = evt.target.checked;
    const contacts = checked
      ? [].concat(
          selectedContacts.filter(
            _contact =>
              !contactsList.list.some(
                contact => contact.contactId == _contact.contactId
              )
          ),
          contactsList.list
        )
      : selectedContacts.filter(
          _contact =>
            !contactsList.list.some(
              contact => contact.contactId === _contact.contactId
            )
        );

    updateSelectedContacts(contacts);
  };

  selectContact = (contact, evt) => {
    const { updateSelectedContacts, selectedContacts } = this.props;
    const checked = evt.target.checked;
    const copyContacts = selectedContacts.concat();

    if (checked) {
      copyContacts.push(contact);
    } else {
      const idx = copyContacts.findIndex(
        _contact => _contact.contactId === contact.contactId
      );
      copyContacts.splice(idx, 1);
    }
    updateSelectedContacts(copyContacts);
  };

  toggleModal = (item, toggle) => {
    const {
      findContacts,
      getCustomerParticipant,
      customerDetailInfo
    } = this.props;
    if (toggle) {
      Promise.resolve(
        findContacts(item.contactId),
        customerDetailInfo.enabled
      ).then(res => {
        if (res.result) {
          getCustomerParticipant(res.data.customerId);
          this.setState({
            showCreateContactsModal: toggle
          });
        }
      });
    } else {
      const { match: { path }, history: { push } } = this.props;
      this.setState(
        {
          showCreateContactsModal: toggle
        },
        () => {
          push(path.replace('/:contactId', ''));
        }
      );
    }
  };
  //修改联系人数据成功并提交
  saveContactsInfo = (info, type) => {
    const {
      editContacts,
      showTopAlert,
      match: { path },
      history: { push }
    } = this.props;
    const copyData = JSON.parse(JSON.stringify(info));
    editContacts(copyData).then(({ result }) => {
      if (result) {
        showTopAlert({
          bsStyle: 'success',
          content: i18n['general.modify_success']
        });
        this.getContactsList();
        this.setState({
          showCreateContactsModal: false
        });
        push(path.replace('/:contactId', ''));
      }
    });
    this.status[type] = true;
  };

  //修改数据失败
  saveInfoFail = (info, type) => {
    this.status[type] = false;
  };

  _renderTableHeader = () => {
    const { listColumns } = this.props;

    return listColumns.map((col, index) => {
      return <th key={index}>{col.label}</th>;
    });
  };

  _renderTableBodyRow = (item, index) => {
    const { listColumns, selectedContactsIds, userRights } = this.props;
    const checked = selectedContactsIds.some(id => id == item.contactId);
    return (
      <tr key={index}>
        <td>
          <Checkbox
            checked={checked}
            onChange={this.selectContact.bind(this, item)}
          />
        </td>
        {listColumns.map((col, _idx) => {
          const v = dateColumns.includes(col.key) ? (
            item[col.key] ? (
              moment(item[col.key]).format(formatStyle)
            ) : (
              ''
            )
          ) : linkColumns.includes(col.key) ? (
            userRights.CUSTOMER_MODIFY ? (
              <Link to={`${this.props.match.url}/${item.contactId}`}>
                {item[col.key]}
              </Link>
            ) : (
              item[col.key]
            )
          ) : countryColumns.includes(col.key) ? (
            item[col.key] ? (
              `${getFieldValue(
                { fieldType: col.key },
                item[col.key].country
              )} ${getFieldValue(
                { fieldType: col.key },
                item[col.key].province
              )} ${getFieldValue({ fieldType: col.key }, item[col.key].city)}`
            ) : (
              ''
            )
          ) : phoneColumns.includes(col.key) ? (
            item[col.key] ? (
              <PhoneLink
                phone={item[col.key].phoneStr}
                id={item.contactId}
                name={item.contactsName}
                role="contact"
              />
            ) : (
              ''
            )
          ) : col.optionList === undefined ? (
            item[col.key]
          ) : col.optionList.find(option => option.value == item[col.key]) ? (
            col.optionList.find(option => option.value == item[col.key]).label
          ) : (
            ''
          );
          const title = typeof v === 'string' ? v : '';
          return (
            <td key={_idx} title={title}>
              {v}
            </td>
          );
        })}
      </tr>
    );
  };

  onPageChange = ({ pageNo, pageSize }) => {
    const { updatePagination } = this.props;
    Promise.resolve(updatePagination({ pageNo, pageSize })).then(() => {
      this.getContactsList();
    });
  };

  render() {
    const { contactsList, selectedContactsIds, editContactsInfo } = this.props;
    const checked =
      contactsList.list && contactsList.list.length
        ? contactsList.list.every(contact =>
            selectedContactsIds.some(id => id == contact.contactId)
          )
        : false;
    const { showCreateContactsModal } = this.state;

    return (
      <div>
        <Table className="ellipsis">
          <Table.Header>
            <th>
              <Checkbox checked={checked} onChange={this.toggleSelectAll} />
            </th>
            {this._renderTableHeader()}
          </Table.Header>
          <Table.Body>
            {contactsList.list &&
              contactsList.list.map(this._renderTableBodyRow)}
          </Table.Body>
        </Table>
        {contactsList.list && contactsList.list.length === 0 ? (
          <NoDataView />
        ) : (
          <PaginationBar
            total={contactsList.total}
            pageSize={contactsList.size}
            pageNo={contactsList.pager}
            onPageChange={this.onPageChange}
            className={cs['pagination-bar']}
          />
        )}
        {showCreateContactsModal ? (
          <ContactsEditModal
            show={showCreateContactsModal}
            onSave={this.saveContactsInfo}
            editContactsInfo={editContactsInfo}
            onHide={this.toggleModal.bind(this, {}, false)}
          />
        ) : (
          undefined
        )}
      </div>
    );
  }
}
