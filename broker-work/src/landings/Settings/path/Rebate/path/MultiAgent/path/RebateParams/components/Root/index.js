import CommonHeader from 'components/v2/CommonHeader';
import { Button, Icon, Message } from 'lean-ui';
import i18n from 'utils/i18n';
import ParamsList from '../ParamsList';
import AddParamsModal from '../AddParamsModal';
import CycleSettingModal from '../CycleSettingModal';
import SetParamsModal from '../SetParamsModal';
import queryString from 'utils/queryString';
import cs from './index.less';
import NoticeBar from 'components/v2/NoticeBar';
import moment from 'moment';
import _ from 'lodash';
const proRightKey = 'SYSTEM_REBATE_AUTO-ADJUST';

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
export default class RebateParams extends PureComponent {
  constructor(props) {
    super(props);
    const balanceLevelId = queryString(location.search).get('balanceLevelId');
    this.state = {
      balanceLevelId,
      addParamsVisible: false,
      setParamsVisible: false,
      cycleSettingVisible: false,
      editData: null,
      type: 'add',
      editConditionData: null,
      updateTime: ''
    };
  }
  componentDidMount() {
    const {
      getBasicResource,
      getDepositBasicResource,
      getRuleList,
      getRuleDetail,
      match: { params },
      location: { search },
      getRealTimeStatus
    } = this.props;
    const basicResourceFilter = [
      'transactionRuleSetting',
      'feeReturnsRuleSetting'
    ];
    const depositBasicResourceFilter = [
      'depositRuleSetting',
      'profitRuleSetting'
    ];
    // Message.info(i18n['settings.rebate_setting.list.notice'], {
    //   closable: true
    // });
    if (basicResourceFilter.includes(params.rebateType)) {
      getBasicResource();
    } else if (depositBasicResourceFilter.includes(params.rebateType)) {
      getDepositBasicResource();
    }
    const id = queryString(search).get('id');
    getRuleList(id).then(res => {
      if (res.result) {
        this.setState({
          updateTime: res.time
        });
      }
    });
    getRuleDetail(id);
    getRealTimeStatus();
  }
  getLevelList = () => {
    const { levelList, ruleDetail } = this.props;
    if (ruleDetail.balanceLevelId) {
      const endLevelIdx = levelList.findIndex(
        level => parseInt(level.id) === parseInt(ruleDetail.balanceLevelId)
      );
      return levelList.slice(0, endLevelIdx + 1);
    }
    return levelList;
  };
  isModalVisible = (modal, visible) => {
    this.setState({
      [modal]: visible
    });
  };
  onSaveParameter = (parameter, type = 'add') => {
    const {
      createRuleDetail,
      getRuleList,
      updateRuleDetail,
      ruleDetail,
      ruleList
    } = this.props;
    let submitAction = createRuleDetail;
    if (type === 'edit') {
      submitAction = updateRuleDetail;
    }
    // 比较是否有两个相同的参数
    // 新增比较所有， 编辑比较除编辑这一条的其他所有
    let copylevelIdValues = ruleList.map(item => {
      return {
        levelIdValues: item.levelIdValues.map(le => ({
          levelId: le.levelId,
          value: le.value
        }))
      };
    });
    if (type === 'edit') {
      copylevelIdValues = ruleList
        .filter(rule => rule.id !== parameter.id)
        .map(item => {
          return {
            levelIdValues: item.levelIdValues.map(le => ({
              levelId: le.levelId,
              value: le.value
            }))
          };
        });
    }
    const parameterLevelIdValues = _.cloneDeep(parameter).levelIdValues.map(
      item => {
        if (typeof item.value === 'number') {
          item.value = item.value.toString();
        }
        if (typeof item.levelId === 'number') {
          item.levelId = item.levelId.toString();
        }
        return {
          levelId: item.levelId,
          value: item.value
        };
      }
    );
    const isSame = copylevelIdValues.some(item =>
      _.isEqual(item.levelIdValues, parameterLevelIdValues)
    );
    if (isSame) {
      Message.info(
        i18n['settings.rebate_setting.params_setting.sameParams.tips']
      );
      return;
    }
    if (type === 'edit') {
      return submitAction(parameter);
    }
    submitAction(parameter).then(res => {
      if (res.result) {
        this.isModalVisible('addParamsVisible', false);
        getRuleList(ruleDetail.id);
      }
    });
  };
  openEditModal = editData => {
    this.setState({
      editData,
      type: 'edit'
    });
    this.isModalVisible('addParamsVisible', true);
  };
  openAddModal = () => {
    this.setState({
      type: 'add'
    });
    this.isModalVisible('addParamsVisible', true);
  };
  onRemoveParameter = id => {
    const {
      showTipsModal,
      removeRuleDetail,
      getRuleList,
      checkParameter,
      ruleDetail
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
              getRuleList(ruleDetail.id);
            }
            cb();
          });
        }
      });
    });
  };
  openConditionSetting = item => {
    this.setState({
      editConditionData: item
    });
    this.isModalVisible('setParamsVisible', true);
  };
  openCycleModal = () => {
    const { showTipsModal, ruleList } = this.props;
    const isConditionExcist = ruleList.some(rule => rule.param);
    if (isConditionExcist) {
      this.isModalVisible('cycleSettingVisible', true);
    } else {
      showTipsModal({
        content: i18n['settings.rebate_setting.params_setting.cycle_tips'],
        onConfirm: cb => {
          cb();
        }
      });
    }
  };
  headerMenus = (params, name) => {
    return [
      {
        url: `/settings/rebate/${params.rebateType}`,
        value:
          i18n[`settings.rebate_setting.params_setting.${params.rebateType}`]
      },
      {
        url: '',
        value: name
      }
    ];
  };
  render() {
    const {
      ruleList,
      isPercentRule,
      changeRuleParamsPriority,
      adjustPeriod,
      setCondition,
      getRuleList,
      ruleDetail,
      getRuleDetail,
      showTipsModal,
      match: { params },
      location: { search },
      userRights,
      realTimeStatus
    } = this.props;
    const {
      addParamsVisible,
      cycleSettingVisible,
      setParamsVisible,
      editData,
      type,
      editConditionData,
      updateTime,
      balanceLevelId
    } = this.state;
    const parameterlevelList = this.getLevelList();
    return (
      <div className={cs.container}>
        {userRights[proRightKey] && !balanceLevelId ? (
          <NoticeBar>
            <span>{i18n['settings.rebate_setting.list.notice']}</span>
          </NoticeBar>
        ) : null}
        <CommonHeader
          total={ruleList.length}
          time={moment(updateTime).format('YYYY-MM-DD HH:mm')}
          title={i18n['settings.rebate_setting.parameter_setting']}
          menus={this.headerMenus(params, ruleDetail.name)}
        >
          <div className={cs.title_btn}>
            <div className={cs.add_params_btn}>
              <Button
                type="primary"
                className={cs.mar_bottom}
                onClick={this.openAddModal}
              >
                <Icon icon="add-outline" />
                {i18n['settings.rebate_setting.add_parameter']}
              </Button>
            </div>
            {userRights[proRightKey] &&
            !balanceLevelId &&
            params.rebateType === 'transactionRuleSetting' ? (
              <Button onClick={this.openCycleModal}>
                {i18n['settings.rebate_setting.params_setting.cycle_setting']}
              </Button>
            ) : null}
          </div>
        </CommonHeader>

        {ruleList && ruleList.length ? (
          <ParamsList
            data={ruleList}
            parameterlevelList={parameterlevelList}
            selected={ruleDetail}
            isPercentRule={isPercentRule}
            openEditModal={this.openEditModal}
            changeRuleParamsPriority={changeRuleParamsPriority}
            onRemove={this.onRemoveParameter}
            isModalVisible={this.isModalVisible}
            openConditionSetting={this.openConditionSetting}
            getRuleList={getRuleList}
            getRuleDetail={getRuleDetail}
            params={params}
            autoAjustRight={userRights[proRightKey]}
            balanceLevelId={balanceLevelId}
            onSave={this.onSaveParameter}
          />
        ) : null}
        <AddParamsModal
          onHide={this.isModalVisible.bind(this, 'addParamsVisible', false)}
          parameterlevelList={parameterlevelList}
          isPercentRule={isPercentRule}
          selected={ruleDetail}
          data={ruleList}
          onSave={this.onSaveParameter}
          show={addParamsVisible}
          editData={editData}
          type={type}
          autoAjustRight={userRights[proRightKey]}
        />
        <CycleSettingModal
          onHide={this.isModalVisible.bind(this, 'cycleSettingVisible', false)}
          show={cycleSettingVisible}
          adjustPeriod={adjustPeriod}
          ruleDetail={ruleDetail}
          getRuleDetail={getRuleDetail}
          showTipsModal={showTipsModal}
          realTimeStatus={realTimeStatus}
        />
        <SetParamsModal
          onHide={this.isModalVisible.bind(this, 'setParamsVisible', false)}
          show={setParamsVisible}
          setCondition={setCondition}
          editConditionData={editConditionData}
          getRuleList={getRuleList}
          ruleDetail={ruleDetail}
        />
      </div>
    );
  }
}
