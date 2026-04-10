import i18n from 'utils/i18n';
import cs from './ActionsBar.less';
import { Icon, Breadcrumb } from 'lean-ui';
import { Summary } from 'components/v2/PageWraper';
import NoticeBar from 'components/v2/NoticeBar';

export default class ActionsBar extends PureComponent {
  render() {
    const { listUpdateTime, downloadList } = this.props;
    return (
      <div className={cs['actions-bar']}>
        <NoticeBar>
          <span>{i18n['report.download_center.tips']}</span>
        </NoticeBar>
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
                  {i18n['navigation.report.module_name']}
                </Breadcrumb.Item>
              </Breadcrumb>
              <div className={`main-color ${cs['module-main-filter-title']}`}>
                {i18n['report.download_center.header']}
              </div>
            </div>
          </div>
          <Summary.Info
            total={downloadList.total}
            updateTime={listUpdateTime}
          />
        </div>
      </div>
    );
  }
}
