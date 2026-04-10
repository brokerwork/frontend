import { Field, reduxForm } from 'redux-form';
import moment from 'moment';
import { DropdownForCode } from 'components/Dropdown';
import DatePicker from 'components/v2/DatePicker';
import UploadFile from 'components/v2/UploadFile';
import cs from './CreateLive.less';
import i18n from 'utils/i18n';
import Image from 'components/Image';
import { FormattedMessage } from 'react-intl';
import { Button, Progress, Dialog, Checkbox, Form } from 'lean-ui';

const ControlWrap = ({ children, error }) => (
  <Form.Control
    className={`${cs['control']} ${error ? cs['error'] : ''}`}
    errorMsg={error ? error : null}
  >
    {children}
  </Form.Control>
);

const Cover = ({ meta: { touched, error }, input }) => {
  const isError = touched && error;
  return (
    <Form.Control errorMsg={isError ? error : null}>
      <UploadFile
        {...input}
        maxHeight={348}
        maxWidth={622}
        className={`${isError ? cs['error'] : ''}`}
        itemClassName={cs['preview-image']}
      />
    </Form.Control>
  );
};

const DefaultCover = ({ defaultChecked, meta: { touched, error }, input }) => {
  const isError = touched && error;
  return (
    <Form.Control errorMsg={isError ? error : null}>
      <Image
        value="http://broker-upload-dev.oss-cn-hangzhou.aliyuncs.com/Live/Cover.jpeg"
        disabled={true}
        inline
        className={cs['image-size']}
      />
      <Checkbox
        {...input}
        inline
        defaultChecked={defaultChecked}
        className={cs['default-cover']}
      />
      <span className={cs['default-cover-div']}>
        {i18n['video.video_list.default_cover']}
      </span>
    </Form.Control>
  );
};

const Lecturer = ({ data, meta: { touched, error }, input, lecturers }) => {
  const isError = touched && error;
  return (
    <Form.Control errorMsg={isError ? error : null}>
      <DropdownForCode
        className={`${isError ? cs['error'] : ''}`}
        data={lecturers}
        {...input}
      />
    </Form.Control>
  );
};

const needRecord = ({
  data,
  meta: { touched, error },
  input,
  defaultChecked,
  tenantRights
}) => {
  const usedVideoDisk = (parseInt(tenantRights.usedVideoDisk) / 1024).toFixed(
    2
  );
  const isError = touched && error;
  const videoDisk = (parseInt(tenantRights.videoDisk) / 1024).toFixed(2);
  return (
    <Form.Control errorMsg={isError ? error : null}>
      <div className={cs['needRecord-div']}>
        <Checkbox
          {...input}
          disabled={usedVideoDisk / videoDisk >= 1}
          className={cs['needRecord-checkbox']}
          defaultChecked={defaultChecked}
        />
        <div className={cs['needRecord-yes']}>
          {i18n['video.create_live.needRecord.yes']}
        </div>
        <div className={cs['record-label']}>
          <Progress
            percent={((usedVideoDisk / videoDisk) * 100).toFixed(2)}
            showInfo={false}
          />
          <div className={cs['flux-label']}>
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
    </Form.Control>
  );
};

const PubState = ({
  data,
  meta: { touched, error },
  input,
  defaultChecked,
  disabled
}) => {
  const isError = touched && error;
  return (
    <Form.Control errorMsg={isError ? error : null}>
      <Checkbox
        {...input}
        className={`cs['initpassword'] ${isError ? cs['error'] : ''}`}
        defaultChecked={defaultChecked}
        disabled={disabled}
      />
      <span className={cs['initpassword-div']}>
        {i18n['video.video_root.pub_button']}
      </span>
    </Form.Control>
  );
};

const FreeTime = ({
  data,
  meta: { touched, error },
  input,
  defaultChecked,
  disabled
}) => {
  const isError = touched && error;
  return (
    <Form.Control errorMsg={isError ? error : null}>
      <Checkbox
        {...input}
        className={`cs['initpassword'] ${isError ? cs['error'] : ''}`}
        defaultChecked={defaultChecked}
        disabled={disabled}
      />
      <span className={cs['initpassword-div']}>
        {i18n['video.video_list.allow']} （
        {i18n['video.video_list.allow_visitor_time']}）
      </span>
    </Form.Control>
  );
};

const Disclaimer = ({
  data,
  meta: { touched, error },
  input,
  defaultChecked,
  disabled
}) => {
  const isError = touched && error;
  return (
    <Form.Control errorMsg={isError ? error : null}>
      <div className={cs['agreelaw-checkbox']}>
        <Checkbox
          {...input}
          className={`cs['initpassword'] ${isError ? cs['error'] : ''}`}
          defaultChecked={defaultChecked}
          disabled={disabled}
        />
        <span className={cs['initpassword-div']}>
          {i18n['video.live.disclaimer_read_confirm']}
        </span>
      </div>
    </Form.Control>
  );
};

