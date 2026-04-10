import { reduxForm, Field } from 'redux-form';
import { renderField, required } from 'utils/renderField';
import Modal from 'components/Modal';
import Dropdown from 'components/Dropdown';
import NumberInput from 'components/NumberInput';
import Button from 'components/Button';
import Checkbox from 'components/Checkbox';
import Tips from 'components/Tips';
import i18n from 'utils/i18n';
import { FormattedMessage } from 'react-intl';
import cs from './styles.less';

// 平级返佣以及越级返佣配置
const ConditionForm = (({levelList, awardEqualLevels, awardBigLevels, onChange, errorMsg, levelValues, balanceType}) => {
  return (
    <div className={cs['conditionFormContainer']}>
      <table className={cs['formTable']}>
        <tbody>
          <tr>
            <td />
            <td colSpan='2' className={cs['conditionTitle']}>
              {i18n[`settings.rebate_setting.distribution.con_level_reward`]}
            </td>
            <td className={cs['conditionFormSplit']}/>
            <td colSpan='2' className={cs['conditionTitle']}>
              {i18n[`settings.rebate_setting.distribution.jump_level_reward`]}
            </td>
            <td/>
          </tr>
          <tr>
            <td />
            <td colSpan='2' className={cs['conditionExplain']}>
              {i18n[`settings.rebate_setting.distribution.con_level_reward_explain`]}
            </td>
            <td/>
            <td colSpan='2' className={cs['conditionExplain']}>
              {i18n[`settings.rebate_setting.distribution.jump_level_reward_explain`]}
            </td>
            <td/>
          </tr>
          {levelList.map(({ name, id }, index) => {
            const eR = awardEqualLevels.find(re=>re.levelId == id) || {};
            const bR = awardBigLevels.find(re=>re.levelId == id) || {};
            return (
              <tr key={id}>
                <td className={cs['label']}>{name}: </td>
                <td>
                  <NumberInput
                    onChange={onChange.bind(this, id, 'awardEqualLevels')}
                    decimal="{0,3}"
                    value={eR.value}
                    className={`${cs['field']}`}
                  />
                </td>
                <td> %</td>
                <td/>
                <td>
                  <NumberInput
                    onChange={onChange.bind(this, id, 'awardBigLevels')}
                    decimal="{0,3}"
                    value={bR.value}
                    className={`${cs['field']}`}
                  />
                </td>
                <td> %</td>
                <td/>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  )
})

const defaultSelect = {
  label: i18n['general.default_select'],
  value: undefined
};
// 返佣层级单独配置部分
const LevelForm = ({
  levelList, data, onChange, errorMsg, levelValues, balanceType, commissionTypeList,
}) => {
  return (
    <div className={cs['levelFormContainer']}>
      <table className={cs['formTable']}>
        <tbody>
          <tr>
            <td />
            {levelValues.map((item, index) => {
              return (
                [
                  <td key={index} className={cs['conditionTitle']}>
                    {i18n[`settings.rebate_setting.distribution.cyleLevel${index}`]}
                  </td>,
                  <td/>,
                  levelValues.length == 1 ? (<td/>) : null
                ]
              );
            })}
          </tr>
          {levelList.map(({ name, id }, index) => {
            const item = data[id] || {};
            return (
              <tr key={index}>
                <td className={cs['label']}>{name}: </td>
                {levelValues.map((valueKey, i) => {
                  return (
                    [

                      (()=>{
                        let comType = null;
                        if(valueKey === 'value'){
                          return (
                            <td key={i} className={`${cs['field-td']}`}>
                              <NumberInput
                                onChange={onChange.bind(this, id, valueKey)}
                                decimal="{0,3}"
                                value={item[valueKey]}
                                className={`${cs['field']} ${errorMsg.has(
                                  `${id}_${valueKey}`
                                )
                                  ? cs['fieldErr']
                                  : ''}`}
                              />
                            </td>
                          )
                        } else if(valueKey === 'value1'){
                          comType = 'commissionType1';
                        } else if(valueKey === 'value2'){
                          comType = 'commissionType2';
                        }
                        if(comType !== null) return (
                          <td key={i} className={`${cs['dropdown-td']}`}>
                            <Dropdown
                              className={cs['dropdown']}
                              data={commissionTypeList}
                              value={commissionTypeList.filter(type=>type.value == item[comType])[0]}
                              onSelect={onChange.bind(this, id, comType)}
                              defaultSelect
                              renderMenuItem={(item)=>{
                                return (<div>
                                  <span>{item.label}</span>
                                  {item.value == '2' || item.value == '3' ? (
                                    <Tips className={cs['tips']}>
                                      <p className={cs['text']}>
                                        {i18n['setting.rebate_setting.distribution.tips.title']}
                                      </p>
                                      <p className={cs['text']}>
                                        {item.value == '2'
                                          ? i18n[
                                              'setting.rebate_setting.distribution.incremental.tips'
                                            ]
                                          : i18n[
                                              'setting.rebate_setting.distribution.divided.tips'
                                            ]}
                                      </p>
                                    </Tips>
                                  ) : (
                                    undefined
                                  )}
                                </div>)
                              }}
                            />
                          </td>
                        );
                      })(),
                      (()=>{
                        if(valueKey === 'value'){
                          return (
                            <td className={`${cs['field-unit-td']}`}>
                              {
                                balanceType.label
                              }
                            </td>
                          )
                        } else {
                          return (<td>
                            {
                              ((isLevel2, type)=>{
                                type = isLevel2 ? item['commissionType1'] : item['commissionType2'];
                                return type > 0 ? (
                                  <div className={`${cs['field-group']}`}>
                                    <NumberInput
                                      onChange={onChange.bind(this, id, valueKey)}
                                      nonDecimal="{0,3}"
                                      decimal="{0,3}"
                                      value={item[valueKey]}
                                      className={`${cs['field-small']} ${errorMsg.has(
                                        `${id}_${valueKey}`
                                      )
                                        ? cs['fieldErr']
                                        : ''}`}
                                    />
                                    <span>
                                      {type > 1 ? '%' : `${balanceType.label}/手`}
                                    </span>
                                  </div>
                                ) : null;
                              })(valueKey === 'value1')
                            }
                          </td>)
                        }
                      })()
                    ]
                  );
                })}
              </tr>
            );
          })}
          {errorMsg.has('levels') && (
            <tr>
              <td />
              {levelValues.map((valueKey, i) => {
                return valueKey === 'value' ? (
                  [
                    <td key={i} className={cs['errorMsg']}>{errorMsg.get('levels')}</td>,
                    <td/>
                  ]
                ) : (
                    [
                      <td/>,
                      <td key={i} className={cs['errorMsg']}>{errorMsg.get('level'+valueKey)}</td>
                    ]
                );
              })}
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

// 跳过层级不返佣部分
const SkipLevel = ({ levelList, onChange, skip, skip_levels, errorMsg }) => {
  const isSkip = Boolean(skip);
  return (
    <div className={cs['skipLevel']}>
      <div className={cs['skipLevelTitle']}>
        <Checkbox
          onChange={onChange.bind(this, 'skip', null)}
          checked={isSkip}
          className={cs['skipLevelSwitch']}
        >
          {i18n['settings.rebate_setting.distribution.skipLevelTitle']}
        </Checkbox>
        <Tips className={cs['tips']}>
          <div>
            {i18n['settings.rebate_setting.distribution.skipLevelTipsP1']}
          </div>
          <div>
            {i18n['settings.rebate_setting.distribution.skipLevelTipsP2']}
          </div>
        </Tips>
      </div>
      <div>
        {isSkip &&
          levelList.map(({ name, id }, index) => {
            return (
              <Checkbox
                inline
                onChange={onChange.bind(this, 'skip_levels', id)}
                key={index}
                checked={skip_levels.has(id)}
                className={cs['skipLevelItem']}
              >
                {name}
              </Checkbox>
            );
          })}
      </div>
      {errorMsg.has('skip') && (
        <div className={cs['errorMsg']}>{errorMsg.get('skip')}</div>
      )}
    </div>
  );
};

class DistributionParameterSetting2 extends PureComponent {
  constructor(props) {
    super(props);
    // 预先构造返佣层级中的值，即使为空，确保NunberInput组件工作正常
    // 同时也可以方便做error验证
    const { levelList, selectedRule: { cycleLevel } } = props;
    const levels = {},
          // 平级奖励
          awardEqualLevels = [],
          // 越级奖励
          awardBigLevels = [];
    this.levelValues = [];
    for (let i = 0, l = cycleLevel; i < l; i++) {
      const key = i > 0 ? i : '';
      this.levelValues.push(`value${key}`);
    }
    levelList.forEach(({ id }) => {
      levels[id] = {};
      // 格式化奖励数据格式
      awardEqualLevels.push({
        levelId: id,
        value: ''
      })
      awardBigLevels.push({
        levelId: id,
        value: ''
      })
      this.levelValues.forEach((item,i) => {
        const key = i > 0 ? i : '';
        levels[id][item] = '';
        if(key !== ''){
          levels[id]['commissionType' + i] = '';
        }
      });
    });
    // 记录最初是否跳过返佣的状态
    this.defaultSkipState = 0;
    this.state = {
      levels,
      skip: 0,
      skip_levels: new Set(),
      errorMsg: new Map(),
      awardEqualLevels,
      awardBigLevels
    };
  }
  componentDidMount() {
    const { getRuleDetail, selectedRule = {} } = this.props;
    const { id } = selectedRule;
    getRuleDetail(id).then(res => {
      const { result, data } = res;
      if (!result || !data[0]) return;
      const stateLevelsBase = this.state.levels;
      const stateLevels = Object.assign({}, stateLevelsBase);
      const { levels, skipLevels, skip, awardEqualLevels = [], awardBigLevels = [] } = data[0];
      if (Array.isArray(levels)) {
        levels.forEach(item => {
          const stateLevelsItem = stateLevels[item.levelId];
          if (!stateLevelsItem) return;
          for (let k in stateLevelsItem) {
            stateLevelsItem[k] = item[k];
          }
        });
      }
      // 记录最初是否跳过返佣的状态
      this.defaultSkipState = skip;
      this.setState({
        levels: stateLevels,
        skip,
        skip_levels: new Set(skipLevels || []),
        awardEqualLevels: awardEqualLevels.length && awardEqualLevels.length > 0 ? awardEqualLevels : this.state.awardEqualLevels,
        awardBigLevels: awardBigLevels.length && awardBigLevels.length > 0 ? awardBigLevels : this.state.awardBigLevels
      });
    });
  }
  onRewardChange = (id, type, value ) => {
    const targetReward = [].concat(this.state[type]);
    const rewardObj = targetReward.find(reward=>reward.levelId == id);
    rewardObj.value = value;
    this.setState({
      [type]: targetReward
    });
  }
  onLevelChange = (id, field, value) => {
    const { levels } = this.state;
    const levelsObj = Object.assign({}, levels);
    const state = levels[id];
    // 处理CommissionType的变化，并且联动对应的值进行重置
    if(typeof value == 'object'){
      if(state[field] !== value.value){
        if(field == 'commissionType1') {
          state['value1'] = '';
        } else if(field == 'commissionType2'){
          state['value2'] = '';
        }
      }
      // 比较后进行更新
      state[field] = value.value;
    } else state[field] = value;
    levelsObj[id] = state;
    this.setState({
      levels: levelsObj
    });
  };
  onSkipLevelChange = (field, id, e) => {
    const v = e.target.checked;
    const state = {};
    if (field === 'skip') {
      state[field] = Number(v);
    } else if (field === 'skip_levels') {
      const { skip_levels } = this.state;
      const slSet = new Set(skip_levels);
      if (v) {
        slSet.add(id);
      } else {
        slSet.delete(id);
      }
      state[field] = slSet;
    }
    this.setState(state);
  };
  validate = () => {
    const { levelList } = this.props;
    const { skip, skip_levels, levels } = this.state;
    // 验证
    const skipLevelsLength = skip_levels.size;
    const variablesLevelsSize = levelList.length;
    const errorMsg = new Map();

    // 返佣层级验证
    if (skip) {
      if (skipLevelsLength === 0) {
        errorMsg.set(
          'skip',
          i18n['settings.rebate_setting.distribution.leveleError.moreThanOne']
        );
      }
      if (skipLevelsLength >= variablesLevelsSize) {
        errorMsg.set(
          'skip',
          i18n['settings.rebate_setting.distribution.leveleError.notAll']
        );
      }
    }
    // 返佣值验证 -> 不能为空
    let levelError = false;
    for (let k in levels) {
      let item = levels[k];
      for (let sk in item) {
        if (sk == 'value' && !item[sk]) {
          levelError = true;
          errorMsg.set(
            'levels',
            i18n['settings.rebate_setting.distribution.leveleError.notNull']
          );
          errorMsg.set(`${k}_${sk}`, true);
        } else if((sk == 'value1' && item['commissionType1'] > 1 && Number(item[sk]) > 100) || (sk == 'value2' && item['commissionType2'] > 1 && Number(item[sk]) > 100)){
          levelError = true;
          errorMsg.set(
            'level' + sk,
            i18n['settings.rebate_setting.distribution.leveleError.overRange']
          );
          errorMsg.set(`${k}_${sk}`, true);
        }
      }
    }
    return errorMsg;
  };
  skipStatusCheck = () => {
    const { showTipsModal } = this.props;
    const { skip } = this.state;
    if (this.defaultSkipState === 1 && skip === 0) {
      showTipsModal({
        header:
          i18n['settings.rebate_setting.distribution.skipConfirm.content'],
        content: i18n['settings.rebate_setting.distribution.skipConfirm.title'],
        onConfirm: cb => {
          cb();
          this.onSubmit();
        }
      });
      return;
    }
    this.onSubmit();
  };
  onSubmit = () => {
    const { updateRuleDetail, selectedRule = {}, onHide } = this.props;
    const { skip, skip_levels, levels, awardEqualLevels, awardBigLevels } = this.state;
    const errorMsg = this.validate();
    if (errorMsg.size > 0) {
      this.setState({ errorMsg });
      return;
    }
    const levelsArray = [];
    for (let k in levels) {
      levelsArray.push({
        ...levels[k],
        levelId: k
      });
    }
    const data = {
      ruleType: 4,
      ruleId: selectedRule.id,
      skip,
      skip_levels: skip !== 0 ? Array.from(skip_levels) : [],
      levels: levelsArray,
      awardEqualLevels,
      awardBigLevels
    };
    console.info(data);//return;
    updateRuleDetail(data).then(res => {
      if (res.result) {
        onHide();
      }
    });
  };
  render() {
    const { levelList, onHide, selectedRule = {}, balanceType, distributionCommissionTypeList, distributionPipCommissionTypeList } = this.props;
    const { levels, skip, skip_levels, errorMsg, awardEqualLevels, awardBigLevels } = this.state;
    const ruleName = selectedRule.name;
    const commissionTypeList = balanceType.value === 2 ? distributionPipCommissionTypeList : distributionCommissionTypeList;
    return (
      <Modal show={true} bsSize='large'>
        <Modal.Header>
          <FormattedMessage
            id="settings.rebate_setting.distribution.levelsTitle"
            defaultMessage={
              i18n['settings.rebate_setting.distribution.levelsTitle']
            }
            values={{ ruleName }}
          />
        </Modal.Header>
        <Modal.Body>
          <LevelForm
            onChange={this.onLevelChange}
            data={levels}
            levelValues={this.levelValues}
            errorMsg={errorMsg}
            levelList={levelList}
            balanceType={balanceType}
            commissionTypeList={commissionTypeList}
          />
          <ConditionForm
            onChange={this.onRewardChange}
            awardEqualLevels={awardEqualLevels}
            awardBigLevels={awardBigLevels}
            levelValues={this.levelValues}
            errorMsg={errorMsg}
            levelList={levelList}
            balanceType={balanceType}
          />
          <SkipLevel
            onChange={this.onSkipLevelChange}
            skip={skip}
            skip_levels={skip_levels}
            errorMsg={errorMsg}
            levelList={levelList}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.skipStatusCheck} bsStyle="primary">
            {i18n['general.save']}
          </Button>
          <Button onClick={onHide} bsStyle="default">
            {i18n['general.cancel']}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default DistributionParameterSetting2;
