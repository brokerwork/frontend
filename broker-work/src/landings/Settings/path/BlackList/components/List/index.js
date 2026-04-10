import i18n from 'utils/i18n';
import cs from './index.less';
import NoDataView from 'components/NoDataView';
import { Table, Message, Button, Icon } from 'lean-ui';
const { Td, Th } = Table;
import { Content, Layout } from 'components/v2/PageWraper';
import PaginationBar from 'components/v2/PaginationBar';
import customReportTypes from 'utils/customReportTypes';
import moment from 'moment';
import { NavLink as Link } from 'react-router-dom';
const dayTimeFormat = 'YYYY-MM-DD HH:mm:ss';

export const HEADERS = [
  'phone',
  'email',
  'id',
  'realname',
  'restrictions.LOGIN',
  'restrictions.TRADE',
  'restrictions.REGISTER',
  'reasons',
  'createdTime',
  'creator',
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
  onRemove = id => {
    const {
      removeBlackList,
      showTipsModal,
      pageParam,
      getBlackList
    } = this.props;
    showTipsModal({
      title: i18n['settings.black_list.remove.title'],
      content: i18n['settings.black_list.remove.content'],
      onConfirm: cb => {
        removeBlackList(id);
        cb();
        getBlackList(pageParam);
      }
    });
  };
  // 生成header的部分，排序和特殊处理的header
  renderHeadCell = ({ item, index, fixed }) => {
    return (
      <Th key={item} fixed={fixed}>
        {i18n[`settings.black_list.table_header.${item}`]}
      </Th>
    );
  };

  _renderCellNew = ({ rowData, listData }) => {
    return this._renderCellback(rowData, listData || {});
  };

  onEdit = item => {
    const { changeEditItem } = this.props;
    changeEditItem(item);
  };

  // 具体表格内容不同类型内容展示和特殊处理
  _renderCellback = (source, field) => {
    const { idTypes } = this.props;
    const key = field;
    let content = null;
    let clickHandler = null;
    let title;
    if (source[key]) {
      title = content = source[key];
    } else {
      title = content = '--';
    }

    if (key === 'createdTime') {
      title = content = moment(source[key]).format(dayTimeFormat);
    }
    if (/^restrictions/.test(key) && _.get(source, 'restrictions.length', 0)) {
      const [k1, k2] = key.split('.');
      const haveKey = _.includes(source.restrictions, k2);
      if (haveKey) {
        title = content = i18n[`settings.black_list.table_content.${key}`];
      }
    }
    if (key === 'reasons' && _.get(source, 'reasons.length', 0)) {
      title = content = _.map(source.reasons, r => {
        return i18n[`settings.black_list.reasons.${r}`];
      }).join(';');
    }
    if (key === 'id' && source.idType && source.idNum) {
      const type = _.find(idTypes, { value: source.idType });
      title = content = `${type.label}: ${source.idNum}`;
    }

    if (key === 'phone' && source.countryCode && source.phone) {
      title = content = `${source.countryCode} ${source.phone}`;
    }
    if (key === 'options') {
      title = '';
      content = (
        <div className={cs.options}>
          <Icon
            className={`main-color`}
            icon="edit-outline"
            onClick={this.onEdit.bind(this, source)}
          />{' '}
          <Icon
            icon="delete-outline"
            className={`main-color`}
            onClick={this.onRemove.bind(this, source.pubUserId)}
          />
        </div>
      );
    }
    if (key === 'realname' && source.userNo) {
      title = source[key];
      content = <Link to={`/bwtauser/${source.userNo}`}>{source[key]}</Link>;
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
      blackList: { list = [] },
      pageParam
    } = this.props;
    const haveData = !!list.length;
    return (
      <Layout>
        <Content table={haveData}>
          <Table
            data={list}
            columns={HEADERS}
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
