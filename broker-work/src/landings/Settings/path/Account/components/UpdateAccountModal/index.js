import { Dialog, Button, Form } from 'lean-ui';
import i18n from 'utils/i18n';
import cs from './UpdateAccountModal.less';
const { Item, Label, Control } = Form;

export default class UpdateAccountModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      newGroup: this.props.modaltype === 'edit' ? this.props.currentGroup : {},
      nameRequired: false
    };
  }

  onSave = () => {
    const { newGroup } = this.state;
    const { onSave, modaltype } = this.props;
    if (!newGroup['groupName']) {
      this.setState({
        nameRequired: true
      });
      return;
    }
    onSave(modaltype, newGroup);
  };

  setName = e => {
    const { newGroup } = this.state;
    let copyData = Object.assign({}, newGroup);
    const v = e.target.value;
    copyData.groupName = v;
    if (!v) {
      this.setState({
        newGroup: copyData,
        nameRequired: true
      });
      return;
    }
    this.setState({
      newGroup: copyData,
      nameRequired: false
    });
  };

  renderForm = () => {
    const { nameRequired, newGroup } = this.state;
    return (
      <Form>
        <Item
          required
          col={1}
          errorMsg={
            nameRequired ? i18n['settings.role_setting.error_tints'] : ''
          }
        >
          <Label>{i18n['settings.account_group_setting.group_name']} : </Label>
          <Control>
            <input
              type="text"
              className={`form-control ${nameRequired ? cs['error'] : ''}`}
              maxLength="40"
              value={newGroup.groupName}
              onChange={this.setName}
            />
          </Control>
        </Item>
      </Form>
    );
  };

  render() {
    const { modaltype, onHide } = this.props;
    return (
      <Dialog
        visible={true}
        className={cs.modalBody}
        title={
          modaltype === 'edit'
            ? i18n['settings.account_group_setting.edit_group_title']
            : i18n['settings.account_group_setting.add_group_title']
        }
        onCancel={onHide}
        footer={
          <div>
            <Button type="default" onClick={onHide}>
              {i18n['general.cancel']}
            </Button>
            <Button type="primary" onClick={this.onSave}>
              {i18n['general.confirm']}
            </Button>
          </div>
        }
      >
        {this.renderForm()}
      </Dialog>
    );
  }
}
