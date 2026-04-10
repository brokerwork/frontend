import i18n from 'utils/i18n';
import Dropdown from 'components/v2/Dropdown';
import { Dialog, Button, Popover, Icon, Form, Tooltip } from 'lean-ui';
const { Item, Label, Control } = Form;

import cs from './EditRoleModal.less';

export const parseDropdownData = data => {
  const copyData = data.concat();
  return copyData.map(_data => {
    return {
      label: _data['name'] || _data['typeName'],
      value: _data['id']
    };
  });
};

export default class EditRoleModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      editedRole: this.props.currentRole,
      nameRequired: false,
      parentRequired: false,
      roleTypeRequired: false
    };
  }

  onSave = () => {
    const { onSave, currentRole } = this.props;
    const { editedRole } = this.state;
    let copyData = {
      id: editedRole.id,
      comment: editedRole.comment,
      entityNo: editedRole.entityNo,
      name: editedRole.name,
      roleTypeId: editedRole.roleTypeId,
      rightIds: editedRole.rights
    };
    let parentId = editedRole.parentId;
    if (!editedRole.parentId) {
      this.setState({
        parentRequired: true
      });
    } else if (!editedRole.roleTypeId) {
      this.setState({
        roleTypeRequired: true
      });
    } else if (!editedRole.name) {
      this.setState({
        nameRequired: true
      });
    } else {
      onSave(copyData, parentId);
    }
  };

  onHide = () => {
    const { onHide } = this.props;
    onHide();
  };

  onRoleSelect = selected => {
    const { editedRole } = this.state;
    let copyData = Object.assign({}, editedRole);
    copyData.parentId = selected.value;
    this.setState({
      editedRole: copyData,
      parentRequired: false
    });
  };

  onRoleTypeSelect = selected => {
    const { editedRole } = this.state;
    let copyData = Object.assign({}, editedRole);
    copyData.roleTypeId = selected.value;
    this.setState({
      editedRole: copyData,
      roleTypeRequired: false
    });
  };

  setName = evt => {
    const { editedRole } = this.state;
    let copyData = Object.assign({}, editedRole);
    copyData.name = evt.target.value;
    this.setState({
      editedRole: copyData,
      nameRequired: false
    });
  };

  setEntityNo = evt => {
    const { editedRole } = this.state;
    let copyData = Object.assign({}, editedRole);
    copyData.entityNo = evt.target.value;
    this.setState({
      editedRole: copyData
    });
  };

  setComment = evt => {
    const { editedRole } = this.state;
    let copyData = Object.assign({}, editedRole);
    copyData.comment = evt.target.value;
    this.setState({
      editedRole: copyData
    });
  };

  renderForm = () => {
    const { roleOption, currentRole, roleTypes } = this.props;
    const {
      editedRole,
      nameRequired,
      parentRequired,
      roleTypeRequired
    } = this.state;
    const roleOptions = parseDropdownData(roleOption);
    const selectParent = roleOptions.find(
      item => item.value === editedRole.parentId
    );
    const formatedRoleTypes = parseDropdownData(roleTypes);
    const selectedRoleType = formatedRoleTypes.find(
      role => role.value === editedRole.roleTypeId
    );
    return (
      <Form className={cs.form}>
        <Item
          required
          col={2}
          errorMsg={
            parentRequired && i18n['settings.role_setting.parent_tints']
          }
        >
          <Label>{i18n['settings.role_setting.default_parent_option']}</Label>
          <Control>
            <Dropdown
              className={cs.fillWidth}
              data={roleOptions}
              value={selectParent}
              onSelect={this.onRoleSelect}
            />
          </Control>
        </Item>
        <Item
          required
          col={2}
          errorMsg={
            roleTypeRequired && i18n['settings.role_setting.required.role_type']
          }
        >
          <Label>
            {i18n['settings.role_setting.role_type']}
            <Tooltip
              placement="right"
              trigger="click"
              title={
                <div className={cs['tips-content']}>
                  {i18n['settings.role_setting.role_type_name.tip']}
                </div>
              }
            >
              <span style={{ marginLeft: '10px' }}>
                <Icon icon="question" className={cs['icon']} />
              </span>
            </Tooltip>
          </Label>
          <Control>
            <div className={cs.itemWrapper}>
              <Dropdown
                className={cs.fillWidth}
                data={formatedRoleTypes}
                value={selectedRoleType}
                onSelect={this.onRoleTypeSelect}
              />
            </div>
          </Control>
        </Item>
        <Item
          required
          col={2}
          errorMsg={nameRequired && i18n['settings.role_setting.error_tints']}
        >
          <Label>{i18n['settings.role_setting.role_name']}</Label>
          <Control>
            <input
              type="text"
              className={`form-control ${nameRequired ? cs['error'] : ''}`}
              value={editedRole.name}
              maxLength={100}
              placeholder={i18n['settings.role_setting.role_length']}
              onChange={this.setName}
            />
          </Control>
        </Item>
        <Item col={2}>
          <Label>{i18n['settings.role_setting.role_no']}</Label>
          <Control>
            <input
              type="text"
              className={`form-control ${cs['input']}`}
              value={editedRole.entityNo}
              maxLength={100}
              placeholder={i18n['settings.role_setting.role_length']}
              onChange={this.setEntityNo}
            />
          </Control>
        </Item>
        <Item col={1}>
          <Label>{i18n['settings.role_setting.role_description']}</Label>
          <Control>
            <input
              type="text"
              className={`form-control ${cs['input']}`}
              value={editedRole.comment}
              maxLength={100}
              placeholder={i18n['settings.role_setting.role_length']}
              onChange={this.setComment}
            />
          </Control>
        </Item>
      </Form>
    );
  };

  render() {
    const { show, onHide } = this.props;
    return (
      <Dialog
        onCancel={onHide}
        visible={show}
        title={i18n['settings.role_setting.edit_user']}
        width={700}
        footer={
          <div>
            <Button onClick={this.onHide}>{i18n['general.cancel']}</Button>
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
