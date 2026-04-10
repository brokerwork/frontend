import PaginationBar from 'components/v2/PaginationBar';
import PagePanel from 'components/PagePanel';
import Table from 'components/Table';
import Image from 'components/Image';
import TypeSearch from 'components/TypeSearch';
import { dateTimeFormatStyle } from 'utils/config';
import moment from 'moment';
import i18n from 'utils/i18n';
import OrderModalContent from './OrderModalContent';
import cs from './styles.less';
import { Button, Table as UiTable } from 'lean-ui';
import { ARTICLE_COLUMNS } from '../../../../../constants';
const { Td, Th } = UiTable;

export default class Article extends PureComponent {
  componentDidMount() {
    const { getArticles, params } = this.props;
    getArticles(params);
  }
  modifySearchParams = ({ type, key }) => {
    const { setParams, params } = this.props;
    const p = {
      ...params,
      keyword: key
    };
    setParams(p);
    this.applySeachByParams(p);
  };
  modifyPagination = ({ pageNo, pageSize }) => {
    const { setParams, params } = this.props;
    const p = {
      ...params,
      pager: pageNo,
      pageSize
    };
    setParams(p);
    this.applySeachByParams(p);
  };
  applySeachByParams = params => {
    const { getArticles } = this.props;
    return getArticles(params);
  };
  onSortEnd = ({ oldIndex, newIndex }) => {
    const { sortList, data } = this.props;
    sortList(arrayMove(data, oldIndex, newIndex));
  };
  toNewArticle = () => {
    const {
      history: { push }
    } = this.props;
    push('/runmgmt/content/article/new');
  };
  removeArticle(id) {
    const { showTipsModal, removeArticle, getArticles, params } = this.props;
    showTipsModal({
      content: (
        <div className={cs['tips']}>
          {i18n['runmgmt.app_content.remove_article_tips']}
        </div>
      ),
      onConfirm: cb => {
        cb();
        removeArticle(id).then(r => {
          if (!r.result) return;
          getArticles(params);
        });
      }
    });
  }
  onOrderChange = v => {
    this.__order__ = v;
  };
  orderArticle(item) {
    const {
      orderArticle,
      showTipsModal,
      showTopAlert,
      params,
      getArticles
    } = this.props;
    this.__order__ = item.order;
    showTipsModal({
      header: i18n['runmgmt.app_content.modify_order'],
      content: (
        <OrderModalContent
          value={this.__order__}
          onChange={this.onOrderChange}
        />
      ),
      onConfirm: cb => {
        if (!this.__order__) {
          showTopAlert({
            content: i18n['runmgmt.app_content.type_right_order']
          });
          return;
        }
        cb();
        orderArticle({ id: item.id, order: this.__order__ }).then(r => {
          if (!r.result) return;
          getArticles(params);
        });
        this.__order__ = null;
      }
    });
  }

  editArticle = id => {
    const {
      history: { push }
    } = this.props;
    push(`/runmgmt/content/article/${id}`);
  };
  renderHeadCell = ({ item, index, fixed }) => {
    return (
      <Th key={index} fixed={fixed}>
        {item.label}
      </Th>
    );
  };

  _renderCellNew = ({ data, index, rowData, listData }) => {
    let content = null;
    let clickHandler = null;
    let title;
    const key = listData.value;
    switch (key) {
      case 'image':
        content = <Image value={rowData[key]} />;
        title = rowData[key];
        break;
      case 'lastUpdatedTime':
        title = content = moment(rowData.lastUpdatedTime).format(
          dateTimeFormatStyle
        );
        break;
      case 'operation':
        content = (
          <div>
            <Button
              onClick={this.editArticle.bind(this, rowData['id'])}
              type="primary"
              size="small"
            >
              {i18n['general.edit']}
            </Button>
            <Button
              onClick={this.removeArticle.bind(this, rowData['id'])}
              size="small"
              className={cs['actions-button']}
            >
              {i18n['general.delete']}
            </Button>
            <Button
              size="small"
              className={cs['actions-button']}
              onClick={this.orderArticle.bind(this, rowData)}
            >
              {i18n['runmgmt.app_content.article.order']}
            </Button>
          </div>
        );
        break;
      default:
        title = content = rowData[key];
        break;
    }
    return (
      <Td
        key={key}
        className={key === 'active' ? cs['active-actions'] : ''}
        onClick={clickHandler}
        title={title}
      >
        {content}
      </Td>
    );
  };
  render() {
    const {
      data,
      params: { pager, total, pageSize, keyword }
    } = this.props;
    return (
      <PagePanel>
        <PagePanel.Header>
          {i18n['runmgmt.app_content.article.title']}
        </PagePanel.Header>
        <PagePanel.Body>
          <div className={cs['actionBar']}>
            <div className={cs['newArticle']}>
              <Button onClick={this.toNewArticle} type="primary">
                {i18n['runmgmt.app_content.article.newArticle']}
              </Button>
            </div>
            <TypeSearch
              onChange={this.modifySearchParams}
              options={[
                {
                  label: i18n['runmgmt.app_content.article.table.title'],
                  value: '1'
                }
              ]}
              value={{ type: '1', key: keyword }}
            />
          </div>
          <UiTable
            data={data}
            columns={ARTICLE_COLUMNS}
            renderCell={this._renderCellNew}
            renderHeadCell={this.renderHeadCell}
          />
          <PaginationBar
            onPageChange={this.modifyPagination}
            pageSize={pageSize}
            total={total}
            pageNo={pager}
          />
        </PagePanel.Body>
      </PagePanel>
    );
  }
}
