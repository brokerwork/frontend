import { Field, reduxForm } from 'redux-form';
import UploadFile from 'components/v2/UploadFile';
import cs from '../CreateLive/CreateLive.less';
import i18n from 'utils/i18n';
import { Dialog, Form, Input } from 'lean-ui';

const Picture = ({ meta: { touched, error }, input }) => {
  const isError = touched && error;
  return (
    <Form.Control errorMsg={isError ? error : null}>
      <UploadFile {...input} maxHeight={150} maxWidth={150} />
    </Form.Control>
  );
};

const Lecturer = ({ data, placeholder, meta: { touched, error }, input }) => {
  const isError = touched && error;
  return (
    <Form.Control errorMsg={isError ? error : null}>
      <Input
        type="text"
        {...input}
        className={`form-control ${isError ? cs['error'] : ''}`}
        placeholder={placeholder}
        maxLength={10}
      />
    </Form.Control>
  );
};

const Description = ({ meta: { touched, error }, input }) => {
  const isError = touched && error;
  return (
    <Form.Control errorMsg={isError ? error : null}>
      <Input.TextArea
        maxLength="100"
        {...input}
        className={`form-control ${cs['textarea']} ${
          isError ? cs['error'] : ''
        }`}
      />
    </Form.Control>
  );
};

const CreateLecturer = ({ show, onClose, handleSubmit, submitForm }) => (
  <Dialog
    title={i18n['video.action_bar.button_create_lecturer']}
    visible={true}
    onCancel={onClose}
    okText={i18n['general.apply']}
    onOk={handleSubmit(submitForm)}
    cancelText={i18n['general.cancel']}
  >
    <Form.Item required>
      <Form.Label>{i18n['video.create_lecturer.name']}:</Form.Label>
      <Field
        component={Lecturer}
        name="name"
        placeholder={i18n['video.create_lecturer.name_place_holder']}
      />
    </Form.Item>
    <Form.Item required>
      <Form.Label>
        {i18n['video.create_lecturer.header']}
        :(
        {`${i18n['upload_file.size_tips']}150*150`})
      </Form.Label>
      <Field component={Picture} name="picture" />
    </Form.Item>
    <Form.Item required>
      <Form.Label>{i18n['video.create_lecturer.desc']}:</Form.Label>
      <Field component={Description} name="description" />
    </Form.Item>
  </Dialog>
);

export default reduxForm({
  form: 'createLecturerForm',
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
    if (!values.picture) {
      errors['picture'] = i18n['video.create_lecturer.header_tips'];
    }
    if (!values.description) {
      errors['description'] = i18n['video.create_lecturer.desc_tips'];
    }
    if (
      !values.name ||
      !values.name.match(/[\u4e00-\u9fa5_a-zA-Z0-9_]{2,10}/)
    ) {
      errors['name'] = i18n['video.create_lecturer.name_tips'];
    }
    return errors;
  }
})(CreateLecturer);