const StartTime = ({ meta: { touched, error }, input }) => {
  let time = (input.value && input.value) || moment();
  if (typeof input.value === 'string') {
    time = input.value.length
      ? moment(input.value)
      : moment().add(10, 'minutes');
  }
  const isError = touched && error;
  return (
    <Form.Control errorMsg={isError ? error : null}>
      <DatePicker
        {...input}
        showTime
        value={time}
        className={`${isError ? cs['error'] : ''}`}
        format="YYYY-MM-DD HH:mm:ss"
        onChange={input.onChange}
      />
    </Form.Control>
  );
};

const EndTime = ({ meta: { touched, error }, input }) => {
  let time = (input.value && input.value) || moment();
  if (typeof input.value === 'string') {
    time = input.value.length
      ? moment(input.value)
      : moment().add(20, 'minutes');
  }
  const isError = touched && error;
  return (
    <Form.Control errorMsg={isError ? error : null}>
      <DatePicker
        {...input}
        showTime
        className={`${isError ? cs['error'] : ''}`}
        value={time}
        format="YYYY-MM-DD HH:mm:ss"
        onChange={input.onChange}
      />
    </Form.Control>
  );
};

const Subject = ({ placeholder, meta: { touched, error }, input }) => {
  const isError = touched && error;
  return (
    <Form.Control errorMsg={isError ? error : null}>
      <input
        type="text"
        {...input}
        placeholder={placeholder}
        className={`form-control ${isError ? cs['error'] : ''}`}
        maxLength={20}
      />
    </Form.Control>
  );
};

const pushUrl = ({ placeholder, meta: { touched, error }, input }) => {
  const isError = touched && error;
  return (
    <Form.Control errorMsg={isError ? error : null}>
      <input
        type="text"
        {...input}
        className={`form-control ${isError ? cs['error'] : ''}`}
        disabled
      />
    </Form.Control>
  );
};

const Description = ({ placeholder, meta: { touched, error }, input }) => {
  const isError = touched && error;
  return (
    <Form.Control errorMsg={isError ? error : null}>
      <textarea
        maxLength="100"
        placeholder={placeholder}
        {...input}
        className={`form-control ${cs['textarea']} ${
          isError ? cs['error'] : ''
        }`}
      />
    </Form.Control>
  );
};

