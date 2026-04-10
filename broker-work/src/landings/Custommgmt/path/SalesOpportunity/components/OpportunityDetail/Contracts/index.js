import cs from './index.less';
import i18n from 'utils/i18n';
import Contracts from '../../../../Customers/components/CustomerDetail/RelatedView/Contracts';
export default class Contract extends PureComponent {
  componentDidMount() {
    const { getProductList } = this.props;
  }
  render() {
    const {
      detail,
      detail: { basicinfo = {} },
      canEdit,
      getDetail,
      ...props
    } = this.props;
    return (
      <Contracts
        {...props}
        customerDetailInfo={{
          customerId: basicinfo.customerId,
          customName: basicinfo.customName,
          enabled: canEdit && basicinfo.salesStage == 5 && !basicinfo.isLose
        }}
        onUpdated={getDetail}
        bindedSaleOpp={{
          label: basicinfo.opportunityName,
          value: basicinfo.opportunityId
        }}
      />
    );
  }
}
