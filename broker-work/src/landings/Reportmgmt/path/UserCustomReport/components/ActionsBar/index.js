import i18n from 'utils/i18n';
import cs from './ActionsBar.less';
import { Icon, Button, Input, Tooltip, Message, Dropdown, Menu } from 'lean-ui';
import Server from '../../containers/Server';
import ConditionFilter from 'components/v2/ConditionFilter';
import { Summary } from 'components/v2/PageWraper';
import { ADVANCED_SEARCH_CONFIG, REPORT_SORT_INTIAL } from '../../constant';
import queryString from 'utils/queryString';

export default class ActionsBar extends PureComponent {
  getReportList = unReset => {
    const resolve = [];
    if (!unReset) {
      resolve.push(this.resetPageAndSort());
    }
    const { getReportList, updateNeedRefresh, params } = this.props;
    Promise.resolve(getReportList(params)).then(res => {
      if (res && res.result) {
        if (res.data.list.length === 0) {
          updateNeedRefresh(i18n['report.date_range_type.default_no_results']);
        } else {
          updateNeedRefresh('');
        }
      }
    });
  };
  onServerSelect = selected => {
    this.getReportList();
  };
  resetPageAndSort() {
    const { updatePagination, updateCurrentSortParam } = this.props;
    return Promise.all([
      updateCurrentSortParam({}),
      updatePagination({ pageNo: 1 })
    ]);
  }
  onSelect = ({ key }) => {
    const {
      removeCustomReport,
      history: { push },
      match: { params },
      showTipsModal
    } = this.props;
    const reportId = params.reportId;
    if (key === 'edit') {
      push(`/reportmgmt/customReport/edit?reportId=${reportId}`);
    }
    if (key === 'delete') {
      showTipsModal({
        title: i18n['settings.custom_report_mgmt.remove_report.title'],
        content: i18n['settings.custom_report_mgmt.remove_report.content'],
        onConfirm: cb => {
          removeCustomReport(reportId).then(({ result }) => {
            if (result) {
              push('/settings/customReport');
            }
          });
          cb();
        }
      });
    }
  };
  onSearchTextChange = evt => {
    const { updateSearchText } = this.props;
    updateSearchText(evt.target.value);
  };
  onSearch = evt => {
    if (evt.which === 13) {
      this.getReportList();
    }
  };
  canIHaveRights = () => {
    const { userRights } = this.props;
    if (
      userRights &&
      !userRights['STAT_VIEW_ACC_RANGE_ALL'] &&
      !userRights['STAT_VIEW_ACC_RANGE_SUB']
    ) {
      return 'sub'; // sub
    } else {
      return 'subBelong'; //subbelong
    }
  };
  getSortLabel = () => {
    const { reportConfig } = this.props;
    const { sortingColumn, searchable = {} } = reportConfig;
    return _.get(searchable, sortingColumn, '');
  };
  reload = () => {
    const { modifyParams, params } = this.props;
    modifyParams({
      ...params,
      pageNo: 1
    });
  };
  render() {
    const {
      searchKeywords,
      reportList,
      listUpdateTime,
      currentServer,
      match: { params: { type } = {} },
      getSimpleUserList,
      reportConfig
    } = this.props;
    const { reportType } = reportConfig;
    const showTipsTypes = ['AccountDw', 'AccountSummary'];
    let searchType = ADVANCED_SEARCH_CONFIG.searchType;
    if (currentServer && currentServer.value !== undefined) {
      searchType = `BW_REPORT_${currentServer &&
        currentServer.value}_CUSTOM_REPORT`;
    }
    const total = _.get(reportList, 'total', 0);
    return (
      <div className={cs['action-bar']}>
        <div className={cs['left-part']}>
          <div className={cs['primary-top-title']}>
            <Icon
              icon="report"
              className={`main-color ${cs['customer-icon']}`}
              fontType={'bw'}
            />
            <div className={cs['module-info']}>
              <Server onChange={this.onServerSelect} reportType={reportType} />
              <ConditionFilter.ViewList
                searchType={searchType}
                getData={getSimpleUserList}
                showSearch={true}
                right={this.canIHaveRights()}
                dataType="AccountReport"
              />
            </div>
          </div>
          <Summary.Info
            total={total}
            orderBy={this.getSortLabel()}
            updateTime={listUpdateTime}
            moduleName={reportConfig.reportName}
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
            <Dropdown
              overlay={
                <Menu onClick={this.onSelect}>
                  <Menu.Item key="edit">{i18n['general.edit']}</Menu.Item>
                  <Menu.Item key="delete">{i18n['general.delete']}</Menu.Item>
                </Menu>
              }
              trigger="click"
            >
              <Button icon="more" />
            </Dropdown>
          </div>
          <div className={cs['search-input']}>
            <Input
              suffix={<Icon icon="search" />}
              placeholder={
                reportType === 'ACCOUNT'
                  ? i18n[
                      'report.custom_report.fuzzy_search.placeholder.account'
                    ]
                  : reportType === 'USER'
                    ? i18n['report.custom_report.fuzzy_search.placeholder.user']
                    : i18n['report.custom_report.fuzzy_search.placeholder']
              }
              value={searchKeywords}
              onChange={this.onSearchTextChange}
              onPressEnter={this.onSearch}
            />
          </div>
        </div>
      </div>
    );
  }
}
