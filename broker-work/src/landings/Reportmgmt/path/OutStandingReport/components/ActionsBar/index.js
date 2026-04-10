import i18n from 'utils/i18n';
import cs from './ActionsBar.less';
import { Icon, Button, Tooltip, Breadcrumb } from 'lean-ui';
import ConditionFilter from 'components/v2/ConditionFilter';
import { Summary } from 'components/v2/PageWraper';
export default class OutstandingActionBar extends PureComponent {
  componentWillMount() {
    const { getUserLevel } = this.props;
    getUserLevel();
  }

  //下载导出报表
  downLoadReport = () => {
    const { postDownloadRequest, params, showTipsModal } = this.props;
    Promise.resolve(postDownloadRequest(params)).then(res => {
      if (res.result) {
        showTipsModal({
          content: i18n['report.download_tips_modal.jump_content'],
          header: i18n['report.download_tips_modal.jump_tips'],
          onConfirm: cb => {
            window.open('/reportmgmt/downloadcenter');
            cb();
          }
        });
      }
    });
  };

  getToolTips = () => {
    return (
      <div>
        <div className={cs['glossary-header']}>
          {i18n['report.outstanding_report.glossary.header']}
        </div>
        <div className={cs['glossary-content']}>
          <div className={cs['glossary-sub-header']}>
            {i18n['report.outstanding_report.straight.glossary.header']}
          </div>
          <table className={cs['glossary-list']}>
            <tbody>
              {i18n['report.outstanding_report.straight.glossary']
                .split('</br>')
                .map((item, idx) => {
                  const attrs = item.split('</title>');

                  return (
                    <tr key={idx}>
                      <th>{attrs[0]}</th>
                      <td>{attrs[1]}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        <div className={cs['glossary-content']}>
          <div className={cs['glossary-sub-header']}>
            {i18n['report.outstanding_report.sub.glossary.header']}
          </div>
          <table className={cs['glossary-list']}>
            <tbody>
              {i18n['report.outstanding_report.sub.glossary']
                .split('</br>')
                .map((item, idx) => {
                  const attrs = item.split('</title>');

                  return (
                    <tr key={idx}>
                      <th>{attrs[0]}</th>
                      <td>{attrs[1]}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        <div className={cs['glossary-warning']}>
          {i18n['report.outstanding_report.glossary.tips']}
        </div>
      </div>
    );
  };
  reload = () => {
    const { modifyParams, params } = this.props;
    modifyParams({
      ...params,
      nowPage: 1
    });
  };
  render() {
    const { listUpdateTime, userRights, outStandingReportList } = this.props;
    return (
      <div className={cs['action-bar']}>
        <div className={cs['left-part']}>
          <div className={cs['primary-top-title']}>
            <Icon
              icon="report-color"
              className={`main-color ${cs['customer-icon']}`}
              fontType={'bw'}
            />
            <div className={cs['module-info']}>
              <Breadcrumb>
                <Breadcrumb.Item>
                  {i18n['navigation.report.outstandingreport_managment']}
                </Breadcrumb.Item>
              </Breadcrumb>
              <ConditionFilter.ViewList />
            </div>
          </div>
          <Summary.Info
            total={outStandingReportList.total}
            updateTime={listUpdateTime}
            children={
              <Icon
                className={`main-color ${cs['refresh-icon']}`}
                icon="refresh"
                onClick={this.reload}
                fontType={'bw'}
              />
            }
          />
        </div>
        <div className={cs['right-part']}>
          <div className={cs['button-area']}>
            {userRights['STAT_VIEW_ACHIEVEMENT_EXPOT'] ? (
              <Button onClick={this.downLoadReport} type="primary">
                <Icon icon={'download'} />{' '}
                {i18n['report.date_range_type.export']}
              </Button>
            ) : (
              undefined
            )}
            <div className={cs['more-menu']}>
              <Tooltip
                trigger="click"
                placement="topLeft"
                title={this.getToolTips}
              >
                <Icon icon="info-outline" />
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
