import { Button, Card, Table, Icon } from 'lean-ui';
import i18n from 'utils/i18n';
import { get } from 'utils/ajax';
import DetailModal from '../DetailModal';
import SubDetailModal from '../SubDetailModal';
import AddRoleModal from '../AddRoleModal';
import EditRoleModal from '../EditRoleModal';
import EditRightModal from '../EditRightModal';
import NoDataView from 'components/v2/NoDataView';

import {
  DEFAULT_ROLE,
  RIGHT_ENTITY_NO_TIPS,
  RIGHT_ENTITY_REMINDER_TIPS
} from '../../../../constant';
import cs from './RoleSetting.less';
import SettingActionBar from 'landings/Settings/components/SettingActionBar';

const TTd = Table.Td;

const tipsMaxWidth = {
  maxWidth: '300px'
};

let _resizeEvent;
const tipsReposition = () => {
  if (!window.Event || !window.dispatchEvent) return;
  if (!_resizeEvent) _resizeEvent = new Event('resize');
  window.dispatchEvent(_resizeEvent);
};

const multLineRightTips = {};
const singleLineRightTips = {};
Object.keys(RIGHT_ENTITY_REMINDER_TIPS).map(right => {
  multLineRightTips[right] = RIGHT_ENTITY_REMINDER_TIPS[right].map(
    (ib, idx) => (
      <div key={idx} style={tipsMaxWidth}>
        {ib}
      </div>
    )
  );
});
Object.keys(RIGHT_ENTITY_NO_TIPS).map(right => {
  singleLineRightTips[right] = [RIGHT_ENTITY_NO_TIPS[right]];
});

export default class RoleSetting extends PureComponent {
  state = {
    showAddRoleModal: false,
    showBelongModal: false,
    showEditRightModal: false,
    showEditRoleModal: false,
    showSubModal: false,
    treeParent: {},
    tips: {
      ...singleLineRightTips,
      ...multLineRightTips
    }
  };

  toggleModal = (type, toggle, selected = DEFAULT_ROLE) => {
    const {
      getBelongCount,
      getRoleOption,
      updateCurrentRole,
      getRightTree,
      getRoleData,
      getRoleType,
      checkParentChild
    } = this.props;
    if (toggle) {
      let p;
      switch (type) {
        case 'Belong':
          p = getBelongCount(selected.id, true, 0);
          break;
        case 'Sub':
          p = getRoleData(selected.id);
          break;
        case 'EditRole':
          p = Promise.all([getRoleOption(), getRoleType()]).then(() =>
            updateCurrentRole(selected)
          );
          break;
        case 'EditRight':
          p = Promise.all([
            getRightTree(),
            checkParentChild(selected.parentId)
          ]).then(() => updateCurrentRole(selected));
          break;
        case 'AddRole':
          p = Promise.all([getRoleOption(), getRoleType()]).then(() =>
            getRightTree()
          );
          break;
      }
      p.then(() => {
        this.setState({
          [`show${type}Modal`]: toggle,
          treeParent: type === 'Sub' ? selected : {}
        });
      });
      return;
    }
    this.setState({
      [`show${type}Modal`]: toggle
    });
  };

  componentDidMount() {
    const { getRoleList } = this.props;
    getRoleList();
  }

  showConfirmModal = selected => {
    const { showTipsModal, showTopAlert, removeRole, getRoleList } = this.props;
    showTipsModal({
      content: i18n['general.confirm_remove'],
      onConfirm: cb => {
        removeRole(selected.id).then(res => {
          if (res.result) {
            showTopAlert({
              bsStyle: 'success',
              content: i18n['general.remove_success']
            });
            getRoleList();
          }
          cb();
        });
      }
    });
  };

  //编辑权限
  onSaveRight = selectedRight => {
    const {
      updateRole,
      getRoleList,
      currentRole,
      showTopAlert,
      updateCurrentUserRight
    } = this.props;
    // 检查权限是否是父权限的子集
    this.roleRightsCheck(selectedRight, currentRole.parentId)
      .then(res => {
        if (!res.result) return Promise.resolve(res);
        return updateRole(selectedRight, currentRole.parentId);
      })
      .then(res => {
        if (!res.result) return Promise.resolve(res);
        this.toggleModal('EditRight', false, undefined);
        showTopAlert({
          bsStyle: 'success',
          content: i18n['general.save_success']
        });
        updateCurrentUserRight();
        getRoleList();
      });
  };

