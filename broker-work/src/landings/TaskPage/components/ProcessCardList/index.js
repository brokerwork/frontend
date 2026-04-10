/**
 * 流程列表
 * @file ProcessCardList/index.js
 * @author david
 */
import { Card, Button, Icon, Tooltip } from 'lean-ui';
import cs from './ProcessCardList.less';
import { STEP_TYPE } from '../../contants';
import { FormattedMessage } from 'react-intl';
import i18n from 'utils/i18n';

const taskTypeHash = {
  TA: i18n['task.object_setting.step.investor'],
  AGENCY: 'IB',
  [STEP_TYPE.AUDIT]: i18n['task.object_setting.step.auditor.placeholder'],
  [STEP_TYPE.SEND]: i18n['task.object_setting.step.sender.placeholder'],
  [STEP_TYPE.START]: i18n['task.object_setting.step.investor']
};
const nameTypeHash = {
  role: i18n['task.object_setting.step.role'],
  person: i18n['task.object_setting.step.user'],
  attaching: i18n['task.object_setting.step.attaching']
};

class ProcessCardItem extends PureComponent {
  state = {
    tooltipVisible: false
  };
  render() {
    const { tooltipVisible } = this.state;
    const { versionRights = {} } = this.props;
    return (
      <div className={cs['process-card-item']}>
        <Card title={this.renderCardTitle()} extra={this.renderCardExtra()}>
          <div onClick={this.handleEdit} className={cs.responseArea}>
            <div className={cs['name-box']}>
              <p
                className={cs['name-content']}
                title={this.renderCardContent()}
              >
                {this.renderCardContent()}
              </p>
            </div>
            {this.renderArrowBox()}
          </div>
        </Card>
        <div className={cs['process-point-box']}>
          <div className={cs['dotted']} />
          {versionRights['SC_MORE_TASK'] && (
            <Tooltip
              overlayClassName={cs['process-tip']}
              trigger="click"
              visible={tooltipVisible}
              onVisibleChange={this.handleVisibleChange}
              placement="right"
              title={this.renderTooltipTitle}
            >
              <div className={cs['add-box']} onClick={this.handleOpenTooltip}>
                <Icon icon="add-outline" />
              </div>
            </Tooltip>
          )}
          <div className={cs['point']}>
            <div className={cs['triangle']} />
          </div>
        </div>
      </div>
    );
  }
  /**
   * 渲染卡片标题
   */
  renderCardTitle = () => {
    const { item = {}, stepName } = this.props;
    const { participant = [] } = item;
    let cardTitle = null;
    const count = participant.length;
    switch (item.stepType) {
      case STEP_TYPE.START:
        cardTitle = i18n['task.object_setting.step.initiator'];
        break;
      case STEP_TYPE.AUDIT:
        cardTitle = (
          <div className={cs['title']}>
            <Icon className={`bw-approval ${cs.icon}`} fontType="bw" />
            {stepName}{' '}
            <FormattedMessage
              id="task.object_setting.step.count"
              defaultMessage={i18n['task.object_setting.step.count']}
              values={{ number: count }}
            />
          </div>
        );
        break;
      case STEP_TYPE.SEND:
        cardTitle = (
          <div className={cs['title']}>
            <Icon className={`bw-send02 ${cs.icon}`} fontType="bw" />
            {stepName}{' '}
            <FormattedMessage
              id="task.object_setting.step.count"
              defaultMessage={i18n['task.object_setting.step.count']}
              values={{ number: count }}
            />
          </div>
        );
        break;
    }
    return cardTitle;
  };
  /**
   * 渲染Tooltip的title
   */
  renderTooltipTitle = () => {
    return (
      <div className={cs['process-tip-box']}>
        <div
          className={cs['process-tip-approval']}
          onClick={e => this.handleAdd(STEP_TYPE.AUDIT, e)}
        >
          <Icon className="bw-approval" fontType="bw" />
          <p>{i18n['task.object_setting.step.auditor']}</p>
        </div>
        <div
          className={cs['process-tip-approval']}
          onClick={e => this.handleAdd(STEP_TYPE.SEND, e)}
        >
          <Icon className="bw-send02" fontType="bw" />
          <p>{i18n['task.object_setting.step.sender']}</p>
        </div>
      </div>
    );
  };
  /**
   * 渲染card右上
   */
  renderCardExtra = () => {
    const { item, disableClose, versionRights = {} } = this.props;
    // 非 pro 租户没有删除按钮
    if (!versionRights['SC_MORE_TASK']) return null;
    // 抄送可以删
    if (item.stepType === STEP_TYPE.SEND) {
      return <Icon icon="close" onClick={this.handleDelete} />;
    }
    // 禁用的以及第一条发起状态,不可以删
    // 禁用一般出现原因是, 只剩下最后一条审批
    if (disableClose || item.stepType === STEP_TYPE.START) {
      return null;
    }
    // 其他状态可以删
    return <Icon icon="close" onClick={this.handleDelete} />;
  };
  /**
   * 渲染content
   */
  renderCardContent = () => {
    const { item, taskType } = this.props;
    return this.renderCardContentParticipant(item, taskType);
  };
  /**
   * 渲染content人名
   * @param {Object} data 数据
   * @param {String} taskType 当前任务id的任务类型
   */
  renderCardContentParticipant = (data, taskType) => {
    const { participant = [], stepType } = data;
    if (participant.length === 0) {
      return taskTypeHash[stepType] || taskTypeHash[taskType] || '';
    }
    return participant.reduce((accumulator, item, i) => {
      const pause = i === participant.length - 1 ? '' : '、';
      let itemType = '';
      if (stepType === STEP_TYPE.SEND) {
        itemType = nameTypeHash[item.remark];
      }
      return `${accumulator}${item.name || ''}${
        itemType ? `（${itemType}）` : ''
      }${pause}`;
    }, '');
  };
  /**
   * 渲染card内容的arrow
   */
  renderArrowBox = () => {
    const { item } = this.props;
    return (
      item.stepType !== STEP_TYPE.START && (
        <div className={cs['arrow-box']}>
          <Icon icon="arrow-right" />
        </div>
      )
    );
  };
  /**
   * 关闭事件
   */
  handleDelete = () => {
    const { handleDelete, index } = this.props;
    handleDelete(index);
  };
  /**
   * 编辑事件
   */
  handleEdit = () => {
    const { handleEdit, item, index } = this.props;
    const type = item.stepType;
    if (type === STEP_TYPE.START) {
      return;
    }
    handleEdit({ type: type, operation: 'edit' }, index);
  };
  /**
   * 添加事件
   * @param {String} type 处罚类型
   * @param {Object} e 事件类型
   */
  handleAdd = (type, e) => {
    const { handleEdit, index } = this.props;
    const item = { type, operation: 'add' };
    this.setState(
      {
        tooltipVisible: false
      },
      () => {
        handleEdit(item, index);
      }
    );
  };
  /**
   * tooltip打开事件
   */
  handleOpenTooltip = () => {
    this.setState({
      tooltipVisible: true
    });
  };
  /**
   *  tooltip回掉设置
   */
  handleVisibleChange = tooltipVisible => {
    this.setState({
      tooltipVisible
    });
  };
}

