import { Button, Collapse, Checkbox, Table } from 'lean-ui';
import Tag from 'components/v2/Tag';
import Dropdown from 'components/v2/Dropdown';
import i18n from 'utils/i18n';
import CardPanel from 'components/v2/CardPanel';
import cs from './ObjectSettingMemberSelect.less';
import { TASK_TYPES } from '../../contants';

const { Th, Td } = Table;

const WAIT_COLUMNS = [
  {
    key: 'entityNo',
    name: i18n['task.object_member.table_header.id']
  },
  {
    key: 'name',
    name: i18n['task.object_member.table_header.name']
  },
  {
    key: 'roleName',
    name: i18n['task.object_member.table_header.role']
  },
  {
    key: 'admin',
    name: i18n['task.object_member.table_header.admin']
  },
  {
    key: 'super_admin',
    name: i18n['task.object_member.table_header.super_admin']
  },
  {
    key: 'check',
    name: ''
  }
];

export default class ObjectSettingEditMemberSelect extends PureComponent {
  renderWaitHeadCell = (
    objectMembersSelectedAllStatus,
    { item, index, fixed }
  ) => {
    if (item.key === 'check') {
      return (
        <Th key={index} className={cs['th']}>
          <Checkbox
            onChange={this.objectMembersSeletedAll.bind(
              this,
              !objectMembersSelectedAllStatus
            )}
            checked={objectMembersSelectedAllStatus}
            inline
          />
        </Th>
      );
    }

    return (
      <Th key={index} className={cs['th']}>
        {item.name}
      </Th>
    );
  };

  renderWaitCell = ({ key, data, index, rowData, listData }) => {
    const { objectMembersSelected } = this.state;

    switch (key) {
      case 'entityNo':
        return <Td className={cs['td']}>{rowData.entityNo}</Td>;
      case 'name':
        return <Td className={cs['td']}>{rowData.name}</Td>;
      case 'roleName':
        return <Td className={cs['td']}>{rowData.roleName}</Td>;
      case 'admin':
        return (
          <Td className={cs['td']}>
            {rowData.right === 'ADMIN' ? (
              <i className="fa fa-check" />
            ) : (
              undefined
            )}
          </Td>
        );
      case 'super_admin':
        return (
          <Td className={cs['td']}>
            {rowData.right === 'SUPER' ? (
              <i className="fa fa-check" />
            ) : (
              undefined
            )}
          </Td>
        );
      case 'check':
        return (
          <Td className={cs['td']}>
            <Checkbox
              onChange={this.modifyObjectMembersSeleted.bind(this, rowData.id)}
              checked={objectMembersSelected[rowData.id]}
              inline
            />
          </Td>
        );
    }
  };

  getMemberColumns = taskType => {
    const columns = [
      {
        key: 'entityNo',
        name: i18n['task.object_member.table_header.id']
      },
      {
        key: 'name',
        name: i18n['task.object_member.table_header.name']
      },
      {
        key: 'roleName',
        name: i18n['task.object_member.table_header.role']
      },
      {
        key: 'admin',
        name: i18n['task.object_member.table_header.admin']
      },
      {
        key: 'super_admin',
        name: i18n['task.object_member.table_header.super_admin']
      }
    ];

    if (taskType === TASK_TYPES.TA) {
      columns.push({
        key: 'mt_groups',
        name: i18n['task.object_member.table_header.mt_groups']
      });
    }

    columns.push({
      key: 'check',
      name: ''
    });

    return columns;
  };

  renderMemberHeadCell = (dataSelectedAllStatus, { item, index, fixed }) => {
    if (item.key === 'check') {
      return (
        <Th key={index} className={cs['th']}>
          <Checkbox
            onChange={this.dataSelectedAll.bind(this, !dataSelectedAllStatus)}
            checked={dataSelectedAllStatus}
            inline
          />
        </Th>
      );
    }

    return (
      <Th key={index} className={cs['th']}>
        {item.name}
      </Th>
    );
  };