  //编辑用户
  onSaveEditRole = (copyData, parentId) => {
    const {
      updateRole,
      updateCurrentUserRight,
      getRoleList,
      showTopAlert
    } = this.props;
    Promise.resolve(updateRole(copyData, parentId)).then(res => {
      if (res.result) {
        this.toggleModal('EditRole', false, undefined);
        showTopAlert({
          bsStyle: 'success',
          content: i18n['general.save_success']
        });
        updateCurrentUserRight();
        getRoleList();
      }
    });
  };

  // 编辑新增时, 权限检查
  roleRightsCheck = (data, parentId) => {
    const { roleRightsCheck, showTipsModal } = this.props;
    return roleRightsCheck(data, parentId).then(res => {
      if (!res.result || res.data === 'OK') return Promise.resolve(res);
      return new Promise((resolve, reject) => {
        let content = '';
        switch (res.data) {
          case 'LESS_THAN_CHILDREN':
            content =
              i18n['settings.role_setting.rights_check.less_than_children'];
            break;
          case 'GREATER_THAN_PARENT':
            content =
              i18n['settings.role_setting.rights_check.greater_than_parent'];
            break;
          default:
            content = res.data;
        }

        showTipsModal({
          content,
          onConfirm: cb => {
            resolve({ result: true });
            cb();
          },
          onCancel: cb => {
            resolve({ result: false });
            cb();
          }
        });
      });
    });
  };

  //新增用户
  onSaveAddRole = (copyData, parentId) => {
    const {
      updateRole,
      updateCurrentUserRight,
      getRoleList,
      showTopAlert
    } = this.props;
    this.roleRightsCheck(copyData, parentId)
      .then(res => {
        if (!res.result) return Promise.resolve(res);
        return updateRole(copyData, parentId);
      })
      .then(res => {
        if (!res.result) return Promise.resolve(res);
        this.toggleModal('AddRole', false, undefined);
        showTopAlert({
          bsStyle: 'success',
          content: i18n['general.save_success']
        });
        updateCurrentUserRight();
        getRoleList();
      });
  };

  renderCell = ({ key, data, index }) => {
    return <TTd key={index}>{data}</TTd>;
  };

  gotRemoteTips = {};
  onRightTipsClick = entityNo => {
    const { tips } = this.state;
    // 如果是敏感权限，则请求敏感信息
    if (/_SENSITIVE$/.test(entityNo) && !this.gotRemoteTips[entityNo])
      get({
        url: `/v1/tenants/metadata/sensitive/field?authNo=${entityNo}`
      }).then(res => {
        if (!res.result) return Promise.resolve(res);
        // 仅请求一次远端tips数据
        this.gotRemoteTips[entityNo] = true;
        this.setState(
          {
            tips: {
              ...tips,
              // tips[entityNo] 可能不存在
              [entityNo]: (tips[entityNo] || []).concat([
                <br key="br" />,
                <div key="remote" style={tipsMaxWidth}>
                  <strong className={cs['tips-title']}>{`${
                    i18n['settings.role_setting.tips_title']
                  }: `}</strong>
                  <div className={cs['tips-text']}>{res.data.join(', ')}</div>
                </div>
              ])
            }
          },
          tipsReposition
        );
      });
  };

