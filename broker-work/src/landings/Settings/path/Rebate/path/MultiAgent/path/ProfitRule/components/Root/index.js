import OperateRule from '../OperateRule';
import DetailModal from '../DetailModal';
import ParameterSetting from '../../../../components/ParameterSetting';
import i18n from 'utils/i18n';
import { Table as UiTable, Button, Icon, Message, Tooltip } from 'lean-ui';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContextProvider, DragSource, DropTarget } from 'react-dnd';
const { Td, Th } = UiTable;
import { DEFAULT_PROFIT_RULE, PROFIT_HEADER } from '../../constant';
import cs from './ProfitRuleSetting.less';
import CommonHeader from 'components/v2/CommonHeader';

const content = userList => {
  return (
    <div>
      {userList.length ? (
        <div>
          <p>{i18n['settings.rebate_setting.check_rule.tips_title']}</p>
          <p>
            {userList.map((user, idx) => {
              return [
                idx === 0 ? '' : ', ',
                user.edit ? (
                  <a href={`/usermgmt#/users/${user.userId}`} target="_blank">
                    {user.name}
                  </a>
                ) : (
                  <span>{user.name}</span>
                )
              ];
            })}
          </p>
          <p>{i18n['settings.rebate_setting.check_rule.tips_confirm']}</p>
        </div>
      ) : (
        i18n['general.confirm_remove']
      )}
    </div>
  );
};
// This can be any component you want
function dragDirection(
  dragIndex,
  hoverIndex,
  initialClientOffset,
  clientOffset,
  sourceClientOffset
) {
  const hoverMiddleY = (initialClientOffset.y - sourceClientOffset.y) / 2;
  const hoverClientY = clientOffset.y - sourceClientOffset.y;
  if (dragIndex < hoverIndex && hoverClientY > hoverMiddleY) {
    return 'downward';
  }
  if (dragIndex > hoverIndex && hoverClientY < hoverMiddleY) {
    return 'upward';
  }
}
class BodyRow extends React.Component {
  render() {
    const {
      rowData,
      isOver,
      connectDragSource,
      connectDropTarget,
      moveRow,
      dragRow,
      clientOffset,
      sourceClientOffset,
      initialClientOffset,
      toggleModal,
      showConfirmModal,
      groupList,
      accountList,
      serverGroupList,
      balanceType,
      balanceUnit,
      levelList,
      profitType,
      gotoParamsSetting,
      ...restProps
    } = this.props;
    let className;
    if (isOver && initialClientOffset) {
      const direction = dragDirection(
        dragRow.index,
        restProps.index,
        initialClientOffset,
        clientOffset,
        sourceClientOffset
      );
      if (direction === 'downward') {
        className = 'drop-over-downward';
      }
      if (direction === 'upward') {
        className = 'drop-over-upward';
      }
    }
    const accountContent = !rowData.accountGroups
      ? i18n['settings.rebate_setting.all_account']
      : rowData.accountGroups
          .split(',')
          .map(accountId => {
            return (
              accountList.find(
                account => parseInt(account.id) === parseInt(accountId)
              ).groupName || ''
            );
          })
          .join(', ');
    const serverGroupListContent =
      serverGroupList.length === 1
        ? rowData.mt4Groups[0].groups.length === 0
          ? i18n['settings.rebate_setting.all_group']
          : rowData.mt4Groups[0].groups.join(', ')
        : rowData.mt4Groups
            .filter(group => parseInt(group.groups[0]) !== -1)
            .map(
              (group, idx) =>
                `${group.serverName}: ${
                  group.groups.length === 0
                    ? i18n['settings.rebate_setting.all_group']
                    : group.groups.join(', ')
                }`
            );
    return connectDragSource(
      connectDropTarget(
        <tr className={cs[`${className}`]}>
          <Td>
            <Icon icon="drag" fontType="bw" className={cs['drag-icon']} />
          </Td>
          <Td>
            <div className={cs['ellipsis']} title={rowData && rowData.name}>
              {rowData && rowData.name}
            </div>
          </Td>
          <Td>
            <div className={cs['ellipsis']} title={accountContent}>
              {accountContent}
            </div>
          </Td>
          <Td>
            <div className={cs['ellipsis']} title={serverGroupListContent}>
              {serverGroupListContent &&
              Array.isArray(serverGroupListContent) &&
              serverGroupListContent.length
                ? serverGroupListContent.join('，')
                : serverGroupListContent}
            </div>
          </Td>
          <Td>
            {
              (
                profitType.find(
                  type =>
                    parseInt(type.value) === parseInt(rowData.commissionType)
                ) || {}
              ).label
            }
          </Td>
          <Td>
            <div>
              {
                (
                  balanceUnit.find(
                    unit =>
                      parseInt(unit.value) === parseInt(rowData.balanceType)
                  ) || {}
                ).label
              }
            </div>
          </Td>
          <Td>
            <div>
              {rowData.balanceLevelId !== undefined
                ? (
                    levelList.find(
                      level =>
                        parseInt(level.id) === parseInt(rowData.balanceLevelId)
                    ) || {}
                  ).name
                : ''}
            </div>
          </Td>
          <Td>{rowData.userCount}</Td>
          <Td>
            <div className={cs['options']}>
              <Icon
                icon="edit-outline"
                className={`${cs['btn-right']} main-color`}
                onClick={toggleModal.bind(this, 'Operate', true, rowData)}
              />
              <Tooltip
                trigger="hover"
                placement="left"
                title={
                  <div className={cs['ques-content']}>
                    {i18n['settings.rebate_setting.parameter_setting']}
                  </div>
                }
              >
                <Icon
                  icon="set-outline"
                  className={`${cs['btn-right']} main-color`}
                  onClick={gotoParamsSetting.bind(this, rowData)}
                />
              </Tooltip>
              <Icon
                className={`${cs['btn-right']} main-color`}
                icon="delete-outline"
                onClick={showConfirmModal.bind(this, rowData)}
              />
            </div>
          </Td>
        </tr>
      )
    );
  }
}
const rowSource = {
  beginDrag(props) {
    return {
      index: props.index
    };
  }
};
const rowTarget = {
  drop(props, monitor) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;
    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Time to actually perform the action
    props.moveRow(dragIndex, hoverIndex);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex;
  }
};
const DragableBodyRow = DropTarget('row', rowTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  sourceClientOffset: monitor.getSourceClientOffset()
}))(
  DragSource('row', rowSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    dragRow: monitor.getItem(),
    clientOffset: monitor.getClientOffset(),
    initialClientOffset: monitor.getInitialClientOffset()
  }))(BodyRow)
);

