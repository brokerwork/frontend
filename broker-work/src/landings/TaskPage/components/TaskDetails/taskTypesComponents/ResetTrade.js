import i18n from 'utils/i18n';
import { Form } from 'lean-ui';
import cs from '../TaskDetails.less';

// 修改杠杆
export default class ResetTrade extends PureComponent {
  componentDidMount() {}
  render() {
    const { accountId, email, phone } = this.props.initialValues;
    return (
      <Form>
        <Form.Item col={2}>
          <Form.Label>{i18n['task.details.field.accountId']}：</Form.Label>
          <Form.Control className={cs['form-text']} readonly>
            {accountId}
          </Form.Control>
        </Form.Item>
        <Form.Item col={2}>
          <Form.Label>{i18n['task.details.field.contact']}：</Form.Label>
          <Form.Control className={cs['form-text']} readonly>
            {email || (phone ? phone.phoneStr : '')}
          </Form.Control>
        </Form.Item>
      </Form>
    );
  }
}
