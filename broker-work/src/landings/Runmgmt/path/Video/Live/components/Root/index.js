import ActionBar from '../../containers/ActionBar';
import moment from 'moment';
import { dateTimeFormatStyle } from 'utils/config';
import PaginationBar from 'components/v2/PaginationBar';
import Image from 'components/Image';
import PagePanel from 'components/PagePanel';
import i18n from 'utils/i18n';
import LifeIcon from './lifeIcon';
import SortToggle from 'components/v2/SortToggle';
import TextButton from 'components/v2/TextButton';
import {
  LIST_STATE,
  VIDEO_LIST_HEADER,
  LECTURER_LIST_HEADER,
  COMMENT_STATE
} from '../../../constants';
import { Button, Table as UiTable, Message } from 'lean-ui';
const { Td, Th } = UiTable;
import { Link } from 'react-router-dom';
import CreateLive from '../CreateLive';
import LinkDetailModal from '../LinkDetailModal';
import Modal from 'components/Modal';
import cs from './Root.less';
const sortFieldtoSortByMap = {
  startTime: 'startTime',
  createTime: 'createTime'
};

export default class Root extends PureComponent {
  formatterInfo = () => {
    const { currentLive } = this.props;
    let copyData = JSON.parse(JSON.stringify(currentLive));
    copyData.startTime = currentLive.startTime
      ? moment(currentLive.startTime * 1000)
      : '';
    copyData.endTime = currentLive.endTime
      ? moment(currentLive.endTime * 1000)
      : '';
    if (
      copyData.cover ===
      'http://broker-upload-dev.oss-cn-hangzhou.aliyuncs.com/Live/Cover.jpeg'
    ) {
      copyData.defaultCover = true;
      delete copyData.cover;
    }
    this.setState({
      submitDisabled: !copyData.agreeLaw
    });
    return copyData;
  };
  state = {
    showCreateLiveModal: false,
    formData: {},
    showLinkModal: false,
    submitDisabled: true
  };

  componentDidMount() {
    const {
      brandInfo,
      getLives,
      searchParams,
      getLecturers,
      getTenantRights,
      match: { params: { liveId } = {} }
    } = this.props;
    moment.locale('zh-cn');
    Promise.all([
      getLecturers(),
      getLives(searchParams),
      getTenantRights()
    ]).then(() => {
      if (liveId) {
        this.toggleCreateLiveModal({ liveId }, true);
      }
    });
  }

  toggleCreateLiveModal = (item, toggle) => {
    const { getLiveDetail } = this.props;
    if (toggle) {
      Promise.resolve(getLiveDetail(item.liveId)).then(({ result }) => {
        if (result) {
          this.setState({
            showCreateLiveModal: toggle,
            formData: this.formatterInfo()
          });
        }
      });
    } else {
      const {
        match: { path },
        history: { push }
      } = this.props;
      this.setState(
        {
          showCreateLiveModal: toggle
        },
        () => {
          push(path.replace('/:liveId', ''));
        }
      );
    }
  };

  submitCreateLiveForm = data => {
    const { updateLive, getLives, searchParams } = this.props;
    data['startTime'] = data['startTime'].format('X');
    data['endTime'] = data['endTime'].format('X');
    data['freeWatchTime'] = data.freeWatchTime ? 120 : 0;
    data['pubState'] = data.pubState ? 'PUBBED' : 'NOTPUB';
    data['cover'] = data['defaultCover']
      ? 'http://broker-upload-dev.oss-cn-hangzhou.aliyuncs.com/Live/Cover.jpeg'
      : data['cover'];
    updateLive(data).then(res => {
      if (!res.result) {
        data['startTime'] = moment(data['startTime'] * 1000);
        data['endTime'] = moment(data['endTime'] * 1000);
        this.setState({
          formData: data
        });
        return;
      }
      Message.success(i18n['general.modify_success']);
      getLives(searchParams);
      this.toggleCreateLiveModal({}, false);
    });
  };

