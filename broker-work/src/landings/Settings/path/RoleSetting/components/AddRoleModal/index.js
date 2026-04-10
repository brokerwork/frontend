import i18n from 'utils/i18n';
import cs from './AddRoleModal.less';
import Dropdown from 'components/v2/Dropdown';
import { Input, Dialog, Button, Icon, Form, Tooltip } from 'lean-ui';
const { Item, Label, Control } = Form;
import SelectTree from 'components/v2/SelectTree';
import { parseDropdownData } from '../EditRoleModal';

export default class AddRoleModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      newRole: {},
      showNextStep: this.props.showNext,
      rights: [],
      nameRequired: false,
      parentRequired: false,
      roleTypeRequired: false
    };
  }

  onSave = () => {
    const { onSave } = this.props;
    const { newRole, rights } = this.state;
    let copyData = {
      comment: newRole.comment,
      entityNo: newRole.entityNo,
      name: newRole.name,
      rightIds: rights,
      roleTypeId: newRole.roleTypeId,
      id: 0
    };
    onSave(copyData, newRole.parentId);
  };

  showNext = () => {
    const { newRole } = this.state;
    const { checkParentChild } = this.props;
    if (!newRole.parentId) {
      this.setState({
        parentRequired: true,
        showNextStep: false
      });
    } else if (!newRole.roleTypeId) {
      this.setState({
        roleTypeRequired: true,
        showNextStep: false
      });
    } else if (!newRole.name) {
      this.setState({
        nameRequired: true,
        showNextStep: false
      });
    } else {
      checkParentChild(newRole.parentId).then(() => {
        this.setState({
          nameRequired: false,
          showNextStep: true
        });
      });
    }
  };

  showPrev = () => {
    this.setState({
      showNextStep: false
    });
  };

  onHide = () => {
    const { onHide } = this.props;
    this.setState({
      showNextStep: false
    });
    onHide();
  };

  getRight = v => {
    this.setState({
      rights: v
    });
  };

  onRoleSelect = selected => {
    const { newRole } = this.state;
    let copyData = Object.assign({}, newRole);
    copyData.parentId = selected.value;
    this.setState({
      newRole: copyData,
      parentRequired: false
    });
  };

  onRoleTypeSelect = selected => {
    const { newRole } = this.state;
    let copyData = Object.assign({}, newRole);
    copyData.roleTypeId = selected.value;
    this.props.getRoleNumByType(selected.value).then(({ data, result }) => {
      if (result) {
        this.setState({
          newRole: copyData,
          rights: data || [],
          roleTypeRequired: false
        });
      }
    });
  };

  setName = evt => {
    const { newRole } = this.state;
    let copyData = Object.assign({}, newRole);
    copyData.name = evt.target.value;
    this.setState({
      nameRequired: false,
      newRole: copyData
    });
  };

  setEntityNo = evt => {
    const { newRole } = this.state;
    let copyData = Object.assign({}, newRole);
    copyData.entityNo = evt.target.value;
    this.setState({
      newRole: copyData
    });
  };

  setComment = evt => {
    const { newRole } = this.state;
    let copyData = Object.assign({}, newRole);
    copyData.comment = evt.target.value;
    this.setState({
      newRole: copyData
    });
  };

  renderForm = () => {
    const { roleOption, roleTypes } = this.props;
    const roleOptions = parseDropdownData(roleOption);
    const formatedRoleTypes = parseDropdownData(roleTypes);
    const {
      newRole,
      nameRequired,
      parentRequired,
      roleTypeRequired
    } = this.state;
    const selectParent = roleOptions.find(
      item => item.value === newRole.parentId
    );
    const selectRoleType = formatedRoleTypes.find(
      item => item.value === newRole.roleTypeId
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
                value={selectRoleType}
                onSelect={this.onRoleTypeSelect}
              />
            </div>
          </Control>
        </Item>
        <Item col={2}>
          <Label>{i18n['settings.role_setting.role_name']}</Label>
          <Control>
            <Input
              maxLength={100}
              value={newRole.name}
              onChange={this.setName}
              errorText={
                nameRequired && i18n['settings.role_setting.error_tints']
              }
              placeholder={i18n['settings.role_setting.role_length']}
            />
          </Control>
        </Item>
        <Item col={2}>
          <Label>{i18n['settings.role_setting.role_no']}</Label>
          <Control>
            <Input
              maxLength={100}
              value={newRole.entityNo}
              onChange={this.setEntityNo}
              placeholder={i18n['settings.role_setting.role_length']}
            />
          </Control>
        </Item>
        <Item col={1}>
          <Label>{i18n['settings.role_setting.role_description']}</Label>
          <Control>
            <Input
              maxLength={100}
              value={newRole.comment}
              onChange={this.setComment}
              placeholder={i18n['settings.role_setting.role_length']}
            />
          </Control>
        </Item>
      </Form>
    );
  };

  render() {
    const { show, data, onHide, parentRights, onTipsClick, tips } = this.props;
    const { showNextStep, rights } = this.state;
    // 前端屏蔽SupportCenter
    let filterData = data.filter(el => {
      return el.entityNo !== 'SUPPORT';
    });
    return (
      <Dialog
        visible={show}
        onCancel={onHide}
        title={i18n['settings.role_setting.add_user']}
        width={700}
        className={cs.modalBody}
        footer={
          <div>
            <Button type="default" onClick={this.onHide}>
              {i18n['general.cancel']}
            </Button>
            {showNextStep ? (
              <span style={{ marginLeft: '8px', display: 'inline-block' }}>
                <Button onClick={this.showPrev}>
                  {i18n['general.prev_step']}
                </Button>
                <Button
                  type="primary"
                  className="btn btn-primary"
                  onClick={this.onSave}
                >
                  {i18n['general.confirm']}
                </Button>
              </span>
            ) : (
              <Button type="primary" onClick={this.showNext}>
                {i18n['general.next_step']}
              </Button>
            )}
          </div>
        }
      >
        {showNextStep ? (
          <SelectTree
            onChange={this.getRight}
            onTipsClick={onTipsClick}
            selected={rights}
            data={filterData}
            safeData={parentRights}
            tips={tips}
            unsafeNotice={
              i18n[
                'settings.role_setting.rights_check.greater_than_parent_notice'
              ]
            }
          />
        ) : (
          this.renderForm()
        )}
      </Dialog>
    );
  }
}
