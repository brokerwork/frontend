import i18n from 'utils/i18n';
import { Form } from 'lean-ui';
import cs from '../TaskDetails.less';

export default class Bind extends PureComponent {
  componentDidMount() {
    const { getExternalFormData, initialValues } = this.props;
    const { customerId, serverId, vendor, accountId } = initialValues;
    getExternalFormData([
      // { key: 'customerName', value: customerId, fieldName: 'customerId' },
      { key: 'serverName', value: { serverId, vendor }, fieldName: 'serverId' },
      {
        key: 'bindName',
        value: { accountId, serverId, vendor },
        fieldName: 'accountName'
      }
    ]);
  }
  render() {
    const data = this.props.initialValues;
    const { externalData = {}, accountId, vendor, serverId } = data;
    return (
      <Form>
        <Form.Item col={2}>
          <Form.Label>{i18n['task.details.field.associated']}：</Form.Label>
          <Form.Control className={cs['form-text']}>
            {externalData.customerName}
          </Form.Control>
        </Form.Item>
        <Form.Item col={2}>
          <Form.Label>{i18n['task.details.field.bind_account']}：</Form.Label>
          <Form.Control className={cs['form-text']}>
            {`${accountId || ''} ${
              i18n['task.details.field.server']
            }: (${vendor} ${externalData.serverName})`}
          </Form.Control>
        </Form.Item>
        <Form.Item col={2}>
          <Form.Label>
            {i18n['task.details.field.bind_account_name']}：
          </Form.Label>
          <Form.Control className={cs['form-text']}>
            {externalData.bindName}
          </Form.Control>
        </Form.Item>
        {/* <Form.Item col={2}>
          <Form.Label>{i18n['task.details.field.accoun_owner']}：</Form.Label>
          <Form.Control className={cs['form-text']}>
            {externalData.accountOwner || ''}
          </Form.Control>
        </Form.Item> */}
      </Form>
    );
  }
}