  renderMemberCell = (servers, { key, data, rowIndex, rowData, listData }) => {
    const { groupsErrors, dataSelected } = this.state;

    const showServerName = servers.length > 1;
    const itemMtGroups = rowData.mtGroups || [];
    const mtGroups = {};
    let selectAllGroups = false;
    // mtGroups 为空, 或者空数组时, 默认全选
    // 管理员, 系统管理员, 默认全选, 且不可以更改
    if (itemMtGroups.length === 0) {
      selectAllGroups = true;
    }
    servers.forEach(v => {
      const serverId = v.value;
      const __obj = {};
      // 查找是否有当前serverId的记录
      const value = itemMtGroups.find(group => {
        return group.serverId === serverId;
      });
      // 判断否有记录
      if (value && value.groups) {
        if (value.groups.length !== 0) {
          // 不为空的情况则把值转换为dropdown可用的数据类型
          __obj['groups'] = value.groups.map(g => ({
            label: g,
            value: g
          }));
        } else {
          // 如果有记录 判断是否有存在groups为空数组的情况
          __obj['groups'] = [];
        }
      }

      // 如果没有记录则认为此条被disabled, 显示 `无`
      if ((!value || !value.groups) && !selectAllGroups) {
        __obj['placeholder'] = i18n['task.object_member.mt_groups.none'];
      }

      // 记录serverId和平台.
      __obj['serverId'] = v.value;
      __obj['vender'] = v.vender;
      __obj['checked'] =
        rowData.right !== 'COMMON' || selectAllGroups || !!value;
      __obj['disabledDropdown'] =
        rowData.right !== 'COMMON' || selectAllGroups || !value;
      __obj['disabledChecked'] = rowData.right !== 'COMMON';

      // 生成记录的状态数据
      mtGroups[serverId] = __obj;
    });
    
    switch (key) {
      case 'entityNo':
        return <Td className={cs['td']}>{rowData.entityNo}</Td>;
      case 'name':
        return <Td className={cs['td']}>{rowData.name}</Td>;
      case 'roleName':
        return <Td className={cs['td']}>{rowData.roleName}</Td>;
      case 'admin':
        return (
          <Td className={cs['td']}>
            {rowData.right === 'ADMIN' ? (
              <i className="fa fa-check" />
            ) : (
              undefined
            )}
          </Td>
        );
      case 'super_admin':
        return (
          <Td className={cs['td']}>
            {rowData.right === 'SUPER' ? (
              <i className="fa fa-check" />
            ) : (
              undefined
            )}
          </Td>
        );
      case 'mt_groups':
        return (
          <Td className={cs['td']}>
            {servers.map((v, i) => {
              const {
                groups,
                placeholder,
                disabledChecked,
                disabledDropdown,
                checked
              } = mtGroups[v.value];
              const itemError = groupsErrors[rowData.userId];
              const hasEmptyGroup = itemError && itemError[v.value];
              return (
                <div
                  key={i}
                  className={`${cs['mtgroups']} ${
                    !showServerName ? cs['mtgroups-center'] : ''
                  }`}
                >
                  {showServerName ? (
                    <Checkbox
                      inline
                      disabled={disabledChecked}
                      checked={checked}
                      onChange={this.modifyMtServerState.bind(
                        this,
                        rowIndex,
                        v
                      )}
                    >
                      <span className={cs['mtgroups-server-name']}>
                        {v.label}:{' '}
                      </span>
                    </Checkbox>
                  ) : (
                    undefined
                  )}

                  <Dropdown
                    data={v.groups || []}
                    value={groups}
                    disabled={disabledDropdown}
                    placeholder={placeholder}
                    buttonClassName={hasEmptyGroup ? cs['empty-group'] : ''}
                    selectAllButton
                    checkbox
                    onSelect={this.modifyMtServer.bind(
                      this,
                      rowIndex,
                      v.value,
                      v.vender
                    )}
                    className={cs['mtgroups-select']}
                    align="right"
                  />
                </div>
              );
            })}
          </Td>
        );
      case 'check':
        return (
          <Td className={cs['td']}>
            <Checkbox
              disabled={rowData.right !== 'COMMON'}
              onChange={this.modifyDataSeleted.bind(this, rowData.userId)}
              checked={dataSelected[rowData.userId]}
              inline
            />
          </Td>
        );
    }
  };

