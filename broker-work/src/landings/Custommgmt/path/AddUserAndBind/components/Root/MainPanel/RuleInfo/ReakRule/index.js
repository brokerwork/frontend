import { Field } from 'redux-form';
import i18n from 'utils/i18n';
import { Form } from 'lean-ui';
import { FormControl, InputGroup } from 'react-bootstrap';
import cs from '../../../UpdateUserCard.less';
import { post } from 'utils/ajax';
import Dropdown, { DropdownForCode } from 'components/v2/Dropdown';

const defaultSelect = {
  label: i18n['general.default_select'],
  value: ''
};

const reakSelectField = ({
  onSelect,
  unit,
  ruleId,
  input,
  name,
  disabled,
  options,
  meta: { touched, error }
}) => {
  if (disabled) {
    input.onChange = fn;
  }

  return (
    <Form.Control error={touched && error ? error : null}>
      <InputGroup>
        <DropdownForCode
          {...input}
          onChange={
            onSelect
              ? onSelect.bind(this, input.onChange, ruleId)
              : input.onChange
          }
          disabled={disabled}
          data={options}
          className={`${cs['dropdown-width']} ${
            touched && error ? cs['error'] : ''
          }`}
        />
        <InputGroup.Addon className={cs['unit_class']}>
          {i18n.mcode(unit)}
        </InputGroup.Addon>
      </InputGroup>
    </Form.Control>
  );
};

//下拉选择模式
const selectField = ({
  onSelect,
  input,
  name,
  disabled,
  options,
  meta: { touched, error }
}) => {
  if (disabled) {
    input.onChange = fn;
  }

  return (
    <Form.Control error={touched && error ? error : null}>
      <DropdownForCode
        {...input}
        onChange={
          onSelect ? onSelect.bind(this, input.onChange) : input.onChange
        }
        disabled={disabled}
        data={options}
        defaultSelect
        className={`${cs['dropdown-width']} ${
          touched && error ? cs['error'] : ''
        }`}
      />
    </Form.Control>
  );
};

//下拉搜索模式

// parent部分改成下拉搜索模式
const parentField = ({
  input,
  disabled,
  onSelect,
  defaultValue,
  meta: { touched, error },
  showTopAlert,
  parentSearchLevelId,
  isTask
}) => {
  if (disabled) {
    input.onChange = fn;
  }
  // if (!parentValue && input.value && !touched) {
  //   parentValue = defaultValue;
  // }
  // parent 即时搜索组件 ajax 函数
  function searchParentInputAjax(v) {
    if (!parentSearchLevelId || parentSearchLevelId === '0') {
      showTopAlert({
        content: i18n['account.edit_account.need_return_commission_level']
      });
      return Promise.resolve({
        result: true,
        data: []
      });
    }
    if (!v) {
      return Promise.resolve({
        result: true,
        data: []
      });
    }
    const postUrl = isTask
      ? '/v1/user/task/upper/list/fuzzy'
      : '/v1/user/upper/commission/list/fuzzy';
    return post({
      url: `${postUrl}?type=1&id=${parentSearchLevelId}&includeParent=true`,
      data: {
        fuzzyValue: v
      }
    });
  }
  return (
    <Form.Control error={touched && error ? error : null}>
      <Dropdown
        searchable={true}
        className={cs['dropdown-width']}
        value={defaultValue}
        pipe={searchParentInputAjax}
        handleData={handleParentData}
        error={touched && error}
        disabled={disabled}
        // data={defaultValue ? [defaultValue] : []}
        defaultSelect={defaultSelect}
        onSelect={d => {
          onSelect(input.onChange, d.value, d);
        }}
      />
    </Form.Control>
  );
};

// parent 即时搜索组件 ajax 数据处理
function handleParentData(res) {
  if (!res.result) return Promise.reject(false);
  const data = res.data.map(item => {
    const levelTag = item.levelName ? `(${item.levelName})` : '';
    return {
      label: `${item.name}（${item.entityNo}）${levelTag}`,
      value: item.id
    };
  });

  return Promise.resolve(data);
}

const reakInputField = ({
  input,
  disabled,
  unit,
  meta: { touched, error }
}) => {
  if (disabled) {
    input.onChange = fn;
  }
  return (
    <Form.Control error={touched && error ? error : null}>
      <InputGroup className={touched && error ? cs['inputGroup_error'] : ''}>
        <FormControl
          {...input}
          className={touched && error ? cs['error'] : ''}
          disabled={disabled}
          type="number"
          min={0}
        />
        <InputGroup.Addon className={cs['unit_class']}>
          {i18n.mcode(unit)}
        </InputGroup.Addon>
      </InputGroup>
    </Form.Control>
  );
};

function fn() {}

