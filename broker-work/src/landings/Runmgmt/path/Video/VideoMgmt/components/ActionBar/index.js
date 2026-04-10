import cs from './ActionBar.less';
import Modal from 'components/Modal';
import UpdateVideo from '../UpdateVideo';
import i18n from 'utils/i18n';
import { FormattedMessage } from 'react-intl';
import { Button, Progress, Message } from 'lean-ui';

export default class ActionBar extends PureComponent {
  state = {
    showCreateVideoModal: false
  };

  toggleCreateVideoModal = toggle => {
    const { showTipsModal, tenantRights } = this.props;
    const usedVideoDisk = (parseInt(tenantRights.usedVideoDisk) / 1024).toFixed(
      2
    );
    const videoDisk = (parseInt(tenantRights.videoDisk) / 1024).toFixed(2);
    if (usedVideoDisk / videoDisk >= 1 && toggle) {
      showTipsModal({
        content: (
          <div className={cs['delete-tips-content']}>
            {i18n['video.video_root.disk_warn_tips']}
          </div>
        ),
        header: i18n['video.video_root.flux_warn_header'],
        noCancel: true,
        onConfirm: cb => {
          cb();
        }
      });
    } else {
      this.setState({
        showCreateVideoModal: toggle
      });
    }
  };

  componentDidMount() {
    const { getLecturers, getVideoRecordRecycle } = this.props;
    getLecturers();
    getVideoRecordRecycle({ page: 1, size: 500 });
  }

  submitCreateVideoForm = data => {
    const {
      createRecords,
      getVideo,
      searchParams,
      currenVideos,
      saveUploadVideos
    } = this.props;
    const copyData = Object.assign({}, data, {
      replayList: currenVideos,
      pubState: data.pubState ? 'PUBBED' : 'NOTPUB'
    });
    createRecords(copyData).then(res => {
      if (!res.result) return res;
      if (res.result) {
        Message.success(i18n['general.create_success']);
        getVideo(searchParams);
        saveUploadVideos([]);
        this.toggleCreateVideoModal(false);
      }
    });
  };

  cancel = () => {
    const { updateSelectedVideo } = this.props;
    updateSelectedVideo([]);
  };

  deleteVideos = () => {
    const {
      deleteVideo,
      selectedVideoIds,
      getVideo,
      showTipsModal
    } = this.props;
    showTipsModal({
      content: i18n['video.video_root.delete_tips'],
      onConfirm: cb => {
        Promise.resolve(deleteVideo(selectedVideoIds)).then(res => {
          if (res.result) {
            Message.success(i18n['general.remove_success']);
            getVideo({
              page: 1,
              size: 20,
              sortby: 'createTime',
              orderDesc: true
            });
            this.cancel();
            cb();
          }
        });
      }
    });
  };

  formatterInfo = () => {
    const { currentVideo } = this.state;
    let copyData = { sourceType: 'LIVE' };
    return copyData;
  };

  render() {
    const { showCreateVideoModal, formData } = this.state;
    const {
      lecturers,
      videoRecycles,
      selectedVideoIds,
      tenantRights
    } = this.props;
    const usedVideoDisk = (parseInt(tenantRights.usedVideoDisk) / 1024).toFixed(
      2
    );
    const videoDisk = (parseInt(tenantRights.videoDisk) / 1024).toFixed(2);
    const initValues = this.formatterInfo();
    return (
      <div className={cs['container']}>
        {selectedVideoIds.length > 0 ? (
          <div className={cs['wrapper']}>
            <div className={cs['text']}>
              <FormattedMessage
                id="account.selected_tips"
                defaultMessage={i18n['account.selected_tips']}
                values={{
                  number: (
                    <span className="badge">{selectedVideoIds.length}</span>
                  )
                }}
              />
            </div>
            <Button type="primary" className={cs['btn']} onClick={this.cancel}>
              {i18n['general.cancel']}
            </Button>
            <Button
              type="primary"
              className={cs['btn']}
              onClick={this.deleteVideos}
            >
              {i18n['general.delete']}
            </Button>
          </div>
        ) : (
          <div className={cs['default-container']}>
            <div className={cs['left']}>
              <Button
                type="primary"
                className={cs['tool-item']}
                disabled={tenantRights.videoExpire}
                onClick={this.toggleCreateVideoModal.bind(this, true)}
              >
                {i18n['video.action_bar.series_create']}
              </Button>
            </div>
            <div className={cs['progress-part']}>
              <Progress
                percent={(usedVideoDisk / videoDisk * 100).toFixed(2)}
                showInfo={false}
              />
              <div className={cs['flux-label']} data-test="disk-part">
                <div className={cs['left-flux-label']}>
                  {i18n['video.header.live_usedLive_disk']}：
                </div>
                <div
                  className={
                    usedVideoDisk / videoDisk >= 1
                      ? cs['danger-right-flux-label']
                      : cs['right-flux-label']
                  }
                >
                  {`${usedVideoDisk}G/${videoDisk}G`}
                </div>
              </div>
            </div>
          </div>
        )}
        <Modal.Animate>
          {showCreateVideoModal && (
            <UpdateVideo
              initialValues={initValues}
              onClose={this.toggleCreateVideoModal.bind(this, false)}
              submitForm={this.submitCreateVideoForm}
              lecturers={lecturers}
              videoRecycles={videoRecycles}
              type="add"
              {...this.props}
            />
          )}
        </Modal.Animate>
      </div>
    );
  }
}
