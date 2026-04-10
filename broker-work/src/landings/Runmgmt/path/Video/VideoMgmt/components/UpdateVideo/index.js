import { Field, reduxForm } from 'redux-form';
import DropdownForCode from 'components/v2/DropdownForCode';
import UploadFile from 'components/v2/UploadFile';
import cs from './UpdateVideo.less';
import i18n from 'utils/i18n';
import { UPLOAD_TYPE } from '../../../constants';
import UploadVideo from '../../containers/UploadVideo';
import { Button, Dialog, Form, Checkbox } from 'lean-ui';

const ControlWrap = ({ children, error }) => (
  <Form.Control className={cs['control']} error={error}>
    {children}
  </Form.Control>
);

const Cover = ({ meta: { touched, error }, input }) => (
  <ControlWrap error={touched && error}>
    <UploadFile {...input} maxHeight={348} maxWidth={622} />
  </ControlWrap>
);

const Lecturer = ({ data, meta: { touched, error }, input, lecturers }) => (
  <ControlWrap error={touched && error}>
    <DropdownForCode data={lecturers} {...input} />
  </ControlWrap>
);

const Disclaimer = ({
  data,
  meta: { touched, error },
  input,
  defaultChecked,
  disabled,
  onChange
}) => (
  <ControlWrap error={touched && error}>
    <div>
      <Checkbox
        {...input}
        className={cs['initpassword']}
        defaultChecked={defaultChecked}
        disabled={disabled}
        onChange={
          onChange ? onChange.bind(this, input.onChange) : input.onChange
        }
        children={i18n['video.live.disclaimer_read_confirm']}
      />
    </div>
  </ControlWrap>
);

const UploadType = ({
  data,
  meta: { touched, error },
  input,
  onSelect,
  disabled
}) => (
  <ControlWrap error={touched && error}>
    <DropdownForCode
      data={UPLOAD_TYPE}
      {...input}
      disabled={disabled}
      onChange={onSelect ? onSelect.bind(this, input.onChange) : input.onChange}
    />
  </ControlWrap>
);

const Subject = ({ placeholder, meta: { touched, error }, input }) => (
  <ControlWrap error={touched && error}>
    <input
      type="text"
      {...input}
      placeholder={placeholder}
      className="form-control"
      maxLength={20}
    />
  </ControlWrap>
);

const Description = ({ placeholder, meta: { touched, error }, input }) => (
  <ControlWrap error={touched && error}>
    <textarea
      maxLength="100"
      placeholder={placeholder}
      {...input}
      className={`form-control ${cs['textarea']}`}
    />
  </ControlWrap>
);

const PubState = ({
  data,
  meta: { touched, error },
  input,
  defaultChecked,
  disabled
}) => (
  <ControlWrap error={touched && error}>
    <Checkbox
      {...input}
      className={cs['initpassword']}
      defaultChecked={defaultChecked}
      disabled={disabled}
    />
    <span className={cs['initpassword-div']}>
      {i18n['video.video_root.pub_button']}
    </span>
  </ControlWrap>
);

class UpdateVideo extends PureComponent {
  constructor(props) {
    const { type, sourceType, initialValues } = props;
    super(props);
    this.state = {
      showVideo: type === 'edit' ? sourceType === 'UPLOAD' : false,
      clearRecycleList: false,
      uploading: false,
      agreelaw: type === 'add' ? false : initialValues && initialValues.agreeLaw
    };
  }

  onTypeSelect = (onChange, e) => {
    const { change, getVideoRecordRecycle } = this.props;
    change('sourceType', e);
    let clearRecycleList = e === 'Live';
    if (e === 'LIVE') {
      Promise.resolve(getVideoRecordRecycle({ page: 1, size: 500 })).then(
        res => {
          if (res.result) {
            this.setState({
              showVideo: e === 'Live',
              clearRecycleList: !clearRecycleList
            });
          }
        }
      );
    } else {
      this.setState({
        showVideo: e,
        clearRecycleList: !clearRecycleList
      });
    }
  };
  onAgreeSelect = (onChange, e) => {
    const { agreelaw, uploading } = this.state;
    this.setState({
      agreelaw: e
    });
  };
  // 当正在上传视频或免责声明没有同意的话暂时禁用提交按钮
  uploading = uploading => {
    this.setState({
      uploading
    });
  };

