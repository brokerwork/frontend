import Panel from 'components/Panel';
import Table from 'components/Table';
import moment from 'moment';
import { dateTimeFormatStyle } from 'utils/config';
import i18n from 'utils/i18n';
import cs from './Product.less';


export default class Product extends PureComponent {
  render() {
    const { tenantInfo } = this.props;

    return (
      <Panel header={i18n['dashboard.product.opened.title']}>
        <Table>
          <Table.Header>
            <th>{i18n['dashboard.product.name']}</th>
            <th>{i18n['dashboard.product.version']}</th>
            <th>{i18n['dashboard.product.site']}</th>
            <th>{i18n['dashboard.product.opened.time']}</th>
            <th>{i18n['dashboard.product.expired.time']}</th>
            <th>{i18n['dashboard.product.status']}</th>
          </Table.Header>
          <Table.Body>
            {tenantInfo.products && tenantInfo.products.map((product, idx) => {
              return (
                <tr key={idx}>
                  <td title={product.productName}>{product.productName}</td>
                  <td title={product.versionName}>{product.versionName}</td>
                  <td>
                    {product.productDomain && (
                      <div className={cs['domain']} title={`${product.productDomain}( ${i18n['dashboard.product.init.url']} )`}>
                        <a href={product.productDomain} target="_blank">{product.productDomain}</a>
                        {product.productId !== 'FW' && product.productId !== 'GW' && `( ${i18n['dashboard.product.init.url']} )` }
                      </div>
                    )}
                    {product.customerDomain && product.productId !== 'FW' && product.productId !== 'GW'
                      ? <div className={cs['domain']} title={`${product.customerDomain}( ${i18n['dashboard.product.customer.url']} )`}>
                          <a href={product.customerDomain} target="_blank">{product.customerDomain}</a>
                          ( {i18n['dashboard.product.customer.url']} ) 
                        </div>
                      : undefined}
                  </td>
                  <td title={moment(product.startTime).format(dateTimeFormatStyle)}>
                    {moment(product.startTime).format(dateTimeFormatStyle)}
                  </td>
                  <td title={moment(product.expiredTime).format(dateTimeFormatStyle)}>
                    {moment(product.expiredTime).format(dateTimeFormatStyle)}
                  </td>
                  <td className={`text-${product.status ? 'success' : 'danger'}`} title={product.status
                      ? i18n['dashboard.product.status.running']
                      : i18n['dashboard.product.status.expired']}>
                    {product.status
                      ? i18n['dashboard.product.status.running']
                      : i18n['dashboard.product.status.expired']}
                  </td>
                </tr>
              );
            })}          
          </Table.Body>
        </Table>
      </Panel>
    );
  }
}