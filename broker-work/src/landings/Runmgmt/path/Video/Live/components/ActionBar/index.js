import TypeSearch from 'components/v2/TypeSearch';
import cs from './ActionBar.less';
import Modal from 'components/Modal';
import DropdownForCode from 'components/v2/DropdownForCode';
import CreateLive from '../CreateLive';
import CreateLecturer from '../CreateLecturer';
import AdminModal from '../AdminModal';
import i18n from 'utils/i18n';
import { LIVE_STATE, PUB_TYPE, LIST_TYPE } from '../../../constants';
import moment from 'moment';
import { Button, Progress, Message } from 'lean-ui';
import _ from 'lodash';

export default class ActionBar extends PureComponent {
  state = {
    showCreateLiveModal: false,
    showCreateTecturerModal: false,
    showAdiminModal: false,
    formData: {},
    submitDisabled: true
  };
  componentDidMount() {
    const { getLecturers } = this.props;
    getLecturers();
  }

  toggleCreateLiveModal = toggle => {
    const { showTipsModal, tenantRights } = this.props;
    const usedLiveFlux = (parseInt(tenantRights.usedLiveFlux) / 1024).toFixed(
      2
    );
    const liveFlux = (parseInt(tenantRights.liveFlux) / 1024).toFixed(2);
    if (usedLiveFlux / liveFlux >= 1 && toggle) {
      showTipsModal({
        content: (
          <div className={cs['delete-tips-content']}>
            {i18n['video.video_root.flux_warn_tips']}
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
        showCreateLiveModal: toggle,
        formData: {}
      });
    }
  };
  toggleCreateTecturerModal = () => {
    this.setState({
      showCreateTecturerModal: !this.state.showCreateTecturerModal
    });
  };
  toggleAdminModal = () => {
    const { getAdminList } = this.props;
    if (this.state.showAdiminModal) {
      this.setState({
        showAdiminModal: !this.state.showAdiminModal
      });
    } else {
      Promise.resolve(getAdminList()).then(({ result }) => {
        if (result) {
          this.setState({
            showAdiminModal: !this.state.showAdiminModal
          });
        }
      });
    }
  };

  submitCreateLiveForm = data => {
    const { createLive, getLives, searchParams } = this.props;
    data['startTime'] = data['startTime'].format('X');
    data['endTime'] = data['endTime'].format('X');
    data['freeWatchTime'] = data.freeWatchTime ? 120 : 0;
    data['pubState'] = data.pubState ? 'PUBBED' : 'NOTPUB';
    data['cover'] = data['defaultCover']
      ? 'http://broker-upload-dev.oss-cn-hangzhou.aliyuncs.com/Live/Cover.jpeg'
      : data['cover'];
    createLive(data).then(res => {
      if (!res.result) {
        data['startTime'] = moment(data['startTime'] * 1000);
        data['endTime'] = moment(data['endTime'] * 1000);
        this.setState({
          formData: data
        });
        return;
      }
      Message.success(i18n['general.create_success']);
      getLives(searchParams);
      this.toggleCreateLiveModal(false);
    });
  };

  submitCreateLecturerForm = data => {
    const { getLecturers, createLecturer } = this.props;
    createLecturer(data).then(res => {
      if (!res.result) return res;
      if (res.result) {
        Message.success(i18n['general.create_success']);
        getLecturers();
        this.toggleCreateTecturerModal();
      }
    });
  };
  modifyParams = (field, data) => {
    const { modifySearchParams, searchParams } = this.props;
    const v = {};
    if (field === 'subject') {
      v['subject'] = encodeURIComponent(data.key);
    } else {
      v[field] = data;
    }
    modifySearchParams({
      ...searchParams,
      ...v,
      page: 1
    });
  };

  changeList = (e, item) => {
    const {
      getLecturerList,
      getLives,
      searchParams,
      saveListType
    } = this.props;
    if (e === 'LIVE') {
      Promise.resolve(getLives(searchParams)).then(res => {
        if (res.result) {
          saveListType(item);
        }
      });
    } else {
      Promise.resolve(getLecturerList()).then(res => {
        if (res.result) {
          saveListType(item);
        }
      });
    }
  };

  cancel = () => {
    const { updateSelectedLive } = this.props;
    updateSelectedLive([]);
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

  onFormChange = values => {
    const copyData = _.cloneDeep(values);
    if (values.startTime) {
      copyData.startTime = moment(values.startTime);
    }
    if (values.endTime) {
      copyData.endTime = moment(values.endTime);
    }
    this.setState({
      submitDisabled: !values.agreeLaw,
      formData: copyData
    });
  };

  render() {
    const {
      showCreateLiveModal,
      showCreateTecturerModal,
      formData,
      showAdiminModal,
      submitDisabled
    } = this.state;
    const {
      lecturers,
      searchParams,
      listType,
      selectedLiveIds,
      tenantRights,
      userRights,
      gotoHelpCenter
    } = this.props;
    const usedLiveFlux = (parseInt(tenantRights.usedLiveFlux) / 1024).toFixed(
      2
    );
    const liveFlux = (parseInt(tenantRights.liveFlux) / 1024).toFixed(2);
    const creatbtnDisabled = tenantRights.liveExpire
      ? usedLiveFlux / liveFlux >= 1
        ? true
        : false
      : false;
    return (
      <div className={cs['container']}>
        <div className={cs['default-container']}>
          <div className={cs['left']}>
            <Button
              type="primary"
              className={cs['tool-item']}
              onClick={this.toggleCreateLiveModal.bind(this, true)}
              disabled={creatbtnDisabled}
            >
              {i18n['video.action_bar.button_create']}
            </Button>
            <Button
              type="primary"
              className={cs['tool-item']}
              onClick={this.toggleCreateTecturerModal}
              disabled={tenantRights.liveExpire}
            >
              {i18n['video.action_bar.button_create_lecturer']}
            </Button>
            <Button
              type="primary"
              data-test="admin-button"
              className={cs['tool-item']}
              onClick={this.toggleAdminModal}
              disabled={tenantRights.liveExpire}
            >
              {i18n['video.action_bar.button_admin']}
            </Button>
            <DropdownForCode
              data={LIVE_STATE}
              className={cs['dropdown-width']}
              value={searchParams.state}
              onChange={this.modifyParams.bind(this, 'state')}
            />
            <DropdownForCode
              className={cs['dropdown-width']}
              data={PUB_TYPE}
              value={searchParams.pubState}
              onChange={this.modifyParams.bind(this, 'pubState')}
            />
            <DropdownForCode
              className={cs['dropdown-width']}
              data={LIST_TYPE}
              value={listType.value}
              onChange={this.changeList}
            />
            {selectedLiveIds.length > 0 ? (
              undefined
            ) : (
              <TypeSearch
                value={{
                  key: decodeURIComponent(searchParams.subject),
                  type: 'subject'
                }}
                options={[
                  {
                    label: i18n['video.action_bar.video_theme_name'],
                    value: 'subject'
                  }
                ]}
                onChange={this.modifyParams.bind(this, 'subject')}
              />
            )}
          </div>
          <div className={cs['progress-part']} data-test="flux-part">
            <Progress
              percent={(usedLiveFlux / liveFlux * 100).toFixed(2)}
              showInfo={false}
            />
            <div className={cs['flux-label']}>
              <div className={cs['left-flux-label']}>
                {i18n['video.header.live_usedLiveFlux']}：
              </div>
              <div
                className={
                  usedLiveFlux / liveFlux >= 1
                    ? cs['danger-right-flux-label']
                    : cs['right-flux-label']
                }
              >
                {`${usedLiveFlux}G/${liveFlux}G`}
              </div>
            </div>
          </div>
        </div>
        <Modal.Animate>
          {showCreateLiveModal && (
            <CreateLive
              onClose={this.toggleCreateLiveModal.bind(this, false)}
              submitForm={this.submitCreateLiveForm}
              lecturers={lecturers}
              initialValues={formData}
              type={'add'}
              tenantRights={tenantRights}
              hideNeedRecord={userRights.LIVE_DEMAND}
              gotoHelpCenter={gotoHelpCenter}
              onChange={this.onFormChange}
              submitDisabled={submitDisabled}
            />
          )}
          {showCreateTecturerModal && (
            <CreateLecturer
              onClose={this.toggleCreateTecturerModal}
              submitForm={this.submitCreateLecturerForm}
            />
          )}
          {showAdiminModal && (
            <AdminModal onHide={this.toggleAdminModal} {...this.props} />
          )}
        </Modal.Animate>
      </div>
    );
  }
}
