import i18n from 'utils/i18n';
import cs from './index.less';
import NoDataView from 'components/NoDataView';
import { Table, Message, Button, Icon } from 'lean-ui';
const { Td, Th } = Table;
import { Content, Layout } from 'components/v2/PageWraper';
import PaginationBar from 'components/v2/PaginationBar';
import customReportTypes from 'utils/customReportTypes';
import moment from 'moment';
const dayTimeFormat = 'YYYY-MM-DD HH:mm';

export const CUSTOM_RRPORT_HEADERS = [
  'reportName',
  'reportType',
  'creator',
  'createdTime',
  'updatedTime',
  'options'
];
export default class CustomReportList extends PureComponent {
  modifyPagination = v => {
    const { pageParam, modifyPage } = this.props;
    modifyPage({
      ...pageParam,
      pageSize: v.pageSize,
      pageNo: v.pageNo
    });
  };
  onRemoveReport = id => {
    const {
      removeCustomReport,
      showTipsModal,
      pageParam,
      getCustomReportList
    } = this.props;
    showTipsModal({
      title: i18n['settings.custom_report_mgmt.remove_report.title'],
      content: i18n['settings.custom_report_mgmt.remove_report.content'],
      onConfirm: cb => {
        removeCustomReport(id);
        cb();
        getCustomReportList(pageParam);
      }
    });
  };
  // 生成header的部分，排序和特殊处理的header
  renderHeadCell = ({ item, index, fixed }) => {
    return (
      <Th key={item} fixed={fixed}>
        {i18n[`report.custom_report.table_header.${item}`]}
      </Th>
    );
  };

  _renderCellNew = ({ rowData, listData }) => {
    return this._renderCellback(rowData, listData || {});
  };

  // 具体表格内容不同类型内容展示和特殊处理
  _renderCellback = (source, field) => {
    const key = field;
    let content = null;
    let clickHandler = null;
    let title;
    switch (key) {
      case 'reportType':
        title = content = i18n[`report.custom_report.type.${source[key]}`];
        break;
      case 'reportName':
        title = source[key];
        content = (
          <a
            href={`/reportmgmt/customReport/${
              source.reportType === 'USER' ? 'userDetail' : 'detail'
            }/${source.id}`}
          >
            {title}
          </a>
        );
        break;
      case 'options':
        content = (
          <div className={cs.options}>
            <a href={`/reportmgmt/customReport/edit?reportId=${source.id}`}>
              <Icon className={`main-color`} icon="edit-outline" />
            </a>
            <Icon
              icon="delete-outline"
              className={`main-color`}
              onClick={this.onRemoveReport.bind(this, source.id)}
            />
          </div>
        );
        break;
      case 'createdTime':
        title = content = moment(source[key]).format(dayTimeFormat);
        break;
      case 'updatedTime':
        title = content = moment(source[key]).format(dayTimeFormat);
        break;
      default:
        title = content = source[key];
        break;
    }

    return (
      <Td
        key={key}
        className={'active-actions'}
        onClick={clickHandler}
        title={title}
      >
        {content}
      </Td>
    );
  };

  render() {
    const {
      customReportList: { list = [] },
      pageParam
    } = this.props;
    const haveData = !!list.length;
    return (
      <Layout>
        <Content table={haveData}>
          <Table
            data={list}
            columns={CUSTOM_RRPORT_HEADERS}
            fixedHeader
            renderCell={this._renderCellNew}
            renderHeadCell={this.renderHeadCell}
            pager={
              haveData ? (
                <PaginationBar
                  {...pageParam}
                  onPageChange={this.modifyPagination}
                />
              ) : (
                undefined
              )
            }
          />
          {haveData ? undefined : <NoDataView />}
        </Content>
      </Layout>
    );
  }
}
