import Modal from 'components/Modal';
import i18n from 'utils/i18n';
import Button from 'components/Button';
import cs from './index.less';
import PlatformForm, { PLATFORM_FORM } from '../Forms/Platform';
import _ from 'lodash';

export default class AddPlatformModal extends PureComponent {
  isEdit = false;

  constructor(props) {
    super(props);

    this.isEdit = this.checkEdit();
  }

  onClickSubmit = () => {
    const { submitForm } = this.props;
    submitForm(PLATFORM_FORM);
  };

  onSubmit = data => {
    return data;
  };

  onSubmitSuccess = data => {
    const {
      editingPlatform,
      showTopAlert,
      setPlatform,
      getList,
      onClose,
      getCustomPlatformMenus,
      list = []
    } = this.props;

    const requestData = { ...data };

    if (this.isEdit) {
      //编辑平台信息
      requestData.id = editingPlatform.id;
      requestData.vendor = editingPlatform.vendor;
    } else {
      const num = _.get(list, 'length', 0);
      requestData.vendor = `CUSTOM${list.length + 1}`;
    }
    setPlatform(requestData).then(res => {
      const { result } = res;
      if (result) {
        showTopAlert({
          style: 'success',
          content: i18n['general.save_success']
        });

        getList();
        getCustomPlatformMenus();
        onClose();
      }
    });
  };

  /**
   * 判断是否是编辑状态
   * @return {boolean|*}
   */
  checkEdit = () => {
    const { editingPlatform } = this.props;
    return !!editingPlatform && editingPlatform.id;
  };

  render() {
    const { onClose, editingPlatform } = this.props;

    return (
      <Modal onClose={onClose}>
        <Modal.Header>{i18n['trader.customPlatform.add']}</Modal.Header>
        <Modal.Body>
          <PlatformForm
            initialValues={editingPlatform}
            onSubmit={this.onSubmit}
            onSubmitSuccess={this.onSubmitSuccess}
            isEdit={this.isEdit}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button style="primary" onClick={this.onClickSubmit}>
            {i18n['general.apply']}
          </Button>
          <Button onClick={onClose}>{i18n['general.cancel']}</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
