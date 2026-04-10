import React from 'react';
import {
  Button,
  Icon,
  Table,
  Picklist,
  Checkbox,
  Message,
  Popover
} from 'lean-ui';
import i18n from 'utils/i18n';
import {
  personApprovalColumns,
  roleApprovalColumns,
  personSendColumns,
  roleSendColumns
} from './constant.js';
import { PARTICIPANT_TYPE, STEP_TYPE, TASK_TYPES } from '../../contants';
import cs from './ProcessCardEdit.less';

const { Td, Th } = Table;

/**
 * props列表
 * type: TYPE_PERSON | TYPE_ROLE 表格类型
 * permissions: MT组权限列表
 * list: 已选择 人员/角色 列表
 * toggleStaffSelectModal(): 显示隐藏选择人员列表
 */
export default class SetTable extends React.PureComponent {
  tableConfigMap = {};
  constructor(props) {
    super(props);
    const { objectInfo } = this.props;
    const isAgency = objectInfo.itemType === TASK_TYPES.AGENCY;
    //表格类型配置映射
    this.tableConfigMap = {
      // 审批 人员
      [`${STEP_TYPE.AUDIT}_${PARTICIPANT_TYPE.USER}`]: {
        addText: i18n['task.object_setting.step.add.user'],
        columns: isAgency ? personSendColumns : personApprovalColumns,
        renderTbody: isAgency
          ? this.renderSendPersonTableBody
          : this.renderPersonTableBody
      },
      // 审批 角色
      [`${STEP_TYPE.AUDIT}_${PARTICIPANT_TYPE.ROLE}`]: {
        addText: i18n['task.object_setting.step.add.role'],
        columns: isAgency ? roleSendColumns : roleApprovalColumns,
        renderTbody: isAgency
          ? this.renderSendRoleTableBody
          : this.renderRoleTableBody
      },
      // 抄送 人员
      [`${STEP_TYPE.SEND}_${PARTICIPANT_TYPE.USER}`]: {
        addText: i18n['task.object_setting.step.add.user'],
        columns: personSendColumns,
        renderTbody: this.renderSendPersonTableBody
      },
      // 抄送 角色
      [`${STEP_TYPE.SEND}_${PARTICIPANT_TYPE.ROLE}`]: {
        addText: i18n['task.object_setting.step.add.role'],
        columns: roleSendColumns,
        renderTbody: this.renderSendRoleTableBody
      }
    };
  }
  renderHeadCell = ({ item }) => {
    if (item.key === 'groupPermissions') {
      return (
        <Th key={item.key}>
          {item.name}
          <Popover
            content={
              i18n['task.object_setting.step.table.groupPermissions.warn']
            }
            placement="top"
            getPopupContainer={triger => triger}
            trigger="hover"
          >
            {' '}
            <Icon icon="question" />
          </Popover>
        </Th>
      );
    }
    return <Th key={item.key}>{item.name}</Th>;
  };
  render() {
    const { type, toggleStaffSelectModal, stepType } = this.props;
    const tableConfig = this.tableConfigMap[`${stepType}_${type}`];
    if (!tableConfig)
      return i18n['task.object_setting.step.nonsupport.table_type'];
    return (
      <div className={cs['process-setting-body']}>
        <div className={cs['process-setting-menu']}>
          <Button type="primary" onClick={toggleStaffSelectModal}>
            <Icon icon="add-outline" />
            <span>{tableConfig.addText}</span>
          </Button>
        </div>
        <Table
          className={cs['setTable']}
          columns={tableConfig.columns}
          renderTbody={tableConfig.renderTbody}
          renderHeadCell={this.renderHeadCell}
        />
      </div>
    );
  }
  customSelectedDisplay(selectedItems) {
    const lables = selectedItems.map(item => item.label);
    return <div className={cs.pickelistDisplay}>{lables.join(', ')}</div>;
  }
  // 父组件值修改回调
  onChange = (type, index, data) => {
    const { list, onChange } = this.props;
    const d = list.concat();
    d[index][type] = data;
    onChange(d);
  };
  onCheckboxChange = (type, index, data) => {
    const v = data.target.checked;
    this.isOperatingAll = true;
    this.onChange(type, index, v);
  };
  // 修改mt组权限
  onGroupsDataChange = (type, mtGroupsMap, id, index, groups, data) => {
    let v = data;
    if (data.target) {
      v = !data.target.checked;
    }
    let mtGroupsMapClone = _.cloneDeep(mtGroupsMap);
    const item = mtGroupsMapClone[id];
    if (type === 'disable') {
      item.disable = v;
      if (v) {
        item.groups = [];
      } else {
        item.groups = groups.concat();
      }
    } else if (type === 'groups') {
      item.groups = v;
    }
    mtGroupsMapClone[id] = item;
    let count = 0;
    _.forEach(mtGroupsMapClone, server => {
      let groups = _.get(server, 'groups', []);
      const item =
        this.props.permissions.find(el => el.serverId === server.serverId) || {};
      groups = _.intersection(groups, item.groups);
      count = count + groups.length;
    });
    if (count === 0) {
      // 必须有一项选中. Picklist有问题, 无法不更改, 这里用黑科技
      // 先改成空值, 再还原回去
      Message.error(i18n['task.object_member.mt_groups.more_than_zero']);
      this.onChange('mtGroupsMap', index, mtGroupsMapClone);
      setTimeout(() => {
        this.onChange('mtGroupsMap', index, mtGroupsMap);
      }, 0);
    } else {
      this.onChange('mtGroupsMap', index, mtGroupsMapClone);
    }
  };
  tableFragment = (index, data, permissions) => {
    let { mtGroupsMap, isAllMtGroup } = data;
    console.log(1, mtGroupsMap);
    return [
      <Td>
        <Checkbox
          checked={isAllMtGroup}
          onChange={this.onCheckboxChange.bind(this, 'isAllMtGroup', index)}
        />
      </Td>,
      <Td>
        <ul className={cs['process-permissions-list']}>
          {permissions.map(permissionsItem => {
            const {
              options,
              serverId,
              groups,
              serverName,
              vendor
            } = permissionsItem;
            let item = mtGroupsMap[serverId];
            let checked = !item.disable;
            // 自定义平台没有groups因此不需要此逻辑
            if (
              vendor &&
              vendor.indexOf('CUSTOM') < 0 &&
              item.groups.length === 0
            ) {
              checked = false;
            }
            // 拥有所有mt组的情况下, 直接勾选所有mt组
            if (isAllMtGroup) {
              item.groups = groups.concat();
              checked = true;
            }

            if (serverName === 'Sandbox Real') {
              //   console.log('item.groups', item.groups);
            }
            return (
              <li className={cs['process-permissions-item']} key={serverId}>
                <Checkbox
                  disabled={isAllMtGroup}
                  checked={checked}
                  onChange={this.onGroupsDataChange.bind(
                    this,
                    'disable',
                    mtGroupsMap,
                    serverId,
                    index,
                    groups
                  )}
                >
                  {serverName}
                </Checkbox>
                {vendor &&
                  vendor.indexOf('CUSTOM') < 0 && (
                    <Picklist
                      defaultSelectedKeys={
                        this.isOperatingAll && !isAllMtGroup && !checked
                          ? []
                          : item.groups
                      }
                      onChange={this.onGroupsDataChange.bind(
                        this,
                        'groups',
                        mtGroupsMap,
                        serverId,
                        index,
                        groups
                      )}
                      customSelectedDisplay={this.customSelectedDisplay}
                      disabled={isAllMtGroup || item.disable}
                      data={options}
                      searchable
                      selectall
                    />
                  )}
              </li>
            );
          })}
        </ul>
      </Td>,
      <Td>
        <Button
          type="primary"
          onClick={this.props.handleDelete.bind(this, index)}
        >
          {i18n['general.delete']}
        </Button>
      </Td>
    ];
  };
  /**
   * 审批 人员选择表格
   */
  renderPersonTableBody = () => {
    const { list, permissions } = this.props;
    return (
      <tbody>
        {list.map((item, index) => {
          return (
            <tr>
              <Td>{item.entityNo}</Td>
              <Td>{item.name}</Td>
              <Td>{item.roleName}</Td>
              {this.tableFragment(index, item, permissions)}
            </tr>
          );
        })}
      </tbody>
    );
  };
  /**
   * 审批 角色选择表格
   */
  renderRoleTableBody = () => {
    const { list, permissions } = this.props;
    return (
      <tbody>
        {list.map((item, index) => {
          return (
            <tr>
              <Td>{item.roleName}</Td>
              <Td>{item.roleCategory}</Td>
              {this.tableFragment(index, item, permissions)}
            </tr>
          );
        })}
      </tbody>
    );
  };
  // 抄送 人员
  renderSendPersonTableBody = () => {
    const { list } = this.props;
    return (
      <tbody>
        {list.map((item, index) => {
          return (
            <tr key={item.entityNo}>
              <Td>{item.entityNo}</Td>
              <Td>{item.name}</Td>
              <Td>{item.roleName}</Td>
              <Td>
                <Button
                  type="primary"
                  onClick={this.props.handleDelete.bind(this, index)}
                >
                  {i18n['general.delete']}
                </Button>
              </Td>
            </tr>
          );
        })}
      </tbody>
    );
  };
  // 抄送 角色
  renderSendRoleTableBody = () => {
    const { list } = this.props;
    return (
      <tbody>
        {list.map((item, index) => {
          return (
            <tr>
              <Td>{item.roleName}</Td>
              <Td>{item.roleCategory}</Td>
              <Td>
                <Button
                  type="primary"
                  onClick={this.props.handleDelete.bind(this, index)}
                >
                  {i18n['general.delete']}
                </Button>
              </Td>
            </tr>
          );
        })}
      </tbody>
    );
  };
}