  render() {
    const {
      show,
      onClose,
      lecturers,
      handleSubmit,
      submitForm,
      videoRecycles,
      currenVideos,
      type,
      initialValues
    } = this.props;
    const { showVideo, clearRecycleList, agreelaw, uploading } = this.state;
    const disabledSubmitBtn = !(agreelaw && !uploading);
    return (
      <Dialog
        title={i18n['video.video_list.header']}
        visible={true}
        onCancel={onClose}
        footer={
          <div>
            <Button
              type="primary"
              disabled={disabledSubmitBtn}
              onClick={handleSubmit(submitForm)}
            >
              {i18n['general.apply']}
            </Button>
            <Button onClick={onClose}>{i18n['general.cancel']}</Button>
          </div>
        }
      >
        <div className={cs['form-body']}>
          <Form.Item required>
            <Form.Label>{i18n['video.video_root.series_header']}:</Form.Label>
            <Field
              component={Subject}
              name="subject"
              placeholder={i18n['video.live.long_place_holder']}
            />
          </Form.Item>
          <Form.Item required>
            <Form.Label>
              {i18n['video.video_root.series_cover']}:({`${
                i18n['upload_file.size_tips']
              }622*348`})
            </Form.Label>
            <Field component={Cover} name="cover" />
          </Form.Item>
          <Form.Item required>
            <Form.Label>{i18n['video.create_live.lecturer']}:</Form.Label>
            <Field
              component={Lecturer}
              name="lecturerId"
              lecturers={lecturers}
            />
          </Form.Item>
          <Form.Item required>
            <Form.Label>{i18n['video.video_root.series_desc']}:</Form.Label>
            <Field
              component={Description}
              name="description"
              placeholder={i18n['video.live.desc_place_holder']}
            />
          </Form.Item>
          <Form.Item required>
            <Form.Label>{i18n['video.video_root.series_type']}:</Form.Label>
            <Field
              component={UploadType}
              name="sourceType"
              disabled={type === 'edit'}
              onSelect={this.onTypeSelect}
            />
          </Form.Item>
          <Form.Item>
            <Form.Label>{i18n['video.video_root.series_pub']}:</Form.Label>
            <Field
              component={PubState}
              name="pubState"
              defaultChecked={
                type === 'edit' ? initialValues.pubState === 'PUBBED' : false
              }
              disabled={
                !!(type === 'edit' && initialValues.pubState === 'PUBBED')
              }
            />
          </Form.Item>
          <Form.Item>
            <UploadVideo
              data={currenVideos}
              type={type}
              videoRecycles={videoRecycles || []}
              uploading={this.uploading}
              showVideo={
                type === 'edit'
                  ? initialValues.sourceType === 'UPLOAD'
                  : showVideo
              }
              replayList={type === 'edit' ? initialValues.replayList : []}
              clearRecycleList={clearRecycleList}
            />
          </Form.Item>
          <Form.Item>
            <div className={`required ${cs['disclaimer-label']}`}>
              {i18n['video.live.disclaimer']}
            </div>
          </Form.Item>
          <Form.Item>
            <Field
              component={Disclaimer}
              name="agreeLaw"
              defaultChecked={type === 'edit' ? initialValues.agreeLaw : false}
              onChange={this.onAgreeSelect}
            />
          </Form.Item>
        </div>
      </Dialog>
    );
  }
}

export default reduxForm({
  form: 'updateVideoForm',
  onSubmitFail: errors => {
    setTimeout(() => {
      let errorDom = document
        .querySelectorAll('[class*=error]')[0]
        .querySelector('input');
      errorDom
        ? errorDom.focus()
        : document.querySelectorAll('[class*=error]')[0].focus();
    }, 0);
  },
  validate: values => {
    const errors = {};
    if (
      !values.subject ||
      !values.subject.match(/[\u4e00-\u9fa5_a-zA-Z0-9_]{5,20}/)
    ) {
      errors['subject'] = i18n['video.live.long_tips'];
    }
    if (!values.cover) {
      errors['cover'] = i18n['video.live.cover_tips'];
    }
    if (!values.startTime) {
      errors['startTime'] = i18n['video.live.time_tips'];
    }
    if (!values.description || values.description.length === 0) {
      errors['description'] = i18n['video.live.desc_tips'];
    }
    if (!values.lecturerId) {
      errors['lecturerId'] = i18n['video.live.lecturer_tips'];
    }
    return errors;
  }
})(UpdateVideo);
