/**
 * 右侧弹出页面审批列表组件
 * @file ProcessCardEdit/ApprovalCard.js
 * @author david
 */
import { Card, Radio, Table } from 'lean-ui';
import i18n from 'utils/i18n';
import { injectReducer } from 'utils/injectReducer';
import { connect } from 'react-redux';
import { actions, reducers } from './control';
import StaffSelectModal from '../StaffSelectModal';
import SetTable from './SetTable';
import { PARTICIPANT_TYPE, STEP_TYPE } from '../../contants';
import cs from './ProcessCardEdit.less';
import _ from 'lodash';

const radioList = [
  {
    id: '1',
    name: i18n['task.object_setting.step.designee'],
    type: PARTICIPANT_TYPE.USER
  },
  {
    id: '2',
    name: i18n['task.object_setting.step.role'],
    type: PARTICIPANT_TYPE.ROLE
  }
];
const radioTypeHash = {
  '0': PARTICIPANT_TYPE.USER,
  '1': PARTICIPANT_TYPE.ROLE
};

injectReducer('permissions', reducers);

class ApprovalCard extends Component {
  state = {
    radioValue: PARTICIPANT_TYPE.USER,
    showStaffSelectModal: false
  };
  componentDidMount() {
    const { getPermissions, getEditData, stepData, stepNo } = this.props;
    getPermissions().then(res => {
      const { permissions } = this.props;
      getEditData(stepData, stepNo, permissions);
    });
  }
  componentWillUnmount() {
    const { reset } = this.props;
    reset();
  }
  toggleStaffSelectModal = () => {
    this.setState({
      showStaffSelectModal: !this.state.showStaffSelectModal
    });
  };
  render() {
    const { permissions, editData = {}, type, objectInfo } = this.props;
    const { radioValue, showStaffSelectModal } = this.state;
    const { participant = [] } = editData;
    const { operation, type: stepType } = type;
    const title =
      stepType === STEP_TYPE.AUDIT
        ? i18n['task.object_setting.step.auditor.set']
        : i18n['task.object_setting.step.sender.set'];
    return (
      <Card className={cs['process-card-edit']}>
        <div className={cs['process-setting']}>
          <div className={cs['process-setting-header']}>
            <div className={cs['process-setting-title']}>{title}</div>
            <div className={cs['process-setting-radio']}>
              <Radio.Group onChange={this.handleRadioChange} value={radioValue}>
                {this.renderRadio()}
              </Radio.Group>
            </div>
            {Array.isArray(participant) && (
              <SetTable
                type={radioValue}
                stepType={stepType}
                objectInfo={objectInfo}
                onChange={this.onChange}
                toggleStaffSelectModal={this.toggleStaffSelectModal}
                handleDelete={this.handleDelete}
                permissions={permissions}
                list={participant}
              />
            )}
          </div>
        </div>
        <StaffSelectModal
          type={radioValue}
          stepType={stepType}
          objectInfo={objectInfo}
          defaultStaff={participant}
          submit={this.handleAdd}
          onCancel={this.toggleStaffSelectModal}
          visible={showStaffSelectModal}
        />
      </Card>
    );
  }

  /**
   *  radio chang事件
   * @param {String} radioValue 类型
   */
  handleRadioChange = radioValue => {
    const { editData } = this.props;
    const {
      item: { participant = [] }
    } = editData;
    const participantType =
      participant.length > 0 ? participant[0].participantType : '0';
    const list =
      radioTypeHash[participantType] === radioValue ? participant : [];
    this.setState({
      radioValue,
      list
    });
  };
  onChange = data => {
    data.forEach(el => {
      for (let i in el.mtGroupsMap) {
        if (el.mtGroupsMap[i].disable) {
          el.mtGroupsMap[i].groups = [];
        }
      }
    });
    console.log(111, data);

    this.updateData(data, 'participant');
  };
  updateData = (data, type) => {
    const { updateData, editData } = this.props;
    updateData({
      ...editData,
      [type]: data
    });
  };
  /**
   *  渲染
   */
  renderRadio = () => {
    radioList.map(item => (
      <label key={item.id}>
        <Radio value={item.type} />
        <label>{item.name}</label>
      </label>
    ));
  };
  /**
   * 添加人员/角色
   */
  handleAdd = items => {
    const {
      permissions
      // editData: { participant = [] }
    } = this.props;
    // const data = participant.concat();
    let data = [];
    items.forEach(item => {
      // 必须在内部单独生成mtGroupsMap, 否则引用相同, 会出现改值时无法修改的情况
      let mtGroupsMap = {};
      let mtGroups = []; // 新添加的所有用户默认拥有所有mt组权限

      // isAllMtGroup = item.isAllMtGroup;
      // participantType = item.participantType;
      let isAllMtGroup = 'isAllMtGroup' in item ? item.isAllMtGroup : true;
      let participantType =
        'participantType' in item
          ? item.participantType
          : PARTICIPANT_TYPE.USER;
      if (item.mtGroups && item.mtGroupsMap) {
        mtGroups = item.mtGroups;
        mtGroupsMap = item.mtGroupsMap;
      } else {
        permissions.forEach(item => {
          const groups = item.groups.concat();
          const obj = { ...item, groups: groups, disable: false };
          mtGroupsMap[item.serverId] = obj;
          mtGroups.push(obj);
        });
      }
      data.push({
        entityNo: item.entityNo,
        roleName: item.roleName,
        roleId: item.roleId,
        userId: item.pubUserId || item.userId,
        name: item.name,
        createTime: item.createTime || Date.now(),
        // TODO 审批流程, 目前只支持添加人员, 其实还可以添加角色类型
        participantType,
        isAllMtGroup,
        mtGroups,
        mtGroupsMap
      });
    });
    data = _.sortBy(data, item => {
      return -item.createTime;
    });
    this.onChange(data, 'participant');
    return Promise.resolve({ result: true });
  };
  /**
   * 删除已添加 人员/角色
   */
  handleDelete = index => {
    const {
      editData: { participant }
    } = this.props;
    const d = participant.concat();
    d.splice(index, 1);
    this.onChange(d, 'participant');
  };
}

export default connect(
  ({ permissions }) => {
    const keys = Object.keys(reducers);
    const props = {};
    keys.forEach(k => {
      props[k] = permissions[k];
    });
    return props;
  },
  actions
)(ApprovalCard);