class DragSortingTable extends React.Component {
  // 生成header的部分，排序和特殊处理的header
  renderHeadCell = ({ item, index, fixed }) => {
    return (
      <Th key={index} fixed={fixed}>
        {item.label}
      </Th>
    );
  };
  _moveRow = (dragIndex, hoverIndex) => {
    const { ruleList, changeRulePriority, getRuleList } = this.props;
    let copyData = _.cloneDeep(ruleList);
    const dragRow = ruleList[dragIndex];
    copyData.splice(dragIndex, 1);
    copyData.splice(hoverIndex, 0, dragRow);
    const sortedData = copyData.map((item, index) => ({
      id: item.id,
      priority: index
    }));
    // 进行排序数据请求
    changeRulePriority({
      data: sortedData
    }).then(({ result }) => {
      if (result) {
        // update 数据层
        getRuleList();
      }
    });
  };
  _renderTbody = () => {
    const { ruleList } = this.props;
    return (
      <tbody>
        {ruleList.map((item, index) => {
          return (
            <DragableBodyRow
              rowData={item}
              key={index}
              index={index}
              moveRow={this._moveRow}
              {...this.props}
            />
          );
        })}
      </tbody>
    );
  };
  render() {
    const { ruleList, toggleModal, showConfirmModal } = this.props;
    return (
      <UiTable
        data={ruleList && ruleList}
        columns={PROFIT_HEADER}
        renderTbody={this._renderTbody}
        renderHeadCell={this.renderHeadCell}
        toggleModal={toggleModal}
        showConfirmModal={showConfirmModal}
        {...this.props}
      />
    );
  }
}

export default class ProfitRuleSetting extends PureComponent {
  state = {
    showDetailModal: false,
    showOperateModal: false,
    showParameterModal: false
  };

  componentDidMount() {
    const { getRuleList, getDepositBasicResource } = this.props;

    getDepositBasicResource().then(() => {
      getRuleList();
    });
  }

  toggleModal = (type, toggle, selected = DEFAULT_PROFIT_RULE) => {
    const { selectRule, getRuleDetail } = this.props;

    selectRule(selected);

    if (type === 'Parameter') {
      selected.id && getRuleDetail(selected.id);
    }

    this.setState({
      [`show${type}Modal`]: toggle
    });
  };

  operateRule = rule => {
    const { createRule, updateRule, getRuleList, ruleList } = this.props;
    let isCreate = false;
    const action = !!rule.id ? updateRule : ((isCreate = true), createRule);
    // 添加顺序字段
    if (isCreate) rule.priority = ruleList.length - 1;
    rule.priority = rule.priority > 0 ? rule.priority : 0;

    action(rule).then(res => {
      if (res.result) {
        getRuleList();
      }
      this.toggleModal('Operate', false);
    });
  };

