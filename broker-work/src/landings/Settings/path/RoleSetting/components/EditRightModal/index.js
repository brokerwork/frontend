import i18n from 'utils/i18n';
import { Dialog, Button } from 'lean-ui';
import { get } from 'utils/ajax';
import cs from './EditRightModal.less';
import SelectTree from 'components/v2/SelectTree';

export default class EditRightModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      rights: this.props.currentRole.rights
    };
  }

  onSave = () => {
    const { currentRole, onSave } = this.props;
    const { rights } = this.state;
    let copyData = {
      id: currentRole.id,
      comment: currentRole.comment,
      entityNo: currentRole.entityNo,
      name: currentRole.name,
      rightIds: rights,
      roleTypeId: currentRole.roleTypeId
    };
    onSave(copyData);
  };

  onHide = () => {
    const { onHide } = this.props;
    onHide();
  };

  getRight = v => {
    this.setState({
      rights: v
    });
  };

  render() {
    const {
      show,
      onHide,
      data,
      parentRights,
      currentRole: { name },
      tips,
      onTipsClick
    } = this.props;
    // 前端屏蔽SupportCenter
    let filterData = data.filter(el => {
      return el.entityNo !== 'SUPPORT';
    });
    const { rights } = this.state;
    return (
      <Dialog
        className={cs.dialog}
        visible={show}
        onCancel={onHide}
        width={700}
        title={`${i18n['settings.role_setting.edit_user']} （${name}）`}
        footer={
          <div>
            <Button onClick={this.onHide}>{i18n['general.cancel']}</Button>
            <Button type="primary" onClick={this.onSave}>
              {i18n['general.confirm']}
            </Button>
          </div>
        }
      >
        <SelectTree
          onChange={this.getRight}
          selected={rights}
          data={filterData}
          safeData={parentRights}
          tips={tips}
          onTipsClick={onTipsClick}
          unsafeNotice={
            i18n[
              'settings.role_setting.rights_check.greater_than_parent_notice'
            ]
          }
        />
      </Dialog>
    );
  }
}
