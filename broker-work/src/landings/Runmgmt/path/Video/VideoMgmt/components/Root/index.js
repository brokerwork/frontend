import PagePanel from 'components/PagePanel';
import i18n from 'utils/i18n';
import ActionBar from '../../containers/ActionBar';
import Image from 'components/Image';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { dateTimeFormatStyle } from 'utils/config';
import PaginationBar from 'components/v2/PaginationBar';
import UpdateVideo from '../UpdateVideo';
import SortToggle from 'components/v2/SortToggle';
import { RECORDS_LIST_HEADER } from '../../../constants';
import { Table as UiTable, Message } from 'lean-ui';
import cs from './Root.less';
const { Td, Th } = UiTable;

export default class Root extends PureComponent {
  state = {
    showCreateVideoModal: false,
    currentVideo: {},
    currentChosenItem: ''
  };

  componentDidMount() {
    const {
      getVideo,
      match: { params: { videoId } = {} },
      brandInfo,
      getTenantRights,
      searchParams
    } = this.props;
    const element = document.createElement('script');
    const p = document.createElement('script');
    element.setAttribute(
      'src',
      'http://apps.bdimg.com/libs/jquery/2.1.1/jquery.min.js'
    );
    p.setAttribute(
      'src',
      '//imgcache.qq.com/open/qcloud/js/vod/sdk/ugcUploader.js'
    );
    document
      .getElementsByTagName('head')
      .item(0)
      .appendChild(element);
    document
      .getElementsByTagName('head')
      .item(0)
      .appendChild(p);
    getTenantRights();
    Promise.resolve(getVideo(searchParams)).then(res => {
      if (videoId) {
        this.toggleCreateVideoModal({ videoId }, true);
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    const currentVideoId =
      this.props.match.params && this.props.match.params.videoId;
    const nextVideoId =
      nextProps.match.params && nextProps.match.params.videoId;
    if (nextVideoId && nextVideoId !== currentVideoId) {
      this.toggleCreateVideoModal({ videoId: nextVideoId }, true);
    }
  }

  modifyPagination = v => {
    const { getVideo, searchParams, modifySearchParams } = this.props;
    modifySearchParams({
      ...searchParams,
      page: v.pageNo,
      size: v.pageSize
    });
    getVideo({
      ...searchParams,
      page: v.pageNo,
      size: v.pageSize
    });
  };

  formatterInfo = () => {
    const { currentVideo } = this.state;
    let copyData = JSON.parse(JSON.stringify(currentVideo));
    return copyData;
  };

  toggleCreateVideoModal = (item, toggle) => {
    const { data } = this.props;
    if (toggle) {
      let currentVideo = data.find(object => object.id === item.videoId);

      this.setState({
        showCreateVideoModal: toggle,
        currentVideo: currentVideo
      });
    } else {
      const {
        match: { path },
        history: { push }
      } = this.props;
      this.setState(
        {
          showCreateVideoModal: toggle,
          currentVideo: {}
        },
        () => {
          push(path.replace('/:videoId', ''));
        }
      );
    }
  };

  submitUpdateVideoForm = data => {
    const {
      updateRecords,
      getVideo,
      searchParams,
      currenVideos,
      saveUploadVideos,
      match: { params: { videoId } = {} }
    } = this.props;
    const copyData = Object.assign({}, data, {
      replayList: currenVideos,
      pubState: data.pubState ? 'PUBBED' : 'NOTPUB',
      id: videoId
    });

    updateRecords(copyData).then(res => {
      if (!res.result) return res;
      if (res.result) {
        Message.success(i18n['general.modify_success']);
        getVideo(searchParams);
        saveUploadVideos([]);
        this.toggleCreateVideoModal();
      }
    });
  };

  selectVideo = (video, evt) => {
    const { updateSelectedVideo, selectedVideos } = this.props;
    const checked = evt.target.checked;
    const copyVideos = selectedVideos.concat();

    if (checked) {
      copyVideos.push(video);
    } else {
      const idx = copyVideos.findIndex(_video => _video.id === video.id);
      copyVideos.splice(idx, 1);
    }

    updateSelectedVideo(copyVideos);
  };

  toggleSelectAll = evt => {
    const { updateSelectedVideo, selectedVideos, data } = this.props;
    const checked = evt.target.checked;
    const videos = checked
      ? [].concat(
          selectedVideos.filter(
            _video => !data.some(video => video.id === _video.id)
          ),
          data
        )
      : selectedVideos.filter(
          _video => !data.some(video => video.id === _video.id)
        );

    updateSelectedVideo(videos);
  };

  modifySort = v => {
    const { getVideo, searchParams, modifySearchParams } = this.props;
    modifySearchParams({
      ...searchParams,
      sortby: v,
      orderDesc: !searchParams.orderDesc
    });
    getVideo({
      ...searchParams,
      sortby: v,
      orderDesc: !searchParams.orderDesc
    });
  };

  _renderCellback = ({ data, index, rowData, listData }) => {
    let content = null;
    let clickHandler = null;
    let title;
    const key = listData['value'];
    const {
      match: { url }
    } = this.props;
    switch (key) {
      case 'cover':
        content = <Image value={rowData.cover} className={cs['image-size']} />;
        break;
      case 'subject':
        content = <Link to={`${url}/${rowData.id}`}>{rowData.subject}</Link>;
        break;
      case 'replayList':
        content = rowData.replayList ? rowData.replayList.length : '';
        break;
      case 'sourceType':
        content =
          rowData.sourceType === 'LIVE'
            ? i18n['video.video_list.source_type.live']
            : i18n['video.video_list.source_type.upload'];
        break;
      case 'createTime':
        content = moment(rowData.createTime * 1000).format(dateTimeFormatStyle);
        break;
      case 'createTime':
        content = moment(rowData.modifyTime * 1000).format(dateTimeFormatStyle);
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

  renderHeadCell = ({ item, index, fixed }) => {
    const {
      searchParams: { sortby, orderDesc }
    } = this.props;
    return (
      <Th key={index} fixed={fixed}>
        {['createTime'].includes(item.value) ? (
          <SortToggle
            activeSort={sortby}
            orders={[true, false]}
            sortKey={item.value}
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

  render() {
    const {
      data,
      navigationInfo,
      match: { url },
      lecturers,
      videoRecycles,
      selectedVideoIds,
      tenantRights
    } = this.props;
    const { showCreateVideoModal } = this.state;
    const initValues = this.formatterInfo();
    const checked =
      data && data.length
        ? data.every(video => selectedVideoIds.some(id => id === video.id))
        : false;
    return (
      <PagePanel>
        <PagePanel.Header>
          {i18n['video.video_list.header']}
          {tenantRights.videoExpire ? (
            <div className={cs['live-expire-div']}>
              {`(${i18n['video.header.live_expire']})`}
            </div>
          ) : (
            undefined
          )}
        </PagePanel.Header>
        <PagePanel.Body>
          <ActionBar />
          <UiTable
            data={data}
            columns={RECORDS_LIST_HEADER}
            renderCell={this._renderCellback}
            renderHeadCell={this.renderHeadCell}
          />
          <PaginationBar
            onPageChange={this.modifyPagination}
            {...navigationInfo}
          />
        </PagePanel.Body>
        {showCreateVideoModal && (
          <UpdateVideo
            onClose={this.toggleCreateVideoModal.bind(this, undefined, false)}
            submitForm={this.submitUpdateVideoForm}
            lecturers={lecturers}
            videoRecycles={videoRecycles}
            initialValues={initValues}
            type="edit"
            {...this.props}
          />
        )}
      </PagePanel>
    );
  }
}
