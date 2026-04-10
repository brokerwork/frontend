import AddForm from '../../containers/Addform';
import i18n from 'utils/i18n';
import { ADD_SOURCE_FORM } from './form';
import { Message, Button, Dialog } from 'lean-ui';

export default class AddModal extends PureComponent {
  onConfirm() {
    const { submitForm } = this.props;
    submitForm(ADD_SOURCE_FORM);
  }
  onSubmit(datas) {
    const { showTipsModal } = this.props;
    showTipsModal({
      content: `${
        i18n['runmgmt.source_setting.add.confirm.info']
      } <br/><br/><br/> ${i18n['runmgmt.source_setting.table.name']}:${
        datas.nickName
      }<br/>${i18n['runmgmt.source_setting.form.serverName']}:${
        datas.serverId
      }<br/>${i18n['runmgmt.source_setting.table.login']}:${datas.login}<br/>${
        i18n['runmgmt.source_setting.table.strategy']
      }:${datas.investmentStrategy || ''}`,
      trust: true,
      noCancel: true,
      header: i18n['runmgmt.source_setting.add.confirm.title'],
      onConfirm: close => {
        close();
        this.executeAddSource(datas);
      }
    });
  }

  /**
   * 执行实际的添加信号源
   * @param datas
   */
  executeAddSource = datas => {
    const {
      addSource,
      getList,
      onFormSubmit,
      searchParams,
      resetForm
    } = this.props;

    addSource(datas).then(res => {
      if (res.result) {
        Message.success(i18n['runmgmt.source_setting.add.success']);
        getList(searchParams);
        resetForm(ADD_SOURCE_FORM);
        onFormSubmit();
      }
    });
  };

  render() {
    const { onHide } = this.props;
    return (
      <Dialog
        title={i18n['runmgmt.source_setting.add']}
        visible={true}
        onCancel={onHide}
        footer={
          <Button type="primary" onClick={this.onConfirm.bind(this)}>
            {i18n['general.confirm']}
          </Button>
        }
      >
        <AddForm onSubmit={this.onSubmit.bind(this)} />
      </Dialog>
    );
  }
}