export default class ProcessCardList extends PureComponent {
  stepName = null;
  disableClose = false;
  createStepName = () => {
    const { data = [] } = this.props;
    const stepName = {};
    let stepNum = 0;
    let auditCount = 0;
    data.forEach((item, index) => {
      if (STEP_TYPE.AUDIT === item.stepType) {
        stepName[index] = (
          <FormattedMessage
            id="task.object_setting.step.audit"
            defaultMessage={i18n['task.object_setting.step.audit']}
            values={{ number: ++stepNum }}
          />
        );
        auditCount++;
      } else {
        stepName[index] = i18n['task.object_setting.step.send'];
      }
    });
    if (auditCount <= 1) {
      this.disableClose = true;
    } else {
      this.disableClose = false;
    }
    this.stepName = stepName;
    return this.stepName;
  };
  render() {
    const {
      data = [],
      taskType,
      handleDelete,
      handleEdit,
      versionRights
    } = this.props;
    const stepNameMap = this.createStepName();
    return (
      <div className={cs['process-card-list']}>
        <ProcessCardItem
          item={{ stepType: STEP_TYPE.START }}
          disableClose={true}
          handleEdit={handleEdit}
          versionRights={versionRights}
          index={-1}
        />
        {data.map((item, i) => (
          <ProcessCardItem
            item={item}
            index={i}
            disableClose={this.disableClose}
            stepName={stepNameMap[i]}
            taskType={taskType}
            handleDelete={handleDelete}
            versionRights={versionRights}
            handleEdit={handleEdit}
          />
        ))}
        <div className={cs['process-end']}>
          {i18n['task.object_setting.step.end']}
        </div>
      </div>
    );
  }
}
