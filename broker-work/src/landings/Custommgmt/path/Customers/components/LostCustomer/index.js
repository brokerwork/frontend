import i18n from 'utils/i18n';
import cs from './index.less';
import { DropdownForCode } from 'components/Dropdown';
import { FormControl } from 'react-bootstrap';
import { LOST_REASONS } from '../../constant';
import Form from 'components/Form';
import { FormattedMessage } from 'react-intl';

class LostForm extends PureComponent {
  state = {
    lostType: '',
    lostReason: ''
  };
  onReasonSelect = lostType => {
    const { onChange } = this.props;
    const { lostReason } = this.state;
    const result = {
      lostReason,
      lostType
    };
    this.setState(result);
    onChange(result);
  };
  onReasonInput = evt => {
    const { onChange } = this.props;
    const { lostType } = this.state;
    const lostReason = evt.target.value;
    const result = {
      lostReason,
      lostType
    };
    this.setState(result);
    onChange(result);
  };
  render() {
    const { lostType, lostReason } = this.state;
    return (
      <Form>
        <Form.Item>
          <div className={cs['lost-notice']}>
            {i18n['customer.lost_modal.lost_notice']}
          </div>
        </Form.Item>
        <Form.Item>
          <Form.Label required>
            {i18n['customer.lost_modal.lost_type']}
          </Form.Label>
          <DropdownForCode
            className={cs['control']}
            data={LOST_REASONS}
            value={lostType}
            onChange={this.onReasonSelect}
          />
        </Form.Item>
        <Form.Item>
          <Form.Label>{i18n['customer.lost_modal.lost_reason']}</Form.Label>
          <FormControl value={lostReason} onChange={this.onReasonInput} />
        </Form.Item>
      </Form>
    );
  }
}
export default class Lost extends PureComponent {
  state = {
    reason: {}
  };
  checkCanCustomerLost = () => {
    const { setLostCustomer, customerDetailInfo } = this.props;
    return setLostCustomer(undefined, customerDetailInfo.customerId);
  };
  lostCustomer = cb => {
    const {
      setLostCustomer,
      showTopAlert,
      customerDetailInfo,
      getCustomerDetail,
      tenantType,
      userRights
    } = this.props;
    const { reason } = this.state;
    if (!reason.lostType) {
      showTopAlert({
        content: (
          <FormattedMessage
            id="custom_field.required"
            defaultMessage={i18n['custom_field.required']}
            values={{
              value: i18n['customer.lost_modal.lost_type']
            }}
          />
        ),
        bsStyle: 'danger'
      });
      return;
    }
    setLostCustomer(true, customerDetailInfo.customerId, reason).then(res => {
      if (!res.result) return;
      showTopAlert({
        content: i18n['general.modify_success'],
        bsStyle: 'success'
      });
      cb();
      this.close();
      getCustomerDetail(customerDetailInfo.customerId, tenantType, userRights);
    });
  };

  onChange = selected => {
    this.setState({
      reason: selected
    });
  };
  close = () => {
    const { match: { url }, history } = this.props;
    history.replace(url.replace('/lost', ''));
  };
  componentDidMount() {
    const { showTipsModal, customerDetailInfo } = this.props;
    if (!Object.keys(customerDetailInfo).length) {
      this.close();
      return;
    }
    this.checkCanCustomerLost().then(res => {
      if (res.result) {
        showTipsModal({
          header: i18n['customer.lost_confirm'],
          content: <LostForm onChange={this.onChange} />,
          bsSize: 'middle',
          onCancel: cb => {
            cb();
            this.close();
          },
          onConfirm: cb => {
            this.lostCustomer(cb);
          }
        });
      } else {
        this.close();
        return Promise.resolve(res);
      }
    });
  }
  render() {
    return <div />;
  }
}
