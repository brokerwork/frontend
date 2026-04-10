import Modal from 'components/Modal';
import Tab from 'components/Tab';
import Button from 'components/Button';
import Form from 'components/Form';
import i18n from 'utils/i18n';
import cs from './Recharge.less';
import OfflineRecharge from '../../containers/OfflineRecharge';
import OnlineRecharge, { ONLINE_RECHARGE_FORM } from '../Forms/OnlineRecharge';
import { getToken } from 'utils/userInfo';
import { getTenantId } from 'utils/tenantInfo';
import Checkbox from 'components/Checkbox';

export default class Recharge extends PureComponent {
  state = {
    activeKey: 'online',
    showOfflineRechargeModal: false,
    isAgree: false,
    showAgreement: false
  };

  onChange = activeKey => {
    this.setState({
      activeKey
    });
  };

  showOfflineRechargeModal = () => {
    this.setState({
      showOfflineRechargeModal: true
    });
  };

  closeOfflineRechargeModal = () => {
    this.setState({
      showOfflineRechargeModal: false
    });
  };

  onOnlineRechargeFormSubmit = () => {
    const { submitForm } = this.props;

    submitForm(ONLINE_RECHARGE_FORM);
  };

  onOnlineRecharge = values => {
    const { onSave } = this.props;
    const form = document.createElement('form');
    const copyValues = Object.assign(values, {
      token: getToken(),
      tenantId: getTenantId()
    });
    const keys = Object.keys(copyValues);

    form.setAttribute('method', 'get');
    form.setAttribute('action', '/payment');
    form.setAttribute('target', '_blank');

    keys.forEach(key => {
      const field = document.createElement('input');

      field.setAttribute('type', 'hidden');
      field.setAttribute('name', key);
      field.setAttribute('value', copyValues[key]);

      form.appendChild(field);
    });

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);

    onSave();
  };

  toggleAgreement = () => {
    this.setState({
      showAgreement: !this.state.showAgreement
    });
  };

  render() {
    const { activeKey, showOfflineRechargeModal, isAgree, showAgreement } = this.state;
    const { onClose, exchangeRate } = this.props;

    return (
      <Modal onClose={onClose}>
        <Modal.Header>{i18n['dashbord.recharge.btn.title']}</Modal.Header>
        <Modal.Body className={cs['body']} scrolling={false}>
          <Tab activeKey={activeKey} onChange={this.onChange}>
            <Tab.Panel
              title={i18n['dashbord.recharge.modal.charge.pay.online']}
              eventKey="online"
              className={cs['panel']}
            >
              <OnlineRecharge exchangeRate={exchangeRate} onSubmit={this.onOnlineRecharge} />
              <Form>
                <Form.Item>
                  <Form.Label />
                  <Form.Control>
                    <Checkbox inline checked={isAgree} onChange={evt => this.setState({ isAgree: evt.target.checked })}>
                      {i18n['consumption.recharge.agreement_agree']}
                    </Checkbox>
                    <a onClick={this.toggleAgreement} className={cs['toggle-agreement']}>
                      {i18n['consumption.recharge.agreement_title']}
                    </a>
                  </Form.Control>
                </Form.Item>
                {showAgreement ? (
                  <div className={cs['agreement']}>{i18n['consumption.recharge.agreement']}</div>
                ) : (
                  undefined
                )}
                <ul className="form-tips">
                  <li>{i18n['dashbord.recharge.modal.charge.offline.reminder']}</li>
                  <li>{i18n['dashboard.recharge.online.tips']}</li>
                </ul>
              </Form>
            </Tab.Panel>
            <Tab.Panel
              title={i18n['dashbord.recharge.modal.charge.pay.offline']}
              eventKey="offline"
              className={cs['panel']}
            >
              <Form>
                <Form.Item>
                  <Form.Label>{i18n['dashbord.recharge.modal.charge.offline.currency']}：</Form.Label>
                  <Form.Control staticControl>{i18n['dashbord.recharge.modal.charge.offline.usd']}</Form.Control>
                </Form.Item>
                <Form.Item>
                  <Form.Label>{i18n['dashbord.recharge.modal.charge.offline.name']}：</Form.Label>
                  <Form.Control staticControl>Lean Work HK Limited</Form.Control>
                </Form.Item>
                <Form.Item>
                  <Form.Label>{i18n['dashbord.recharge.modal.charge.offline.address']}：</Form.Label>
                  <Form.Control staticControl>Flat 2, 19/F Henan bldg 90-92, Jaffe RD Wanchai, Hong Kong</Form.Control>
                </Form.Item>
                <Form.Item>
                  <Form.Label>{i18n['dashbord.recharge.modal.charge.offline.bank']}：</Form.Label>
                  <Form.Control staticControl>Silicon Valley Bank</Form.Control>
                </Form.Item>
                <Form.Item>
                  <Form.Label>{i18n['dashbord.recharge.modal.charge.offline.account']}：</Form.Label>
                  <Form.Control staticControl>3301303655</Form.Control>
                </Form.Item>
                <Form.Item>
                  <Form.Label>{i18n['dashbord.recharge.modal.charge.offline.bank.addr']}：</Form.Label>
                  <Form.Control staticControl>3003 Tasman Drive, Santa Clara, Ca 95054, USA</Form.Control>
                </Form.Item>
                <Form.Item>
                  <Form.Label>{i18n['dashbord.recharge.modal.charge.offline.swift']}：</Form.Label>
                  <Form.Control staticControl>SVBKUS6S</Form.Control>
                </Form.Item>
                <ul className="form-tips">
                  <li>{i18n['dashbord.recharge.modal.charge.offline.reminder']}</li>
                  <li>{i18n['dashbord.recharge.modal.charge.offline.reminder1']}</li>
                  <li>{i18n['dashbord.recharge.modal.charge.offline.reminder2']}</li>
                </ul>
              </Form>
            </Tab.Panel>
          </Tab>
          {showOfflineRechargeModal ? <OfflineRecharge onClose={this.closeOfflineRechargeModal} /> : undefined}
        </Modal.Body>
        <Modal.Footer>
          {activeKey === 'online' ? (
            <Button style="primary" disabled={!isAgree} onClick={this.onOnlineRechargeFormSubmit}>
              {i18n['general.apply']}
            </Button>
          ) : (
            undefined
          )}
          {activeKey === 'offline' ? (
            <Button style="primary" onClick={this.showOfflineRechargeModal}>
              {i18n['dashbord.recharge.modal.charge.offline.submit.btn']}
            </Button>
          ) : (
            undefined
          )}
          <Button onClick={onClose}>{i18n['general.cancel']}</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
