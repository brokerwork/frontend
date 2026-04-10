import PaginationBar from 'components/v2/PaginationBar';
import cs from './List.less';
import i18n from 'utils/i18n';
import { Message, Icon, Button, Table as UiTable, Tag } from 'lean-ui';
import { DOWNLOAD_CENTER_COLUMNS } from '../../constant';
import { Content, Layout } from 'components/v2/PageWraper';
const { Td, Th } = UiTable;

export default class DownloadCenterList extends PureComponent {
  state = {
    selectedKeys: []
  };
  componentDidMount() {
    this.regetDownloadList();
  }

  regetDownloadList() {
    const { currentPagination, updatePagination } = this.props;
    // Message.info(i18n['report.download_center.tips'], true);
    Promise.resolve(
      updatePagination({ pageNo: 1, pageSize: currentPagination.pageSize })
    ).then(() => {
      this.getDownloadList();
    });
  }

  getDownloadList = () => {
    const { getDownloadList, currentPagination } = this.props;

    getDownloadList(currentPagination);
  };

  onPageChange = ({ pageNo, pageSize }) => {
    const { updatePagination } = this.props;

    Promise.resolve(updatePagination({ pageNo, pageSize })).then(() => {
      this.getDownloadList();
    });
  };

  refresh = () => {
    this.getDownloadList();
  };

  rebuild = id => {
    const { rebuildDownload } = this.props;

    rebuildDownload(id).then(({ result }) => {
      if (result) {
        this.getDownloadList();
      }
    });
  };

  download = item => {
    const { checkDownload } = this.props;

    checkDownload(item.id).then(({ result }) => {
      if (result) {
        window.location.href = item.url;
      }
    });
  };
  showConditionsModal = items => {
    const { showTipsModal } = this.props;
    showTipsModal({
      header: i18n['report.download_center.tips_show_more'],
      content: (
        <div className={cs['tag-tips-container']}>
          {this._renderConditionsTags(items, true)}
        </div>
      ),
      noFooter: true
    });
  };
  _renderConditionsTags = (items, isShowAll) => {
    const LIMIT = 3;
    return items.map((item, i) => {
      if (!isShowAll && i === LIMIT) {
        return (
          <Tag onClick={this.showConditionsModal.bind(this, items)}>
            {i18n['report.download_center.tag_more']}
          </Tag>
        );
      } else if (!isShowAll && i > LIMIT) {
        return undefined;
      } else {
        return <Tag color="default">{item}</Tag>;
      }
    });
  };

  // 生成header的部分，排序和特殊处理的header
  renderHeadCell = ({ item, index, fixed }) => {
    return (
      <Th key={index} fixed={fixed}>
        {item.label}
      </Th>
    );
  };
  _renderCellNew = ({ rowData, listData }) => {
    return this._renderCellback(rowData, listData || {});
  };
  // 具体表格内容不同类型内容展示和特殊处理
  _renderCellback = (source, field) => {
    const key = field.value;
    const {
      match: { url },
      userRights
    } = this.props;
    let content = null;
    let clickHandler = null;
    let title;
    switch (key) {
      case 'status_desc':
        content = (
          <Tag color={source['status'] === 1 ? 'green' : 'red'}>
            {source['status_desc']}
          </Tag>
        );
        break;
      case 'conditions':
        content = this._renderConditionsTags(source[key]);
        break;
      case 'action':
        content =
          source['status'] === 0 || source['status'] === -1 ? (
            <Button onClick={this.refresh} type="primary">
              {i18n['report.download_center.refresh_status']}
            </Button>
          ) : source['status'] === 1 ? (
            <Button onClick={this.download.bind(this, source)} type="primary">
              {i18n['report.download_center.click_download']}
            </Button>
          ) : (
            <Button onClick={this.rebuild.bind(this, source.id)} type="primary">
              {i18n['report.download_center.return_new']}
            </Button>
          );
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

  onSelectChange = ({ index, item, selectedKeys, key }) => {
    this.setState({ selectedKeys });
  };

  deleteList = () => {
    const { selectedKeys } = this.state;
    const { showTipsModal, deletDownloads } = this.props;
    showTipsModal({
      content: (
        <div>
          <Icon icon="warning" />{' '}
          {i18n['report.download_center.delete.confirm']}
        </div>
      ),
      onConfirm: cb => {
        deletDownloads(selectedKeys).then(({ result }) => {
          if (result) {
            this.regetDownloadList();
            cb();
          }
        });
      }
    });
  };

  render() {
    const { downloadList, currentPagination } = this.props;
    const { selectedKeys } = this.state;
    const columns = DOWNLOAD_CENTER_COLUMNS;
    return (
      <Layout footer>
        <Content table={downloadList.list && downloadList.list.length}>
          <UiTable
            data={downloadList.list || []}
            columns={columns}
            fixedHeader
            renderCell={this._renderCellNew}
            renderHeadCell={this.renderHeadCell}
            rowSelectOptions={{
              onChange: this.onSelectChange,
              selectedKeys: selectedKeys,
              selectFieldKey: 'id',
              selectedHeader: (
                <a
                  href="javascript:;"
                  onClick={this.deleteList}
                  style={{ marginLeft: '15px', lineHeight: '14px' }}
                >
                  <Icon icon="delete-outline" /> {i18n['general.delete']}
                </a>
              )
            }}
            pager={
              downloadList.list && downloadList.list.length ? (
                <PaginationBar
                  {...currentPagination}
                  onPageChange={this.onPageChange}
                />
              ) : (
                undefined
              )
            }
          />
        </Content>
      </Layout>
    );
  }
}
