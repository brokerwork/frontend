import { Button, Dialog } from 'lean-ui';
import cs from './UpdateRule.less';
import UpdateRuleForm, { UPDATE_RULE_FORM } from './UpdateRuleForm';
import i18n from 'utils/i18n';
import {
  NOTIFY_TASK_TYPE,
  SCOPE,
  NOTIFY_WAY_TASK_OPTION,
  NOTIFY_WAY
} from '../../constant';

export default class UpdateRule extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedRule: {},
      showSubRange: false,
      showSubTree: false
    };
  }
  componentDidMount() {
    this.setState({
      selectedRule: this.formatEditData()
    });
  }
  onSave = () => {
    const { submitForm } = this.props;
    submitForm(UPDATE_RULE_FORM);
  };

  onSubmit = values => {
    const { setRulesettings, onSave } = this.props;
    const copyData = Object.assign({}, values);
    const copyScope = [];
    values.scope.forEach(item => {
      copyScope.push(item.value);
    });
    copyData['scope'] = copyScope;
    copyData['allSubUser'] = values.allSubUser === 'SubAll';
    // 如果遇到任务处理类型需要转换
    if (values.type === 'TASK_HANDLE') {
      const copyRule = [];
      values.rule.forEach(item => {
        if (typeof item == 'object') {
          copyRule.push(item.value);
        }
      });
      copyData['rule'] = copyRule;
    } else {
      copyData['rule'] = `${values.rule}`;
    }
    onSave(copyData);
  };

  formatEditData = () => {
    const { currentRule, rightScope } = this.props;
    const copyData = Object.assign({}, currentRule);
    const copyScope = [];
    currentRule.scope &&
      currentRule.scope.forEach(item => {
        if (rightScope.find(ob => `${ob.value}` === `${item}`)) {
          copyScope.push(rightScope.find(ob => `${ob.value}` === `${item}`));
        }
      });
    copyData.scope = copyScope;
    copyData.allSubUser = currentRule.allSubUser ? 'SubAll' : 'SubPart';
    this.setState({
      showSubRange: copyData.allSubUser !== undefined
    });
    if (currentRule.type === 'TASK_HANDLE') {
      const copyRule = [];
      if (
        currentRule.rule &&
        currentRule.rule.length > 0 &&
        currentRule.rule[0] !== ''
      ) {
        currentRule.rule &&
          currentRule.rule.forEach(item => {
            const copyItem = NOTIFY_WAY_TASK_OPTION.find(
              ob => ob.value === item
            );
            copyRule.push(copyItem && copyItem);
          });
        copyData['rule'] = copyRule.length > 0 ? copyRule : undefined;
      } else {
        copyData['rule'] === [];
      }
    }
    let notices = this.getFilterNoticeType();
    copyData.noticeType = copyData.noticeType.filter(el => {
      return notices.find(item => item.value === el);
    });
    return copyData;
  };

  onFormChange = values => {
    const { selectedRule } = this.state;
    const showSubRange =
      values.scope &&
      values.scope.filter(item => item.value === 'Sub').length === 1;
    this.setState({
      showSubRange: showSubRange,
      showSubTree: values.allSubUser === 'SubPart'
    });
  };
  // 这里只需要获取相同任务类型的系统noticeType
  getFilterNoticeType = () => {
    const { systemSettings, currentRule } = this.props;
    const systemNoticeType = systemSettings.rules.find(
      ob => ob.type === currentRule.type
    ).noticeType;
    let noticeType = [];
    systemNoticeType.forEach((item, index) => {
      let copyItem = NOTIFY_WAY.find(ob => ob.value === item);
      noticeType.push(copyItem);
    });
    return noticeType;
  };

  render() {
    const { onClose, subUserTree, currentRule, rightScope } = this.props;
    const { selectedRule, showSubRange, showSubTree } = this.state;
    const ruleType = NOTIFY_TASK_TYPE.find(
      ob => `${ob.value}` === `${currentRule.type}`
    ).label;
    const noticeWay = this.getFilterNoticeType();
    return (
      <Dialog
        visible={true}
        onCancel={onClose}
        title={ruleType}
        footer={
          <div>
            <Button type="primary" onClick={this.onSave}>
              {i18n['general.save']}
            </Button>
            <Button onClick={onClose}>{i18n['general.cancel']}</Button>
          </div>
        }
      >
        <UpdateRuleForm
          onSubmit={this.onSubmit}
          initialValues={selectedRule}
          onChange={this.onFormChange}
          subUserTree={subUserTree}
          noticeWay={noticeWay}
          rightScope={rightScope}
          showSubRange={showSubRange}
          showSubTree={showSubTree}
        />
      </Dialog>
    );
  }
}
