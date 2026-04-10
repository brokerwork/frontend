import Modal from 'components/Modal';
import Button from 'components/Button';
import i18n from 'utils/i18n';
import AccountForm, { TRADER_ACCOUNT_MANAGE_FORM } from '../AccountForm';
import { transInitValues, transSubmitData } from '../../utils';
import _ from 'lodash';
import { getTenantId } from 'utils/tenantInfo';

export default class CreateOrEdit extends PureComponent {
  constructor(props) {
    super(props);
  }
  onSave = () => {
    const { submitForm } = this.props;
    submitForm(TRADER_ACCOUNT_MANAGE_FORM);
  };
  onClose = () => {
    this.props.onClose();
  };
  onSubmit = values => {
    const { accountTypeConfig, updateAccountTypeConfig, getAccountTypeConfig, eidtIndex, showTopAlert } = this.props;
    let copyData = _.cloneDeep(values);
    const copyPostData = _.cloneDeep(accountTypeConfig);
    const accountTypeInfos = _.get(copyPostData, 'accountTypeInfos', []);
    //处理提交Form数据
    copyData = transSubmitData(copyData);
    // 区分是新增或编辑
    if (copyData.customerAccountType) {
      //编辑
      accountTypeInfos[eidtIndex] = copyData;
    } else {
      accountTypeInfos.push(copyData);
    }
    updateAccountTypeConfig(copyPostData).then(res => {
      if (res.result) {
        showTopAlert({
          style: 'success',
          content: i18n['general.operate_success']
        });
        const tenantId = getTenantId();
        getAccountTypeConfig(tenantId);
        this.onClose();
      }
    });
  };
  render() {
    const {
      languages,
      eidtIndex,
      accountTypeConfig: { accountTypeInfos }
    } = this.props;
    const isEdit = eidtIndex || eidtIndex === 0 ? true : false;
    return (
      <Modal onClose={this.onClose} size="lg">
        <Modal.Header>
          {isEdit ? i18n['trader.account.manage.edit.title'] : i18n['trader.account.manage.add.title']}
        </Modal.Header>
        <Modal.Body>
          <AccountForm
            languages={languages}
            onSubmit={this.onSubmit}
            isEdit={isEdit}
            initialValues={isEdit ? transInitValues(accountTypeInfos[eidtIndex]) : { accountCategory: 'Individual' }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button style="primary" onClick={this.onSave}>
            {i18n['general.save']}
          </Button>
          <Button onClick={this.onClose}> {i18n['general.cancel']}</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