  showLinkModal = (item, toggle) => {
    const { getLiveDetail } = this.props;
    if (!toggle) {
      this.setState({ showLinkModal: toggle });
      return;
    } else {
      Promise.resolve(getLiveDetail(item.id)).then(({ result }) => {
        if (result) {
          this.setState({
            showLinkModal: toggle
          });
        }
      });
    }
  };
  showDownloadModal = item => {
    window.location.href = item.commentFilePath;
  };
  // 停止直播
  stopLive = item => {
    const { stopLive, getLives, searchParams, showTipsModal } = this.props;
    const stopLiveIds = [];
    stopLiveIds.push(item.id);
    showTipsModal({
      content: i18n['video.header.stop_live_tips'],
      onConfirm: cb => {
        Promise.resolve(stopLive(stopLiveIds)).then(res => {
          if (res.result) {
            Message.success(i18n['video.header.stop_live_success']);
            getLives(searchParams);
            cb();
          }
        });
      }
    });
  };
  modifySort = v => {
    const { searchParams, modifySearchParams } = this.props;
    modifySearchParams({
      ...searchParams,
      sortby: v,
      orderDesc: !searchParams.orderDesc
    });
  };

  gotoHelpCenter = () => {
    const { getTopRight } = this.props;
    let rights = '';
    let newWindow = window.open('_blank');
    Promise.resolve(getTopRight()).then(({ result }) => {
      if (result) {
        const { topRights } = this.props;
        topRights.forEach(item => {
          rights += item.entityNo + ',';
        });
        rights = rights.substring(0, rights.length - 1);
        newWindow.location = `http://helpcenter.finsoftware.net/%E7%9B%B4%E6%92%AD%E7%AE%A1%E7%90%86%E6%93%8D%E4%BD%9C%E6%8C%87%E5%8D%97/?rights=${rights}`;
      }
    });
  };

  onFormChange = values => {
    this.setState({
      submitDisabled: !values.agreeLaw
    });
  };
  //选择直播
  onSelect = ({ item, selectedKeys, event }) => {
    if (item === null) {
      this.toggleSelectAll(event);
    } else {
      this.toggleSelect(item, !event.target.checked);
    }
  };
  _renderCellNew = ({ key, data, index, rowData, listData }) => {
    return this._renderCellback(rowData, listData || {});
  };

