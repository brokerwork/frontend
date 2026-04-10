import { reduxForm } from 'redux-form';
import CustomField, { validate } from 'components/CustomField';
import { Link } from 'react-router-dom';
import Breadcrumb from 'components/Breadcrumb';
import PageFrame from '../../../../components/PageFrame';
import i18n from 'utils/i18n';
import BillForm from './BillForm';
import RefundList from './RefundList';
import cs from './index.less';

export default class EditForm extends Component {
  componentDidMount() {}
  onCancel = () => {
    const {
      match: { path, url, params },
      history: { push }
    } = this.props;
    push(url.replace(/\/bill(\/.*)?$/, ''));
  };
  render() {
    const {
      getProductList,
      productList,
      contractFields = [],
      initialValue,
      match: { path, url, params },
      submitForm,
      type,
      justForm,
      userRights,
      billFormValues
    } = this.props;
    const title =
      type === 'add'
        ? i18n['customer.bill.create']
        : i18n['customer.bill.detail'];
    return (
      <div className={cs['scroll-root']}>
        <PageFrame className={justForm ? cs['just-form'] : ''}>
          <PageFrame.Header className={cs['header']}>
            <Breadcrumb theme="gray-link">
              <Link
                to={path
                  .replace('/:trash?/detail/:customerId/bill/:billId', '')
                  .replace('/:trash?/detail/:customerId/bill', '')}
              >
                {i18n['navigation.customer.module_name']}
              </Link>
              {params.trash ? (
                <Link
                  to={path
                    .replace(
                      '/:trash?/detail/:customerId/bill/:billId',
                      '/trash'
                    )
                    .replace('/:trash?/detail/:customerId/bill', '/trash')}
                >
                  {i18n['customer.trash.title']}
                </Link>
              ) : (
                undefined
              )}
              <Link to={url.replace(/\/bill(\/.*)?$/, '')}>
                {i18n['customer.detail.title']}
              </Link>
              <span>{title}</span>
            </Breadcrumb>
          </PageFrame.Header>
          <PageFrame.Body className={cs['body']}>
            <PageFrame.Left className={cs['left']}>
              <BillForm {...this.props} onCancel={this.onCancel} />
            </PageFrame.Left>
            <PageFrame.Right className={cs['right']}>
              {userRights.CUSTOMER_BILLPAYMENT ? (
                <RefundList {...this.props} />
              ) : (
                undefined
              )}
            </PageFrame.Right>
          </PageFrame.Body>
        </PageFrame>
      </div>
    );
  }
}
