import i18n from 'utils/i18n';
import { Form, Table, Dropdown, Menu, Icon } from 'lean-ui';
import getFieldValue from 'utils/fieldValue';
import cs from '../TaskDetails.less';

const { Th, Td } = Table;

const COLUMNS = [
  { key: 'fieldLabel', name: '' },
  { key: 'before', name: i18n['task.details.before_modify'] },
  { key: 'after', name: i18n['task.details.after_modify'] }
];

export default class Leverage extends PureComponent {
  componentDidMount() {
    const {
      getExternalFormData,
      initialValues: { customerId, vendor, serverId }
    } = this.props;
    const __arr = [
      { key: 'fields', fieldName: 'fields' },
      // {key: "customerName", value: customerId, fieldName: "customerId"},
      {
        key: 'currentData',
        value: {
          customerId,
          vendor,
          serverId
        },
        fieldName: 'accountId'
      },
      {
        key: 'affectedAccounts',
        value: customerId,
        fieldName: 'affectedAccounts'
      }
    ];
    getExternalFormData(__arr);
  }

  generateTableData = externalData => {
    const {
      baseInfo = {},
      financialInfo = {},
      certificatesInfo = {},
      customerInfo = {}
    } = this.props.initialValues;
    const baseInfoKeys = Object.keys(baseInfo);
    const financialInfoKeys = Object.keys(financialInfo);
    const certificatesInfoKeys = Object.keys(certificatesInfo);
    const fields = externalData.fields || {};
    const currentAccountData =
      { ...externalData.currentData, ...customerInfo } || {};
    let currentCustomerData = externalData.customerData || {};
    if (
      this.props.taskState === 'VIEW_TYPE_CAN_FINISH' ||
      this.props.taskState === 'VIEW_TYPE_CAN_REFUSE'
    ) {
      currentCustomerData = customerInfo.baseInfo || {};
    }
    return [
      ...this.generateKeyData(
        baseInfoKeys,
        fields['t_account_profiles'],
        currentAccountData['baseInfo'],
        baseInfo
      ),
      ...this.generateKeyData(
        baseInfoKeys,
        fields['t_customer_profiles'],
        currentCustomerData,
        baseInfo
      ),
      ...this.generateKeyData(
        financialInfoKeys,
        fields['t_account_finacial'],
        currentAccountData['financialInfo'],
        financialInfo
      ),
      ...this.generateKeyData(
        certificatesInfoKeys,
        fields['t_account_id_info'],
        currentAccountData['certificatesInfo'],
        certificatesInfo
      )
    ];
  };

  generateKeyData = (keys, fields, currentData, updateData) => {
    let keyData = [];
    if (!fields) return keyData;
    keys.map((item, index) => {
      const field = fields[item];
      if (!field) return;
      let d = getFieldValue(
        field,
        currentData[item] ||
          (currentData.customFields && currentData.customFields[item])
      );
      let v = getFieldValue(field, updateData[item]);
      keyData.push({ fieldLabel: field.label, before: d, after: v });
    });

    return keyData;
  };

  renderCell = ({ key, data, index, rowData, listData }) => {
    return <Td className={cs['td']}>{data}</Td>;
  };
  renderHeadCell = ({ item, index, fixed }) => {
    return (
      <Th key={index} className={cs['th']}>
        {item.name}
      </Th>
    );
  };

  render() {
    const {
      externalData = {
        fields: {},
        currentData: {},
        affectedAccounts: [],
        customerData: {}
      }
    } = this.props.initialValues;

    const affectedAccounts = externalData.affectedAccounts || [];
    return (
      <div>
        <Form>
          <Form.Item col={2}>
            <Form.Label>{i18n['task.details.field.associated']}：</Form.Label>
            <Form.Control className={cs['form-text']}>
              {externalData.customerName}
            </Form.Control>
          </Form.Item>
          <Form.Item col={2}>
            <Form.Label>
              {i18n['task.details.field.impact_account']}：
            </Form.Label>
            <Form.Control className={cs['form-text']}>
              {affectedAccounts.length > 0 ? (
                <Dropdown
                  id="affectedAccounts"
                  className={cs['affectedAccounts']}
                  trigger="click"
                  overlay={
                    <Menu>
                      {affectedAccounts.map((item, index) => {
                        return (
                          <Menu.Item key={index} eventKey={index}>
                            {item.account}
                          </Menu.Item>
                        );
                      })}
                    </Menu>
                  }
                >
                  <span>
                    {affectedAccounts.length}
                    <Icon icon="arrow-down" />
                  </span>
                </Dropdown>
              ) : (
                affectedAccounts.length
              )}
            </Form.Control>
          </Form.Item>
        </Form>
        <Table
          className={cs[`updateOwnerTable`]}
          columns={COLUMNS}
          striped
          data={this.generateTableData(externalData)}
          renderCell={this.renderCell}
          renderHeadCell={this.renderHeadCell}
        />
      </div>
    );
  }
}