  render() {
    const {
      roleList,
      belongList,
      roleTree,
      roleOption,
      roleTypes,
      currentRole,
      rightTree,
      getRoleData,
      roleRightsCheck,
      showTipsModal,
      parentRights,
      checkParentChild,
      getRoleNumByType
    } = this.props;
    const {
      showAddRoleModal,
      showBelongModal,
      showEditRightModal,
      showEditRoleModal,
      showSubModal,
      treeParent,
      tips
    } = this.state;
    let data = [];
    roleList &&
      roleList.forEach((item, index) => {
        data.push({
          key1: item.id,
          key2: item.entityNo,
          key3: item.roleTypeName,
          key4: item.name,
          key5: item.parentName,
          key6:
            item.subRoleCount === 0 ? (
              item.subRoleCount
            ) : (
              <a onClick={this.toggleModal.bind(this, 'Sub', true, item)}>
                {item.subRoleCount}
              </a>
            ),
          key7: (
            <a onClick={this.toggleModal.bind(this, 'EditRight', true, item)}>
              {i18n['settings.role_setting.right_detail']}
            </a>
          ),
          key8: (
            <div className={cs['list-button']}>
              {item.id === 1 ? (
                undefined
              ) : (
                <Icon
                  className={`${cs['operationIcon']} main-color`}
                  type="primary"
                  icon="edit-outline"
                  onClick={this.toggleModal.bind(this, 'EditRole', true, item)}
                />
              )}
              <Icon
                className={`${cs['operationIcon']} main-color`}
                icon="delete-outline"
                onClick={this.showConfirmModal.bind(this, item)}
              />
            </div>
          )
        });
      });
    const columns = [
      { key: 'key1', name: 'ID' },
      { key: 'key2', name: i18n['settings.role_setting.role_no'] },
      { key: 'key3', name: i18n['settings.role_setting.role_type_name'] },
      { key: 'key4', name: i18n['settings.role_setting.role_name'] },
      { key: 'key5', name: i18n['settings.role_setting.parent_role'] },
      { key: 'key6', name: i18n['settings.role_setting.children_count'] },
      { key: 'key7', name: i18n['settings.role_setting.role_authority'] },
      { key: 'key8', name: i18n['settings.role_setting.action'] }
    ];
    return (
      <div className={cs.body}>
        <SettingActionBar
          title={i18n['settings.left_menu.user_setting.sub_menu.role_setting']}
        >
          <Button
            type="primary"
            onClick={this.toggleModal.bind(this, 'AddRole', true, undefined)}
          >
            <Icon icon="add-outline" />
            {i18n['settings.role_setting.add_user']}
          </Button>
        </SettingActionBar>
        <Card>
          {/* 表格 */}
          <div className={cs['list-table']}>
            <Table data={data} columns={columns} renderCell={this.renderCell} />
          </div>
          {/* 无数据 */}
          {roleList.length === 0 ? <NoDataView /> : undefined}

          {/* 弹窗 */}
          {showBelongModal && (
            <DetailModal
              show={showBelongModal}
              data={belongList}
              type="belong"
              onHide={this.toggleModal.bind(this, 'Belong', false, undefined)}
            />
          )}
          {/* 下级角色数 */}
          {showSubModal && (
            <SubDetailModal
              show={showSubModal}
              getData={getRoleData}
              type="sub"
              defaultValue={treeParent}
              onHide={this.toggleModal.bind(this, 'Sub', false, undefined)}
            />
          )}
          {showAddRoleModal && (
            <AddRoleModal
              show={showAddRoleModal}
              showNext={false}
              data={rightTree}
              parentRights={parentRights}
              checkParentChild={checkParentChild}
              getRoleNumByType={getRoleNumByType}
              onSave={this.onSaveAddRole}
              tips={tips}
              onTipsClick={this.onRightTipsClick}
              roleTypes={roleTypes}
              roleOption={roleOption}
              onHide={this.toggleModal.bind(this, 'AddRole', false, undefined)}
            />
          )}
          {showEditRoleModal && (
            <EditRoleModal
              show={showEditRoleModal}
              roleOption={roleOption}
              roleTypes={roleTypes}
              currentRole={currentRole}
              onSave={this.onSaveEditRole}
              onHide={this.toggleModal.bind(this, 'EditRole', false, undefined)}
            />
          )}
          {showEditRightModal && (
            <EditRightModal
              show={showEditRightModal}
              data={rightTree}
              parentRights={parentRights}
              roleRightsCheck={roleRightsCheck}
              showTipsModal={showTipsModal}
              tips={tips}
              onTipsClick={this.onRightTipsClick}
              onSave={this.onSaveRight}
              currentRole={currentRole}
              onHide={this.toggleModal.bind(
                this,
                'EditRight',
                false,
                undefined
              )}
            />
          )}
        </Card>
      </div>
    );
  }
}
