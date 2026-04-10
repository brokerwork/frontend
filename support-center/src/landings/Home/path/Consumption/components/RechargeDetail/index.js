import Modal from 'components/Modal';
import Form from 'components/Form';
import moment from 'moment';
import { dateTimeFormatStyle } from 'utils/config';
import Button from 'components/Button';
import i18n from 'utils/i18n';
import UploadImage from 'components/UploadFile/Image';

export default class RechargeDetail extends PureComponent {
  _renderBills() {
    const { detail } = this.props;
    const urls = detail.bills ? detail.bills : [detail.billUrl];

    return urls.map((url, idx) => {
      return <UploadImage
              key={idx}
              removable={false}
              value={url}
            />;
    });
  }

  render() {
    const {
      onClose, 
      detail,
      rechargeType,
      rechargeTypeRechargeStatus,
      rechargeTypeRemittingStatus 
    } = this.props;
    const typeStatus = detail.rechargeType === 'RECHARGE' ? rechargeTypeRechargeStatus : rechargeTypeRemittingStatus;
    const status = typeStatus.find(_item => _item.value === detail.status) || {};

    return (
      <Modal onClose={onClose}>
        <Modal.Header>
          {i18n['consumption.recharge.deatil.title']}
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Item>
              <Form.Label>
                {i18n['consumption.recharge.type']}：
              </Form.Label>
              <Form.Control staticControl>
                {rechargeType.find(item => item.value === detail.rechargeType).label}
              </Form.Control>
            </Form.Item>
            <Form.Item>
              <Form.Label>
                {i18n['consumption.recharge.status']}：
              </Form.Label>
              <Form.Control staticControl className={`text-${status.color}`}>
                {status.label}
              </Form.Control>
            </Form.Item>
            <Form.Item>
              <Form.Label>
                {i18n['consumption.recharge.recharge_amount']}：
              </Form.Label>
              <Form.Control staticControl>
                <span className="text-danger">${detail.amount}</span>
              </Form.Control>
            </Form.Item>
            {detail.rechargeType === 'RECHARGE'
              ? <Form.Item>
                  <Form.Label>
                    {i18n['consumption.recharge.exchange']}：
                  </Form.Label>
                  <Form.Control staticControl>
                    {detail.exchange}
                  </Form.Control>
                </Form.Item>
              : undefined}
            <Form.Item>
              <Form.Label>
                {i18n['consumption.recharge.balance']}：
              </Form.Label>
              <Form.Control staticControl>
                <span className="text-orange">${detail.balance}</span>
              </Form.Control>
            </Form.Item>
            {detail.rechargeType === 'REMITTING'
              ? <Form.Item>
                  <Form.Label>
                    {i18n['consumption.recharge.bill_url']}：
                  </Form.Label>
                  <Form.Control staticControl>
                    {this._renderBills()}
                  </Form.Control>
                </Form.Item>
              : undefined}
            {detail.rechargeType !== 'REMITTING'
              ? <Form.Item>
                  <Form.Label>
                    {i18n['consumption.recharge.provider_name']}：
                  </Form.Label>
                  <Form.Control staticControl>
                    {detail.providerName}
                  </Form.Control>
                </Form.Item>
              : undefined}
            <Form.Item>
              <Form.Label>
                {i18n['consumption.recharge.pay_time']}：
              </Form.Label>
              <Form.Control staticControl>
                {moment(detail.payTime).format(dateTimeFormatStyle)}
              </Form.Control>
            </Form.Item>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={onClose}>
            {i18n['general.close']}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}