  showConfirmModal = selected => {
    const {
      showTipsModal,
      removeRule,
      getRuleList,
      checkRuleDetail
    } = this.props;

    checkRuleDetail(selected.id).then(({ data }) => {
      showTipsModal({
        content: content(data),
        onConfirm: cb => {
          removeRule(selected.id).then(res => {
            if (res.result) {
              Message.success(
                i18n['settings.rebate_setting.remove_rule_success']
              );
              getRuleList();
            }
            cb();
          });
        }
      });
    });
  };

  onRemoveParameter = id => {
    const {
      showTipsModal,
      removeRuleDetail,
      getRuleDetail,
      selectedRule,
      checkParameter
    } = this.props;

    checkParameter(id).then(({ data }) => {
      showTipsModal({
        content: content(data),
        onConfirm: cb => {
          removeRuleDetail(id).then(res => {
            if (res.result) {
              Message.success(
                i18n['settings.rebate_setting.remove_rule_success']
              );
              getRuleDetail(selectedRule.id);
            }
            cb();
          });
        }
      });
    });
  };

  getLevelList = () => {
    const { levelList, selectedRule } = this.props;
    const endLevelIdx = levelList.findIndex(
      level => parseInt(level.id) === parseInt(selectedRule.balanceLevelId)
    );

    return selectedRule.balanceLevelId
      ? levelList.slice(0, endLevelIdx + 1)
      : levelList;
  };

  onSaveParameter = parameter => {
    const { createRuleDetail, getRuleDetail, selectedRule } = this.props;

    createRuleDetail(parameter).then(res => {
      res.result && getRuleDetail(selectedRule.id);
    });
  };

  onEditParameter = parameter => {
    const { updateRuleDetail, getRuleDetail, selectedRule } = this.props;

    updateRuleDetail(parameter).then(res => {
      res.result && getRuleDetail(selectedRule.id);
    });
  };
  gotoParamsSetting = item => {
    this.props.history.push(
      `/settings/rebate/profitRuleSetting/rebateParams?id=${item.id}`
    );
  };
  render() {
    const {
      ruleList,
      ruleListTime,
      accountList,
      serverGroupList,
      balanceUnit,
      levelList,
      serverSymbols,
      profitType,
      selectedRule,
      ruleDetail,
      ...props
    } = this.props;
    const {
      showOperateModal,
      showDetailModal,
      showParameterModal
    } = this.state;
    const parameterlevelList = this.getLevelList();
    const filteredProfitType = profitType.filter(pro => pro.value != 1);
    return (
      <div className={cs.container}>
        <CommonHeader
          total={ruleList.length}
          time={ruleListTime}
          menus={[
            { value: i18n['page.title.settings'] },
            { value: i18n['settings.left_menu.rebate_setting'] },
            { value: i18n['settings.left_menu.rebate_setting.level_setting'] }
          ]}
          title={
            i18n[
              'settings.left_menu.rebate_setting.sub_menu.profit_rule_setting'
            ]
          }
        >
          {ruleList.length >= 200 ? (
            undefined
          ) : (
            <Button
              type="primary"
              className={`pull-right ${cs['btn-add']}`}
              onClick={this.toggleModal.bind(this, 'Operate', true, undefined)}
            >
              <Icon icon="add-outline" />
              {i18n['settings.rebate_setting.add_rule']}
            </Button>
          )}
        </CommonHeader>
        <DragDropContextProvider backend={HTML5Backend}>
          <DragSortingTable
            data={ruleList}
            {...this.props}
            toggleModal={this.toggleModal}
            showConfirmModal={this.showConfirmModal}
            gotoParamsSetting={this.gotoParamsSetting}
          />
        </DragDropContextProvider>
        {showDetailModal ? (
          <DetailModal
            data={selectedRule}
            show={showDetailModal}
            onHide={this.toggleModal.bind(this, 'Detail', false, undefined)}
          />
        ) : (
          undefined
        )}
        {showOperateModal ? (
          <OperateRule
            data={selectedRule}
            show={showOperateModal}
            ruleList={ruleList}
            accountList={accountList}
            serverGroupList={serverGroupList}
            balanceUnit={balanceUnit}
            levelList={levelList}
            profitType={filteredProfitType}
            onSave={this.operateRule}
            onHide={this.toggleModal.bind(this, 'Operate', false, undefined)}
          />
        ) : (
          undefined
        )}
        {showParameterModal ? (
          <ParameterSetting
            {...props}
            data={ruleDetail}
            selected={selectedRule}
            show={showParameterModal}
            parameterlevelList={parameterlevelList}
            onEdit={this.onEditParameter}
            onSave={this.onSaveParameter}
            onRemove={this.onRemoveParameter}
            onHide={this.toggleModal.bind(this, 'Parameter', false, undefined)}
          />
        ) : (
          undefined
        )}
      </div>
    );
  }
}
