import cs from './UploadVideo.less';
import i18n from 'utils/i18n';
import { get } from 'utils/ajax';
import DropdownForCode from 'components/v2/DropdownForCode';
import { Button, Form, Progress } from 'lean-ui';

function filterReplayList(replayList, videoRecycles) {
  let copyVideoRecycles = videoRecycles.concat();
  copyVideoRecycles = videoRecycles.filter(item => {
    if (replayList && replayList.find(object => object.id === item.value)) {
      return false;
    }
    return true;
  });
  return copyVideoRecycles;
}

function formatInfo(data, showVideo) {
  let copyData = [];
  if (showVideo && data) {
    data.forEach((item, index) => {
      copyData.push({
        name: item.replayName,
        uploadSuccess: 2,
        now: 1,
        index: index,
        replayUrl: item.replayUrl,
        fileId: item.replayId
      });
    });
    return copyData;
  }
  return data;
}
export default class UploadVideo extends PureComponent {
  constructor(props) {
    super(props);
    const {
      type,
      replayList,
      videoRecycles,
      clearRecycleList,
      showVideo
    } = this.props;
    this.state = {
      showSortPart: true,
      replayList: type === 'edit' ? formatInfo(replayList, showVideo) : [],
      videoRecycles:
        type === 'edit'
          ? filterReplayList(replayList, videoRecycles)
          : videoRecycles,
      clearRecycleList: clearRecycleList
    };
  }

  onChange = evt => {
    const { replayList } = this.state;
    const file = evt.target.files[0];
    evt.target.value = '';
    const copyreplayList = replayList ? replayList.concat() : [];
    const index = replayList && replayList.length ? replayList.length : 0;
    copyreplayList.push({
      name: file.name,
      file: file,
      uploadSuccess: 0,
      now: 0,
      index: index
    });
    this.setState({
      replayList: copyreplayList
    });
  };

  componentWillReceiveProps(nextProps) {
    const currentReplayList =
      this.props.clearRecycleList && this.props.showVideo;
    const nextReplayList = nextProps.clearRecycleList && nextProps.showVideo;
    if (nextReplayList && nextReplayList !== currentReplayList) {
      this.setState({
        replayList: [],
        videoRecycles: this.props.videoRecycles
      });
    }
  }

  componentDidMount() {
    const { replayList, saveUploadVideos } = this.props;
    saveUploadVideos(replayList || []);
  }

  //获取上传签名并验证文件大小和剩余储存空间之间比较
  getSignature = (cb, size) => {
    const { showTopAlert, getSignature } = this.props;
    getSignature().then(res => {
      if (res.result) {
        if (Number(size) / Math.pow(1024, 2) < res.data.leftVideoDisk) {
          cb(decodeURIComponent(res.data.sign));
        } else {
          showTopAlert({
            content: i18n['video.header.upload_disk_error']
          });
          return;
        }
      }
    });
  };

  changeProgress = (curr, id, index, type) => {
    const { replayList } = this.state;
    const copyreplayList = replayList.concat();
    const choesnItem = copyreplayList.find(item => item.index === id);
    choesnItem.uploadSuccess = type;
    choesnItem.now = !isNaN(curr) ? (curr * 100).toFixed(0) : 1;
    copyreplayList[index] = choesnItem;
    this.setState({
      replayList: copyreplayList
    });
  };

  refreshVideo = (fileId, name, videoUrl, id, index) => {
    const { replayList } = this.state;
    const copyreplayList = replayList.concat();
    const choesnItem = copyreplayList.find(item => item.index === id);
    choesnItem.fileId = fileId;
    choesnItem.replayUrl = videoUrl;
    copyreplayList[index] = choesnItem;
    this.setState(
      {
        replayList: copyreplayList,
        showSortPart: true
      },
      () => {
        this.saveUploadVideos(copyreplayList);
      }
    );
  };

  UploadVideo = (file, id, index) => {
    const { setFieldId, uploading } = this.props;
    const self = this;
    uploading(true);
    this.setState({
      showSortPart: false
    });
    const resultMsg = qcVideo.ugcUploader.start({
      videoFile: file,
      allowAudio: 1,
      getSignature: cb => {
        this.getSignature(cb, file.size);
      },
      success: function(result) {
        self.changeProgress(result.curr, id, index, 2);
        uploading(false);
      },
      error: function(result) {
        self.changeProgress(result.curr, id, index, 3);
        uploading(false);
      },
      progress: function(result) {
        self.changeProgress(result.shacurr, id, index, 1);
      },
      finish: function(result) {
        self.refreshVideo(
          result.fileId,
          result.videoName,
          result.videoUrl,
          id,
          index
        );
        setFieldId(result.fileId);
      }
    });
  };

  readFile = file => {
    const { showTopAlert } = this.props;
    if (typeof FileReader === 'undefined') {
      showTopAlert({
        content: i18n['upload.brower_support']
      });
      return false;
    }
  };

  changeVideoName = (index, evt) => {
    const { replayList } = this.state;
    const copyreplayList = replayList.concat();
    const v = evt.target.value;
    copyreplayList[index].name = v;
    this.setState(
      {
        replayList: copyreplayList
      },
      () => {
        this.saveUploadVideos(copyreplayList);
      }
    );
  };

  //整理保存数据
  saveUploadVideos = data => {
    const { saveUploadVideos, showVideo } = this.props;
    const saveReplyList = [];
    if (!showVideo) {
      saveUploadVideos(data);
      return;
    }
    data.forEach(item => {
      saveReplyList.push({
        replayId: item.fileId,
        replayUrl: item.replayUrl,
        replayName: item.name
      });
    });
    saveUploadVideos(saveReplyList);
  };

