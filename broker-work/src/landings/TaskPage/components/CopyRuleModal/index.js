import React from 'react';
import { Dialog, Select } from 'lean-ui';
import { injectReducer } from 'utils/injectReducer';
import { connect } from 'react-redux';
import { actions, reducers } from './control';
import cs from './CopyRuleModal.less';
import i18n from 'utils/i18n';

injectReducer('taskCopyRuleModal', reducers);

class CopyRuleModal extends React.Component {
  state = {
    selectedId: ''
  }
  componentDidMount() {
    const {getRules, type =''} = this.props;
    getRules(type);
  }
  onSubmit = () => {
    const {copyRule} = this.props;
    copyRule(id).then(({result}) => {
      if (result) {
        this.clearState();
      }
    });
  }
  onSelect = (id) => {
    this.setState({
      selectedId: id
    });
  }
  // 用于重置组件和 store 里的参数
  clearState = () => {
    this.setState({
      selectedId: ''
    });
  }

  render() {
    const {title="复制流程设置", rules = []} = this.props;
    return (
      <Dialog
        visible={true}
        title={title}
        onOk={this.onSubmit}
        okText={i18n['general.confirm']}
        cancelText={i18n['general.cancel']}
      >
        <div className={cs.title}>选择流程</div>
        <Select placeholder={'请选择已配置的流程'} onSelect={this.onSelect}>
          {rules.map(item => {
            return (
              <Select.Option value={item.id} key={item.id}>
                {item.name}
              </Select.Option>
            );
          })}
        </Select>
      </Dialog>
    );
  }
}

export default connect(({taskCopyRuleModal}) => {
    const keys = Object.keys(reducers);
    const props = {};
    keys.forEach(k => {
      props[k] = taskCopyRuleModal[k];
    });
    return props;
}, actions)(CopyRuleModal);

