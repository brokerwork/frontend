import cs from './index.less';
import i18n from 'utils/i18n';
import moment from 'moment';
import ContentCard from '../../../../../components/ContentCard';
import { Button } from 'react-bootstrap';
import SalesStage from '../SalesStage';

const formatStyle = 'YYYY-MM-DD HH:mm:ss';

export default class HeadInfo extends PureComponent {
  render() {
    const {
      canEdit,
      detail,
      detail: { basicinfo = {} },
      salesStageList
    } = this.props;
    const currentState = (salesStageList.find(
      item => item.value == (basicinfo.isLose ? 6 : basicinfo.salesStage)
    ) || {}
    ).label;
    return (
      <ContentCard>
        <ContentCard.Body>
          <div className={cs['title']}>
            <div className={cs['cell']}>
              <span className={`fa fa-opportunity ${cs['icon']} main-color`} />
              <span
                className={cs['name-title']}
                title={basicinfo.opportunityName}
              >
                {basicinfo.opportunityName}
                <span className={cs['date']}>
                  {i18n['customer.sales_opportunity.detail.create_time_label']}
                  {moment(basicinfo.createTime).format(formatStyle)}
                </span>
              </span>
            </div>
            <span className={`${cs['cell-right']} main-color`}>
              {i18n['customer.detail.sales_stage_label']}
              {currentState}
            </span>
          </div>
          <SalesStage {...this.props} />
        </ContentCard.Body>
      </ContentCard>
    );
  }
}