  //置顶操作
  gotoTop = (index, item) => {
    const { replayList } = this.state;
    const copyreplayList = replayList.concat();
    copyreplayList.splice(index, 1);
    copyreplayList.unshift(item);
    this.setState({
      replayList: copyreplayList
    });
    this.saveUploadVideos(copyreplayList);
  };

  //删除视频
  removeVideo = index => {
    const { replayList, videoRecycles } = this.state;
    const copyreplayList = replayList.concat();
    let copyVideoRecycles = videoRecycles.concat();
    const { showVideo } = this.props;
    if (!showVideo) {
      let chosenRecycle = replayList[index];
      copyVideoRecycles.push({
        label: chosenRecycle['replayName'],
        value: chosenRecycle['replayId'],
        replayUrl: chosenRecycle['replayUrl']
      });
    }
    copyreplayList.splice(index, 1);
    this.setState({
      replayList: copyreplayList,
      videoRecycles: copyVideoRecycles
    });
    this.saveUploadVideos(copyreplayList);
  };

  changeList = (e, item) => {
    const { replayList, videoRecycles } = this.state;
    let copyReplayList = replayList ? replayList.concat() : [];
    let copyVideoRecycles = videoRecycles.concat();
    copyVideoRecycles = copyVideoRecycles.filter(object => object.value !== e);
    copyReplayList.push({
      replayId: item.value,
      replayUrl: item.replayUrl,
      replayName: item.label
    });

    this.setState({
      replayList: copyReplayList,
      videoRecycles: copyVideoRecycles
    });
    this.saveUploadVideos(copyReplayList);
  };

  renderRecycleTableCell = (item, index) => {
    return (
      <tr key={index}>
        <td>
          <input
            type="text"
            value={item.replayName}
            onChange={this.changeVideoName.bind(self, index)}
            className={`form-control ${cs['value']}`}
          />
        </td>
        <td>
          {index === 0 ? (
            undefined
          ) : (
            <button
              type="button"
              className={cs['top-button']}
              onClick={this.gotoTop.bind(this, index, item)}
              title={i18n['video.video_root.sort_top']}
            >
              <span className={`fa fa-arrow-circle-up ${cs['icon']}`} />
            </button>
          )}
          <button
            type="button"
            className={cs['remove-btn']}
            onClick={this.removeVideo.bind(this, index)}
            title={i18n['general.delete']}
          >
            <span className={`fa fa-times-circle ${cs['icon']}`} />
          </button>
        </td>
      </tr>
    );
  };

  renderTableCell = (item, index) => {
    const { showSortPart } = this.state;
    return (
      <tr key={index}>
        <td>
          <input
            type="text"
            value={item.name}
            onChange={this.changeVideoName.bind(self, index)}
            className={`form-control ${cs['value']}`}
          />
        </td>
        <td>
          {item.uploadSuccess === 0 ? (
            <Button
              type="primary"
              onClick={this.UploadVideo.bind(
                this,
                item.file,
                item.index,
                index
              )}
            >
              {i18n['video.video_root.upload']}
            </Button>
          ) : item.uploadSuccess === 1 ? (
            item.now !== undefined && <Progress percent={(item.now * 1).toFixed(2)} showInfo={false} />
          ) : item.uploadSuccess === 2 ? (
            <span>{i18n['video.video_root.upload_success']}</span>
          ) : (
            <span>{i18n['video.video_root.upload_fail']}</span>
          )}
        </td>
        <td>
          {index === 0 || item.uploadSuccess === 1 || !showSortPart ? (
            undefined
          ) : (
            <button
              type="button"
              className={cs['top-button']}
              icon="sorting-up"
              fontType="bw"
              onClick={this.gotoTop.bind(this, index, item)}
              title={i18n['video.video_root.sort_top']}
            />
          )}
          {!showSortPart ? (
            undefined
          ) : (
            <button
              type="button"
              icon="error"
              fontType="bw"
              className={cs['remove-btn']}
              onClick={this.removeVideo.bind(this, index)}
              title={i18n['general.delete']}
            />
          )}
        </td>
      </tr>
    );
  };

  render() {
    const { replayList, videoRecycles } = this.state;
    const { showVideo, tenantRights } = this.props;
    const usedVideoDisk = (parseInt(tenantRights.usedVideoDisk) / 1024).toFixed(
      2
    );
    const videoDisk = (parseInt(tenantRights.videoDisk) / 1024).toFixed(2);
    const disabled = usedVideoDisk / videoDisk >= 1;
    return (
      <div className={cs['container']}>
        <Form.Item required>
          <Form.Label>
            {!showVideo
              ? i18n['video.video_root.series_type_video']
              : i18n['video.video_root.series_type_upload']}
            :
          </Form.Label>
          {!showVideo ? (
            <DropdownForCode
              className={cs['tool-item']}
              data={videoRecycles}
              onChange={this.changeList}
              disabled={disabled}
            />
          ) : (
            <label
              className={`main-control-color-border ${cs['control']} ${
                disabled ? cs['disabled'] : ''
              }`}
            >
              <i className="fa fa-paperclip" />
              <span className={cs['control-text']}>
                {i18n['upload_file.placeholder']}
              </span>
              {!disabled ? (
                <input
                  type="file"
                  className={cs['control-input']}
                  onChange={this.onChange}
                />
              ) : (
                undefined
              )}
            </label>
          )}
        </Form.Item>
        <table className={cs['list']}>
          <tbody className={cs['list-tbody']}>
            {!showVideo
              ? replayList &&
                replayList.length > 0 &&
                replayList.map(this.renderRecycleTableCell)
              : replayList &&
                replayList.length > 0 &&
                replayList.map(this.renderTableCell)}
          </tbody>
        </table>
      </div>
    );
  }
}
