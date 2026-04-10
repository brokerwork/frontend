import { Button, Dialog } from 'lean-ui';
import Dropdown from 'components/v2/Dropdown';
import i18n from 'utils/i18n';
import { post } from 'utils/ajax';
import Modal from 'components/Modal';
import cs from './TransferContactsModal.less';

export default class TransferContactsModal extends PureComponent {
  state = {
    oweId: ''
  };

  onSave = () => {
    const { onSave } = this.props;
    const { oweId } = this.state;

    if (onSave) onSave(oweId.value);
  };

  onSelectCustomerOwner = selected => {
    this.setState({
      oweId: selected
    });
  };

  searchCustomer = text => {
    if (!text) {
      return Promise.resolve({
        result: true,
        data: {
          list: []
        }
      });
    }
    const fuzzyVal = text || 0;

    return post({
      url: '/v2/custom/profiles/list',
      data: {
        fuzzyItem: 'CustomerName',
        fuzzyVal
      }
    });
  };

  handleData = res => {
    if (!res.result) return Promise.reject(false);

    const data = res.data.list.map(customer => {
      return {
        label: `${customer.customNo}：${customer.customName}`,
        value: customer.customerId
      };
    });

    return Promise.resolve(data);
  };

  render() {
    const { show, onHide } = this.props;
    const { oweId } = this.state;

    return (
      <Dialog
        title={i18n['customer.contacts_module.transfer_contacts']}
        visible={show}
        align="center"
        onCancel={onHide}
        footer={
          <div>
            <Button type="primary" onClick={this.onSave}>
              {i18n['general.confirm']}
            </Button>
            <Button onClick={onHide}>{i18n['general.cancel']}</Button>
          </div>
        }
      >
        <div className={"form-horizontal"}>
          <div className="form-group">
            <div className={`${cs['left']} ${cs['label']}`}>
              {i18n['customer.contacts_module.chose_customer']}
            </div>
            <div className={cs['right']}>
              <Dropdown
                className={cs['dropdown']}
                value={oweId}
                searchable
                onSelect={this.onSelectCustomerOwner}
                pipe={this.searchCustomer}
                handleData={this.handleData}
              />
            </div>
          </div>
          <div className="form-group">
            <div className={`col-sm-7 ${cs['label']}`}>
              {i18n['customer.contacts_module.transfer_tips']}
            </div>
          </div>
        </div>
      </Dialog>
    );
  }
}