class ReakRule extends PureComponent {
  constructor(props) {
    super(props);
    const { type, isTask, initLevelInfo } = this.props;
    this.state = {
      showReturnField: false,
      reakDetailIconShow: {},
      reakDetailRuleIdRecord: {},
      commissionInitValues: {},
      showPassword: false,
      parentValue:
        initLevelInfo ||
        (type === 'add' && !isTask ? null : this.getDefaultParent()),
      reakLevel: this.props.editUserInfo.levelId || '0',
      parentSearchLevelId: 0,
      login: {}
    };
  }
  componentDidMount() {
    const {
      editUserInfo,
      type,
      getParents,
      isTask,
      initLevelInfo
    } = this.props;
    if (type === 'add' && !isTask) {
      this.setState({
        parentSearchLevelId: 0,
        parentValue: null
      });
    } else {
      this.setState({
        parentValue: initLevelInfo || this.getDefaultParent(),
        parentSearchLevelId: editUserInfo.levelId || 0
      });
    }
    // const { getLevelByUserId, initialValues } = this.props;
    // if (initialValues.parent && !initialValues.levelId) {
    //   getLevelByUserId(initialValues.parent).then(({ result, data }) => {
    //     if (result) {
    //       getParents(data || 0).then(res => {
    //         this.setState({
    //           parentValue: this.getDefaultParent()
    //         });
    //       });
    //     }
    //   });
    // }
    this.initReakRule();
  }
  componentWillUnmount() {
    const { getLevelByUserId } = this.props;
    getLevelByUserId(); // 清除
  }
  //初始化问号问题
  initReakRule = () => {
    const { upwardForm } = this.props;
    if (upwardForm.length === 0) return;
    const oriQuestion = {};
    const oriRule = {};
    upwardForm.forEach(item => {
      if (!item.detailId) return;
      oriQuestion[item.ruleId] = true;
      oriRule[item.ruleId] = item.detailId;
    });
    this.setState({
      reakDetailIconShow: oriQuestion,
      reakDetailRuleIdRecord: oriRule
    });
  };

  //返佣层级改变后获取上级用户options并同时查询返佣情况
  levelChange = (onChange, e, item) => {
    const {
      getParents,
      change,
      getUpwardReturn,
      initialValues,
      type,
      editUserInfo,
      isTask,
      levelChange
    } = this.props;
    const { parentValue } = this.state;
    const isOnlyInitParent = isTask;
    const parent = isOnlyInitParent ? parentValue : null;
    const { label: levelName, value: levelId } = item;
    const v = e;
    let currentUserInfo = type === 'edit' ? initialValues['id'] : 0;
    if (!!v) {
      Promise.resolve(getParents(v || 0)).then(res => {
        if (res.result) {
          // change('parent', '');
          getUpwardReturn(
            v || 0,
            (parent && parent.value) || 0,
            currentUserInfo,
            {
              levelId,
              levelName,
              parent: (parent && parent.value) || ''
            }
          ).then(receive => {
            if (receive.result) {
              this.changeReakLevel(item);
              if (levelChange) {
                levelChange(item);
              }
            }
            onChange(v);
          });
        }
      });
    } else {
      Promise.resolve(getParents(v || 0)).then(res => {
        if (res.result) {
          // change('parent', '');

          getUpwardReturn(
            v || 0,
            (parent && parent.value) || 0,
            currentUserInfo,
            {
              levelId,
              levelName,
              parent: (parent && parent.value) || ''
            }
          ).then(data => {
            if (data.result) {
              this.changeReakLevel(item);
              if (levelChange) {
                levelChange(item);
              }
            }
            onChange(v);
          });
        }
      });
    }
    this.setState({
      parentValue: parent,
      parentSearchLevelId: v
    });
  };

  getDefaultParent = () => {
    const { initialValues, parentsList, type, isTask } = this.props;
    if (initialValues.parent && (type === 'edit' || isTask)) {
      for (let i = 0; i < parentsList.length; i++) {
        if (`${parentsList[i]['value']}` === `${initialValues.parent}`) {
          return parentsList[i];
        }
      }
    }
    if (type === 'add') return defaultSelect;
    if (!initialValues.parent) return defaultSelect;
  };

  //获取详情
  findDetail = ruleId => {
    const { showDetail, showTopAlert } = this.props;
    const { reakDetailRuleIdRecord } = this.state;
    if (reakDetailRuleIdRecord[ruleId] === '') {
      showTopAlert({
        content: i18n['usermgmt.usercard.reak_alert'],
        bsStyle: 'danger'
      });
    } else {
      showDetail(reakDetailRuleIdRecord[ruleId]);
    }
  };

  //决定展示哪一个问号
  changeRuleDetaiId = (onChange, ruleId, e) => {
    //当选择了新的规则时，就出现问号
    const v = e;
    if (v) {
      this.combineReakDetailIconArray(ruleId, true);
      this.combineReakDetailRuleId(ruleId, v);
    } else {
      this.combineReakDetailIconArray(ruleId, false);
      this.combineReakDetailRuleId(ruleId, '');
    }

    onChange(v);
  };

