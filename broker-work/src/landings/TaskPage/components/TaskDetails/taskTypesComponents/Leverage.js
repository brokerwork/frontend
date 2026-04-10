import i18n from 'utils/i18n';
import { Form } from 'lean-ui';
import cs from '../TaskDetails.less';

// 修改杠杆
export default class Leverage extends PureComponent {
  componentDidMount() {
    const { getExternalFormData, initialValues } = this.props;
    const {
      account: { customerId, vendor, serverId },
      applicationData: { currentLeverage, expectedLeverage }
    } = initialValues;
    getExternalFormData([
      // {key: "customerName", value: customerId, fieldName: "customerId"},
      { key: 'leverage', fieldName: 'leverage', value: vendor || 'MT4' }
      // {key: "serverName", value: {serverId, vendor}, fieldName: "serverId"},
    ]);
  }
  render() {
    const {
      applicationData,
      account = {},
      externalData = {}
    } = this.props.initialValues;
    const leverage = externalData.leverage || {};
    console.log(externalData, applicationData, 'debug');
    const currentLeverage = leverage[applicationData.currentLeverage];
    const expectedLeverage = leverage[applicationData.expectedLeverage];
    return (
      <Form>
        <Form.Item col={2}>
          <Form.Label>{i18n['task.details.field.associated']}：</Form.Label>
          <Form.Control className={cs['form-text']}>
            {externalData.customerName}
          </Form.Control>
        </Form.Item>
        <Form.Item col={2}>
          <Form.Label>{i18n['task.details.field.account']}：</Form.Label>
          <Form.Control className={cs['form-text']}>
            {`${account.accountId || ''} ${
              i18n['task.details.field.server']
            }: (${account.vendor} ${externalData.serverName})`}
          </Form.Control>
        </Form.Item>
        <Form.Item col={2}>
          <Form.Label>{i18n['task.details.field.accoun_owner']}：</Form.Label>
          <Form.Control className={cs['form-text']}>
            {externalData.accountOwner || ''}
          </Form.Control>
        </Form.Item>
        <Form.Item col={2}>
          <Form.Label>
            {i18n['task.details.field.current_leverage']}：
          </Form.Label>
          <Form.Control className={cs['form-text']}>
            {currentLeverage}
          </Form.Control>
        </Form.Item>
        <Form.Item col={2}>
          <Form.Label>
            {i18n['task.details.field.expect_leverage']}：
          </Form.Label>
          <Form.Control className={cs['form-text']}>
            {expectedLeverage}
            {applicationData.expectedLeverage <
            applicationData.currentLeverage ? (
              <span
                style={{
                  color: 'red',
                  marginLeft: '10px'
                }}
              >
                {i18n['task.details.field.expect_leverage.warn']}
              </span>
            ) : null}
          </Form.Control>
        </Form.Item>
      </Form>
    );
  }
}
