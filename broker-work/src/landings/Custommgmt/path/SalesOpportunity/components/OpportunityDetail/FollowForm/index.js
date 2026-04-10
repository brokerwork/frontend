import cs from './index.less';
import i18n from 'utils/i18n';
import moment from 'moment';
import ContentCard from '../../../../../components/ContentCard';
import { Button } from 'react-bootstrap';
const formatStyle = 'YYYY-MM-DD HH:mm:ss';
import FollowRecordForm, { FOLLOW_RECORD_FORM } from './FollowRecordForm';

export default class HeadInfo extends PureComponent {
  updateFollowRecord = data => {
    const {
      updateFollowRecord,
      detail,
      userInfo,
      showTopAlert,
      resetForm,
      getDetail
    } = this.props;
    const copyData = JSON.parse(JSON.stringify(data));

    copyData.creator = userInfo.name;
    copyData.followTime = moment().valueOf();

    updateFollowRecord(detail.basicinfo.opportunityId, copyData).then(
      ({ result }) => {
        if (result) {
          showTopAlert({
            bsStyle: 'success',
            content: i18n['general.modify_success']
          });
          resetForm(FOLLOW_RECORD_FORM);
          getDetail();
        }
      }
    );
  };
  render() {
    const {
      canEdit,
      detail,
      detail: { basicinfo = {} }
    } = this.props;
    return (
      <ContentCard>
        <ContentCard.Header
          title={i18n['customer.sales_opportunity.detail.follow']}
          border
        />
        <FollowRecordForm
          canEdit={canEdit}
          onSubmitSuccess={this.updateFollowRecord}
        />
      </ContentCard>
    );
  }
}