  //parents改变后需要重新获取返佣规则
  changeParents = (onChange, e, item) => {
    const v = e;
    const {
      getUpwardReturn,
      initialValues,
      type,
      getLevelByUserId
    } = this.props;
    const { reakLevel } = this.state;
    if (type === 'edit') {
      getUpwardReturn(reakLevel, v || 0, initialValues['id'], {
        parent: item.value
      }).then(res => {
        onChange(v);
      });
    } else {
      getUpwardReturn(reakLevel, v || 0, 0, {
        parent: item.value
      }).then(() => {
        onChange(v);
      });
    }
    this.setState({
      parentValue: item
    });
  };

  changeReakLevel = level => {
    const { change, upwardInitvalue } = this.props;
    this.setState(
      {
        reakLevel: level.value || 0,
        reakDetailIconShow: {},
        reakDetailRuleIdRecord: {}
      },
      () => {
        this.initReakRule();
      }
    );
  };

  // 用于更改了层级之后生成新的详情展示入口
  combineReakDetailIconArray = (ruleId, value) => {
    let ori = this.state.reakDetailIconShow;
    this.setState({
      reakDetailIconShow: Object.assign({}, ori, { [ruleId]: value })
    });
  };

  // 用于记录每一条返佣规则的当前选择的ruleId
  combineReakDetailRuleId = (ruleId, value) => {
    let ori = this.state.reakDetailRuleIdRecord;
    this.setState({
      reakDetailRuleIdRecord: Object.assign({}, ori, { [ruleId]: value })
    });
  };

  _renderMenu = (item, index) => {
    const { type, rights, disabled, userDisabled } = this.props;
    const { reakDetailIconShow } = this.state;
    let editDisabled =
      userDisabled ||
      (type === 'add' ? false : disabled || !rights.editCommissionInfo);
    if (item.type === 'select') {
      return (
        <Form.Item col={2} key={index}>
          <Form.Label required={false}>
            {item.label}
            &nbsp;
            {reakDetailIconShow && reakDetailIconShow[item.ruleId] ? (
              <span
                className={`${cs['questionIcon']} main-color`}
                onClick={this.findDetail.bind(this, item.ruleId)}
              >
                <i className="fa fa-question-circle" />
              </span>
            ) : (
              undefined
            )}
            :
          </Form.Label>
          <Field
            name={`${item.ruleId}`}
            ruleId={item.ruleId}
            onSelect={this.changeRuleDetaiId}
            options={item.options}
            unit={item.unit}
            component={reakSelectField}
            disabled={editDisabled}
          />
        </Form.Item>
      );
    } else {
      return (
        <Form.Item col={2} key={index}>
          <Form.Label required={false}>
            {item.label}
            :(
            {i18n['user_setting.reak_rule.parent']}：{item.maxCommissionValue}{' '}
            {i18n.mcode(item.unit)}){' '}
          </Form.Label>
          <Field
            name={`${item.ruleId}`}
            unit={item.unit}
            component={reakInputField}
            disabled={editDisabled}
          />
        </Form.Item>
      );
    }
  };
  render() {
    const {
      upwardForm,
      type,
      parentsList,
      levelList,
      initialValues,
      showReturnField,
      brandInfo,
      rights,
      showTopAlert,
      disabled,
      isTask
    } = this.props;
    const { parentValue, parentSearchLevelId } = this.state;
    let editDisabled =
      disabled || (type === 'add' ? false : !rights.editCommissionInfo);
    return (
      <Form>
        {type === 'add' ? (
          <Form.Item col={2}>
            <Form.Label required={false}>
              {i18n['usermgmt.usercard.level']}:{' '}
            </Form.Label>
            <Field
              name="levelId"
              onSelect={this.levelChange}
              options={levelList}
              disabled={editDisabled}
              component={selectField}
            />
          </Form.Item>
        ) : (
          <Form.Item col={2}>
            <Form.Label required={false}>
              {i18n['usermgmt.usercard.level']}:{' '}
            </Form.Label>
            <Field
              name="levelId"
              onSelect={this.levelChange}
              options={levelList}
              disabled={
                brandInfo['mode'] === 'DISTRIBUTION'
                  ? editDisabled
                  : editDisabled ||
                    (!isTask && initialValues.subUserCount !== 0)
              }
              component={selectField}
            />
          </Form.Item>
        )}
        <Form.Item col={2}>
          <Form.Label required={false}>
            {i18n['usermgmt.usercard.parent']}:{' '}
          </Form.Label>
          <Field
            name="parent"
            onSelect={this.changeParents}
            options={parentsList}
            disabled={editDisabled}
            component={parentField}
            showTopAlert={showTopAlert}
            levelId={initialValues.levelId || 0}
            defaultValue={parentValue}
            parentSearchLevelId={parentSearchLevelId}
            isTask={isTask}
          />
        </Form.Item>
        {upwardForm.length ? upwardForm.map(this._renderMenu) : undefined}
      </Form>
    );
  }
}

export default ReakRule;
