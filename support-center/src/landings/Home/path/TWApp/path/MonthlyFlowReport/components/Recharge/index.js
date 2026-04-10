import Modal from 'components/Modal';
import Tab from 'components/Tab';
import Button from 'components/Button';
import Form from 'components/Form';
import i18n from 'utils/i18n';
import cs from './Recharge.less';
import OnlineRecharge, { ONLINE_RECHARGE_FORM } from './OnlineRecharge';
import { getToken } from 'utils/userInfo';
import { getTenantId } from 'utils/tenantInfo';
import Checkbox from 'components/Checkbox';

export default class Recharge extends PureComponent {
  state = {
    isAgree: false,
    showAgreement: false
  }

  onOnlineRechargeFormSubmit = () => {
    const { submitForm } = this.props;

    submitForm(ONLINE_RECHARGE_FORM);
  }

  onOnlineRecharge = (values) =>  {
    const { onSave } = this.props;
    const form = document.createElement('form');
    const copyValues = Object.assign(values, {
      token: getToken(),
      tenantId: getTenantId(),
      type: 'app'
    });
    const keys = Object.keys(copyValues);

    form.setAttribute('method', 'post');
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
  }

  toggleAgreement = () => {
    this.setState({
      showAgreement: !this.state.showAgreement
    });
  }

  render() {
    const { isAgree, showAgreement } = this.state;
    const { onClose, platformList, exchangeRate, initialValues } = this.props;

    return (
      <Modal onClose={onClose}>
        <Modal.Header>
          {i18n['general.pay']}
        </Modal.Header>
        <Modal.Body className={cs['body']} scrolling={false}>
              <OnlineRecharge
                initialValues={initialValues}
                platformList={platformList}
                exchangeRate={exchangeRate}
                onSubmit={this.onOnlineRecharge}
              ></OnlineRecharge>
              <Form>
                <Form.Item>
                  <Form.Label></Form.Label>
                  <Form.Control>
                    <Checkbox 
                      inline
                      checked={isAgree} 
                      onChange={(evt) => this.setState({ isAgree: evt.target.checked})}>
                      {i18n['consumption.recharge.agreement_agree']}
                    </Checkbox>
                    <a onClick={this.toggleAgreement} className={cs['toggle-agreement']}>{i18n['consumption.recharge.agreement_title']}</a>
                  </Form.Control>
                </Form.Item>
                {showAgreement
                  ? <div className={cs['agreement']}>
                      {i18n['consumption.recharge.agreement']}
                    </div>
                  : undefined}
                <ul className="form-tips">
                  <li>{i18n['dashbord.recharge.modal.charge.offline.reminder']}</li>
                  <li>{i18n['dashboard.recharge.online.tips']}</li>
                </ul>
              </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button style="primary" disabled={!isAgree} onClick={this.onOnlineRechargeFormSubmit}>{i18n['general.apply']}</Button>
          <Button onClick={onClose}>{i18n['general.cancel']}</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}