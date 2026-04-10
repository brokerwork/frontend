import cs from './index.less';
import i18n from 'utils/i18n';
export default class DeleteRecord extends Component {
  onClick = () => {
    const {
      deleteRecord,
      showTipsModal,
      showTopAlert,
      recordId,
      customerId,
      getCustomerDetail,
      followWayOptions,
      searchType,
      type
    } = this.props;
    showTipsModal({
      content: i18n['customer.detail.follow_record_delete'],
      onConfirm: cb => {
        deleteRecord({
          customerId,
          recordId,
          type
        }).then(res => {
          if (res.result) {
            showTopAlert({
              bsStyle: 'success',
              content: i18n['general.remove_success']
            });
            getCustomerDetail();
            cb();
          }
        });
      }
    });
  };
  render() {
    const { className, icon = 'fa fa-trash-o', children } = this.props;
    return (
      <span
        className={`${cs['btn-delete']} ${className}`}
        onClick={this.onClick}
      >
        <i className={icon} />
        {children}
      </span>
    );
  }
}