  render() {
    const {
      __data,
      objectMembersGroup,
      dataSelected,
      objectMembersSelected,
      objectActiveMembers,
      groupsErrors
    } = this.state;
    const { data, serverList, taskType } = this.props;
    const objectMembersGroupKeys = Object.keys(objectMembersGroup);
    const showObjectMembersTable = objectMembersGroupKeys.some(item => {
      return objectMembersGroup[item].active;
    });

    const dataSelectedAllStatus = data.every(item => {
      if (item.right !== 'COMMON') return true;
      return dataSelected[item.userId];
    });

    const objectMembersSelectedAllStatus = objectActiveMembers.every(item => {
      return objectMembersSelected[item.id];
    });

    const servers = [...serverList.mt4, ...serverList.mt5, ...serverList.ct];

    return (
      <CardPanel
        onClose={this.onClose}
        show={true}
        title={
          i18n[
            'task.object_setting.edit_task_group.modify_step_member.card_title'
          ]
        }
      >
        <Collapse forceActiveAll>
          <Collapse.Item
            title={
              i18n[
                'task.object_setting.edit_task_group.modify_step_member.waiting_member_list'
              ]
            }
          >
            <div className={cs['tag-box']}>
              {objectMembersGroupKeys.map((k, index) => {
                const item = objectMembersGroup[k];
                return (
                  <Tag
                    className={cs['tag']}
                    onClick={this.toggleMemberGroup.bind(this, k)}
                    key={index}
                    active={item.active}
                  >
                    {item.name}
                  </Tag>
                );
              })}
            </div>
            {showObjectMembersTable ? (
              <Table
                bordered
                columns={WAIT_COLUMNS}
                renderHeadCell={this.renderWaitHeadCell.bind(
                  this,
                  objectMembersSelectedAllStatus
                )}
                renderCell={this.renderWaitCell.bind(this)}
                data={objectActiveMembers}
                bsTableStyle="table-bordered"
                className="ellipsis"
              />
            ) : (
              undefined
            )}
            {showObjectMembersTable ? (
              <div className="text-right">
                <Button
                  className={cs['add-member']}
                  onClick={this.addSelectedMemberToList}
                  type="primary"
                >
                  {
                    i18n[
                      'task.object_setting.edit_task_group.modify_step_member.add_to_member_list'
                    ]
                  }
                </Button>
              </div>
            ) : (
              undefined
            )}
          </Collapse.Item>
          <Collapse.Item
            className={cs['item']}
            title={
              i18n[
                'task.object_setting.edit_task_group.modify_step_member.member_list'
              ]
            }
          >
            <Table
              bordered
              columns={this.getMemberColumns(taskType)}
              renderHeadCell={this.renderMemberHeadCell.bind(
                this,
                dataSelectedAllStatus
              )}
              renderCell={this.renderMemberCell.bind(this, servers)}
              data={__data}
            />
          </Collapse.Item>
          <div className={cs['save-btn-box']}>
            <div className={cs['save-btn']}>
              <Button type="primary" onClick={this.onSave}>
                {i18n['general.save']}
              </Button>
            </div>
          </div>
        </Collapse>
      </CardPanel>
    );
  }
  constructor(props) {
    super(props);
    const { data } = this.props;
    const objectMembersGroup = this.objectMemberPacket(props.objectMembers);
    const dataSelected = {};
    const __data = [];
    data.forEach((item, index) => {
      dataSelected[item.userId] = true;
      const mtGroupsHandle = this.initinalMtGroups(item);
      __data.push(mtGroupsHandle);
    });
    this.state = {
      // 暂存从待添加列表，添加到成员列表中的成员
      __data,
      dataSelected,
      objectMembersSelected: {},
      objectActiveMembers: [],
      objectMembersGroup,
      // 未groups选择的server提示
      // 根据userId区分
      // groupsErrors: {userId: {serverId1: true}}
      groupsErrors: {}
    };
  }
  // 处理初始化数据mtGroups状态
  initinalMtGroups = item => {
    const { serverList } = this.props;
    const servers = [...serverList.mt4, ...serverList.mt5, ...serverList.ct];
    let { mtGroups = [] } = item;
    if (mtGroups.length === 0) {
      mtGroups = servers.map(v => {
        return {
          serverId: v.value,
          vender: v.vender,
          groups: v.groups.map(g => g.value)
        };
      });
    }
    return {
      ...item,
      mtGroups
    };
  };
  // 修改mtGroups启用状态
  modifyMtServerState(itemIndex, servers, e) {
    const data = this.state.__data.concat();
    const { value, vender, groups } = servers;
    const serverId = value;
    const { showTopAlert } = this.props;
    let { mtGroups = [] } = data[itemIndex];
    const checked = e.target.checked;
    if (checked) {
      mtGroups.push({
        serverId,
        vender,
        groups: groups.map(item => item.value)
      });
    } else {
      mtGroups = mtGroups.filter(item => {
        return item.serverId !== serverId;
      });
      // 在启用状态至少选择一个服务器
      if (mtGroups.length === 0) {
        showTopAlert({
          content: i18n['task.object_member.mt_groups.more_than_zero']
        });
        return;
      }
    }
    data[itemIndex]['mtGroups'] = mtGroups;
    this.setState({
      __data: data
    });
  }
  // 修改mtGroups值
  modifyMtServer(itemIndex, serverId, vender, value) {
    let data = this.state.__data.concat();

    let { mtGroups = [] } = data[itemIndex];
    const groups = value.map(item => item.value);
    let serverExsit = false;

    for (let item of mtGroups) {
      if (item.serverId !== serverId) continue;
      // 数据中记录了mtGroups时
      // 直接修改这条记录
      serverExsit = true;
      item.groups = groups;
      break;
    }

    // 如果数据中不存在这条记录时, 直接添加
    if (!serverExsit) {
      mtGroups.push({ serverId, vender, groups });
    }
    data[itemIndex]['mtGroups'] = mtGroups;
    this.setState({
      __data: data
    });
  }
  onSave = () => {
    const { __data, dataSelected } = this.state;
    const {
      saveStepData,
      objectId,
      showTopAlert,
      taskGroupId,
      stepId,
      taskType
    } = this.props;
    const selected = [];
    const groupsErrors = {};
    __data.forEach(item => {
      if (item.right === 'COMMON' && taskType === TASK_TYPES.TA) {
        const groupsEmptyServers = {};
        item.mtGroups.forEach(server => {
          if (Array.isArray(server.groups) && !server.groups.length) {
            groupsEmptyServers[server.serverId] = true;
          }
        });
        if (Object.keys(groupsEmptyServers).length) {
          groupsErrors[item.userId] = groupsEmptyServers;
        }
      }

      if (dataSelected[item.userId]) {
        selected.push({
          name: item.name,
          userId: item.userId,
          right: item.right,
          mtGroups: item.mtGroups
        });
      }
    });
    if (Object.keys(groupsErrors).length && taskType === TASK_TYPES.TA) {
      this.setState({ groupsErrors });
      showTopAlert({
        content: i18n['task.object_member.mt_groups.empty_tips']
      });
      return;
    }

    saveStepData({
      objectId,
      taskGroupId,
      stepId,
      data: selected
    }).then(({ result, mcode }) => {
      if (result) {
        showTopAlert({
          content: i18n['general.save_success'],
          bsStyle: 'success'
        });
        this.onClose();
      } else {
        showTopAlert({
          content: i18n.mcode(mcode)
        });
      }
    });
  };
  addSelectedMemberToList = () => {
    const { __data, objectMembersSelected, dataSelected } = this.state;
    const { objectMembers } = this.props;
    const __dataArrayObj = {};
    const __dataSelected = { ...dataSelected };
    // 标记已经步骤中已有的成员
    __data.forEach(item => {
      __dataArrayObj[item.userId] = true;
    });
    objectMembers.forEach(item => {
      // 判断选中, 步骤中已有的成员不再重复添加
      if (objectMembersSelected[item.id] && !__dataArrayObj[item.id]) {
        __dataSelected[item.id] = true;
        const v = this.initinalMtGroups({
          roleName: item.role,
          userId: item.id,
          name: item.name,
          right: item.right,
          entityNo: item.entityNo,
          roleId: item.roleId
        });
        __data.push(v);
      }
    });
    this.setState({
      __data,
      dataSelected: __dataSelected
    });
  };
  objectMembersSeletedAll(status) {
    const { objectMembersSelected } = this.state;
    const __objectMembersSelected = { ...objectMembersSelected };
    for (let k in objectMembersSelected) {
      __objectMembersSelected[k] = status;
    }
    this.setState({
      objectMembersSelected: __objectMembersSelected
    });
  }
  modifyObjectMembersSeleted(k) {
    const { objectMembersSelected } = this.state;
    this.setState({
      objectMembersSelected: {
        ...objectMembersSelected,
        [k]: !objectMembersSelected[k]
      }
    });
  }
  objectMemberPacket(data) {
    const __obj = {};
    data.forEach((item, index) => {
      if (!__obj[item.roleId]) {
        __obj[item.roleId] = {
          name: item.role,
          active: false
        };
      }
    });
    return __obj;
  }
  componentDidMount() {
    const { getObjectMembers, objectId } = this.props;
    getObjectMembers(objectId).then(({ result }) => {
      if (result) {
        const newObjectMembers = this.props.objectMembers;
        const objectMembersGroup = this.objectMemberPacket(newObjectMembers);
        this.setState({ objectMembersGroup });
      }
    });
  }
  onClose = data => {
    const { onClose } = this.props;
    onClose();
  };
  toggleMemberGroup(k) {
    const {
      objectMembersGroup,
      objectMembersSelected,
      objectActiveMembers
    } = this.state;
    const { objectMembers } = this.props;
    const __obj = { ...objectMembersGroup[k] };
    __obj.active = !__obj.active;
    const __objectMembersGroup = {
      ...objectMembersGroup,
      [k]: __obj
    };

    let __objectActiveMembers = objectActiveMembers.concat();
    const __objectMemberSelected = { ...objectMembersSelected };

    if (__obj.active) {
      objectMembers.forEach(item => {
        if (item.roleId === k) {
          __objectActiveMembers.push(item);
          __objectMemberSelected[item.id] = true;
        }
      });
    } else {
      const __arr = [];
      __objectActiveMembers.forEach(item => {
        if (item.roleId !== k) {
          __arr.push(item);
        } else {
          delete __objectMemberSelected[item.id];
        }
      });
      __objectActiveMembers = __arr;
    }

    this.setState({
      objectMembersSelected: __objectMemberSelected,
      objectActiveMembers: __objectActiveMembers,
      objectMembersGroup: __objectMembersGroup
    });
  }
  modifyDataSeleted(k) {
    const { dataSelected } = this.state;
    this.setState({
      dataSelected: {
        ...dataSelected,
        [k]: !dataSelected[k]
      }
    });
  }
  dataSelectedAll(status) {
    const { dataSelected, __data } = this.state;
    const __obj = {};
    const __dataObj = {};
    __data.forEach(item => {
      __dataObj[item.userId] = item;
    });
    for (let k in dataSelected) {
      if (__dataObj[k].right === 'COMMON') __obj[k] = status;
    }
    this.setState({
      dataSelected: __obj
    });
  }
}
