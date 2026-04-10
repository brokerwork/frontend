/**
 * 右侧弹出页面
 * @file ProcessCardEdit/index.js
 * @author david
 */
import { Button } from 'lean-ui';
import { connect } from 'react-redux';
import CardPanel from 'components/v2/CardPanel';
import ApprovalCard from './ApprovalCard.js';
import i18n from 'utils/i18n';
import { STEP_TYPE } from '../../contants';

class ProcessCardEdit extends PureComponent {
  /**
   * 保存事件
   */
  handleSave = () => {
    const { handleSave, editData, stepNo, permissions } = this.props;
    // 如果group被删除了必须清除原有数据
    let data = _.cloneDeep(editData);
    data.participant.forEach(el => {
      let map = el.mtGroupsMap;
      for (let i in map) {
        const vendorItem =
          permissions.find(el => el.vendor === map[i].vendor) || {};
        map[i].groups = _.intersection(map[i].groups, vendorItem.groups);
      }
      el.mtGroupsMap;
    });
    console.log('dat', data, permissions);

    handleSave(data, stepNo).then(res => {
      this.handleClose();
    });
  };
  /**
   * 关闭事件
   */
  handleClose = () => {
    const { handleClose } = this.props;
    handleClose();
  };
  /**
   *  渲染标题
   */
  renderCardPanelTitle = () => {
    const { type } = this.props;
    const { type: stepType } = type;
    return stepType === STEP_TYPE.AUDIT
      ? i18n['task.object_setting.step.add.audit']
      : i18n['task.object_setting.step.add.send'];
  };
  canSaveValid = () => {
    const { editData } = this.props;
    return _.some(editData.participant, part => !!part.mtGroups.length);
  };
  render() {
    const { stepData, stepNo, type, objectInfo, editData } = this.props;
    const { operation, type: stepType } = type;
    const canSave = this.canSaveValid();
    const stepName = this.renderCardPanelTitle();
    const data =
      operation === 'add'
        ? {
            stepName: stepType,
            stepType: stepType,
            stepNo: stepNo + 1,
            turnouts: 1
          }
        : stepData[stepNo];
    return (
      <CardPanel onClose={this.handleClose} show={true} title={stepName}>
        <ApprovalCard
          objectInfo={objectInfo}
          stepData={data}
          type={type}
          stepNo={stepNo}
        />
        <CardPanel.Footer>
          <Button onClick={this.handleClose}>{i18n['general.cancel']}</Button>
          <Button onClick={this.handleSave} type="primary" disabled={!canSave}>
            {i18n['general.save']}
          </Button>
        </CardPanel.Footer>
      </CardPanel>
    );
  }
}

export default connect(
  ({ permissions }) => {
    return {
      editData: permissions.editData,
      permissions: permissions.permissions
    };
  },
  null
)(ProcessCardEdit);