const CreateLive = ({
  show,
  onClose,
  lecturers,
  handleSubmit,
  submitForm,
  type,
  initialValues,
  onCopy,
  hideNeedRecord,
  gotoHelpCenter,
  tenantRights,
  submitDisabled
}) => {
  return (
    <Dialog
      title={
        type === 'add'
          ? i18n['video.action_bar.button_create']
          : i18n['video.action_bar.button_edit']
      }
      className={cs['form-body']}
      visible={true}
      onCancel={onClose}
      footer={
        type === 'add'
          ? [
              <div className={`pull-left ${cs['raiders-label']}`}>
                <a href="https://obsproject.com/">
                  {i18n['video.header.OBS_download_url']}
                </a>
                {i18n['video.header.OBS']}
                <span className={cs['header-link']}>
                  <FormattedMessage
                    id="video.raiders"
                    defaultMessage={i18n['video.header.Raiders']}
                    values={{
                      viewLink: (
                        <a href="javascript:;" onClick={gotoHelpCenter}>
                          {i18n['video.header.view_link']}
                        </a>
                      )
                    }}
                  />
                </span>
              </div>,
              <Button
                type="primary"
                disabled={submitDisabled}
                onClick={handleSubmit(submitForm)}
              >
                {i18n['general.apply']}
              </Button>,
              <Button onClick={onClose}>{i18n['general.cancel']}</Button>
            ]
          : type === 'edit' && initialValues.state === 'NOTSTART'
            ? [
                <div className={`pull-left ${cs['raiders-label']}`}>
                  <a href="https://obsproject.com/">
                    {i18n['video.header.OBS_download_url']}
                  </a>
                  {i18n['video.header.OBS']}
                  <span className={cs['header-link']}>
                    <FormattedMessage
                      id="video.raiders"
                      defaultMessage={i18n['video.header.Raiders']}
                      values={{
                        viewLink: (
                          <a href="javascript:;" onClick={gotoHelpCenter}>
                            {i18n['video.header.view_link']}
                          </a>
                        )
                      }}
                    />
                  </span>
                </div>,
                <Button
                  type="primary"
                  disabled={submitDisabled}
                  onClick={handleSubmit(submitForm)}
                >
                  {i18n['general.apply']}
                </Button>,
                <Button onClick={onClose}>{i18n['general.cancel']}</Button>
              ]
            : [
                <div className={`pull-left ${cs['raiders-label']}`}>
                  <a href="https://obsproject.com/">
                    {i18n['video.header.OBS_download_url']}
                  </a>
                  {i18n['video.header.OBS']}
                  <span className={cs['header-link']}>
                    <FormattedMessage
                      id="video.raiders"
                      defaultMessage={i18n['video.header.Raiders']}
                      values={{
                        viewLink: (
                          <a href="javascript:;" onClick={gotoHelpCenter}>
                            {i18n['video.header.view_link']}
                          </a>
                        )
                      }}
                    />
                  </span>
                </div>,
                <Button onClick={onClose}>{i18n['general.cancel']}</Button>
              ]
      }
    >
      <Form.Item required>
        <Form.Label>{i18n['video.create_live.theme']}:</Form.Label>
        <Field
          component={Subject}
          name="subject"
          placeholder={i18n['video.live.long_place_holder']}
        />
      </Form.Item>
      <Form.Item required>
        <Form.Label>
          {i18n['video.create_live.cover']}
          :(
          {`${i18n['upload_file.size_tips']}622*348`})
        </Form.Label>
        <Form.Control className={cs['cover-content']}>
          <Field component={Cover} name="cover" />
          <Field
            component={DefaultCover}
            name="defaultCover"
            defaultChecked={initialValues.defaultCover}
          />
        </Form.Control>
      </Form.Item>
      <Form.Item>
        <Form.Label>{i18n['video.create_live.lecturer']}:</Form.Label>
        <Field component={Lecturer} name="lecturerId" lecturers={lecturers} />
      </Form.Item>
      <Form.Item required>
        <Form.Label>{i18n['video.create_live.time']}:</Form.Label>
        <Field component={StartTime} name="startTime" />
      </Form.Item>
      <Form.Item required>
        <Form.Label>{i18n['video.create_live.end_time']}:</Form.Label>
        <Field component={EndTime} name="endTime" />
      </Form.Item>
      <Form.Item required>
        <Form.Label>{i18n['video.create_live.desc']}:</Form.Label>
        <Field
          component={Description}
          name="description"
          placeholder={i18n['video.live.desc_place_holder']}
        />
      </Form.Item>
      {hideNeedRecord ? (
        <Form.Item>
          <Form.Label>{i18n['video.create_live.needRecord']}:</Form.Label>
          <Field
            component={needRecord}
            name="needRecord"
            tenantRights={tenantRights}
            defaultChecked={type === 'edit' ? initialValues.needRecord : false}
          />
        </Form.Item>
      ) : (
        undefined
      )}
      <Form.Item>
        <Form.Label className={cs['label']}>
          {i18n['video.video_root.series_pub']}:
        </Form.Label>
        <Field
          component={PubState}
          name="pubState"
          defaultChecked={
            type === 'edit' ? initialValues.pubState === 'PUBBED' : false
          }
          disabled={!!(type === 'edit' && initialValues.pubState === 'PUBBED')}
        />
      </Form.Item>
      <Form.Item>
        <Form.Label className={cs['label']}>
          {i18n['video.video_list.allow_visitor']}:
        </Form.Label>
        <Field
          component={FreeTime}
          name="freeWatchTime"
          defaultChecked={initialValues.freeWatchTime && type === 'edit'}
        />
      </Form.Item>
      <Form.Item>
        <div className={'required'}>{i18n['video.live.disclaimer']}</div>
      </Form.Item>
      <Form.Item>
        <Field
          component={Disclaimer}
          name="agreeLaw"
          defaultChecked={initialValues.agreeLaw || false}
        />
      </Form.Item>
    </Dialog>
  );
};

export default reduxForm({
  form: 'createLiveForm',
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
    if (!values.cover && !values.defaultCover) {
      errors['cover'] = i18n['video.live.cover_tips'];
    }
    if (!values.startTime) {
      errors['startTime'] = i18n['video.live.time_tips'];
    }
    if (!values.endTime) {
      errors['endTime'] = i18n['video.video_root.end_date_tips'];
    }
    if (
      moment(values.startTime).isBefore(
        moment(values.createTime * 1000),
        'minutes'
      )
    ) {
      errors['startTime'] = i18n['video.video_root.time_start_tips'];
    }
    if (moment(values.startTime).isBefore(moment(), 'minutes')) {
      errors['startTime'] = i18n['video.video_root.time_now_tips'];
    }
    if (moment(values.endTime).isSame(moment(values.startTime), 'minutes')) {
      errors['endTime'] = i18n['video.video_root.time_end_same_tips'];
    }
    if (moment(values.endTime).isBefore(moment(values.startTime), 'minutes')) {
      errors['endTime'] = i18n['video.video_root.time_end_tips'];
    }
    if (!values.description || values.description.length === 0) {
      errors['description'] = i18n['video.live.desc_tips'];
    }
    return errors;
  }
})(CreateLive);