  // 具体表格内容不同类型内容展示和特殊处理
  _renderCellback = (source, field) => {
    let content = null;
    let clickHandler = null;
    let title;
    title = content = source[key];
    const {
      match: { url },
      searchParams,
      listType
    } = this.props;
    const key = field['value'];
    const status = LIST_STATE.find(object => object.value === source.state);
    const commentState =
      source.commentFileState !== 'SAVED'
        ? COMMENT_STATE.find(object => object.value === source.commentFileState)
        : undefined;
    switch (key) {
      case 'cover':
        content = (
          <Image
            value={source[key]}
            disabled={true}
            className={cs['image-size']}
          />
        );
        break;
      case 'subject':
        content = <Link to={`${url}/${source.id}`}>{source.subject}</Link>;
        break;
      case 'createTime':
        content = moment(source[key] * 1000).format(dateTimeFormatStyle);
        break;
      case 'startTime':
        content = moment(source[key] * 1000).format(dateTimeFormatStyle);
        break;
      case 'endTime':
        content = moment(source[key] * 1000).format(dateTimeFormatStyle);
        break;
      case 'modifyTime':
        content = moment(source[key] * 1000).format(dateTimeFormatStyle);
        break;
      case 'liveStatus':
        content =
          source.commentFileState !== 'SAVED' &&
          listType.value === 'LIVE' &&
          searchParams.state === 'FINISHED' ? (
            commentState.label
          ) : (
            <div>
              {status.value === 'STARTED' ? <LifeIcon /> : undefined}
              <div className={cs['status-label']}>{status.label}</div>
            </div>
          );
        break;
      case 'action':
        content = (
          <div>
            {source.commentFileState === 'SAVED' &&
            status.value !== 'STARTED' ? (
              <Button
                type="primary"
                className={cs['stop-button']}
                onClick={this.showDownloadModal.bind(this, source)}
              >
                {i18n['video.live.video_comment_file_download']}
              </Button>
            ) : (
              undefined
            )}
            {status.value === 'STARTED' ? (
              <Button
                type="primary"
                className={cs['stop-button']}
                onClick={this.stopLive.bind(this, source)}
              >
                {i18n['video.header.stop_live']}
              </Button>
            ) : (
              undefined
            )}
            <a
              href="javascript:;"
              onClick={this.showLinkModal.bind(this, source, true)}
              className={cs['detail-button']}
            >
              {i18n['video.header.live_detail']}
            </a>
          </div>
        );
        break;
      default:
        title = content = source[key];
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
  renderHeadCell = ({ item, index, fixed }) => {
    const {
      searchParams: { sortby, orderDesc }
    } = this.props;
    return (
      <Th key={index} fixed={fixed}>
        {sortFieldtoSortByMap[item.value] ? (
          <SortToggle
            activeSort={sortby}
            orders={[true, false]}
            sortKey={sortFieldtoSortByMap[item.value]}
            activeOrder={orderDesc}
            onChange={this.modifySort}
          >
            {item.label}
          </SortToggle>
        ) : (
          item.label
        )}
      </Th>
    );
  };
  onTableScroll = () => {
    this.options.forEach(t => t.hidePopover());
  };

  // 具体表格内容不同类型内容展示和特殊处理
  _renderLecturerCellback = ({ data, index, rowData, listData }) => {
    let content = null;
    let clickHandler = null;
    let title;
    const key = listData['value'];
    switch (key) {
      case 'header':
        content = (
          <Image value={rowData.picture} className={cs['header-size']} />
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

  renderLecturerHeadCell = ({ item, index, fixed }) => {
    return (
      <Th key={index} fixed={fixed}>
        {item.label}
      </Th>
    );
  };

  getKey = selectedLiveIds => {
    const selectedKeys = Object.keys(selectedLiveIds);
    let parseKey = [];
    selectedKeys.forEach(item => {
      parseKey.push(item);
    });
    return parseKey;
  };
  //全选和全不选
  toggleSelectAll = evt => {
    const { updateSelectedLive, data } = this.props;
    let isSelected = evt;
    if (evt && evt.target) {
      isSelected = evt.target.checked;
    }
    let map = {};
    if (isSelected) {
      data.forEach(o => {
        let id = o.id;
        map[id] = o;
      });
    }
    updateSelectedLive(map);
  };
  toggleSelect = (item, isSelected) => {
    const { id } = item;
    const { selectedLiveIds, updateSelectedLive, searchParams } = this.props;
    const __selectedLiveIds = Object.assign({}, selectedLiveIds);
    if (!isSelected) {
      __selectedLiveIds[id] = item;
    } else {
      delete __selectedLiveIds[id];
    }
    updateSelectedLive(__selectedLiveIds);
  };
  // 多选后出现的操作
  renderBatchActions = () => {
    const { searchParams } = this.props;
    return (
      <div style={{ 'margin-left': '10px' }}>
        <TextButton
          text={i18n['customer.cancel']}
          onClick={this.toggleSelectAll.bind(this, false)}
        />
        {searchParams.state === 'NOTFINISHED' ? (
          <TextButton
            text={i18n['video.header.stop_live']}
            icon="delete-outline"
            onClick={this.stopLives}
          />
        ) : (
          <TextButton
            text={i18n['general.delete']}
            icon="delete-outline"
            onClick={this.deleteLives}
          />
        )}
      </div>
    );
  };
  // 停止直播
  stopLives = () => {
    const {
      stopLive,
      getLives,
      searchParams,
      selectedLiveIds,
      showTipsModal
    } = this.props;
    showTipsModal({
      content: i18n['video.header.stop_live_tips'],
      onConfirm: cb => {
        Promise.resolve(stopLive(selectedLiveIds)).then(res => {
          if (res.result) {
            Message.success(i18n['video.header.stop_live_success']);
            getLives(searchParams);
            this.cancel();
            cb();
          }
        });
      }
    });
  };
  checkDelState = () => {
    const { selectedLives } = this.props;
    let delResult = false;
    selectedLives.forEach(item => {
      if (item.state === 'STARTED') {
        delResult = false;
        return;
      } else {
        delResult = true;
      }
    });
    return delResult;
  };
  deleteLives = () => {
    const {
      deleteLive,
      selectedLiveIds,
      getLives,
      searchParams,
      showTipsModal
    } = this.props;
    const preDel = this.checkDelState();
    if (preDel) {
      showTipsModal({
        content: i18n['video.video_root.delete_tips'],
        onConfirm: cb => {
          Promise.resolve(deleteLive(selectedLiveIds)).then(res => {
            if (res.result) {
              Message.success(i18n['general.remove_success']);
              getLives(searchParams);
              this.cancel();
              cb();
            }
          });
        }
      });
    } else {
      Message.error(i18n['video.video_root.delete_fail_tips']);
    }
  };

  render() {
    const {
      showCreateLiveModal,
      formData,
      showLinkModal,
      submitDisabled
    } = this.state;
    const {
      data,
      navigationInfo,
      lecturers,
      listType,
      lecturersList,
      selectedLiveIds,
      lecturerNavigationInfo,
      searchParams,
      tenantRights,
      userRights
    } = this.props;
    const selectedKeys = this.getKey(selectedLiveIds);
    const rowSelectOptions = {
      onChange: this.onSelect,
      selectFieldKey: 'id',
      selectedKeys,
      selectedHeader: this.renderBatchActions()
    };
    return (
      <PagePanel>
        <PagePanel.Header>
          {i18n['video.live.header']}
          {tenantRights.liveExpire ? (
            <div className={cs['live-expire-div']}>
              {`(${i18n['video.header.live_expire']})`}
            </div>
          ) : (
            undefined
          )}
        </PagePanel.Header>
        <PagePanel.Body>
          <ActionBar gotoHelpCenter={this.gotoHelpCenter} />
          {listType.value === 'LIVE' ? (
            <UiTable
              data={data}
              columns={VIDEO_LIST_HEADER}
              fixedHeader
              renderCell={this._renderCellNew}
              rowSelectOptions={rowSelectOptions}
              renderHeadCell={this.renderHeadCell}
              onTableScroll={this.onTableScroll}
            />
          ) : (
            <UiTable
              data={lecturersList}
              columns={LECTURER_LIST_HEADER}
              renderCell={this._renderLecturerCellback}
              renderHeadCell={this.renderLecturerHeadCell}
            />
          )}
          {listType.value === 'LIVE' ? (
            <PaginationBar
              onPageChange={this.modifyPagination}
              {...navigationInfo}
            />
          ) : (
            undefined
          )}
        </PagePanel.Body>
        <Modal.Animate>
          {showCreateLiveModal && (
            <CreateLive
              type={'edit'}
              gotoHelpCenter={this.gotoHelpCenter}
              onClose={this.toggleCreateLiveModal.bind(this, undefined, false)}
              submitForm={this.submitCreateLiveForm}
              lecturers={lecturers}
              initialValues={formData}
              hideNeedRecord={userRights.LIVE_DEMAND}
              tenantRights={tenantRights}
              onChange={this.onFormChange}
              submitDisabled={submitDisabled}
            />
          )}
          {showLinkModal && (
            <LinkDetailModal
              onCopy={this.onCopy}
              onClose={this.showLinkModal.bind(this, undefined, false)}
              {...this.props}
            />
          )}
        </Modal.Animate>
      </PagePanel>
    );
  }

  modifyPagination = v => {
    const { getLives, searchParams, modifySearchParams } = this.props;
    modifySearchParams({
      ...searchParams,
      page: v.pageNo,
      size: v.pageSize
    });
    getLives({
      ...searchParams,
      page: v.pageNo,
      size: v.pageSize
    });
  };

  componentWillReceiveProps(nextProps) {
    const currentLiveId =
      this.props.match.params && this.props.match.params.liveId;
    const nextLiveId = nextProps.match.params && nextProps.match.params.liveId;
    if (nextLiveId && nextLiveId !== currentLiveId) {
      this.toggleCreateLiveModal({ liveId: nextLiveId }, true);
    }
  }
}
