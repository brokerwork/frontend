import i18n from 'utils/i18n';
import { Input, Dialog, Button, Icon, Form } from 'lean-ui';
import AddForm, { BLACK_LIST_ADD_FORM } from './form';
import _ from 'lodash';
import { SubmissionError } from 'redux-form';
import { isEmail, isPhone } from 'utils/validate';

export default class AddModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      idTypeReady: false,
      defaultIdType: ''
    };
  }
  componentDidMount() {
    const { getIdType } = this.props;
    getIdType().then(({ result, data }) => {
      const defaultItem = _.find(data, { isDefault: true });
      this.setState({
        idTypeReady: true,
        defaultIdType: defaultItem ? defaultItem.value : ''
      });
    });
  }
  onSave = () => {
    const { submitForm } = this.props;
    submitForm(BLACK_LIST_ADD_FORM);
  };
  onSubmit = datas => {
    const {
      addBlackList,
      onHide,
      getBlackList,
      pageParam,
      updateBlackList,
      initData
    } = this.props;
    const isEdit=!!initData;
    let errors = {};
    if (!datas.reasons || !datas.reasons.length) {
      errors.reasons = i18n['settings.black_list.require'];
    }
    if (!datas.restrictions || !datas.restrictions.length) {
      errors.restrictions = i18n['settings.black_list.require'];
    }
    if (!isEdit) {
      if (datas.isTaUser) {
        if (!datas.pubUserId) {
          errors.pubUserId = i18n['settings.black_list.require'];
        }
      } else {
        if (!datas.phone && !datas.email && !datas.idNum) {
          errors.phone = i18n['settings.black_list.require_info'];
        }
        if (datas.phone && !isPhone(datas.phone.phone)) {
          errors.phone = i18n['settings.black_list.lint'];
        }
        if (datas.email && !isEmail(datas.email)) {
          errors.email = i18n['settings.black_list.lint'];
        }
      }
    }

    if (Object.keys(errors).length) {
      throw new SubmissionError(errors);
    }
    // 验证通过的
    if (!isEdit) {
      const submitData = {
        isTaUser: datas.isTaUser,
        reasons: datas.reasons,
        restrictions: datas.restrictions
      };
      let endData = {};
      if (datas.isTaUser) {
        endData = {
          ...submitData,
          pubUserId: datas.pubUserId.value
        };
      } else {
        const copyData = _.cloneDeep(datas);
        if (copyData.pubUserId) {
          delete copyData.pubUserId;
        }
        if (copyData.phone) {
          copyData.countryCode = copyData.phone.countryCode;
          copyData.phone = copyData.phone.phone;
        }
        endData = copyData;
      }
      addBlackList(endData).then(({ result }) => {
        if (result) {
          onHide();
          getBlackList(pageParam);
        }
      });
    } else {
      const submitData = _.pick(datas, ['reasons', 'restrictions', 'pubUserId']);
      updateBlackList(submitData).then(({ result }) => {
        if (result) {
          onHide();
          getBlackList(pageParam);
        }
      });
    }
  };
  render() {
    const { show, onHide, idTypes, initData } = this.props;
    const { idTypeReady, defaultIdType } = this.state;
    return (
      <Dialog
        visible={show}
        onCancel={onHide}
        title={!!initData ? i18n['settings.black_list.edit_user'] : i18n['settings.black_list.add_user']}
        width={700}
        footer={
          <div>
            <Button type="default" onClick={onHide}>
              {i18n['general.cancel']}
            </Button>
            <Button
              type="primary"
              className="btn btn-primary"
              onClick={this.onSave}
            >
              {i18n['general.confirm']}
            </Button>
          </div>
        }
      >
        {idTypeReady ? (
          <AddForm
            onSubmit={this.onSubmit}
            idTypes={idTypes}
            isEdit={!!initData}
            initialValues={
              initData
                ? initData
                : {
                    isTaUser: true,
                    idType: defaultIdType
                  }
            }
          />
        ) : null}
      </Dialog>
    );
  }
}
