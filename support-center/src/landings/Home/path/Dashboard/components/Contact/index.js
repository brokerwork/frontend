import Panel from 'components/Panel';
import Table from 'components/Table';
import Button from 'components/Button';
import Tips from 'components/Tips';
import OperateContact from '../../containers/OperateContact';
import { getTenantId } from 'utils/tenantInfo';
import i18n from 'utils/i18n';
import cs from './Contact.less';


export default class Contact extends PureComponent {
  state = {
    showContactModal: false,
    info: {}
  }

  showContactModal = (contact) => {
    this.setState({
      showContactModal: true,
      info: contact
    });
  }

  closeContactModal = () => {
    this.setState({
      showContactModal: false
    });
  }

  onSaveContact = () => {
    const { getTenantInfo } = this.props;

    this.setState({
      showContactModal: false
    }, () => {
      getTenantInfo();
    });
  }

  removeContact = ({ contactsId }) => {
    const { showTipsModal, showTopAlert, removeContact, getTenantInfo } = this.props;
    const tenantId = getTenantId();

    showTipsModal({
      content: i18n['dashboard.contacts.remove.tips'],
      onConfirm: (cb) => {
        removeContact(tenantId, contactsId).then(({ result }) => {
          if (result) {
            showTopAlert({
              style: 'success',
              content: i18n['general.remove_success']
            });
            getTenantInfo();
          }
        });
        cb();
      }
    });
  }

  _renderHeader = () => {
    return (
      <div className={cs['header']}>
        <div className={cs['text']}>{i18n['dashboard.contacts.title']}</div>
        <div>
          <Tips>
            {i18n['dashboard.contacts.tips.title']}
            <div>
              {i18n['dashboard.contacts.tips.example']}
            </div>
          </Tips>
        </div>
      </div>
    );
  }

  render() {
    const { tenantInfo } =  this.props;
    const { showContactModal, info } = this.state;

    return (
      <Panel header={this._renderHeader()}>
        <Table>
          <Table.Header>
            <th>{i18n['dashboard.contacts.type']}</th>
            <th>{i18n['dashboard.contacts.name']}</th>
            <th>{i18n['dashboard.contacts.email']}</th>
            <th>{i18n['dashboard.contacts.phone']}</th>
            <th>{i18n['table.header.operation']}</th>
          </Table.Header>
          <Table.Body>
            {tenantInfo.contacts && tenantInfo.contacts.map((contact, idx) => {
              return (
                <tr key={idx}>
                  <td>{i18n[`dashboard.contacts.type.${contact.contactsType}`]}</td>
                  <td>{contact.contactsName}</td>
                  <td>{contact.email}</td>
                  <td>{contact.phone}</td>
                  <td>
                    <Button style="primary" icon onClick={this.showContactModal.bind(this, contact)}>
                      <i className="fa fa-pencil"></i>
                    </Button>
                    <Button icon onClick={this.removeContact.bind(this, contact)}>
                      <i className="fa fa-times"></i>
                    </Button>
                  </td>
                </tr>
              );
            })}
          </Table.Body>
        </Table>
        <Button style="primary" onClick={this.showContactModal.bind(this, {})}>
          <i className="fa fa-plus"></i>
          {i18n['general.add']}
        </Button>
        {showContactModal
          ? <OperateContact
              info={info}
              onSave={this.onSaveContact}
              onClose={this.closeContactModal}
            ></OperateContact>
          : undefined}
      </Panel>
    );
  }
}
